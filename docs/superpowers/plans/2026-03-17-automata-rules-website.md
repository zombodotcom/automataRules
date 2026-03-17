# automataRules.com Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page website for automataRules.com showcasing elementary cellular automata with a hero animation, rule gallery, interactive playground, and educational content.

**Architecture:** Astro static site with Tailwind CSS via PostCSS. A shared automata engine module handles all CA computation. Each section (hero, gallery, playground) gets its own canvas instance with IntersectionObserver-based pause/resume. Playground uses vanilla JS scripts for interactivity.

**Tech Stack:** Astro 5, Tailwind CSS 3.4 (via PostCSS), TypeScript, Canvas API, Inter + JetBrains Mono fonts

**Spec:** `docs/superpowers/specs/2026-03-17-automata-rules-website-design.md`

**Deferred to v2:** "Show all 256 rules" expansion toggle in Gallery.

---

## File Structure

```
automataRules/
├── astro.config.mjs           # Astro config (static output)
├── tailwind.config.mjs        # Tailwind with custom colors/fonts
├── postcss.config.mjs         # PostCSS config for Tailwind
├── tsconfig.json              # TypeScript strict config
├── package.json               # Dependencies
├── src/
│   ├── layouts/
│   │   └── Layout.astro       # Base HTML layout (head, fonts, body)
│   ├── styles/
│   │   └── global.css         # Tailwind directives + base styles
│   ├── lib/
│   │   └── automata-engine.ts # Shared CA engine (applyRule, initRow, renderRow)
│   ├── components/
│   │   ├── Hero.astro         # Full-viewport hero with canvas + overlay
│   │   ├── hero-canvas.ts     # Hero canvas animation loop
│   │   ├── Gallery.astro      # Rule gallery grid with thumbnail canvases
│   │   ├── gallery-thumbnails.ts  # Renders static thumbnails on mount
│   │   ├── Playground.astro   # Interactive playground section
│   │   ├── playground-app.ts  # Playground canvas + controls logic
│   │   ├── Learn.astro        # Educational content section
│   │   └── Footer.astro       # Footer with credits
│   └── pages/
│       └── index.astro        # Single page assembling all sections
└── public/
    └── favicon.ico            # Favicon (placeholder)
```

---

## Chunk 1: Project Setup + Automata Engine

### Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`
- Create: `src/pages/index.astro`
- Create: `.gitignore`

- [ ] **Step 1: Initialize the project and install dependencies**

```bash
cd C:\Users\zombo\Desktop\Programming\automataRules
npm init -y
npm install astro@latest tailwindcss@3 postcss autoprefixer @fontsource/inter@5 @fontsource-variable/jetbrains-mono@5
```

- [ ] **Step 2: Add scripts to package.json**

Add to the `"scripts"` section:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://automataRules.com',
  output: 'static',
});
```

- [ ] **Step 4: Create `postcss.config.mjs`**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Create `tailwind.config.mjs`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a1a',
          alt: '#0f0f2a',
          card: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 7: Create `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    color-scheme: dark;
  }

  body {
    @apply bg-surface text-gray-300 font-sans antialiased;
    background: linear-gradient(135deg, #0a0a1a, #1a0a2a);
    min-height: 100vh;
  }

  ::selection {
    @apply bg-purple-500/30 text-white;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    html { scroll-behavior: auto; }
  }
}
```

- [ ] **Step 8: Create `src/layouts/Layout.astro`**

```astro
---
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
import '@fontsource-variable/jetbrains-mono';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Explore the beauty of elementary cellular automata' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  </head>
  <body class="min-h-screen">
    <slot />
  </body>
</html>
```

- [ ] **Step 9: Create minimal `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="automataRules — Elementary Cellular Automata">
  <main>
    <p class="text-white text-center pt-20">automataRules.com</p>
  </main>
</Layout>
```

- [ ] **Step 10: Create `.gitignore`**

```
node_modules
dist
.astro
.superpowers
```

- [ ] **Step 11: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts, page loads with "automataRules.com" text on dark gradient background with correct fonts.

- [ ] **Step 12: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Astro project with Tailwind and fonts"
```

---

### Task 2: Automata Engine Module

**Files:**
- Create: `src/lib/automata-engine.ts`

This is the shared computation module used by Hero, Gallery, and Playground.

- [ ] **Step 1: Create `src/lib/automata-engine.ts`**

```typescript
/**
 * Shared elementary cellular automata engine.
 * Handles rule application, row initialization, and row rendering.
 */

export const INTERESTING_RULES = [
  30, 110, 90, 184, 45, 73, 105, 150,
  169, 225, 54, 60, 62, 126, 135, 137,
  193, 22, 18, 146,
] as const;

export const FAMOUS_RULES: Record<number, { name: string; description: string; class: string }> = {
  30:  { name: 'Rule 30',  description: 'Aperiodic, chaotic behavior from a single cell', class: 'III' },
  110: { name: 'Rule 110', description: 'Turing complete — can compute anything', class: 'IV' },
  90:  { name: 'Rule 90',  description: 'Produces the Sierpinski triangle', class: 'II' },
  184: { name: 'Rule 184', description: 'Models traffic flow and particle dynamics', class: 'II' },
};

export const RULE_CLASSES: Record<string, { label: string; description: string; examples: number[] }> = {
  I:   { label: 'Class I — Uniform', description: 'All cells converge to the same state', examples: [0, 255] },
  II:  { label: 'Class II — Periodic', description: 'Stable, repeating structures', examples: [90, 184, 62] },
  III: { label: 'Class III — Chaotic', description: 'Pseudo-random, aperiodic patterns', examples: [30, 45, 73, 22, 18] },
  IV:  { label: 'Class IV — Complex', description: 'Edge of chaos — localized structures, long transients', examples: [110, 54, 169] },
};

/** Apply an elementary CA rule to a 3-cell neighborhood. */
export function applyRule(rule: number, left: number, center: number, right: number): number {
  const idx = (left << 2) | (center << 1) | right;
  return (rule >> idx) & 1;
}

/** Compute the next row from the current row using the given rule. */
export function nextRow(rule: number, current: Uint8Array): Uint8Array {
  const W = current.length;
  const next = new Uint8Array(W);
  for (let x = 0; x < W; x++) {
    next[x] = applyRule(rule, current[(x - 1 + W) % W], current[x], current[(x + 1) % W]);
  }
  return next;
}

/** Initialize a row with appropriate initial conditions for the given rule. */
export function initRow(rule: number, width: number): Uint8Array {
  const row = new Uint8Array(width);
  if (rule === 30 || rule === 110 || rule === 90) {
    row[width >> 1] = 1;
  } else if (rule === 184 || rule === 45) {
    for (let i = 0; i < width; i++) row[i] = Math.random() < 0.5 ? 1 : 0;
  } else {
    row[width >> 1] = 1;
    for (let i = 0; i < width; i++) if (Math.random() < 0.02) row[i] = 1;
  }
  return row;
}

/** Get the HSL color for a live cell at a given position. */
export function cellColor(x: number, y: number, saturation = 60, lightness = 35): string {
  const hue = (y * 0.3 + x * 0.05) % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/** Render a single row of cells onto a canvas context. */
export function renderRow(
  ctx: CanvasRenderingContext2D,
  row: Uint8Array,
  y: number,
  saturation = 60,
  lightness = 35,
): void {
  for (let x = 0; x < row.length; x++) {
    if (row[x]) {
      ctx.fillStyle = cellColor(x, y, saturation, lightness);
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

/**
 * Render a complete static thumbnail of a rule into a canvas.
 * Useful for gallery previews.
 */
export function renderThumbnail(
  canvas: HTMLCanvasElement,
  rule: number,
  width: number,
  height: number,
): void {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  let row = initRow(rule, width);
  for (let y = 0; y < height; y++) {
    renderRow(ctx, row, y, 70, 55);
    row = nextRow(rule, row);
  }
}

/** Convert a rule number to its 8-bit binary string. */
export function ruleToBinary(rule: number): string {
  return rule.toString(2).padStart(8, '0');
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx astro check
```

Expected: No errors related to automata-engine.ts.

- [ ] **Step 3: Commit**

```bash
git add src/lib/automata-engine.ts
git commit -m "feat: add shared automata engine module"
```

---

## Chunk 2: Hero Section

### Task 3: Hero Component + Canvas Animation

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/hero-canvas.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/hero-canvas.ts`**

```typescript
/**
 * Hero background canvas animation.
 * Cycles through interesting rules with fade transitions.
 * Pauses when off-screen via IntersectionObserver.
 */

import { INTERESTING_RULES, initRow, nextRow, renderRow, ruleToBinary } from '../lib/automata-engine';

export function initHeroCanvas(
  canvas: HTMLCanvasElement,
  ruleNumber: HTMLElement,
  ruleBinary: HTMLElement,
) {
  const ctx = canvas.getContext('2d', { alpha: false })!;

  let W = 0;
  let row: Uint8Array;
  let currentY = 0;
  let ruleIdx = 0;
  let rule = INTERESTING_RULES[0];
  let animId = 0;
  let active = true;
  let visible = true;
  let fading = false;
  let fadeOpacity = 1;

  function updateLabel() {
    ruleNumber.textContent = `Rule ${rule}`;
    ruleBinary.textContent = ruleToBinary(rule);
  }

  function setup() {
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    W = cssW;
    canvas.width = W;
    canvas.height = cssH;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    currentY = 0;
    ruleIdx = 0;
    rule = INTERESTING_RULES[0];
    row = initRow(rule, W);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '1';
    fading = false;
    fadeOpacity = 1;
    updateLabel();
  }

  function shouldRun() {
    return active && visible;
  }

  function startLoop() {
    if (shouldRun()) {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(paint);
    }
  }

  function paint() {
    if (!shouldRun()) return;

    if (fading) {
      if (fadeOpacity === 1) {
        fadeOpacity = 0;
        canvas.style.transition = 'opacity 8s ease';
        canvas.style.opacity = '0';
        setTimeout(() => {
          if (!active) return;
          ruleIdx = (ruleIdx + 1) % INTERESTING_RULES.length;
          rule = INTERESTING_RULES[ruleIdx];
          currentY = 0;
          row = initRow(rule, W);
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          canvas.style.transition = 'none';
          canvas.style.opacity = '1';
          fadeOpacity = 1;
          fading = false;
          updateLabel();
        }, 8500);
      }
      animId = requestAnimationFrame(paint);
      return;
    }

    const steps = window.innerWidth < 768 ? 1 : 3;
    for (let step = 0; step < steps; step++) {
      if (currentY >= canvas.height) {
        fading = true;
        animId = requestAnimationFrame(paint);
        return;
      }

      renderRow(ctx, row, currentY);
      row = nextRow(rule, row);
      currentY++;
    }

    animId = requestAnimationFrame(paint);
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      active = false;
      cancelAnimationFrame(animId);
    } else {
      active = true;
      startLoop();
    }
  });

  // Pause when scrolled off-screen
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        startLoop();
      } else {
        cancelAnimationFrame(animId);
      }
    },
    { threshold: 0 },
  );
  observer.observe(canvas.parentElement!);

  // Resize
  let lastWidth = window.innerWidth;
  let resizeTimer: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        setup();
        startLoop();
      }
    }, 300);
  });

  // Start
  setup();
  animId = requestAnimationFrame(paint);
}
```

- [ ] **Step 2: Create `src/components/Hero.astro`**

```astro
---
---

<section id="hero" class="relative w-full h-screen overflow-hidden">
  <canvas id="hero-canvas" class="absolute inset-0 w-full h-full" style="image-rendering: pixelated;"></canvas>

  <!-- Gradient overlay for text readability -->
  <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-surface pointer-events-none"></div>

  <!-- Rule label (top-left) -->
  <div class="absolute top-6 left-6 z-10 font-mono">
    <div class="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
      <div class="text-[9px] text-purple-400/70 uppercase tracking-wider leading-none mb-1">Elementary Cellular Automaton</div>
      <div class="text-white text-lg font-bold leading-none" id="hero-rule-number">Rule 30</div>
      <div class="text-[8px] text-gray-500 mt-1 font-mono" id="hero-rule-binary">00011110</div>
    </div>
  </div>

  <!-- Centered content -->
  <div class="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
    <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-center">
      <span class="bg-gradient-to-r from-amber-400 via-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        automataRules
      </span>
    </h1>
    <p class="mt-4 text-lg md:text-xl text-gray-300/80 text-center max-w-lg">
      Explore the beauty of elementary cellular automata
    </p>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
    <svg class="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7"></path>
    </svg>
  </div>
</section>

<script>
  import { initHeroCanvas } from './hero-canvas';

  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  const ruleNumber = document.getElementById('hero-rule-number') as HTMLElement;
  const ruleBinary = document.getElementById('hero-rule-binary') as HTMLElement;

  if (canvas && ruleNumber && ruleBinary) {
    initHeroCanvas(canvas, ruleNumber, ruleBinary);
  }
</script>
```

- [ ] **Step 3: Update `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
---

<Layout title="automataRules — Elementary Cellular Automata">
  <main>
    <Hero />
  </main>
</Layout>
```

- [ ] **Step 4: Verify hero renders**

```bash
npm run dev
```

Expected: Full-viewport canvas with automata animation, gradient title text, rule label, scroll indicator. Animation pauses when scrolled away.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/components/hero-canvas.ts src/pages/index.astro
git commit -m "feat: add hero section with automata canvas background"
```

---

## Chunk 3: Rule Gallery

### Task 4: Gallery Component with Thumbnails

**Files:**
- Create: `src/components/Gallery.astro`
- Create: `src/components/gallery-thumbnails.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/gallery-thumbnails.ts`**

```typescript
/**
 * Renders static thumbnails for the rule gallery on page load.
 */

import { renderThumbnail } from '../lib/automata-engine';

export function initGalleryThumbnails() {
  const canvases = document.querySelectorAll<HTMLCanvasElement>('[data-rule-thumbnail]');
  canvases.forEach((canvas) => {
    const rule = parseInt(canvas.dataset.ruleThumbnail!, 10);
    const width = parseInt(canvas.dataset.thumbWidth || '120', 10);
    const height = parseInt(canvas.dataset.thumbHeight || '80', 10);
    renderThumbnail(canvas, rule, width, height);
  });
}
```

- [ ] **Step 2: Create `src/components/Gallery.astro`**

```astro
---
import { INTERESTING_RULES, FAMOUS_RULES, ruleToBinary } from '../lib/automata-engine';

const famousRuleNumbers = Object.keys(FAMOUS_RULES).map(Number);
const otherRules = INTERESTING_RULES.filter((r) => !famousRuleNumbers.includes(r));
---

<section id="gallery" class="relative py-24 px-6 max-w-7xl mx-auto">
  <h2 class="text-3xl md:text-4xl font-black text-white text-center mb-3">
    Rule Gallery
  </h2>
  <p class="text-gray-400 text-center mb-12 max-w-xl mx-auto">
    Each rule number (0–255) produces a unique pattern from the same simple process. Click any rule to try it in the playground.
  </p>

  <!-- Famous rules (large cards) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {famousRuleNumbers.map((rule) => {
      const info = FAMOUS_RULES[rule];
      return (
        <button data-load-rule={rule}
          class="group text-left bg-white/[0.05] border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
          <canvas
            data-rule-thumbnail={rule}
            data-thumb-width="300"
            data-thumb-height="150"
            class="w-full h-[150px]"
            style="image-rendering: pixelated;"
          ></canvas>
          <div class="p-4">
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-white font-bold font-mono text-lg">{info.name}</span>
              <span class="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">Class {info.class}</span>
            </div>
            <p class="text-gray-400 text-sm">{info.description}</p>
            <div class="text-[10px] font-mono text-gray-600 mt-2">{ruleToBinary(rule)}</div>
          </div>
        </button>
      );
    })}
  </div>

  <!-- Other interesting rules (smaller grid) -->
  <h3 class="text-lg font-bold text-white mb-4">More Interesting Rules</h3>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {otherRules.map((rule) => (
      <button data-load-rule={rule}
        class="group text-left bg-white/[0.05] border border-white/10 rounded-lg overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
        <canvas
          data-rule-thumbnail={rule}
          data-thumb-width="120"
          data-thumb-height="80"
          class="w-full h-[80px]"
          style="image-rendering: pixelated;"
        ></canvas>
        <div class="p-2">
          <span class="text-white font-bold font-mono text-sm">Rule {rule}</span>
          <div class="text-[9px] font-mono text-gray-600">{ruleToBinary(rule)}</div>
        </div>
      </button>
    ))}
  </div>
</section>

<script>
  import { initGalleryThumbnails } from './gallery-thumbnails';
  initGalleryThumbnails();
</script>
```

Note: Gallery cards are `<button>` elements (not `<a>`) to avoid href scroll conflicts. The playground handles `[data-load-rule]` clicks via event delegation on `document`.

- [ ] **Step 3: Add Gallery to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Gallery from '../components/Gallery.astro';
---

<Layout title="automataRules — Elementary Cellular Automata">
  <main>
    <Hero />
    <Gallery />
  </main>
</Layout>
```

- [ ] **Step 4: Verify gallery renders**

```bash
npm run dev
```

Expected: Below the hero, a gallery of rule cards with rendered canvas thumbnails. Famous rules at top with larger cards, smaller grid below.

- [ ] **Step 5: Commit**

```bash
git add src/components/Gallery.astro src/components/gallery-thumbnails.ts src/pages/index.astro
git commit -m "feat: add rule gallery with canvas thumbnails"
```

---

## Chunk 4: Playground — Canvas + Core Controls

### Task 5: Playground Canvas and Core Controls

**Files:**
- Create: `src/components/Playground.astro`
- Create: `src/components/playground-app.ts`
- Modify: `src/pages/index.astro`

This task covers: canvas rendering, rule picker, bit toggles, play/pause/reset, speed slider, and IntersectionObserver pause.

- [ ] **Step 1: Create `src/components/playground-app.ts`**

```typescript
/**
 * Interactive playground — canvas + controls for exploring CA rules.
 * Pauses when off-screen via IntersectionObserver.
 */

import { initRow, nextRow, renderRow, ruleToBinary } from '../lib/automata-engine';

const PALETTES: Record<string, { saturation: number; lightness: number }> = {
  rainbow: { saturation: 60, lightness: 35 },
  fire:    { saturation: 90, lightness: 40 },
  ice:     { saturation: 50, lightness: 50 },
  mono:    { saturation: 0, lightness: 50 },
};

const CELL_SIZES = [1, 2, 4];

export function initPlayground(canvas: HTMLCanvasElement, controlsContainer: HTMLElement) {
  const ctx = canvas.getContext('2d', { alpha: false })!;

  // State
  let rule = 30;
  let speed = 3;
  let cellSize = 1;
  let saturation = 60;
  let lightness = 35;
  let palette = 'rainbow';
  let initialCondition = 'center';

  let W = 0;
  let H = 0;
  let row: Uint8Array;
  let currentY = 0;
  let animId = 0;
  let running = false;
  let visible = true;
  let drawMode = false;
  let drawRow: Uint8Array | null = null;

  // --- Query elements ---
  const $ = <T extends HTMLElement>(sel: string) => controlsContainer.querySelector<T>(sel)!;
  const ruleInput = $<HTMLInputElement>('#pg-rule-input');
  const ruleDisplay = $('#pg-rule-display');
  const binaryDisplay = $('#pg-binary-display');
  const bitToggles = controlsContainer.querySelectorAll<HTMLButtonElement>('[data-bit]');
  const speedSlider = $<HTMLInputElement>('#pg-speed');
  const speedLabel = $('#pg-speed-label');
  const cellSizeSelect = $<HTMLSelectElement>('#pg-cell-size');
  const satSlider = $<HTMLInputElement>('#pg-saturation');
  const lightSlider = $<HTMLInputElement>('#pg-lightness');
  const paletteButtons = controlsContainer.querySelectorAll<HTMLButtonElement>('[data-palette]');
  const conditionButtons = controlsContainer.querySelectorAll<HTMLButtonElement>('[data-condition]');
  const playBtn = $<HTMLButtonElement>('#pg-play');
  const pauseBtn = $<HTMLButtonElement>('#pg-pause');
  const resetBtn = $<HTMLButtonElement>('#pg-reset');

  // --- Core functions ---

  function resize() {
    const container = canvas.parentElement!;
    const cw = container.offsetWidth;
    const ch = Math.min(600, Math.floor(cw * 0.6));
    W = Math.floor(cw / cellSize);
    H = Math.floor(ch / cellSize);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
  }

  function initRowForCondition(): Uint8Array {
    const r = new Uint8Array(W);
    switch (initialCondition) {
      case 'center':
        r[W >> 1] = 1;
        break;
      case 'random':
        for (let i = 0; i < W; i++) r[i] = Math.random() < 0.5 ? 1 : 0;
        break;
      case 'sparse':
        r[W >> 1] = 1;
        for (let i = 0; i < W; i++) if (Math.random() < 0.02) r[i] = 1;
        break;
      case 'draw':
        break; // Start blank, user draws
    }
    return r;
  }

  function reset() {
    cancelAnimationFrame(animId);
    running = false;
    resize();
    currentY = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    row = (initialCondition === 'draw' && drawRow && drawRow.length === W)
      ? drawRow.slice()
      : initRowForCondition();

    renderRow(ctx, row, 0, saturation, lightness);
    updateUI();
  }

  function paint() {
    if (!running || !visible) return;

    for (let step = 0; step < speed; step++) {
      if (currentY >= H - 1) {
        running = false;
        updateUI();
        return;
      }
      row = nextRow(rule, row);
      currentY++;
      renderRow(ctx, row, currentY, saturation, lightness);
    }

    animId = requestAnimationFrame(paint);
  }

  function play() {
    if (currentY >= H - 1) reset();
    running = true;
    updateUI();
    animId = requestAnimationFrame(paint);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(animId);
    updateUI();
  }

  function setRule(r: number) {
    rule = Math.max(0, Math.min(255, r));
    reset();
  }

  function updateUI() {
    ruleInput.value = String(rule);
    ruleDisplay.textContent = `Rule ${rule}`;
    binaryDisplay.textContent = ruleToBinary(rule);

    const bits = ruleToBinary(rule);
    bitToggles.forEach((btn) => {
      const bitIdx = parseInt(btn.dataset.bit!, 10);
      const isOn = bits[7 - bitIdx] === '1';
      btn.classList.toggle('bg-purple-500', isOn);
      btn.classList.toggle('bg-gray-700', !isOn);
      btn.textContent = isOn ? '1' : '0';
    });

    speedSlider.value = String(speed);
    speedLabel.textContent = String(speed);
    cellSizeSelect.value = String(cellSize);
    satSlider.value = String(saturation);
    lightSlider.value = String(lightness);

    playBtn.classList.toggle('hidden', running);
    pauseBtn.classList.toggle('hidden', !running);

    paletteButtons.forEach((btn) => {
      btn.classList.toggle('border-purple-500', btn.dataset.palette === palette);
      btn.classList.toggle('border-white/10', btn.dataset.palette !== palette);
    });

    conditionButtons.forEach((btn) => {
      btn.classList.toggle('border-purple-500', btn.dataset.condition === initialCondition);
      btn.classList.toggle('border-white/10', btn.dataset.condition !== initialCondition);
    });
  }

  // --- Event listeners ---

  ruleInput.addEventListener('change', () => setRule(parseInt(ruleInput.value, 10) || 0));

  bitToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const bitIdx = parseInt(btn.dataset.bit!, 10);
      rule ^= (1 << bitIdx);
      reset();
    });
  });

  speedSlider.addEventListener('input', () => {
    speed = parseInt(speedSlider.value, 10);
    speedLabel.textContent = String(speed);
  });

  cellSizeSelect.addEventListener('change', () => {
    cellSize = parseInt(cellSizeSelect.value, 10);
    reset();
  });

  satSlider.addEventListener('input', () => {
    saturation = parseInt(satSlider.value, 10);
    palette = 'rainbow';
    reset();
  });

  lightSlider.addEventListener('input', () => {
    lightness = parseInt(lightSlider.value, 10);
    palette = 'rainbow';
    reset();
  });

  paletteButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      palette = btn.dataset.palette!;
      const pal = PALETTES[palette];
      saturation = pal.saturation;
      lightness = pal.lightness;
      reset();
    });
  });

  conditionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      initialCondition = btn.dataset.condition!;
      if (initialCondition === 'draw') {
        drawRow = new Uint8Array(W);
        drawMode = true;
      } else {
        drawMode = false;
      }
      reset();
    });
  });

  // Draw mode: click on canvas to toggle cells in top row
  canvas.addEventListener('click', (e) => {
    if (!drawMode && initialCondition !== 'draw') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    if (x >= 0 && x < W && currentY === 0) {
      row[x] = row[x] ? 0 : 1;
      drawRow = row.slice();
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, 1);
      renderRow(ctx, row, 0, saturation, lightness);
      for (let i = 0; i < W; i++) {
        if (!row[i]) {
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.fillRect(i, 0, 1, 1);
        }
      }
    }
  });

  playBtn.addEventListener('click', play);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);

  // IntersectionObserver: pause when off-screen
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && running) {
        animId = requestAnimationFrame(paint);
      } else if (!visible) {
        cancelAnimationFrame(animId);
      }
    },
    { threshold: 0 },
  );
  observer.observe(canvas.parentElement!);

  // Resize handler
  let resizeTimer: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => reset(), 300);
  });

  // Gallery/Learn integration: event delegation for [data-load-rule] clicks
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-load-rule]') as HTMLElement | null;
    if (!target) return;
    e.preventDefault();
    const r = parseInt(target.dataset.loadRule!, 10);
    if (!isNaN(r)) {
      rule = r;
      reset();
      play();
      document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Init
  reset();
}
```

- [ ] **Step 2: Create `src/components/Playground.astro`**

```astro
---
---

<section id="playground" class="relative py-24 px-6 max-w-6xl mx-auto">
  <h2 class="text-3xl md:text-4xl font-black text-white text-center mb-3">
    Playground
  </h2>
  <p class="text-gray-400 text-center mb-12 max-w-xl mx-auto">
    Pick any rule from 0–255, tweak the settings, and watch patterns emerge.
  </p>

  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Canvas -->
    <div class="flex-1 min-w-0">
      <div class="relative bg-black rounded-xl overflow-hidden border border-white/10">
        <canvas id="pg-canvas" class="w-full cursor-crosshair" style="image-rendering: pixelated;"></canvas>
      </div>
    </div>

    <!-- Controls panel -->
    <div id="pg-controls" class="lg:w-80 space-y-6">

      <!-- Rule picker -->
      <div class="bg-white/[0.05] border border-white/10 rounded-xl p-4">
        <div class="flex items-baseline justify-between mb-3">
          <span id="pg-rule-display" class="text-white font-bold font-mono text-xl">Rule 30</span>
          <span id="pg-binary-display" class="text-[10px] font-mono text-gray-500">00011110</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <label class="text-[10px] text-gray-500 uppercase tracking-wider">Rule #</label>
          <input id="pg-rule-input" type="number" min="0" max="255" value="30"
            class="w-20 bg-black/50 border border-white/10 rounded px-2 py-1 text-white font-mono text-sm focus:border-purple-500 focus:outline-none" />
        </div>
        <!-- 8 bit toggles (MSB left, LSB right) -->
        <div class="flex items-center gap-1">
          <span class="text-[9px] text-gray-600 mr-1">bits:</span>
          {[7,6,5,4,3,2,1,0].map((bit) => (
            <button data-bit={bit}
              class="w-7 h-7 rounded text-[11px] font-mono font-bold text-white bg-gray-700 hover:opacity-80 transition-colors">
              0
            </button>
          ))}
        </div>
      </div>

      <!-- Transport -->
      <div class="flex gap-2">
        <button id="pg-play" class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
          Play
        </button>
        <button id="pg-pause" class="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-lg hover:bg-white/20 transition-colors hidden">
          Pause
        </button>
        <button id="pg-reset" class="px-4 bg-white/10 text-white font-bold py-2.5 rounded-lg hover:bg-white/20 transition-colors">
          Reset
        </button>
      </div>

      <!-- Speed -->
      <div class="bg-white/[0.05] border border-white/10 rounded-xl p-4">
        <div class="flex justify-between mb-2">
          <label class="text-[10px] text-gray-500 uppercase tracking-wider">Speed</label>
          <span id="pg-speed-label" class="text-sm text-white font-mono">3</span>
        </div>
        <input id="pg-speed" type="range" min="1" max="10" value="3" class="w-full accent-purple-500" />
      </div>

      <!-- Cell size -->
      <div class="bg-white/[0.05] border border-white/10 rounded-xl p-4">
        <div class="flex justify-between mb-2">
          <label class="text-[10px] text-gray-500 uppercase tracking-wider">Cell Size</label>
        </div>
        <select id="pg-cell-size" class="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white font-mono text-sm focus:border-purple-500 focus:outline-none">
          <option value="1">1px</option>
          <option value="2">2px</option>
          <option value="4">4px</option>
        </select>
      </div>

      <!-- Color controls -->
      <div class="bg-white/[0.05] border border-white/10 rounded-xl p-4">
        <label class="text-[10px] text-gray-500 uppercase tracking-wider block mb-3">Colors</label>
        <div class="flex gap-2 mb-3">
          {['rainbow', 'fire', 'ice', 'mono'].map((p) => (
            <button data-palette={p}
              class="flex-1 text-[10px] font-mono capitalize py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-colors">
              {p}
            </button>
          ))}
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <label class="text-[10px] text-gray-500 w-12">Sat</label>
            <input id="pg-saturation" type="range" min="0" max="100" value="60" class="flex-1 accent-purple-500" />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-[10px] text-gray-500 w-12">Light</label>
            <input id="pg-lightness" type="range" min="0" max="100" value="35" class="flex-1 accent-purple-500" />
          </div>
        </div>
      </div>

      <!-- Initial conditions -->
      <div class="bg-white/[0.05] border border-white/10 rounded-xl p-4">
        <label class="text-[10px] text-gray-500 uppercase tracking-wider block mb-3">Initial State</label>
        <div class="grid grid-cols-2 gap-2">
          {[
            { id: 'center', label: 'Center Cell' },
            { id: 'random', label: 'Random 50%' },
            { id: 'sparse', label: 'Sparse' },
            { id: 'draw', label: 'Draw Mode' },
          ].map(({ id, label }) => (
            <button data-condition={id}
              class="text-[10px] font-mono py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-colors">
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>

<script>
  import { initPlayground } from './playground-app';

  const canvas = document.getElementById('pg-canvas') as HTMLCanvasElement;
  const controls = document.getElementById('pg-controls') as HTMLElement;

  if (canvas && controls) {
    initPlayground(canvas, controls);
  }
</script>
```

- [ ] **Step 3: Add Playground to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Gallery from '../components/Gallery.astro';
import Playground from '../components/Playground.astro';
---

<Layout title="automataRules — Elementary Cellular Automata">
  <main>
    <Hero />
    <Gallery />
    <Playground />
  </main>
</Layout>
```

- [ ] **Step 4: Verify playground renders and core controls work**

```bash
npm run dev
```

Expected: Canvas renders. Rule input, bit toggles, play/pause/reset, and speed slider all function. Clicking a gallery card scrolls to playground and loads that rule. Canvas pauses when scrolled off-screen.

- [ ] **Step 5: Commit**

```bash
git add src/components/Playground.astro src/components/playground-app.ts src/pages/index.astro
git commit -m "feat: add interactive playground with controls"
```

---

## Chunk 5: Learn Section + Footer

### Task 6: Learn Section — How It Works + Rule Diagram

**Files:**
- Create: `src/components/Learn.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Learn.astro`**

```astro
---
import { RULE_CLASSES, ruleToBinary } from '../lib/automata-engine';
---

<section id="learn" class="relative py-24 px-6 max-w-4xl mx-auto">
  <h2 class="text-3xl md:text-4xl font-black text-white text-center mb-3">
    How It Works
  </h2>
  <p class="text-gray-400 text-center mb-16 max-w-xl mx-auto">
    Complex patterns from the simplest possible rules.
  </p>

  <div class="space-y-16">

    <!-- The Rule -->
    <div>
      <h3 class="text-xl font-bold text-white mb-4">The 3-Cell Neighborhood</h3>
      <p class="text-gray-300 leading-relaxed mb-6">
        An elementary cellular automaton is a row of cells, each either <strong class="text-white">on</strong> or <strong class="text-white">off</strong>.
        To compute the next generation, each cell looks at itself and its two neighbors — three cells total.
        With two possible states per cell, there are 2<sup>3</sup> = <strong class="text-white">8 possible patterns</strong>.
      </p>
      <p class="text-gray-300 leading-relaxed mb-6">
        A <strong class="text-white">rule number</strong> (0–255) is just an 8-bit binary number that encodes what each pattern produces.
        For example, Rule 30 in binary is <code class="font-mono text-purple-400 bg-purple-500/10 px-1 rounded">00011110</code>.
        Each bit maps to one of the 8 possible 3-cell inputs:
      </p>

      <!-- Rule diagram -->
      <div class="bg-white/[0.05] border border-white/10 rounded-xl p-6 font-mono text-sm">
        <div class="grid grid-cols-8 gap-2 text-center">
          {['111', '110', '101', '100', '011', '010', '001', '000'].map((pattern, i) => (
            <div class="space-y-2">
              <div class="text-gray-400 text-[10px]">{pattern}</div>
              <div class="flex justify-center gap-px">
                {pattern.split('').map((bit) => (
                  <div class={`w-4 h-4 rounded-sm ${bit === '1' ? 'bg-purple-500' : 'bg-gray-800 border border-gray-700'}`}></div>
                ))}
              </div>
              <div class="text-[10px] text-gray-600">↓</div>
              <div class={`w-4 h-4 rounded-sm mx-auto ${ruleToBinary(30)[i] === '1' ? 'bg-amber-400' : 'bg-gray-800 border border-gray-700'}`}></div>
              <div class="text-[10px] text-gray-500">{ruleToBinary(30)[i]}</div>
            </div>
          ))}
        </div>
        <p class="text-center text-gray-500 text-[11px] mt-4">
          Rule 30: inputs map to outputs via binary <span class="text-purple-400">00011110</span>
        </p>
      </div>
    </div>

    <!-- Wolfram's 4 Classes -->
    <div>
      <h3 class="text-xl font-bold text-white mb-4">Wolfram's Four Classes</h3>
      <p class="text-gray-300 leading-relaxed mb-6">
        Stephen Wolfram classified all 256 elementary rules into four behavioral classes:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(RULE_CLASSES).map(([key, cls]) => (
          <div class="bg-white/[0.05] border border-white/10 rounded-xl p-4">
            <h4 class="text-white font-bold mb-1">{cls.label}</h4>
            <p class="text-gray-400 text-sm mb-2">{cls.description}</p>
            <div class="flex flex-wrap gap-1">
              {cls.examples.map((r) => (
                <button data-load-rule={r}
                  class="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded hover:bg-purple-500/20 transition-colors cursor-pointer">
                  Rule {r}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <!-- Why It Matters -->
    <div>
      <h3 class="text-xl font-bold text-white mb-4">Why It Matters</h3>
      <div class="space-y-4 text-gray-300 leading-relaxed">
        <p>
          <strong class="text-white">Rule 110 is Turing complete.</strong> Matthew Cook proved in 2004 that this single,
          simple rule can simulate any computation a general-purpose computer can perform. Complexity doesn't require
          complex ingredients.
        </p>
        <p>
          <strong class="text-white">Rule 30 generates randomness.</strong> Wolfram's Mathematica used Rule 30 as a
          pseudorandom number generator. A deterministic process producing output indistinguishable from randomness.
        </p>
        <p>
          <strong class="text-white">Simple rules, emergent complexity.</strong> Cellular automata demonstrate that
          elaborate, unpredictable behavior can emerge from the simplest possible foundations — a philosophical insight
          that reaches into physics, biology, and computation theory.
        </p>
      </div>
    </div>

    <!-- Further Reading -->
    <div>
      <h3 class="text-xl font-bold text-white mb-4">Further Reading</h3>
      <ul class="space-y-2">
        <li>
          <a href="https://plato.stanford.edu/entries/cellular-automata/" target="_blank" rel="noopener noreferrer"
            class="text-purple-400 hover:text-purple-300 transition-colors">
            Stanford Encyclopedia of Philosophy — Cellular Automata ↗
          </a>
        </li>
        <li>
          <a href="https://mathworld.wolfram.com/ElementaryCellularAutomaton.html" target="_blank" rel="noopener noreferrer"
            class="text-purple-400 hover:text-purple-300 transition-colors">
            Wolfram MathWorld — Elementary Cellular Automaton ↗
          </a>
        </li>
        <li>
          <a href="https://www.wolframscience.com/nks/" target="_blank" rel="noopener noreferrer"
            class="text-purple-400 hover:text-purple-300 transition-colors">
            A New Kind of Science (NKS Online) ↗
          </a>
        </li>
      </ul>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Add Learn to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Gallery from '../components/Gallery.astro';
import Playground from '../components/Playground.astro';
import Learn from '../components/Learn.astro';
---

<Layout title="automataRules — Elementary Cellular Automata">
  <main>
    <Hero />
    <Gallery />
    <Playground />
    <Learn />
  </main>
</Layout>
```

- [ ] **Step 3: Verify Learn section renders**

```bash
npm run dev
```

Expected: Rule diagram, 4 class cards, "Why it matters" text, and further reading links all render below the playground.

- [ ] **Step 4: Commit**

```bash
git add src/components/Learn.astro src/pages/index.astro
git commit -m "feat: add educational learn section"
```

---

### Task 7: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
---

<footer class="py-12 px-6 border-t border-white/5">
  <div class="max-w-4xl mx-auto text-center">
    <p class="text-gray-500 text-sm">
      Built by <a href="https://tsciano.com" target="_blank" rel="noopener noreferrer"
        class="text-purple-400 hover:text-purple-300 transition-colors">Tom Sciano</a>
    </p>
  </div>
</footer>
```

- [ ] **Step 2: Add Footer to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Gallery from '../components/Gallery.astro';
import Playground from '../components/Playground.astro';
import Learn from '../components/Learn.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="automataRules — Elementary Cellular Automata">
  <main>
    <Hero />
    <Gallery />
    <Playground />
    <Learn />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 3: Verify footer renders**

```bash
npm run dev
```

Expected: Footer with "Built by Tom Sciano" link at the bottom of the page.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add footer with credits"
```

---

## Chunk 6: Polish + Build Verification

### Task 8: Final Polish and Build

**Files:**
- Various files as needed for fixes

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Builds successfully to `dist/` with no errors.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Expected: Site loads and functions identically to dev mode.

- [ ] **Step 3: Test key interactions**

Manual verification checklist:
- Hero animation cycles through rules with fade transitions
- Hero pauses when scrolled off-screen
- Rule label updates in hero corner
- Gallery thumbnails all render
- Clicking a gallery card scrolls to playground and loads that rule
- Playground: rule number input works
- Playground: bit toggles flip individual bits
- Playground: play/pause/reset work
- Playground: speed slider adjusts animation speed
- Playground: cell size select (1px, 2px, 4px) works
- Playground: palette buttons change colors
- Playground: saturation/lightness sliders work
- Playground: initial condition buttons work
- Playground: draw mode allows clicking cells
- Playground: canvas pauses when scrolled off-screen
- Learn section: rule diagram renders correctly
- Learn section: class example links load rules in playground
- Further reading links open in new tabs
- Footer link works
- Responsive: check at mobile (375px), tablet (768px), desktop (1280px) widths

- [ ] **Step 4: Fix any issues found**

Address bugs or visual issues discovered during testing.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: polish and production build verification"
```
