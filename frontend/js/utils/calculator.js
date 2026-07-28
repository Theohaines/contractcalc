import { saveDraft } from "./storage.js";
import { getElement, showToast } from "./ui.js";

export function calculateMetrics({
	monthly,
	upfront,
	duration,
	increase,
	tradein,
	cashback,
}) {
	let totalMonthly = 0;
	let currentMonthly = Math.max(monthly, 0);
	const safeDuration = Math.max(Math.floor(duration), 0);

	for (let month = 1; month <= safeDuration; month += 1) {
		totalMonthly += currentMonthly;

		if (month % 12 === 0 && month !== safeDuration) {
			currentMonthly += Math.max(increase, 0);
		}
	}

	const totalFinalCost =
		totalMonthly +
		Math.max(upfront, 0) -
		Math.max(tradein, 0) -
		Math.max(cashback, 0);

	return {
		totalFinalCost,
		effectiveMonthly: safeDuration > 0 ? totalFinalCost / safeDuration : 0,
	};
}

export function initCalculator() {
	const calculatorForm = getElement("calculatorForm");
	const youPayText = getElement("youPayText");

	calculatorForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const metrics = calculateMetrics({
			monthly: Number(getElement("contractMonthlyCost").value) || 0,
			upfront: Number(getElement("contractUpfrontCost").value) || 0,
			duration: Number(getElement("contractDuration").value) || 0,
			increase: Number(getElement("contractIncrease").value) || 0,
			tradein:
				getElement("tradeinSelected").value === "tradein"
					? Number(getElement("tradeinAmount").value) || 0
					: 0,
			cashback:
				getElement("cashbackType").value === "bacs"
					? Number(getElement("cashbackAmount").value) || 0
					: 0,
		});

		youPayText.textContent = `£${metrics.totalFinalCost.toFixed(2)}`;

		saveDraft();
		showToast("Calculation updated", "success");
	});
}
