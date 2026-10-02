# Design Process

A running log of how the 25 versions came together: what I asked for, what I decided, what I dropped and why. Newest round at the bottom.

**The plan:** go wide (v01–v14), then narrow by combining what works (v15–v20), then converge one refinement at a time until v25 is the final choice. *(Updated in Round 2: before going wide, I spent v06–v08 iterating on the three Round 1 ideas I liked most, so I could see whether they hold up.)*

---

## Round 1 — Baseline: fix what's broken on the real site (v01–v05)

**Date:** Oct 1, 2026 · **Commit:** `99e2441` "initial 5 versions"

### Starting point

I started from a screenshot of the current [hall.whps.org](https://hall.whps.org) homepage and listed what's wrong with it, keeping in mind who the page is for (current students and families first, prospective families second; see `AGENTS.md`):

- The Hall Warriors logo (top left) is hard to see.
- "Hall High School" is white text over a photo slideshow, so it sometimes disappears behind white backgrounds.
- The top bars are huge (~130px), with big icon-and-label buttons that waste space.
- News is a rotating slideshow buried at the bottom of the hero, with lots of empty space.
- The accessibility option is a tiny icon in the bottom-right corner.
- The page doesn't serve its main audience: daily essentials (schedule, lunch, PowerSchool) aren't up front.

I set two constraints: keep Hall's dark blue, and make accessibility a priority.

### What I deliberately did

Round 1 was intentionally **generic**. Before getting creative, I wanted a baseline of competent, modern answers to the real site's problems, to see what a "normal" good redesign looks like and to have something to push away from. I asked for 5 versions that were as different from each other as possible, each fixing the issues above.

| # | Direction | Main idea |
|---|---|---|
| v01 | Today Dashboard | No hero photo; a live "now / next" bell schedule and one-tap portal tiles lead the page |
| v02 | Editorial Split | Magazine tone for prospective families; split hero so the name never sits on the photo |
| v03 | Ask Hall | A search box replaces the nav and understands everyday words ("sick" → report an absence) |
| v04 | Warrior Varsity | Dark, bold school spirit; schedule and stats styled like a scoreboard |
| v05 | Portal Sidebar | App-like sidebar and bento dashboard with a light/dark theme |

### Shared decisions (apply to every version)

- **Real content.** Logo, photos, events, pride stats, mission and contact details all come from hall.whps.org. Today's schedule and lunch are sample data (fixed to Thu Oct 1).
- **Accessibility kit** (`shared/a11y.js`, `shared/a11y.css`): a large, labelled "Accessibility" button on every page, with text size, high contrast, readable font, line spacing, underlined links, stop motion and translate.
- **"← Gallery" link** moved from top-left to bottom-left so it never covers the logo.

### How I used Claude

- I gave Claude the screenshot, my critique and the constraints; Claude proposed the 5 directions and built them in parallel.
- Claude invented a few details (an "80+ clubs" claim, a Support Services subtitle). I removed them, keeping the content to what the real site says.
- Claude also rebuilt the gallery with live miniature previews.

### Looking back at Round 1

- **These are my 5 "non-unique" versions.** Dashboards, editorial splits and sidebar apps are what most AI-assisted redesigns look like, so they likely resemble other sites in the class. Every version from v06 on has to be distinctive.
- **Two pairs overlap.** v01 and v05 are both "Today" dashboards with a bell timeline, portal tiles and notices, just in different shells. v02 and v04 share the same split hero (name on the left, photo on the right). The difference is mostly skin, not structure.
- **Ideas worth keeping for later:**
  - v01's live "now / next" schedule
  - v03's plain-language search
  - v04's calmer help panel, set apart from the rest of the page
  - the shared accessibility kit
- **Process lesson:** Round 1 came from a single prompt. From here, each round starts with me choosing the directions and ends with my verdict, with one commit per round.

<!-- My own take on each version: -->

---

## Round 2 — Iterate on three favorites (v06–v08)

**Date:** Oct 1, 2026

### What I decided

After looking at Round 1, I picked three ideas to push further instead of going wide right away. One new version per idea:

| Round 1 idea I liked | Iteration | What I asked for |
|---|---|---|
| v01: the page is about **today** (informational) | **v06 Hour by Hour** | Be *more* informational about the current day and time, without pushing the quick links and other info aside. |
| v04: **school spirit** around team sports | **v07 Warrior Season** | Keep tabs on teams and give sports more weight in the schedules, without crowding out other events and info. |
| v03: a **smart search** to find things fast | **v08 Quick Access** | Search shouldn't be the whole page. Make quick-access links the priority and move search into a secondary help menu. |

**New constraint for every version from here on:** a vertical, single-column layout made of stacked full-width bands. No bento grids. v01, v04 and v05 all leaned on card grids, which made them look like generic dashboards.

I also allowed **made-up events** where they make the purpose of a design clear (after-school activities, game scores, team schedules). Each footer says which data is sample data.

### What changed in each version

- **v06 Hour by Hour (from v01).** The "now / next" panel becomes the hero. It shows a live clock, a progress bar for the school day ("X h Y min until dismissal"), minutes left in the current block, the lunch wave, and day counters (day 23 of 180, week 5, days until the next day off). The hero's tint shifts with the time of day. v01's horizontal bell bar becomes **one vertical timeline for the whole day**, from the building opening through classes and after school to the evening, with a "now" line. Below it is a day-by-day look at the rest of the week. *Without imposing:* the portals and quick links sit in a strip directly under the header, so they stay above the fold no matter how much time content there is.
- **v07 Warrior Season (from v04).** It keeps v04's dark varsity identity, with the bento tiles and two-column split removed. New: a recent-scores strip, a "Tonight" game cell in the Today ribbon, and a single **"This week at Hall"** list. Games in that list get a team chip, a home/away badge and a rivalry flag, but they share the list with SAT day, portraits and schedule changes, and an All / Sports / School filter defaults to All. There are also **"Keep tabs on a team"** tabs for each fall sport (record, next game, last result, remaining schedule) and a Crosstown Classic (Hall vs. Conard) countdown band. The calm help panel stays.
- **v08 Quick Access (from v03).** The order is flipped: the hero is now **quick-access links** (portals, bell schedule, lunch, calendar, absence, athletics), followed by link lists for each audience and an **A–Z index** of every page. v03's plain-language search (with synonyms, so "sick" finds "Report an absence") moves into a **"Help · Ask Hall" drawer**. You open it from the header, from a quiet "Can't find it?" line, or with `/` or `?`. The drawer also has common questions and the main office number.

### How I used Claude

- I chose the three directions and the constraints: what each iteration should improve, vertical layout with no bento, sample events allowed. Claude built the three pages in parallel from a brief for each one, reusing the real content from v01, v04 and v03.
- Claude came up with the specific made-up events (after-school clubs, game scores, team records, Spirit Week).

<!-- My verdicts on v06–v08: keep / drop / steal, and why -->

**Verdicts (keep / drop / steal, and why):**

**What I learned:**

---

## Round 3 — Go wide (next)

_Planned: directions only a Hall High page could have, built from objects of school life (departure board, corkboard, yearbook, planner, transit map of the building, etc.)._
