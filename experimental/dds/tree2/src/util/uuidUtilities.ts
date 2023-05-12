/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { v4, NIL } from "uuid";

/**
 * A 128-bit Universally Unique IDentifier. Represented here
 * with a string of the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx,
 * where x is a lowercase hex digit.
 * @public
 */
export type UuidString = string & { readonly UuidString: "9d40d0ae-90d9-44b1-9482-9f55d59d5465" };

/**
 * A version 4, variant 2 uuid (https://datatracker.ietf.org/doc/html/rfc4122).
 * @internal
 */
export type StableId = UuidString & { readonly StableId: "53172b0d-a3d5-41ea-bd75-b43839c97f5a" };

const hexadecimalCharCodes = Array.from("09afAF").map((c) => c.charCodeAt(0)) as [
	zero: number,
	nine: number,
	a: number,
	f: number,
	A: number,
	F: number,
];

function isHexadecimalCharacter(charCode: number): boolean {
	return (
		(charCode >= hexadecimalCharCodes[0] && charCode <= hexadecimalCharCodes[1]) ||
		(charCode >= hexadecimalCharCodes[2] && charCode <= hexadecimalCharCodes[3]) ||
		(charCode >= hexadecimalCharCodes[4] && charCode <= hexadecimalCharCodes[5])
	);
}

/** The null (lowest/all-zeros) UUID */
export const nilUuid = assertIsUuidString(NIL);

/**
 * Asserts that the given string is a UUID
 */
export function assertIsUuidString(uuidString: string): UuidString {
	return uuidString as UuidString;
}

/**
 * Returns true iff the given string is a valid UUID-like string of hexadecimal characters
 * 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
 */
export function isUuidString(str: string): str is UuidString {
	for (let i = 0; i < str.length; i++) {
		switch (i) {
			case 8:
			case 13:
			case 18:
			case 23:
				if (str.charAt(i) !== "-") {
					return false;
				}
				break;

			default:
				if (!isHexadecimalCharacter(str.charCodeAt(i))) {
					return false;
				}
				break;
		}
	}

	return true;
}

/**
 * Generate a random stable ID
 */
export function generateStableId(): StableId {
	return assertIsStableId(v4());
}

/**
 * Asserts that the given string is a stable ID.
 */
export function assertIsStableId(stableId: string): StableId {
	return stableId as StableId;
}

/**
 * Returns true iff the given string is a valid Version 4, variant 2 UUID
 * 'xxxxxxxx-xxxx-4xxx-vxxx-xxxxxxxxxxxx'
 */
export function isStableId(str: string): str is StableId {
	if (str.length !== 36) {
		return false;
	}

	for (let i = 0; i < str.length; i++) {
		switch (i) {
			case 8:
			case 13:
			case 18:
			case 23:
				if (str.charAt(i) !== "-") {
					return false;
				}
				break;

			case 14:
				if (str.charAt(i) !== "4") {
					return false;
				}
				break;

			case 19: {
				const char = str.charAt(i);
				if (char !== "8" && char !== "9" && char !== "a" && char !== "b") {
					return false;
				}
				break;
			}

			default:
				if (!isHexadecimalCharacter(str.charCodeAt(i))) {
					return false;
				}
				break;
		}
	}

	return true;
}
