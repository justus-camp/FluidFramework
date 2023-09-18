/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
export {
	makeCodecFamily,
	makeValueCodec,
	unitCodec,
	withDefaultBinaryEncoding,
	withSchemaValidation,
} from "./codec";
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
export { noopValidator } from "./noopValidator";
