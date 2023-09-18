/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
export {
	InvalidationToken,
	recordDependency,
	SimpleDependee,
	EmptyKey,
	AnchorSet,
	Delta,
	rootFieldKey,
	rootField,
	fieldSchema,
	CursorLocationType,
	TreeNavigationResult,
	ITreeSubscriptionCursorState,
	ValueSchema,
	anchorSlot,
	AllowedUpdateType,
	LocalCommitSource,
	forbiddenFieldKindIdentifier,
} from "./core";
export type {
	Dependee,
	Dependent,
	NamedComputation,
	ObservingDependent,
	FieldKey,
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
	DeltaVisitor,
	FieldMapObject,
	NodeData,
	GenericTreeNode,
	JsonableTree,
	ITreeCursor,
	ITreeCursorSynchronous,
	GenericFieldsNode,
	AnchorLocator,
	IEditableForest,
	IForestSubscription,
	TreeLocation,
	FieldLocation,
	ForestLocation,
	ITreeSubscriptionCursor,
	TreeSchemaIdentifier,
	FieldStoredSchema,
	TreeStoredSchema,
	StoredSchemaRepository,
	FieldKindIdentifier,
	TreeTypeSet,
	SchemaData,
	FieldAnchor,
	RevisionTag,
	ChangesetLocalId,
	TaggedChange,
	RepairDataStore,
	ReadonlyRepairDataStore,
	SchemaEvents,
	ForestEvents,
	PathRootPrefix,
	AnchorSlot,
	AnchorNode,
	UpPathDefault,
	AnchorEvents,
	AnchorSetRootEvents,
	FieldKindSpecifier,
	PathVisitor,
	Adapters,
	TreeAdapter,
	MapTree,
} from "./core";

export { extractFromOpaque, brand, brandOpaque, fail, TransactionResult } from "./util";
export type {
	Brand,
	Opaque,
	ValueFromBranded,
	NameFromBranded,
	JsonCompatibleReadOnly,
	JsonCompatible,
	JsonCompatibleObject,
	NestedMap,
	IdAllocator,
	BrandedKey,
	BrandedMapSubset,
	RangeEntry,
	Named,
} from "./util";

export { createEmitter } from "./events";
export type {
	Events,
	IsEvent,
	ISubscribable,
	IEmitter,
	NoListenersCallback,
	HasListeners,
} from "./events";

export {
	cursorToJsonObject,
	singleJsonCursor,
	jsonArray,
	jsonBoolean,
	jsonNull,
	jsonNumber,
	jsonObject,
	jsonString,
	jsonSchema,
	nodeKeyField,
	nodeKeySchema,
} from "./domains";

export {
	MemoizedIdRangeAllocator,
	CrossFieldTarget,
	FieldKind,
	Multiplicity,
	isNeverField,
	isEditableTree,
	isEditableField,
	isPrimitive,
	getPrimaryField,
	typeSymbol,
	typeNameSymbol,
	valueSymbol,
	proxyTargetSymbol,
	getField,
	contextSymbol,
	isContextuallyTypedNodeDataObject,
	defaultSchemaPolicy,
	jsonableTreeFromCursor,
	compareLocalNodeKeys,
	localNodeKeySymbol,
	prefixPath,
	prefixFieldPath,
	singleTextCursor,
	singleStackTreeCursor,
	parentField,
	on,
	InternalTypedSchemaTypes,
	SchemaAware,
	FieldKinds,
	cursorFromContextualData,
	SchemaBuilder,
	TreeSchema,
	FieldSchema,
	Any,
	cursorForTypedTreeData,
	NodeExistenceState,
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
	nodeKeyFieldKey,
	TreeStatus,
	treeStatus,
	InternalEditableTreeTypes,
} from "./feature-libraries";
export type {
	IdRange,
	ModularChangeset,
	EditDescription,
	FieldChangeHandler,
	FieldEditor,
	FieldChangeRebaser,
	NodeChangeset,
	FieldChangeMap,
	FieldChangeset,
	FieldChange,
	ToDelta,
	NodeReviver,
	NodeChangeComposer,
	NodeChangeInverter,
	NodeChangeRebaser,
	CrossFieldManager,
	RevisionIndexer,
	RevisionMetadataSource,
	RevisionInfo,
	FullSchemaPolicy,
	UnwrappedEditableField,
	EditableTreeContext,
	UnwrappedEditableTree,
	EditableTreeOrPrimitive,
	EditableTree,
	EditableField,
	ContextuallyTypedNodeDataObject,
	ContextuallyTypedNodeData,
	MarkedArrayLike,
	PrimitiveValue,
	StableNodeKey,
	LocalNodeKey,
	IDefaultEditBuilder,
	ValueFieldEditBuilder,
	OptionalFieldEditBuilder,
	SequenceFieldEditBuilder,
	CursorAdapter,
	CursorWithNode,
	HasFieldChanges,
	EditableTreeEvents,
	ArrayLikeMut,
	ContextuallyTypedFieldData,
	UntypedField,
	UntypedTree,
	UntypedTreeContext,
	UntypedTreeCore,
	UnwrappedUntypedField,
	UnwrappedUntypedTree,
	UntypedTreeOrPrimitive,
	FieldKindTypes,
	AllowedTypes,
	BrandedFieldKind,
	ValueFieldKind,
	Optional,
	Sequence,
	NodeKeyFieldKind,
	Forbidden,
	TypedSchemaCollection,
	SchemaLibrary,
	SchemaLibraryData,
	NewFieldContent,
	NodeExistsConstraint,
	LazyTreeSchema,
	FieldGenerator,
	TreeDataContext,
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
	SchemaLintConfiguration,
	FieldNode,
	FlexibleFieldContent,
	FlexibleNodeContent,
	Leaf,
	MapNode,
	OptionalField,
	RequiredField,
	Sequence2,
	Struct,
	StructTyped,
	TreeContext,
	TypedField,
	TypedNode,
	TypedNodeUnion,
	Tree,
	TreeField,
	TreeNode,
	FieldNodeSchema,
	LeafSchema,
	MapSchema,
	StructSchema,
} from "./feature-libraries";

export { runSynchronous, SharedTreeFactory, ForestType } from "./shared-tree";
export type {
	ISharedTree,
	ISharedTreeView,
	ITransaction,
	SharedTreeOptions,
	ISharedTreeBranchView,
	ViewEvents,
	SchematizeConfiguration,
	TreeContent,
	InitializeAndSchematizeConfiguration,
	SchemaConfiguration,
} from "./shared-tree";

export type {
	IBinaryCodec,
	ICodecFamily,
	ICodecOptions,
	IDecoder,
	IEncoder,
	IJsonCodec,
	IMultiFormatCodec,
	JsonValidator,
	SchemaValidationFunction,
} from "./codec";
export { noopValidator } from "./codec";
export { typeboxValidator } from "./external-utilities";

// Below here are things that are used by the above, but not part of the desired API surface.
import * as InternalTypes from "./internal";
export { InternalTypes };
