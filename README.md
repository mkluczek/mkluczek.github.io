# mkluczek.github.io

Personal site of **Marcin Kluczek** — Earth Observation scientist.
A single-page, space/satellite themed site built with Jekyll and hosted on
GitHub Pages.

## How to edit (no coding needed)

Almost everything lives in **`_data/`** as simple YAML files:

| File | What it controls |
|------|------------------|
| `_data/profile.yml`      | Name, role, tagline, intro, (hidden) stats, contact/profile links |
| `_data/research.yml`     | Homepage "Research" cards (title, icon, blurb) |
| `_data/publications.yml` | Publications list (homepage + CV) |
| `_data/experience.yml`   | Experience timeline (homepage + CV) |
| `_data/education.yml`    | Education timeline (homepage + CV) |
| `_data/projects.yml`     | Projects & grants (CV page) |
| `_data/talks.yml`        | Talks & conferences (CV page) |
| `_data/awards.yml`       | Awards & honours (CV page) |
| `_data/memberships.yml`  | Memberships & networks (CV page) |

- **Add a publication:** copy one entry in `_data/publications.yml`.
  Wrap your own name in `**M. Kluczek**` to bold it.
- **Add a research card:** copy a block in `_data/research.yml`. `icon:` can be
  `brain`, `search`, `pulse`, `database`, `cpu`, `bot`, `spectrum`, `layers`, `leaf`.
- **Change a link:** edit `_data/profile.yml`. Leave a value as `""` to hide it.
- **Change your photo:** replace `images/profile.png`.

## Add a blog post

Create a file in `_posts/` named `YYYY-MM-DD-some-title.md`:

```markdown
---
layout: post
title: "My post title"
date: 2026-08-01
tags: [GeoAI, Notes]
excerpt: "One line shown in the blog list."
---

Your post content in **Markdown**.
```

It appears automatically in the Blog section and gets its own page at
`/blog/some-title/`.

## Look & feel

- Theme + colors: `assets/css/main.css` (edit the `:root` variables at the top)
- Animations (starfield, filters, reveals): `assets/js/main.js`
- Page structure: `index.html` and `_layouts/default.html`

## Run locally

```bash
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```

Pushing to `master` publishes automatically via GitHub Pages.
