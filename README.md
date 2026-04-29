# Relay Website

Marketing website for [Relay](https://relay-app.dev) — a macOS terminal emulator built with Swift/SwiftUI.

Built with [Hugo](https://gohugo.io/). Deployed to Checkdomain via GitHub Actions.

## Quick Start

```bash
# Install Hugo (macOS)
brew install hugo

# Dev server
hugo server

# Build
hugo --minify
```

The site runs at `http://localhost:1313/`.

## Project Structure

```
relay_hugo/
├── content/                 # Page content (minimal, mostly frontmatter)
│   ├── _index.md            # Homepage (DE)
│   ├── _index.en.md         # Homepage (EN)
│   ├── features/
│   ├── themes/
│   ├── pricing/
│   ├── download/
│   ├── docs/
│   ├── changelog/
│   ├── privacy/
│   ├── agb/
│   └── impressum/
├── layouts/                 # Hugo templates
│   ├── index.html           # Homepage with terminal preview
│   ├── _default/
│   │   ├── baseof.html      # Base template (html, head, body)
│   │   └── list.html        # Generic list template
│   ├── partials/
│   │   ├── head.html        # <head> (meta, OG, fonts, CSS)
│   │   ├── nav.html         # Navigation + language/theme toggle
│   │   └── footer.html      # Footer
│   ├── features/
│   ├── themes/
│   ├── pricing/
│   ├── download/
│   ├── docs/
│   └── changelog/
├── static/
│   ├── css/style.css        # Main stylesheet (~3100 lines)
│   ├── js/main.js           # Nav scroll, theme toggle, copy, pricing
│   ├── favicon/             # Favicons (SVG, PNG, ICO, webmanifest)
│   ├── .htaccess            # Apache config (HTTPS, caching, gzip)
│   └── .well-known/         # ACME challenge for SSL validation
├── i18n/
│   ├── de.yaml              # German translations (~470 keys)
│   └── en.yaml              # English translations (~470 keys)
├── marketing/               # Social media assets
│   ├── templates/           # HTML templates per format
│   │   ├── shared.css       # Design system for all formats
│   │   ├── instagram/       # 9 posts  · 1080×1350
│   │   ├── twitter/         # 4 cards  · 1200×675
│   │   ├── linkedin/        # 4 posts  · 1200×627
│   │   ├── story/           # 5 stories · 1080×1920
│   │   └── lemon/           # LemonSqueezy gallery · 1600×1200
│   ├── output/              # Rendered PNGs (gitignored)
│   └── render.sh            # Chrome headless renderer
├── hugo.toml                # Hugo config (multilingual, menus)
└── .github/workflows/
    └── deploy.yml           # CI/CD: build + rsync to Checkdomain
```

## Multilingual

The site is bilingual (German + English). German is the default language at `/`, English lives at `/en/`.

All translatable strings are in `i18n/de.yaml` and `i18n/en.yaml`. Templates use `{{ i18n "key" }}` for all visible text.

The language switcher (DE | EN) is in the navigation bar.

## Themes

The site supports light and dark mode. The toggle is in the nav bar (sun/moon icon). The user's preference is persisted in `localStorage`.

The terminal preview on the homepage always stays dark regardless of theme.

## Deployment

Automatic on every push to `main` via GitHub Actions:

1. Hugo builds with `--minify` and `--baseURL "https://relay-app.dev/"`
2. `rsync` deploys to Checkdomain over SSH

**GitHub Secrets required:**
- `SFTP_USER` — SSH username
- `SFTP_PASSWORD` — SSH password
- `SFTP_SERVER_DIR` — Remote path (e.g. `/relay-app.dev/`)

## Marketing Assets

```bash
cd marketing

# Render all formats (22 images)
./render.sh

# Render specific format
./render.sh instagram
./render.sh twitter linkedin
```

Requires Google Chrome installed. Uses Chrome headless to screenshot HTML templates at the correct dimensions.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, terminal preview, features, retro, pricing, download |
| Features | `/features/` | Deep-dive: themes, layouts, prompts (interactive demos) |
| Themes | `/themes/` | Interactive theme picker with 16 themes |
| Pricing | `/pricing/` | Plans, FAQ, guarantee |
| Download | `/download/` | DMG, Homebrew, system requirements, changelog |
| Docs | `/docs/` | Full documentation with sidebar TOC |
| Changelog | `/changelog/` | Version history |
| Privacy | `/privacy/` | Privacy policy |
| AGB | `/agb/` | Terms of service |
| Impressum | `/impressum/` | Legal notice |
