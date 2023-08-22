/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDeltaManager, ReadOnlyInfo } from "@fluidframework/container-definitions";
import { IDocumentMessage, ISequencedDocumentMessage } from "@fluidframework/protocol-definitions";

import { DeltaManagerProxyBase } from "./deltaManagerProxyBase";
import { summarizerClientType } from "./summary";

/**
 * Proxy to the real IDeltaManager for restricting certain access to layers below container runtime in summarizer clients:
 * - Summarizer client should be read-only to layers below the container runtime to restrict local changes.
 * - Summarizer client should not be active to layers below the container runtime to restrict local changes.
 */
export class DeltaManagerSummarizerProxy
	extends DeltaManagerProxyBase
	implements IDeltaManager<ISequencedDocumentMessage, IDocumentMessage>
{
	public get active(): boolean {
		// Summarize clients should not be active. There shouldn't be any local changes (writes) in the summarizer
		// except for the SummarizeOp which is generated by the runtime.
		return !this.isSummarizerClient && this.deltaManager.active;
	}

	public get readOnlyInfo(): ReadOnlyInfo {
		// Summarizer clients should be read-only as far as the runtime and layers below are concerned. There shouldn't
		// be any local changes (writes) in the summarizer except for the summarize op which is generated by the runtime.
		if (this.isSummarizerClient) {
			return {
				readonly: true,
				forced: false,
				permissions: undefined,
				storageOnly: false,
			};
		}
		return this.deltaManager.readOnlyInfo;
	}

	private readonly isSummarizerClient: boolean;

	constructor(deltaManager: IDeltaManager<ISequencedDocumentMessage, IDocumentMessage>) {
		super(deltaManager);
		// We are expecting this class to have many listeners, so we suppress noisy "MaxListenersExceededWarning" logging.
		super.setMaxListeners(0);
		this.isSummarizerClient = this.deltaManager.clientDetails.type === summarizerClientType;
	}
}
