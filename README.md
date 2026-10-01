# hw1-dbs — 25 Redesigns of hall.whps.org

## Overview

This project reimagines the landing page of my former high school, Hall High School ([hall.whps.org](https://hall.whps.org)), as **25 distinct, niche static landing pages**. Each version takes a different design direction while presenting the same core school information.

All 25 versions live inside **one website**, deployed on the **Vercel free tier**. The home page is a **5×5 grid of mini landing pages** — scaled-down live previews of each version. Clicking a tile opens that version's full landing page.

## Goals

- Explore a wide range of visual and structural approaches to the same content.
- Keep every version fully static (no backend, no database) so the site is fast, cheap, and simple to host.
- Present all versions in a single gallery so they are easy to compare side by side.

## Site Structure

```
/                          → Gallery: 5×5 grid of mini previews
/versions/v01/ … /v25/     → Full landing page for each version
```

Links use relative paths (e.g. `versions/v01/index.html`, `../../index.html`) so the site works the same on Vercel, on a local static server, and when opened straight from disk. On Vercel, `cleanUrls` in `vercel.json` strips the `.html`/`index.html` from the address bar.

Repository layout:

```
.
├── index.html          # Gallery page (5×5 grid)
├── gallery.css         # Gallery styles
├── versions/
│   ├── v01/
│   │   ├── index.html  # Full landing page for version 1
│   │   └── style.css
│   ├── v02/
│   │   └── ...
│   └── v25/
├── shared/
│   ├── back.css        # "← Gallery" back-link styles used by every version
│   ├── a11y.css        # Shared accessibility panel + high-contrast/text-size effects
│   ├── a11y.js         # Injects the "Accessibility" button and panel
│   └── img/            # Hall Warriors logo + campus photos (from hall.whps.org)
├── PROCESS.md          # Design process log: rounds, decisions, what was dropped
├── vercel.json         # Enables clean URLs (no build step)
└── README.md
```

## The Gallery (Home Page)

- A responsive **5×5 grid** of 25 tiles.
- Each tile shows a **miniature preview** of its version — either a scaled-down `<iframe>` of the real page (CSS `transform: scale(...)`, with pointer events disabled) or a static screenshot thumbnail if iframes prove too heavy.
- Each tile has a short label (version number + theme name).
- Built versions show a live, scaled `<iframe>` preview (rendered at 1280×800, scaled by `gallery.js`); versions not yet started show a quiet numbered placeholder.
- Clicking a tile navigates to that version's full page.
- On smaller screens the grid collapses to fewer columns so tiles remain legible.

## The 25 Versions

Each version is a self-contained static page (HTML + CSS, with minimal or no JavaScript) built around one **niche theme or design concept**. Every version covers the same core content from the original school site, for example:

- School name, logo, and hero section
- Announcements / news
- Quick links (calendar, staff directory, athletics, counseling, etc.)
- Contact information and footer

Every version page includes a fixed **"← Gallery"** back link (bottom-left, so it never covers the logo) that returns to the home page. Its styles live in `shared/back.css` so it looks the same everywhere, while each version's own look goes in its `style.css`.

### Shared accessibility kit

Every built version loads `shared/a11y.css` and `shared/a11y.js`, which add a large, labelled **Accessibility** button (bottom-right; also `Alt+A`, or any `[data-a11y-toggle]` element) that opens a panel with: text size, high contrast, readable font (Atkinson Hyperlegible), line spacing, underline links, stop motion, and translate. Choices persist per browser. For high contrast to work, versions put every color through the tokens `--bg --surface --surface-2 --text --muted --brand --brand-2 --accent --line --on-brand`, and mark photo backgrounds with `data-a11y-bgimg` and scrims with `data-a11y-scrim`. Inside the gallery's previews, the button and back link are hidden.

What changes between versions is the design language: layout, typography, color palette, imagery, and overall tone. Themes will be documented here as they are built.

Today's schedule, lunch and some notices are **sample data** (fixed to Thu Oct 1, 2026); events, stats, mission and contact details come from hall.whps.org. Some sub-page and portal URLs are guesses or `#`.

| #  | Theme | Idea it tests | Status |
|----|-------|---------------|--------|
| 01 | Today Dashboard | No hero photo: a live "now / next" bell-schedule panel, six one-tap portal tiles, notices list, dismissible alert banner. Add `?t=HH:MM` to preview a time. | Built |
| 02 | Editorial Split | Magazine tone for prospective families: split navy/photo hero (name never over the photo), one-row "Today at Hall" strip, serif "by the numbers", newsroom lead story. | Built |
| 03 | Ask Hall | Search replaces the nav: plain-language search with synonyms ("sick" → report an absence), audience tabs, notices inbox with filters, Atkinson Hyperlegible throughout. | Built |
| 04 | Warrior Varsity | Dark, bold school spirit: condensed caps, scoreboard-style Today ribbon and pride stats, grouped game-day board, deliberately calm help panel. | Built |
| 05 | Portal Sidebar | App layout: fixed navy sidebar (no top bar), bento dashboard with live bell timeline, month calendar, light/dark theme toggle. | Built |
| 06–25 | _TBD_ | | Blank placeholder page |

## Tech Stack

- **HTML / CSS** (plain static files; optional light JavaScript for small interactions)
- **Vercel** (free tier) for hosting and deployment
- **GitHub** for version control; Vercel deploys automatically on push to `main`

## Running Locally

No build step. Either open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Deployment

1. Connect this GitHub repository to a Vercel project.
2. Use Vercel's static site defaults (no build step required).
3. Every push to `main` triggers a production deploy; branches / pull requests get preview deployments.

## Roadmap

- [x] Set up the repository structure and gallery page skeleton (blank gallery + 25 blank landing pages with back arrow)
- [x] Gather the core content from hall.whps.org
- [ ] Build the 25 versions (5 / 25 done)
- [x] Add mini previews to the gallery grid
- [ ] Make the gallery and every version responsive
- [ ] Deploy to Vercel
