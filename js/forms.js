/* ========================================================================
   TheChocoBot — Form-to-email helper
   Each submission opens the user's email client with a pre-composed
   message addressed to Gunjan's inbox. Zero-backend approach.

   Production upgrade: swap composeMailto() for a fetch() POST to
   Web3Forms / Formspree / Apps Script + Sheet, while keeping the mailto
   as a fallback.
   ======================================================================== */

(function () {
  const RECIPIENT = "thechocobot5@gmail.com";

  /**
   * Build a mailto: URL from a subject and a set of name → value fields.
   * Returns the URL — caller decides whether to open it.
   */
  function composeMailto(subject, fields) {
    const body = Object.entries(fields)
      .filter(([, v]) => v !== "" && v != null)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const full = body + "\n\n— Sent from www.thechocobot.com";
    return `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(full)}`;
  }

  /**
   * Read all named inputs/textareas/selects from a form into a plain object.
   */
  function readForm(form) {
    const data = {};
    form.querySelectorAll("input[name], textarea[name], select[name]").forEach((el) => {
      if (el.type === "checkbox") {
        data[el.name] = el.checked ? "yes" : "no";
      } else if (el.type === "radio") {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    });
    return data;
  }

  /**
   * Validate required fields. Returns an array of missing field names.
   */
  function validateRequired(form) {
    const missing = [];
    form.querySelectorAll("[required]").forEach((el) => {
      if (!el.value || String(el.value).trim() === "") {
        missing.push(el.name || el.id || "field");
      }
    });
    return missing;
  }

  /**
   * Wire up a form. Options:
   *   form          - the <form> element
   *   subjectPrefix - subject line (will be combined with optional class/order title)
   *   onSuccess     - called after the mailto opens (e.g. to flip to success state)
   */
  function wire(form, subjectPrefix, onSuccess) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const missing = validateRequired(form);
      if (missing.length > 0) {
        alert("Please fill: " + missing.join(", "));
        return;
      }
      const data = readForm(form);
      const subject = data.class
        ? `${subjectPrefix} — ${data.class}`
        : data.order_type
          ? `${subjectPrefix} — ${data.order_type}`
          : subjectPrefix;
      const url = composeMailto(subject, data);
      // Also stash into localStorage so admin.html can see it
      try {
        const key = "chocobot.enquiries.v1";
        const arr = JSON.parse(localStorage.getItem(key) || "[]");
        arr.push({ ...data, subject, created_at: new Date().toISOString(), source: subjectPrefix });
        localStorage.setItem(key, JSON.stringify(arr));
      } catch (err) { /* ignore */ }
      window.location.href = url;
      if (typeof onSuccess === "function") setTimeout(onSuccess, 400);
    });
  }

  window.ChocoForms = { composeMailto, readForm, validateRequired, wire, RECIPIENT };
})();
