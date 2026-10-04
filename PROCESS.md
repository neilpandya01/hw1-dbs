# Design Process

A running log of how the 25 versions came together: what I asked for, what I decided, what I dropped and why. Newest round at the bottom.

**The plan:** go wide (v01–v12), explore by combining what works (v13–v19), then converge one refinement at a time until v25 is the final choice (v20–v25).

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

## Round 3 — Vary the content priority (v09–v12)

**Date:** Oct 1, 2026

### What I decided

I first tried a round on **navigation** (horizontal tabs, a vertical "transit line", navigating by time) and threw it out before committing. Changing how you move between sections didn't change what visitors actually see first. A more useful question is **which content leads the page**.

So Round 3 varies **content priority**. Each version commits fully to one kind of content: it takes the first screen, gets the most space and the richest treatment, and the rest of the page follows in order of what that audience needs next. I listed the options (news, events, academics, athletics, student life, announcements, quick links) and picked four:

| # | Variable | Concept | Who it serves best |
|---|---|---|---|
| v09 | Announcements first | The Bulletin | Families and students who need to know what changed or what to do (early dismissal, PSAT, forms, deadlines) |
| v10 | Events first | On the Calendar | Families planning the week and month |
| v11 | Athletics first | Game Day | Students and families who follow Warriors sports |
| v12 | Student life first | Find Your People | Students looking for something to join, and new families asking what Hall is like |

Left out for now: **news** (too close to announcements, since Hall's real news is mostly notices), **quick links** (v01 and v04's Today ribbon already lead with them), and **academics** (mostly static program pages with little that changes from day to day).

The idea came from **v04**, which worked best for people who keep up with sports because it put their content up front. Today's essentials stay one tap away near the top on every version, even when they aren't the priority.

The gallery groups them as **Four content priorities**.

### How I used Claude

- I chose content priority. Claude picked the four priorities to try, wrote one shared brief, and built the four pages in parallel.

### My feedback and revisions

- The first build gave all four v04's look. I want more different ideas overall, so each one now has its own style that fits its content: a **service-alert page** (v09), a **Swiss-grid wall calendar** (v10), a **retro game-day program** (v11) and a **playful sticker-and-bento** look (v12). Hall navy stays the theme color on all four.

**Verdicts (keep / drop / steal, and why):**

**What I learned:**

---

## Round 4 — Combine (v13–v19)

**Date:** Oct 2, 2026

### What I decided

I split the remaining versions into two groups. **Combining** (v13–v19) explores by putting together the ideas from v01–v12 that worked. **Converging** (v20–v25) narrows those combinations down to one final page. The gallery now has both groups.

| # | Combines | Main idea |
|---|---|---|
| v13 | v01 + v09 | v01's today information, compressed into one band, then v09's announcements first, in a calmer tone |
| v14 | v13 + v02 | v13's content, rebalanced so today's schedule and announcements share the first screen equally, in v02's editorial style |
| v15 | v14 + v04 | v14's today info at the top left beside a smaller v04 banner, then v04's game day & events (by category, next dates first) and bulletin |
| v16 | v15, refined | Dropdown nav on hover; banner left and today right; today's events plus the next two days in the today column; the two nearest dates per category |
| v17 | v08 + v16 | Audiences switched: prospective families first, v08's warmth in v16's type, a language menu and browser-language offer instead of welcome words |
| v18 | v16 + v13 + v03 + v17 | v16 with v13's expanding today band under the nav, the banner laid out horizontally, v03's search kept small in the nav, and v17's language menu |
| v19 | v18, refined | The name stands alone (no place or mascot lines), lunch cycles through the whole menu, and the search hint fits its box |

**v13.** I like the today-centered information in v01, but its panel takes up too much space and dominates the page. v13 keeps the same facts (date, odd/even day, hours, a now/next line with a thin day bar, lunch, portals) in a single band, with the full bell schedule and lunch waves one tap away. After that, announcements lead, as in v09. v09 felt urgent ("Active alert", "Action needed", "What to do", "Dates to act on", countdowns), so v13 calms the tone. The calm comes from the copy and structure, not the color: each announcement states its date and the facts, with neutral categories and no urgency labels or instructions.

**v14.** v02 is the best-looking design so far: serif headlines, warm paper, gold hairlines and Hall navy. v13 had become too centered on announcements, so v14 balances the two priorities. The first screen is split into two equal columns, built as mirror images: **Today at Hall** (date, odd/even day, hours, a now/next line, the full bell schedule with the current block highlighted, lunch, portals) and **Announcements** (a lead announcement with the same size headline, then short briefs). v02's split hero (mission and library photo) moves down to a "New to Hall?" section for prospective families. The tone stays calm, as in v13.

**v15.** I liked v04's calendar: it puts game day first and keeps events sorted into sports, arts, testing and schedule changes, with a bulletin beside it. v04's big banner took up too much of the first screen, though. v15 keeps v14's editorial style and puts today's info (date, odd/even day, now/next, bell schedule, lunch, portals) at the top left, right below the nav. A smaller version of v04's banner (logo, name, mission, photo) sits beside it. Below them, **Game day & events** shows the next two dates in each category, with home football in the one navy group, and a button opens the rest of October in the same categories. The **Bulletin** sits next to it. v02's "New to Hall?" steps replace v14's split section, since the banner now carries the mission and photo.

**v16.** v16 refines v15. The main nav gets dropdown menus that open on hover or keyboard focus. The banner and today's info switch sides, so the banner is on the left and Today is on the right. Lunch becomes a vertical list. The Today column now has an **Events** list: what's happening today, then the next two days. Below, each category in Game day & events shows only its two nearest future dates, with no counts and no "show the full month" button; the "Full calendar" link covers the rest. Senior portraits move from their own group into the bulletin.

**v17.** Every version so far put current students first. v17 tries the opposite, with prospective and incoming families as the primary audience. It keeps v08's warmth (warm paper, terracotta, copy written to "you") but drops the "welcome" words in many languages, which took the top of the page without telling families anything. It also drops v08's fonts and uses v14–v16's Fraunces and Source Sans 3. Translation becomes a **Language** menu in the utility bar, labelled in several scripts, plus a one-line offer that appears only when the browser's language is Spanish, Mandarin, Portuguese, Vietnamese or Arabic. The page answers a family's questions in order: what Hall is (hero with *Plan a visit* and *Enrolling? Start here*), what a day looks like (an even-day timeline), academics, student life (with home games and shows open to families), belonging and support (37 languages, English learner support, counseling), and how to join (three steps and an FAQ). Current students keep a one-line strip under the nav with the day type, bell schedule, lunch and portals, and a short bulletin near the end.

**v18.** v18 goes back to v16 and current students first, and brings in a few ideas from other versions. v13's today band sits right under the nav: the date, odd/even day, a now/next line with the thin day bar, today's lunch and the portals, in one line. *Bell schedule, lunch & events* expands it to the full bell schedule (current block highlighted), the lunch list and v16's today-and-next-two-days events, which replaces v16's Today column. With that column gone, v16's banner (photo, logo, name, mission and the *Game day & events* and *New to Hall?* links) runs horizontally across the page, so the photo shows in its own shape instead of being cropped. v03's plain-language search comes back, but small: a box at the right of the nav (an icon on narrower screens) that understands everyday words ("sick" → report an absence, "bus", "lunch") and can jump to sections of this page. It's there when you can't find something, not the focus of the page. v17's Language menu and browser-language offer replace the plain Translate link. Everything below the banner is v16.

**v19.** v19 refines v18. "West Hartford, CT" and "Home of the Warriors" come out of the nav, the banner and the footer, so "Hall High School" stands on its own; the footer keeps the street address. In the today band, lunch used to show only the first item. It now cycles through the whole menu every few seconds, with small dots to pick an item (which stops the cycle). It pauses on hover or keyboard focus, and doesn't move on its own with reduced motion or the accessibility kit's "Stop motion". On tablets and phones lunch now stays in the band instead of disappearing. The search hint is shorter ("Search: lunch, bus, absent", no trailing ellipsis), and the box has a fixed width that fits it. Below about 1150px wide, where the box and the nav no longer fit side by side, search folds into the icon.

### How I used Claude

- I chose the v01 + v09 combination and the calmer tone. Claude built v13 and regrouped the gallery.
- I chose v02's design and an even balance between today and announcements for v14. Claude built it.
- For v15 I chose v04's category calendar and bulletin, with the nearest dates first and the full month behind a button, today's info at the top left and a smaller v04 banner. Claude built it.
- For v16 I asked for a dropdown nav, a vertical lunch list, today's events in the today column, two dates per category without counts or a month toggle, senior portraits in the bulletin, and the banner and today swapped. Claude built it.
- For v17 I asked to switch the primary and secondary audiences, keep v08's warmth without its welcome words or fonts, and find a better place for Translate. Claude proposed the structure and the language menu; I chose the editorial fonts. Claude built it.
- For v18 I asked to build on v16 with ideas from v17: v03's search kept small in the nav, v13's expanding today band under the nav, and v16's banner laid out horizontally so the photo fits, with everything below unchanged. Claude built it and brought in v17's language menu.
- For v19 I asked to remove "West Hartford, CT" and "Home of the Warriors" from the nav, banner and footer (keeping the address), to cycle lunch so every item can be seen, and to make the search hint fit its box. Claude built it.

**Verdicts (keep / drop / steal, and why):**

**What I learned:**

---

## Round 5 — Converge (v20–v25)

**Date:** Oct 4, 2026

### What I decided

From here each version refines the one before, one round of adjustments at a time, until v25 is the final page. v19 is the starting point.

| # | Builds on | Refinement |
|---|---|---|
| v20 | v19 | The today band, remade: a wider, taller day bar captioned "Block" with every label readable, lunch names only, portals 2 × 2 |
| v21 | v20 | hall.whps.org's banner video replaces the photo, with a clip bar modeled on the day bar |

**v20.** v20 only changes the today band under the nav. Lunch was taking extra room for food tags, so the rotating lunch now shows names only, on one line, ending in "…" if a name is ever too long. Tags like *Vegetarian* stay in the expanded menu. The day bar was hard to read and cut Advisory down to "A…", so it gets more of the band. The *Bell schedule, lunch & events* toggle moves under the date and the four portals sit 2 × 2, which frees width for the bar (about 425px at desktop, up from about 365px). The bar is also taller, with larger labels. Every segment is wide enough for its label, so "Adv" always shows, and a "Block" caption beside the numbers says what they are. Lunch's dots move up next to its label to keep the band short. On tablets lunch and the portals share a second row; on phones everything stacks.

**v21.** The real homepage opens with a 73-second looping video, and v21 puts it in the banner where the photo was. Claude found it was a direct MP4 on Finalsite's CDN (26 MB at 1080p; the smaller versions weren't available), so the repo keeps a 720p copy re-encoded to 7.3 MB, plus a poster frame. The video is 22 short clips of different students and places, from a science lab and the library to orchestra, the cafeteria, ceramics and the gym. Claude found the cuts with ffmpeg's scene detection. Over the video's bottom edge, a clip bar works like the day bar: one segment per clip, sized to its length, filling as it plays. Beside it are a pause button and the clip's name and number ("Orchestra · 9 of 22"). Clicking a segment, or using the arrow keys, jumps to that clip. The video doesn't start on its own with reduced motion, the kit's "Stop motion", Data Saver, or in the gallery's previews; it then shows the poster and a play button. Without JS it has the browser's own controls.

### How I used Claude

- For v20 I asked to drop the food tags from the rotating lunch (keeping them in the expanded menu), add "…" for long names, make sure "Adv" shows, widen the day bar so it's easier to read, label the numbers as blocks, and rebalance the band around all of that. Claude chose the layout (the toggle under the date, the portals 2 × 2) and built it.
- For v21 I asked whether the real site's video could be used, had Claude check first, then asked to put it in the banner with a progress bar like the day bar, noting the different clips. Claude found the cuts, chose the 720p copy and named each clip, and built it.

**Verdicts (keep / drop / steal, and why):**

**What I learned:**
