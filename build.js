#!/usr/bin/env node
/**
 *   node build.js          rebuild the mockup and the Custom CSS / Custom Liquid copies
 *   node build.js --zip     …and package the theme into dist/beaverton-retro-theme.zip
 *
 * The theme lives at the root of this repo, because Shopify's GitHub
 * connection only looks for theme folders there. Everything under
 * design/ is generated from it and is ignored by Shopify.
 *
 *   assets/retro.css   ← the one source of truth for the look
 *        ├→ design/mockup.html         one flat file, for showing people
 *        ├→ design/custom-css.css      the same CSS with the @import put
 *        │                             back, for pasting into a theme you
 *        │                             already have
 *        └→ design/custom-liquid/      paste-in sections for that route
 *
 * assets/retro.css is deliberately the source rather than an output:
 * once the store is connected to GitHub the sync writes to assets/, and
 * a generated file there would fight with it.
 *
 * The Custom Liquid sections are sliced out of design/src/mockup.html at
 * `@section <slug> | <title>` markers, so the mockup and what you paste
 * into Shopify cannot drift apart. `@skip` marks the nav and footer,
 * which a real theme provides.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const here = (...p) => path.join(__dirname, ...p);
const read = (p) => fs.readFileSync(here(p), 'utf8');
const write = (p, s) => {
  fs.mkdirSync(path.dirname(here(p)), { recursive: true });
  fs.writeFileSync(here(p), s);
  console.log(`${p.padEnd(38)}${(s.length / 1024).toFixed(1)} kB`);
};

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:ital,wght@0,500;0,700;1,600&display=swap';
const FONT_COMMENT = /^\/\* Fonts are loaded with a <link>[^\n]*\n/m;

const themeCss = read('assets/retro.css');
const mockupSrc = read('design/src/mockup.html');

/* ---------- 1. the flat mockup ---------- */

write(
  'design/mockup.html',
  mockupSrc
    .replace('/*<!--THEME_CSS-->*/', themeCss)
    .replace('/*<!--MOCKUP_CSS-->*/', read('design/src/mockup.css'))
    .replace('<!--BADGE_SVG-->', read('assets/logo-badge.svg').trim())
);

/* ---------- 2. the Custom CSS copy (for layering onto another theme) ---------- */

write(
  'design/custom-css.css',
  themeCss
    .replace(
      '   The one source of truth for the look. Loaded last in\n' +
        '   layout/theme.liquid so it wins over every Dawn stylesheet, and the\n' +
        '   file the GitHub sync writes to — so edit it here or in the theme\n' +
        '   editor, never as a build output.\n\n' +
        '   This file ships with the theme. If you are layering the look onto a\n' +
        '   different theme instead, paste design/custom-css.css into Theme\n' +
        '   settings → Custom CSS.',
      '   Generated from assets/retro.css — edit that, not this.\n\n' +
        '   Paste into: Online Store → Themes → Customize → Theme settings\n' +
        '               → Custom CSS. The @import must stay on the very first\n' +
        '               line or the fonts will not load.'
    )
    .replace(FONT_COMMENT, `@import url('${FONT_URL}');\n`)
);

/* ---------- 3. the Custom Liquid sections ---------- */

const MARKER = /<!--\s*@(section|skip)\s+([^|\n]+?)(?:\s*\|\s*(.+?))?\s*-->/g;

const marks = [];
for (const m of mockupSrc.matchAll(MARKER)) {
  marks.push({ kind: m[1], slug: m[2].trim(), title: (m[3] || '').trim(), start: m.index, end: m.index + m[0].length });
}

const outDir = here('design/custom-liquid');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

let n = 0;
marks.forEach((mark, i) => {
  if (mark.kind !== 'section') return;
  const stop = marks[i + 1] ? marks[i + 1].start : mockupSrc.indexOf('</body>');
  const body = mockupSrc.slice(mark.end, stop).trim();
  fs.writeFileSync(
    path.join(outDir, `${String(++n).padStart(2, '0')}-${mark.slug}.liquid`),
    [
      '{%- comment -%}',
      `  ${mark.title || mark.slug}`,
      '',
      '  Only needed if you are layering the look onto a theme you already',
      '  have: Customize → Add section → Custom Liquid, then paste',
      '  everything below this comment, with design/custom-css.css in',
      '  Theme settings → Custom CSS.',
      '',
      '  This theme has proper editable sections instead — see',
      '  sections/retro-*.liquid.',
      '',
      '  Generated from design/src/mockup.html by build.js.',
      '{%- endcomment -%}',
      '',
      body,
      '',
    ].join('\n')
  );
});
console.log(`design/custom-liquid/                 ${n} files`);

/* ---------- 4. the uploadable zip ---------- */

if (process.argv.includes('--zip')) {
  const THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
  const zip = here('dist/beaverton-retro-theme.zip');
  fs.mkdirSync(here('dist'), { recursive: true });
  fs.rmSync(zip, { force: true });
  // Shopify wants the theme folders at the root of the archive.
  execFileSync('zip', ['-rq', zip, ...THEME_DIRS, 'LICENSE.md', '-x', '*/.*'], { cwd: __dirname });
  console.log(`dist/beaverton-retro-theme.zip        ${(fs.statSync(zip).size / 1024 / 1024).toFixed(1)} MB`);
}
