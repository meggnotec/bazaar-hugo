# Bazaar Studio — Hugo Theme Summary

## Tech Stack
- Hugo v0.140+ (Extended)
- Go templates
- Tailwind CSS v4 via PostCSS
- @tailwindcss/typography
- Vanilla JavaScript (no framework)
- Self-hosted variable fonts (Outfit, Inter)

## Pages (34)
Home, Shop, Product Detail (x20), Categories, Category Detail (x6), Cart, Checkout, Multi-Step Checkout, Wishlist, Compare, Account, Sale, Blog, Blog Post (x6), About, Contact, FAQ, Features, Careers, Lookbook, Gift Cards, Order Tracking, Stores, Press, Shipping, Returns, Rewards, Size Guide, Sustainability, Recently Viewed, Privacy, Terms, Coming Soon, 404

## Partials (50)
### Layout
seo-head, announcement-bar, header, footer, mobile-menu, cart-drawer, quick-view, search-bar (inline), back-to-top, newsletter-popup, mobile-bottom-nav, theme-toggle, language-switcher, scripts, breadcrumbs, pagination, hero, hero-alt, placeholder

### Product
product-card, product-gallery, product-info, variant-picker, quantity-selector, price-display, star-rating, sale-badge, product-accordion, related-products, frequently-bought-together, product-reviews, sticky-add-to-cart, featured-collection

### Marketing
promo-banner, sale-banner, testimonials, newsletter-signup, instagram-grid, blog-card, blog-sidebar, team-card, category-card, category-strip

### Commerce
filter-sidebar, sort-dropdown, cart-drawer, checkout-form, checkout-multi-step, checkout-steps, promo-code-input, order-summary, share-buttons

## JavaScript Utilities (8)
cart.js, wishlist.js, compare.js, recently-viewed.js, theme.js, filters.js, i18n.js, main.js

## Data Files (17)
products.json (20 items), categories.json (6), testimonials.json (8), reviews.json (36), faq.json (4 groups), team.json (4), careers.json, features.json (8 groups), lookbook.json (6), press.json, stores.json (6), size-guide.json, navigation.json, site-config.json, translations/en.json, translations/fr.json, translations/ar.json

## Blog Posts (6)
1. Spring Essentials: Building Your Capsule Wardrobe
2. The Art of Layering: Transitional Dressing Guide
3. Sustainable Fashion: Our Commitment to Ethical Production
4. Color Theory in Fashion: How to Build Cohesive Outfits
5. Care Guide: Making Your Clothes Last Longer
6. Behind the Design: Our Fall Collection Story

## Design System
- **Colors**: Primary (Rose), Accent (Amber), Secondary (Violet), Surface (Slate)
- **Fonts**: Outfit (headings, variable 100-900), Inter (body, variable 100-900)
- **Gradients**: gradient-hero, gradient-cta, gradient-sale, gradient-text
- **Dark mode**: Toggle via .dark class on html
- **RTL**: dir="rtl" support for Arabic

## Images
- 20 product images
- 6 category images
- 3 hero images
- 6 blog post images
- 6 Instagram grid images
- 6 lookbook images
- 5 mega-menu images
- 4 team member images
- 8 testimonial avatars
- 1 promo image
- 1 about image
- 2 logo SVGs (light/dark)
