const releases = [
	{
		version: "1.1.0",
		date: "2026-07-30",
		type: "Patch",
		excerpt: "QOL Release.",
		tags: ["QoL"],
		items: [
			"Updated default monthly increase to £1.80 (ID Mobile)."
		],
	},
	{
		version: "1.0.0",
		date: "2026-07-28",
		type: "Launch",
		excerpt: "Initial release of Costify (Out Of Beta).",
		tags: ["Release"],
		items: [
			"Launched the UK contract cost calculator.",
			"Added save and load support for calculations.",
			"Included compare tools for saved calculations.",
			"Added change log for tracking.",
		],
	},
];

const changelogList = document.getElementById("changelogList");
const changelogSummary = document.getElementById("changelogSummary");
const expandAllBtn = document.getElementById("expandAllBtn");
const collapseAllBtn = document.getElementById("collapseAllBtn");

function formatDate(dateString) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(dateString));
}

function renderChangelog() {
	if (!changelogList) {
		return;
	}

	changelogSummary.textContent = `${releases.length} releases available`;

	changelogList.innerHTML = releases
		.map(
			(release, index) => `
			<article class="release" aria-expanded="${index === 0 ? "true" : "false"}">
				<button type="button" class="release-summary" data-release-toggle>
					<div>
						<div class="release-title-row">
							<span class="release-title">v${release.version}</span>
							<span class="release-badge">${release.type}</span>
							<span class="release-date">${formatDate(release.date)}</span>
						</div>
						<p class="release-excerpt">${release.excerpt}</p>
					</div>
					<span class="release-chevron" aria-hidden="true">⌄</span>
				</button>
				<div class="release-content" ${index === 0 ? "" : "hidden"}>
					<div class="release-meta">
						${release.tags.map((tag) => `<span class="release-tag">${tag}</span>`).join("")}
					</div>
					<ul>
						${release.items.map((item) => `<li>${item}</li>`).join("")}
					</ul>
				</div>
			</article>
		`,
		)
		.join("");

	setupToggleHandlers();
}

function setupToggleHandlers() {
	const releasesEls = Array.from(document.querySelectorAll(".release"));

	releasesEls.forEach((releaseEl) => {
		const toggleBtn = releaseEl.querySelector("[data-release-toggle]");
		const content = releaseEl.querySelector(".release-content");

		toggleBtn?.addEventListener("click", () => {
			const isExpanded =
				releaseEl.getAttribute("aria-expanded") === "true";
			releaseEl.setAttribute("aria-expanded", String(!isExpanded));
			if (content) {
				content.hidden = isExpanded;
			}
		});
	});
}

function setAllExpanded(expanded) {
	const releasesEls = Array.from(document.querySelectorAll(".release"));

	releasesEls.forEach((releaseEl) => {
		const content = releaseEl.querySelector(".release-content");
		releaseEl.setAttribute("aria-expanded", String(expanded));
		if (content) {
			content.hidden = !expanded;
		}
	});
}

expandAllBtn?.addEventListener("click", () => setAllExpanded(true));
collapseAllBtn?.addEventListener("click", () => setAllExpanded(false));

renderChangelog();
