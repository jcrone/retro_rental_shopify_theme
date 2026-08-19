# Beaverton Ski Rentals — retro theme

A retro Shopify theme for kids' season ski leases. **The kid photo carries the
front page** — no geometric poster art, no shape collages. The photo runs
full-bleed with a warm 1970s colour grade and a printed halftone, and the copy
sits low and left on a paper "ticket" panel so the kid stays clear of it.

Built on [Dawn 16](https://github.com/Shopify/dawn), so every page Shopify
needs — product, collection, cart, search, account — already works.

---

## Install it (the quick way)

1. Download **`dist/beaverton-retro-theme.zip`**.
2. Shopify admin → **Online Store → Themes → Add theme → Upload zip file**.
3. **Customize** the theme, open the **Retro hero** section, and pick your
   hero photo.
4. Happy with it? **Actions → Publish**.

The homepage comes pre-built: ticker, hero, stripe divider, three-fact bar,
lift-ticket packages, fitting band, four numbered steps, coming-soon band, FAQ.
Every heading, paragraph, button and list item is editable in the theme editor —
nothing is hard-coded.

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

## Selling through the package cards

Each card in **Retro packages** has an optional **Product** setting. Leave it
empty and the card shows your placeholder price and links wherever you point it.
Pick a product and the card switches to the real price and a working
add-to-cart button, and goes to "Sold out" on its own when stock runs out.

## Using the look without replacing your theme

If you'd rather keep the theme you have:

1. Paste `shopify/custom-css.css` into **Theme settings → Custom CSS**
   (the `@import` line must stay first, or Archivo Black won't load).
2. Add a **Custom Liquid** section per file in `shopify/sections/`, in numbered
   order.

Product cards, prices, badges, buttons and the footer restyle themselves either
way — those rules target the theme's own classes.

## What's in here

| Path | What it is |
| --- | --- |
| `dist/beaverton-retro-theme.zip` | The uploadable theme. |
| `theme/` | That theme's source — Dawn 16 plus the retro layer. |
| `theme/sections/retro-*.liquid` | The nine custom sections, with editor controls. |
| `theme/assets/retro.css` | Generated from `shopify/custom-css.css`. |
| `shopify/custom-css.css` | The whole look as one CSS block, for the layering route. |
| `shopify/sections/*.liquid` | Paste-in Custom Liquid, for the layering route. |
| `mockup/index.html` | The full page as one flat file, for showing people. |
| `assets/kid-skier.svg` | Drawn character — used as the logo badge, see below. |
| `assets/logo-badge.svg` | Round logo badge built from that character. |

## The drawn kid

`assets/kid-skier.svg` is a flat-colour illustration in the theme palette. The
hero uses your **photo** — the drawing is for the places a photo doesn't fit:
the logo badge, a 404 page, an empty cart, a favicon. Both files are copied into
`theme/assets/`, so in Liquid they're `{{ 'kid-skier.svg' | asset_url }}`.
Style them with `.bsr-kid` or `.bsr-kid--sm`.

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
`theme/config/settings_data.json`, so native sections match the custom ones.

## Rebuilding

`mockup/index.html`, `shopify/sections/`, `theme/assets/retro.css` and the zip
are all generated. Edit `shopify/custom-css.css`, `src/mockup.html` or
`src/mockup.css`, then:

```
node build.js --zip
```

Sections for the layering route are sliced out of the mockup at
`@section <slug> | <title>` comments, so the mockup and what you paste into
Shopify can't drift apart.
