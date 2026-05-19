/* ========================================================================
   TheChocoBot — Page utilities
   - Fade-in scroll observer
   - Render helpers for product cards / category chips
   - URL param helpers
   ======================================================================== */

(function () {
  // ----- Fade-in on scroll -----
  function initFadeIn() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    document.querySelectorAll(".fade-in").forEach(el => io.observe(el));
  }

  // ----- Product card markup -----
  function productCard(p) {
    const isCake = p.shipping_zone === "delhi_only";
    const badge = p.bestseller
      ? `<span class="tag tag-bestseller image-badge">Bestseller</span>`
      : (isCake ? `<span class="tag tag-delhi image-badge">Delhi only</span>` : "");
    return `
      <a href="product.html?id=${p.id}" class="product-card group fade-in" aria-label="${p.name}">
        <div class="product-card-image">
          ${badge}
          <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async">
        </div>
        <div class="product-card-body">
          <h3 class="product-card-name">${p.name}</h3>
          <p class="product-card-desc">${p.description}</p>
          <div class="product-card-foot">
            <span class="product-price"><span class="currency">₹</span>${p.price.toLocaleString("en-IN")}</span>
            <button type="button" class="btn-quick-add" data-add-to-cart="${p.id}" aria-label="Add ${p.name} to cart" onclick="event.preventDefault();event.stopPropagation();window.Cart.add('${p.id}');window.openCart();">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </a>`;
  }
  window.productCard = productCard;

  // ----- Render a list of products into a container -----
  function renderProducts(containerEl, products) {
    containerEl.innerHTML = products.map(productCard).join("");
    initFadeIn();
  }
  window.renderProducts = renderProducts;

  // ----- URL params -----
  window.urlParam = function (name) {
    return new URLSearchParams(location.search).get(name);
  };

  // ----- Init -----
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFadeIn);
  } else {
    initFadeIn();
  }
  window.initFadeIn = initFadeIn;
})();
