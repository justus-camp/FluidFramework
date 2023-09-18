/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// Used by public types, but not part of the desired API surface.
export { BrandedType } from "./util";
export type {
	MakeNominal,
	Invariant,
	Contravariant,
	Covariant,
	ExtractFromOpaque,
	Assume,
	AllowOptional,
	RequiredFields,
	OptionalFields,
	_InlineTrick,
	_RecursiveTrick,
	FlattenKeys,
	AllowOptionalNotFlattened,
	isAny,
	RestrictiveReadonlyRecord,
	BrandedKeyContent,
} from "./util";
