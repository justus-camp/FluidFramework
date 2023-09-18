/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	getEditableTreeContext,
	isEditableField,
	isPrimitive,
	isEditableTree,
	proxyTargetSymbol,
	localNodeKeySymbol,
	createDataBinderBuffering,
	createDataBinderDirect,
	createDataBinderInvalidating,
	createBinderOptions,
	createFlushableBinderOptions,
	indexSymbol,
	BindingType,
	toDownPath,
	comparePipeline,
	compileSyntaxTree,
	setField,
	TreeStatus,
} from "./editable-tree";
export type {
	EditableField,
	EditableTree,
	EditableTreeContext,
	EditableTreeOrPrimitive,
	UnwrappedEditableField,
	UnwrappedEditableTree,
	DataBinder,
	BinderOptions,
	Flushable,
	FlushableBinderOptions,
	FlushableDataBinder,
	MatchPolicy,
	SubtreePolicy,
	BindSyntaxTree,
	BindPolicy,
	BindTree,
	BindTreeDefault,
	DownPath,
	BindPath,
	PathStep,
	BindingContextType,
	BindingContext,
	VisitorBindingContext,
	DeleteBindingContext,
	InsertBindingContext,
	BatchBindingContext,
	InvalidationBindingContext,
	OperationBinderEvents,
	InvalidationBinderEvents,
	CompareFunction,
	BinderEventsCompare,
	AnchorsCompare,
} from "./editable-tree";

export {
	typeNameSymbol,
	valueSymbol,
	isPrimitiveValue,
	getPrimaryField,
	isContextuallyTypedNodeDataObject,
	getFieldKind,
	getFieldSchema,
	cursorFromContextualData,
	cursorsFromContextualData,
	cursorForTypedData,
	cursorForTypedTreeData,
	cursorsForTypedFieldData,
	normalizeNewFieldContent,
	assertAllowedValue,
} from "./contextuallyTyped";
export type {
	PrimitiveValue,
	ContextuallyTypedNodeDataObject,
	ContextuallyTypedNodeData,
	MarkedArrayLike,
	ArrayLikeMut,
	ContextuallyTypedFieldData,
	FieldGenerator,
	TreeDataContext,
	NewFieldContent,
} from "./contextuallyTyped";

export { ForestSummarizer } from "./forestSummarizer";
export { singleMapTreeCursor, mapTreeFromCursor } from "./mapTreeCursor";
export { MemoizedIdRangeAllocator } from "./memoizedIdRangeAllocator";
export type { IdRange } from "./memoizedIdRangeAllocator";
export { buildForest } from "./object-forest";
export { SchemaSummarizer, SchemaEditor } from "./schemaSummarizer";
// This is exported because its useful for doing comparisons of schema in tests.
export { makeSchemaCodec } from "./schemaIndexFormat";
export { singleStackTreeCursor, prefixPath, prefixFieldPath } from "./treeCursorUtils";
export type { CursorAdapter, CursorWithNode } from "./treeCursorUtils";
export { singleTextCursor, jsonableTreeFromCursor } from "./treeTextCursor";

// Split this up into separate import and export for compatibility with API-Extractor.
import * as SequenceField from "./sequence-field";
export { SequenceField };

export {
	isNeverField,
	ModularEditBuilder,
	CrossFieldTarget,
	FieldKind,
	Multiplicity,
	allowsRepoSuperset,
	genericFieldKind,
	revisionMetadataSourceFromInfo,
	NodeExistenceState,
} from "./modular-schema";
export type {
	EditDescription,
	FieldChangeHandler,
	FieldChangeRebaser,
	FieldEditor,
	NodeChangeset,
	FieldChangeMap,
	FieldChange,
	FieldChangeset,
	ToDelta,
	ModularChangeset,
	NodeChangeComposer,
	NodeChangeInverter,
	NodeChangeRebaser,
	CrossFieldManager,
	FullSchemaPolicy,
	GenericChangeset,
	NodeReviver,
	RevisionIndexer,
	RevisionMetadataSource,
	RevisionInfo,
	HasFieldChanges,
	NodeExistsConstraint,
	BrandedFieldKind,
} from "./modular-schema";

export {
	TreeSchema,
	FieldSchema,
	Any,
	InternalTypedSchemaTypes,
	ViewSchema,
	schemaIsFieldNode,
	schemaIsLeaf,
	schemaIsMap,
	schemaIsStruct,
	bannedFieldNames,
	fieldApiPrefixes,
	validateStructFieldName,
} from "./typed-schema";
export type {
	AllowedTypes,
	TypedSchemaCollection,
	SchemaLibraryData,
	LazyTreeSchema,
	SchemaLintConfiguration,
	FieldNodeSchema,
	LeafSchema,
	MapSchema,
	StructSchema,
} from "./typed-schema";
export { SchemaBuilder } from "./schemaBuilder";
export type { SchemaLibrary } from "./schemaBuilder";

export { mapFieldMarks, mapMark, mapMarkList, populateChildModifications } from "./deltaUtils";

export { ForestRepairDataStore, ForestRepairDataStoreProvider } from "./forestRepairDataStore";
export { dummyRepairDataStore } from "./fakeRepairDataStore";

export {
	chunkTree,
	buildChunkedForest,
	defaultChunkPolicy,
	makeTreeChunker,
} from "./chunked-forest";
export type { TreeChunk } from "./chunked-forest";

export {
	compareLocalNodeKeys,
	createNodeKeyManager,
	createMockNodeKeyManager,
	NodeKeyIndex,
	nodeKeyFieldKey,
	nodeKeyTreeIdentifier,
} from "./node-key";
export type { LocalNodeKey, StableNodeKey, NodeKeyManager } from "./node-key";

export {
	FieldKinds,
	DefaultChangeFamily,
	DefaultEditBuilder,
	defaultSchemaPolicy,
} from "./default-field-kinds";
export type {
	ValueFieldKind,
	Optional,
	Sequence,
	NodeKeyFieldKind,
	Forbidden,
	FieldKindTypes,
	DefaultChangeset,
	IDefaultEditBuilder,
	ValueFieldEditBuilder,
	OptionalFieldEditBuilder,
	SequenceFieldEditBuilder,
} from "./default-field-kinds";

export { typeSymbol, getField, parentField, on, contextSymbol, treeStatus } from "./untypedTree";
export type {
	UntypedField,
	UntypedTree,
	UntypedTreeContext,
	UntypedTreeCore,
	UnwrappedUntypedField,
	UnwrappedUntypedTree,
	UntypedTreeOrPrimitive,
	EditableTreeEvents,
} from "./untypedTree";

export { InternalEditableTreeTypes, Skip, getTreeContext } from "./editable-tree-2";
export type {
	FieldNode,
	FlexibleFieldContent,
	FlexibleNodeContent,
	Leaf,
	MapNode,
	OptionalField,
	RequiredField,
	Sequence as Sequence2,
	Struct,
	StructTyped,
	TreeContext,
	TypedField,
	TypedNode,
	TypedNodeUnion,
	Tree,
	TreeField,
	TreeNode,
} from "./editable-tree-2";

// Split into separate import and export for compatibility with API-Extractor.
import * as SchemaAware from "./schema-aware";
export { SchemaAware };
