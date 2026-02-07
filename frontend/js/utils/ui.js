export function showToast(message, type = "info", duration = 3000) {
	const container = document.getElementById("toastContainer");
	const toast = document.createElement("div");

	toast.textContent = message;
	toast.style.background = "#1a1f36";
	toast.style.color = "#fff";
	toast.style.padding = "12px 16px";
	toast.style.borderRadius = "8px";
	toast.style.marginTop = "8px";
	toast.style.opacity = "0.95";
	toast.style.fontSize = "0.9rem";

	container.appendChild(toast);

	setTimeout(() => toast.remove(), duration);
}

export function initUI() {
	const tradeinMenu = document.getElementById("tradeinMenu");
	const cashbackMenu = document.getElementById("cashbackMenu");

	tradeinMenu.style.display = "none";
	cashbackMenu.style.display = "none";

	tradeinSelected.addEventListener("change", () => {
		tradeinMenu.style.display =
			tradeinSelected.value === "tradein" ? "flex" : "none";
		if (tradeinSelected.value !== "tradein") tradeinAmount.value = 0;
	});

	cashbackType.addEventListener("change", () => {
		cashbackMenu.style.display =
			cashbackType.value === "bacs" ? "flex" : "none";
		if (cashbackType.value !== "bacs") cashbackAmount.value = 0;
	});
}
