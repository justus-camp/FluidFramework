/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { FieldChangeHandler } from "../modular-schema";
import type { Changeset } from "./format";
import { sequenceFieldChangeRebaser } from "./sequenceFieldChangeRebaser";
import { sequenceFieldChangeCodecFactory } from "./sequenceFieldChangeEncoder";
import { SequenceFieldEditor, sequenceFieldEditor } from "./sequenceFieldEditor";
import { sequenceFieldToDelta } from "./sequenceFieldToDelta";
import { isEmpty } from "./utils";

export type SequenceFieldChangeHandler = FieldChangeHandler<Changeset, SequenceFieldEditor>;

export const sequenceFieldChangeHandler: SequenceFieldChangeHandler = {
	rebaser: sequenceFieldChangeRebaser,
	codecsFactory: sequenceFieldChangeCodecFactory,
	editor: sequenceFieldEditor,
	intoDelta: sequenceFieldToDelta,
	isEmpty,
};
