# Bazaar — Hugo Variant

You are building the **Hugo** variant of the Bazaar fashion ecommerce theme. This is a fully static site using Hugo's Go template system with Tailwind CSS v4 via PostCSS. No JS framework. The visual output and functionality must exactly match the Astro base theme.

**Canonical specification:** Follow `C:\Dev\Themes\bazaar\CLAUDE.md` for the complete list of pages (34), components (49), data schemas, design system, utilities, and quality requirements.

**General quality standards:** Follow `C:\Dev\Themes\CLAUDE.md` for responsive design, SEO, accessibility, performance, and deliverable requirements.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Hugo (latest, v0.140+) |
| Templates | Go templates (Hugo's built-in) |
| Styling | Tailwind CSS v4 via PostCSS |
| Typography | `@tailwindcss/typography` |
| Fonts | Self-hosted via `@font-face` in CSS |
| Images | Hugo's built-in `resources.Get` + standard `<img>` tags |
| Content | Hugo content sections (markdown) for blog |
| Data | Hugo `data/` directory (JSON files) |
| Meta tags | Hugo built-in SEO via `layouts/_default/baseof.html` |
| Interactivity | Vanilla JS (same utility pattern as Astro base) |
| Build pipeline | Hugo Pipes for CSS processing |

---

## Dependencies

```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@tailwindcss/typography": "^0.5.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

Hugo itself is a single binary — install it separately:
```bash
# Windows (via Scoop)
scoop install hugo-extended
# Or via npm:
npm install -g hugo-extended
```

---

## Scaffolding Commands

```bash
# In C:\Dev\Themes\bazaar\bazaar-hugo\
hugo new site . --force
npm init -y
npm install -D tailwindcss @tailwindcss/postcss @tailwindcss/typography postcss autoprefixer

# Copy assets from base theme
cp -r ../bazaar-astro/public/fonts ./static/fonts/
cp -r ../bazaar-astro/public/images ./static/images/
cp    ../bazaar-astro/public/favicon.svg ./static/
cp    ../bazaar-astro/public/og-image.svg ./static/
cp    ../bazaar-astro/public/robots.txt ./static/

# Copy data files (Hugo uses data/ directory)
cp ../bazaar-astro/src/data/products.json ./data/
cp ../bazaar-astro/src/data/categories.json ./data/
cp ../bazaar-astro/src/data/testimonials.json ./data/
cp ../bazaar-astro/src/data/faq.json ./data/
cp ../bazaar-astro/src/data/team.json ./data/
cp ../bazaar-astro/src/data/careers.json ./data/
cp ../bazaar-astro/src/data/features.json ./data/
cp ../bazaar-astro/src/data/lookbook.json ./data/
cp ../bazaar-astro/src/data/press.json ./data/
cp ../bazaar-astro/src/data/stores.json ./data/
cp ../bazaar-astro/src/data/size-guide.json ./data/
cp ../bazaar-astro/src/data/navigation.json ./data/
cp ../bazaar-astro/src/data/site-config.json ./data/
mkdir -p data/translations
cp ../bazaar-astro/src/data/translations/*.json ./data/translations/

# Copy blog posts to Hugo content section
mkdir -p content/blog
cp ../bazaar-astro/src/content/blog/*.md ./content/blog/
```

---

## Project Configuration

### `hugo.toml`
```toml
baseURL = "https://bazaar-studio.com"
languageCode = "en-us"
title = "Bazaar Studio"
theme = ""          # no theme, all layouts in /layouts

[params]
  tagline = "Your Style, Your Story"
  description = "Premium fashion & lifestyle ecommerce store"
  currencySymbol = "$"
  freeShippingThreshold = 99

[build]
  writeStats = true

[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML"]
  taxonomy = ["HTML"]
  term = ["HTML"]

[minify]
  minifyOutput = true

[sitemap]
  changeFreq = "monthly"
  priority = 0.5
```

### `postcss.config.js`
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### `assets/css/globals.css`
Copy the full `global.css` from the Astro base theme. This file is processed by Hugo Pipes + PostCSS + Tailwind.

---

## Hugo Directory Structure

Hugo has a specific directory structure that maps to functions:

```
bazaar-hugo/
├── archetypes/         # Content templates
├── assets/
│   ├── css/
│   │   └── globals.css   ← Tailwind entry point
│   └── js/
│       ├── cart.js
│       ├── wishlist.js
│       ├── compare.js
│       ├── recently-viewed.js
│       ├── theme.js
│       ├── filters.js
│       └── i18n.js
├── content/
│   ├── _index.md         ← Home page content/params
│   ├── shop/             ← Shop section
│   │   └── _index.md
│   ├── blog/             ← Blog section (6 .md posts)
│   │   ├── _index.md
│   │   └── *.md
│   ├── categories/
│   ├── cart/
│   │   └── _index.md
│   └── ... (one _index.md per page)
├── data/                 ← JSON data files
│   ├── products.json
│   ├── categories.json
│   ├── testimonials.json
│   ├── navigation.json
│   ├── site-config.json
│   └── ... (all data files)
├── layouts/
│   ├── _default/
│   │   ├── baseof.html   ← Base template (BaseLayout equivalent)
│   │   ├── single.html   ← Single page template
│   │   └── list.html     ← List/section template
│   ├── partials/         ← Reusable partial templates (components)
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── announcement-bar.html
│   │   ├── mega-menu.html
│   │   ├── mobile-menu.html
│   │   ├── theme-toggle.html
│   │   ├── hero.html
│   │   ├── hero-alt.html
│   │   ├── product-card.html
│   │   ├── product-gallery.html
│   │   ├── product-info.html
│   │   ├── variant-picker.html
│   │   ├── quantity-selector.html
│   │   ├── price-display.html
│   │   ├── star-rating.html
│   │   ├── sale-badge.html
│   │   ├── cart-drawer.html
│   │   ├── cart-item-row.html
│   │   ├── order-summary.html
│   │   ├── checkout-steps.html
│   │   ├── checkout-form.html
│   │   ├── checkout-multi-step.html
│   │   ├── filter-sidebar.html
│   │   ├── sort-dropdown.html
│   │   ├── category-card.html
│   │   ├── search-bar.html
│   │   ├── featured-collection.html
│   │   ├── promo-banner.html
│   │   ├── sale-banner.html
│   │   ├── testimonials.html
│   │   ├── newsletter-signup.html
│   │   ├── newsletter-popup.html
│   │   ├── instagram-grid.html
│   │   ├── blog-card.html
│   │   ├── blog-sidebar.html
│   │   ├── team-card.html
│   │   ├── breadcrumbs.html
│   │   ├── pagination.html
│   │   ├── back-to-top.html
│   │   ├── mobile-bottom-nav.html
│   │   ├── quick-view.html
│   │   ├── share-buttons.html
│   │   ├── promo-code-input.html
│   │   ├── product-accordion.html
│   │   ├── related-products.html
│   │   ├── product-reviews.html
│   │   ├── sticky-add-to-cart.html
│   │   ├── frequently-bought-together.html
│   │   ├── seo-head.html
│   │   └── category-strip.html
│   ├── index.html        ← Home page layout
│   ├── shop/
│   │   ├── list.html
│   │   └── single.html   ← Product detail page
│   ├── blog/
│   │   ├── list.html
│   │   └── single.html
│   ├── 404.html
│   └── shortcodes/
├── static/               ← Static files (fonts, images, favicon)
│   ├── fonts/
│   ├── images/
│   └── favicon.svg
├── hugo.toml
├── postcss.config.js
├── package.json
├── .gitignore
├── README.md
├── LICENSE
└── theme.json
```

---

## Base Template (`layouts/_default/baseof.html`)

This is Hugo's equivalent of Astro's `BaseLayout.astro`:

```html
<!doctype html>
<html lang="en" dir="ltr" id="html-root">
  <head>
    {{ partial "seo-head.html" . }}
    {{ $css := resources.Get "css/globals.css" | css.PostCSS }}
    {{ if hugo.IsProduction }}
      {{ $css = $css | minify | fingerprint }}
    {{ end }}
    <link rel="stylesheet" href="{{ $css.RelPermalink }}" />
    <script>
      (function() {
        try {
          var theme = localStorage.getItem('bazaar-theme') || 'light';
          var locale = localStorage.getItem('bazaar-locale') || 'en';
          var dir = locale === 'ar' ? 'rtl' : 'ltr';
          if (theme === 'dark') document.documentElement.classList.add('dark');
          document.documentElement.lang = locale;
          document.documentElement.dir = dir;
        } catch(e) {}
      })();
    </script>
  </head>
  <body class="bg-white text-surface-900 dark:bg-surface-950 dark:text-surface-100">
    <a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>
    {{ partial "announcement-bar.html" . }}
    {{ partial "header.html" . }}
    <main id="main-content">
      {{ block "main" . }}{{ end }}
    </main>
    {{ partial "footer.html" . }}
    {{ partial "mobile-menu.html" . }}
    {{ partial "cart-drawer.html" . }}
    {{ partial "quick-view.html" . }}
    {{ partial "back-to-top.html" . }}
    {{ partial "newsletter-popup.html" . }}
    {{ partial "mobile-bottom-nav.html" . }}
    {{ partial "scripts.html" . }}
  </body>
</html>
```

### Partial: `layouts/partials/scripts.html`
Bundle all vanilla JS via Hugo Pipes:
```html
{{ $cart := resources.Get "js/cart.js" }}
{{ $wishlist := resources.Get "js/wishlist.js" }}
{{ $compare := resources.Get "js/compare.js" }}
{{ $theme := resources.Get "js/theme.js" }}
{{ $recentlyViewed := resources.Get "js/recently-viewed.js" }}
{{ $filters := resources.Get "js/filters.js" }}
{{ $i18n := resources.Get "js/i18n.js" }}
{{ $main := resources.Get "js/main.js" }}
{{ $bundle := slice $cart $wishlist $compare $theme $recentlyViewed $filters $i18n $main | resources.Concat "js/bundle.js" }}
{{ if hugo.IsProduction }}
  {{ $bundle = $bundle | minify | fingerprint }}
{{ end }}
<script src="{{ $bundle.RelPermalink }}" defer></script>
```

---

## Partials (Components)

Hugo partials replace Astro components. They receive the page context (`.`) and optionally a dict of custom parameters:

```html
<!-- layouts/partials/product-card.html -->
{{ $product := .product }}
{{ $placeholderColor := default "#fda4af" .placeholderColor }}
<article
  class="card group"
  data-category="{{ $product.category }}"
  data-price="{{ $product.price }}"
  data-new="{{ $product.isNew }}"
  data-sale="{{ $product.isSale }}"
>
  <div class="relative overflow-hidden rounded-t-2xl aspect-[3/4]">
    <img
      src="/images/products/{{ $product.slug }}.jpg"
      alt="{{ $product.title }}"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      width="600"
      height="800"
    />
    {{- if $product.isSale -}}
      {{ partial "sale-badge.html" (dict "discount" (sub 100 (int (div (mul $product.salePrice 100.0) $product.price)))) }}
    {{- end -}}
  </div>
  <div class="p-4">
    <a href="/shop/{{ $product.slug }}/" class="font-heading font-semibold hover:text-primary-600">
      {{ $product.title }}
    </a>
    {{ partial "star-rating.html" (dict "rating" $product.rating "reviewCount" $product.reviewCount) }}
    {{ partial "price-display.html" (dict "price" $product.price "salePrice" $product.salePrice) }}
  </div>
</article>
```

Call a partial with a dict:
```html
{{ partial "product-card.html" (dict "product" $product) }}
```

---

## Data Access

Hugo loads all files from `data/` automatically. Access in templates:

```html
<!-- Access products.json -->
{{ range .Site.Data.products }}
  {{ partial "product-card.html" (dict "product" .) }}
{{ end }}

<!-- Access site config -->
{{ .Site.Data.site_config.name }}

<!-- Filter products -->
{{ $featured := where .Site.Data.products "isFeatured" true }}
{{ range first 4 $featured }}
  {{ partial "product-card.html" (dict "product" .) }}
{{ end }}

<!-- Filter by category -->
{{ $women := where .Site.Data.products "category" "tops" }}
```

**Note:** Hugo converts hyphens in JSON filenames to underscores: `site-config.json` becomes `.Site.Data.site_config`.

---

## Page Layouts

Each static page needs both a content file and a layout:

### Content file (`content/shop/_index.md`)
```yaml
---
title: "Shop All"
description: "Browse our full collection of premium fashion."
---
```

### Layout file (`layouts/shop/list.html`)
```html
{{ define "main" }}
  {{ partial "hero-alt.html" (dict "title" .Title "subtitle" .Description "badge" "Shop") }}
  <section class="section">
    <div class="container-custom">
      <div class="flex gap-8">
        {{ partial "filter-sidebar.html" . }}
        <div class="flex-1">
          {{ partial "shop-toolbar.html" (dict "count" (len .Site.Data.products)) }}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="product-grid">
            {{ range .Site.Data.products }}
              {{ partial "product-card.html" (dict "product" .) }}
            {{ end }}
          </div>
        </div>
      </div>
    </div>
  </section>
{{ end }}
```

---

## Dynamic Routes (Products, Categories)

Hugo generates pages from content sections. For product detail pages, create individual markdown files for each product OR generate them from data using Hugo's `cascade` and `_index.md`.

**Approach: Data-driven page generation via content files**

Create a script to generate content files from `data/products.json`:

```bash
# scripts/generate-product-pages.sh
#!/bin/bash
node -e "
const products = require('./data/products.json');
const fs = require('fs');
fs.mkdirSync('./content/shop', { recursive: true });
products.forEach(p => {
  fs.writeFileSync('./content/shop/' + p.slug + '.md',
    '---\ntitle: \"' + p.title + '\"\nslug: \"' + p.slug + '\"\ndraft: false\n---\n'
  );
});
"
```

Or add stub markdown files manually for each of the 20 products and 6 categories — with minimal frontmatter, and let the layout pull data from `.Site.Data.products`.

**Product layout (`layouts/shop/single.html`):**
```html
{{ define "main" }}
  {{ $slug := .Params.slug | default .File.ContentBaseName }}
  {{ $product := index (where .Site.Data.products "slug" $slug) 0 }}
  {{ if not $product }}
    {{ partial "404-content.html" . }}
  {{ else }}
    {{ partial "breadcrumbs.html" (dict "items" (slice
      (dict "label" "Shop" "href" "/shop/")
      (dict "label" $product.category "href" (printf "/categories/%s/" $product.category))
      (dict "label" $product.title)
    )) }}
    <section class="section">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {{ partial "product-gallery.html" (dict "product" $product) }}
          {{ partial "product-info.html" (dict "product" $product) }}
        </div>
      </div>
    </section>
    {{ partial "related-products.html" (dict "products" (first 4 (where .Site.Data.products "category" $product.category))) }}
  {{ end }}
{{ end }}
```

---

## Blog

Blog posts are Hugo content files in `content/blog/`. Each post's frontmatter maps to the schema in the parent spec.

Hugo automatically creates list pages (`/blog/`) and single pages (`/blog/post-slug/`) from content files.

### Blog list layout (`layouts/blog/list.html`)
```html
{{ define "main" }}
  {{ partial "hero-alt.html" (dict "title" "The Edit" "badge" "Blog") }}
  <section class="section">
    <div class="container-custom">
      {{ $featured := index .Pages 0 }}
      {{ partial "blog-featured.html" (dict "post" $featured) }}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {{ range after 1 .Pages }}
            {{ partial "blog-card.html" . }}
          {{ end }}
        </div>
        {{ partial "blog-sidebar.html" (dict "posts" .Pages) }}
      </div>
    </div>
  </section>
{{ end }}
```

### Blog single layout (`layouts/blog/single.html`)
```html
{{ define "main" }}
  {{ partial "breadcrumbs.html" (dict "items" (slice
    (dict "label" "Blog" "href" "/blog/")
    (dict "label" .Title)
  )) }}
  <article class="section">
    <div class="container-custom max-w-3xl">
      <div class="prose dark:prose-invert max-w-none">
        {{ .Content }}
      </div>
    </div>
  </article>
  {{ partial "related-posts.html" (dict "currentPage" . "allPages" .Site.RegularPages) }}
{{ end }}
```

---

## Vanilla JavaScript

All interactivity uses vanilla JS files in `assets/js/`. These are the same utility functions as the Astro base theme but in plain `.js` without TypeScript and without `astro:page-load` references.

Since Hugo is fully static (no client navigation), `DOMContentLoaded` replaces `astro:page-load`:

```javascript
// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initMobileMenu();
  initCartDrawer();
  initQuickView();
  initSearchBar();
  initAnnouncementBar();
  initFaqAccordions();
  initCountdownTimers();
  initBackToTop();
  initNewsletterPopup();
  updateAllBadges();
});
```

Since Hugo has no client-side routing (every navigation is a full page load), `DOMContentLoaded` fires on every page — no need for the `astro:page-load` event pattern.

---

## SEO Partial (`layouts/partials/seo-head.html`)

```html
{{ $title := printf "%s | %s" .Title .Site.Title }}
{{ $description := .Description | default .Site.Params.description }}
{{ $image := .Params.image | default "/og-image.svg" }}

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="canonical" href="{{ .Permalink }}" />

<meta property="og:title" content="{{ $title }}" />
<meta property="og:description" content="{{ $description }}" />
<meta property="og:image" content="{{ $image | absURL }}" />
<meta property="og:url" content="{{ .Permalink }}" />
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ $title }}" />
<meta name="twitter:description" content="{{ $description }}" />
<meta name="twitter:image" content="{{ $image | absURL }}" />

{{ if .Params.noindex }}<meta name="robots" content="noindex, nofollow" />{{ end }}

{{ if hugo.IsProduction }}
  {{ with .OutputFormats.Get "RSS" }}<link rel="{{ .Rel }}" type="{{ .MediaType.Type }}" href="{{ .Permalink }}" title="{{ $.Site.Title }}" />{{ end }}
{{ end }}
```

---

## Coming Soon Page

The Coming Soon page needs no header/footer. In Hugo, create a specific layout:

```html
<!-- layouts/coming-soon/single.html -->
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    {{ partial "seo-head.html" . }}
    {{ $css := resources.Get "css/globals.css" | css.PostCSS }}
    <link rel="stylesheet" href="{{ $css.RelPermalink }}" />
    <meta name="robots" content="noindex, nofollow" />
  </head>
  <body class="bg-surface-950 text-white min-h-screen">
    <!-- Coming soon content directly -->
    {{ .Content }}
  </body>
</html>
```

---

## File Structure

```
bazaar-hugo/
├── archetypes/
│   └── default.md
├── assets/
│   ├── css/
│   │   └── globals.css
│   └── js/
│       ├── cart.js
│       ├── wishlist.js
│       ├── compare.js
│       ├── recently-viewed.js
│       ├── theme.js
│       ├── filters.js
│       ├── i18n.js
│       └── main.js
├── content/
│   ├── _index.md
│   ├── shop/
│   │   ├── _index.md
│   │   └── [20 product stub .md files]
│   ├── blog/
│   │   ├── _index.md
│   │   └── [6 blog post .md files]
│   ├── categories/
│   │   ├── _index.md
│   │   └── [6 category stub .md files]
│   ├── coming-soon/
│   │   └── _index.md
│   └── [one _index.md per each of the 34 pages]
├── data/
│   ├── products.json
│   ├── categories.json
│   ├── testimonials.json
│   ├── reviews.json
│   ├── faq.json
│   ├── team.json
│   ├── careers.json
│   ├── features.json
│   ├── lookbook.json
│   ├── press.json
│   ├── stores.json
│   ├── site-guide.json    (size-guide — hyphen becomes underscore)
│   ├── navigation.json
│   ├── site-config.json
│   └── translations/
│       ├── en.json
│       ├── fr.json
│       └── ar.json
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── single.html
│   │   └── list.html
│   ├── partials/
│   │   └── [49 partial .html files]
│   ├── index.html
│   ├── shop/
│   │   ├── list.html
│   │   └── single.html
│   ├── blog/
│   │   ├── list.html
│   │   └── single.html
│   ├── categories/
│   │   ├── list.html
│   │   └── single.html
│   ├── coming-soon/
│   │   └── single.html
│   └── 404.html
├── static/
│   ├── fonts/
│   ├── images/
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   └── generate-content.js
├── hugo.toml
├── postcss.config.js
├── package.json
├── .gitignore
├── README.md
├── LICENSE
└── theme.json
```

---

## Astro → Hugo Concept Mapping

| Astro concept | Hugo equivalent |
|---------------|----------------|
| `.astro` component | `layouts/partials/*.html` |
| `---` frontmatter | Hugo page front matter (YAML/TOML) |
| `Astro.props` | Template variable (`.` context or dict) |
| `<slot />` | `{{ block "main" . }}{{ end }}` |
| `<style>` | Tailwind classes (no scoped CSS in Hugo) |
| `<script>` block | External JS files in `assets/js/` |
| `astro:page-load` | `DOMContentLoaded` (full page load on every navigation) |
| Content Collections | Hugo content sections (`content/blog/`) |
| `getCollection()` | `where .Site.RegularPages "Section" "blog"` |
| `render()` | `{{ .Content }}` in single layout |
| `<ClientRouter />` | No equivalent — Hugo is MPA, full page loads |
| `Astro.url.pathname` | `.Permalink` or `.RelPermalink` |
| `<Image />` | `<img>` with Hugo `resources.Get` |
| `import.meta.env.SITE` | `.Site.BaseURL` |
| `getStaticPaths` | Content files in `content/` sections |
| JSON data import | `.Site.Data.products` |
| Component props | Dict passed to `partial`: `(dict "key" value)` |
| Conditional rendering | `{{ if ... }}...{{ end }}` |
| Loops | `{{ range ... }}...{{ end }}` |
| String formatting | `{{ printf "%d items" (len .items) }}` |

---

## Critical Implementation Notes

1. **Hugo data hyphen-to-underscore** — `data/site-config.json` is accessed as `.Site.Data.site_config`. Plan file names accordingly: `size-guide.json` → `.Site.Data.size_guide`.

2. **No component logic** — Hugo partials are pure templates. All dynamic behavior (cart, filters, modals) must be in vanilla JS files. Partials only render static HTML.

3. **`resources.Get` path** — Files in `assets/` are accessed via `resources.Get "css/globals.css"`. This path is relative to the `assets/` directory.

4. **Hugo Pipes for CSS** — `resources.Get "css/globals.css" | css.PostCSS` runs PostCSS. Requires `postcss.config.js` at the project root and the PostCSS packages in `node_modules`.

5. **Content stub files** — Each product and category needs a stub `.md` file in the corresponding content section. The layout reads actual data from `.Site.Data`. The stub file provides routing and can contain minimal frontmatter.

6. **Hugo's `where` function** — Filters are zero-indexed: `{{ $p := where .Site.Data.products "isFeatured" true }}`. For complex filters use `index` + `range` + `if` combinations.

7. **Template inheritance** — All pages extend `_default/baseof.html` via `{{ define "main" }}`. Section-specific layouts override the `_default/single.html` and `_default/list.html`.

8. **Data-driven product pages** — The 20 product stubs in `content/shop/` each need `slug` in frontmatter matching the `products.json` slug. The layout looks up the product by slug from `.Site.Data.products`.

9. **No SSR or client-side routing** — Every page navigation is a full HTTP request. The cart/wishlist/compare state in localStorage persists, and `DOMContentLoaded` reinitializes everything on each page load.

10. **Hugo's `index` function** — To get the first item from a slice: `{{ $first := index $items 0 }}`. To get by map key: `{{ $val := index $map "key" }}`.

---

## Build & Dev Commands

```bash
npm run dev      # hugo server --buildDrafts (runs at http://localhost:1313)
npm run build    # hugo --minify (builds to /public)
```

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "hugo server --buildDrafts --disableFastRender",
    "build": "hugo --minify"
  }
}
```

The `public/` directory contains the fully static site.

---

## theme.json

```json
{
  "name": "Bazaar — Fashion Ecommerce Hugo Theme",
  "slug": "bazaar-hugo-theme",
  "platform": "hugo",
  "type": "template",
  "description": "A vibrant fashion ecommerce theme built with Hugo, Go templates, and Tailwind CSS v4. 34 pages, 49 partials, dark mode, vanilla JS.",
  "features": [
    "34 fully designed pages",
    "49 reusable partial templates",
    "Hugo static site generator",
    "Go template system",
    "Vanilla JS cart/wishlist/compare",
    "Tailwind CSS v4 via Hugo Pipes + PostCSS",
    "Dark mode + RTL support",
    "Hugo content sections for blog",
    "Self-hosted fonts",
    "Zero JS framework dependencies"
  ],
  "price": "$59.00",
  "demoUrl": "",
  "category": "hugo-themes"
}
```
