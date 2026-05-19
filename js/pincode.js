/* ========================================================================
   TheChocoBot — Pincode delivery zone check
   Cakes & desserts: Delhi NCR only.
   Chocolates & cookies: pan-India.
   ======================================================================== */

(function () {
  // Delhi NCR pincode prefixes (3-digit prefixes per TECH.md)
  // 110xxx = Delhi, 1201xx = Noida, 1220xx = Gurgaon, 1210xx = Faridabad,
  // 1230xx = Ghaziabad. We accept the broader 11x and 12x ranges within these.
  const DELHI_NCR_PATTERNS = [
    /^110\d{3}$/, // Delhi
    /^1201\d{2}$/, // Noida
    /^1220\d{2}$/, // Gurgaon
    /^1210\d{2}$/, // Faridabad
    /^1230\d{2}$/, // Ghaziabad
    /^1240\d{2}$/  // Greater Noida / wider NCR
  ];

  // Indian pincode = 6 digits
  const PINCODE_RX = /^\d{6}$/;

  const Pincode = {
    isValid(pin) {
      return PINCODE_RX.test(String(pin).trim());
    },

    isDelhiNCR(pin) {
      const p = String(pin).trim();
      if (!this.isValid(p)) return false;
      return DELHI_NCR_PATTERNS.some(rx => rx.test(p));
    },

    /** Returns: { ok: bool, zone: 'delhi_ncr'|'pan_india'|null, message: str } */
    check(pin) {
      if (!pin) {
        return { ok: false, zone: null, message: "Enter your 6-digit pincode." };
      }
      if (!this.isValid(pin)) {
        return { ok: false, zone: null, message: "That doesn't look like a valid Indian pincode." };
      }
      if (this.isDelhiNCR(pin)) {
        return {
          ok: true,
          zone: "delhi_ncr",
          message: "Delhi NCR — we deliver everything to you. Fresh cakes included."
        };
      }
      return {
        ok: true,
        zone: "pan_india",
        message: "We ship chocolates, cookies and hampers to you. Fresh cakes & desserts are Delhi NCR only."
      };
    },

    /** Given a cart, returns if it can ship to a pincode. */
    canShipCart(pin, cart) {
      const res = this.check(pin);
      if (!res.ok) return { ok: false, reason: res.message };
      if (res.zone === "delhi_ncr") return { ok: true, zone: "delhi_ncr" };
      // pan_india zone — block if cart has Delhi-only items
      const delhiOnly = cart.delhiOnlyItems();
      if (delhiOnly.length > 0) {
        const names = delhiOnly.map(p => p.name).join(", ");
        return {
          ok: false,
          zone: "pan_india",
          reason: `${names} ${delhiOnly.length > 1 ? 'are' : 'is'} fresh — we only deliver these inside Delhi NCR. Remove them, or use a Delhi pincode.`
        };
      }
      return { ok: true, zone: "pan_india" };
    }
  };

  window.Pincode = Pincode;
})();
