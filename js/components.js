/* ========================================================================
   TheChocoBot, Shared components
   Identity: Gunjan Chopra · Vikaspuri, New Delhi · FSSAI 23321006001296
   ======================================================================== */

(function () {
  // === Real contact details ===
  const WHATSAPP_NUMBER = "918851522130";        // +91 88515 22130
  const CALL_NUMBER     = "+917982343048";       // +91 79823 43048
  const EMAIL           = "thechocobot5@gmail.com";
  const PHONE_WA_DISPLAY = "+91 88515 22130";
  const PHONE_CALL_DISPLAY = "+91 79823 43048";
  const INSTAGRAM_URL   = "https://instagram.com/the_choco_bot";
  const INSTAGRAM_HANDLE = "@the_choco_bot";
  const ADDRESS_LINE    = "Vikaspuri, New Delhi";
  const FSSAI_REG       = "23321006001296";

  window.SITE = {
    WHATSAPP_NUMBER, CALL_NUMBER, EMAIL, INSTAGRAM_URL, INSTAGRAM_HANDLE,
    PHONE_WA_DISPLAY, PHONE_CALL_DISPLAY, ADDRESS_LINE, FSSAI_REG,
    FOUNDER: "Gunjan Chopra"
  };

  function whatsappLink(text) {
    const msg = encodeURIComponent(text || "Hi! I'd like to ask about an order.");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }
  window.whatsappLink = whatsappLink;

  function currentPage() {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (file === "" || file === "index.html") return "home";
    if (file.startsWith("menu")) return "menu";
    if (file.startsWith("product")) return "menu";
    if (file.startsWith("about") || file.startsWith("our-story")) return "about";
    if (file.startsWith("custom")) return "custom";
    if (file.startsWith("classes")) return "classes";
    if (file.startsWith("events")) return "events";
    if (file.startsWith("inner-circle")) return "inner";
    if (file.startsWith("contact") || file.startsWith("reach")) return "contact";
    if (file.startsWith("faq")) return "faq";
    if (file.startsWith("checkout") || file.startsWith("cart")) return "cart";
    return "";
  }

  const page = currentPage();
  const link = (href, label, key) => {
    const cls = key === page ? "nav-link active" : "nav-link";
    return `<a href="${href}" class="${cls}">${label}</a>`;
  };

  // ===== HEADER =====
  const headerHTML = `
    <header class="site-header">
      <div class="scroll-progress" aria-hidden="true"></div>
      <div class="container-wide flex items-center justify-between gap-4 py-4">
        <a href="index.html" class="brand-wordmark" aria-label="TheChocoBot by Gunjan Chopra, home">
          <img src="images/brand/logo.png" alt="TheChocoBot" class="brand-logo-img">
          <span class="brand-block">
            <span class="brand-name">TheChocoBot<span class="dot">.</span></span>
            <span class="brand-by">by Gunjan Chopra</span>
          </span>
        </a>
        <nav class="hidden lg:flex items-center gap-6" aria-label="Primary">
          ${link("menu.html", "Menu", "menu")}
          ${link("classes.html", "Classes", "classes")}
          ${link("events.html", "Events &amp; Corporate", "events")}
          ${link("inner-circle.html", "Inner Circle", "inner")}
          ${link("about.html", "Our Story", "about")}
        </nav>
        <div class="flex items-center gap-2">
          <a href="${whatsappLink('Hi Gunjan! I have a quick question.')}" target="_blank" rel="noopener" class="hidden md:inline-flex btn btn-secondary btn-sm" aria-label="WhatsApp">
            Reach
          </a>
          <button type="button" id="open-cart" class="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--cream)] transition-colors" aria-label="Open cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="color:var(--cocoa)">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span id="cart-count-badge" class="cart-badge hidden">0</span>
          </button>
          <button type="button" id="open-nav" class="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--cream)] transition-colors" aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
          </button>
        </div>
      </div>
      <!-- Mobile nav -->
      <div id="mobile-nav" class="lg:hidden hidden border-t" style="border-color:var(--line);background:var(--ivory)">
        <div class="container-wide py-3 flex flex-col gap-1">
          ${link("menu.html", "Menu", "menu")}
          ${link("classes.html", "Classes", "classes")}
          ${link("events.html", "Events & Corporate", "events")}
          ${link("inner-circle.html", "Inner Circle", "inner")}
          ${link("about.html", "Our Story", "about")}
          ${link("custom-orders.html", "Custom orders", "custom")}
          ${link("contact.html", "Reach", "contact")}
          ${link("faq.html", "FAQ", "faq")}
        </div>
      </div>
    </header>
  `;

  // ===== CART DRAWER =====
  const cartDrawerHTML = `
    <div id="drawer-backdrop" class="drawer-backdrop" aria-hidden="true"></div>
    <aside id="cart-drawer" class="drawer" role="dialog" aria-modal="true" aria-label="Your selection" aria-hidden="true">
      <div class="drawer-head">
        <div>
          <p class="text-[10px] tracking-[0.25em] uppercase" style="color:var(--gold-dark)">Vol. III</p>
          <h2 class="serif">The Selection</h2>
        </div>
        <button type="button" id="close-cart" class="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-[var(--cream)]" aria-label="Close cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="drawer-body" id="cart-lines"></div>
      <div class="drawer-foot" id="cart-foot"></div>
    </aside>
  `;

  // ===== WHATSAPP FAB =====
  const fabHTML = `
    <a href="${whatsappLink('Hi Gunjan!')}" target="_blank" rel="noopener" class="whatsapp-fab" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.8 5.5 2.2 7.9L.4 31.6l7.9-2.1c2.3 1.2 4.9 1.9 7.6 1.9 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.5c-2.5 0-4.9-.7-7-1.9l-.5-.3-5.2 1.4 1.4-5-.3-.5c-1.4-2.2-2.1-4.7-2.1-7.3 0-7.6 6.2-13.7 13.7-13.7s13.7 6.2 13.7 13.7c.1 7.6-6.1 13.6-13.7 13.6zm7.7-10.3c-.4-.2-2.5-1.2-2.8-1.4-.4-.1-.7-.2-.9.2-.3.4-1.1 1.4-1.3 1.6-.2.3-.5.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.5-.7.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.7H10c-.3 0-.7.1-1 .5s-1.2 1.2-1.2 2.9 1.3 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.5-.4z"/>
      </svg>
    </a>
  `;

  // ===== FOOTER =====
  const footerHTML = `
    <footer class="site-footer">
      <div class="container-wide">
        <div class="grid gap-10 md:grid-cols-12">

          <div class="md:col-span-5">
            <p class="footer-brand">
              <img src="images/brand/logo.png" alt="TheChocoBot" class="footer-logo-img">
              <span class="footer-brand-text">
                <span class="brand-mono text-xs tracking-[0.3em]" style="color:var(--gold)">THE</span>
                <span class="block">ChocoBot<span style="color:var(--gold)">.</span></span>
                <span class="footer-by">by Gunjan Chopra</span>
              </span>
            </p>
            <p class="mt-4 max-w-md text-[15px]" style="color:rgba(250,243,224,0.78);line-height:1.7">
              A small, slow, hundred-percent eggless studio by Gunjan Chopra. IHM-trained baker. VLCC-certified Nutritionist. FSSAI registered.
            </p>
            <p class="mt-5 text-xs tracking-[0.25em] uppercase" style="color:var(--gold)">Until next time</p>
            <p class="mt-2 serif italic text-xl md:text-2xl" style="color:var(--cream);line-height:1.4;max-width:24rem">
              For every craving, every mood.
            </p>
          </div>

          <div class="md:col-span-2">
            <h3 class="footer-eyebrow">Wander</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="menu.html">Menu</a></li>
              <li><a href="classes.html">Classes</a></li>
              <li><a href="events.html">Events &amp; Corporate</a></li>
              <li><a href="inner-circle.html">Inner Circle</a></li>
              <li><a href="about.html">Our Story</a></li>
            </ul>
          </div>

          <div class="md:col-span-2">
            <h3 class="footer-eyebrow">Notes</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="faq.html#privacy">Privacy</a></li>
              <li><a href="faq.html#terms">Terms</a></li>
              <li><a href="faq.html#refunds">Refunds</a></li>
              <li><a href="#" onclick="event.preventDefault();localStorage.removeItem('chocobot.welcome.v1');alert('Welcome offer reset. Refresh the page.');return false;">Reset welcome offer</a></li>
            </ul>
          </div>

          <div class="md:col-span-3">
            <h3 class="footer-eyebrow">Reach</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="${whatsappLink('Hi Gunjan!')}" target="_blank" rel="noopener">WhatsApp · ${PHONE_WA_DISPLAY}</a></li>
              <li><a href="tel:${CALL_NUMBER}">Call · ${PHONE_CALL_DISPLAY}</a></li>
              <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
              <li class="pt-2">${ADDRESS_LINE}</li>
            </ul>

            <h3 class="footer-eyebrow mt-7">Follow</h3>
            <p class="mt-3"><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">${INSTAGRAM_HANDLE}</a></p>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs" style="border-color:rgba(250,243,224,0.15);color:rgba(250,243,224,0.55)">
          <p>FSSAI Reg. · ${FSSAI_REG} · © <span id="year"></span> The ChocoBot. Hundred-percent eggless. Hand-baked, hand-packed.</p>
          <p>Pan-India shipping for cookies &amp; brownies · Local delivery in Delhi NCR · Pickup by appointment</p>
        </div>
      </div>
    </footer>
  `;

  // ===== Mount =====
  function mount() {
    const headerHost = document.createElement("div");
    headerHost.innerHTML = headerHTML.trim();
    document.body.insertBefore(headerHost.firstElementChild, document.body.firstChild);

    const drawerHost = document.createElement("div");
    drawerHost.innerHTML = cartDrawerHTML;
    while (drawerHost.firstChild) document.body.appendChild(drawerHost.firstChild);

    const fabHost = document.createElement("div");
    fabHost.innerHTML = fabHTML.trim();
    document.body.appendChild(fabHost.firstElementChild);

    const footerHost = document.createElement("div");
    footerHost.innerHTML = footerHTML.trim();
    document.body.appendChild(footerHost.firstElementChild);

    const yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();

    bindUI();
    renderCart();
  }

  function openDrawer() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("drawer-backdrop").classList.add("open");
    document.getElementById("cart-drawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("drawer-backdrop").classList.remove("open");
    document.getElementById("cart-drawer").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function bindUI() {
    document.getElementById("open-cart").addEventListener("click", openDrawer);
    document.getElementById("close-cart").addEventListener("click", closeDrawer);
    document.getElementById("drawer-backdrop").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

    const openNav = document.getElementById("open-nav");
    const mobileNav = document.getElementById("mobile-nav");
    if (openNav) openNav.addEventListener("click", () => mobileNav.classList.toggle("hidden"));

    window.addEventListener("cart:change", renderCart);

    document.body.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-add-to-cart]");
      if (trigger) {
        e.preventDefault();
        const id = trigger.dataset.addToCart;
        const qty = parseInt(trigger.dataset.qty || "1", 10);
        window.Cart.add(id, qty);
        openDrawer();
      }
    });

    // Scroll progress bar
    const bar = document.querySelector(".scroll-progress");
    if (bar) {
      let raf;
      const update = () => {
        const h = document.documentElement;
        const pct = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
        bar.style.transform = `scaleX(${pct})`;
      };
      window.addEventListener("scroll", () => {
        if (!raf) raf = requestAnimationFrame(() => { update(); raf = null; });
      }, { passive: true });
      update();
    }
  }

  function renderCart() {
    const items = window.Cart.items();
    const count = window.Cart.count();
    const subtotal = window.Cart.subtotal();

    const badge = document.getElementById("cart-count-badge");
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }

    const linesEl = document.getElementById("cart-lines");
    const footEl = document.getElementById("cart-foot");
    if (!linesEl || !footEl) return;

    if (items.length === 0) {
      linesEl.innerHTML = `
        <div class="text-center py-12 px-4">
          <div class="text-[10px] tracking-[0.25em] uppercase" style="color:var(--gold-dark)">Vol. III · Empty</div>
          <p class="serif text-2xl mt-3" style="color:var(--cocoa)">Nothing chosen yet.</p>
          <p class="mt-2 text-sm" style="color:var(--muted)">Pick something. It's baked the night before yours.</p>
          <a href="menu.html" class="btn btn-primary btn-sm mt-5">Browse the menu</a>
        </div>`;
      footEl.innerHTML = "";
      return;
    }

    linesEl.innerHTML = items.map(item => {
      const p = window.findProduct(item.id);
      if (!p) return "";
      const lineTotal = p.price * item.qty;
      return `
        <div class="cart-line">
          <div class="cart-line-img"><img src="${p.image}" alt="${p.name}"></div>
          <div class="cart-line-body">
            <p class="cart-line-name">${p.name}</p>
            <p class="cart-line-meta">${p.weight} · ${window.formatPrice(p.price)}</p>
            <div class="flex items-center justify-between mt-2 gap-2">
              <div class="qty-stepper" role="group" aria-label="Quantity">
                <button type="button" aria-label="Decrease" onclick="window.Cart.decrement('${p.id}')">−</button>
                <span>${item.qty}</span>
                <button type="button" aria-label="Increase" onclick="window.Cart.increment('${p.id}')">+</button>
              </div>
              <span class="font-semibold text-sm" style="color:var(--cocoa)">${window.formatPrice(lineTotal)}</span>
            </div>
            <button class="cart-line-remove" onclick="window.Cart.remove('${p.id}')">Remove</button>
          </div>
        </div>`;
    }).join("");

    const hasDelhi = window.Cart.hasDelhiOnlyItems();
    footEl.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm" style="color:var(--muted)">Subtotal</span>
        <span class="serif text-2xl" style="color:var(--cocoa)">${window.formatPrice(subtotal)}</span>
      </div>
      ${hasDelhi ? `
        <div class="text-xs p-2.5 rounded-lg mb-3" style="background:var(--blush);color:#8a4848">
          Fresh items in your selection, these deliver in Delhi NCR only.
        </div>
      ` : ""}
      <a href="checkout.html" class="btn btn-primary w-full">Continue · ${window.formatPrice(subtotal)}</a>
      <button type="button" class="btn btn-secondary w-full mt-2" onclick="document.getElementById('drawer-backdrop').click()">Keep wandering</button>
    `;
  }

  window.openCart = openDrawer;
  window.closeCart = closeDrawer;
  window.renderCart = renderCart;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
