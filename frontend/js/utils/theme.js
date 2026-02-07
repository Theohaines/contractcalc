const STORAGE_KEY = "costify:theme";
const root = document.documentElement;

export function initTheme() {
	const toggle = document.getElementById("themeToggle");
	const icon = document.getElementById("themeIcon");
	const label = document.getElementById("themeLabel");

	const saved = localStorage.getItem(STORAGE_KEY);

	if (saved) {
		root.setAttribute("data-theme", saved);
	} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		root.setAttribute("data-theme", "dark");
	}

	update(toggle, icon, label);

	toggle.addEventListener("click", () => {
		const next =
			root.getAttribute("data-theme") === "dark" ? "light" : "dark";

		root.setAttribute("data-theme", next);
		localStorage.setItem(STORAGE_KEY, next);
		update(toggle, icon, label);
	});
}

function update(_, icon, label) {
	const isDark =
		document.documentElement.getAttribute("data-theme") === "dark";

	icon.src = isDark
		? "/media/icons/lightmode.svg"
		: "/media/icons/darkmode.svg";

	label.textContent = isDark ? "Light mode" : "Dark mode";
}
