/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
	IGarbageCollectionData,
	ISummaryTreeWithStats,
	ITelemetryContext,
} from "@fluidframework/runtime-definitions";
import { createSingleBlobSummary } from "@fluidframework/shared-object-base";
import { IChannelStorageService } from "@fluidframework/datastore-definitions";
import { bufferToString } from "@fluid-internal/client-utils";
import { DetachedFieldIndex } from "../core/index.js";
import {
	Summarizable,
	SummaryElementParser,
	SummaryElementStringifier,
} from "../shared-tree-core/index.js";
import { JsonCompatibleReadOnly } from "../util/index.js";

/**
 * The storage key for the blob in the summary containing schema data
 */
const detachedFieldIndexBlobKey = "DetachedFieldIndexBlob";

/**
 * Provides methods for summarizing and loading a tree index.
 */
export class DetachedFieldIndexSummarizer implements Summarizable {
	public readonly key = "DetachedFieldIndex";

	public constructor(private readonly detachedFieldIndex: DetachedFieldIndex) {}

	public getAttachSummary(
		stringify: SummaryElementStringifier,
		fullTree?: boolean,
		trackState?: boolean,
		telemetryContext?: ITelemetryContext,
	): ISummaryTreeWithStats {
		const data = this.detachedFieldIndex.encode();
		return createSingleBlobSummary(detachedFieldIndexBlobKey, stringify(data));
	}

	public async summarize(
		stringify: SummaryElementStringifier,
		fullTree?: boolean,
		trackState?: boolean,
		telemetryContext?: ITelemetryContext,
	): Promise<ISummaryTreeWithStats> {
		return this.getAttachSummary(stringify, fullTree, trackState, telemetryContext);
	}

	public getGCData(fullGC?: boolean): IGarbageCollectionData {
		// TODO: Properly implement garbage collection. Right now, garbage collection is performed automatically
		// by the code in SharedObject (from which SharedTreeCore extends). The `runtime.uploadBlob` API delegates
		// to the `BlobManager`, which automatically populates the summary with ISummaryAttachment entries for each
		// blob.
		return {
			gcNodes: {},
		};
	}

	public async load(
		services: IChannelStorageService,
		parse: SummaryElementParser,
	): Promise<void> {
		if (await services.contains(detachedFieldIndexBlobKey)) {
			const detachedFieldIndexBuffer = await services.readBlob(detachedFieldIndexBlobKey);
			const treeBufferString = bufferToString(detachedFieldIndexBuffer, "utf8");
			const parsed = parse(treeBufferString) as JsonCompatibleReadOnly;
			this.detachedFieldIndex.loadData(parsed);
		}
	}
}
