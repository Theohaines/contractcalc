export function getElement(id) {
	const element = document.getElementById(id);

	if (!element) {
		throw new Error(`Missing element: ${id}`);
	}

	return element;
}

export function showToast(message, type = "info", duration = 3000) {
	const container = getElement("toastContainer");
	const toast = document.createElement("div");

	toast.className = `toast toast-${type}`;
	toast.textContent = message;
	toast.setAttribute("role", type === "error" ? "alert" : "status");

	container.appendChild(toast);

	requestAnimationFrame(() => {
		toast.classList.add("show");
	});

	setTimeout(() => {
		toast.classList.remove("show");
		toast.classList.add("hide");

		toast.addEventListener(
			"transitionend",
			() => {
				toast.remove();
			},
			{ once: true },
		);
	}, duration);
}

export function initUI() {
	initTabs();
	initConditionalFields();
}

function initTabs() {
	const tabs = Array.from(document.querySelectorAll("[data-tab-target]"));

	if (!tabs.length) {
		return;
	}

	function activateTab(selectedTab) {
		tabs.forEach((tab) => {
			const panel = getElement(tab.dataset.tabTarget);
			const isActive = tab === selectedTab;

			tab.classList.toggle("active", isActive);
			tab.setAttribute("aria-selected", String(isActive));
			tab.tabIndex = isActive ? 0 : -1;

			panel.classList.toggle("active", isActive);
			panel.hidden = !isActive;
		});
	}

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			activateTab(tab);
		});

		tab.addEventListener("keydown", (event) => {
			if (
				!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
			) {
				return;
			}

			event.preventDefault();

			let nextIndex = index;

			if (event.key === "ArrowRight") {
				nextIndex = (index + 1) % tabs.length;
			}

			if (event.key === "ArrowLeft") {
				nextIndex = (index - 1 + tabs.length) % tabs.length;
			}

			if (event.key === "Home") {
				nextIndex = 0;
			}

			if (event.key === "End") {
				nextIndex = tabs.length - 1;
			}

			tabs[nextIndex].focus();
			activateTab(tabs[nextIndex]);
		});
	});
}

function initConditionalFields() {
	const tradeinSelected = getElement("tradeinSelected");
	const tradeinMenu = getElement("tradeinMenu");
	const tradeinAmount = getElement("tradeinAmount");
	const cashbackType = getElement("cashbackType");
	const cashbackMenu = getElement("cashbackMenu");
	const cashbackAmount = getElement("cashbackAmount");

	const updateTradein = () => {
		const isActive = tradeinSelected.value === "tradein";

		tradeinMenu.hidden = !isActive;
		tradeinSelected.setAttribute("aria-expanded", String(isActive));

		if (!isActive) {
			tradeinAmount.value = "0";
		}
	};

	const updateCashback = () => {
		const isActive = cashbackType.value === "bacs";

		cashbackMenu.hidden = !isActive;
		cashbackType.setAttribute("aria-expanded", String(isActive));

		if (!isActive) {
			cashbackAmount.value = "0";
		}
	};

	updateTradein();
	updateCashback();

	tradeinSelected.addEventListener("change", updateTradein);
	cashbackType.addEventListener("change", updateCashback);
}
