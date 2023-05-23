/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITelemetryLogger } from "@fluidframework/common-definitions";
import { assert } from "@fluidframework/common-utils";
import {
	FinalCompressedId,
	IIdCompressor,
	IIdCompressorCore,
	IIdCompressorFactory,
	LocalCompressedId,
	SerializedIdCompressorWithNoSession,
	SerializedIdCompressorWithOngoingSession,
	SerializedLocalState,
	SessionId,
	UnackedLocalId,
} from "@fluidframework/runtime-definitions";
import {
	FinalizedOverride,
	IdCluster,
	IdCompressor,
	Session,
	UnifiedOverride,
	deserializeCluster,
	hasOngoingSession,
} from "./idCompressor";
import { incrementUuid, stableIdFromNumericUuid } from "./numericUuid";
import { SessionIdNormalizer } from "./sessionIdNormalizer";
import { Mutable, setPropertyIfDefined, fail } from "./utils";

/* eslint-disable @typescript-eslint/restrict-plus-operands */

export class IdCompressorFactory implements IIdCompressorFactory {
	public create(localSessionId: SessionId, logger?: ITelemetryLogger) {
		return new IdCompressor(localSessionId, logger);
	}

	/**
	 * Deserialize an serialized IdCompressor that is part of an ongoing session, thereby resuming that session.
	 */
	public deserialize(
		serialized: SerializedIdCompressorWithOngoingSession,
	): IIdCompressor & IIdCompressorCore;

	/**
	 * Deserialize a serialized IdCompressor with a new session.
	 * @param serialized - the serialized compressor state
	 * @param newSessionId - the session ID for the new compressor.
	 */
	public deserialize(
		serialized: SerializedIdCompressorWithNoSession,
		newSessionId: SessionId,
	): IIdCompressor & IIdCompressorCore;

	public deserialize(
		...args:
			| [serialized: SerializedIdCompressorWithNoSession, newSessionIdMaybe: SessionId]
			| [serialized: SerializedIdCompressorWithOngoingSession, newSessionIdMaybe?: undefined]
	): IIdCompressor & IIdCompressorCore {
		const [serialized, newSessionIdMaybe] = args;

		const {
			clusterCapacity,
			sessions: serializedSessions,
			clusters: serializedClusters,
		} = serialized;

		let localSessionId: SessionId;
		let serializedLocalState: SerializedLocalState | undefined;
		if (newSessionIdMaybe === undefined) {
			// Alias of serialized, but known to be a SerializedIdCompressorWithOngoingSession
			const [serializedWithSession] = args;
			const serializedSessionData =
				serializedSessions[serializedWithSession.localSessionIndex];
			localSessionId = serializedSessionData[0];
			serializedLocalState = serializedWithSession.localState;
		} else {
			localSessionId = newSessionIdMaybe;
		}

		const compressor = new IdCompressor(localSessionId);
		compressor.clusterCapacity = clusterCapacity;

		const localOverridesInverse = new Map<string, LocalCompressedId>();
		if (serializedLocalState !== undefined) {
			// Do this part of local rehydration first since the cluster map population needs to query to local overrides
			compressor.localIdCount = serializedLocalState.localIdCount;
			compressor.lastTakenLocalId = serializedLocalState.lastTakenLocalId;
			if (serializedLocalState.overrides !== undefined) {
				for (const [localId, override] of serializedLocalState.overrides) {
					compressor.localOverrides.append(localId, override);
					localOverridesInverse.set(override, localId);
					compressor.clustersAndOverridesInversion.set(
						IdCompressor.createInversionKey(override),
						localId as UnackedLocalId,
					);
				}
			}
		}

		const sessionInfos: {
			readonly session: Session;
			readonly sessionId: SessionId;
		}[] = [];
		for (const serializedSession of serializedSessions) {
			const [sessionId] = serializedSession;
			if (sessionId === localSessionId) {
				assert(hasOngoingSession(serialized), 0x499 /* Cannot resume existing session. */);
				sessionInfos.push({ session: compressor.localSession, sessionId });
			} else {
				const session = compressor.createSession(sessionId);
				sessionInfos.push({ session, sessionId });
			}
		}

		for (const serializedCluster of serializedClusters) {
			const { sessionIndex, capacity, count, overrides } =
				deserializeCluster(serializedCluster);
			const { session, sessionId } = sessionInfos[sessionIndex];
			const { lastFinalizedLocalId, sessionUuid } = session;
			const currentIdCount = lastFinalizedLocalId === undefined ? 0 : -lastFinalizedLocalId;

			const cluster: Mutable<IdCluster> = {
				capacity,
				count,
				baseUuid: incrementUuid(sessionUuid, currentIdCount),
				session,
			};

			const lastFinalizedNormalized = lastFinalizedLocalId ?? 0;
			const clusterBase = compressor.nextClusterBaseFinalId;

			session.lastFinalizedLocalId = (lastFinalizedNormalized - count) as LocalCompressedId;
			session.currentClusterDetails = { clusterBase, cluster };
			compressor.nextClusterBaseFinalId = (compressor.nextClusterBaseFinalId +
				capacity) as FinalCompressedId;
			compressor.finalIdToCluster.append(clusterBase, cluster);
			compressor.clustersAndOverridesInversion.set(
				stableIdFromNumericUuid(cluster.baseUuid),
				{
					clusterBase,
					cluster,
				},
			);

			if (overrides !== undefined) {
				cluster.overrides = new Map();
				for (const [finalIdIndex, override, originalOverridingFinal] of overrides) {
					const finalId = (clusterBase + finalIdIndex) as FinalCompressedId;
					if (originalOverridingFinal !== undefined) {
						const unifiedOverride: Mutable<UnifiedOverride> = {
							override,
							originalOverridingFinal,
						};
						if (serializedLocalState !== undefined) {
							setPropertyIfDefined(
								localOverridesInverse.get(override),
								unifiedOverride,
								"associatedLocalId",
							);
						}
						cluster.overrides.set(finalId, unifiedOverride);
					} else {
						const associatedLocal = localOverridesInverse.get(override);
						if (associatedLocal !== undefined && sessionId !== localSessionId) {
							// In this case, there is a local ID associated with this override, but this is the first cluster to contain
							// that override (because only the first cluster will have the string serialized). In this case, the override
							// needs to hold that local value.
							cluster.overrides.set(finalId, {
								override,
								originalOverridingFinal: finalId,
								associatedLocalId: associatedLocal,
							});
						} else {
							cluster.overrides.set(finalId, override);
						}
						const finalizedOverride: Mutable<FinalizedOverride> = {
							cluster,
							originalOverridingFinal: finalId,
						};
						if (serializedLocalState !== undefined) {
							setPropertyIfDefined(
								associatedLocal,
								finalizedOverride,
								"associatedLocalId",
							);
						}
						compressor.clustersAndOverridesInversion.set(
							IdCompressor.createInversionKey(override),
							finalizedOverride,
						);
					}
				}
			}
		}

		if (serializedLocalState !== undefined) {
			compressor.sessionIdNormalizer = SessionIdNormalizer.deserialize(
				serializedLocalState.sessionNormalizer,
				(finalId) => {
					const [_, cluster] =
						compressor.finalIdToCluster.getPairOrNextLower(finalId) ??
						fail("Final in serialized normalizer was never created.");
					return cluster;
				},
			);
		}

		assert(
			compressor.localSession.lastFinalizedLocalId === undefined ||
				compressor.localIdCount >= -compressor.localSession.lastFinalizedLocalId,
			0x49a /* Inconsistent last finalized state when deserializing */,
		);

		return compressor;
	}
}
