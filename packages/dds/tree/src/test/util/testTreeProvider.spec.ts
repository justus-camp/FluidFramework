/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import assert from "assert";
import { SharedTreeCore } from "../../shared-tree-core";
import { spyOnMethod, SummarizeType, TestTreeProvider } from "../utils";
import { describeNoCompat } from "@fluid-internal/test-version-utils";
import { ITestObjectProvider } from "@fluidframework/test-utils";

describeNoCompat("TestTreeProvider", (getTestObjectProvider) => {
	let testProvider: ITestObjectProvider;
	beforeEach(() => {
		testProvider = getTestObjectProvider();
	});

	it("can manually trigger summaries with summarizeOnDemand", async () => {
		let summaryCount = 0;
		const unspy = spyOnMethod(SharedTreeCore, "summarizeCore", () => {
			summaryCount += 1;
		});

		const provider = await TestTreeProvider.create(testProvider, 1, SummarizeType.onDemand);
		const summaries = summaryCount;
		await provider.summarize();

		assert.strictEqual(summaryCount, summaries + 1);
		unspy();
	});

	it("cannot manually trigger summaries without setting summarizeOnDemand", async () => {
		let summarizerError;
		try {
			const provider = await TestTreeProvider.create(testProvider, 1);
			await provider.summarize();
		} catch (error) {
			summarizerError = error;
		}
		assert.notStrictEqual(summarizerError, undefined);
	});

	it("cannot manually trigger summaries with 0 trees", async () => {
		let summarizerError;
		try {
			const provider = await TestTreeProvider.create(testProvider, 0, SummarizeType.onDemand);
			await provider.summarize();
		} catch (error) {
			summarizerError = error;
		}
		assert.notStrictEqual(summarizerError, undefined);
	});

	it("can trigger summaries with multiple trees", async () => {
		let summaryCount = 0;
		const unspy = spyOnMethod(SharedTreeCore, "summarizeCore", () => {
			summaryCount += 1;
		});

		const provider = await TestTreeProvider.create(testProvider, 2, SummarizeType.onDemand);

		const summaries = summaryCount;
		await provider.summarize();
		assert.strictEqual(summaryCount, summaries + 1);
		unspy();
	});
});
