<div align="center">
  <img src="assets/icon.svg" width="104" height="104" alt="Jellyfin Theme Studio icon">
  <h1>Jellyfin Theme Studio</h1>
  <p><b>Design a Jellyfin theme in your browser, then paste the CSS into your server.</b></p>
  <p>
    <a href="LICENSE"><img alt="Licence: MIT" src="https://img.shields.io/badge/licence-MIT-9f57b8?style=flat-square"></a>
    <img alt="Runtime: vanilla JS, no build step" src="https://img.shields.io/badge/runtime-vanilla%20JS%2C%20no%20build%20step-029ad0?style=flat-square">
    <img alt="Jellyfin 10.8 - 10.11" src="https://img.shields.io/badge/Jellyfin-10.8%20%E2%80%93%2010.11-00a4dc?style=flat-square">
    <img alt="Unofficial project" src="https://img.shields.io/badge/status-unofficial-6b7280?style=flat-square">
  </p>
  <img src="assets/screenshot.jpg" alt="Jellyfin Theme Studio: theme controls on the left, a live Jellyfin preview on the right">
</div>

---

A visual theme designer for [Jellyfin](https://jellyfin.org). Adjust colours, layout, fonts and effects while a live Jellyfin preview updates next to you, then export one ready-to-paste stylesheet.

Supports both Jellyfin styling systems: the newer `--jf-palette-*` variables (10.11+) and the classic selectors (10.8–10.10) — in a single output file. No plugins or server access needed: **Dashboard → Branding → Custom CSS → paste → Save**.

**Try it live:** <https://stradios.github.io/Jellyfin-Theme-Studio/>

<p align="center">
  <img src="assets/font-picker.jpg" width="49%" alt="Font picker with search, filters, and live previews">
  <img src="assets/export-install.jpg" width="49%" alt="Export dialog's Install tab">
</p>

## Features

- **Live preview** — Home, Detail, Dialog and Login screens, on Desktop and Mobile frames, rendered with real Jellyfin class names in an isolated iframe.
- **Theme controls** — 12 presets plus a "Surprise me" randomiser; full palette editing (background, surfaces, header, text, accents, dividers); header/blur/glow/radius/shadow options; wallpaper support; typography controls (fonts, weights, scale, spacing); plus extras like themed scrollbars and a "now playing" bar.
- **Fonts** — 2,035 families (system fonts, Google Fonts, Fontshare, Velvetyne, League of Moveable Type), searchable with licence info and live previews. Only the weights you use get imported. Google fonts can be swapped to Bunny Fonts for privacy, or skipped entirely.
- **Export & sharing** — Copy or download the CSS, save named themes locally, generate a shareable permalink, and see live WCAG contrast ratings for every text/background pair.

## Quick start

Single static `index.html`, no build step or dependencies:

```bash
git clone https://github.com/Stradios/Jellyfin-Theme-Studio.git
cd Jellyfin-Theme-Studio
python3 -m http.server 8080     # or: npx serve .
# → http://localhost:8080/
```

Opening `index.html` directly from disk also works in most browsers, but a local server is more reliable for fonts and clipboard access.

### Deploy on GitHub Pages

1. Fork or push this repo to your own `main` branch.
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
3. Your site goes live at `https://<your-user>.github.io/<your-repo>/`.

**Note:** `.nojekyll`, `.gitignore` and `.github/workflows/pages.yml` are dotfiles — some archive tools drop them. Add them manually if needed.

<details>
<summary>Optional: auto-rebuild with GitHub Actions</summary>

`.github/workflows/pages.yml` rebuilds the site from `perchance/` on every push. To use it, set **Pages → Source: GitHub Actions**. Otherwise delete `.github/`.

Since the workflow regenerates `index.html` from `perchance/`, run `node build.mjs` before committing to keep the two in sync.
</details>

### Apply the theme in Jellyfin

1. In the studio, click **Get CSS** and copy (or download) the stylesheet.
2. In Jellyfin: **Dashboard → Branding → Custom CSS → paste → Save** (or **Settings → Display → Custom CSS** for just your account).
3. Hard-refresh the web client. Note: mobile apps and TV clients ignore custom CSS.
4. Reload again after future edits — Jellyfin caches the stylesheet.

## Repository layout

```
index.html              the built site (generated — do not hand-edit)
build.mjs               rebuilds index.html from perchance/
build-site.mjs          the transform used by build.mjs
perchance/
  index.html            the actual source: markup + app logic
  main.pjs               generator metadata (title, description, social image)
assets/                 icon and README screenshots
.github/workflows/
  pages.yml             optional auto-deploy on push
```

`perchance/index.html` is the source of truth. Run `node build.mjs` to regenerate `index.html` after editing it.

```bash
node build.mjs                       # reads perchance/, writes ./index.html
node build.mjs perchance _site       # custom source/output paths
```

If the logo changes in `perchance/index.html` without updating `assets/icon.svg`, the build fails with an error instead of shipping a stale favicon.

## How it works

- **One HTML file, vanilla JS** — no framework, bundler or runtime dependencies.
- **One `buildCss(o)` function** powers both the live preview and the exported CSS, so what you see is what you get.
- **A real mock, not an image** — the preview iframe uses actual Jellyfin Web class names (`.cardBox`, `.emby-button`, etc.) so theme rules behave as they will in production.
- **Contrast checking is local** — WCAG ratios computed in-page, no external library.
- **Sharing is stateless** — the theme is JSON, base64-encoded into the URL hash. No backend, no accounts.

## Privacy

100% client-side: no analytics, cookies, accounts or server component. Saved themes live only in your browser's `localStorage`. The app only contacts the network for font files you select and any wallpaper image you configure — your server and library data never leave the page.

## Browser support

Any current Chromium, Firefox or Safari, desktop or mobile. Uses `document.write`, `ResizeObserver` and CSS custom properties — no service worker or special headers required.

## Roadmap

- More preview screens (library grid, admin dashboard, music player, live TV)
- Theme JSON export/import, with a QR code for share links
- Per-element override inspector
- Skin Manager plugin-style JSON export
- Side-by-side theme comparison

Issues and PRs welcome, especially preset contributions and selector fixes for other Jellyfin versions.

## Contributing

1. Fork and edit `perchance/index.html` (the source of truth).
2. Update `assets/icon.svg` if you change the logo.
3. Run `node build.mjs` to regenerate `index.html`.
4. Open a PR with a description and screenshots for visual changes.

## Licence & trademark

MIT Licence — see [LICENSE](LICENSE). Replace the copyright holder if you fork this.

Unofficial, community project — not affiliated with or endorsed by Jellyfin. The icon is an original design, not the official Jellyfin logo.

Fonts are not redistributed; the app links to Google Fonts, Fontshare and jsDelivr under their own licences. The exported CSS credits every font family used.

## Credits

[Jellyfin](https://jellyfin.org), [Google Fonts](https://fonts.google.com), [Fontshare](https://fontshare.com), [Velvetyne](https://velvetyne.fr), [The League of Moveable Type](https://www.theleagueofmoveabletype.com), [Bunny Fonts](https://fonts.bunny.net), and the communities behind Nord, Dracula, Gruvbox, Catppuccin and other preset palettes.