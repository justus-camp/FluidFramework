/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
export {
	brand,
	BrandedType,
	brandOpaque,
	brandedNumberType,
	brandedStringType,
	extractFromOpaque,
} from "./brand";
export type { Brand, ExtractFromOpaque, NameFromBranded, Opaque, ValueFromBranded } from "./brand";
export {
	deleteFromNestedMap,
	getOrAddInMap,
	getOrAddInNestedMap,
	getOrDefaultInNestedMap,
	SizedNestedMap,
	setInNestedMap,
	tryAddToNestedMap,
	tryGetFromNestedMap,
} from "./nestedMap";
export type { NestedMap } from "./nestedMap";
export { addToNestedSet, nestedSetContains } from "./nestedSet";
export type { NestedSet } from "./nestedSet";
export { OffsetListFactory } from "./offsetList";
export type { OffsetList } from "./offsetList";
export { TransactionResult } from "./transactionResult";
export type {
	areSafelyAssignable,
	Bivariant,
	Contravariant,
	Covariant,
	eitherIsAny,
	EnforceTypeCheckTests,
	Invariant,
	isAny,
	isAssignableTo,
	isStrictSubset,
	MakeNominal,
	requireFalse,
	requireTrue,
	requireAssignableTo,
} from "./typeCheck";
export { StackyIterator } from "./stackyIterator";
export {
	asMutable,
	clone,
	compareSets,
	fail,
	getOrAddEmptyToMap,
	getOrCreate,
	isJsonObject,
	isReadonlyArray,
	JsonCompatibleReadOnlySchema,
	makeArray,
	mapIterable,
	zipIterables,
	assertValidIndex,
	assertNonNegativeSafeInteger,
	generateStableId,
	useDeterministicStableId,
	objectToMap,
	oneFromSet,
	disposeSymbol,
	capitalize,
} from "./utils";
export type {
	JsonCompatible,
	JsonCompatibleObject,
	JsonCompatibleReadOnly,
	Mutable,
	RecursiveReadonly,
	Assume,
	Named,
	IDisposable,
} from "./utils";
export { ReferenceCountedBase } from "./referenceCounting";
export type { ReferenceCounted } from "./referenceCounting";

export type {
	AllowOptional,
	RequiredFields,
	OptionalFields,
	_InlineTrick,
	_RecursiveTrick,
	FlattenKeys,
	AllowOptionalNotFlattened,
	RestrictiveReadonlyRecord,
} from "./typeUtils";

export { getOrCreateSlotContent, brandedSlot } from "./brandedMap";
export type { BrandedKey, BrandedKeyContent, BrandedMapSubset } from "./brandedMap";

export { getFirstFromRangeMap, setInRangeMap } from "./rangeMap";
export type { RangeEntry, RangeMap } from "./rangeMap";

export { idAllocatorFromMaxId, idAllocatorFromState } from "./idAllocator";
export type { IdAllocator, IdAllocationState } from "./idAllocator";
