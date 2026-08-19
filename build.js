#!/usr/bin/env node
/**
 *   node build.js          rebuild the mockup, the paste-in sections and theme/assets/retro.css
 *   node build.js --zip     …and package theme/ into dist/beaverton-retro-theme.zip
 *
 * One source of truth, three outputs:
 *
 *   shopify/custom-css.css  →  theme/assets/retro.css      (the uploadable theme)
 *   src/mockup.*            →  mockup/index.html           (one flat file to open or send)
 *                           →  shopify/sections/*.liquid   (paste-in Custom Liquid)
 *
 * Sections are sliced out of the mockup at `@section <slug> | <title>`
 * comment markers, so the mockup and what you paste into Shopify cannot
 * drift. `@skip` marks the nav and footer, which a real theme provides.
 *
 * The Google Fonts @import is stripped from both inlined copies of the
 * CSS: the mockup and layout/theme.liquid load the fonts with a <link>
 * instead, because an @import is only valid at the top of a stylesheet.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const here = (...p) => path.join(__dirname, ...p);
const read = (p) => fs.readFileSync(here(p), 'utf8');

const IMPORT_LINE = /^@import url\([^)]*\);$/m;
const rawCss = read('shopify/custom-css.css');
const mockupSrc = read('src/mockup.html');

/* ---------- 1. the flat mockup ---------- */

const html = mockupSrc
  .replace('/*<!--THEME_CSS-->*/', rawCss.replace(IMPORT_LINE, '/* fonts are loaded with a <link> in the mockup */'))
  .replace('/*<!--MOCKUP_CSS-->*/', read('src/mockup.css'))
  .replace('<!--BADGE_SVG-->', read('assets/logo-badge.svg').trim());

fs.mkdirSync(here('mockup'), { recursive: true });
fs.writeFileSync(here('mockup/index.html'), html);
console.log(`mockup/index.html            ${(html.length / 1024).toFixed(1)} kB`);

/* ---------- 2. the theme's stylesheet and art ---------- */

fs.writeFileSync(
  here('theme/assets/retro.css'),
  rawCss
    .replace(IMPORT_LINE, '/* Fonts are loaded with a <link> in layout/theme.liquid. */')
    .replace(
      '   Paste into: Shopify admin → Online Store → Themes → Customize\n               → Theme settings → Custom CSS',
      '   This file ships with the theme. If you are layering the look\n' +
        '   onto a different theme instead, paste shopify/custom-css.css into\n' +
        '   Theme settings → Custom CSS.'
    )
);
for (const svg of ['kid-skier.svg', 'logo-badge.svg']) {
  fs.copyFileSync(here('assets', svg), here('theme/assets', svg));
}
console.log('theme/assets/retro.css');

/* ---------- 3. the Custom Liquid sections ---------- */

const MARKER = /<!--\s*@(section|skip)\s+([^|\n]+?)(?:\s*\|\s*(.+?))?\s*-->/g;

const marks = [];
for (const m of mockupSrc.matchAll(MARKER)) {
  marks.push({ kind: m[1], slug: m[2].trim(), title: (m[3] || '').trim(), start: m.index, end: m.index + m[0].length });
}

const outDir = here('shopify/sections');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

let n = 0;
marks.forEach((mark, i) => {
  if (mark.kind !== 'section') return;
  const stop = marks[i + 1] ? marks[i + 1].start : mockupSrc.indexOf('</body>');
  const body = mockupSrc.slice(mark.end, stop).trim();
  const file = [
    '{%- comment -%}',
    `  ${mark.title || mark.slug}`,
    '',
    '  Only needed if you are layering the look onto a theme you already',
    '  have: Customize → Add section → Custom Liquid, then paste',
    '  everything below this comment, with shopify/custom-css.css in',
    '  Theme settings → Custom CSS.',
    '',
    '  The uploadable theme in theme/ has proper editable sections',
    '  instead — use those if you installed it.',
    '',
    '  Generated from src/mockup.html by build.js — edit that, not this.',
    '{%- endcomment -%}',
    '',
    body,
    '',
  ].join('\n');
  const name = `${String(++n).padStart(2, '0')}-${mark.slug}.liquid`;
  fs.writeFileSync(path.join(outDir, name), file);
});
console.log(`shopify/sections/            ${n} files`);

/* ---------- 4. the uploadable zip ---------- */

if (process.argv.includes('--zip')) {
  const zip = here('dist/beaverton-retro-theme.zip');
  fs.mkdirSync(here('dist'), { recursive: true });
  fs.rmSync(zip, { force: true });
  // Shopify wants the theme folders at the root of the archive.
  execFileSync('zip', ['-rq', zip, '.', '-x', '.*', '-x', '*/.*'], { cwd: here('theme') });
  console.log(`dist/beaverton-retro-theme.zip  ${(fs.statSync(zip).size / 1024 / 1024).toFixed(1)} MB`);
}
