/* ========================================================================
   TheChocoBot — Cart logic
   localStorage-backed. Emits 'cart:change' events for UI reactivity.
   ======================================================================== */

(function () {
  const STORAGE_KEY = "chocobot.cart.v1";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart:change", { detail: { items } }));
  }

  const Cart = {
    items() { return load(); },

    count() {
      return load().reduce((sum, item) => sum + item.qty, 0);
    },

    subtotal() {
      return load().reduce((sum, item) => {
        const p = window.findProduct(item.id);
        return sum + (p ? p.price * item.qty : 0);
      }, 0);
    },

    has(id) {
      return load().some(i => i.id === id);
    },

    add(productId, qty = 1) {
      const items = load();
      const existing = items.find(i => i.id === productId);
      if (existing) {
        existing.qty += qty;
      } else {
        items.push({ id: productId, qty });
      }
      save(items);
    },

    setQty(productId, qty) {
      const items = load();
      const item = items.find(i => i.id === productId);
      if (!item) return;
      if (qty <= 0) {
        save(items.filter(i => i.id !== productId));
      } else {
        item.qty = qty;
        save(items);
      }
    },

    increment(productId) {
      const items = load();
      const item = items.find(i => i.id === productId);
      if (item) {
        item.qty += 1;
        save(items);
      }
    },

    decrement(productId) {
      const items = load();
      const item = items.find(i => i.id === productId);
      if (!item) return;
      if (item.qty <= 1) {
        save(items.filter(i => i.id !== productId));
      } else {
        item.qty -= 1;
        save(items);
      }
    },

    remove(productId) {
      save(load().filter(i => i.id !== productId));
    },

    clear() {
      save([]);
    },

    /** Returns true if any cart item is Delhi-only (cakes/brownies). */
    hasDelhiOnlyItems() {
      return load().some(i => {
        const p = window.findProduct(i.id);
        return p && p.shipping_zone === "delhi_only";
      });
    },

    /** Returns list of Delhi-only items in cart. */
    delhiOnlyItems() {
      return load().filter(i => {
        const p = window.findProduct(i.id);
        return p && p.shipping_zone === "delhi_only";
      }).map(i => window.findProduct(i.id));
    }
  };

  window.Cart = Cart;
})();
