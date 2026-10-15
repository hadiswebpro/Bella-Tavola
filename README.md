# 🍝 Bella Tavola

**A little taste of Italy, made with amore.**

Bella Tavola is a responsive, Italian-inspired restaurant website built with **React, TypeScript, and Vite**. Explore a delicious menu, discover customer favourites, and try a smooth demo ordering experience — all wrapped in a warm, food-first design.

### 🔴 [View Live Website](https://hadiswebpro.github.io/Bella-Tavola/)

> **Note:** This is a portfolio/demo project, not a real restaurant or ordering service. No payments are processed and no real orders are submitted.

## ✨ Features

- 🍕 **Browse the menu** — explore dishes and filter by food category.
- 🔎 **Instant search** — find dishes by name or description.
- ⭐ **Featured favourites** — discover popular dishes and their ratings.
- 🛒 **Interactive shopping cart** — add dishes, adjust quantities, remove items, and preview your basket.
- 💾 **Persistent cart** — cart contents are saved in localStorage.
- 🧾 **Demo checkout** — choose pickup or delivery, enter order details, and receive a demo confirmation.
- 🎟️ **Promo code** — use `BELLA10` for 10% off the food subtotal; the promotional banner can be dismissed.
- 🎨 **Responsive design** — warm Italian-inspired visuals, subtle animations, and mobile-friendly layouts.
- ♿ **Thoughtful UX** — accessible labels and support for reduced-motion preferences.

## 🛠️ Built With

- React 19
- TypeScript
- Vite
- CSS
- GitHub Actions & GitHub Pages

## 🚀 Run Locally

Make sure you have a recent version of Node.js and npm installed.

```bash
git clone https://github.com/hadiswebpro/Bella-Tavola.git
cd Bella-Tavola
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Other commands

```bash
npm run lint      # Check code with ESLint
npm run build     # Type-check and build for production
npm run preview   # Preview the production build locally
```

## 🧩 How It Works

The app uses React state to manage menu filters, search, basket interactions, checkout fields, and the promotional offer. Cart data is stored in the browser's localStorage so items can remain in the basket after refreshing the page.

The checkout flow is intentionally **demo-only**: totals, discounts, estimated taxes, and delivery fees are calculated on the client side. It does not connect to a payment processor or restaurant backend.

## 🌐 Deployment

Bella Tavola is deployed to **GitHub Pages** through a GitHub Actions workflow that builds the Vite application and publishes its `dist` output.

**Live demo:** https://hadiswebpro.github.io/Bella-Tavola/

## 👩‍💻 Author

**Hadis** · [GitHub Profile](https://github.com/hadiswebpro)

---

*Made with care, and a little Italian flavour. ❤️*
