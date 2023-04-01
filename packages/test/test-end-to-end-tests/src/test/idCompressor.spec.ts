/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { SharedMap } from "@fluidframework/map";
import { requestFluidObject } from "@fluidframework/runtime-utils";
import {
	DataObjectFactoryType,
	ITestContainerConfig,
	ITestFluidObject,
	ITestObjectProvider,
} from "@fluidframework/test-utils";
import { describeNoCompat } from "@fluid-internal/test-version-utils";
import { SharedCell } from "@fluidframework/cell";
import { IIdCompressor, SessionSpaceCompressedId } from "@fluidframework/runtime-definitions";
import { SharedObjectCore } from "@fluidframework/shared-object-base";

const mapId = "mapKey";
const cellId = "cellKey";
const testContainerConfig: ITestContainerConfig = {
	registry: [
		[mapId, SharedMap.getFactory()],
		[cellId, SharedCell.getFactory()],
	],
	runtimeOptions: {
		enableRuntimeIdCompressor: true,
	},
	fluidDataObjectType: DataObjectFactoryType.Test,
};

function getIdCompressor(dds: SharedObjectCore): IIdCompressor {
	return (dds as any).runtime.idCompressor as IIdCompressor;
}

describeNoCompat("Runtime IdCompressor", (getTestObjectProvider) => {
	let provider: ITestObjectProvider;
	beforeEach(() => {
		provider = getTestObjectProvider();
	});

	let sharedMap1: SharedMap;
	let sharedCell1: SharedCell;
	let sharedMap2: SharedMap;
	let sharedMap3: SharedMap;

	beforeEach(async () => {
		const container1 = await provider.makeTestContainer(testContainerConfig);
		const dataObject1 = await requestFluidObject<ITestFluidObject>(container1, "default");
		sharedMap1 = await dataObject1.getSharedObject<SharedMap>(mapId);
		sharedCell1 = await dataObject1.getSharedObject<SharedCell>(cellId);

		const container2 = await provider.loadTestContainer(testContainerConfig);
		const dataObject2 = await requestFluidObject<ITestFluidObject>(container2, "default");
		sharedMap2 = await dataObject2.getSharedObject<SharedMap>(mapId);

		const container3 = await provider.loadTestContainer(testContainerConfig);
		const dataObject3 = await requestFluidObject<ITestFluidObject>(container3, "default");
		sharedMap3 = await dataObject3.getSharedObject<SharedMap>(mapId);

		sharedMap1.set("testKey1", "testValue");

		await provider.ensureSynchronized();
	});

	it("has no compressor if not enabled", async () => {
		provider.reset();
		const config: ITestContainerConfig = {
			registry: [
				[mapId, SharedMap.getFactory()],
				[cellId, SharedCell.getFactory()],
			],
			fluidDataObjectType: DataObjectFactoryType.Test,
		};
		const container1 = await provider.makeTestContainer(config);
		const dataObject1 = await requestFluidObject<ITestFluidObject>(container1, "default");
		const map = await dataObject1.getSharedObject<SharedMap>(mapId);

		assert(getIdCompressor(map) === undefined);
	});

	it("can normalize session space IDs to op space", async () => {
		assert(getIdCompressor(sharedMap1) !== undefined, "IdCompressor is undefined");
		assert(getIdCompressor(sharedMap2) !== undefined, "IdCompressor is undefined");
		assert(getIdCompressor(sharedMap3) !== undefined, "IdCompressor is undefined");

		// None of these clusters will be ack'd yet and as such they will all
		// generate local Ids. State of compressors afterwards should be:
		// SharedMap1 Compressor: Local IdRange { first: -1, last: -512 }
		// SharedMap2 Compressor: Local IdRange { first: -1, last: -512 }
		// SharedMap3 Compressor: Local IdRange { first: -1, last: -512 }
		for (let i = 0; i < 512; i++) {
			getIdCompressor(sharedMap1).generateCompressedId();
			getIdCompressor(sharedMap2).generateCompressedId();
			getIdCompressor(sharedMap3).generateCompressedId();
		}

		// Validate the state described above: all compressors should normalize to
		// local, negative ids as they haven't been ack'd and can't eagerly allocate
		for (let i = 0; i < 512; i++) {
			assert.strictEqual(
				getIdCompressor(sharedMap1).normalizeToOpSpace(
					-(i + 1) as SessionSpaceCompressedId,
				),
				-(i + 1),
			);

			assert.strictEqual(
				getIdCompressor(sharedMap2).normalizeToOpSpace(
					-(i + 1) as SessionSpaceCompressedId,
				),
				-(i + 1),
			);

			assert.strictEqual(
				getIdCompressor(sharedMap3).normalizeToOpSpace(
					-(i + 1) as SessionSpaceCompressedId,
				),
				-(i + 1),
			);
		}

		// Generate DDS ops so that the compressors synchronize
		sharedMap1.set("key", "value");
		sharedMap2.set("key2", "value2");
		sharedMap3.set("key3", "value3");

		await provider.ensureSynchronized();

		// After synchronization, each compressor should allocate a cluster. Because the order is deterministic
		// in e2e tests, we can directly validate the cluster ranges. After synchronizing, each compressor will
		// get a positive id cluster that corresponds to its locally allocated ranges. Compressor states after synchronizing:
		// SharedMap1 Compressor: { first: 0, last: 511 }
		// SharedMap2 Compressor: { first: 512, last: 1023 }
		// SharedMap3 Compressor: { first: 1024, last: 1535 }
		for (let i = 0; i < 512; i++) {
			assert.strictEqual(
				getIdCompressor(sharedMap1).normalizeToOpSpace(
					-(i + 1) as SessionSpaceCompressedId,
				),
				i,
			);

			assert.strictEqual(
				getIdCompressor(sharedMap2).normalizeToOpSpace(
					-(i + 1) as SessionSpaceCompressedId,
				),
				i + 512,
			);

			assert.strictEqual(
				getIdCompressor(sharedMap3).normalizeToOpSpace(
					-(i + 1) as SessionSpaceCompressedId,
				),
				i + 1024,
			);
		}

		assert.strictEqual(sharedMap1.get("key"), "value");
		assert.strictEqual(sharedMap2.get("key2"), "value2");
		assert.strictEqual(sharedMap3.get("key3"), "value3");
	});

	it("can normalize local op space IDs from a local session to session space", async () => {
		assert(getIdCompressor(sharedMap1) !== undefined, "IdCompressor is undefined");
		const sessionSpaceId = getIdCompressor(sharedMap1).generateCompressedId();
		sharedMap1.set("key", "value");

		await provider.ensureSynchronized();
		const opSpaceId = getIdCompressor(sharedMap1).normalizeToOpSpace(sessionSpaceId);
		const normalizedSessionSpaceId = getIdCompressor(sharedMap1).normalizeToSessionSpace(
			opSpaceId,
			getIdCompressor(sharedMap1).localSessionId,
		);

		assert.strictEqual(opSpaceId, 0);
		assert.strictEqual(normalizedSessionSpaceId, -1);
	});

	it("eagerly allocates final IDs after cluster is finalized", async () => {
		assert(getIdCompressor(sharedMap1) !== undefined, "IdCompressor is undefined");
		const localId1 = getIdCompressor(sharedMap1).generateCompressedId();
		assert.strictEqual(localId1, -1);
		const localId2 = getIdCompressor(sharedMap1).generateCompressedId();
		assert.strictEqual(localId2, -2);

		sharedMap1.set("key", "value");
		await provider.ensureSynchronized();

		const finalId3 = getIdCompressor(sharedMap1).generateCompressedId();
		assert.strictEqual(finalId3, 2);

		sharedMap1.set("key2", "value2");
		await provider.ensureSynchronized();

		const opSpaceId1 = getIdCompressor(sharedMap1).normalizeToOpSpace(localId1);
		const opSpaceId2 = getIdCompressor(sharedMap1).normalizeToOpSpace(localId2);
		const opSpaceId3 = getIdCompressor(sharedMap1).normalizeToOpSpace(finalId3);

		assert.strictEqual(opSpaceId1, 0);
		assert.strictEqual(opSpaceId2, 1);
		assert.strictEqual(opSpaceId3, 2);
		assert.strictEqual(finalId3, opSpaceId3);

		assert.strictEqual(
			getIdCompressor(sharedMap1).normalizeToSessionSpace(
				opSpaceId1,
				getIdCompressor(sharedMap1).localSessionId,
			),
			localId1,
		);
		assert.strictEqual(
			getIdCompressor(sharedMap1).normalizeToSessionSpace(
				opSpaceId2,
				getIdCompressor(sharedMap1).localSessionId,
			),
			localId2,
		);
		assert.strictEqual(
			getIdCompressor(sharedMap1).normalizeToSessionSpace(
				opSpaceId3,
				getIdCompressor(sharedMap1).localSessionId,
			),
			finalId3,
		);
	});

	it("eagerly allocates IDs across DDSs using the same compressor", async () => {
		assert(getIdCompressor(sharedMap1) !== undefined, "IdCompressor is undefined");
		assert(getIdCompressor(sharedCell1) !== undefined, "IdCompressor is undefined");

		const localId1 = getIdCompressor(sharedMap1).generateCompressedId();
		assert.strictEqual(localId1, -1);
		const localId2 = getIdCompressor(sharedCell1).generateCompressedId();
		assert.strictEqual(localId2, -2);

		sharedMap1.set("key", "value");
		sharedCell1.set("value");
		await provider.ensureSynchronized();

		const finalId3 = getIdCompressor(sharedMap1).generateCompressedId();
		assert.strictEqual(finalId3, 2);
		const finalId4 = getIdCompressor(sharedCell1).generateCompressedId();
		assert.strictEqual(finalId4, 3);

		sharedMap1.set("key2", "value2");
		sharedCell1.set("value2");
		await provider.ensureSynchronized();

		const opSpaceId1 = getIdCompressor(sharedMap1).normalizeToOpSpace(localId1);
		const opSpaceId2 = getIdCompressor(sharedCell1).normalizeToOpSpace(localId2);
		const opSpaceId3 = getIdCompressor(sharedMap1).normalizeToOpSpace(finalId3);
		const opSpaceId4 = getIdCompressor(sharedCell1).normalizeToOpSpace(finalId4);

		assert.strictEqual(opSpaceId1, 0);
		assert.strictEqual(opSpaceId2, 1);
		assert.strictEqual(opSpaceId3, 2);
		assert.strictEqual(opSpaceId3, finalId3);
		assert.strictEqual(opSpaceId3, 3);
		assert.strictEqual(opSpaceId4, finalId4);

		assert.equal(
			getIdCompressor(sharedMap1).normalizeToSessionSpace(
				opSpaceId1,
				getIdCompressor(sharedMap1).localSessionId,
			),
			localId1,
		);
		assert.equal(
			getIdCompressor(sharedCell1).normalizeToSessionSpace(
				opSpaceId2,
				getIdCompressor(sharedCell1).localSessionId,
			),
			localId2,
		);
		assert.equal(
			getIdCompressor(sharedMap1).normalizeToSessionSpace(
				opSpaceId3,
				getIdCompressor(sharedMap1).localSessionId,
			),
			finalId3,
		);
		assert.equal(
			getIdCompressor(sharedCell1).normalizeToSessionSpace(
				opSpaceId4,
				getIdCompressor(sharedCell1).localSessionId,
			),
			finalId4,
		);
	});

	it("produces Id spaces correctly", async () => {
		assert(getIdCompressor(sharedMap1) !== undefined, "IdCompressor is undefined");
		assert(getIdCompressor(sharedMap2) !== undefined, "IdCompressor is undefined");
		assert(getIdCompressor(sharedMap3) !== undefined, "IdCompressor is undefined");

		const firstId = getIdCompressor(sharedMap1).generateCompressedId();
		const secondId = getIdCompressor(sharedMap2).generateCompressedId();
		const thirdId = getIdCompressor(sharedMap2).generateCompressedId();
		const decompressedIds: string[] = [];

		const firstDecompressedId = getIdCompressor(sharedMap1).decompress(firstId);
		decompressedIds.push(firstDecompressedId);
		sharedMap1.set(firstDecompressedId, "value1");

		[secondId, thirdId].forEach((id, index) => {
			assert(getIdCompressor(sharedMap2) !== undefined, "IdCompressor is undefined");
			const decompressedId = getIdCompressor(sharedMap2).decompress(id);
			decompressedIds.push(decompressedId);
			sharedMap2.set(decompressedId, `value${index + 2}`);
		});

		// should be negative
		assert(
			getIdCompressor(sharedMap1).normalizeToOpSpace(firstId) < 0,
			"Expected op space id to be < 0",
		);
		assert(
			getIdCompressor(sharedMap2).normalizeToOpSpace(secondId) < 0,
			"Expected op space id to be < 0",
		);
		assert(
			getIdCompressor(sharedMap2).normalizeToOpSpace(thirdId) < 0,
			"Expected op space id to be < 0",
		);

		await provider.ensureSynchronized();

		assert.strictEqual(getIdCompressor(sharedMap1).normalizeToOpSpace(firstId), 0);
		assert.strictEqual(getIdCompressor(sharedMap2).normalizeToOpSpace(secondId), 512);
		assert.strictEqual(getIdCompressor(sharedMap2).normalizeToOpSpace(thirdId), 513);

		decompressedIds.forEach((id, index) => {
			assert.equal(sharedMap1.get(id), `value${index + 1}`);
			assert.equal(sharedMap2.get(id), `value${index + 1}`);
		});
	});

	// IdCompressor is at container runtime level, which means that individual DDSs
	// in the same container should have the same underlying compressor state
	it("container with multiple DDSs has same compressor state", async () => {
		assert(getIdCompressor(sharedMap1) !== undefined, "IdCompressor is undefined");
		assert(getIdCompressor(sharedCell1) !== undefined, "IdCompressor is undefined");

		// 2 IDs in the map compressor, 1 in the cell compressor
		// should result in a local count of 3 IDs
		const sharedMapCompressedId = getIdCompressor(sharedMap1).generateCompressedId();
		const sharedMapDecompressedId =
			getIdCompressor(sharedMap1).decompress(sharedMapCompressedId);
		const sharedMapCompressedId2 = getIdCompressor(sharedMap1).generateCompressedId();
		const sharedMapDecompressedId2 =
			getIdCompressor(sharedMap1).decompress(sharedMapCompressedId2);
		const sharedCellCompressedId = getIdCompressor(sharedCell1).generateCompressedId();
		const sharedCellDecompressedId =
			getIdCompressor(sharedMap1).decompress(sharedCellCompressedId);

		// Generate an op so the idCompressor state is actually synchronized
		// across clients
		sharedMap1.set(sharedMapDecompressedId, "value");

		assert.strictEqual(
			(getIdCompressor(sharedMap1) as any).localIdCount,
			(getIdCompressor(sharedCell1) as any).localIdCount,
		);

		await provider.ensureSynchronized();

		assert.strictEqual(
			getIdCompressor(sharedMap1).recompress(sharedMapDecompressedId),
			getIdCompressor(sharedCell1).recompress(sharedMapDecompressedId),
		);

		assert.strictEqual(
			getIdCompressor(sharedMap1).recompress(sharedMapDecompressedId2),
			getIdCompressor(sharedCell1).recompress(sharedMapDecompressedId2),
		);

		assert.strictEqual(
			getIdCompressor(sharedMap1).recompress(sharedCellDecompressedId),
			getIdCompressor(sharedCell1).recompress(sharedCellDecompressedId),
		);

		assert.strictEqual(sharedMap1.get(sharedMapDecompressedId), "value");
	});
});
