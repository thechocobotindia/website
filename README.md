# The ChocoBot — Website

A premium, eggless-by-design e-commerce site for **The ChocoBot** by **Gunjan Chopra** — IHM-trained baker and VLCC-certified Nutritionist. Studio: **Vikaspuri, New Delhi**. FSSAI Reg. **23321006001296**.

## Tech stack
**Plain HTML / CSS / JavaScript.** No build step, no Node.js, no framework. Runs anywhere.

- Tailwind CSS via CDN (utility classes only)
- Custom brand styles in [`css/styles.css`](css/styles.css) — ~950 lines including animations
- Vanilla JS for cart, pincode, products, components, animations, welcome popup
- Razorpay Standard Checkout (loads from their CDN)
- Google Fonts: Fraunces (serif headings) + Inter (body)
- localStorage for cart, subscribers, orders, enquiries

## Pages — 11 total
| File | What's on it |
|---|---|
| [`index.html`](index.html) | Hero · marquee · The Cookie Tin signature with stat counters · Meet the Maker · Three Doors (Menu/Studio/Atelier) · Inner Circle band · Instagram preview · Testimonials |
| [`menu.html`](menu.html) | Filterable catalogue with category chips, pincode delivery check |
| [`product.html`](product.html) | Dynamic detail (`?id=…`), qty stepper, ingredients/allergens accordion, related products |
| [`about.html`](about.html) | Vol. II · The Maker · Three Rules (Eggless / Slow / Examined) · credentials grid |
| [`classes.html`](classes.html) | The Studio · 3 sample upcoming classes · private class enquiry |
| [`events.html`](events.html) | The Atelier · 6 service tiles · 4-step process · enquiry form |
| [`inner-circle.html`](inner-circle.html) | Membership page · sample Letter № 14 · 4 benefit cards |
| [`blog.html`](blog.html) | Journal — Featured + 6 recent posts + vlogs grid |
| [`custom-orders.html`](custom-orders.html) | Bespoke enquiry form (8 fields + file upload) |
| [`contact.html`](contact.html) | WhatsApp/Call/Email/Instagram · Vikaspuri location · shipping zones |
| [`faq.html`](faq.html) | 6 categories incl. eggless · privacy · terms · refunds anchors |
| [`checkout.html`](checkout.html) | Address + payment · live pincode check · 10% welcome discount auto-applied |
| [`admin.html`](admin.html) | Studio admin · orders + subscribers + enquiries · CSV export · backend wiring guide |

## File structure
```
TheChocoBot/
├── *.html                          (13 pages)
├── css/styles.css                  (brand + animation theme)
├── js/
│   ├── products.js                 (catalogue: signature/cookies/brownies/cupcakes/cakes/loaves/hampers)
│   ├── cart.js                     (cart state, localStorage)
│   ├── pincode.js                  (Delhi NCR delivery rules)
│   ├── components.js               (shared header/footer/cart drawer/WhatsApp FAB)
│   ├── animations.js               (scroll reveal, parallax, tilt, counters, word reveal)
│   ├── welcome.js                  (10% off popup + email/phone capture)
│   ├── main.js                     (product card rendering, util)
│   └── razorpay-checkout.js        (payment integration, currently STUBBED)
├── images/
│   ├── hero/                       (4 hero shots)
│   ├── products/{chocolates,cookies,cakes,brownies}/
│   ├── hampers/                    (6 hamper shots)
│   ├── detail/                     (3 texture/detail shots)
│   └── _raw/                       (full-res originals — empty for now)
├── BRIEF.md, DESIGN.md, CONTENT.md, TECH.md  (project specs — kept for reference)
└── README.md
```

## Brand identity baked in
- **Founder**: Gunjan Chopra
- **Credentials**: IHM (bakery & confectionery) · VLCC-certified Nutritionist · FSSAI registered (23321006001296)
- **Studio**: Vikaspuri, New Delhi · Est. 2020
- **Contact**: WhatsApp +91 88515 22130 · Call +91 79823 43048 · `thechocobot5@gmail.com` · `@the_choco_bot`
- **Tagline**: *Eggless by design, never by apology.*
- **Hero**: *"For every craving, every mood."*
- **Hours**: Mon–Sat 10am–8pm · Sunday rest

## Running locally
Python 3 is installed on macOS by default. Run:
```bash
cd "/Users/divyachopra/Desktop/Claude existing/TheChocoBot"
python3 -m http.server 8000
```
Then open **http://localhost:8000**. Stop with `Ctrl+C`.

## Features delivered

### Storefront
- Filterable product catalogue (Signature / Cookies / Brownies / Cupcakes / Cakes / Loaves / Hampers)
- Cart drawer with localStorage persistence, runs across all pages
- Dynamic product detail (`product.html?id=…`)
- Pincode-aware delivery: blocks fresh items outside Delhi NCR
- Free shipping above ₹2,500 (after discount)

### Inner Circle / Welcome system
- Pop-up shown 4s after first visit
- Captures email + phone + birthday + consent
- Issues unique welcome code (`CHOCO###`)
- Auto-applies 10% off at checkout
- Subscriber list visible in admin view
- "Reset welcome offer" link in footer

### Payment
- Razorpay Standard Checkout integration ready
- DEMO mode active when no key configured — generates fake order IDs so the flow can be tested end-to-end
- Persists every order to localStorage (admin view reads from here)

### Admin
- [`admin.html`](admin.html) shows real-time stats: orders today, total orders, subscribers, enquiries
- CSV export for orders, subscribers, enquiries
- Full guide for wiring real backend (Google Sheets / Firebase / Supabase)

### Animations
- Hero entrance choreography (staggered fade-up, image mask reveal)
- Scroll-driven progress bar (gold line under header)
- Reveal-on-scroll + reveal-stagger for sections
- Word-by-word headline reveal
- Card 3D mouse-tilt
- Animated number counters
- Floating decorative elements
- Marquee strip (eggless / IHM / VLCC / FSSAI loop)
- Page-load curtain
- Button shimmer on hover
- Honors `prefers-reduced-motion`

## Before going live — the real-backend checklist

The site is fully functional in DEMO mode. For production:

### 1. Razorpay
Get keys from [dashboard.razorpay.com](https://dashboard.razorpay.com).
- Replace `RZP_KEY_ID` in [`js/razorpay-checkout.js`](js/razorpay-checkout.js) (start with TEST key `rzp_test_…`)
- Build a backend endpoint to create Razorpay orders (`POST /api/orders`) — Razorpay secret must never live in browser
- Build a signature-verification endpoint (HMAC SHA256 on payment success)
- The stub in `razorpay-checkout.js` shows where to plug both in

### 2. Subscriber / order persistence
Currently writes to `localStorage`. For multi-device persistence, replace stubs with backend calls:
- In [`js/welcome.js`](js/welcome.js) → `saveSubscriber()`
- In [`js/razorpay-checkout.js`](js/razorpay-checkout.js) → `saveOrder()`
- Easiest: Google Apps Script → Google Sheet (free, ~20 lines)
- Better: Firebase or Supabase (still free tier)

### 3. Real photography
All photos are currently Unsplash (free for commercial use). Replace by:
- Drop real photos into `images/products/{category}/` and `images/hero/`
- Update the `image` field for each product in [`js/products.js`](js/products.js)

### 4. Real menu from Zomato
The catalogue uses your confirmed Cookie Tin prices + realistic estimates for the rest. Paste your exact Zomato menu + prices and we'll update [`js/products.js`](js/products.js) in one pass.

### 5. SEO finishing touches
- Add `favicon.ico` and `apple-touch-icon.png` to root
- Generate `sitemap.xml` and `robots.txt`
- Add Product schema to `product.html` (template ready in head)

### 6. Domain + hosting
- Suggested domain: `www.thechocobot.com`
- Static host options: **Netlify Drop** (drag the folder), **Vercel** (push to GitHub), **Cloudflare Pages**

## Brand palette
| Token | Hex | Use |
|---|---|---|
| Cocoa | `#3D2817` | Primary text, buttons |
| Chocolate | `#5C3A21` | Button hover |
| Cream | `#FAF3E0` | Section backgrounds |
| Ivory | `#FFF8EC` | Page background |
| Gold | `#C9A96E` | Accents, hover, badges |
| Gold Dark | `#a88a51` | Eyebrows, accent text |
| Blush | `#F4C2C2` | Delhi-only tag, soft hovers |

Fonts: **Fraunces** (serif headings) · **Inter** (body).

## Discount codes reserved
| Code | Discount | Notes |
|---|---|---|
| `CHOCO###` | 10% | Auto-generated for Inner Circle members |
| `FIRSTBOX` | 10% | Manual entry, first-order code |
| `EGGLESS20` | 20% | Promo / influencer code |

---

Built quickly. Made deliberately. Premium feel, fun voice, every animation chosen — not added for the sake of it.
