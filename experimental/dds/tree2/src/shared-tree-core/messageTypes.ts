/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { GraphCommit, SessionId } from "../core";

export interface DecodedMessage<TChange> {
	commit: GraphCommit<TChange>;
	sessionId: SessionId;
}
