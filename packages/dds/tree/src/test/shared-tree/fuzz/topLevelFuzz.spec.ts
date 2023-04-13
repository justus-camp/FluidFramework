/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import path from "path";
import {
	AsyncGenerator,
	makeRandom,
	performFuzzActionsAsync,
	SaveInfo,
} from "@fluid-internal/stochastic-test-utils";
import { TestTreeProvider, SummarizeType, initializeTestTree } from "../../utils";
import {
	FuzzTestState,
	makeOpGenerator,
	makeOpGeneratorFromFilePath,
	Operation,
	EditGeneratorOpWeights,
} from "./fuzzEditGenerators";
import { checkTreesAreSynchronized, fuzzReducer } from "./fuzzEditReducers";
import { initialTreeState, runFuzzBatch, testSchema } from "./fuzzUtils";
import { ITestObjectProvider } from "@fluidframework/test-utils";
import { describeNoCompat } from "@fluid-internal/test-version-utils";

export async function performFuzzActions(
	testProvider: ITestObjectProvider,
	generator: AsyncGenerator<Operation, FuzzTestState>,
	seed: number,
	saveInfo?: SaveInfo,
): Promise<FuzzTestState> {
	const random = makeRandom(seed);
	const provider = await TestTreeProvider.create(testProvider, 4, SummarizeType.onDemand);
	initializeTestTree(provider.trees[0], initialTreeState, testSchema);
	await provider.ensureSynchronized();

	const initialState: FuzzTestState = {
		random,
		testTreeProvider: provider,
		numberOfEdits: 0,
	};
	await initialState.testTreeProvider.ensureSynchronized();

	const finalState = await performFuzzActionsAsync(
		generator,
		fuzzReducer,
		initialState,
		saveInfo,
	);
	await finalState.testTreeProvider.ensureSynchronized();
	checkTreesAreSynchronized(finalState.testTreeProvider);
	return finalState;
}

/**
 * Fuzz tests in this suite are meant to exercise as much of the SharedTree code as possible and do so in the most
 * production-like manner possible. For example, these fuzz tests should not utilize branching APIs to emulate
 * multiple clients working on the same document. Instead, they should use multiple SharedTree instances, tied together
 * by a sequencing service. The tests may still use branching APIs because that's part of the normal usage of
 * SharedTree, but not as way to avoid using multiple SharedTree instances.
 *
 * The fuzz tests should validate that the clients do not crash and that their document states do not diverge.
 * See the "Fuzz - Targeted" test suite for tests that validate more specific code paths or invariants.
 */
describeNoCompat("Fuzz - Top-Level", (getTestObjectProvider) => {
	let testProvider: ITestObjectProvider;
	beforeEach(() => {
		testProvider = getTestObjectProvider();
	});

	const random = makeRandom(0);
	const runsPerBatch = 20;
	const opsPerRun = 20;
	const editGeneratorOpWeights: EditGeneratorOpWeights = {
		setPayload: 1,
	};
	/**
	 * This test suite is meant exercise all public APIs of SharedTree together, as well as all service-oriented
	 * operations (such as summarization and stashed ops).
	 */
	describe("Everything", () => {
		runFuzzBatch(
			testProvider,
			makeOpGenerator,
			performFuzzActions,
			opsPerRun,
			runsPerBatch,
			random,
			editGeneratorOpWeights,
		);
	});
});

describeNoCompat.skip("Re-run form ops saved on file", (getTestObjectProvider) => {
	let testProvider: ITestObjectProvider;
	beforeEach(() => {
		testProvider = getTestObjectProvider();
	});

	// For using saved operations set the value of the runSeed used to saved the ops in the file.
	const runSeed = 0;
	const filepath = path.join(__dirname, `fuzz-tests-saved-ops/ops_with_seed_${runSeed}`);
	it(`with seed ${runSeed}`, async () => {
		await performFuzzActions(
			testProvider,
			await makeOpGeneratorFromFilePath(filepath),
			runSeed,
		);
	}).timeout(20000);
});
