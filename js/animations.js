/* ========================================================================
   TheChocoBot — Animation engine
   Premium, restrained motion. Honors prefers-reduced-motion.
   ======================================================================== */

(function () {
  const PRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ----- 1. Hero entrance choreography -----
  function fireHero() {
    document.querySelectorAll(".hero-stage").forEach(el => {
      requestAnimationFrame(() => el.classList.add("ready"));
    });
    document.querySelectorAll(".image-mask").forEach(el => {
      requestAnimationFrame(() => el.classList.add("revealed"));
    });
  }

  // ----- 2. Reveal-on-scroll observer -----
  function initReveal() {
    const targets = document.querySelectorAll(".reveal, .reveal-stagger, .fade-in");
    if (targets.length === 0) return;
    if (PRM) {
      targets.forEach(t => t.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    targets.forEach(t => io.observe(t));
  }

  // ----- 3. Word-by-word headline reveal -----
  function splitWords() {
    document.querySelectorAll("[data-words]").forEach(el => {
      if (el.dataset.split) return;
      const text = el.textContent.trim();
      el.innerHTML = text.split(/\s+/).map((w, i) =>
        `<span class="word" style="transition-delay:${0.05 + i * 0.07}s">${w}</span>`
      ).join(" ");
      el.classList.add("word-reveal");
      el.dataset.split = "1";
    });
    const headlines = document.querySelectorAll(".word-reveal");
    if (PRM) {
      headlines.forEach(h => h.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    headlines.forEach(h => io.observe(h));
  }

  // ----- 4. Parallax on scroll -----
  function initParallax() {
    if (PRM) return;
    const items = document.querySelectorAll("[data-parallax]");
    if (items.length === 0) return;
    let raf;
    const update = () => {
      const scrollY = window.scrollY;
      items.forEach(el => {
        const rate = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const inView = rect.bottom > 0 && rect.top < window.innerHeight;
        if (inView) {
          const offset = (scrollY + window.innerHeight / 2 - (rect.top + scrollY + rect.height / 2)) * rate;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
      raf = null;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  // ----- 5. Card 3D tilt -----
  function initTilt() {
    if (PRM) return;
    document.querySelectorAll(".tilt").forEach(card => {
      const max = 6;
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rotY = (px - 0.5) * max * 2;
        const rotX = (0.5 - py) * max * 2;
        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // ----- 6. Count-up numbers -----
  function initCounter() {
    const counters = document.querySelectorAll(".counter[data-to]");
    if (counters.length === 0) return;
    const animate = el => {
      const to = parseFloat(el.dataset.to);
      const dur = parseInt(el.dataset.dur || "1400", 10);
      const fmt = el.dataset.fmt; // "comma" | "decimal"
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = to * eased;
        let out;
        if (fmt === "decimal") out = val.toFixed(1);
        else if (fmt === "comma") out = Math.round(val).toLocaleString("en-IN");
        else out = Math.round(val);
        el.textContent = out;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (PRM) {
      counters.forEach(c => {
        const to = parseFloat(c.dataset.to);
        c.textContent = c.dataset.fmt === "decimal" ? to.toFixed(1) : Math.round(to).toLocaleString("en-IN");
      });
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  // ----- 7. Soft cursor dot (desktop only, opt-in via body[data-cursor]) -----
  function initCursor() {
    if (PRM) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (!document.body.dataset.cursor) return;
    const dot = document.createElement("div");
    dot.className = "cursor-dot active";
    document.body.appendChild(dot);
    let x = -100, y = -100, tx = -100, ty = -100;
    const move = () => {
      tx += (x - tx) * 0.22;
      ty += (y - ty) * 0.22;
      dot.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
      requestAnimationFrame(move);
    };
    window.addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; });
    document.addEventListener("mouseover", e => {
      if (e.target.closest("a, button, .product-card, .door-card")) dot.classList.add("large");
      else dot.classList.remove("large");
    });
    move();
  }

  // ----- 8. Page fade-in (soft curtain) -----
  function initCurtain() {
    document.body.classList.add("page-curtain");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.add("shown"));
    });
  }

  // Init
  function init() {
    initCurtain();
    fireHero();
    splitWords();
    initReveal();
    initParallax();
    initTilt();
    initCounter();
    initCursor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
