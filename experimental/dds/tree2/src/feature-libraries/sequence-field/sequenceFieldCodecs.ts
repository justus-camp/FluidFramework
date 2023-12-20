/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { SessionId } from "@fluidframework/id-compressor";
import { unreachableCase } from "@fluidframework/core-utils";
import { TAnySchema, Type } from "@sinclair/typebox";
import { JsonCompatibleReadOnly, Mutable, fail } from "../../util";
import { DiscriminatedUnionDispatcher, SessionAwareCodec, makeCodecFamily } from "../../codec";
import { EncodedRevisionTag, RevisionTag } from "../../core";
import { makeChangeAtomIdCodec } from "../changeAtomIdCodec";
import {
	Attach,
	AttachAndDetach,
	CellId,
	Changeset,
	Delete,
	Detach,
	Insert,
	Mark,
	MarkEffect,
	MoveIn,
	MoveOut,
	NoopMarkType,
} from "./types";
import { Changeset as ChangesetSchema, Encoded } from "./format";
import { isNoopMark } from "./utils";

export const sequenceFieldChangeCodecFactory = <TNodeChange>(
	childCodec: SessionAwareCodec<TNodeChange>,
	revisionTagCodec: SessionAwareCodec<RevisionTag, EncodedRevisionTag>,
) =>
	makeCodecFamily<Changeset<TNodeChange>, SessionId>([
		[0, makeV0Codec(childCodec, revisionTagCodec)],
	]);
function makeV0Codec<TNodeChange>(
	childCodec: SessionAwareCodec<TNodeChange>,
	revisionTagCodec: SessionAwareCodec<RevisionTag, EncodedRevisionTag>,
): SessionAwareCodec<Changeset<TNodeChange>> {
	const changeAtomIdCodec = makeChangeAtomIdCodec(revisionTagCodec);
	const markEffectCodec: SessionAwareCodec<MarkEffect, Encoded.MarkEffect> = {
		encode(effect: MarkEffect, originatorId: SessionId): Encoded.MarkEffect {
			const type = effect.type;
			switch (type) {
				case "MoveIn":
					return {
						moveIn: {
							revision:
								effect.revision === undefined
									? undefined
									: revisionTagCodec.encode(effect.revision, originatorId),
							finalEndpoint:
								effect.finalEndpoint === undefined
									? undefined
									: changeAtomIdCodec.encode(effect.finalEndpoint, originatorId),
							id: effect.id,
						},
					};
				case "Insert":
					return {
						insert: {
							revision:
								effect.revision === undefined
									? undefined
									: revisionTagCodec.encode(effect.revision, originatorId),
							id: effect.id,
						},
					};
				case "Delete":
					return {
						delete: {
							revision:
								effect.revision === undefined
									? undefined
									: revisionTagCodec.encode(effect.revision, originatorId),
							redetachId:
								effect.redetachId === undefined
									? undefined
									: cellIdCodec.encode(effect.redetachId, originatorId),
							id: effect.id,
						},
					};
				case "MoveOut":
					return {
						moveOut: {
							revision:
								effect.revision === undefined
									? undefined
									: revisionTagCodec.encode(effect.revision, originatorId),
							finalEndpoint:
								effect.finalEndpoint === undefined
									? undefined
									: changeAtomIdCodec.encode(effect.finalEndpoint, originatorId),
							redetachId:
								effect.redetachId === undefined
									? undefined
									: cellIdCodec.encode(effect.redetachId, originatorId),
							id: effect.id,
						},
					};
				case "AttachAndDetach":
					return {
						attachAndDetach: {
							attach: markEffectCodec.encode(
								effect.attach,
								originatorId,
							) as Encoded.Attach,
							detach: markEffectCodec.encode(
								effect.detach,
								originatorId,
							) as Encoded.Detach,
						},
					};
				case NoopMarkType:
					fail(`Mark type: ${type} should not be encoded.`);
				default:
					unreachableCase(type);
			}
		},
		decode(encoded: Encoded.MarkEffect, originatorId: SessionId): MarkEffect {
			return decoderLibrary.dispatch(encoded, originatorId);
		},
	};

	const decoderLibrary = new DiscriminatedUnionDispatcher<
		Encoded.MarkEffect,
		/* args */ [originatorId: SessionId],
		MarkEffect
	>({
		moveIn(encoded: Encoded.MoveIn, originatorId: SessionId): MoveIn {
			const { id, finalEndpoint, revision } = encoded;
			const mark: MoveIn = {
				type: "MoveIn",
				id,
			};
			if (revision !== undefined) {
				mark.revision = revisionTagCodec.decode(revision, originatorId);
			}
			if (finalEndpoint !== undefined) {
				mark.finalEndpoint = changeAtomIdCodec.decode(finalEndpoint, originatorId);
			}
			return mark;
		},
		insert(encoded: Encoded.Insert, originatorId: SessionId): Insert {
			const { id, revision } = encoded;
			const mark: Insert = {
				type: "Insert",
				id,
			};
			if (revision !== undefined) {
				mark.revision = revisionTagCodec.decode(revision, originatorId);
			}
			return mark;
		},
		delete(encoded: Encoded.Delete, originatorId: SessionId): Delete {
			const { id, revision, redetachId } = encoded;
			const mark: Delete = {
				type: "Delete",
				id,
			};
			if (revision !== undefined) {
				mark.revision = revisionTagCodec.decode(revision, originatorId);
			}
			if (redetachId !== undefined) {
				mark.redetachId = cellIdCodec.decode(redetachId, originatorId);
			}
			return mark;
		},
		moveOut(encoded: Encoded.MoveOut, originatorId: SessionId): MoveOut {
			const { id, finalEndpoint, redetachId, revision } = encoded;
			const mark: MoveOut = {
				type: "MoveOut",
				id,
			};
			if (revision !== undefined) {
				mark.revision = revisionTagCodec.decode(revision, originatorId);
			}
			if (finalEndpoint !== undefined) {
				mark.finalEndpoint = changeAtomIdCodec.decode(finalEndpoint, originatorId);
			}
			if (redetachId !== undefined) {
				mark.redetachId = cellIdCodec.decode(redetachId, originatorId);
			}
			return mark;
		},
		attachAndDetach(
			encoded: Encoded.AttachAndDetach,
			originatorId: SessionId,
		): AttachAndDetach {
			return {
				type: "AttachAndDetach",
				attach: decoderLibrary.dispatch(encoded.attach, originatorId) as Attach,
				detach: decoderLibrary.dispatch(encoded.detach, originatorId) as Detach,
			};
		},
	});

	const cellIdCodec: SessionAwareCodec<CellId, Encoded.CellId> = {
		encode: (
			{ localId, adjacentCells, lineage, revision }: CellId,
			originatorId: SessionId,
		): Encoded.CellId => {
			const encoded: Encoded.CellId = {
				localId,
				adjacentCells: adjacentCells?.map(({ id, count }) => [id, count]),
				// eslint-disable-next-line @typescript-eslint/no-shadow
				lineage: lineage?.map(({ revision, id, count, offset }) => [
					revisionTagCodec.encode(revision, originatorId),
					id,
					count,
					offset,
				]),
				revision:
					revision === undefined
						? revision
						: revisionTagCodec.encode(revision, originatorId),
			};
			return encoded;
		},
		decode: (
			{ localId, adjacentCells, lineage, revision }: Encoded.CellId,
			originatorId: SessionId,
		): CellId => {
			// Note: this isn't inlined on decode so that round-tripping changes compare as deep-equal works,
			// which is mostly just a convenience for tests. On encode, JSON.stringify() takes care of removing
			// explicit undefined properties.
			const decoded: Mutable<CellId> = {
				localId,
			};
			if (revision !== undefined) {
				decoded.revision = revisionTagCodec.decode(revision, originatorId);
			}
			if (adjacentCells !== undefined) {
				decoded.adjacentCells = adjacentCells.map(([id, count]) => ({
					id,
					count,
				}));
			}
			if (lineage !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-shadow
				decoded.lineage = lineage.map(([revision, id, count, offset]) => ({
					revision: revisionTagCodec.decode(revision, originatorId),
					id,
					count,
					offset,
				}));
			}
			return decoded;
		},
	};

	/**
	 * If we want to make the node change aspect of this codec more type-safe, we could adjust generics
	 * to be in terms of the schema rather than the concrete type of the node change.
	 */
	type NodeChangeSchema = TAnySchema;

	return {
		encode: (
			changeset: Changeset<TNodeChange>,
			originatorId: SessionId,
		): JsonCompatibleReadOnly & Encoded.Changeset<NodeChangeSchema> => {
			const jsonMarks: Encoded.Changeset<NodeChangeSchema> = [];
			for (const mark of changeset) {
				const encodedMark: Encoded.Mark<NodeChangeSchema> = {
					count: mark.count,
				};
				if (!isNoopMark(mark)) {
					encodedMark.effect = markEffectCodec.encode(mark, originatorId);
				}
				if (mark.cellId !== undefined) {
					encodedMark.cellId = cellIdCodec.encode(mark.cellId, originatorId);
				}
				if (mark.changes !== undefined) {
					encodedMark.changes = childCodec.encode(mark.changes, originatorId);
				}
				jsonMarks.push(encodedMark);
			}
			return jsonMarks;
		},
		decode: (
			changeset: Encoded.Changeset<NodeChangeSchema>,
			originatorId: SessionId,
		): Changeset<TNodeChange> => {
			const marks: Changeset<TNodeChange> = [];
			for (const mark of changeset) {
				const decodedMark: Mark<TNodeChange> = {
					count: mark.count,
				};

				if (mark.effect !== undefined) {
					Object.assign(decodedMark, markEffectCodec.decode(mark.effect, originatorId));
				}
				if (mark.cellId !== undefined) {
					decodedMark.cellId = cellIdCodec.decode(mark.cellId, originatorId);
				}
				if (mark.changes !== undefined) {
					decodedMark.changes = childCodec.decode(mark.changes, originatorId);
				}
				marks.push(decodedMark);
			}
			return marks;
		},
		encodedSchema: ChangesetSchema(childCodec.encodedSchema ?? Type.Any()),
	};
}
