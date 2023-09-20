/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { stub } from "sinon";
import { v4 as uuid } from "uuid";
import { IOdspResolvedUrl } from "@fluidframework/odsp-driver-definitions";
import { IClient } from "@fluidframework/protocol-definitions";
import { ITelemetryLoggerExt, MockLogger, isFluidError } from "@fluidframework/telemetry-utils";
import { DriverErrorTypes, IAnyDriverError } from "@fluidframework/driver-definitions";
import { createOdspNetworkError } from "@fluidframework/odsp-doclib-utils";
import { Socket } from "socket.io-client";
import { EpochTracker } from "../../epochTracker";
import { LocalPersistentCache } from "../../odspCache";
import { getHashedDocumentId } from "../../odspPublicUtils";
import { OdspDocumentDeltaConnection } from "../../odspDocumentDeltaConnection";
import * as socketModule from "../../socketModule";
import { ClientSocketMock } from "./socketMock";

describe("OdspDocumentDeltaConnection tests", () => {
	let tenantId = "tenantId";
	let documentId = "documentId";
	const token = "token";
	const client: IClient = {
		mode: "write",
		scopes: ["doc:read", "doc:write"],
		details: { capabilities: { interactive: true } },
		permission: [],
		user: { id: "userId" },
	};
	const webSocketUrl = "https://webSocketUrl";
	let logger: ITelemetryLoggerExt;
	const socketReferenceKeyPrefix = "prefix";
	const siteUrl = "https://microsoft.sharepoint-df.com/siteUrl";
	const driveId = "driveId";
	const itemId = "itemId";
	let epochTracker: EpochTracker;
	let localCache: LocalPersistentCache;
	let hashedDocumentId: string;
	const resolvedUrl = {
		siteUrl,
		driveId,
		itemId,
		odspResolvedUrl: true,
	} as any as IOdspResolvedUrl;
	let socket: ClientSocketMock | undefined;

	before(async () => {
		hashedDocumentId = await getHashedDocumentId(driveId, itemId);
	});

	beforeEach(async () => {
		logger = new MockLogger().toTelemetryLogger();
		documentId = uuid();
		tenantId = uuid();
		// use null logger here as we expect errors
		epochTracker = new EpochTracker(
			localCache,
			{
				docId: hashedDocumentId,
				resolvedUrl,
			},
			logger,
		);
	});

	afterEach(async () => {
		socket?.close();
		await epochTracker.removeEntries().catch(() => {});
	});

	async function mockSocket<T>(_response: Socket, callback: () => Promise<T>): Promise<T> {
		const getSocketCreationStub = stub(socketModule, "SocketIOClientStatic");
		getSocketCreationStub.returns(_response);
		try {
			return await callback();
		} finally {
			getSocketCreationStub.restore();
		}
	}

	it("Connect document success on connection", async () => {
		socket = new ClientSocketMock();
		const connection = await mockSocket(socket as unknown as Socket, async () => {
			return OdspDocumentDeltaConnection.create(
				tenantId,
				documentId,
				token,
				client,
				webSocketUrl,
				logger,
				60000,
				epochTracker,
				socketReferenceKeyPrefix,
			);
		});
		assert.strictEqual(connection.documentId, documentId, "document id should match");
		assert.strictEqual(connection.details.clientId, "clientId", "client id should match");
		assert(!connection.disposed, "connection should not be disposed");
		assert(connection.existing, "doucment should already exist");
		assert.strictEqual(connection.mode, "write", "connection should be write");

		let disconnectedEvent = false;
		connection.on("disconnect", (reason: IAnyDriverError) => {
			disconnectedEvent = true;
		});

		connection.dispose();
		assert(connection.disposed, "connection should be disposed now");
		assert(disconnectedEvent, "disconnect Event should happed");
		assert(socket.connected, "socket should still be connected");
	});

	it("Connect document error on connection", async () => {
		const errorToThrow = createOdspNetworkError("TestSocketError", 401);
		socket = new ClientSocketMock({
			connect_document: { eventToEmit: "connect_document_error", errorToThrow },
		});
		let errorhappened = false;
		let connection: OdspDocumentDeltaConnection | undefined;
		try {
			connection = await mockSocket(socket as unknown as Socket, async () => {
				// eslint-disable-next-line no-return-await
				return await OdspDocumentDeltaConnection.create(
					tenantId,
					documentId,
					token,
					client,
					webSocketUrl,
					logger,
					60000,
					epochTracker,
					socketReferenceKeyPrefix,
				);
			});
		} catch (err) {
			errorhappened = true;
			assert(isFluidError(err), "should be a Fluid error");
			assert(err.message.includes("TestSocketError"), "error message should match");
			assert(
				err.errorType === DriverErrorTypes.genericNetworkError,
				"errortype should be correct",
			);
		}
		assert(connection === undefined, "connection should not happen");
		assert(errorhappened, "error should occur");
	});

	it("Connect error on connection", async () => {
		const errorToThrow = createOdspNetworkError("TestSocketError", 401);
		socket = new ClientSocketMock({
			connect_document: { eventToEmit: "connect_error", errorToThrow },
		});
		let errorhappened = false;
		try {
			await mockSocket(socket as unknown as Socket, async () => {
				return OdspDocumentDeltaConnection.create(
					tenantId,
					documentId,
					token,
					client,
					webSocketUrl,
					logger,
					60000,
					epochTracker,
					socketReferenceKeyPrefix,
				);
			});
		} catch (err) {
			errorhappened = true;
			assert(isFluidError(err), "should be a Fluid error");
			assert(err.message.includes("TestSocketError"), "error message should match");
			assert(
				err.errorType === DriverErrorTypes.genericNetworkError,
				"errortype should be correct",
			);
		}
		assert(errorhappened, "error should occur");
	});

	it("Connect timeout on connection", async () => {
		socket = new ClientSocketMock({
			connect_document: { eventToEmit: "connect_timeout" },
		});
		let errorhappened = false;
		try {
			await mockSocket(socket as unknown as Socket, async () => {
				return OdspDocumentDeltaConnection.create(
					tenantId,
					documentId,
					token,
					client,
					webSocketUrl,
					logger,
					60000,
					epochTracker,
					socketReferenceKeyPrefix,
				);
			});
		} catch (err) {
			errorhappened = true;
			assert(isFluidError(err), "should be a Fluid error");
			assert(err.message.includes("connect_timeout"), "error message should match");
			assert(
				err.errorType === DriverErrorTypes.genericNetworkError,
				"errortype should be correct",
			);
		}
		assert(errorhappened, "error should occur");
	});

	it("Connection object should handle server_disconnect event with clientId", async () => {
		socket = new ClientSocketMock();
		const connection = await mockSocket(socket as unknown as Socket, async () => {
			return OdspDocumentDeltaConnection.create(
				tenantId,
				documentId,
				token,
				client,
				webSocketUrl,
				logger,
				60000,
				epochTracker,
				socketReferenceKeyPrefix,
			);
		});
		let disconnectedEvent = false;
		const errorToThrow = { message: "OdspSocketError", code: 400 };
		let errorReceived;
		connection.on("disconnect", (reason: IAnyDriverError) => {
			disconnectedEvent = true;
			errorReceived = reason;
		});
		socket.sendServerDisconnectEvent(errorToThrow, "clientId");

		assert(disconnectedEvent, "disconnect event should happen");
		assert(
			errorReceived.message.includes("server_disconnect"),
			"should container server disconnect event",
		);
		assert(errorReceived.errorType, DriverErrorTypes.genericNetworkError);
		assert(socket?.connected, "socket should still be connected");
	});

	it("Connection object should handle server_disconnect event without clientId handle disconnect event", async () => {
		socket = new ClientSocketMock();
		const connection = await mockSocket(socket as unknown as Socket, async () => {
			return OdspDocumentDeltaConnection.create(
				tenantId,
				documentId,
				token,
				client,
				webSocketUrl,
				logger,
				60000,
				epochTracker,
				socketReferenceKeyPrefix,
			);
		});
		let disconnectedEvent = false;
		let errorReceived;
		const errorToThrow = { message: "OdspSocketError", code: 400 };
		connection.on("disconnect", (reason: IAnyDriverError) => {
			disconnectedEvent = true;
			errorReceived = reason;
		});
		socket.sendServerDisconnectEvent(errorToThrow);

		assert(disconnectedEvent, "disconnect event should happen");
		assert(
			errorReceived.message.includes("server_disconnect"),
			"should container server disconnect event",
		);
		assert(errorReceived.errorType, DriverErrorTypes.genericNetworkError);
		assert(socket !== undefined && !socket.connected, "socket should be disconnected");
	});

	it("Connection object should handle disconnect event", async () => {
		socket = new ClientSocketMock();
		const connection = await mockSocket(socket as unknown as Socket, async () => {
			return OdspDocumentDeltaConnection.create(
				tenantId,
				documentId,
				token,
				client,
				webSocketUrl,
				logger,
				60000,
				epochTracker,
				socketReferenceKeyPrefix,
			);
		});
		let disconnectedEvent = false;
		let errorReceived;
		const errorToThrow = createOdspNetworkError("TestSocketError", 400);
		const details = { context: { code: 400, type: "badError" } };
		connection.on("disconnect", (reason: IAnyDriverError) => {
			disconnectedEvent = true;
			errorReceived = reason;
		});
		socket.sendDisconnectEvent(errorToThrow, details);

		assert(disconnectedEvent, "disconnect event should happen");
		assert(
			errorReceived.message.includes("socket.io (disconnect): TestSocketError"),
			"should container disconnect event",
		);
		assert(errorReceived.errorType, DriverErrorTypes.genericNetworkError);
		assert(errorReceived.socketErrorType === details.context.type);
		assert(errorReceived.socketCode === details.context.code);
		assert(socket !== undefined && !socket.connected, "socket should be closed");
	});

	it("Connection object should handle error event", async () => {
		socket = new ClientSocketMock();
		const connection = await mockSocket(socket as unknown as Socket, async () => {
			return OdspDocumentDeltaConnection.create(
				tenantId,
				documentId,
				token,
				client,
				webSocketUrl,
				logger,
				60000,
				epochTracker,
				socketReferenceKeyPrefix,
			);
		});
		let disconnectedEvent = false;
		let errorReceived;
		const errorToThrow = createOdspNetworkError("TestSocketError", 400);
		connection.on("disconnect", (reason: IAnyDriverError) => {
			disconnectedEvent = true;
			errorReceived = reason;
		});
		socket.sendErrorEvent(errorToThrow);
		assert(disconnectedEvent, "disconnect event should happen");
		assert(
			errorReceived.message.includes("socket.io (error): TestSocketError"),
			"should container disconnect event",
		);
		assert(errorReceived.errorType, DriverErrorTypes.genericNetworkError);
		assert(socket !== undefined && !socket.connected, "socket should be closed");
	});
});
