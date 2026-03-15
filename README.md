# Bazaar Studio — Hugo Fashion Ecommerce Theme

A premium fashion and lifestyle ecommerce theme built with Hugo, Go templates, and Tailwind CSS v4. Features 34 fully designed pages, 50 reusable partial templates, dark mode, RTL/i18n support, and a complete client-side cart/wishlist/compare system — all with zero JavaScript framework dependencies.

## Quick Start

```bash
# Prerequisites: Hugo Extended v0.140+ and Node.js 18+
npm install
npm run dev
```

Open [http://localhost:1313](http://localhost:1313) in your browser.

## Features

- **34 fully designed pages** — Home, Shop, Product Detail, Categories, Cart, Checkout (single + multi-step), Blog, About, Contact, FAQ, and 24 more
- **50 reusable Hugo partials** — Product cards, galleries, accordions, modals, forms, and more
- **Dark mode** — Toggle between light and dark themes with persistent localStorage preference
- **i18n support** — 3 languages (English, French, Arabic) with RTL support
- **Client-side ecommerce** — Cart, wishlist, compare, and recently viewed via localStorage
- **Product filtering & sorting** — Category, price, size, color, availability filters with URL state
- **Tailwind CSS v4** — Via Hugo Pipes + PostCSS, with custom design tokens
- **Self-hosted fonts** — Outfit (headings) and Inter (body) as variable woff2 files
- **SEO ready** — Meta tags, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt
- **Fully responsive** — Tested at 320px, 768px, 1024px, 1440px
- **Accessible** — Semantic HTML, ARIA labels, skip-to-content, focus states
- **Zero JS frameworks** — Pure vanilla JavaScript for all interactivity

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, featured products, promo banner, testimonials, newsletter |
| Shop | `/shop/` | Product grid with filters, sorting, grid/list view |
| Product Detail | `/shop/{slug}/` | Gallery, variants, reviews, related products |
| Categories | `/categories/` | Category grid |
| Category Detail | `/categories/{slug}/` | Filtered product listing |
| Cart | `/cart/` | Shopping bag with order summary |
| Checkout | `/checkout/` | Single-page checkout |
| Multi-Step Checkout | `/checkout-steps/` | 3-step checkout wizard |
| Wishlist | `/wishlist/` | Saved items |
| Compare | `/compare/` | Side-by-side product comparison |
| Account | `/account/` | Sign in, register, dashboard |
| Sale | `/sale/` | Flash sale with countdown |
| Blog | `/blog/` | Article listing with sidebar |
| Blog Post | `/blog/{slug}/` | Full article with related posts |
| About | `/about/` | Brand story, values, team |
| Contact | `/contact/` | Contact form + info |
| FAQ | `/faq/` | Grouped accordions |
| Features | `/features/` | Theme feature showcase |
| Careers | `/careers/` | Job listings |
| Lookbook | `/lookbook/` | Visual gallery |
| Gift Cards | `/gift-cards/` | Gift card purchase |
| Order Tracking | `/order-tracking/` | Order status tracker |
| Stores | `/stores/` | Store locator with map |
| Press | `/press/` | Media coverage |
| Shipping | `/shipping/` | Shipping info tables |
| Returns | `/returns/` | Return policy + form |
| Rewards | `/rewards/` | Loyalty program |
| Size Guide | `/size-guide/` | Measurement tables |
| Sustainability | `/sustainability/` | Environmental commitment |
| Recently Viewed | `/recently-viewed/` | Browsing history |
| Privacy | `/privacy/` | Privacy policy |
| Terms | `/terms/` | Terms of service |
| Coming Soon | `/coming-soon/` | Standalone launch page |
| 404 | (any invalid path) | Custom error page |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Hugo v0.140+ (Extended) |
| Templates | Go templates |
| Styling | Tailwind CSS v4 via PostCSS |
| Typography | @tailwindcss/typography |
| Fonts | Self-hosted variable woff2 |
| Interactivity | Vanilla JavaScript |
| Content | Hugo content sections (Markdown) |
| Data | Hugo data directory (JSON) |
| Build | Hugo Pipes (CSS/JS processing) |

## Project Structure

```
bazaar-hugo/
├── assets/
│   ├── css/globals.css        # Tailwind entry point with design tokens
│   └── js/                    # 8 vanilla JS utility files
│       ├── cart.js            # Cart management (localStorage)
│       ├── wishlist.js        # Wishlist management
│       ├── compare.js         # Product comparison
│       ├── recently-viewed.js # Recently viewed tracking
│       ├── theme.js           # Dark mode toggle
│       ├── filters.js         # Product filtering & sorting
│       ├── i18n.js            # Language switching
│       └── main.js            # Master init (all UI interactions)
├── content/                   # Page content (Markdown frontmatter)
│   ├── _index.md              # Home page
│   ├── shop/                  # Shop + 20 product stubs
│   ├── blog/                  # 6 blog posts
│   ├── categories/            # 6 category stubs
│   └── .../                   # One _index.md per page
├── data/                      # JSON data files
│   ├── products.json          # 20 products
│   ├── categories.json        # 6 categories
│   ├── reviews.json           # 36 product reviews
│   ├── navigation.json        # Nav + footer links
│   ├── site-config.json       # Global config
│   └── translations/          # EN, FR, AR
├── layouts/
│   ├── _default/baseof.html   # Base template
│   ├── partials/              # 50 partial templates
│   ├── index.html             # Home page layout
│   ├── shop/                  # Shop list + product detail
│   ├── blog/                  # Blog list + post
│   ├── categories/            # Categories list + detail
│   └── .../                   # Section layouts
├── static/
│   ├── fonts/                 # Outfit + Inter variable woff2
│   └── images/                # Product, category, blog images
├── hugo.toml                  # Hugo configuration
├── postcss.config.js          # PostCSS + Tailwind
└── package.json               # npm dependencies
```

## Customization

### Site Configuration

Edit `data/site-config.json` to customize:
- Site name, tagline, description
- Logo (image or text)
- Social media links
- Announcement bar text
- Footer content

### Navigation

Edit `data/navigation.json` to customize:
- Main navigation items and mega-menu structure
- Footer link columns

### Colors

Edit `assets/css/globals.css` to modify the `@theme` block with your brand colors:
- Primary (Rose)
- Accent (Amber)
- Secondary (Violet)
- Surface (Slate)

### Content

- **Products**: Edit `data/products.json`
- **Blog posts**: Add/edit Markdown files in `content/blog/`
- **Pages**: Edit `_index.md` files in each content section
- **Translations**: Edit files in `data/translations/`

## Build Commands

```bash
npm run dev          # Start dev server (http://localhost:1313)
npm run build        # Production build (output: /public)
npm run generate-content  # Regenerate content stubs from data
```

## Requirements

- **Hugo Extended** v0.140+ ([install guide](https://gohugo.io/installation/))
- **Node.js** 18+
- **npm** 9+

## License

MIT License. See [LICENSE](LICENSE) for details.

Built by [MeggnoTec Solutions](https://meggnotec.com).
