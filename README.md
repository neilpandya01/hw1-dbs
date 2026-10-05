# hw1-dbs — 25 Redesigns of hall.whps.org

25 static redesigns of the [Hall High School](https://hall.whps.org) landing page, plus a gallery linking to each. **v25 is the final page.**

**Audience:** current students and families first, prospective families second.

## Versions

| Group | Versions |
|---|---|
| Initial Five Layouts | v01 Today-first dashboard · v02 Magazine layout · v03 Search-bar focused · v04 Big banner + scoreboard · v05 Sidebar app |
| Three Moods | v06 Calm · v07 Loud & spirited · v08 Warm & welcoming |
| Four Content Priorities | v09 Announcements first · v10 Events first · v11 Athletics first · v12 Student life first |
| Combining | v13 Today + announcements · v14 Today \| announcements · v15 Today + game day · v16 Today feed · v17 Families first · v18 Today band + search · v19 Game week · v20 Today band + game day · v21 Hall stories · v22 not started |
| Converging | v23 Today band, refined · v24 Banner video · v25 Final |

## Design Choices

- Hall navy (#0b2a5b) on every version; light blue (#eef4fb) as the second background.
- Literata + Source Sans 3.
- A compact today band: odd/even day, block-by-block day bar, rotating lunch, quick links (PowerSchool, Schoology, Naviance, calendar). It expands to the full bell schedule, lunch menu and upcoming events.
- Banner with the school's own video, split into clips with clickable dots.
- Game day & events by category, nearest dates first; student life; a one-line-per-notice bulletin of upcoming items only.
- Help (counseling, support, Anonymous Alerts) shown once and calmly.
- Calm copy: plain dates and facts, no urgency labels or countdowns.
- Every student link from the real site in the nav, plus small plain-language search ("sick" → report an absence).
- A Language menu instead of "welcome" in many languages.
- Title Case for titles, links and buttons.
- Accessibility panel on every page: text size, high contrast, readable font, line spacing, underlined links, stop motion, translate.

Schedule, lunch and some notices are sample data.

## Tech

Plain HTML, CSS and vanilla JS. No framework or build step. Deployed on Vercel.

```bash
python3 -m http.server 8000
```
