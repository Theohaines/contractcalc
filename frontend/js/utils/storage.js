import { calculateMetrics } from "./calculator.js";
import { showToast } from "./ui.js";

const SAVED_KEY = "costify:saved";
const DRAFT_KEY = "costify:draft";

export function getSaved() {
	return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
}

export function saveDraft() {
	const draft = {
		contractMonthlyCost: contractMonthlyCost.value,
		contractUpfrontCost: contractUpfrontCost.value,
		contractIncrease: contractIncrease.value,
		contractDuration: contractDuration.value,
		tradeinSelected: tradeinSelected.value,
		tradeinAmount: tradeinAmount.value,
		cashbackType: cashbackType.value,
		cashbackAmount: cashbackAmount.value,
	};
	localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadDraft() {
	const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
	if (!draft) return;

	Object.entries(draft).forEach(([key, val]) => {
		if (window[key]) window[key].value = val;
	});
}

export function saveCalculation() {
	if (!calculationName.value.trim()) {
		showToast("Enter a name to save", "error");
		return;
	}

	const metrics = calculateMetrics({
		monthly: +contractMonthlyCost.value,
		upfront: +contractUpfrontCost.value,
		duration: +contractDuration.value,
		increase: +contractIncrease.value,
		tradein: tradeinSelected.value === "tradein" ? +tradeinAmount.value : 0,
		cashback: cashbackType.value === "bacs" ? +cashbackAmount.value : 0,
	});

	const saved = getSaved().filter((c) => c.name !== calculationName.value);

	saved.push({
		name: calculationName.value,
		contractMonthlyCost: contractMonthlyCost.value,
		contractUpfrontCost: contractUpfrontCost.value,
		contractIncrease: contractIncrease.value,
		contractDuration: contractDuration.value,
		tradeinSelected: tradeinSelected.value,
		tradeinAmount: tradeinAmount.value,
		cashbackType: cashbackType.value,
		cashbackAmount: cashbackAmount.value,
		totalFinalCost: metrics.totalFinalCost,
	});

	localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
	showToast("Calculation saved");
	populateSavedDropdowns();
}

export function deleteCalculation() {
	const name = calculationName.value;
	if (!name) return;

	const saved = getSaved().filter((c) => c.name !== name);
	localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
	showToast("Calculation deleted");
	populateSavedDropdowns();
}

export function populateSavedDropdowns() {
	const saved = getSaved();

	savedCalculationsSelect.innerHTML = '<option value="">Load saved…</option>';
	compareSelect1.innerHTML = '<option value="">Compare…</option>';
	compareSelect2.innerHTML = '<option value="">Compare…</option>';

	saved.forEach((calc) => {
		const opt = new Option(
			`${calc.name} – £${calc.totalFinalCost.toFixed(2)}`,
			calc.name,
		);
		savedCalculationsSelect.add(opt.cloneNode(true));
		compareSelect1.add(opt.cloneNode(true));
		compareSelect2.add(opt.cloneNode(true));
	});
}

export function loadCalculation(name) {
	const saved = getSaved().find((c) => c.name === name);
	if (!saved) return;

	Object.entries(saved).forEach(([key, val]) => {
		if (window[key]) window[key].value = val;
	});

	showToast(`Loaded "${name}"`);
}

export function initStorage() {
	loadDraft();
	populateSavedDropdowns();

	document
		.getElementById("saveBtn")
		.addEventListener("click", saveCalculation);

	document
		.getElementById("deleteBtn")
		.addEventListener("click", deleteCalculation);

	savedCalculationsSelect.addEventListener("change", (e) => {
		if (e.target.value) loadCalculation(e.target.value);
	});
}
