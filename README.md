# hw1-dbs — 25 Redesigns of hall.whps.org

## Overview

This project reimagines the landing page of my former high school, Hall High School ([hall.whps.org](https://hall.whps.org)), as **25 static landing pages**, moving from wide exploration to one final choice. **v25 is the final page.**

All 25 versions live in **one website** on the **Vercel free tier**. The home page is a gallery of live miniature previews grouped by round; clicking a tile opens that version's full page, and every page has a "← Gallery" link back.

**Who the page is for:** current students and their families first (they visit almost daily and want something specific, fast), prospective and incoming families second. District staff are not the audience. A visitor should be able to tell where they are, get today's essentials (odd/even day, bell schedule, lunch, PowerSchool, Schoology, Naviance) in one tap, see what's coming up, find help calmly, and contact the school. See `AGENTS.md` for the full brief.

## The Process

**The plan:** go wide (v01–v12), explore by combining what works (v13–v18), then converge one refinement at a time until v25 (v19–v25). Each round started with me choosing what to vary and ended with my feedback, with a commit per round.

### Starting point

I started from a screenshot of the real homepage and listed what's wrong with it: a hard-to-see logo, the school name in white text over a photo slideshow, ~130px of top bars, news buried in a rotating slideshow, a tiny accessibility icon, and no daily essentials up front. I set two constraints for every version: **keep Hall's dark navy** and **make accessibility a priority**.

### Round 1 — Initial Five Layouts (v01–v05)

A deliberately generic baseline: five competent, modern answers to the real site's problems, as different from each other as possible, to see what a "normal" good redesign looks like and to have something to push away from.

| # | Gallery caption | Note |
|---|---|---|
| v01 | Today-first dashboard | Day by day: the live bell schedule and the day's progress lead the page. |
| v02 | Magazine layout | Split hero, then editorial sections and a lead story, like a magazine spread. |
| v03 | Search-bar focused | One big plain-language search box replaces the menu. |
| v04 | Big banner + scoreboard | Bold hero, then a scoreboard-style ribbon for today and school spirit. |
| v05 | Sidebar app | Fixed side menu and a bento dashboard, like a web app. |

**Takeaways.** v01/v05 and v02/v04 overlapped: the differences were mostly skin, not structure. Ideas worth keeping: v01's live "now / next" schedule, v03's plain-language search, v04's calm help panel, and the shared accessibility kit. Claude invented a few details (an "80+ clubs" claim, a Support Services subtitle); I removed them and kept content to what the real site says. Round 1 came from a single prompt, so from here on I chose each round's direction myself.

### Round 2 — Three Moods (v06–v08)

Round 1 varied only layout, so Round 2 varies **mood**: the same content made calm, loud and warm. The rule: a mood has to show up in words, structure, imagery and interaction, not just colors and fonts, and today's essentials must still be findable in under 5 seconds.

| # | Gallery caption | Note |
|---|---|---|
| v06 | Calm | Quiet Hall: relaxing to look at, with soft navy, lots of space and plain, clear words. |
| v07 | Loud & spirited | Pep Rally: solid loud color, chants, a live score ticker and a cheer meter. |
| v08 | Warm & welcoming | Welcome Mat: "welcome" in Hall's many languages and notes from real people. |

**My pushback.** The moods drifted to royal blue, slate and terracotta, so I made **Hall's navy the theme color on every version**. v06 told students to relax ("Nothing urgent right now", a breathing exercise); a school site shouldn't tell students how to feel, so calm moved into the *look* and the copy went back to plain dates and facts. In v07 I dropped the condensed poster font and halftone background for solid color blocks, and kept the score ticker.

### Round 3 — Four Content Priorities (v09–v12)

I first tried a round varying **navigation** (tabs, a vertical "transit line", navigating by time) and threw it out before committing: changing how you move between sections didn't change what visitors see first. The better question was **which content leads the page**, an idea that came from v04 working so well for sports fans. Each version commits fully to one kind of content; today's essentials stay one tap away near the top.

| # | Gallery caption | Note |
|---|---|---|
| v09 | Announcements first | The Bulletin: the most urgent notice is the headline, then every notice sorted by what you need to do. |
| v10 | Events first | On the Calendar: this week, the next event and October lead the page. |
| v11 | Athletics first | Game Day: the next game, scores and the trophy case lead the page. |
| v12 | Student life first | Find Your People: arts, clubs, culture and sports, for students and new families. |

Left out: news (too close to announcements), quick links (v01 and v04 already lead with them) and academics (mostly static pages). The first build gave all four v04's look; I asked for each to get its own style instead — a service-alert page, a Swiss-grid wall calendar, a retro game-day program and a sticker-and-bento look — to widen the range of ideas.

### Round 4 — Combining (v13–v18)

Explore by putting together the ideas from v01–v12 that worked.

| # | Gallery caption | Note |
|---|---|---|
| v13 | Today + announcements | v01's today info compressed to one band, then v09's announcements first, stated calmly by date. |
| v14 | Today \| announcements | v13 rebalanced in v02's editorial style: today's schedule and announcements share the first screen equally. |
| v15 | Today + game day | v14's today info at the top left beside a small v04 banner, then v04's game day & events by category, next dates first, beside the bulletin. |
| v16 | Today feed | v15 refined: dropdown nav, banner left and today right with today's events and the next two days, then the two nearest dates in each category. |
| v17 | Families first | Audiences switched: prospective families lead, with v08's warmth in v16's type. Current students keep a one-line strip at the top; a language menu replaces the welcome words. |
| v18 | Today band + search | v16 with v13's expanding today band under the nav, a horizontal banner, v03's search kept small in the nav, and v17's language menu. |

**Why these choices.** v01's today panel had the right facts but dominated the page, so v13 compressed it into one band. v09 felt urgent ("Action needed", countdowns), so v13 states announcements calmly by date. v02 was the best-looking design so far, so v14 borrowed its serif headlines, navy and gold. v04's banner took too much of the first screen, so v15 shrank it. v17 tested the opposite audience; it kept v08's warmth but dropped the "welcome" words, which took the top of the page without telling families anything, and turned translation into a **Language** menu. v18 went back to current students first and pulled the best pieces together, with search kept small as a helper rather than the focus.

### Round 5 — Converging (v19–v25)

v18 worked well for both current and prospective students and families, so from here each version refines the one before it.

| # | Gallery caption | Note |
|---|---|---|
| v19 | Today band, refined | v18 refined: the name stands alone in the nav, banner and footer, lunch in the today band cycles through the whole menu, and the search hint always fits its box. |
| v20 | Today band, rebalanced | v19 with the today band remade: a wider, taller day bar labelled "Block", lunch names only (tags in the full menu), and portals 2 × 2. |
| v21 | Banner video | v20 with hall.whps.org's banner video in place of the photo, and a clip bar like the day bar: one segment per clip, the clip named beside a pause button. |
| v22 | Wider, clip dots | v21 refined: a wider page and a larger video with clip dots and a square pause button; the day bar centered in the today band, and "Quick links" labelled. |
| v23 | Light blue, centered dots | v22 refined: light blue replaces the warm paper, the clip dots are centered and fainter when not playing, and the banner links are centered. |
| v24 | Literata, student life | v23 with Literata for every serif, a student life section under game day & events, a bulletin without repeats, and a larger top bar. |
| v25 | Final | The final page: v24 with "Quick links" centered, a low-profile bulletin of upcoming notices only, and every student link from the real site in two-column menus. |

**Notable steps.** The day bar cut "Advisory" down to "A…", so v20 gave it more of the band. For v21 I asked whether the real site's 73-second video could be used; Claude found the MP4, re-encoded a 7.3 MB 720p copy, and found the 22 clip cuts with ffmpeg scene detection. In v23 I asked Claude to verify that the clip dots jump to the right clip; they didn't on a simple local server (no range requests), so it now loads the whole video once in that case and was tested on both kinds of server. In v24 I dropped Fraunces because its ampersand curls around itself at large sizes; Claude compared six serifs and Literata won. For v25 I gave Claude the real site's list of student links and made sure every one is reachable from the nav or search.

### The final choice: v25

v25 serves the primary audience first without shutting out the secondary one:

- **Today, in one band.** Date, odd/even day, a now/next line with a block-by-block day bar, rotating lunch and quick links (PowerSchool, Schoology, Naviance, calendar), expanding to the full bell schedule, lunch menu and the next few days' events.
- **Hall at a glance.** A banner with the school's own video, mission, and links for game day and new families.
- **What's coming up.** Game day & events by category, nearest dates first, then student life and a low-profile bulletin of upcoming notices only.
- **Help, shown once and calmly.** Counseling, support services and Anonymous Alerts.
- **Everything findable.** Every student link from the real site in the nav, plus plain-language search ("sick" → report an absence).

**What I dropped along the way, and why:**

- **Search as the main navigation (v03).** It's useful when you can't find something, so it stayed, but small in the nav.
- **Mood-first designs (v06–v08).** They taught me that mood belongs in the look, not in copy that tells students how to feel.
- **The navigation round.** It never shipped, because it didn't change what visitors see first.
- **Families first (v17).** Current students visit every day, so they lead; families get the banner, "New to Hall?" and the language menu.
- **"Welcome" in many languages.** Replaced by a real Language menu.
- **Urgency labels and countdowns (v09).** Replaced by plain dates.
- **Fraunces and the warm paper.** Replaced by Literata and light blue.

### How I used Claude

- **What I asked for.** I chose the variable for each round (layout, mood, content priority, combinations) and specific refinements. Claude proposed concrete directions within each round, wrote shared briefs, and built versions in parallel.
- **Where I pushed back.** I removed invented facts, enforced Hall's navy on every version, rejected v06's "relax" copy and v09's urgency, and dropped v07's poster font and v08's fonts and welcome words. When all four content-priority versions came back looking like v04, I asked for a distinct look for each. I also threw out the navigation round.
- **What I decided myself.** The audience, the constraints, which versions to combine, the final direction (v18 → v25), the font and color changes, and that every real student link must be reachable.
- **Working agreement** (in `AGENTS.md`): I direct the design decisions; Claude proposes options and doesn't commit or push without my approval.

## Shared Across Every Version

- **Real content.** The logo, photos, video, events, pride stats, mission and contact details come from hall.whps.org. Today's schedule, lunch and some notices are **sample data** (fixed to Thu Oct 1, 2026), and v06–v08 add invented items to sell their mood; each footer says what is sample data. Some sub-page and portal URLs are guesses or `#`.
- **Accessibility kit** (`shared/a11y.js`, `shared/a11y.css`). A large, labelled **Accessibility** button (also `Alt+A`) opens a panel with text size, high contrast, readable font, line spacing, underlined links, stop motion and translate. Choices are remembered in the browser. For high contrast to work, every color goes through shared tokens (`--bg --surface --text --brand --accent …`).
- **"← Gallery" link.** It sits at the bottom left so it never covers the logo, with its styles in `shared/back.css`. In the gallery's previews, the button and back link are hidden.

## Site Structure

```
/                          → Gallery: live previews grouped by round
/versions/v01/ … /v25/     → Full landing page for each version
```

```
.
├── index.html          # Gallery page
├── gallery.css         # Gallery styles
├── gallery.js          # Scales the live iframe previews
├── versions/
│   └── v01/ … v25/     # index.html + style.css (+ script.js where needed)
├── shared/
│   ├── back.css        # "← Gallery" back-link styles
│   ├── a11y.css        # Accessibility panel + high-contrast/text-size effects
│   ├── a11y.js         # Injects the Accessibility button and panel
│   ├── img/            # Hall Warriors logo, campus photos, video poster
│   └── video/          # Banner video from hall.whps.org (720p re-encode)
├── AGENTS.md           # The idea, audience, design rules and working agreement
├── vercel.json         # Enables clean URLs (no build step)
└── README.md
```

Links use relative paths, so the site works the same on Vercel, on a local static server, and opened straight from disk. On Vercel, `cleanUrls` strips `.html`/`index.html` from the address bar.

## Tech Stack

- Plain **HTML and CSS**, with light vanilla **JavaScript** for small interactions. There is no framework, package or build step.
- **GitHub** for version control. **Vercel** (free Hobby plan) deploys on every push to `main`.

## Running Locally

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit http://localhost:8000.
