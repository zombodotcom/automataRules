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
