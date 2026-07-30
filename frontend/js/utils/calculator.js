import { saveDraft } from "./storage.js";
import { getElement, showToast } from "./ui.js";

export function calculateMetrics({
	monthly,
	upfront,
	duration,
	increase,
	tradein,
	cashback,
	startDate,
}) {
	let totalMonthly = 0;
	let currentMonthly = Math.max(monthly, 0);
	const safeDuration = Math.max(Math.floor(duration), 0);
	const safeIncrease = Math.max(increase, 0);

	const start = startDate ? new Date(startDate) : new Date();
	const startMonth = start.getMonth();
	const startYear = start.getFullYear();

	for (let month = 1; month <= safeDuration; month += 1) {
		totalMonthly += currentMonthly;

		const currentDate = new Date(startYear, startMonth + month, 1);
		const currentDateMonth = currentDate.getMonth();

		if (currentDateMonth === 3 && month < safeDuration) {
			currentMonthly += safeIncrease;
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
			startDate: getElement("contractStartDate")?.value || null,
		});

		youPayText.textContent = `£${metrics.totalFinalCost.toFixed(2)}`;

		saveDraft();
		showToast("Calculation updated", "success");
	});
}
