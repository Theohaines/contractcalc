import { initUI } from "./utils/ui.js";
import { initStorage } from "./utils/storage.js";
import { initComparison } from "./utils/compare.js";
import { initCalculator } from "./utils/calculator.js";

document.addEventListener("DOMContentLoaded", () => {
	initUI();
	initStorage();
	initCalculator();
	initComparison();
});
