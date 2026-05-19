/* ========================================================================
   TheChocoBot, Whimsy v2 (Fabulous Edition)
   - Mini baker scroll companion
   - Sprinkles, chocolate chips & sparkles (replaces beans)
   - Hand-drawn doodle accents on eyebrows
   - Cursor trail of tiny chips
   - Click-burst sprinkle confetti
   - Wax-seal stamps
   - Hero "drip" effect from top edge
   ======================================================================== */

(function () {
  const PRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPRINKLE_COLORS = ["#A0395E", "#C9A96E", "#F4C2C2", "#3D2817", "#5C3A21", "#FAF3E0"];
  const CHIP_COLOR = "#3D2817";
  const CHIP_SHEEN = "#7A4424";

  // =========================================================================
  // SVG SHAPES
  // =========================================================================
  function bakerSVG() {
    return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="32" cy="58" rx="14" ry="2.5" fill="rgba(61,40,23,0.18)"/>
      <g class="baker-body">
        <path d="M22 52 L22 38 Q22 28 32 28 Q42 28 42 38 L42 52 Z" fill="#FFF8EC" stroke="#3D2817" stroke-width="1.2"/>
        <line x1="22" y1="32" x2="14" y2="34" stroke="#3D2817" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="42" y1="32" x2="50" y2="34" stroke="#3D2817" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="27" y="42" width="10" height="7" fill="none" stroke="#C9A96E" stroke-width="0.9" rx="1"/>
        <circle cx="32" cy="36" r="1.4" fill="#A0395E"/>
      </g>
      <g class="baker-head">
        <ellipse cx="32" cy="10" rx="11" ry="7" fill="#FFFFFF" stroke="#3D2817" stroke-width="1.2"/>
        <ellipse cx="26" cy="9" rx="4" ry="3.5" fill="#FFFFFF" stroke="#3D2817" stroke-width="0.9"/>
        <ellipse cx="38" cy="9" rx="4" ry="3.5" fill="#FFFFFF" stroke="#3D2817" stroke-width="0.9"/>
        <rect x="22" y="14" width="20" height="4" fill="#FFFFFF" stroke="#3D2817" stroke-width="1.2"/>
        <ellipse cx="32" cy="22" rx="8" ry="8.5" fill="#F4D6B5" stroke="#3D2817" stroke-width="1.2"/>
        <ellipse class="baker-eye left" cx="29" cy="22" rx="1.1" ry="1.4" fill="#3D2817"/>
        <ellipse class="baker-eye right" cx="35" cy="22" rx="1.1" ry="1.4" fill="#3D2817"/>
        <circle cx="27" cy="25" r="1.3" fill="#F4C2C2" opacity="0.6"/>
        <circle cx="37" cy="25" r="1.3" fill="#F4C2C2" opacity="0.6"/>
        <path d="M29 26 Q32 28 35 26" stroke="#3D2817" stroke-width="1" fill="none" stroke-linecap="round"/>
      </g>
      <g class="baker-pin" style="transform-origin: 32px 49px">
        <rect x="20" y="47" width="24" height="4" rx="2" fill="#C9A96E" stroke="#3D2817" stroke-width="1"/>
        <rect x="14" y="48" width="6" height="2" rx="1" fill="#5C3A21"/>
        <rect x="44" y="48" width="6" height="2" rx="1" fill="#5C3A21"/>
        <circle cx="26" cy="49" r="0.7" fill="#5C3A21"/>
        <circle cx="32" cy="49" r="0.7" fill="#5C3A21"/>
        <circle cx="38" cy="49" r="0.7" fill="#5C3A21"/>
      </g>
    </svg>`;
  }

  // Proper teardrop chocolate chip with highlight
  function chipSVG(color = CHIP_COLOR) {
    return `
    <svg viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2 C8 12, 2 18, 2 22 a10 8 0 0 0 20 0 C22 18, 16 12, 12 2 Z" fill="${color}"/>
      <path d="M8 16 C7 14, 7 11, 9 8" stroke="${CHIP_SHEEN}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <ellipse cx="9" cy="22" rx="2.5" ry="1.5" fill="${CHIP_SHEEN}" opacity="0.55"/>
    </svg>`;
  }

  // Pill-shaped rainbow sprinkle
  function sprinkleSVG(color, rot = 0) {
    return `
    <svg viewBox="0 0 14 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="transform:rotate(${rot}deg)">
      <rect x="2" y="2" width="10" height="34" rx="5" fill="${color}"/>
      <rect x="3.5" y="4" width="2" height="14" rx="1" fill="rgba(255,255,255,0.35)"/>
    </svg>`;
  }

  // 4-point gold sparkle/star
  function starSVG() {
    return `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill="#C9A96E"/>
    </svg>`;
  }

  // Whisk doodle (hand-drawn)
  function whiskDoodleSVG() {
    return `
    <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" stroke="#A0395E" stroke-width="1.6" stroke-linecap="round" fill="none" aria-hidden="true">
      <path d="M30 2 L30 38" />
      <path d="M22 38 Q18 55, 22 76" />
      <path d="M30 40 Q26 58, 30 78" />
      <path d="M38 38 Q42 55, 38 76" />
      <path d="M22 76 Q30 78, 38 76" />
      <ellipse cx="30" cy="2" rx="3" ry="2" fill="#A0395E"/>
    </svg>`;
  }

  // Heart doodle
  function heartDoodleSVG() {
    return `
    <svg viewBox="0 0 30 28" xmlns="http://www.w3.org/2000/svg" stroke="#A0395E" stroke-width="1.6" fill="none" aria-hidden="true">
      <path d="M15 25 C5 18, 2 11, 6 6 C10 1, 14 4, 15 8 C16 4, 20 1, 24 6 C28 11, 25 18, 15 25 Z"/>
    </svg>`;
  }

  // Squiggle flourish
  function squiggleSVG() {
    return `
    <svg viewBox="0 0 100 14" xmlns="http://www.w3.org/2000/svg" stroke="#C9A96E" stroke-width="2" fill="none" stroke-linecap="round" aria-hidden="true">
      <path d="M2 7 Q12 1, 22 7 T42 7 T62 7 T82 7 T98 7"/>
    </svg>`;
  }

  // Hand-drawn underline (for highlighter accent)
  function underlineSVG() {
    return `
    <svg viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg" stroke="#A0395E" stroke-width="3.5" fill="none" stroke-linecap="round" preserveAspectRatio="none" aria-hidden="true">
      <path d="M3 7 Q50 2, 100 7 T197 7"/>
    </svg>`;
  }

  // =========================================================================
  // MINI BAKER (kept from before, polished)
  // =========================================================================
  function mountBaker() {
    if (PRM) return;
    const tracker = document.createElement("div");
    tracker.className = "baker-tracker";
    tracker.setAttribute("aria-hidden", "true");
    tracker.innerHTML = `
      <div class="baker-rail">
        <div class="baker" title="Hi! I'm baking down there.">${bakerSVG()}</div>
        <div class="baker-bubble" id="baker-bubble">Hand-stacked.</div>
      </div>
    `;
    document.body.appendChild(tracker);

    const baker = tracker.querySelector(".baker");
    const bubble = tracker.querySelector(".baker-bubble");
    const railHeight = 220;

    // Synced to the new home-page sequence:
    // Hero → Trust → Signature → Maker → Three Doors → Inner Circle → Testimonials → Closer
    const messages = [
      { at: 0.04, text: "Welcome ✦" },
      { at: 0.16, text: "Real numbers." },
      { at: 0.30, text: "Hand-stacked." },
      { at: 0.48, text: "Hello, I'm Gunjan." },
      { at: 0.65, text: "Three doors." },
      { at: 0.80, text: "Quiet letters." },
      { at: 0.92, text: "Kind words." }
    ];

    let lastIdx = -1, bubbleTimer, raf;
    function update() {
      const h = document.documentElement;
      const scrollable = Math.max(1, h.scrollHeight - h.clientHeight);
      const pct = Math.min(1, Math.max(0, h.scrollTop / scrollable));
      baker.style.top = (pct * railHeight) + "px";
      let idx = -1;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (pct >= messages[i].at) { idx = i; break; }
      }
      if (idx !== lastIdx && idx >= 0) {
        lastIdx = idx;
        bubble.textContent = messages[idx].text;
        bubble.classList.add("shown");
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => bubble.classList.remove("shown"), 2600);
      }
      raf = null;
    }
    update();
    window.addEventListener("scroll", () => {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });

    baker.addEventListener("click", () => {
      bubble.textContent = "🍫 Mind a tin?";
      bubble.classList.add("shown");
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove("shown"), 2400);
    });
  }

  // =========================================================================
  // BAKERY-ELEMENT SCATTER (replaces ugly beans)
  // =========================================================================
  function scatterBakery() {
    document.querySelectorAll("[data-beans], [data-scatter]").forEach(host => {
      if (host.dataset.scatterDone) return;
      host.removeAttribute("data-beans"); // legacy

      // Distinct positions across host
      const elements = [
        { type: "sprinkle", t: "9%",  l: "6%",  rot: -28, color: SPRINKLE_COLORS[0] },
        { type: "chip",     t: "22%", l: "92%", rot: 18 },
        { type: "sprinkle", t: "55%", l: "3%",  rot: 42,  color: SPRINKLE_COLORS[1] },
        { type: "star",     t: "72%", l: "88%", rot: 0 },
        { type: "sprinkle", t: "33%", l: "78%", rot: -8,  color: SPRINKLE_COLORS[2] },
        { type: "chip",     t: "85%", l: "14%", rot: -22 },
        { type: "sprinkle", t: "44%", l: "94%", rot: 70,  color: SPRINKLE_COLORS[3] },
        { type: "sprinkle", t: "14%", l: "70%", rot: -55, color: SPRINKLE_COLORS[4] },
        { type: "chip",     t: "62%", l: "11%", rot: 8 },
        { type: "star",     t: "8%",  l: "48%", rot: 0 },
        { type: "sprinkle", t: "92%", l: "60%", rot: 12,  color: SPRINKLE_COLORS[5] },
        { type: "sprinkle", t: "78%", l: "38%", rot: -88, color: SPRINKLE_COLORS[0] }
      ];

      const wrap = document.createElement("div");
      wrap.className = "scatter-layer";
      elements.forEach((el, i) => {
        const node = document.createElement("div");
        node.className = `scatter scatter-${el.type}`;
        node.style.top = el.t;
        node.style.left = el.l;
        node.style.animationDelay = (i * -1.3) + "s";
        if (el.type === "sprinkle") node.innerHTML = sprinkleSVG(el.color, el.rot);
        else if (el.type === "chip") {
          node.innerHTML = chipSVG();
          node.style.transform = `rotate(${el.rot}deg)`;
        }
        else if (el.type === "star") node.innerHTML = starSVG();
        wrap.appendChild(node);
      });
      if (getComputedStyle(host).position === "static") {
        host.style.position = "relative";
      }
      host.appendChild(wrap);
      host.dataset.scatterDone = "1";
    });
  }

  // =========================================================================
  // SPARKLES INSIDE DOOR CARDS
  // =========================================================================
  function sparkleDoors() {
    document.querySelectorAll(".door-card").forEach(card => {
      if (card.dataset.sparkled) return;
      const host = document.createElement("div");
      host.className = "sparkle-host";
      const positions = [
        { t: "8%",  l: "82%" }, { t: "65%", l: "8%" },
        { t: "32%", l: "92%" }, { t: "78%", l: "75%" }
      ];
      positions.forEach((p, i) => {
        const s = document.createElement("div");
        s.className = "sparkle";
        s.style.top = p.t; s.style.left = p.l;
        s.style.animationDelay = (i * 0.3) + "s";
        s.innerHTML = starSVG();
        host.appendChild(s);
      });
      card.appendChild(host);
      card.dataset.sparkled = "1";
    });
  }

  // =========================================================================
  // HAND-DRAWN DOODLE ACCENTS, added next to eyebrows + key headings
  // =========================================================================
  function placeDoodles() {
    // Add a whisk doodle floating next to the first hero eyebrow
    const heroEyebrow = document.querySelector(".hero-stage .eyebrow");
    if (heroEyebrow && !heroEyebrow.dataset.doodled) {
      const stage = heroEyebrow.closest(".hero-stage");
      if (stage) {
        const whisk = document.createElement("div");
        whisk.className = "floating-doodle doodle-whisk";
        whisk.innerHTML = whiskDoodleSVG();
        stage.appendChild(whisk);

        const heart = document.createElement("div");
        heart.className = "floating-doodle doodle-heart";
        heart.innerHTML = heartDoodleSVG();
        stage.appendChild(heart);
      }
      heroEyebrow.dataset.doodled = "1";
    }

    // Add a squiggle flourish under the section-title-xl on home page
    document.querySelectorAll(".section-title-xl").forEach(t => {
      if (t.dataset.flourished) return;
      // Only the FIRST occurrence per section
      const flourish = document.createElement("div");
      flourish.className = "flourish-line";
      flourish.innerHTML = squiggleSVG();
      t.parentNode.insertBefore(flourish, t.nextSibling);
      t.dataset.flourished = "1";
    });

    // Highlighter underline removed, felt like scratching out text.
  }

  // =========================================================================
  // WAX-SEAL STAMPS, auto-add to hero sections
  // =========================================================================
  function placeStamps() {
    // Find the hero image (first <img> inside hero-stage that's not a doodle)
    // and place the wax stamp overlapping its bottom-right corner like an
    // envelope seal. Falls back to hero corner if no image is found.
    const hero = document.querySelector(".hero-stage");
    if (!hero || hero.dataset.stamped) return;

    const stampSVG = `
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="stamp-curve-top" d="M 18 60 a 42 42 0 0 1 84 0" fill="none"/>
          <path id="stamp-curve-bot" d="M 18 64 a 42 42 0 0 0 84 0" fill="none"/>
          <radialGradient id="stamp-glow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#C45478"/>
            <stop offset="60%" stop-color="#A0395E"/>
            <stop offset="100%" stop-color="#7A2849"/>
          </radialGradient>
        </defs>
        <!-- scalloped edge for wax-seal feel -->
        <circle cx="60" cy="60" r="55" fill="url(#stamp-glow)"/>
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,248,236,0.55)" stroke-width="1"/>
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,248,236,0.9)" stroke-width="0.8" stroke-dasharray="2 3"/>
        <text fill="#FAF3E0" font-family="Fraunces, serif" font-size="9" letter-spacing="3" font-weight="500">
          <textPath href="#stamp-curve-top" startOffset="50%" text-anchor="middle">EGGLESS · ALWAYS</textPath>
        </text>
        <text fill="#FAF3E0" font-family="Fraunces, serif" font-size="8" letter-spacing="3" font-style="italic">
          <textPath href="#stamp-curve-bot" startOffset="50%" text-anchor="middle">EST · 2020 · DELHI</textPath>
        </text>
        <text x="60" y="62" text-anchor="middle" fill="#FAF3E0" font-family="Fraunces, serif" font-size="20" font-style="italic" font-weight="500">TCB</text>
        <text x="60" y="76" text-anchor="middle" fill="#C9A96E" font-family="Inter, sans-serif" font-size="7" letter-spacing="3">★</text>
      </svg>
    `;

    // Look for a hero image to anchor against
    const heroImg = hero.querySelector(".image-mask, img");
    const target = heroImg ? (heroImg.closest(".image-mask") || heroImg) : null;

    const stamp = document.createElement("div");
    stamp.className = target ? "wax-stamp wax-stamp-on-image" : "wax-stamp wax-stamp-corner";
    stamp.setAttribute("aria-hidden", "true");
    stamp.innerHTML = stampSVG;

    if (target && target.parentNode) {
      // Anchor relative to the image's container so it overlaps the image corner
      const parent = target.parentNode;
      if (getComputedStyle(parent).position === "static") {
        parent.style.position = "relative";
      }
      parent.appendChild(stamp);
    } else {
      hero.appendChild(stamp);
    }
    hero.dataset.stamped = "1";
  }

  // =========================================================================
  // CURSOR TRAIL, tiny chocolate chips drop from cursor on desktop
  // =========================================================================
  // Custom cursor removed by request. Default browser cursor is used everywhere.
  function initCursorTrail() { /* no-op */ }

  // =========================================================================
  // CONFETTI BURSTS (rebuilt as proper sprinkle bursts)
  // =========================================================================
  function burstSprinkles(x, y, count = 18) {
    if (PRM) return;
    const burst = document.createElement("div");
    burst.className = "sprinkle-burst";
    burst.style.left = x + "px";
    burst.style.top = y + "px";
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "burst-piece";
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 60 + Math.random() * 50;
      piece.style.setProperty("--cx", Math.cos(angle) * dist + "px");
      piece.style.setProperty("--cy", Math.sin(angle) * dist + "px");
      piece.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      piece.style.animationDelay = (Math.random() * 0.08) + "s";
      const isChip = i % 4 === 0;
      const color = SPRINKLE_COLORS[i % SPRINKLE_COLORS.length];
      if (isChip) piece.innerHTML = chipSVG();
      else piece.innerHTML = sprinkleSVG(color, Math.random() * 360);
      piece.style.width = isChip ? "14px" : "5px";
      piece.style.height = isChip ? "17px" : "14px";
      burst.appendChild(piece);
    }
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1300);
  }

  // Hook cart adds
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-add-to-cart], .btn-quick-add");
    if (trigger) {
      const r = trigger.getBoundingClientRect();
      burstSprinkles(r.left + r.width / 2, r.top + r.height / 2, 22);
    }
  });

  // Konami-style easter egg: triple-click logo → giant burst
  let logoClicks = 0; let logoClickReset;
  document.addEventListener("click", (e) => {
    if (e.target.closest(".brand-wordmark")) {
      logoClicks++;
      clearTimeout(logoClickReset);
      logoClickReset = setTimeout(() => logoClicks = 0, 800);
      if (logoClicks >= 3) {
        logoClicks = 0;
        const cx = window.innerWidth / 2, cy = window.innerHeight / 3;
        burstSprinkles(cx, cy, 50);
        burstSprinkles(cx - 100, cy + 80, 30);
        burstSprinkles(cx + 100, cy + 80, 30);
      }
    }
  });

  // =========================================================================
  // HERO DRIP, molten chocolate drip from top edge
  // =========================================================================
  function placeDrip() {
    document.querySelectorAll(".hero-stage").forEach(stage => {
      if (stage.dataset.dripped) return;
      const drip = document.createElement("div");
      drip.className = "hero-drip";
      drip.setAttribute("aria-hidden", "true");
      drip.innerHTML = `
        <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 0 L1200 0 L1200 30
                   Q1130 65, 1080 35
                   Q1050 70, 980 40
                   Q950 75, 900 38
                   Q830 60, 760 30
                   Q700 70, 620 32
                   Q540 60, 470 32
                   Q400 75, 340 35
                   Q260 65, 190 33
                   Q120 60, 60 30
                   Q20 50, 0 30 Z"
            fill="#3D2817"/>
        </svg>
      `;
      stage.appendChild(drip);
      stage.dataset.dripped = "1";
    });
  }

  // =========================================================================
  // SCALLOPED SECTION DIVIDERS (auto-placed between alternating sections)
  // =========================================================================
  function placeScallops() {
    document.querySelectorAll("section[style*='var(--cream)']").forEach(section => {
      if (section.dataset.scalloped) return;
      const top = document.createElement("div");
      top.className = "scallop-top";
      top.innerHTML = `
        <svg viewBox="0 0 1200 30" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 L0 10 Q30 10 30 0 Q30 10 60 10 Q90 10 90 0 Q90 10 120 10 Q150 10 150 0 Q150 10 180 10 Q210 10 210 0 Q210 10 240 10 Q270 10 270 0 Q270 10 300 10 Q330 10 330 0 Q330 10 360 10 Q390 10 390 0 Q390 10 420 10 Q450 10 450 0 Q450 10 480 10 Q510 10 510 0 Q510 10 540 10 Q570 10 570 0 Q570 10 600 10 Q630 10 630 0 Q630 10 660 10 Q690 10 690 0 Q690 10 720 10 Q750 10 750 0 Q750 10 780 10 Q810 10 810 0 Q810 10 840 10 Q870 10 870 0 Q870 10 900 10 Q930 10 930 0 Q930 10 960 10 Q990 10 990 0 Q990 10 1020 10 Q1050 10 1050 0 Q1050 10 1080 10 Q1110 10 1110 0 Q1110 10 1140 10 Q1170 10 1170 0 Q1170 10 1200 10 L1200 30 Z" fill="var(--cream)"/>
        </svg>
      `;
      section.parentNode.insertBefore(top, section);
      section.dataset.scalloped = "1";
    });
  }

  // =========================================================================
  // INIT
  // =========================================================================
  function init() {
    mountBaker();
    scatterBakery();
    sparkleDoors();
    placeDoodles();
    placeStamps();
    placeDrip();
    placeScallops();
    initCursorTrail();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
