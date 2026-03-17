# automataRules.com — Design Spec

## Overview

A single-page website for automataRules.com that showcases elementary cellular automata through visual art, an interactive playground, and educational content. The site celebrates the beauty and complexity that emerges from simple rules.

## Tech Stack

- **Framework:** Astro (static output)
- **Styling:** Tailwind CSS
- **Fonts:** Inter (sans), JetBrains Mono (mono)
- **Animation:** Canvas API (ported from tsciano.com portfolio)
- **Deployment:** TBD (likely Netlify, matching portfolio)

## Visual Style: Colorful / Modern

- **Background:** Dark base with subtle gradient (`#0a0a1a` → `#1a0a2a`)
- **Accent:** Gradient accents that echo the automata's HSL rainbow — purples, blues, oranges, reds
- **Text:** White headings, gray-300 body, gradient text for hero title
- **Components:** Rounded corners, glass-morphism cards (`rgba(255,255,255,0.08)` backgrounds, `rgba(255,255,255,0.15)` borders)
- **Buttons:** Gradient fills for primary CTAs, ghost/outline for secondary
- **Typography:** Inter for body, JetBrains Mono for rule numbers, binary, and code-like elements

## Page Structure

### Section 1: Hero (full viewport)

Full-viewport canvas running the cellular automata animation as a background. Ported from the portfolio's `AutomataBackground.astro` implementation.

**Overlay content (centered):**
- Site title "automataRules" in large bold text with HSL gradient matching the automata colors
- Subtitle: "Explore the beauty of elementary cellular automata"
- Current rule label in corner showing rule number + binary representation (e.g., "Rule 30 / 00011110")
- Subtle scroll-down indicator at bottom

**Animation behavior:**
- 1px = 1 cell, HSL coloring (`hue = currentY * 0.3 + x * 0.05, saturation 60%, lightness 35%`)
- Cycles through 20 interesting rules: [30, 110, 90, 184, 45, 73, 105, 150, 169, 225, 54, 60, 62, 126, 135, 137, 193, 22, 18, 146]
- 8-second fade transition between rules
- Different initial conditions per rule type (single center cell, random, mixed)
- Performance: fewer rows/frame on mobile, requestAnimationFrame loop

### Section 2: Rule Gallery

A grid of rule previews with small pre-rendered canvas thumbnails.

**Layout:**
- "Famous" rules highlighted at top with larger cards: Rule 30 (chaos), Rule 110 (Turing complete), Rule 90 (Sierpinski triangle), Rule 184 (traffic flow)
- Grid of remaining interesting rules below
- Optionally expandable to show all 256 rules

**Each card shows:**
- Canvas thumbnail of the rule's pattern
- Rule number
- Binary representation
- Brief descriptor (e.g., "Chaotic", "Class IV", "Sierpinski")

**Interaction:**
- Click a card → smooth scroll to Playground section with that rule pre-loaded

### Section 3: Playground

The main interactive section. A large canvas (70-80% viewport width) with a control panel.

**Canvas:**
- Real-time animation, rows cascade downward
- When canvas fills: pause and wait for user reset

**Controls:**
- **Rule picker:** Number input (0-255) + 8 binary toggle switches showing the 3-cell → output mapping visually
- **Speed slider:** Rows per frame (1-10)
- **Color controls:** HSL saturation/lightness sliders, preset palettes (rainbow, fire, ice, monochrome)
- **Initial conditions:** Presets (single center cell, random 50%, random sparse) + draw mode (click cells in top row to set starting state)
- **Cell size:** Slider (1px, 2px, 4px per cell)
- **Transport:** Play / Pause / Reset buttons

### Section 4: Learn

Educational section explaining how elementary cellular automata work.

**Content blocks:**

1. **How it works** — The 3-cell neighborhood concept: each cell looks at itself and its two neighbors. The rule number (0-255) encodes all 8 possible input → output mappings. Interactive or static diagram showing the 8 patterns (111, 110, 101, ... 000) mapped to outputs.

2. **Wolfram's 4 classes:**
   - Class I: Uniform (all cells converge to same state)
   - Class II: Periodic (stable, repeating structures)
   - Class III: Chaotic (pseudo-random, aperiodic)
   - Class IV: Complex (edge of chaos — localized structures, long transients)
   - Each class illustrated with example rules from the gallery

3. **Why it matters:**
   - Rule 110 is Turing complete (can compute anything a computer can)
   - Rule 30 was used for random number generation in Mathematica
   - Emergence of complexity from simple rules — philosophical implications
   - Brief mention of Wolfram's "A New Kind of Science"

4. **Further reading:**
   - Stanford Encyclopedia of Philosophy: Cellular Automata
   - Wolfram MathWorld: Elementary Cellular Automaton
   - Wolfram's "A New Kind of Science" (NKS Online)

**Footer:**
- "Built by Tom Sciano" linking to tsciano.com

## Key Technical Decisions

- **Single page:** All content on `index.astro`. No routing needed — the content volume doesn't justify multi-page complexity.
- **Separate canvases:** Hero gets its own background canvas; Gallery thumbnails are pre-rendered small canvases; Playground gets a dedicated interactive canvas. No shared canvas state.
- **Automata engine:** Port the core `applyRule` / `initRow` / paint loop from the portfolio. Extract into a shared utility module so Hero, Gallery thumbnails, and Playground can all use it.
- **Astro islands:** Playground controls will likely need a reactive island (Astro `client:visible` with vanilla JS or a lightweight framework). Gallery and Learn can be static Astro components.
- **Performance:** Canvas pause when off-screen via IntersectionObserver. Mobile: reduce rows/frame. Gallery thumbnails rendered once, not animated.
- **Responsive:** Full-width on mobile, controls stack vertically under the playground canvas. Gallery grid collapses to 2 columns on mobile, 1 on very small screens.
