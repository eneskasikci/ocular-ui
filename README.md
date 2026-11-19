# Ocular site

Marketing site for **Ocular**, a film-recipe RAW camera for iPhone and iPad. One scroll-driven page in six scenes, plus static Privacy and Support pages.

## Stack

- Vite 8, React 19, TypeScript (strict), [Motion](https://motion.dev) (`motion/react`)
- Plain CSS, self-hosted fonts (Archivo and Space Grotesk, SIL OFL 1.1), no runtime CSS library
- Oxlint for linting
- Hosted on Cloudflare Pages

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # type-check + production build into dist/
npm run preview  # serve dist/ locally
```

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Build output directory: `dist`
- No environment variables or secrets.

`public/` is copied as is: `privacy/`, `support/`, `404.html`, `_headers`, fonts and icons. Privacy and Support stay static HTML on purpose (legal text is not part of the React app).

## App Store link

One constant: `APP_STORE_URL` in `src/config.ts`. It is a placeholder until the real App Store id is known (search for `TODO`).

## Structure

```
src/
  config.ts            App Store URL, site constants, scene list
  data/gradients.ts    backdrop gradients (base + blobs per phase)
  hooks/               active scene, CTA placement
  context/             CTA state shared by header and scenes
  components/          Backdrop, Header, Phone, GetItButton, ...
  components/scenes/   Hero, Story (capture, recipes, RAW), Tiers, Privacy
  styles/              fonts, base, backdrop, ui, phone
public/                static pages, fonts, icons, _headers
```

## Design rationale

1. The page borrows the app's onboarding language: five full-bleed gradients (Silk, Prism, Crescent, Horizon, Meridian) that crossfade as you scroll, under film grain.
2. Type matches the app: Archivo for the wordmark and titles, Space Grotesk for body, system mono for telemetry labels.
3. Colour roles are fixed: Burgundy is the brand, Amber is the touched control (the CTA), Emerald is a lock or granted state.
4. Six scenes, one idea each, native scroll only. Nothing hijacks the wheel.
5. A drawn phone shows the viewfinder, HUD and Q-menu. It is an illustration, never a screenshot.
6. The Get-it button is one shared element: it moves from the hero into a header pill and back out as the closing call to action.
7. Motion uses transform and opacity only, and is off under `prefers-reduced-motion`.
8. Copy text sits on feathered dark scrims so it stays AA over the brightest gradient crests.
9. Glass cards fall back to opaque Graphite under `prefers-reduced-transparency`.
10. Fonts are subset to Latin, preloaded for the two critical weights, and have metric-matched fallbacks.

## Licence

Not chosen yet. Fonts keep their SIL OFL 1.1 licence.
