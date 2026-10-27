'use strict';

// Animated texture for the existing Northstar revenue card. All labels,
// title, legend and footer are retained from the supplied website asset.
// The returned canvas is reused: draw it before requesting the next frame.
const { createCanvas } = require('@napi-rs/canvas');

const CARD = { x: 315, y: 415, width: 990, height: 405 };
const PLOT = { x: 87, y: 83, width: 861, height: 180 };
const cache = new WeakMap();
const clamp = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

function prepare(sourceImage) {
  const base = createCanvas(CARD.width, CARD.height);
  const ctx = base.getContext('2d');
  ctx.drawImage(sourceImage, CARD.x, CARD.y, CARD.width, CARD.height,
    0, 0, CARD.width, CARD.height);

  // Recover the actual line from the local image instead of inventing values.
  // The current-month series is the only bright blue element inside the plot.
  const pixels = ctx.getImageData(0, 0, CARD.width, CARD.height).data;
  const points = [];
  let previousY = PLOT.y + PLOT.height - 12;
  for (let x = PLOT.x; x <= PLOT.x + PLOT.width; x += 3) {
    let bestScore = 0;
    let bestY = previousY;
    for (let y = PLOT.y + 3; y < PLOT.y + PLOT.height; y++) {
      const offset = (y * CARD.width + x) * 4;
      const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2];
      const score = b > 155 && g > 110 && b - r > 24 ? b + g : 0;
      if (score > bestScore) { bestScore = score; bestY = y; }
    }
    previousY = bestY;
    points.push({ x, y: bestY });
  }

  // Smooth one-pixel WebP/antialiasing variations, retaining the source curve.
  for (let index = 1; index < points.length - 1; index++) {
    points[index].y = (points[index - 1].y + 2 * points[index].y + points[index + 1].y) / 4;
  }

  const canvas = createCanvas(CARD.width, CARD.height);
  const state = { base, canvas, points, lastProgress: null };
  cache.set(sourceImage, state);
  return state;
}

function buildLine(ctx, points, limit, comparison = false) {
  const bottom = PLOT.y + PLOT.height;
  const yy = point => comparison ? bottom - (bottom - point.y) * 0.65 : point.y;
  ctx.beginPath();
  ctx.moveTo(points[0].x, yy(points[0]));
  for (let index = 1; index < points.length; index++) {
    const point = points[index], before = points[index - 1];
    if (point.x > limit) {
      const f = clamp((limit - before.x) / (point.x - before.x));
      const end = { x: limit, y: before.y + (point.y - before.y) * f };
      ctx.lineTo(end.x, yy(end));
      return { x: end.x, y: yy(end) };
    }
    ctx.lineTo(point.x, yy(point));
  }
  const end = points[points.length - 1];
  return { x: end.x, y: yy(end) };
}

function createAnalyticsTexture(sourceImage, progress) {
  if (!sourceImage || typeof sourceImage !== 'object') {
    throw new TypeError('createAnalyticsTexture expects a loaded image or canvas');
  }
  const state = cache.get(sourceImage) || prepare(sourceImage);
  const p = clamp(progress);
  if (state.lastProgress === p) return state.canvas;
  state.lastProgress = p;
  const ctx = state.canvas.getContext('2d');
  ctx.clearRect(0, 0, CARD.width, CARD.height);
  ctx.drawImage(state.base, 0, 0);

  // Only the plotting area is replaced; original axis labels remain untouched.
  ctx.fillStyle = '#14181d';
  ctx.fillRect(PLOT.x - 2, PLOT.y - 2, PLOT.width + 4, PLOT.height + 8);
  ctx.strokeStyle = '#2b333e';
  ctx.lineWidth = 1;
  for (const offset of [0, 60, 120, 180]) {
    ctx.beginPath();
    ctx.moveTo(PLOT.x, PLOT.y + offset + 0.5);
    ctx.lineTo(PLOT.x + PLOT.width, PLOT.y + offset + 0.5);
    ctx.stroke();
  }

  if (p > 0) {
    const limit = PLOT.x + PLOT.width * p;
    const bottom = PLOT.y + PLOT.height;
    const end = buildLine(ctx, state.points, limit);
    ctx.lineTo(end.x, bottom);
    ctx.lineTo(PLOT.x, bottom);
    ctx.closePath();
    const area = ctx.createLinearGradient(0, PLOT.y, 0, bottom);
    area.addColorStop(0, 'rgba(151,193,242,0.29)');
    area.addColorStop(1, 'rgba(88,133,182,0.025)');
    ctx.fillStyle = area;
    ctx.fill();

    buildLine(ctx, state.points, limit, true);
    ctx.setLineDash([6, 7]);
    ctx.strokeStyle = '#607083';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    buildLine(ctx, state.points, limit);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#a7cef6';
    ctx.lineWidth = 2.7;
    ctx.stroke();

    // Small travelling highlight disappears once the completed chart settles.
    const dotOpacity = Math.min(1, p * 12) * Math.min(1, (1 - p) * 14);
    if (dotOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = dotOpacity;
      ctx.fillStyle = '#b9f2dd';
      ctx.shadowColor = '#43b19b';
      ctx.shadowBlur = 11;
      ctx.beginPath();
      ctx.arc(end.x, end.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  return state.canvas;
}

module.exports = { createAnalyticsTexture };
