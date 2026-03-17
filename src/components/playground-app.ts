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
    const ch = Math.min(Math.floor(window.innerHeight * 0.7), Math.floor(cw * 0.5));
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
