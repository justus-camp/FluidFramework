/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	isNeverField,
	isNeverTree,
	allowsRepoSuperset,
	allowsTreeSchemaIdentifierSuperset,
	allowsFieldSuperset,
	allowsTreeSuperset,
} from "./comparison";
export { addCrossFieldQuery, CrossFieldTarget, setInCrossFieldMap } from "./crossFieldQueries";
export type { CrossFieldManager, CrossFieldMap, CrossFieldQuerySet } from "./crossFieldQueries";
export { ChangesetLocalIdSchema, EncodedChangeAtomId } from "./modularChangeFormat";
export { FieldKind, Multiplicity, brandedFieldKind } from "./fieldKind";
export type { FullSchemaPolicy, BrandedFieldKind } from "./fieldKind";
export {
	getIntention,
	referenceFreeFieldChangeRebaser,
	NodeExistenceState,
} from "./fieldChangeHandler";
export type {
	FieldChangeHandler,
	FieldChangeRebaser,
	FieldEditor,
	NodeChangeComposer,
	NodeChangeInverter,
	NodeChangeRebaser,
	NodeReviver,
	RevisionMetadataSource,
	RevisionIndexer,
	ToDelta,
} from "./fieldChangeHandler";
export type {
	FieldChange,
	FieldChangeMap,
	FieldChangeset,
	HasFieldChanges,
	ModularChangeset,
	NodeChangeset,
	RevisionInfo,
	NodeExistsConstraint,
} from "./modularChangeTypes";
export { convertGenericChange, genericChangeHandler, genericFieldKind } from "./genericFieldKind";
export type { GenericChange, GenericChangeset } from "./genericFieldKindTypes";
export {
	ModularChangeFamily,
	ModularEditBuilder,
	revisionMetadataSourceFromInfo,
} from "./modularChangeFamily";
export type { EditDescription } from "./modularChangeFamily";
