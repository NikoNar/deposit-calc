# 🏦 Armenian Deposit Calculator

A modern, responsive compound interest deposit calculator built for the Armenian bank market.

**Features:** Multi-currency (AMD/USD/EUR) · Interest payment frequency · Goal Planner · Scenario Comparison · Charts · Excel export · Light/Dark mode

---

## 🚀 Deploy in 5 minutes

### Option A — Vercel (recommended, free)

1. Create a free account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. In this folder, run:
   ```bash
   npm install
   vercel
   ```
4. Follow the prompts — your site will be live at `https://your-project.vercel.app`

**To connect a custom domain:** Go to Vercel dashboard → your project → Settings → Domains → Add domain.

---

### Option B — Netlify (also free)

1. Create a free account at [netlify.com](https://netlify.com)
2. Build the project:
   ```bash
   npm install
   npm run build
   ```
3. Go to [netlify.com/drop](https://app.netlify.com/drop) and **drag the `build/` folder** into the browser.
4. Instant live URL. Done.

**To connect a custom domain:** Netlify dashboard → your site → Domain settings → Add custom domain.

---

### Option C — GitHub Pages (free)

1. Push this folder to a GitHub repository
2. Install the deploy tool:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add to `package.json` → `"homepage": "https://yourusername.github.io/deposit-calc"`
4. Add to `package.json` → `"scripts"`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
5. Run:
   ```bash
   npm run deploy
   ```

---

## 💻 Run locally

```bash
npm install
npm start
```
Opens at `http://localhost:3000`

---

## 📁 Project structure

```
deposit-calc/
├── public/
│   └── index.html          # HTML shell
├── src/
│   ├── index.js            # React entry point
│   └── App.jsx             # Main application (all logic + UI)
├── package.json
├── vercel.json             # Vercel config
├── netlify.toml            # Netlify config
└── README.md
```

---

## 🛠 Tech stack

- **React 18** — UI framework
- **Recharts** — charts
- **xlsx** — Excel export
- **Inter** (Google Fonts) — typography

---

*Built with ♥ by Codeman Studio*
