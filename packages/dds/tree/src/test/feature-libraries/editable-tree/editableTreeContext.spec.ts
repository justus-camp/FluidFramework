/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { FieldKey, SchemaData, lookupGlobalFieldSchema, rootFieldKey } from "../../../core";
import {
	ContextuallyTypedNodeData,
	createField,
	cursorsFromContextualData,
	isUnwrappedNode,
	singleTextCursor,
} from "../../../feature-libraries";
import { ISharedTree } from "../../../shared-tree";
import { brand } from "../../../util";
import { ITestTreeProvider, TestTreeProvider } from "../../utils";

// Allow importing from this specific file which is being tested:
/* eslint-disable-next-line import/no-internal-modules */
import { ProxyContext } from "../../../feature-libraries/editable-tree/editableTreeContext";

import { fullSchemaData, int32Schema, personData, Person } from "./mockData";
import { ITestObjectProvider } from "@fluidframework/test-utils";
import { describeNoCompat } from "@fluid-internal/test-version-utils";

async function createSharedTrees(
	testProvider: ITestObjectProvider,
	schemaData: SchemaData,
	data: ContextuallyTypedNodeData,
	numberOfTrees = 1,
): Promise<readonly [ITestTreeProvider, readonly ISharedTree[]]> {
	const provider = await TestTreeProvider.create(testProvider, numberOfTrees);
	for (const tree of provider.trees) {
		assert(tree.isAttached());
	}
	provider.trees[0].storedSchema.update(schemaData);
	const root = cursorsFromContextualData(
		provider.trees[0].storedSchema,
		lookupGlobalFieldSchema(provider.trees[0].storedSchema, rootFieldKey),
		data,
	);
	provider.trees[0].context.root.insertNodes(0, root);
	await provider.ensureSynchronized();
	return [provider, provider.trees];
}

describeNoCompat("editable-tree context", (getTestObjectProvider) => {
	let testProvider: ITestObjectProvider;
	beforeEach(() => {
		testProvider = getTestObjectProvider();
	});

	it("can clear and reuse context", async () => {
		const [provider, [tree1, tree2]] = await createSharedTrees(
			testProvider,
			fullSchemaData,
			personData,
			2,
		);
		const context2 = tree2.context;
		const person1 = tree1.root as Person;

		let person2 = tree2.root as Person;
		context2.on("afterDelta", () => {
			context2.clear();
			person2 = tree2.root as Person;
		});

		// reify EditableTrees
		assert.deepEqual(person1, person2);
		// build anchors
		context2.prepareForEdit();
		const anchorsBefore = (context2 as ProxyContext).withAnchors.size;

		// update the tree
		person1.age = brand(42);
		assert.notDeepEqual(person1, person2);
		// this would leak anchors if we constantly re-read the tree in the afterHandler without clear
		await provider.ensureSynchronized();
		assert.deepEqual(person1, person2);
		// check anchors are not leaking
		context2.prepareForEdit();
		assert.equal((context2 as ProxyContext).withAnchors.size, anchorsBefore);
	});

	it("can create fields while clearing the context in afterHandlers", async () => {
		const ageField: FieldKey = brand("age");
		const [, [tree]] = await createSharedTrees(testProvider, fullSchemaData, personData);

		tree.context.on("afterDelta", () => {
			tree.context.clear();
		});

		assert.doesNotThrow(() => {
			assert(isUnwrappedNode(tree.root));
			assert.equal(tree.root[ageField], 35);
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete tree.root[ageField];
			assert.equal(tree.root[ageField], undefined);
			tree.root[createField](
				ageField,
				singleTextCursor({ type: int32Schema.name, value: 55 }),
			);
			assert.equal(tree.root[ageField], 55);
		});
	});
});
