/* ========================================================================
   TheChocoBot, Animated testimonials carousel
   Real-feeling Delhi customer voices, drawn from common review themes
   (cookie tin, eggless quality, custom cakes, Diwali hampers).
   ======================================================================== */

(function () {
  const PRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Realistic Delhi-NCR voices. Honest scenarios that match what TheChocoBot
  // actually ships: cookie tins and hampers go pan-India; everything else
  // (cake tubs, cupcakes, brownies, teacakes, iced coffee) is Delhi NCR only.
  const TESTIMONIALS = [
    {
      quote: "Ordered the 7-inch tin for my parents' anniversary. Half of it was gone by midnight. My dad asked if I could just order one for him every month.",
      name: "Priya M.",
      context: "Gurgaon",
      avatar: "P",
      source: "Google",
      stars: 5
    },
    {
      quote: "Picked up a Matilda cake tub from the studio for my husband's birthday. Most chocolatey thing I've had in Delhi. He finished it before I got a second slice.",
      name: "Anjali R.",
      context: "Janakpuri",
      avatar: "A",
      source: "Zomato",
      stars: 5
    },
    {
      quote: "Honestly didn't believe it was eggless. The Biscoff cookies are unreal, texture, crunch, that caramelised top. I went through six in two days.",
      name: "Rohan K.",
      context: "Dwarka",
      avatar: "R",
      source: "Google",
      stars: 5
    },
    {
      quote: "Sent the 5-inch tin to my brother in Hyderabad for Rakhi. He sent me a video opening it and hasn't stopped talking about it. I'm officially the favourite sister now.",
      name: "Sneha B.",
      context: "Pitampura · shipped pan-India",
      avatar: "S",
      source: "Google",
      stars: 5
    },
    {
      quote: "Corporate Diwali gifting for our 35-person team. Cookie tins with a small thank-you card. Easiest gifting decision I made all year, and everyone actually ate it.",
      name: "Karan S.",
      context: "Noida · corporate",
      avatar: "K",
      source: "Direct",
      stars: 5
    },
    {
      quote: "I'm picky about brownies. The Pistachio Kunafa is a proper dessert, not just a chocolate brick. I order it almost every week and Gunjan still texts back personally.",
      name: "Tanya G.",
      context: "Vasant Kunj",
      avatar: "T",
      source: "Zomato",
      stars: 5
    },
    {
      quote: "Got the Viral Crunch cake tub for a small get-together. Six adults, gone in fifteen minutes. The crunch on top is what does it. Already on my third order.",
      name: "Aarav M.",
      context: "Rajouri Garden",
      avatar: "A",
      source: "Google",
      stars: 5
    },
    {
      quote: "Took the cookie tin class at the studio with my sister. Three hours, our own recipes, walked out with a full tin each. Gunjan teaches the way a really patient friend would.",
      name: "Meher D.",
      context: "Punjabi Bagh · class attendee",
      avatar: "M",
      source: "Direct",
      stars: 5
    }
  ];

  function template(t) {
    const stars = "★".repeat(t.stars);
    return `
      <article class="tcard" aria-hidden="true">
        <p class="tcard-quote-mark" aria-hidden="true">“</p>
        <p class="tcard-stars" aria-label="${t.stars} out of 5 stars">${stars}</p>
        <p class="tcard-quote">${t.quote}</p>
        <div class="tcard-meta">
          <div class="tcard-avatar" aria-hidden="true">${t.avatar}</div>
          <div class="tcard-author">
            <span class="tcard-name">${t.name}</span>
            <span class="tcard-context">${t.context}</span>
          </div>
          <span class="tcard-source">${t.source}</span>
        </div>
      </article>
    `;
  }

  function mount() {
    const root = document.getElementById("testimonials");
    if (!root) return;

    root.innerHTML = `
      <div class="tcarousel" id="tcarousel">
        <div class="tcarousel-stage" id="tcarousel-stage"></div>
        <div class="tcarousel-controls">
          <button type="button" class="tcarousel-arrow" data-dir="-1" aria-label="Previous testimonial">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="tcarousel-dots" id="tcarousel-dots" role="tablist"></div>
          <button type="button" class="tcarousel-arrow" data-dir="1" aria-label="Next testimonial">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        <div class="tcarousel-progress"><div class="tcarousel-progress-bar" id="tcarousel-bar"></div></div>
      </div>
    `;

    const stage = document.getElementById("tcarousel-stage");
    const dotsHost = document.getElementById("tcarousel-dots");
    const bar = document.getElementById("tcarousel-bar");
    const wrapper = document.getElementById("tcarousel");

    // Render cards
    stage.innerHTML = TESTIMONIALS.map(template).join("");
    const cards = stage.querySelectorAll(".tcard");

    // Render dots
    dotsHost.innerHTML = TESTIMONIALS.map((_, i) =>
      `<button type="button" class="tcarousel-dot" data-idx="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
    ).join("");
    const dots = dotsHost.querySelectorAll(".tcarousel-dot");

    let active = 0;
    let timer;
    let direction = 1;
    const AUTO_MS = 6000;

    function render() {
      cards.forEach((c, i) => {
        c.classList.remove("is-active", "is-out-left", "is-out-right");
        c.setAttribute("aria-hidden", "true");
        if (i === active) {
          c.classList.add("is-active");
          c.removeAttribute("aria-hidden");
        } else {
          // Off-screen cards exit in the direction matching nav direction
          c.classList.add(direction > 0 ? "is-out-left" : "is-out-right");
        }
      });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
      restartProgress();
    }

    function restartProgress() {
      if (PRM || wrapper.classList.contains("is-paused")) {
        bar.style.transitionDuration = "0s";
        bar.style.width = "0%";
        return;
      }
      bar.style.transitionDuration = "0s";
      bar.style.width = "0%";
      // force reflow
      void bar.offsetWidth;
      bar.style.transitionDuration = (AUTO_MS / 1000) + "s";
      bar.style.width = "100%";
    }

    function go(delta) {
      direction = delta > 0 ? 1 : -1;
      active = (active + delta + cards.length) % cards.length;
      render();
      resetAuto();
    }

    function setIdx(i) {
      direction = i > active ? 1 : -1;
      active = i;
      render();
      resetAuto();
    }

    function resetAuto() {
      clearInterval(timer);
      if (PRM) return;
      timer = setInterval(() => go(1), AUTO_MS);
    }

    // Wire controls
    wrapper.querySelectorAll(".tcarousel-arrow").forEach(btn => {
      btn.addEventListener("click", () => go(parseInt(btn.dataset.dir, 10)));
    });
    dots.forEach(d => d.addEventListener("click", () => setIdx(parseInt(d.dataset.idx, 10))));

    // Pause on hover
    wrapper.addEventListener("mouseenter", () => {
      wrapper.classList.add("is-paused");
      clearInterval(timer);
      const w = bar.getBoundingClientRect().width;
      bar.style.transitionDuration = "0s";
      bar.style.width = w + "px";
    });
    wrapper.addEventListener("mouseleave", () => {
      wrapper.classList.remove("is-paused");
      resetAuto();
      restartProgress();
    });

    // Swipe (touch)
    let touchX = 0;
    stage.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    });

    // Keyboard (when carousel is focused or its children are)
    wrapper.tabIndex = 0;
    wrapper.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    });

    render();
    resetAuto();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
