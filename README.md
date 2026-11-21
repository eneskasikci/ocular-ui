# Ocular site

Marketing site for **Ocular**, a film-recipe RAW camera for iPhone and iPad. Features an interactive 7-step camera experience—from a continuous photo gallery hero and full-bleed iPhone 18 Pro Max entrance to a live viewfinder simulator with **Free / Pro HUD layout switching**, 12 film simulations, hardware capture workbench, RAW darkroom comparison wipe, Free & Pro tier breakdown, and on-device privacy—plus dedicated `/privacy` and `/support` pages.

## Stack

- **Framework:** Vite 8, React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with Ocular `@theme` tokens and self-hosted fonts (Archivo and Space Grotesk, SIL OFL 1.1)
- **UI Primitives:** [Radix UI](https://www.radix-ui.com) (`radix-ui` — `Tabs`, `ToggleGroup`, `Toggle`, `Slider`, `Dialog`, `Accordion`)
- **Animation:** [Motion](https://motion.dev) (`motion/react` with `LazyMotion` and `domMax`)
- **Linting:** Oxlint
- **Hosting:** Cloudflare Pages

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
npm run build    # type-check + production build into dist/
npm run preview  # serve dist/ locally
```

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Build output directory: `dist`
- No environment variables or secrets.

`public/` is copied as is (`privacy/`, `support/`, `404.html`, `_headers`, `fonts/`, icons, and metadata files), while `/privacy` and `/support` are also served in-app via the client router.

## App Store link

Single source of truth: `APP_STORE_URL` in `src/config.ts` (replace the placeholder `TODO` once the production App Store ID is live).

## Structure

```text
src/
  config.ts                 App Store URL, support/legal constants, 7-scene list
  data/
    gradients.ts            onboarding backdrop gradients (Silk, Prism, Crescent, Horizon, Meridian)
    photos.ts               sample photographs and framing metadata
    recipes.ts              film recipes, optical filters, lenses, DR, ratios, grain
  hooks/
    useActiveScene.ts       IntersectionObserver scene tracker for mobile/static flow
    useCameraState.ts       camera simulator state and actions (CameraController)
    useDesktopDeckNav.ts    1-step desktop wheel momentum absorber and keyboard navigation
  context/                  lightweight client router for /, /privacy, and /support
  components/
    phone/                  CameraPhone, ViewfinderCanvas, PortraitDeck, ShutterDeck, QuickMenuDialog
    panels/                 RecipesPanel, CapturePanel, RawPanel, shared Radix RangeSlider & SegmentedControl
    scenes/                 CameraExperience, DesktopDeck, StaticCameraFlow, SimControls, Tiers, Privacy
    pages/                  SubpageLayout, PrivacyPage, SupportPage (Radix Accordion FAQs)
    Backdrop.tsx            crossfading full-bleed onboarding gradient canvas + film grain
    Header.tsx              brand lockup, top-center Get the app CTA, and scene counter
    HeroSlideshow.tsx       full-viewport drifting photo gallery hero
    Footer.tsx              site footer and legal/support navigation
  styles/
    fonts.css               @font-face declarations and metric-matched fallbacks
    app.css                 Tailwind CSS v4 @theme tokens, base layer, keyframes, and grain textures
public/                     static /privacy and /support HTML, fonts, icons, _headers, robots, sitemap
```

## Design notes

1. **Onboarding gradients:** Five full-bleed app backdrops (`Silk`, `Prism`, `Crescent`, `Horizon`, `Meridian`) crossfade across steps beneath a subtle SVG film-grain overlay.
2. **Typography:** Matches the iOS app—`Archivo Expanded` for the `OCULAR` wordmark, `Archivo SemiExpanded` for display headings, `Space Grotesk` for body copy, and system monospace for camera telemetry.
3. **One-job color palette:** Obsidian (`#111215`) and Graphite (`#262930`) surfaces, Silver Halide (`#f3f1ec`) ink, Burgundy (`#7a1c2e`) brand accents, Amber (`#e8832a`) for active/touched controls and primary CTAs, and Emerald (`#24a876`) for granted/on-device states.
4. **Interactive iPhone 18 Pro Max simulator:** Supports toggling between **Pro HUD** (`F1 DR`, `F2 TONE`, `F3 GRN`, `F4 HAL`, `Q`, 4-cell Exposure Capsule, `RAW` darkroom split) and **Free HUD** (`± Exposure`, `Q Film`, `✦ Pro`, collapsible Exposure Capsule, `RANGE` guides), with a rotating knurled film dial and non-modal Radix `Dialog` Q-Menu.
5. **7-step desktop deck & responsive mobile flow:** Desktop (`>= 900px`) uses a 1-step hard-detent stationary stage so trackpad momentum never skips chapters; mobile, tablet, and `prefers-reduced-motion` fall back to a natural vertical flow with inline viewfinder monitors.
6. **Accessibility & motion preferences:** Transform and opacity animations only; respects `prefers-reduced-motion` and falls back to opaque Graphite surfaces under `prefers-reduced-transparency`.

## Licence

Not chosen yet. Self-hosted fonts retain their SIL OFL 1.1 licence.
