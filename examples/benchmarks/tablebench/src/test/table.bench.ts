/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { NodeFromSchema, SharedTree } from "@fluidframework/tree";
import { SharedMatrix } from "@fluidframework/matrix";
import { benchmark, BenchmarkType, isInPerformanceTestingMode } from "@fluid-tools/benchmark";
import { IChannel } from "@fluidframework/datastore-definitions";
import { generateTable, Table } from "..";
import { create, measureAttachmentSummary, measureEncodedLength } from "./utils";

const numRows = isInPerformanceTestingMode ? 10000 : 100;

describe("Table", () => {
	const data = generateTable(numRows);

	describe(`compute over ${numRows} rows`, () => {
		let table: NodeFromSchema<typeof Table>;
		let matrix: SharedMatrix;

		let channel: IChannel;
		let processAllMessages: () => void;

		const columnNames = Object.keys(data[0]);
		const unitsSoldColumn = columnNames.indexOf("Units Sold");
		const unitPriceColumn = columnNames.indexOf("Unit Price");
		const unitCostColumn = columnNames.indexOf("Unit Cost");
		const totalRevenueColumn = columnNames.indexOf("Total Revenue");
		const totalCostColumn = columnNames.indexOf("Total Cost");
		const totalProfitColumn = columnNames.indexOf("Total Profit");

		benchmark({
			type: BenchmarkType.Measurement,
			title: `SharedMatrix`,
			before: () => {
				({ channel, processAllMessages } = create(SharedMatrix.getFactory()));
				matrix = channel as SharedMatrix;
				matrix.insertCols(0, columnNames.length);
				matrix.insertRows(0, data.length);

				for (let r = 0; r < data.length; r++) {
					for (const [c, key] of columnNames.entries()) {
						matrix.setCell(r, c, (data as any)[r][key]);
					}
				}
				processAllMessages();
			},
			benchmarkFn: () => {
				for (let r = 0; r < matrix.rowCount; r++) {
					const unitsSold = matrix.getCell(r, unitsSoldColumn) as number;
					const unitPrice = matrix.getCell(r, unitPriceColumn) as number;
					const unitCost = matrix.getCell(r, unitCostColumn) as number;

					const totalRevenue = unitsSold * unitPrice;
					const totalCost = unitsSold * unitCost;
					const totalProfit = totalRevenue - totalCost;

					matrix.setCell(r, totalRevenueColumn, totalRevenue);
					matrix.setCell(r, totalCostColumn, totalCost);
					matrix.setCell(r, totalProfitColumn, totalProfit);
				}
				processAllMessages();
			},
		});

		benchmark({
			type: BenchmarkType.Measurement,
			title: `SharedTree`,
			before: () => {
				({ channel, processAllMessages } = create(SharedTree.getFactory()));
				const tree = channel as SharedTree;

				const view = tree.schematize({
					schema: Table,
					initialTree: () => data,
				});

				table = view.root;

				processAllMessages();
			},
			benchmarkFn: () => {
				for (const row of table) {
					const unitsSold = row["Units Sold"];
					const unitPrice = row["Unit Price"];
					const unitCost = row["Unit Cost"];

					const totalRevenue = unitsSold * unitPrice;
					const totalCost = unitsSold * unitCost;
					const totalProfit = totalRevenue - totalCost;

					row["Total Revenue"] = totalRevenue;
					row["Total Cost"] = totalCost;
					row["Total Profit"] = totalProfit;
				}
				processAllMessages();
			},
		});
	});

	describe("attachment summary size", () => {
		let tree: SharedTree;
		let matrix: SharedMatrix;

		const dataBytes = measureEncodedLength(JSON.stringify(data));
		let summaryBytes: number;

		afterEach(() => {
			const ratio = summaryBytes / dataBytes;

			process.stdout.write(`Data: ${dataBytes} bytes\n`);
			process.stdout.write(`Summary: ${summaryBytes} bytes\n`);
			process.stdout.write(`Ratio: ${ratio}\n`);
		});

		it("SharedMatrix", () => {
			const columnNames = Object.keys(data[0]);

			const { channel, processAllMessages } = create(SharedMatrix.getFactory());
			matrix = channel as SharedMatrix;
			matrix.insertCols(0, columnNames.length);
			matrix.insertRows(0, data.length);

			for (let r = 0; r < data.length; r++) {
				for (const [c, key] of columnNames.entries()) {
					matrix.setCell(r, c, (data as any)[r][key]);
				}
			}

			processAllMessages();
			summaryBytes = measureAttachmentSummary(channel);
		});

		it("SharedTree", () => {
			const { channel, processAllMessages } = create(SharedTree.getFactory());
			tree = channel as SharedTree;

			tree.schematize({
				schema: Table,
				initialTree: () => data,
			});

			processAllMessages();
			summaryBytes = measureAttachmentSummary(channel);
		});
	});
});
