# Apex Tax Solutions — Website

Static marketing site for [goapextax.com](https://goapextax.com). Built with Astro 6, styled with Tailwind CSS 4 via PostCSS.

## Prerequisites

- **Node.js** 18 or later (LTS recommended)
- **npm** (ships with Node)
- A GitHub account with push access to the repo
- A Netlify account connected to the repo (already configured)

## Project structure

```
src/
  layouts/Base.astro      ← shared header, footer, meta
  pages/                  ← file-based routing (each .astro = one page)
    index.astro           ← home
    about.astro
    contact.astro
    process.astro
    faq.astro
    services/
      index.astro
      tax-preparation.astro
      tax-representation.astro
      tax-advisory.astro
    blog/
      index.astro
  styles/global.css       ← Tailwind + design tokens
  config.js               ← Google Apps Script URL (form webhook)
public/
  images/                 ← static assets (photos, favicon)
google-sheets-setup/
  Code.gs                 ← Apps Script source (deployed separately)
  SETUP.txt               ← step-by-step Google Sheets wiring guide
netlify.toml              ← build command + publish dir
```

## Local development

### First-time setup

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

### Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:4321` with hot-reload. Edits to `.astro`, `.css`, and `.js` files reflect instantly.

### Build for production

```bash
npm run build
```

Outputs static files to `dist/`. This is the same command Netlify runs on deploy.

### Preview the production build locally

```bash
npm run preview
```

Serves the `dist/` folder at `http://localhost:4321` so you can verify the production build before pushing.

### Quick checklist before pushing

1. `npm run build` completes without errors
2. `npm run preview` — spot-check home, about, contact, and at least one service page
3. Submit a test form on the preview site (it will hit the live Google Sheets webhook, so use obvious test data you can delete)
4. Verify the Google Sheet received the test row

## Deployment

Deployment is fully automated via GitHub → Netlify.

### How it works

1. Push (or merge a PR) to the `main` branch on GitHub
2. Netlify detects the push, runs `npm run build`, and publishes `dist/`
3. The site is live at goapextax.com within ~60 seconds

### Step-by-step (if deploying for the first time)

1. **Push to GitHub**
   ```bash
   git add -A
   git commit -m "feat: <describe changes>"
   git push origin main
   ```

2. **Connect Netlify** (one-time)
   - Log into [app.netlify.com](https://app.netlify.com)
   - "Add new site" → "Import an existing project" → select the GitHub repo
   - Build settings are auto-detected from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Custom domain** (one-time)
   - In Netlify: Site settings → Domain management → Add custom domain → `goapextax.com`
   - In DNS (Squarespace or wherever the domain is managed):
     - `A` record for `@` → Netlify's load balancer IP (shown in dashboard)
     - `CNAME` for `www` → `<site-name>.netlify.app`
     - **Do not touch MX records** — those point to Google Workspace for email

4. **SSL** — Netlify provisions a Let's Encrypt cert automatically once DNS propagates

### Netlify Forms (backup)

Both forms also submit to Netlify Forms (`data-netlify="true"`) as a silent backup. View submissions at: Site dashboard → Forms.

## Form → Google Sheets webhook

The primary form destination is a Google Apps Script web app that appends rows to the "Website Form Submissions" Google Sheet.

- **Apps Script source:** `google-sheets-setup/Code.gs`
- **Deployed URL:** stored in `src/config.js`
- **Sheet columns:** Timestamp, First Name, Last Name, Email, Service Interest, Message, Source, Stage, Owner, Next Step, Notes

If you ever need to update the Apps Script:

1. Open the script at [script.google.com](https://script.google.com)
2. Edit `Code.gs`
3. Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy
4. The URL stays the same — no site changes needed

See `google-sheets-setup/SETUP.txt` for the full setup walkthrough.

## Common tasks

| Task | Command / action |
|------|-----------------|
| Add a new page | Create `src/pages/<name>.astro`, import `Base` layout |
| Add a blog post | Create `src/pages/blog/<slug>.astro` |
| Change colors/fonts | Edit `src/styles/global.css` (CSS custom properties at top) |
| Update form webhook URL | Edit `src/config.js` |
| Add static images | Drop files in `public/images/`, reference as `/images/<filename>` |
