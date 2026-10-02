# Design Process

A running log of how the 25 versions came together: what I asked for, what I decided, what I dropped and why. Newest round at the bottom.

**The plan:** go wide (v01–v14), then narrow by combining what works (v15–v20), then converge one refinement at a time until v25 is the final choice.

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

| # | Layout (gallery caption) | Theme | Main idea |
|---|---|---|---|
| v01 | Today-first dashboard | Today Dashboard | No hero photo; a live "now / next" bell schedule and one-tap portal tiles lead the page |
| v02 | Magazine layout | Editorial Split | Magazine tone for prospective families; split hero so the name never sits on the photo |
| v03 | Search-bar focused | Ask Hall | A search box replaces the nav and understands everyday words ("sick" → report an absence) |
| v04 | Big banner + scoreboard | Warrior Varsity | Dark, bold school spirit; schedule and stats styled like a scoreboard |
| v05 | Sidebar app | Portal Sidebar | App-like sidebar and bento dashboard with a light/dark theme |

In the gallery these five are grouped under **"Five layouts"**, with a note that the first five vary the layout, and each caption names the layout rather than the theme. Looking back, what really separates them is how the page is arranged: a day-by-day dashboard, a magazine spread, a search bar, a big banner, a sidebar app.

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

## Round 2 — Vary the mood (v06–v08)

**Date:** Oct 1, 2026

### What I decided

Round 1 varied only the **layout**. For Round 2 I asked what else could change, and I chose **mood**: three versions (v06–v08) with the same content made calm, loud and warm.

The rule I gave: a mood has to show up in the **words, structure, imagery and interactions**, not just colors and fonts. The page also has to stay usable, so today's essentials must be findable in under 5 seconds.

| # | Variable | Concept | How it shows up beyond the look |
|---|---|---|---|
| v06 | Mood: Calm | Quiet Hall | Relaxing to look at: soft navy and mist palette, lots of space, one idea at a time, gentle type; the copy stays plain and informative |
| v07 | Mood: Loud & spirited | Pep Rally | Solid loud color blocks, chant-style headlines, a scrolling sports-score ticker, a cheer meter, a game countdown; the help section deliberately drops the volume |
| v08 | Mood: Warm & welcoming | Welcome Mat | "Welcome" in many of the 37 home languages, notes written by people, events framed as invitations |

The gallery groups them as **Three moods**, and captions name the mood.

### How I used Claude

- I chose to vary mood. Claude suggested the specific moods and wrote a brief for each one, then built the three pages in parallel from a shared brief (same content, same accessibility rules).
- Claude invented sample content to sell each concept (Spirit Week, shout-outs, welcome notes). Each footer marks it as sample data.

### My feedback and revisions

After the first build I pushed back on these points:

- **Every version needs Hall's dark navy.** The moods had drifted to bright royal blue, a desaturated slate, and cream and terracotta. I asked for the navy theme from v01–v05 on all three, adapted to each mood.
- **v06 was too calm, in the wrong way.** The page told students to relax ("Nothing urgent right now", "You did enough today", a breathing exercise). A school site shouldn't tell students to chill about what's coming up. Calm belongs in the *look*: a relaxing palette, space and type. The copy should stay clear and informative, with real deadlines shown plainly.
- **v07:** I didn't like the condensed poster font or the halftone dot background. I asked for a different font and solid, loud color blocks, and kept the scrolling sports-score ticker, which I liked.
- **v08:** the hand-drawn "tap a hello" arrow sat below the language chips instead of pointing at them. It now points at them.

**Verdicts (keep / drop / steal, and why):**

**What I learned:**

---

## Round 3 — Combine (v09–)

_Next: take a little of each of v01–v08 and combine them into updated versions._
