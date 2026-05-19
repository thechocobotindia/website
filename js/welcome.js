/* ========================================================================
   TheChocoBot, Welcome popup + discount
   - Shown once per visitor (gate via localStorage)
   - Captures email + phone, stores welcome code locally
   - Applies 10% off at checkout when code is active
   ======================================================================== */

(function () {
  const STORAGE_KEY = "chocobot.welcome.v2";  // bumped to clear old dismissals
  const SUBSCRIBER_KEY = "chocobot.subscriber.v1";
  const DELAY_MS = 2500; // 2.5s, show sooner so it's actually seen
  const DISMISS_TTL_MS = 24 * 60 * 60 * 1000; // dismiss expires after 1 day
  const SKIP_TTL_MS = 3 * 24 * 60 * 60 * 1000; // skip expires after 3 days

  function getState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function setState(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

  // Public: returns the active welcome code, if any
  window.getWelcomeCode = function () {
    const s = getState();
    if (s.code && !s.redeemed) return s.code;
    return null;
  };
  window.welcomeDiscountPercent = function () {
    return window.getWelcomeCode() ? 10 : 0;
  };
  window.markWelcomeRedeemed = function () {
    const s = getState();
    s.redeemed = true; s.redeemed_at = new Date().toISOString();
    setState(s);
  };

  function modalHTML() {
    return `
      <div id="welcome-backdrop" class="welcome-backdrop" aria-hidden="true"></div>
      <div id="welcome-modal" class="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <button type="button" class="welcome-close" id="welcome-close" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="welcome-grid">
          <div class="welcome-art" aria-hidden="true">
            <img src="images/hero/hero-01-dark-chocolate.jpg" alt="">
            <div class="welcome-art-overlay">
              <p class="text-[10px] tracking-[0.3em] uppercase" style="color:var(--cream)">Vol. I · The Welcome</p>
              <p class="serif italic mt-3" style="color:var(--cream);font-size:1.3rem;line-height:1.4">
                "I never wanted to bake the loudest cake in the room. I wanted to bake the one you remember in the car ride home."
              </p>
              <p class="mt-3 text-xs" style="color:rgba(250,243,224,0.7)">Gunjan</p>
            </div>
          </div>
          <div class="welcome-body">
            <p class="welcome-eyebrow">A small note · Inner Circle</p>
            <h2 id="welcome-title" class="welcome-title">Take 10% off, on me.</h2>
            <p class="welcome-sub">
              Leave your email &amp; number, I'll send fortnightly letters, early launches,
              and a handwritten note on your birthday. First order is on the house, 10% off.
            </p>

            <form id="welcome-form" class="welcome-form" novalidate>
              <div class="field">
                <label class="field-label" for="w-email">Email <span class="req">*</span></label>
                <input id="w-email" name="email" type="email" required autocomplete="email" placeholder="you@gmail.com">
              </div>
              <div class="field">
                <label class="field-label" for="w-phone">Phone <span class="req">*</span></label>
                <input id="w-phone" name="phone" type="tel" required pattern="[0-9+\\-\\s]{7,15}" placeholder="+91 …" autocomplete="tel">
              </div>
              <div class="field">
                <label class="field-label" for="w-birthday">Birthday <span class="opt">(optional, for a small surprise)</span></label>
                <input id="w-birthday" name="birthday" type="date">
              </div>
              <label class="welcome-consent">
                <input type="checkbox" id="w-consent" required>
                <span>I'd like to receive Gunjan's letters &amp; offers. I can unsubscribe anytime.</span>
              </label>
              <button type="submit" class="btn btn-primary btn-lg w-full">Send me my code</button>
              <button type="button" class="welcome-skip" id="welcome-skip">Maybe later</button>
            </form>

            <div id="welcome-success" class="hidden welcome-success">
              <div class="text-4xl">🎀</div>
              <h3 class="serif text-2xl mt-2" style="color:var(--cocoa)">Welcome to the Inner Circle.</h3>
              <p class="mt-2" style="color:var(--muted)">
                Your code: <strong class="welcome-code" id="welcome-code-display"></strong>
              </p>
              <p class="text-xs mt-1" style="color:var(--muted)">Auto-applied at checkout for your first order.</p>
              <button type="button" class="btn btn-primary mt-5" id="welcome-shop">Explore the menu</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateCode() {
    return "CHOCO" + Math.floor(100 + Math.random() * 900);
  }

  async function saveSubscriber(record) {
    // PRODUCTION: POST to a backend / Google Apps Script webhook
    // await fetch("/api/subscribers", { method:"POST", body: JSON.stringify(record) });
    const arr = JSON.parse(localStorage.getItem(SUBSCRIBER_KEY) || "[]");
    arr.push(record);
    localStorage.setItem(SUBSCRIBER_KEY, JSON.stringify(arr));
    console.log("[ChocoBot] Subscriber saved (local stub):", record);
  }

  function show() {
    if (document.getElementById("welcome-modal")) return;
    const host = document.createElement("div");
    host.innerHTML = modalHTML();
    while (host.firstChild) document.body.appendChild(host.firstChild);

    requestAnimationFrame(() => {
      document.getElementById("welcome-backdrop").classList.add("open");
      document.getElementById("welcome-modal").classList.add("open");
    });
    document.body.style.overflow = "hidden";

    const close = () => {
      document.getElementById("welcome-backdrop").classList.remove("open");
      document.getElementById("welcome-modal").classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => {
        document.getElementById("welcome-backdrop")?.remove();
        document.getElementById("welcome-modal")?.remove();
      }, 400);
    };

    document.getElementById("welcome-close").addEventListener("click", () => {
      const s = getState(); s.dismissed_at = new Date().toISOString(); setState(s);
      close();
    });
    document.getElementById("welcome-skip").addEventListener("click", () => {
      const s = getState(); s.skipped_at = new Date().toISOString(); setState(s);
      close();
    });
    document.getElementById("welcome-backdrop").addEventListener("click", () => {
      const s = getState(); s.dismissed_at = new Date().toISOString(); setState(s);
      close();
    });

    document.getElementById("welcome-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("w-email").value.trim();
      const phone = document.getElementById("w-phone").value.trim();
      const birthday = document.getElementById("w-birthday").value;
      const consent = document.getElementById("w-consent").checked;
      if (!email || !phone || !consent) {
        alert("Please fill email + phone, and tick the consent box.");
        return;
      }
      const code = generateCode();
      const record = { email, phone, birthday: birthday || null, code, joined_at: new Date().toISOString(), source: "welcome_popup" };
      await saveSubscriber(record);
      const s = { code, email, phone, joined_at: record.joined_at, redeemed: false };
      setState(s);

      document.getElementById("welcome-form").classList.add("hidden");
      document.getElementById("welcome-success").classList.remove("hidden");
      document.getElementById("welcome-code-display").textContent = code;

      document.getElementById("welcome-shop").addEventListener("click", () => {
        close();
        location.href = "menu.html";
      });
    });
  }

  function shouldShow() {
    const s = getState();
    if (s.code) return false;                       // already signed up, never show again
    const now = Date.now();
    if (s.dismissed_at && (now - new Date(s.dismissed_at).getTime()) < DISMISS_TTL_MS) return false;
    if (s.skipped_at && (now - new Date(s.skipped_at).getTime()) < SKIP_TTL_MS) return false;
    return true;
  }

  function init() {
    if (!shouldShow()) return;
    setTimeout(show, DELAY_MS);
  }

  // Public: trigger manually (used by footer "Reset welcome offer" link)
  window.showWelcomeOffer = show;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
