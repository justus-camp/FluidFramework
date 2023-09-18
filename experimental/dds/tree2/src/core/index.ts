/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	InvalidationToken,
	recordDependency,
	SimpleDependee,
	cachedValue,
	DisposingDependee,
	SimpleObservingDependent,
} from "./dependency-tracking";
export type {
	Dependee,
	Dependent,
	NamedComputation,
	ObservingDependent,
	ICachedValue,
} from "./dependency-tracking";

export {
	EmptyKey,
	AnchorSet,
	EncodedJsonableTree,
	Delta,
	rootFieldKey,
	rootField,
	CursorLocationType,
	castCursorToSynchronous,
	genericTreeKeys,
	getGenericTreeField,
	genericTreeDeleteIfEmpty,
	getDepth,
	mapCursorField,
	mapCursorFields,
	getMapTreeField,
	detachedFieldAsKey,
	keyAsDetachedField,
	visitDelta,
	applyDelta,
	setGenericTreeField,
	SparseNode,
	getDescendant,
	compareUpPaths,
	clonePath,
	topDownPath,
	compareFieldUpPaths,
	forEachNode,
	forEachNodeInSubtree,
	forEachField,
	isSkipMark,
	emptyDelta,
	anchorSlot,
	inCursorField,
	inCursorNode,
	CursorMarker,
	isCursor,
	getDetachedFieldContainingPath,
} from "./tree";
export type {
	TreeType,
	Value,
	TreeValue,
	DetachedField,
	UpPath,
	FieldUpPath,
	Anchor,
	RootField,
	ChildCollection,
	ChildLocation,
	FieldMapObject,
	NodeData,
	GenericTreeNode,
	JsonableTree,
	ITreeCursor,
	ITreeCursorSynchronous,
	GenericFieldsNode,
	AnchorLocator,
	MapTree,
	DeltaVisitor,
	PathVisitor,
	PathRootPrefix,
	AnchorSlot,
	AnchorNode,
	UpPathDefault,
	AnchorEvents,
	AnchorSetRootEvents,
	ProtoNodes,
} from "./tree";

export {
	TreeNavigationResult,
	ITreeSubscriptionCursorState,
	initializeForest,
	moveToDetachedField,
} from "./forest";
export type {
	IEditableForest,
	IForestSubscription,
	TreeLocation,
	FieldLocation,
	ForestLocation,
	ITreeSubscriptionCursor,
	FieldAnchor,
	ForestEvents,
} from "./forest";

export {
	FieldKeySchema,
	TreeSchemaIdentifierSchema,
	ValueSchema,
	FieldKindIdentifierSchema,
	InMemoryStoredSchemaRepository,
	schemaDataIsEmpty,
	fieldSchema,
	emptyMap,
	emptySet,
	treeSchema,
	forbiddenFieldKindIdentifier,
	storedEmptyFieldSchema,
	cloneSchemaData,
} from "./schema-stored";
export type {
	FieldKey,
	TreeSchemaIdentifier,
	FieldStoredSchema,
	PrimitiveValueSchema,
	TreeStoredSchema,
	StoredSchemaRepository,
	FieldKindIdentifier,
	FieldKindSpecifier,
	TreeTypeSet,
	SchemaData,
	TreeSchemaBuilder,
	SchemaEvents,
} from "./schema-stored";

export { EditBuilder } from "./change-family";
export type { ChangeFamily, ChangeFamilyEditor } from "./change-family";

export {
	assertIsRevisionTag,
	findAncestor,
	findCommonAncestor,
	isRevisionTag,
	RevisionTagSchema,
	makeAnonChange,
	tagChange,
	noFailure,
	verifyChangeRebaser,
	tagRollbackInverse,
	SessionIdSchema,
	mintCommit,
	mintRevisionTag,
	rebaseBranch,
	rebaseChange,
} from "./rebase";
export type {
	ChangeRebaser,
	GraphCommit,
	RevisionTag,
	ChangesetLocalId,
	ChangeAtomId,
	TaggedChange,
	OutputType,
	SessionId,
} from "./rebase";

export { AdaptedViewSchema, Compatibility, AllowedUpdateType } from "./schema-view";
export type { Adapters, TreeAdapter } from "./schema-view";

export type { RepairDataStore, ReadonlyRepairDataStore, IRepairDataStoreProvider } from "./repair";

export { UndoRedoManager, LocalCommitSource } from "./undo";
