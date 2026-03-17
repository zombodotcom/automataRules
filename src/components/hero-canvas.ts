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
