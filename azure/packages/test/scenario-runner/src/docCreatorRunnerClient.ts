/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import commander from "commander";

import { AzureClient } from "@fluidframework/azure-client";
import { IFluidContainer } from "@fluidframework/fluid-static";
import { PerformanceEvent } from "@fluidframework/telemetry-utils";
import { timeoutPromise } from "@fluidframework/test-utils";

import { ConnectionState } from "@fluidframework/container-loader";
import { ContainerFactorySchema } from "./interface";
import { getLogger, loggerP } from "./logger";
import { createAzureClient, loadInitialObjSchema } from "./utils";

const eventMap = new Map([
	[
		"fluid:telemetry:RouterliciousDriver:FetchOrdererToken",
		"scenario:runner:DocCreator:Attach:FetchOrdererToken",
	],
	[
		"fluid:telemetry:RouterliciousDriver:CreateNew",
		"scenario:runner:DocCreator:Attach:CreateNew",
	],
	[
		"fluid:telemetry:RouterliciousDriver:DocPostCreateCallback",
		"scenario:runner:DocCreator:Attach:DocPostCreateCallback",
	],
	[
		"fluid:telemetry:RouterliciousDriver:FetchStorageToken",
		"scenario:runner:DocCreator:Attach:FetchStorageToken",
	],
	[
		"fluid:telemetry:RouterliciousDriver:GetDeltaStreamToken",
		"scenario:runner:DocCreator:Connection:GetDeltaStreamToken",
	],
	[
		"fluid:telemetry:RouterliciousDriver:ConnectToDeltaStream",
		"scenario:runner:DocCreator:Connection:ConnectToDeltaStream",
	],
	[
		"fluid:telemetry:Container:ConnectionStateChange",
		"scenario:runner:DocCreator:Connection:ConnectionStateChange",
	],
]);

export interface DocCreatorRunnerConfig {
	runId: string;
	scenarioName: string;
	childId: number;
	connType: string;
	connEndpoint: string;
	region?: string;
}

async function main() {
	const parseIntArg = (value: any): number => {
		if (isNaN(parseInt(value, 10))) {
			throw new commander.InvalidArgumentError("Not a number.");
		}
		return parseInt(value, 10);
	};
	commander
		.version("0.0.1")
		.requiredOption("-s, --schema <schema>", "Container Schema")
		.requiredOption("-r, --runId <runId>", "orchestrator run id.")
		.requiredOption("-s, --scenarioName <scenarioName>", "scenario name.")
		.requiredOption("-c, --childId <childId>", "id of this node client.", parseIntArg)
		.requiredOption("-ct, --connType <connType>", "Connection type")
		.option("-ce, --connEndpoint <connEndpoint>", "Connection endpoint")
		.option("-ti, --tenantId <tenantId>", "Tenant ID")
		.option("-tk, --tenantKey <tenantKey>", "Tenant Key")
		.option("-furl, --functionUrl <functionUrl>", "Azure Function URL")
		.option("-st, --secureTokenProvider", "Enable use of secure token provider")
		.option("-rg, --region <region>", "Alias of Azure region where the tenant is running from")
		.option(
			"-l, --log <filter>",
			"Filter debug logging. If not provided, uses DEBUG env variable.",
		)
		.requiredOption("-v, --verbose", "Enables verbose logging")
		.parse(process.argv);

	const config = {
		runId: commander.runId,
		scenarioName: commander.scenarioName,
		childId: commander.childId,
		connType: commander.connType,
		connEndpoint: commander.connEndpoint ?? process.env.azure__fluid__relay__service__endpoint,
		tenantId: commander.tenantId ?? process.env.azure__fluid__relay__service__tenantId,
		tenantKey: commander.tenantKey ?? process.env.azure__fluid__relay__service__tenantKey,
		functionUrl:
			commander.functionUrl ?? process.env.azure__fluid__relay__service__function__url,
		secureTokenProvider: commander.secureTokenProvider,
		region: commander.region ?? process.env.azure__fluid__relay__service__region,
	};

	if (commander.log !== undefined) {
		process.env.DEBUG = commander.log;
	}

	const logger = await getLogger(
		{
			runId: config.runId,
			scenarioName: config.scenarioName,
			endpoint: config.connEndpoint,
			region: config.region,
		},
		["scenario:runner"],
		eventMap,
	);

	const ac = await createAzureClient({
		userId: `testUserId_${config.childId}`,
		userName: `testUserName_${config.childId}`,
		connType: config.connType,
		connEndpoint: config.connEndpoint,
		tenantId: config.tenantId,
		tenantKey: config.tenantKey,
		functionUrl: config.functionUrl,
		secureTokenProvider: config.secureTokenProvider,
		logger,
	});

	await execRun(ac, config);
	process.exit(0);
}

async function execRun(ac: AzureClient, config: DocCreatorRunnerConfig): Promise<void> {
	let schema;
	const logger = await getLogger(
		{
			runId: config.runId,
			scenarioName: config.scenarioName,
			namespace: "scenario:runner:DocCreator",
			endpoint: config.connEndpoint,
			region: config.region,
		},
		["scenario:runner"],
		eventMap,
	);

	try {
		schema = loadInitialObjSchema(JSON.parse(commander.schema) as ContainerFactorySchema);
	} catch {
		throw new Error("Invalid schema provided.");
	}

	let container: IFluidContainer;
	try {
		({ container } = await PerformanceEvent.timedExecAsync(
			logger,
			{ eventName: "create" },
			async () => {
				return ac.createContainer(schema);
			},
			{ start: true, end: true, cancel: "generic" },
		));
	} catch (error) {
		throw new Error(`Unable to create container. ${error}`);
	}

	let id: string;
	try {
		id = await PerformanceEvent.timedExecAsync(
			logger,
			{ eventName: "attach" },
			async () => {
				return container.attach();
			},
			{ start: true, end: true, cancel: "generic" },
		);
	} catch {
		throw new Error("Unable to attach container.");
	}

	await PerformanceEvent.timedExecAsync(
		logger,
		{ eventName: "connected" },
		async () => {
			if (container.connectionState !== ConnectionState.Connected) {
				return timeoutPromise((resolve) => container.once("connected", () => resolve()), {
					durationMs: 60000,
					errorMsg: "container connect() timeout",
				});
			}
		},
		{ start: true, end: true, cancel: "generic" },
	);

	process.send?.(id);

	const scenarioLogger = await loggerP;
	await scenarioLogger.flush();
}

main().catch((error) => {
	console.error(error);
	process.exit(-1);
});
