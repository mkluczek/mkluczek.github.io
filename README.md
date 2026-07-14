# mkluczek.github.io

Personal site of **Marcin Kluczek** — Earth Observation scientist.
A single-page, space/satellite themed site built with Jekyll and hosted on
GitHub Pages.

## How to edit (no coding needed)

Almost everything lives in **`_data/`** as simple YAML files:

| File | What it controls |
|------|------------------|
| `_data/profile.yml`      | Your name, role, tagline, intro, stats, and all contact/profile links |
| `_data/research.yml`     | The "Research" cards (title, icon, blurb) |
| `_data/publications.yml` | The "Publications" list. Copy a block to add a paper |

- **Add a publication:** open `_data/publications.yml`, copy one entry, change
  the fields. Wrap your own name in `**M. Kluczek**` to bold it.
- **Add a research card:** open `_data/research.yml`, copy a block.
  `icon:` can be `layers`, `leaf`, `spectrum`, or `brain`.
- **Change a link:** edit `_data/profile.yml`. Leave a value as `""` to hide it.
- **Change your photo:** replace `images/profile.png`.

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
