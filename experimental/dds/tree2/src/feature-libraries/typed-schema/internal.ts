/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// Used by public types, but not part of the desired API surface

export type { ObjectToMap, WithDefault, Unbrand, UnbrandList, ArrayToUnion } from "./typeUtils";

export type {
	TreeSchemaSpecification,
	NormalizeStructFieldsInner,
	NormalizeStructFields,
	NormalizeField,
	Fields,
	StructSchemaSpecification,
	MapSchemaSpecification,
	LeafSchemaSpecification,
	MapFieldSchema,
	RecursiveTreeSchemaSpecification,
	RecursiveTreeSchema,
} from "./typedTreeSchema";

export type {
	FlexList,
	FlexListToNonLazyArray,
	ConstantFlexListToNonLazyArray,
	LazyItem,
	NormalizedFlexList,
	ExtractItemType,
	ArrayHasFixedLength,
	ExtractListItemType,
} from "./flexList";
