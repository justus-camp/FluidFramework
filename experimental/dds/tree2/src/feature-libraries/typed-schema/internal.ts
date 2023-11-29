/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// Used by public types, but not part of the desired API surface

export { ObjectToMap, WithDefault, Unbrand, UnbrandList, ArrayToUnion } from "./typeUtils";

export {
	NormalizeObjectNodeFields,
	NormalizeField,
	Fields,
	MapFieldSchema,
} from "./typedTreeSchema";

export {
	FlexList,
	FlexListToNonLazyArray,
	ConstantFlexListToNonLazyArray,
	LazyItem,
	NormalizedFlexList,
	ExtractItemType,
	ArrayHasFixedLength,
	ExtractListItemType,
	FlexListToUnion,
} from "./flexList";
