(function () {
  const el = document.getElementById("i18n-data");
  if (!el) return;
  const translations = JSON.parse(el.textContent);

  function detectLang() {
    const stored = localStorage.getItem("lang");
    if (stored && translations[stored]) return stored;
    const browser = navigator.language.slice(0, 2);
    if (translations[browser]) return browser;
    return "nl";
  }

  function applyLang(lang) {
    const dict = translations[lang] || translations["nl"];

    // Simple key → text swap
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    // Template strings with variables
    document.querySelectorAll("[data-i18n-template]").forEach((el) => {
      const key = el.dataset.i18nTemplate;
      const vars = JSON.parse(el.dataset.i18nVars || "{}");
      if (dict[key]) {
        el.textContent = dict[key].replace(
          /\{\s*(\w+)\s*\}/g,
          (_, k) => vars[k] ?? "",
        );
      }
    });

    // Sync all selects to the active lang
    document.querySelectorAll(".lang-select").forEach((select) => {
      select.value = lang;
    });

    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }

  // Wire up all selects (desktop + mobile)
  document.querySelectorAll(".lang-select").forEach((select) => {
    select.addEventListener("change", () => applyLang(select.value));
  });

  applyLang(detectLang());
})();
