const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const contentDir = path.join(__dirname, '..', 'content');

// Generate product stubs
const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf8'));
const shopDir = path.join(contentDir, 'shop');
fs.mkdirSync(shopDir, { recursive: true });

// Shop section _index.md
fs.writeFileSync(path.join(shopDir, '_index.md'), `---
title: "Shop All"
description: "Browse our full collection of premium fashion."
---
`);

products.forEach(p => {
  fs.writeFileSync(path.join(shopDir, p.slug + '.md'), `---
title: "${p.title}"
slug: "${p.slug}"
description: "${p.description || p.title + ' - Premium fashion from Bazaar Studio.'}"
draft: false
---
`);
});

console.log(`Generated ${products.length} product stubs`);

// Generate category stubs
const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
const catDir = path.join(contentDir, 'categories');
fs.mkdirSync(catDir, { recursive: true });

fs.writeFileSync(path.join(catDir, '_index.md'), `---
title: "Shop by Category"
description: "Browse our curated collections by category."
---
`);

categories.forEach(c => {
  fs.writeFileSync(path.join(catDir, c.slug + '.md'), `---
title: "${c.name}"
slug: "${c.slug}"
description: "${c.description}"
draft: false
---
`);
});

console.log(`Generated ${categories.length} category stubs`);

// Generate page stubs
const pages = [
  { dir: '', file: '_index.md', title: 'Bazaar Studio — Your Style, Your Story', desc: 'Premium fashion & lifestyle ecommerce store. Discover curated collections that define modern elegance.' },
  { dir: 'blog', file: '_index.md', title: 'The Edit', desc: 'Style guides, fashion tips, and behind-the-scenes stories from Bazaar Studio.' },
  { dir: 'cart', file: '_index.md', title: 'Your Bag', desc: 'Review your shopping bag and proceed to checkout.' },
  { dir: 'checkout', file: '_index.md', title: 'Checkout', desc: 'Complete your purchase securely.' },
  { dir: 'checkout-steps', file: '_index.md', title: 'Checkout', desc: 'Complete your purchase step by step.' },
  { dir: 'wishlist', file: '_index.md', title: 'Your Wishlist', desc: 'Your saved items for later.' },
  { dir: 'account', file: '_index.md', title: 'My Account', desc: 'Manage your account, orders, and preferences.' },
  { dir: 'sale', file: '_index.md', title: 'Flash Sale', desc: 'Limited-time deals on premium fashion. Up to 60% off.' },
  { dir: 'about', file: '_index.md', title: 'Our Story', desc: 'Learn about Bazaar Studio\'s mission, values, and the team behind the brand.' },
  { dir: 'contact', file: '_index.md', title: 'Get in Touch', desc: 'Have a question? We\'d love to hear from you.' },
  { dir: 'faq', file: '_index.md', title: 'Frequently Asked Questions', desc: 'Find answers to common questions about shipping, returns, sizing, and more.' },
  { dir: 'features', file: '_index.md', title: 'Theme Features', desc: 'Explore all the features and components included in the Bazaar theme.' },
  { dir: 'careers', file: '_index.md', title: 'Join Our Team', desc: 'Explore career opportunities at Bazaar Studio.' },
  { dir: 'lookbook', file: '_index.md', title: 'Lookbook', desc: 'Explore our seasonal lookbooks and get inspired.' },
  { dir: 'compare', file: '_index.md', title: 'Compare Products', desc: 'Compare products side by side to find the perfect fit.' },
  { dir: 'recently-viewed', file: '_index.md', title: 'Recently Viewed', desc: 'Products you\'ve recently browsed.' },
  { dir: 'gift-cards', file: '_index.md', title: 'Gift Cards', desc: 'Give the gift of style with a Bazaar Studio gift card.' },
  { dir: 'order-tracking', file: '_index.md', title: 'Track Your Order', desc: 'Track the status of your order in real time.' },
  { dir: 'stores', file: '_index.md', title: 'Our Stores', desc: 'Find a Bazaar Studio store near you.' },
  { dir: 'press', file: '_index.md', title: 'Press & Media', desc: 'Bazaar Studio in the news. Press coverage and media resources.' },
  { dir: 'shipping', file: '_index.md', title: 'Shipping & Delivery', desc: 'Everything you need to know about shipping options and delivery times.' },
  { dir: 'returns', file: '_index.md', title: 'Returns & Exchanges', desc: 'Our hassle-free return and exchange policy.' },
  { dir: 'rewards', file: '_index.md', title: 'Rewards Program', desc: 'Earn points and unlock exclusive perks with every purchase.' },
  { dir: 'size-guide', file: '_index.md', title: 'Size Guide', desc: 'Find your perfect fit with our comprehensive size guide.' },
  { dir: 'sustainability', file: '_index.md', title: 'Our Commitment', desc: 'Our commitment to sustainable and ethical fashion.' },
  { dir: 'coming-soon', file: '_index.md', title: 'Coming Soon', desc: 'Something exciting is on the way.', extra: 'noindex: true' },
  { dir: 'privacy', file: '_index.md', title: 'Privacy Policy', desc: 'How we collect, use, and protect your personal information.' },
  { dir: 'terms', file: '_index.md', title: 'Terms of Service', desc: 'The terms and conditions governing your use of Bazaar Studio.' },
];

pages.forEach(p => {
  const dir = p.dir ? path.join(contentDir, p.dir) : contentDir;
  fs.mkdirSync(dir, { recursive: true });
  const extra = p.extra ? '\n' + p.extra : '';
  // Don't overwrite existing _index.md (e.g. blog, shop, categories)
  const filePath = path.join(dir, p.file);
  if (fs.existsSync(filePath) && (p.dir === 'blog' || p.dir === 'shop' || p.dir === 'categories')) {
    console.log(`Skipping existing: ${p.dir}/${p.file}`);
    return;
  }
  fs.writeFileSync(filePath, `---
title: "${p.title}"
description: "${p.desc}"${extra}
---
`);
});

console.log(`Generated ${pages.length} page stubs`);
