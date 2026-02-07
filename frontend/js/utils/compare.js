import { getSaved } from "./storage.js";

export function initComparison() {
	const select1 = document.getElementById("compareSelect1");
	const select2 = document.getElementById("compareSelect2");
	const output = document.getElementById("comparisonResults");

	function compare() {
		const name1 = select1.value;
		const name2 = select2.value;

		if (!name1 || !name2 || name1 === name2) {
			output.innerHTML = "";
			return;
		}

		const saved = getSaved();
		const a = saved.find((c) => c.name === name1);
		const b = saved.find((c) => c.name === name2);

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
	const container = document.getElementById("comparisonResults");

	const metrics = [
		{
			label: "Total final cost",
			key: "totalFinalCost",
			format: (v) => `£${v.toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Monthly cost (initial)",
			key: "contractMonthlyCost",
			format: (v) => `£${Number(v).toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Upfront cost",
			key: "contractUpfrontCost",
			format: (v) => `£${Number(v).toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Contract length",
			key: "contractDuration",
			format: (v) => `${v} months`,
			lowerIsBetter: false,
		},
		{
			label: "Annual increase",
			key: "contractIncrease",
			format: (v) => `£${Number(v).toFixed(2)}`,
			lowerIsBetter: true,
		},
		{
			label: "Trade‑in value",
			key: "tradeinAmount",
			format: (v) => `£${Number(v).toFixed(2)}`,
			lowerIsBetter: false,
		},
		{
			label: "Cashback",
			key: "cashbackAmount",
			format: (v) => `£${Number(v).toFixed(2)}`,
			lowerIsBetter: false,
		},
	];

	let html = `
		<div class="compare-grid">
			<div class="compare-header"></div>
			<div class="compare-header">${a.name}</div>
			<div class="compare-header">${b.name}</div>
	`;

	metrics.forEach((m) => {
		const valA = Number(a[m.key]) || 0;
		const valB = Number(b[m.key]) || 0;

		let classA = "neutral";
		let classB = "neutral";

		if (valA !== valB) {
			if (m.lowerIsBetter) {
				classA = valA < valB ? "good" : "bad";
				classB = valB < valA ? "good" : "bad";
			} else {
				classA = valA > valB ? "good" : "bad";
				classB = valB > valA ? "good" : "bad";
			}
		}

		html += `
			<div class="metric">${m.label}</div>
			<div class="value ${classA}">${m.format(valA)}</div>
			<div class="value ${classB}">${m.format(valB)}</div>
		`;
	});

	html += `</div>`;
	container.innerHTML = html;
}
