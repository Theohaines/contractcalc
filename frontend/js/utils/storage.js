import { calculateMetrics } from "./calculator.js";
import { getElement, showToast } from "./ui.js";

const SAVED_KEY = "costify:saved";
const DRAFT_KEY = "costify:draft";

const fieldIds = [
	"contractMonthlyCost",
	"contractUpfrontCost",
	"contractIncrease",
	"contractDuration",
	"tradeinSelected",
	"tradeinAmount",
	"cashbackType",
	"cashbackAmount",
];

function getFieldValues() {
	return Object.fromEntries(fieldIds.map((id) => [id, getElement(id).value]));
}

function setFieldValues(values) {
	Object.entries(values).forEach(([key, value]) => {
		const element = document.getElementById(key);

		if (element) {
			element.value = value;
		}
	});

	getElement("tradeinSelected").dispatchEvent(new Event("change"));
	getElement("cashbackType").dispatchEvent(new Event("change"));
}

export function getSaved() {
	try {
		return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
	} catch {
		return [];
	}
}

export function saveDraft() {
	localStorage.setItem(DRAFT_KEY, JSON.stringify(getFieldValues()));
}

export function loadDraft() {
	try {
		const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");

		if (draft) {
			setFieldValues(draft);
		}
	} catch {
		localStorage.removeItem(DRAFT_KEY);
	}
}

export function saveCalculation() {
	const calculationName = getElement("calculationName");
	const name = calculationName.value.trim();

	if (!name) {
		showToast("Enter a name to save", "error");
		calculationName.focus();
		return;
	}

	const values = getFieldValues();
	const metrics = calculateMetrics({
		monthly: Number(values.contractMonthlyCost) || 0,
		upfront: Number(values.contractUpfrontCost) || 0,
		duration: Number(values.contractDuration) || 0,
		increase: Number(values.contractIncrease) || 0,
		tradein:
			values.tradeinSelected === "tradein"
				? Number(values.tradeinAmount) || 0
				: 0,
		cashback:
			values.cashbackType === "bacs"
				? Number(values.cashbackAmount) || 0
				: 0,
	});

	const saved = getSaved().filter((calculation) => {
		return calculation.name !== name;
	});

	saved.push({
		name,
		...values,
		totalFinalCost: metrics.totalFinalCost,
	});

	localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
	showToast("Calculation saved", "success");
	populateSavedDropdowns();
}

export function deleteCalculation() {
	const calculationName = getElement("calculationName");
	const name = calculationName.value.trim();

	if (!name) {
		showToast("Choose or enter a calculation name first", "error");
		calculationName.focus();
		return;
	}

	const saved = getSaved();
	const updated = saved.filter((calculation) => calculation.name !== name);

	if (updated.length === saved.length) {
		showToast("No saved calculation found with that name", "error");
		return;
	}

	localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
	showToast("Calculation deleted", "success");
	populateSavedDropdowns();
}

export function populateSavedDropdowns() {
	const saved = getSaved();
	const savedCalculationsSelect = getElement("savedCalculationsSelect");
	const compareSelect1 = getElement("compareSelect1");
	const compareSelect2 = getElement("compareSelect2");

	savedCalculationsSelect.innerHTML =
		'<option value="">Load saved...</option>';
	compareSelect1.innerHTML = '<option value="">Compare...</option>';
	compareSelect2.innerHTML = '<option value="">Compare...</option>';

	saved.forEach((calculation) => {
		const label = `${calculation.name} - £${Number(
			calculation.totalFinalCost,
		).toFixed(2)}`;

		savedCalculationsSelect.add(new Option(label, calculation.name));
		compareSelect1.add(new Option(label, calculation.name));
		compareSelect2.add(new Option(label, calculation.name));
	});
}

export function loadCalculation(name) {
	const saved = getSaved().find((calculation) => calculation.name === name);

	if (!saved) {
		return;
	}

	setFieldValues(saved);
	getElement("calculationName").value = saved.name;
	showToast(`Loaded "${name}"`, "info");
}

export function initStorage() {
	loadDraft();
	populateSavedDropdowns();

	getElement("saveBtn").addEventListener("click", saveCalculation);
	getElement("deleteBtn").addEventListener("click", deleteCalculation);

	getElement("savedCalculationsSelect").addEventListener(
		"change",
		(event) => {
			if (event.target.value) {
				loadCalculation(event.target.value);
			}
		},
	);
}
