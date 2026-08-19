#!/usr/bin/env node
/**
 *   node build.js
 *
 * One source of truth, two outputs:
 *
 *   src/mockup.html + src/mockup.css + shopify/custom-css.css + assets/*.svg
 *     → mockup/index.html            a single flat file you can open or send
 *     → shopify/sections/*.liquid    paste-ready Custom Liquid sections
 *
 * Sections are sliced out of the mockup at `@section <slug> | <title>`
 * comment markers, so the mockup and the live store can never drift.
 * `@skip` marks the nav and footer, which the real theme provides.
 *
 * The Google Fonts @import is stripped from the inlined CSS — the
 * mockup loads the fonts with a <link> instead, because an @import is
 * only valid at the very top of a stylesheet.
 */

const fs = require('fs');
const path = require('path');

const here = (...p) => path.join(__dirname, ...p);
const read = (p) => fs.readFileSync(here(p), 'utf8');

const mockupSrc = read('src/mockup.html');

/* ---------- 1. the flat mockup ---------- */

const themeCss = read('shopify/custom-css.css')
  .replace(/^@import url\([^)]*\);$/m, '/* fonts are loaded with a <link> in the mockup */');

const html = mockupSrc
  .replace('/*<!--THEME_CSS-->*/', themeCss)
  .replace('/*<!--MOCKUP_CSS-->*/', read('src/mockup.css'))
  .replace('<!--BADGE_SVG-->', read('assets/logo-badge.svg').trim());

fs.mkdirSync(here('mockup'), { recursive: true });
fs.writeFileSync(here('mockup/index.html'), html);
console.log(`mockup/index.html            ${(html.length / 1024).toFixed(1)} kB`);

/* ---------- 2. the Custom Liquid sections ---------- */

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
    '  Online Store → Themes → Customize → Add section → Custom Liquid,',
    '  then paste everything below this comment.',
    '',
    '  Needs shopify/custom-css.css in Theme settings → Custom CSS.',
    '  Generated from src/mockup.html by build.js — edit that, not this.',
    '{%- endcomment -%}',
    '',
    body,
    '',
  ].join('\n');
  const name = `${String(++n).padStart(2, '0')}-${mark.slug}.liquid`;
  fs.writeFileSync(path.join(outDir, name), file);
  console.log(`shopify/sections/${name}`);
});
