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
