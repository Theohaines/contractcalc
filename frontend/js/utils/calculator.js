import { showToast } from "./ui.js";
import { saveDraft } from "./storage.js";

export function calculateMetrics({
	monthly,
	upfront,
	duration,
	increase,
	tradein,
	cashback,
}) {
	let totalMonthly = 0;
	let current = monthly;

	for (let m = 1; m <= duration; m++) {
		totalMonthly += current;
		if (m % 12 === 0 && m !== duration) {
			current += increase;
		}
	}

	let total =
		totalMonthly + upfront - Math.max(tradein, 0) - Math.max(cashback, 0);

	return {
		totalFinalCost: total,
		effectiveMonthly: duration > 0 ? total / duration : 0,
	};
}

export function initCalculator() {
	const calculateBtn = document.getElementById("calculateBtn");
	const youPayText = document.getElementById("youPayText");

	calculateBtn.addEventListener("click", () => {
		const metrics = calculateMetrics({
			monthly: +contractMonthlyCost.value || 0,
			upfront: +contractUpfrontCost.value || 0,
			duration: +contractDuration.value || 0,
			increase: +contractIncrease.value || 0,
			tradein:
				tradeinSelected.value === "tradein" ? +tradeinAmount.value : 0,
			cashback: cashbackType.value === "bacs" ? +cashbackAmount.value : 0,
		});

		youPayText.textContent = `You pay: £${metrics.totalFinalCost.toFixed(
			2,
		)}`;

		saveDraft();
		showToast("Calculation updated");
	});
}
