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
│   └── back.css        # "← Gallery" back-arrow styles used by every version
│                       # (later: logo, images, common content)
├── vercel.json         # Enables clean URLs (no build step)
└── README.md
```

## The Gallery (Home Page)

- A responsive **5×5 grid** of 25 tiles.
- Each tile shows a **miniature preview** of its version — either a scaled-down `<iframe>` of the real page (CSS `transform: scale(...)`, with pointer events disabled) or a static screenshot thumbnail if iframes prove too heavy.
- Each tile has a short label (version number + theme name).
- _Current state:_ tiles are plain labelled cards (`v01`–`v25`); previews will be added once the versions have content.
- Clicking a tile navigates to that version's full page.
- On smaller screens the grid collapses to fewer columns so tiles remain legible.

## The 25 Versions

Each version is a self-contained static page (HTML + CSS, with minimal or no JavaScript) built around one **niche theme or design concept**. Every version covers the same core content from the original school site, for example:

- School name, logo, and hero section
- Announcements / news
- Quick links (calendar, staff directory, athletics, counseling, etc.)
- Contact information and footer

Every version page includes a fixed **"← Gallery"** back arrow (top-left) that returns to the home page. Its styles live in `shared/back.css` so it looks the same everywhere, while each version's own look goes in its `style.css`.

What changes between versions is the design language: layout, typography, color palette, imagery, and overall tone. Themes will be documented here as they are built.

| #  | Theme | Status |
|----|-------|--------|
| 01–25 | _TBD_ | Blank placeholder page |

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
- [ ] Gather the core content from hall.whps.org
- [ ] Build the 25 versions
- [ ] Add mini previews to the gallery grid
- [ ] Make the gallery and every version responsive
- [ ] Deploy to Vercel
