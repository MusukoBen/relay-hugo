# Relay Marketing Assets

Multi-format social media assets for the Relay launch — Instagram, Twitter, LinkedIn, and Story formats.

## Structure

```
marketing/
├── templates/
│   ├── shared.css              # Design system (matches website)
│   ├── instagram/              # 9 posts · 1080×1350 (4:5 portrait)
│   │   ├── post-1.html         # Launch announcement
│   │   ├── post-2.html         # 3-Layer theme system
│   │   ├── post-3.html         # Glass themes
│   │   ├── post-4.html         # Retro themes (1971-1989)
│   │   ├── post-5.html         # Pane layouts
│   │   ├── post-6.html         # AI agent
│   │   ├── post-7.html         # Project memory
│   │   ├── post-8.html         # Pricing
│   │   └── post-9.html         # Download CTA
│   ├── twitter/                # 4 cards · 1200×675 (16:9)
│   │   ├── twitter-1-launch.html
│   │   ├── twitter-2-themes.html
│   │   ├── twitter-3-features.html
│   │   └── twitter-4-download.html
│   ├── linkedin/               # 4 posts · 1200×627
│   │   ├── linkedin-1-launch.html
│   │   ├── linkedin-2-architecture.html
│   │   ├── linkedin-3-pricing.html
│   │   └── linkedin-4-download.html
│   └── story/                  # 5 stories · 1080×1920 (9:16)
│       ├── story-1-launch.html
│       ├── story-2-themes.html
│       ├── story-3-features.html
│       ├── story-4-pricing.html
│       └── story-5-download.html
├── output/                     # Rendered PNGs (per format)
│   ├── instagram/
│   ├── twitter/
│   ├── linkedin/
│   └── story/
└── render.sh                   # Multi-format renderer
```

## Render

```bash
# Render everything (22 images)
./render.sh

# Render only specific formats
./render.sh instagram
./render.sh twitter linkedin
```

The script uses Chrome Headless to capture each template at the correct dimensions:

| Format    | Size      | Aspect | Purpose                      |
|-----------|-----------|--------|------------------------------|
| Instagram | 1080×1350 | 4:5    | Feed posts (carousel)        |
| Twitter   | 1200×675  | 16:9   | Twitter card / X card        |
| LinkedIn  | 1200×627  | ~16:9  | LinkedIn post image          |
| Story     | 1080×1920 | 9:16   | IG/FB Story · Reel cover     |

## Preview

Open any template directly in your browser:

```bash
open templates/instagram/post-1.html
open templates/twitter/twitter-1-launch.html
open templates/story/story-1-launch.html
```

## Customize

All templates use the same design tokens defined in `templates/shared.css`. Edit the `:root` variables to change colors, fonts, or layout — changes propagate to all formats.

The format-specific layout adjustments live under `.post--instagram`, `.post--twitter`, `.post--linkedin`, `.post--story` selectors at the bottom of `shared.css`.

## Posting Strategy

### Instagram (Feed Carousel)
9-post launch carousel — one post per week over ~3 weeks.

### Twitter
4 standalone cards — for the launch announcement, theme showcase, feature highlight, and download CTA.

### LinkedIn
4 professional posts — emphasizing architecture, design system, and developer focus.

### Stories
5-frame story sequence — for Instagram Stories and Reels covers.
