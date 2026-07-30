import { initUI, showToast } from "./utils/ui.js";
import { initStorage } from "./utils/storage.js";
import { initComparison } from "./utils/compare.js";
import { initCalculator } from "./utils/calculator.js";
import { getBookmarkletCode, copyToClipboard } from "./bookmarklet.js";

document.addEventListener("DOMContentLoaded", () => {
	initUI();
	initStorage();
	initCalculator();
	initComparison();

	const bookmarkletLink = document.getElementById("bookmarkletLink");
	const bookmarkletCopy = document.getElementById("bookmarkletCopy");
	const bookmarkletModal = document.getElementById("bookmarkletModal");
	const bookmarkletModalClose = document.getElementById(
		"bookmarkletModalClose",
	);
	const bookmarkletCode = document.getElementById("bookmarkletCode");
	const bookmarkletCodeCopy = document.getElementById("bookmarkletCodeCopy");
	const bookmarkletInstructions = document.getElementById(
		"bookmarklet-instructions",
	);

	const code = getBookmarkletCode();

	if (bookmarkletLink) {
		bookmarkletLink.href = code;
	}

	if (bookmarkletCode) {
		bookmarkletCode.value = code;
	}

	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	if (isMobile && bookmarkletInstructions) {
		bookmarkletInstructions.textContent =
			'Tap "Copy for Mobile" to get setup instructions.';
	}

	bookmarkletCopy?.addEventListener("click", () => {
		bookmarkletModal.hidden = false;
	});

	bookmarkletModalClose?.addEventListener("click", () => {
		bookmarkletModal.hidden = true;
	});

	bookmarkletModal?.addEventListener("click", (event) => {
		if (event.target === bookmarkletModal) {
			bookmarkletModal.hidden = true;
		}
	});

	bookmarkletCodeCopy?.addEventListener("click", async () => {
		const success = await copyToClipboard(code);
		if (success) {
			showToast("Code copied to clipboard", "success");
		} else {
			showToast("Failed to copy code", "error");
		}
	});
});
