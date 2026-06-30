document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "summaryToggleChecked";

  const toggles = document.querySelectorAll(
    "#summaryModeSwitch, input.summaryToggle",
  );

  function applySummaryState(showSummary) {
    document.documentElement.classList.toggle(
      "summary-enabled",
      showSummary,
    );
  }

  if (toggles.length > 0) {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialChecked = saved === "true";

    toggles.forEach((t) => (t.checked = initialChecked));
    applySummaryState(initialChecked);

    toggles.forEach((toggle) => {
      toggle.addEventListener("change", function () {
        const showSummary = this.checked;
        toggles.forEach((t) => {
          if (t !== toggle) t.checked = showSummary;
        });
        localStorage.setItem(STORAGE_KEY, showSummary ? "true" : "false");
        applySummaryState(showSummary);
      });
    });
  }

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".show-more");
    if (!button) return;

    e.preventDefault();
    e.stopPropagation();

    const panel = document.getElementById(button.dataset.target);
    if (!panel) return;

    const isOpen = panel.classList.toggle("open");

    button.classList.toggle("rotated", isOpen);
    button.setAttribute("aria-expanded", isOpen);
  });
});
