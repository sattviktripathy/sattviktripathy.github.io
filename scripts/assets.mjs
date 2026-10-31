// One-off: pulls the real source assets from the project folders into src/assets.
// Rerun only when a source changes. The results are committed.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const HOME = process.env.HOME;
const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'src/assets');
const POSEPAL = join(HOME, 'Camera editing app');
mkdirSync(OUT, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'assets-'));

// The camera view: PosePal's own guide-mode art, trimmed to the app's 3:4 viewfinder.
await sharp(join(POSEPAL, 'PosePal/Assets.xcassets/ob_guide_3.imageset/ob_guide_3.jpg'))
  .extract({ left: 34, top: 0, width: 1018, height: 1358 })
  .jpeg({ quality: 76, mozjpeg: true })
  .toFile(join(OUT, 'viewfinder.jpg'));

// The ghost that lines up on him, from the app's pose library.
const heic = join(POSEPAL, 'PosePal/Resources/Poses/walking_drink_step_m.heic');
const png = join(tmp, 'ghost.png');
execFileSync('sips', ['-s', 'format', 'png', heic, '--out', png], { stdio: 'ignore' });
await sharp(png).trim({ threshold: 2 }).resize({ height: 1100 }).webp({ quality: 80, alphaQuality: 80 }).toFile(join(OUT, 'ghost.webp'));

copyFileSync(join(POSEPAL, 'web/public/icon-512.png'), join(OUT, 'posepal-icon.png'));
copyFileSync(join(POSEPAL, 'web/public/app-store-badge-white.svg'), join(ROOT, 'public/app-store-badge.svg'));

// The small home that sits inside the hero sentence.
await sharp(join(ROOT, 'public/seq/lg/71.webp')).trim().resize({ width: 240 }).webp({ quality: 82 }).toFile(join(OUT, 'home-thumb.webp'));

// The passport photo is only 425px wide, so it is printed as a halftone instead of shown raw.
const { data, info } = await sharp(join(HOME, "Downloads/Sattvik's Photo.jpg"))
  .resize({ width: 1000, kernel: 'lanczos3' }).grayscale().normalise().raw().toBuffer({ resolveWithObject: true });
const cell = 9;
const dots = [];
for (let y = 0, row = 0; y < info.height; y += cell, row++) {
  for (let x = row % 2 ? cell / 2 : 0; x < info.width; x += cell) {
    let sum = 0;
    let n = 0;
    for (let j = 0; j < cell; j++) {
      for (let i = 0; i < cell; i++) {
        const v = data[Math.min(info.height - 1, Math.round(y + j)) * info.width + Math.min(info.width - 1, Math.round(x + i))];
        sum += v;
        n++;
      }
    }
    const dark = 1 - sum / n / 255;
    if (dark > 0.05) dots.push(`<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${(Math.sqrt(dark) * cell * 0.66).toFixed(2)}"/>`);
  }
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}"><rect width="100%" height="100%" fill="#fff"/><g fill="#1A2FD0">${dots.join('')}</g></svg>`;
await sharp(Buffer.from(svg)).png({ palette: true, colours: 8 }).toFile(join(OUT, 'halftone.png'));

// Only the geometry the plan drawing needs from the demo home.
const plan = JSON.parse(readFileSync(join(HOME, 'truspace-engine/data/refdemo/plan.json'), 'utf8'));
writeFileSync(join(ROOT, 'src/data/plan.json'), JSON.stringify({ walls: plan.walls, openings: plan.openings, rooms: plan.rooms }));

console.log('assets written');
