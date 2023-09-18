/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
export { AnchorSet, anchorSlot } from "./anchorSet";
export type {
	Anchor,
	AnchorLocator,
	AnchorSlot,
	AnchorNode,
	AnchorEvents,
	AnchorSetRootEvents,
} from "./anchorSet";
export {
	CursorLocationType,
	castCursorToSynchronous,
	mapCursorField,
	mapCursorFields,
	forEachNode,
	forEachNodeInSubtree,
	forEachField,
	inCursorField,
	inCursorNode,
	CursorMarker,
	isCursor,
} from "./cursor";
export type { ITreeCursor, ITreeCursorSynchronous, PathRootPrefix } from "./cursor";
export type { ProtoNodes } from "./delta";
export { getMapTreeField } from "./mapTree";
export type { MapTree } from "./mapTree";
export {
	clonePath,
	topDownPath,
	getDepth,
	compareUpPaths,
	compareFieldUpPaths,
	getDetachedFieldContainingPath,
} from "./pathTree";
export type { UpPath, FieldUpPath, UpPathDefault } from "./pathTree";
export {
	genericTreeDeleteIfEmpty,
	genericTreeKeys,
	getGenericTreeField,
	setGenericTreeField,
} from "./treeTextFormat";
export type {
	FieldMapObject,
	GenericFieldsNode,
	GenericTreeNode,
	JsonableTree,
} from "./treeTextFormat";
export { EncodedJsonableTree } from "./persistedTreeTextFormat";
export { EmptyKey, detachedFieldAsKey, keyAsDetachedField, rootFieldKey, rootField } from "./types";
export type {
	TreeType,
	ChildLocation,
	DetachedField,
	ChildCollection,
	RootField,
	Value,
	TreeValue,
	NodeData,
} from "./types";
export { visitDelta, applyDelta } from "./visitDelta";
export type { DeltaVisitor } from "./visitDelta";
export type { PathVisitor } from "./visitPath";

// Split this up into separate import and export for compatibility with API-Extractor.
import * as Delta from "./delta";
export { Delta };

export { SparseNode, getDescendant } from "./sparseTree";

export { isSkipMark, emptyDelta } from "./deltaUtil";
