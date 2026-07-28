import { getSaved } from "./storage.js";
import { getElement } from "./ui.js";

export function initComparison() {
	const select1 = getElement("compareSelect1");
	const select2 = getElement("compareSelect2");
	const output = getElement("comparisonResults");

	function compare() {
		const name1 = select1.value;
		const name2 = select2.value;

		if (!name1 || !name2 || name1 === name2) {
			output.innerHTML = "";
			return;
		}

		const saved = getSaved();
		const a = saved.find((calculation) => calculation.name === name1);
		const b = saved.find((calculation) => calculation.name === name2);

		if (!a || !b) {
			output.innerHTML = "";
			return;
		}

		renderGrid(a, b);
	}

	select1.addEventListener("change", compare);
	select2.addEventListener("change", compare);
}

function renderGrid(a, b) {
	const container = getElement("comparisonResults");
	const grid = document.createElement("div");

	grid.className = "compare-grid";
	grid.append(
		createCell("div", "compare-header", ""),
		createCell("div", "compare-header", a.name),
		createCell("div", "compare-header", b.name),
	);

	getMetrics().forEach((metric) => {
		const valueA = Number(a[metric.key]) || 0;
		const valueB = Number(b[metric.key]) || 0;
		const [classA, classB] = getComparisonClasses(
			valueA,
			valueB,
			metric.lowerIsBetter,
		);

		grid.append(
			createCell("div", "metric", metric.label),
			createCell("div", `value ${classA}`, metric.format(valueA)),
			createCell("div", `value ${classB}`, metric.format(valueB)),
		);
	});

	container.replaceChildren(grid);
}

function createCell(tagName, className, text) {
	const element = document.createElement(tagName);

	element.className = className;
	element.textContent = text;

	return element;
}

function getComparisonClasses(valueA, valueB, lowerIsBetter) {
	if (valueA === valueB) {
		return ["neutral", "neutral"];
	}

	if (lowerIsBetter) {
		return valueA < valueB ? ["good", "bad"] : ["bad", "good"];
	}

	return valueA > valueB ? ["good", "bad"] : ["bad", "good"];
}

function getMetrics() {
	return [
		{
			label: "Total final cost",
			key: "totalFinalCost",
			format: (value) => `£${value.toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Monthly cost",
			key: "contractMonthlyCost",
			format: (value) => `£${value.toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Upfront cost",
			key: "contractUpfrontCost",
			format: (value) => `£${value.toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Contract length",
			key: "contractDuration",
			format: (value) => `${value} months`,
			lowerIsBetter: false,
		},
		{
			label: "Annual increase",
			key: "contractIncrease",
			format: (value) => `£${value.toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Trade-in value",
			key: "tradeinAmount",
			format: (value) => `£${value.toFixed(2)}`,
			lowerIsBetter: false,
		},
		{
			label: "Cashback",
			key: "cashbackAmount",
			format: (value) => `£${value.toFixed(2)}`,
			lowerIsBetter: false,
		},
	];
}
