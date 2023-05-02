/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { requestFluidObject } from "@fluidframework/runtime-utils";
import {
	createSummarizer,
	ITestContainerConfig,
	ITestObjectProvider,
	mockConfigProvider,
	summarizeNow,
	waitForContainerConnection,
} from "@fluidframework/test-utils";
import {
	describeNoCompat,
	ITestDataObject,
	TestDataObjectType,
} from "@fluid-internal/test-version-utils";
import { IGCRuntimeOptions } from "@fluidframework/container-runtime";
import { delay, stringToBuffer } from "@fluidframework/common-utils";
import { gcTreeKey } from "@fluidframework/runtime-definitions";
import { ISummaryTree, SummaryType } from "@fluidframework/protocol-definitions";
import { IContainer, LoaderHeader } from "@fluidframework/container-definitions";
import {
	getGCStateFromSummary,
	getGCDeletedStateFromSummary,
	getGCTombstoneStateFromSummary,
} from "./gcTestSummaryUtils";

/**
 * Validates that an unreferenced datastore and blob goes through all the GC sweep phases without overlapping.
 */
describeNoCompat("GC sweep unreference phases", (getTestObjectProvider) => {
	const inactiveTimeoutMs = 100;
	const sweepTimeoutMs = 200;

	const settings = {};
	const gcOptions: IGCRuntimeOptions = { inactiveTimeoutMs };
	const testContainerConfig: ITestContainerConfig = {
		runtimeOptions: {
			summaryOptions: {
				summaryConfigOverrides: {
					state: "disabled",
				},
			},
			gcOptions,
		},
		loaderProps: { configProvider: mockConfigProvider(settings) },
	};

	let provider: ITestObjectProvider;

	const loadSummarizer = async (container: IContainer, summaryVersion?: string) => {
		return createSummarizer(
			provider,
			container,
			{
				runtimeOptions: { gcOptions },
				loaderProps: { configProvider: mockConfigProvider(settings) },
			},
			summaryVersion,
		);
	};

	async function isDataStoreInSummaryTree(summaryTree: ISummaryTree, dataStoreId: string) {
		const channelsTree =
			(summaryTree.tree[".channels"] as ISummaryTree)?.tree ?? summaryTree.tree;
		return dataStoreId in channelsTree;
	}

	beforeEach(async function () {
		provider = getTestObjectProvider({ syncSummarizer: true });
		// These tests validate the GC state in summary generated by the container runtime. They do not care
		// about the snapshot that is downloaded from the server. So, it doesn't need to run against real services.
		if (provider.driver.type !== "local") {
			this.skip();
		}

		settings["Fluid.GarbageCollection.Test.SweepDataStores"] = true;
		settings["Fluid.GarbageCollection.RunSweep"] = true;
		settings["Fluid.GarbageCollection.ThrowOnTombstoneUsage"] = true;
		settings["Fluid.GarbageCollection.TestOverride.SweepTimeoutMs"] = sweepTimeoutMs;
	});

	it("GC nodes go from referenced to unreferenced to inactive to sweep ready to tombstone", async () => {
		const mainContainer = await provider.makeTestContainer(testContainerConfig);
		const mainDataStore = await requestFluidObject<ITestDataObject>(mainContainer, "default");
		await waitForContainerConnection(mainContainer);

		const { container, summarizer } = await loadSummarizer(mainContainer);

		// create datastore and blob
		const dataStore = await mainDataStore._context.containerRuntime.createDataStore(
			TestDataObjectType,
		);
		const dataStoreHandle = dataStore.entryPoint;
		assert(dataStoreHandle !== undefined, "Expected a handle when creating a datastore");
		const dataObject = (await dataStoreHandle.get()) as ITestDataObject;
		const dataStoreId = dataObject._context.id;
		const ddsHandle = dataObject._root.handle;
		const blobContents = "Blob contents";
		const blobHandle = await mainDataStore._runtime.uploadBlob(
			stringToBuffer(blobContents, "utf-8"),
		);

		// store datastore and blob handles
		mainDataStore._root.set("dataStore", dataStoreHandle);
		mainDataStore._root.set("blob", blobHandle);

		// unreference datastore and blob handles
		mainDataStore._root.delete("dataStore");
		mainDataStore._root.delete("blob");

		// Summarize and verify datastore and blob are unreferenced and not tombstoned
		await provider.ensureSynchronized();
		const summaryTree1 = (await summarizeNow(summarizer)).summaryTree;
		// GC graph check
		const gcState = getGCStateFromSummary(summaryTree1);
		assert(gcState !== undefined, "Expected GC state to be generated");
		assert(
			gcState.gcNodes[dataStoreHandle.absolutePath] !== undefined,
			"Data Store should exist on gc graph",
		);
		assert(
			gcState.gcNodes[dataStoreHandle.absolutePath].unreferencedTimestampMs !== undefined,
			"Data Store should be unreferenced",
		);
		assert(
			gcState.gcNodes[blobHandle.absolutePath] !== undefined,
			"Blob should exist on gc graph",
		);
		assert(
			gcState.gcNodes[blobHandle.absolutePath].unreferencedTimestampMs !== undefined,
			"Blob should be unreferenced",
		);
		// GC Tombstone check
		const tombstoneState1 = getGCTombstoneStateFromSummary(summaryTree1);
		assert(tombstoneState1 === undefined, "Nothing should be tombstoned");
		// GC Sweep check
		const deletedState1 = getGCDeletedStateFromSummary(summaryTree1);
		assert(deletedState1 === undefined, "Nothing should be swept");
		// Summary check
		assert(
			await isDataStoreInSummaryTree(summaryTree1, dataStoreId),
			"Data Store should be in the summary!",
		);

		// Wait inactive timeout
		await delay(inactiveTimeoutMs);
		// Summarize and verify datastore and blob are unreferenced and not tombstoned
		// Functionally being inactive should have no effect on datastores
		mainDataStore._root.set("send", "op");
		await provider.ensureSynchronized();
		const summaryTree2 = (await summarizeNow(summarizer)).summaryTree;
		// GC state is a handle meaning it is the same as before, meaning nothing is tombstoned.
		assert(
			summaryTree2.tree[gcTreeKey].type === SummaryType.Handle,
			"GC tree should not have changed",
		);
		assert(
			await isDataStoreInSummaryTree(summaryTree2, dataStoreId),
			"Data Store should be in the summary!",
		);

		// Wait sweep timeout
		await delay(sweepTimeoutMs);
		mainDataStore._root.set("send", "op2");
		await provider.ensureSynchronized();
		const summary3 = await summarizeNow(summarizer);
		const summaryTree3 = summary3.summaryTree;
		// GC graph check
		const gcState3 = getGCStateFromSummary(summaryTree3);
		assert(gcState3 !== undefined, "Expected GC state to be generated");
		assert(
			!(dataStoreHandle.absolutePath in gcState3.gcNodes),
			"Data Store should not exist on gc graph",
		);
		// GC Tombstone check
		const tombstoneState3 = getGCTombstoneStateFromSummary(summaryTree3);
		assert(tombstoneState3 === undefined, "Nothing should be tombstoned");
		// GC Sweep check
		const deletedState3 = getGCDeletedStateFromSummary(summaryTree3);
		assert(deletedState3 !== undefined, "Should have sweep state");
		assert(deletedState3.includes(dataStoreHandle.absolutePath), "Data Store should be swept");
		assert(deletedState3.includes(ddsHandle.absolutePath), "DDS should be swept");
		assert(deletedState3.length === 2, "Nothing else should have been swept");
		// Summary check
		assert(
			!(await isDataStoreInSummaryTree(summaryTree3, dataStoreId)),
			"Data Store should not be in the summary!",
		);

		await provider.loadTestContainer(testContainerConfig, {
			[LoaderHeader.version]: summary3.summaryVersion,
		});
		container.close();

		const { summarizer: remoteSummarizer } = await loadSummarizer(
			mainContainer,
			summary3.summaryVersion,
		);
		const summaryTree4 = (await summarizeNow(remoteSummarizer)).summaryTree;
		assert(
			!(await isDataStoreInSummaryTree(summaryTree4, dataStoreId)),
			"Data Store should not be in the summary!",
		);
	});
});
