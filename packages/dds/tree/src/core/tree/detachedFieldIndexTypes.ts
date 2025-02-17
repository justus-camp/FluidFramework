/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { NestedMap } from "../../util/index.js";
import { RevisionTag } from "../rebase/index.js";
import { ForestRootId } from "./detachedFieldIndex.js";

export type Major = RevisionTag | undefined;
export type Minor = number;

export interface DetachedFieldSummaryData {
	data: NestedMap<Major, Minor, ForestRootId>;
	maxId: ForestRootId;
}
