/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
export {
	TreeSchema,
	FieldSchema,
	Any,
	allowedTypesToTypeSet,
	schemaIsFieldNode,
	schemaIsLeaf,
	schemaIsMap,
	schemaIsStruct,
} from "./typedTreeSchema";
export type {
	AllowedTypes,
	LazyTreeSchema,
	FieldNodeSchema,
	LeafSchema,
	MapSchema,
	StructSchema,
	TypedSchemaCollection,
	RecursiveTreeSchema,
} from "./typedTreeSchema";

export { ViewSchema } from "./view";

export {
	bannedFieldNames,
	fieldApiPrefixes,
	validateStructFieldName,
	buildViewSchemaCollection,
	schemaLintDefault,
} from "./schemaCollection";
export type { SchemaLibraryData, SchemaLintConfiguration } from "./schemaCollection";

export type { FlexList } from "./flexList";

// Below here are things that are used by the above, but not part of the desired API surface.
import * as InternalTypedSchemaTypes from "./internal";
export { InternalTypedSchemaTypes };
