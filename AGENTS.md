# AGENTS.md

## The idea

Redesign the landing page of **Hall High School** (West Hartford, CT), the high school at [hall.whps.org](https://hall.whps.org), across 25 versions. The goal is to move from wide exploration to one final choice.

## Who the page is for

- **Primary: current students and their families.** They visit almost every day and want something specific, fast.
- **Secondary: prospective families**, plus new and incoming students, who are deciding what Hall is like.
- **Not the audience: district staff.** Staff tools (Gmail, Frontline, PowerTeacher, HR forms, …) take up most of the real site's navigation. In these versions they get at most a single "Staff" link in the footer.

## What a visitor should understand or do

1. **Know where they are in under 5 seconds:** Hall High School, West Hartford, CT, home of the Warriors. (The real site's tab title is just "Home - " and it has no main headline.)
2. **Get today's essentials in one tap:** what schedule today is (odd or even Wednesday, or no school), bell schedule, lunch, calendar, and PowerSchool, Schoology and Naviance.
3. **See what's coming up:** the next few events, with repeats merged (not 25 rows with 9 senior-portrait entries).
4. **Feel some pride:** 9 state titles in 10 years, 37 languages spoken at home, 72% AP participation, a US News gold medal.
5. **Know where to go for help:** counseling, support services, and Anonymous Alerts, shown once and calmly.
6. **Contact the school:** 975 North Main Street, West Hartford, CT 06117 · 860-232-4561.

## Problems with the real page to fix

- No identity: the title is "Home - " and there's no main headline.
- About 370 links, with staff and family links mixed together and many duplicates.
- Daily needs are buried in dropdowns.
- The calendar dumps every event.
- There's only one news item.
- The stats are at the bottom and out of date (one dates from 2018–19).
- A 26 MB banner video plays automatically.
- Empty `#` links, and headings that are just numbers.

## Assignment rules (Design, Build, Ship: Assignment 1, due Tue Oct 6, 5:30 PM)

- **Tech:** plain HTML and CSS, with optional JavaScript only. No frameworks, packages, build step, external APIs, or data storage. Push back if asked to add any of these. Deployed on Vercel's Hobby plan from GitHub.
- **Structure:** `index.html` is the gallery. Each version lives in `versions/vNN/` (`index.html` + `style.css`) and has a "← Gallery" link back to the gallery (`shared/back.css`).
- **25 distinct landing pages.** Go wide first: change layout, audience emphasis, mood, era and tone. Changing only colors or fonts doesn't count as a new direction. Converge from about v20 and refine until v25 feels right.
- **Uniqueness:** at least 20 of the versions must look like nothing else in a class of about 700 sites. Avoid generic templates such as hero, three cards and a footer.
- **The gallery tells the story:** every tile links to its version and has a short note on what changed. The gallery explains how the directions were narrowed down and presents the final choice.
- **Iteration shows in git:** commit in small steps (one per version or refinement), never one big dump. A one-shot result is marked incomplete.
- Use real Hall content. Don't invent facts. Placeholder images are fine.
- Visual polish isn't graded. Breadth of exploration, choosing well, and telling the story clearly are what count.

## Working agreement

- The user directs the design decisions. Propose options; don't decide final directions alone.
- Don't commit or push until the user approves. The user supplies commit messages.
- Keep this file short, and update it as directions are chosen or dropped.
