// Generates public/icons/icon{16,32,48,128}.png — a minimalist calculator
// glyph on a rounded primary-colored square. Pure JS (pngjs), no native deps,
// so `npm run icons` works everywhere without a canvas toolchain.
import { PNG } from 'pngjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/icons');
const SIZES = [16, 32, 48, 128];
const SUPERSAMPLE = 4;

const PRIMARY = { r: 0xb8, g: 0x87, b: 0x46 };
const PRIMARY_DARK = { r: 0x96, g: 0x6c, b: 0x35 };
const WHITE = { r: 0xff, g: 0xff, b: 0xff };

function insideRoundedRect(x, y, rx, ry, rw, rh, radius) {
  const cx = Math.min(Math.max(x, rx + radius), rx + rw - radius);
  const cy = Math.min(Math.max(y, ry + radius), ry + rh - radius);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

/** Returns the RGBA color (straight alpha) for a single sample point, in 0..1 space. */
function sampleColor(u, v) {
  // Outer rounded square background.
  if (!insideRoundedRect(u, v, 0, 0, 1, 1, 0.22)) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  let color = { ...PRIMARY, a: 255 };

  // Calculator body (white rounded rect), inset from the edges.
  const bodyX = 0.24;
  const bodyY = 0.14;
  const bodyW = 0.52;
  const bodyH = 0.72;
  const bodyRadius = 0.06;

  if (insideRoundedRect(u, v, bodyX, bodyY, bodyW, bodyH, bodyRadius)) {
    color = { ...WHITE, a: 255 };

    // Display bar near the top of the body.
    const displayX = bodyX + 0.06;
    const displayY = bodyY + 0.06;
    const displayW = bodyW - 0.12;
    const displayH = 0.14;
    if (insideRoundedRect(u, v, displayX, displayY, displayW, displayH, 0.025)) {
      color = { ...PRIMARY_DARK, a: 255 };
    } else {
      // 3x3 grid of button dots below the display.
      const gridTop = displayY + displayH + 0.07;
      const cellW = (bodyW - 0.12) / 3;
      const cellH = 0.12;
      const gap = 0.03;
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          const dotX = displayX + col * cellW + cellW / 2;
          const dotY = gridTop + row * (cellH + gap) + cellH / 2;
          const dx = u - dotX;
          const dy = v - dotY;
          const dotRadius = Math.min(cellW, cellH) * 0.32;
          if (dx * dx + dy * dy <= dotRadius * dotRadius) {
            color = { ...PRIMARY, a: 255 };
          }
        }
      }
    }
  }

  return color;
}

function renderIcon(size) {
  const png = new PNG({ width: size, height: size });

  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let sy = 0; sy < SUPERSAMPLE; sy += 1) {
        for (let sx = 0; sx < SUPERSAMPLE; sx += 1) {
          const u = (px + (sx + 0.5) / SUPERSAMPLE) / size;
          const v = (py + (sy + 0.5) / SUPERSAMPLE) / size;
          const sample = sampleColor(u, v);
          r += sample.r * (sample.a / 255);
          g += sample.g * (sample.a / 255);
          b += sample.b * (sample.a / 255);
          a += sample.a;
        }
      }

      const totalSamples = SUPERSAMPLE * SUPERSAMPLE;
      const avgAlpha = a / totalSamples;
      const idx = (size * py + px) << 2;

      if (avgAlpha > 0) {
        png.data[idx] = Math.round(r / (a / 255 || 1));
        png.data[idx + 1] = Math.round(g / (a / 255 || 1));
        png.data[idx + 2] = Math.round(b / (a / 255 || 1));
      }
      png.data[idx + 3] = Math.round(avgAlpha);
    }
  }

  return png;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const size of SIZES) {
  const png = renderIcon(size);
  const buffer = PNG.sync.write(png);
  const outPath = path.join(OUT_DIR, `icon${size}.png`);
  writeFileSync(outPath, buffer);
  console.log(`generated ${outPath}`);
}
