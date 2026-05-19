/* ========================================================================
   TheChocoBot — Razorpay checkout integration (front-end)
   --------------------------------------------------------------------
   IMPORTANT: For a real production setup you must:
     1. Create the order on your server (POST /api/orders) which calls
        Razorpay's "Orders" API to get a server-generated order_id.
        Razorpay key SECRET must never live in the browser.
     2. Verify the signature on your server after payment success
        (HMAC SHA256 of order_id|payment_id with key_secret).
     3. Persist the order in your DB (or a Google Sheet via Apps Script).

   This file simulates the flow for v1 demo/preview use. Replace the
   `placeOrder` call with a real fetch() to your backend before launch.
   ======================================================================== */

(function () {
  // Replace with your real Razorpay PUBLIC key (test mode first):
  // const RZP_KEY_ID = "rzp_test_XXXXXXXXXX";
  // Or pull from a global injected by your build pipeline.
  const RZP_KEY_ID = window.__RAZORPAY_KEY_ID__ || "rzp_test_REPLACE_ME";

  async function createOrderOnServer(amountInPaise, meta) {
    /*
     * REAL IMPLEMENTATION:
     * const res = await fetch("/api/orders", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify({ amount: amountInPaise, currency: "INR", meta })
     * });
     * return await res.json(); // { id: "order_xxx", amount, currency }
     */
    // STUB for preview:
    return new Promise(resolve => {
      setTimeout(() => resolve({
        id: "order_local_" + Math.random().toString(36).slice(2, 10).toUpperCase(),
        amount: amountInPaise,
        currency: "INR"
      }), 250);
    });
  }

  async function saveOrder(orderRecord) {
    /*
     * REAL IMPLEMENTATION (Google Sheet via Apps Script):
     * await fetch(window.SITE_SHEET_WEBHOOK, {
     *   method: "POST",
     *   body: JSON.stringify(orderRecord)
     * });
     */
    // STUB: persist to localStorage so admin.html can show it
    try {
      const arr = JSON.parse(localStorage.getItem("chocobot.orders.v1") || "[]");
      arr.push(orderRecord);
      localStorage.setItem("chocobot.orders.v1", JSON.stringify(arr));
    } catch (e) {
      console.warn("[ChocoBot] Could not persist order to localStorage:", e);
    }
    console.log("[ChocoBot] Order recorded (stub):", orderRecord);
  }

  function showSuccess(orderId) {
    document.getElementById("ord-id").textContent = orderId;
    document.getElementById("success-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    const close = () => {
      document.getElementById("success-modal").classList.add("hidden");
      document.body.style.overflow = "";
    };
    document.getElementById("success-close").addEventListener("click", close, { once: true });
  }

  window.startRazorpayCheckout = async function ({ amount, customer, orderMeta }) {
    const amountInPaise = Math.round(amount * 100);

    // Create order
    const order = await createOrderOnServer(amountInPaise, orderMeta);

    // Stub path — no real Razorpay account configured
    if (!RZP_KEY_ID || RZP_KEY_ID.includes("REPLACE_ME")) {
      console.warn("[ChocoBot] Razorpay key not set. Running in DEMO mode (no real payment).");
      const orderId = "CBOT-" + Date.now().toString(36).toUpperCase();
      await saveOrder({
        order_id: orderId,
        amount, ...customer, ...orderMeta,
        payment_method: "demo-stub",
        created_at: new Date().toISOString()
      });
      window.Cart.clear();
      showSuccess(orderId);
      return;
    }

    // Real Razorpay path
    if (typeof window.Razorpay !== "function") {
      alert("Payment SDK didn't load. Please refresh and try again, or contact us on WhatsApp.");
      return;
    }

    const options = {
      key: RZP_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "TheChocoBot",
      description: "Order " + order.id,
      order_id: order.id,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone
      },
      theme: { color: "#3D2817" },
      modal: {
        ondismiss: function () {
          console.log("[ChocoBot] Razorpay modal dismissed.");
        }
      },
      handler: async function (response) {
        // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        // VERIFY SIGNATURE ON SERVER before treating as paid:
        // await fetch("/api/orders/verify", { method:"POST", body: JSON.stringify(response) });
        await saveOrder({
          order_id: order.id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          amount, ...customer, ...orderMeta,
          payment_method: "razorpay",
          created_at: new Date().toISOString()
        });
        window.Cart.clear();
        showSuccess(order.id);
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.error("[ChocoBot] Payment failed:", response.error);
      alert("Payment failed — " + (response.error?.description || "unknown reason") + ". You can try again, or message us on WhatsApp.");
    });
    rzp.open();
  };
})();
