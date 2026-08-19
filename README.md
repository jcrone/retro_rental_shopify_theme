# Beaverton Ski Rentals — retro theme pack

A drop-in retro look for a Shopify store, built for kids' season ski leases.
Nothing here replaces your theme — it layers on top of Dawn / Horizon as one
block of Custom CSS plus a handful of Custom Liquid sections.

**The kid photo carries the front page.** No geometric poster art, no shape
collages. The photo runs full-bleed behind a paper "ticket" panel and gets a
warm 1970s colour grade in CSS, so a modern photo sits inside the palette
without being re-shot or re-edited.

---

## What's in here

| Path | What it is |
| --- | --- |
| `shopify/custom-css.css` | The whole theme. Paste into **Theme settings → Custom CSS**. |
| `shopify/sections/*.liquid` | Paste-ready **Custom Liquid** sections, in page order. |
| `mockup/index.html` | The full page as one flat file. Open it in a browser. |
| `assets/kid-skier.svg` | Optional drawn character (see *The drawn kid* below). |
| `assets/logo-badge.svg` | Round logo badge using the same character. |
| `src/`, `build.js` | Sources. `node build.js` regenerates the mockup and the sections. |

## Install

1. **Fonts and styles.** Copy all of `shopify/custom-css.css` into
   *Online Store → Themes → Customize → Theme settings → Custom CSS*.
   The `@import` line must stay first or Archivo Black won't load.
2. **The hero.** Either
   - keep your theme's own Image banner / Hero section and give it the CSS
     class `bsr-hero` in the section's settings, or
   - add a **Custom Liquid** section and paste
     `shopify/sections/02-hero-kid.liquid`, swapping the image URL for yours.
3. **The rest of the page.** Add a Custom Liquid section per file in
   `shopify/sections/`, in numbered order. Skip any you don't want.

Product cards, prices, badges, buttons and the footer restyle themselves —
those rules target the theme's own classes, so collection and product pages
pick up the look with no extra work.

## Tuning the hero

Everything worth adjusting is a CSS variable or one declaration:

- **Crop.** `--bsr-hero-focus` (default `60% 38%`) sets `object-position`. If
  the kid ends up half out of frame on mobile, nudge this.
- **How warm the grade is.** The `filter` on `.bsr-hero__media img` —
  drop `sepia()` toward `0` for a cooler, more literal photo.
- **How dark the scrim is.** The gradient on `.bsr-hero__media::before`.
  It only needs to be dark enough that the paper panel doesn't fight the photo.
- **Height.** `min-height` on `.bsr-hero`.

If the photo hasn't been set yet the hero shows a labelled placeholder instead
of a broken image.

## The drawn kid

`assets/kid-skier.svg` is a flat-colour illustration of the same idea, drawn in
the theme palette. The hero uses your **photo** — this is for the places a photo
doesn't fit: the logo badge (already wired up in the mockup's header), a 404
page, an empty cart, a favicon. Style it with `.bsr-kid` or `.bsr-kid--sm`.

## Palette

| Token | Hex | Used for |
| --- | --- | --- |
| `--bsr-paper` | `#F7EFE0` | page background, cards |
| `--bsr-paper2` | `#EFE1C8` | inset panels, inputs |
| `--bsr-orange` | `#E2582C` | primary buttons, ticker |
| `--bsr-mustard` | `#F0A828` | highlights, badges |
| `--bsr-rust` | `#A8321C` | hard shadows, flags |
| `--bsr-teal` | `#17414F` | dark bands |
| `--bsr-teal2` | `#0E2B35` | footer |
| `--bsr-cocoa` | `#3B2416` | every border and outline |

## Rebuilding

`mockup/index.html` and `shopify/sections/` are generated. Edit `src/mockup.html`,
`src/mockup.css` or `shopify/custom-css.css`, then:

```
node build.js
```

Sections are sliced out of the mockup at `@section <slug> | <title>` comments,
so the mockup and what you paste into Shopify can't drift apart.
