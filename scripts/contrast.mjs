// Fails if any chapter's text colour drops below WCAG AA on its background.
// Reads the palette straight from global.css so the two can't drift apart.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => {
  const n = parseInt(h.slice(1), 16);
  return 0.2126 * lin((n >> 16) / 255) + 0.7152 * lin(((n >> 8) & 255) / 255) + 0.0722 * lin((n & 255) / 255);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
const themes = [...css.matchAll(/\[data-c='(\w+)'\]\s*\{([^}]+)\}/g)].filter((m) => m[2].includes('--bg'));
if (themes.length < 6) throw new Error(`expected 6 chapters, found ${themes.length}`);

for (const [, name, body] of themes) {
  const get = (k) => body.match(new RegExp(`--${k}:\\s*(#[0-9A-Fa-f]{6})`))?.[1];
  const [bg, ink, accent] = [get('bg'), get('ink'), get('accent')];
  if (!bg || !ink || !accent) throw new Error(`${name}: missing --bg, --ink or --accent`);
  const body45 = ratio(bg, ink);
  // Accents carry small text here, so they get the same bar as ink.
  const large3 = ratio(bg, accent);
  const ok = body45 >= 4.5 && large3 >= 4.5;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(10)} ink ${body45.toFixed(2)}  accent ${large3.toFixed(2)}`);
}
process.exit(failed ? 1 : 0);
