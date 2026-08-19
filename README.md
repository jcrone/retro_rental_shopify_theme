# Beaverton Ski Rentals — retro theme

A retro Shopify theme for kids' season ski rentals. **The kid photo carries the
front page** — no geometric poster art, no shape collages. The photo runs
full-bleed with a warm 1970s colour grade and a printed halftone, and the copy
sits low and left on a paper "ticket" panel so the kid stays clear of it.

Built on [Dawn 16](https://github.com/Shopify/dawn), so every page Shopify
needs — product, collection, cart, search, account — already works.

**The theme is at the root of this repo**, which is what Shopify's GitHub
connection expects. Everything under `design/` is generated from it and is
ignored by Shopify.

---

## Install it from GitHub

1. Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub**.
2. Authorise the Shopify GitHub app for `jcrone/retro_rental_shopify_theme` if
   it asks.
3. Pick this repository and the **`main`** branch.
4. **Customize** the theme, open the **Retro hero** section, and pick your hero
   photo.
5. Happy with it? **Actions → Publish**.

From then on it's a two-way sync: edits in the theme editor get committed back
to the branch, and commits you push show up in the theme. Which means:

- **`assets/retro.css` is the source of truth for the look, not a build
  output.** Edit it here or in the editor; nothing regenerates over it.
- Anything under `design/` and `dist/` is generated, and Shopify never reads it.

Prefer a zip? `dist/beaverton-retro-theme.zip` still works with
**Add theme → Upload zip file**, and `node build.js --zip` rebuilds it.

## Where the hero photo goes

**Customize → Retro hero → Hero photo.** Three ways to fill it:

- **Upload it there.** Click the image field → **Select image** → **Upload**.
  It lands in the store's file library and is served from Shopify's CDN.
- **Pick one you already have.** Same field, **Library** tab. Anything under
  Shopify admin → **Content → Files** shows up here, including images that came
  with a store preview.
- **Link to one.** Leave the picker empty and paste a direct image URL into
  **…or paste an image URL** just below it. The picker wins if both are set.

Uploading beats linking: Shopify then serves responsive sizes, so phones don't
download a 3000px file. Use the URL field for a quick trial, or for a photo
hosted somewhere you don't want to duplicate.

There's an **Alt text** field under both — worth filling in for screen readers
and search.

## Framing the hero photo

All in **Customize → Retro hero → Framing**, no code:

| Control | What it does |
| --- | --- |
| **Slide photo right** | Widens the photo past the right edge while it stays pinned left, pushing whoever is in the middle of the shot away from the copy panel. Can't open a gap. |
| **Crop from left / top** | Which part of the photo survives the crop. |
| **Minimum height** | How tall the hero is. |
| **Framing on mobile** | Separate crop for phones, where the panel sits *below* the photo rather than over it. |

The panel itself sits bottom-left and narrows on wide screens, so a full-screen
browser gives the photo the whole middle and right of the frame.

If the photo isn't set yet, the hero shows a labelled placeholder rather than a
broken image.

## The homepage

`templates/index.json` arrives assembled: ticker, hero, stripe divider,
three-fact bar, lift-ticket packages, fitting band, four numbered steps,
coming-soon band, FAQ. Every heading, paragraph, button and list item is
editable in the theme editor — nothing is hard-coded.

### Selling through the package cards

Each card in **Retro packages** has an optional **Product** setting. Leave it
empty and the card shows your placeholder price and links wherever you point it.
Pick a product and the card switches to the real price and a working
add-to-cart button, and goes to "Sold out" on its own when stock runs out.

## What's in here

| Path | What it is |
| --- | --- |
| `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` | The theme. Dawn 16 plus the retro layer. |
| `assets/retro.css` | The whole look, in one stylesheet. Loaded last so it wins. |
| `sections/retro-*.liquid` | The nine custom sections, with editor controls. |
| `assets/kid-skier.svg`, `assets/logo-badge.svg` | Drawn character and logo badge — see below. |
| `design/mockup.html` | The full page as one flat file, for showing people. |
| `design/custom-css.css`, `design/custom-liquid/` | The same look for a theme you'd rather keep. See below. |
| `design/src/` | Mockup sources. |
| `build.js` | Regenerates `design/` and the zip. |

## Using the look without replacing your theme

If you'd rather keep the theme you have:

1. Paste `design/custom-css.css` into **Theme settings → Custom CSS**
   (the `@import` line must stay first, or Archivo Black won't load).
2. Add a **Custom Liquid** section per file in `design/custom-liquid/`, in
   numbered order.

Product cards, prices, badges, buttons and the footer restyle themselves either
way — those rules target the theme's own classes.

## The drawn kid

`assets/kid-skier.svg` is a flat-colour illustration in the theme palette. The
hero uses your **photo** — the drawing is for the places a photo doesn't fit:
the logo badge, a 404 page, an empty cart, a favicon. In Liquid they're
`{{ 'kid-skier.svg' | asset_url }}`. Style them with `.bsr-kid` or
`.bsr-kid--sm`.

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

Dawn's own colour schemes are set to the same palette in
`config/settings_data.json`, so native sections match the custom ones.

## Rebuilding the generated files

```
node build.js --zip
```

Reads `assets/retro.css` and `design/src/`, and writes `design/mockup.html`,
`design/custom-css.css`, `design/custom-liquid/` and the zip. It never writes
into the theme folders, so it can't collide with the GitHub sync.

The Custom Liquid sections are sliced out of the mockup at
`@section <slug> | <title>` comments, so the mockup and what you paste into
Shopify can't drift apart.
