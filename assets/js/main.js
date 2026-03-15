/* ==========================================================================
   Main Initialization
   Master entry point — initializes all interactive components on page load.
   Each init function checks for relevant DOM elements before binding.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initHeader();
  initMobileMenu();
  initCartDrawer();
  initQuickView();
  initSearchBar();
  initBackToTop();
  initNewsletterPopup();
  initAnnouncementBar();
  initMobileBottomNav();
  initProductCards();
  initCountdownTimers();
  initFaqAccordions();
  initProductAccordions();
  initShareButtons();
  initNewsletterForm();
  initSortDropdown();
  initFilterSidebar();
  initThemeToggle();
  initLanguageSwitcher();
  initStickyAddToCart();
  initGridListToggle();
  initLoadMore();
  initCheckoutForm();
  initCheckoutMultiStep();
  initProductGallery();
  initProductInfo();
  initAccountPage();
  updateAllBadges();
});


/* ==========================================================================
   Header
   Search overlay toggle, mega-menu hover, cart/mobile triggers, badge updates
   ========================================================================== */
function initHeader() {
  // Search toggle (inline header search)
  var searchTrigger = document.getElementById('search-trigger');
  var searchOverlay = document.getElementById('header-search-overlay');
  var searchClose = document.getElementById('header-search-close');
  var searchInput = document.getElementById('header-search-input');

  if (searchTrigger && searchOverlay) {
    searchTrigger.addEventListener('click', function () {
      searchOverlay.classList.toggle('hidden');
      if (!searchOverlay.classList.contains('hidden') && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', function () {
      searchOverlay.classList.add('hidden');
    });
  }

  // Cart count update
  function updateCartCount() {
    var countEl = document.getElementById('cart-count');
    if (!countEl) return;
    var count = getCartCount();
    countEl.textContent = String(count);
    countEl.classList.toggle('hidden', count === 0);
  }

  // Wishlist count update
  function updateWishlistCount() {
    var countEl = document.getElementById('wishlist-count');
    if (!countEl) return;
    var list = getWishlist();
    countEl.textContent = String(list.length);
    countEl.classList.toggle('hidden', list.length === 0);
  }

  // Compare count update
  function updateCompareCount() {
    var countEl = document.getElementById('compare-count');
    if (!countEl) return;
    var count = getCompareCount();
    countEl.textContent = String(count);
    countEl.classList.toggle('hidden', count === 0);
  }

  updateCartCount();
  updateWishlistCount();
  updateCompareCount();

  document.addEventListener('bazaar:cart-updated', updateCartCount);
  document.addEventListener('bazaar:wishlist-updated', updateWishlistCount);
  document.addEventListener('bazaar:compare-updated', updateCompareCount);

  // Advanced mega-menu hover logic
  var megaCloseTimer = null;

  document.querySelectorAll('[data-mega-trigger]').forEach(function (trigger) {
    var label = trigger.getAttribute('data-mega-trigger');
    var panel = document.querySelector('[data-mega-panel="' + label + '"]');
    var chevron = document.querySelector('[data-mega-chevron="' + label + '"]');
    if (!panel) return;

    function show() {
      if (megaCloseTimer) {
        clearTimeout(megaCloseTimer);
        megaCloseTimer = null;
      }
      // Close any other open panels
      document.querySelectorAll('[data-mega-panel]').forEach(function (p) {
        if (p !== panel) {
          p.classList.add('invisible', 'opacity-0');
        }
      });
      document.querySelectorAll('[data-mega-chevron]').forEach(function (c) {
        if (c !== chevron) c.style.transform = '';
      });
      panel.classList.remove('invisible', 'opacity-0');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }

    function hide() {
      megaCloseTimer = setTimeout(function () {
        panel.classList.add('invisible', 'opacity-0');
        if (chevron) chevron.style.transform = '';
      }, 150);
    }

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    panel.addEventListener('mouseenter', function () {
      if (megaCloseTimer) {
        clearTimeout(megaCloseTimer);
        megaCloseTimer = null;
      }
    });
    panel.addEventListener('mouseleave', hide);
  });

  // Cart drawer trigger
  var cartTrigger = document.getElementById('cart-trigger');
  if (cartTrigger) {
    cartTrigger.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('bazaar:open-cart'));
    });
  }

  // Mobile menu trigger
  var mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      var menu = document.getElementById('mobile-menu');
      var backdrop = document.getElementById('mobile-backdrop');
      if (menu) menu.classList.remove('translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
      mobileToggle.setAttribute('aria-expanded', 'true');
    });
  }
}


/* ==========================================================================
   Mobile Menu
   Slide-in panel, accordion nav, language buttons, close handlers
   ========================================================================== */
function initMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  var backdrop = document.getElementById('mobile-backdrop');
  var closeBtn = document.getElementById('mobile-menu-close');

  if (!menu) return;

  function closeMenu() {
    menu.classList.add('translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    var toggle = document.getElementById('mobile-menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Mobile language switcher
  function updateMobileLangBtns() {
    var locale = localStorage.getItem('bazaar-locale') || 'en';
    document.querySelectorAll('.mobile-lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-locale') === locale;
      btn.classList.toggle('!border-primary-500', isActive);
      btn.classList.toggle('!text-primary-500', isActive);
      btn.classList.toggle('!bg-primary-50', isActive);
    });
  }
  updateMobileLangBtns();

  document.querySelectorAll('.mobile-lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var locale = btn.getAttribute('data-locale') || 'en';
      var dir = locale === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('bazaar-locale', locale);
      document.documentElement.setAttribute('lang', locale);
      document.documentElement.setAttribute('dir', dir);

      // Apply translations
      applyTranslations(locale);

      updateMobileLangBtns();
      document.dispatchEvent(new CustomEvent('bazaar:locale-changed', {
        detail: { locale: locale, dir: dir }
      }));
      closeMenu();
    });
  });

  // Accordion navigation
  document.querySelectorAll('.mobile-accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var content = trigger.nextElementSibling;
      var icon = trigger.querySelector('svg');
      if (content) content.classList.toggle('hidden');
      if (icon) icon.classList.toggle('rotate-180');
    });
  });
}


/* ==========================================================================
   Cart Drawer
   Slide-in right panel with item rendering, qty controls, upsells
   ========================================================================== */
function initCartDrawer() {
  var drawer = document.getElementById('cart-drawer');
  var backdrop = document.getElementById('cart-backdrop');
  var closeBtn = document.getElementById('cart-drawer-close');

  if (!drawer) return;

  // Get product data for upsells
  var productsData = [];
  var productsDataEl = document.getElementById('products-data');
  if (productsDataEl) {
    try {
      productsData = JSON.parse(productsDataEl.textContent || '[]');
    } catch (e) {
      productsData = [];
    }
  }

  var threshold = Number(drawer.getAttribute('data-threshold') || 99);

  function closeCart() {
    drawer.classList.add('translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
  }

  function openCart() {
    renderCartDrawer();
    drawer.classList.remove('translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (backdrop) backdrop.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCart();
  });

  document.addEventListener('bazaar:open-cart', openCart);

  function updateShippingBar(total) {
    var bar = document.getElementById('cart-shipping-bar');
    var msg = document.getElementById('cart-shipping-msg');
    var icon = document.getElementById('cart-shipping-icon');
    var progress = document.getElementById('cart-shipping-progress');
    if (!bar || !msg || !progress) return;

    bar.classList.remove('hidden');

    if (total >= threshold) {
      msg.textContent = 'Free shipping unlocked!';
      msg.classList.add('text-emerald-600', 'dark:text-emerald-400', 'font-medium');
      msg.classList.remove('text-surface-600', 'dark:text-surface-400');
      if (icon) icon.classList.remove('hidden');
      progress.style.width = '100%';
    } else {
      var remaining = (threshold - total).toFixed(2);
      msg.textContent = "You're $" + remaining + ' away from free shipping!';
      msg.classList.remove('text-emerald-600', 'dark:text-emerald-400', 'font-medium');
      msg.classList.add('text-surface-600', 'dark:text-surface-400');
      if (icon) icon.classList.add('hidden');
      progress.style.width = Math.min(100, (total / threshold) * 100) + '%';
    }
  }

  function renderUpsells(cart) {
    var upsellsEl = document.getElementById('cart-upsells');
    var upsellItems = document.getElementById('cart-upsell-items');
    if (!upsellsEl || !upsellItems || productsData.length === 0) return;

    var cartIds = cart.map(function (i) { return i.id; });
    var available = productsData.filter(function (p) {
      return p.inStock && cartIds.indexOf(p.id) === -1;
    });
    if (available.length === 0) {
      upsellsEl.classList.add('hidden');
      return;
    }

    // Pick 2 random upsells
    var shuffled = available.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 2);
    upsellsEl.classList.remove('hidden');

    upsellItems.innerHTML = shuffled.map(function (p) {
      var imgHtml = p.image
        ? '<img src="' + p.image + '" alt="' + p.title + '" width="40" height="48" class="w-10 h-12 rounded flex-shrink-0 object-cover" />'
        : '<div class="w-10 h-12 rounded flex-shrink-0" style="background-color: ' + p.placeholderColor + '"></div>';
      var displayPrice = (p.salePrice || p.price).toFixed(2);
      return '<div class="flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-surface-800">' +
        imgHtml +
        '<div class="flex-1 min-w-0">' +
          '<p class="text-xs font-medium text-surface-900 dark:text-white truncate">' + p.title + '</p>' +
          '<p class="text-xs text-surface-500">$' + displayPrice + '</p>' +
        '</div>' +
        '<button type="button" class="upsell-add-btn text-xs font-semibold text-primary-500 hover:text-primary-600 cursor-pointer whitespace-nowrap" ' +
          'data-id="' + p.id + '" data-slug="' + p.slug + '" data-title="' + p.title + '" ' +
          'data-price="' + p.price + '" data-sale="' + (p.salePrice || '') + '" ' +
          'data-image="' + (p.image || '') + '" data-color="' + p.placeholderColor + '">+ Add</button>' +
      '</div>';
    }).join('');

    upsellItems.querySelectorAll('.upsell-add-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        addToCart({
          id: Number(btn.getAttribute('data-id')),
          slug: btn.getAttribute('data-slug') || '',
          title: btn.getAttribute('data-title') || '',
          price: Number(btn.getAttribute('data-price')),
          salePrice: btn.getAttribute('data-sale') ? Number(btn.getAttribute('data-sale')) : null,
          size: '',
          color: '',
          quantity: 1,
          image: btn.getAttribute('data-image') || '',
          placeholderColor: btn.getAttribute('data-color') || ''
        });
      });
    });
  }

  function renderCartDrawer() {
    var itemsEl = document.getElementById('cart-drawer-items');
    var emptyEl = document.getElementById('cart-drawer-empty');
    var footerEl = document.getElementById('cart-drawer-footer');
    var totalEl = document.getElementById('cart-drawer-total');
    var shippingBar = document.getElementById('cart-shipping-bar');
    var upsellsEl = document.getElementById('cart-upsells');
    if (!itemsEl || !emptyEl || !footerEl || !totalEl) return;

    var cart = getCart();

    if (cart.length === 0) {
      itemsEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      footerEl.classList.add('hidden');
      if (shippingBar) shippingBar.classList.add('hidden');
      if (upsellsEl) upsellsEl.classList.add('hidden');
      return;
    }

    itemsEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    footerEl.classList.remove('hidden');

    var total = getCartTotal();
    totalEl.textContent = '$' + total.toFixed(2);

    updateShippingBar(total);
    renderUpsells(cart);

    itemsEl.innerHTML = cart.map(function (item) {
      var imgHtml = item.image
        ? '<img src="' + item.image + '" alt="' + item.title + '" width="64" height="80" class="w-16 h-20 rounded-lg flex-shrink-0 object-cover" />'
        : '<div class="w-16 h-20 rounded-lg flex-shrink-0 flex items-center justify-center text-white/70 text-xs" style="background-color: ' + (item.placeholderColor || '#c4a882') + '">' + item.title.substring(0, 3) + '</div>';
      var itemPrice = item.salePrice != null ? item.salePrice : item.price;
      var lineTotal = (itemPrice * item.quantity).toFixed(2);
      var variant = (item.size || '') + (item.size && item.color ? ' / ' : '') + (item.color || '');

      return '<div class="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800">' +
        imgHtml +
        '<div class="flex-1 min-w-0">' +
          '<h4 class="text-sm font-medium text-surface-900 dark:text-white truncate">' + item.title + '</h4>' +
          '<p class="text-xs text-surface-500 dark:text-surface-400">' + variant + '</p>' +
          '<div class="flex items-center justify-between mt-2">' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" class="cart-qty-btn w-6 h-6 rounded border border-surface-300 dark:border-surface-600 text-xs flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer" data-action="decrease" data-id="' + item.id + '" data-size="' + (item.size || '') + '" data-color="' + (item.color || '') + '">-</button>' +
              '<span class="text-sm">' + item.quantity + '</span>' +
              '<button type="button" class="cart-qty-btn w-6 h-6 rounded border border-surface-300 dark:border-surface-600 text-xs flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer" data-action="increase" data-id="' + item.id + '" data-size="' + (item.size || '') + '" data-color="' + (item.color || '') + '">+</button>' +
            '</div>' +
            '<span class="text-sm font-semibold text-surface-900 dark:text-white">$' + lineTotal + '</span>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="cart-remove-btn text-surface-400 hover:text-red-500 transition-colors self-start cursor-pointer" data-id="' + item.id + '" data-size="' + (item.size || '') + '" data-color="' + (item.color || '') + '" aria-label="Remove item">' +
          '<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>' +
        '</button>' +
      '</div>';
    }).join('');

    // Bind quantity buttons
    itemsEl.querySelectorAll('.cart-qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = Number(btn.getAttribute('data-id'));
        var size = btn.getAttribute('data-size') || '';
        var color = btn.getAttribute('data-color') || '';
        var action = btn.getAttribute('data-action');
        var cart = getCart();
        var item = cart.find(function (i) {
          return i.id === id && i.size === size && i.color === color;
        });
        if (!item) return;

        if (action === 'increase') {
          item.quantity++;
        } else {
          if (item.quantity <= 1) {
            var idx = cart.indexOf(item);
            cart.splice(idx, 1);
          } else {
            item.quantity--;
          }
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        document.dispatchEvent(new CustomEvent('bazaar:cart-updated'));
      });
    });

    // Bind remove buttons
    itemsEl.querySelectorAll('.cart-remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = Number(btn.getAttribute('data-id'));
        var size = btn.getAttribute('data-size') || '';
        var color = btn.getAttribute('data-color') || '';
        removeFromCart(id, size, color);
      });
    });
  }

  renderCartDrawer();
  document.addEventListener('bazaar:cart-updated', renderCartDrawer);
}


/* ==========================================================================
   Quick View
   Modal product preview with size/color/qty pickers and add to cart
   ========================================================================== */
function initQuickView() {
  var backdrop = document.getElementById('quickview-backdrop');
  var modal = document.getElementById('quickview-modal');
  var closeBtn = document.getElementById('quickview-close');
  var dataEl = document.getElementById('quickview-products-data');

  if (!backdrop || !modal || !closeBtn || !dataEl) return;

  var products = [];
  try {
    products = JSON.parse(dataEl.textContent || '[]');
  } catch (e) {
    return;
  }

  var currentProduct = null;
  var selectedSize = '';
  var selectedColor = '';
  var quantity = 1;

  function renderStars(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      if (rating >= i) {
        html += '<svg class="w-4 h-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
      } else if (rating >= i - 0.5) {
        html += '<svg class="w-4 h-4 text-accent-500" viewBox="0 0 20 20"><defs><linearGradient id="qvhalf"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="#e2e8f0"/></linearGradient></defs><path fill="url(#qvhalf)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
      } else {
        html += '<svg class="w-4 h-4 text-surface-300 dark:text-surface-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
      }
    }
    return '<div class="flex items-center gap-0.5">' + html + '</div>';
  }

  function openModal(productId) {
    var product = products.find(function (p) { return p.id === productId; });
    if (!product) return;
    currentProduct = product;
    quantity = 1;
    selectedSize = product.sizes && product.sizes[0] ? product.sizes[0] : '';
    selectedColor = product.colors && product.colors[0] ? product.colors[0].name : '';

    populateModal(product);

    backdrop.classList.remove('hidden');
    backdrop.classList.add('quickview-backdrop-show');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    var inner = modal.querySelector(':scope > div');
    if (inner) inner.classList.add('quickview-modal-show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.add('hidden');
    backdrop.classList.remove('quickview-backdrop-show');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    var inner = modal.querySelector(':scope > div');
    if (inner) inner.classList.remove('quickview-modal-show');
    document.body.style.overflow = '';
    currentProduct = null;
  }

  function populateModal(product) {
    // Image
    var imageArea = document.getElementById('quickview-image-area');
    if (imageArea) {
      var existing = imageArea.querySelector('[data-qv-image]');
      if (existing) existing.remove();

      if (product.image) {
        var img = document.createElement('img');
        img.setAttribute('data-qv-image', '');
        img.src = product.image;
        img.alt = product.title;
        img.className = 'absolute inset-0 w-full h-full object-cover';
        imageArea.insertBefore(img, imageArea.firstChild);
      } else {
        var imgDiv = document.createElement('div');
        imgDiv.setAttribute('data-qv-image', '');
        imgDiv.className = 'absolute inset-0 flex items-center justify-center';
        imgDiv.style.backgroundColor = product.placeholderColor;
        var label = document.createElement('span');
        label.className = 'text-white/60 font-heading text-sm text-center px-4';
        label.textContent = product.title;
        imgDiv.appendChild(label);
        imageArea.insertBefore(imgDiv, imageArea.firstChild);
      }

      // Badges
      var badges = document.getElementById('quickview-badges');
      if (badges) {
        badges.innerHTML = '';
        if (product.isNew) {
          var b = document.createElement('span');
          b.className = 'badge-new text-[10px]';
          b.textContent = 'New';
          badges.appendChild(b);
        }
        if (product.isSale && product.salePrice) {
          var disc = Math.round((1 - product.salePrice / product.price) * 100);
          var b2 = document.createElement('span');
          b2.className = 'badge-sale text-[10px]';
          b2.textContent = '-' + disc + '%';
          badges.appendChild(b2);
        }
      }
    }

    // Title
    var titleEl = document.getElementById('quickview-title');
    if (titleEl) titleEl.textContent = product.title;

    // Rating
    var ratingEl = document.getElementById('quickview-rating');
    if (ratingEl) {
      ratingEl.innerHTML = renderStars(product.rating) +
        '<span class="text-sm text-surface-500 dark:text-surface-400">(' + product.reviewCount + ')</span>';
    }

    // Price
    var priceEl = document.getElementById('quickview-price');
    if (priceEl) {
      if (product.salePrice) {
        var disc = Math.round((1 - product.salePrice / product.price) * 100);
        priceEl.innerHTML =
          '<span class="text-2xl font-bold text-primary-600 dark:text-primary-400">$' + product.salePrice.toFixed(2) + '</span>' +
          '<span class="text-lg text-surface-400 line-through">$' + product.price.toFixed(2) + '</span>' +
          '<span class="badge-sale text-[10px]">-' + disc + '%</span>';
      } else {
        priceEl.innerHTML = '<span class="text-2xl font-bold text-surface-900 dark:text-white">$' + product.price.toFixed(2) + '</span>';
      }
    }

    // Stock
    var stockEl = document.getElementById('quickview-stock');
    if (stockEl) {
      if (product.inStock) {
        stockEl.innerHTML = '<span class="text-emerald-600 dark:text-emerald-400">&#x2713; In Stock</span>';
      } else {
        stockEl.innerHTML = '<span class="text-red-500">Out of Stock</span>';
      }
    }

    // Description
    var descEl = document.getElementById('quickview-description');
    if (descEl) descEl.textContent = product.shortDescription || '';

    // Sizes
    var sizesWrap = document.getElementById('quickview-sizes-wrap');
    var sizesEl = document.getElementById('quickview-sizes');
    if (sizesWrap && sizesEl) {
      if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size') {
        sizesWrap.classList.remove('hidden');
        sizesEl.innerHTML = product.sizes.map(function (s) {
          var active = s === selectedSize;
          return '<button type="button" data-size="' + s + '" class="qv-size-btn px-3 py-1.5 text-sm rounded-md border cursor-pointer transition-all ' +
            (active
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-semibold'
              : 'border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:border-primary-400') +
            '">' + s + '</button>';
        }).join('');
      } else {
        sizesWrap.classList.add('hidden');
      }
    }

    // Colors
    var colorsWrap = document.getElementById('quickview-colors-wrap');
    var colorsEl = document.getElementById('quickview-colors');
    var colorNameEl = document.getElementById('quickview-color-name');
    if (colorsWrap && colorsEl && colorNameEl) {
      if (product.colors && product.colors.length > 0) {
        colorsWrap.classList.remove('hidden');
        colorNameEl.textContent = selectedColor;
        colorsEl.innerHTML = product.colors.map(function (c) {
          var active = c.name === selectedColor;
          var isLight = c.hex.toUpperCase() === '#FFFFFF' || c.hex.toUpperCase() === '#FFFFF0' || c.hex.toUpperCase() === '#FAF9F6';
          return '<button type="button" data-color="' + c.name + '" data-hex="' + c.hex + '" class="qv-color-btn w-8 h-8 rounded-full cursor-pointer transition-all ' +
            (active ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-surface-900' : '') +
            (isLight ? ' border border-surface-300' : '') +
            '" style="background-color: ' + c.hex + '" aria-label="' + c.name + '"></button>';
        }).join('');
      } else {
        colorsWrap.classList.add('hidden');
      }
    }

    // Quantity reset
    var qtyEl = document.getElementById('quickview-qty');
    if (qtyEl) qtyEl.textContent = '1';

    // Add to cart button state
    var addBtn = document.getElementById('quickview-add-to-cart');
    if (addBtn) {
      addBtn.disabled = !product.inStock;
      addBtn.textContent = product.inStock ? 'Add to Cart' : 'Out of Stock';
      if (!product.inStock) {
        addBtn.classList.add('opacity-50', 'cursor-not-allowed');
        addBtn.classList.remove('cursor-pointer');
      } else {
        addBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        addBtn.classList.add('cursor-pointer');
      }
    }

    // Details link
    var detailsLink = document.getElementById('quickview-details-link');
    if (detailsLink) detailsLink.href = '/shop/' + product.slug + '/';
  }

  // Event delegation for size/color buttons inside modal
  modal.addEventListener('click', function (e) {
    var target = e.target;
    var sizeBtn = target.closest('.qv-size-btn');
    if (sizeBtn) {
      selectedSize = sizeBtn.getAttribute('data-size') || '';
      modal.querySelectorAll('.qv-size-btn').forEach(function (b) {
        b.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-950', 'text-primary-700', 'dark:text-primary-300', 'font-semibold');
        b.classList.add('border-surface-300', 'dark:border-surface-600', 'text-surface-700', 'dark:text-surface-300');
      });
      sizeBtn.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-primary-950', 'text-primary-700', 'dark:text-primary-300', 'font-semibold');
      sizeBtn.classList.remove('border-surface-300', 'dark:border-surface-600', 'text-surface-700', 'dark:text-surface-300');
      return;
    }

    var colorBtn = target.closest('.qv-color-btn');
    if (colorBtn) {
      selectedColor = colorBtn.getAttribute('data-color') || '';
      var nameEl = document.getElementById('quickview-color-name');
      if (nameEl) nameEl.textContent = selectedColor;
      modal.querySelectorAll('.qv-color-btn').forEach(function (b) {
        b.classList.remove('ring-2', 'ring-offset-2', 'ring-primary-500', 'dark:ring-offset-surface-900');
      });
      colorBtn.classList.add('ring-2', 'ring-offset-2', 'ring-primary-500', 'dark:ring-offset-surface-900');
      return;
    }
  });

  // Quantity buttons
  var qtyMinus = document.getElementById('quickview-qty-minus');
  var qtyPlus = document.getElementById('quickview-qty-plus');
  var qtyDisplay = document.getElementById('quickview-qty');

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function () {
      if (quantity > 1) {
        quantity--;
        if (qtyDisplay) qtyDisplay.textContent = String(quantity);
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function () {
      if (quantity < 10) {
        quantity++;
        if (qtyDisplay) qtyDisplay.textContent = String(quantity);
      }
    });
  }

  // Add to cart
  var addBtn = document.getElementById('quickview-add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      if (!currentProduct || !currentProduct.inStock) return;

      addToCart({
        id: currentProduct.id,
        slug: currentProduct.slug,
        title: currentProduct.title,
        price: currentProduct.price,
        salePrice: currentProduct.salePrice || null,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        image: currentProduct.image || '',
        placeholderColor: currentProduct.placeholderColor
      });

      // Success feedback
      var origText = addBtn.textContent;
      addBtn.textContent = '\u2713 Added!';
      addBtn.classList.add('bg-emerald-500', 'from-emerald-500', 'to-emerald-500');
      setTimeout(function () {
        addBtn.textContent = origText;
        addBtn.classList.remove('bg-emerald-500', 'from-emerald-500', 'to-emerald-500');
        closeModal();
        document.dispatchEvent(new CustomEvent('bazaar:open-cart'));
      }, 1500);
    });
  }

  // Close handlers
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Listen for quickview open events
  document.addEventListener('bazaar:quickview-open', function (e) {
    var productId = e.detail && e.detail.productId;
    if (productId) openModal(Number(productId));
  });
}


/* ==========================================================================
   Search Bar
   Full-screen overlay search with debounced live results
   ========================================================================== */
function initSearchBar() {
  var overlay = document.getElementById('search-overlay');
  var searchBackdrop = document.getElementById('search-backdrop');
  var closeBtn = document.getElementById('search-close');
  var searchInput = document.getElementById('search-input');
  var quickLinks = document.getElementById('search-quick-links');
  var resultsContainer = document.getElementById('search-results');
  var resultsList = document.getElementById('search-results-list');
  var noResults = document.getElementById('search-no-results');

  if (!overlay || !searchInput) return;

  // Get search product data
  var allProducts = [];
  var searchDataEl = document.getElementById('search-products-data');
  if (searchDataEl) {
    try {
      allProducts = JSON.parse(searchDataEl.textContent || '[]');
    } catch (e) {
      allProducts = [];
    }
  }

  var debounceTimer;

  function openSearch() {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { searchInput.focus(); }, 100);
  }

  function closeSearch() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    searchInput.value = '';
    showQuickLinks();
  }

  function showQuickLinks() {
    if (quickLinks) quickLinks.classList.remove('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');
  }

  function showResults(matches) {
    if (quickLinks) quickLinks.classList.add('hidden');
    if (resultsContainer) resultsContainer.classList.remove('hidden');

    if (matches.length === 0) {
      if (resultsList) resultsList.innerHTML = '';
      if (noResults) noResults.classList.remove('hidden');
      return;
    }

    if (noResults) noResults.classList.add('hidden');
    if (resultsList) {
      resultsList.innerHTML = matches.slice(0, 5).map(function (p) {
        var imgHtml = p.image
          ? '<img src="' + p.image + '" alt="' + p.title + '" width="40" height="52" class="w-10 h-13 rounded-md flex-shrink-0 object-cover" />'
          : '<div class="w-10 h-13 rounded-md flex-shrink-0 flex items-center justify-center text-white/60 text-[9px]" style="background-color: ' + p.placeholderColor + '">' + p.title.substring(0, 3) + '</div>';
        var displayPrice = p.salePrice ? '$' + p.salePrice.toFixed(2) : '$' + p.price.toFixed(2);
        return '<a href="/shop/' + p.slug + '/" class="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">' +
          imgHtml +
          '<div class="flex-1 min-w-0">' +
            '<p class="text-sm font-medium text-surface-900 dark:text-white truncate">' + p.title + '</p>' +
            '<p class="text-xs text-surface-500 dark:text-surface-400 capitalize">' + p.category + '</p>' +
          '</div>' +
          '<span class="text-sm font-semibold text-surface-900 dark:text-white">' + displayPrice + '</span>' +
        '</a>';
      }).join('');
    }
  }

  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var query = searchInput.value.trim().toLowerCase();
      if (query.length === 0) {
        showQuickLinks();
        return;
      }
      var matches = allProducts.filter(function (p) {
        return p.title.toLowerCase().indexOf(query) !== -1 || p.category.toLowerCase().indexOf(query) !== -1;
      });
      showResults(matches);
    }, 200);
  });

  document.addEventListener('bazaar:open-search', openSearch);
  if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeSearch();
    }
  });

  // Also handle header search trigger opening the full overlay
  var headerSearchTrigger = document.getElementById('search-trigger');
  if (headerSearchTrigger) {
    headerSearchTrigger.addEventListener('click', openSearch);
  }
}


/* ==========================================================================
   Back to Top
   Fixed button that appears on scroll, smoothly scrolls to top
   ========================================================================== */
function initBackToTop() {
  var btn = document.querySelector('.back-to-top');
  if (!btn) return;

  function toggle() {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      btn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    } else {
      btn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      btn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
  }

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ==========================================================================
   Newsletter Popup
   Timed modal (5s delay), dismiss to localStorage, email capture
   ========================================================================== */
function initNewsletterPopup() {
  var popup = document.querySelector('.newsletter-popup');
  if (!popup) return;
  if (localStorage.getItem('bazaar-newsletter-dismissed')) return;

  var modal = popup.querySelector('.newsletter-modal');
  var popupBackdrop = popup.querySelector('.newsletter-backdrop');
  var closeBtn = popup.querySelector('.newsletter-close');
  var noThanks = popup.querySelector('.newsletter-no-thanks');
  var form = popup.querySelector('.newsletter-popup-form');

  function show() {
    popup.classList.remove('hidden');
    popup.classList.add('flex');
    requestAnimationFrame(function () {
      if (modal) {
        modal.classList.remove('scale-95', 'opacity-0');
        modal.classList.add('scale-100', 'opacity-100');
      }
    });
  }

  function dismiss() {
    if (modal) {
      modal.classList.add('scale-95', 'opacity-0');
      modal.classList.remove('scale-100', 'opacity-100');
    }
    setTimeout(function () {
      popup.classList.add('hidden');
      popup.classList.remove('flex');
    }, 300);
    localStorage.setItem('bazaar-newsletter-dismissed', 'true');
  }

  var timer = setTimeout(show, 5000);

  if (closeBtn) closeBtn.addEventListener('click', dismiss);
  if (noThanks) noThanks.addEventListener('click', dismiss);
  if (popupBackdrop) popupBackdrop.addEventListener('click', dismiss);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !popup.classList.contains('hidden')) dismiss();
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        form.innerHTML = '<p class="text-center text-emerald-600 dark:text-emerald-400 font-medium py-2">Thanks for subscribing! Check your inbox for your 15% off code.</p>';
        setTimeout(dismiss, 3000);
      }
    });
  }

  // Allow programmatic opening from features page
  document.addEventListener('bazaar:open-newsletter', function () {
    localStorage.removeItem('bazaar-newsletter-dismissed');
    clearTimeout(timer);
    show();
  });
}


/* ==========================================================================
   Announcement Bar
   Dismissible top bar with sessionStorage persistence
   ========================================================================== */
function initAnnouncementBar() {
  var bar = document.getElementById('announcement-bar');
  var btn = document.getElementById('dismiss-announcement');
  if (!bar || !btn) return;

  if (sessionStorage.getItem('bazaar-announcement-dismissed')) {
    bar.style.display = 'none';
  }

  btn.addEventListener('click', function () {
    bar.style.display = 'none';
    sessionStorage.setItem('bazaar-announcement-dismissed', '1');
  });
}


/* ==========================================================================
   Mobile Bottom Nav
   Fixed bottom bar with search/cart triggers and badge updates
   ========================================================================== */
function initMobileBottomNav() {
  var nav = document.querySelector('.mobile-bottom-nav');
  if (!nav) return;

  // Active state based on current path
  var path = window.location.pathname;
  nav.querySelectorAll('.mobile-nav-item').forEach(function (item) {
    var itemPath = item.getAttribute('data-path');
    var isActive = itemPath === '/' ? path === '/' : path.indexOf(itemPath) === 0;
    if (isActive) {
      item.classList.remove('text-surface-400', 'dark:text-surface-500');
      item.classList.add('text-primary-500', 'dark:text-primary-400');
    }
  });

  // Cart badge
  function updateCartBadge() {
    var count = getCartCount();
    var badge = nav.querySelector('.mobile-cart-badge');
    if (badge) {
      badge.textContent = String(count);
      badge.classList.toggle('hidden', count === 0);
    }
  }

  // Wishlist badge
  function updateWishlistBadge() {
    var wishlist = getWishlist();
    var badge = nav.querySelector('.mobile-wishlist-badge');
    if (badge) {
      badge.textContent = String(wishlist.length);
      badge.classList.toggle('hidden', wishlist.length === 0);
    }
  }

  updateCartBadge();
  updateWishlistBadge();
  document.addEventListener('bazaar:cart-updated', updateCartBadge);
  document.addEventListener('bazaar:wishlist-updated', updateWishlistBadge);

  // Cart button opens drawer
  var cartBtn = nav.querySelector('.mobile-nav-cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('bazaar:open-cart'));
    });
  }

  // Search button opens search overlay
  var searchBtn = nav.querySelector('.mobile-nav-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('bazaar:open-search'));
    });
  }
}


/* ==========================================================================
   Product Cards
   Wishlist, compare, quick-view, and quick-add hover button handlers
   ========================================================================== */
function initProductCards() {
  // Wishlist buttons
  function updateWishlistButtons() {
    var wishlist = getWishlist();
    document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
      var id = Number(btn.getAttribute('data-product-id'));
      var exists = wishlist.some(function (item) { return item.id === id; });
      var svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', exists ? 'currentColor' : 'none');
      }
      btn.classList.toggle('text-primary-500', exists);
      btn.classList.toggle('text-surface-400', !exists);
    });
  }

  document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var id = Number(btn.getAttribute('data-product-id'));
      var exists = isInWishlist(id);
      if (exists) {
        removeFromWishlist(id);
      } else {
        addToWishlist({
          id: id,
          slug: btn.getAttribute('data-product-slug') || '',
          title: btn.getAttribute('data-product-title') || '',
          price: Number(btn.getAttribute('data-product-price')),
          salePrice: btn.getAttribute('data-product-sale-price') ? Number(btn.getAttribute('data-product-sale-price')) : null,
          image: btn.getAttribute('data-product-image') || '',
          placeholderColor: btn.getAttribute('data-product-color') || ''
        });
      }
      updateWishlistButtons();
    });
  });

  updateWishlistButtons();
  document.addEventListener('bazaar:wishlist-updated', updateWishlistButtons);

  // Compare buttons
  function updateCompareButtons() {
    var compare = getCompareList();
    document.querySelectorAll('.compare-btn').forEach(function (btn) {
      var id = Number(btn.getAttribute('data-product-id'));
      var exists = compare.some(function (item) { return item.id === id; });
      btn.classList.toggle('!bg-secondary-500', exists);
      btn.classList.toggle('!text-white', exists);
    });
  }

  document.querySelectorAll('.compare-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var id = Number(btn.getAttribute('data-product-id'));
      var exists = isInCompare(id);
      if (exists) {
        removeFromCompare(id);
      } else {
        addToCompare({
          id: id,
          slug: btn.getAttribute('data-product-slug') || '',
          title: btn.getAttribute('data-product-title') || '',
          price: Number(btn.getAttribute('data-product-price')),
          salePrice: btn.getAttribute('data-product-sale-price') ? Number(btn.getAttribute('data-product-sale-price')) : null,
          image: btn.getAttribute('data-product-image') || '',
          placeholderColor: btn.getAttribute('data-product-placeholder') || ''
        });
      }
      updateCompareButtons();
    });
  });

  updateCompareButtons();
  document.addEventListener('bazaar:compare-updated', updateCompareButtons);

  // Quick View triggers
  document.querySelectorAll('.quickview-trigger').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var productId = btn.getAttribute('data-product-id');
      document.dispatchEvent(new CustomEvent('bazaar:quickview-open', {
        detail: { productId: productId }
      }));
    });
  });

  // Quick Add buttons
  document.querySelectorAll('.quick-add-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (btn.getAttribute('data-product-instock') === 'false') return;

      var id = Number(btn.getAttribute('data-product-id'));
      var size = btn.getAttribute('data-product-size') || '';
      var color = btn.getAttribute('data-product-color-name') || '';

      addToCart({
        id: id,
        slug: btn.getAttribute('data-product-slug') || '',
        title: btn.getAttribute('data-product-title') || '',
        price: Number(btn.getAttribute('data-product-price')),
        salePrice: btn.getAttribute('data-product-sale-price') ? Number(btn.getAttribute('data-product-sale-price')) : null,
        size: size,
        color: color,
        quantity: 1,
        image: btn.getAttribute('data-product-image') || '',
        placeholderColor: btn.getAttribute('data-product-placeholder') || ''
      });

      // Success feedback
      var svg = btn.querySelector('svg');
      var origHTML = svg ? svg.outerHTML : '';
      btn.innerHTML = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>';
      btn.classList.add('!bg-emerald-500', '!text-white');
      setTimeout(function () {
        btn.innerHTML = origHTML;
        btn.classList.remove('!bg-emerald-500', '!text-white');
      }, 1200);
    });
  });
}


/* ==========================================================================
   Countdown Timers
   Finds [data-countdown] elements or sale banner IDs and updates every second
   ========================================================================== */
function initCountdownTimers() {
  // Sale banner countdown
  var daysEl = document.getElementById('countdown-days');
  var hoursEl = document.getElementById('countdown-hours');
  var minsEl = document.getElementById('countdown-mins');
  var secsEl = document.getElementById('countdown-secs');

  if (daysEl && hoursEl && minsEl && secsEl) {
    initSingleCountdown(daysEl, hoursEl, minsEl, secsEl, 3);
  }

  // Coming soon page countdown (30 days)
  var csDays = document.getElementById('cs-countdown-days');
  var csHours = document.getElementById('cs-countdown-hours');
  var csMins = document.getElementById('cs-countdown-mins');
  var csSecs = document.getElementById('cs-countdown-secs');

  if (csDays && csHours && csMins && csSecs) {
    initSingleCountdown(csDays, csHours, csMins, csSecs, 30);
  }

  // Sale page countdown
  var saleDays = document.getElementById('sale-countdown-days');
  var saleHours = document.getElementById('sale-countdown-hours');
  var saleMins = document.getElementById('sale-countdown-mins');
  var saleSecs = document.getElementById('sale-countdown-secs');

  if (saleDays && saleHours && saleMins && saleSecs) {
    initSingleCountdown(saleDays, saleHours, saleMins, saleSecs, 3);
  }
}

function initSingleCountdown(daysEl, hoursEl, minsEl, secsEl, daysFromNow) {
  var target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  target.setHours(23, 59, 59, 0);
  var targetTime = target.getTime();

  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  function update() {
    var now = Date.now();
    var diff = targetTime - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent = pad(m);
    secsEl.textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
}


/* ==========================================================================
   FAQ Accordions
   Single-open accordion behavior for FAQ page (<details>/<summary> or custom)
   ========================================================================== */
function initFaqAccordions() {
  document.querySelectorAll('.faq-accordion').forEach(function (accordion) {
    var triggers = accordion.querySelectorAll('[data-faq-trigger]');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('[data-faq-item]');
        if (!item) return;

        var content = item.querySelector('[data-faq-content]');
        var chevron = trigger.querySelector('.faq-chevron');
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          trigger.setAttribute('aria-expanded', 'false');
          if (content) content.style.maxHeight = '0px';
          if (chevron) chevron.classList.remove('rotate-180');
        } else {
          // Close all others in this group
          triggers.forEach(function (t) {
            var otherItem = t.closest('[data-faq-item]');
            if (!otherItem) return;
            var otherContent = otherItem.querySelector('[data-faq-content]');
            var otherChevron = t.querySelector('.faq-chevron');
            t.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.style.maxHeight = '0px';
            if (otherChevron) otherChevron.classList.remove('rotate-180');
          });
          trigger.setAttribute('aria-expanded', 'true');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
          if (chevron) chevron.classList.add('rotate-180');
        }
      });
    });
  });
}


/* ==========================================================================
   Product Accordions
   Single-open accordion for product detail page (Details/Shipping/Care etc.)
   ========================================================================== */
function initProductAccordions() {
  document.querySelectorAll('.product-accordion').forEach(function (accordion) {
    var triggers = accordion.querySelectorAll('[data-accordion-trigger]');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('[data-accordion-item]');
        if (!item) return;

        var content = item.querySelector('[data-accordion-content]');
        var chevron = trigger.querySelector('.accordion-chevron');
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          trigger.setAttribute('aria-expanded', 'false');
          if (content) content.style.maxHeight = '0px';
          if (chevron) chevron.classList.remove('rotate-180');
        } else {
          // Close all others
          triggers.forEach(function (t) {
            var otherItem = t.closest('[data-accordion-item]');
            if (!otherItem) return;
            var otherContent = otherItem.querySelector('[data-accordion-content]');
            var otherChevron = t.querySelector('.accordion-chevron');
            t.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.style.maxHeight = '0px';
            if (otherChevron) otherChevron.classList.remove('rotate-180');
          });
          trigger.setAttribute('aria-expanded', 'true');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
          if (chevron) chevron.classList.add('rotate-180');
        }
      });
    });
  });
}


/* ==========================================================================
   Share Buttons
   Copy link to clipboard with visual feedback
   ========================================================================== */
function initShareButtons() {
  document.querySelectorAll('.copy-link-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-url') || window.location.href;
      navigator.clipboard.writeText(url).then(function () {
        var copyIcon = btn.querySelector('.copy-icon');
        var checkIcon = btn.querySelector('.check-icon');
        if (copyIcon && checkIcon) {
          copyIcon.classList.add('hidden');
          checkIcon.classList.remove('hidden');
          setTimeout(function () {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
          }, 2000);
        }
      }).catch(function () {
        // Clipboard API not available
      });
    });
  });
}


/* ==========================================================================
   Newsletter Form (inline, not popup)
   Handles the newsletter signup section form submission
   ========================================================================== */
function initNewsletterForm() {
  var form = document.getElementById('newsletter-form');
  var successMsg = document.getElementById('newsletter-success');

  if (!form || !successMsg) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('hidden');
    successMsg.classList.remove('hidden');
  });
}


/* ==========================================================================
   Sort Dropdown
   Dispatches sort-change event when selection changes
   ========================================================================== */
function initSortDropdown() {
  var sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', function () {
    document.dispatchEvent(new CustomEvent('bazaar:sort-change', {
      detail: { sort: sortSelect.value }
    }));
  });

  // Listen for sort changes and apply
  document.addEventListener('bazaar:sort-change', function (e) {
    var sort = e.detail && e.detail.sort;
    if (sort) {
      sortProducts(sort);
      // Update URL
      var state = getFilterState();
      state.sort = sort;
      updateURLParams(state);
    }
  });
}


/* ==========================================================================
   Filter Sidebar
   Mobile toggle, category/size/color/price/stock filters, active filter tags
   ========================================================================== */
function initFilterSidebar() {
  var toggleBtn = document.getElementById('filter-toggle');
  var filterPanel = document.getElementById('filter-panel');
  var chevron = document.getElementById('filter-chevron');
  var clearBtn = document.getElementById('clear-filters');
  var activeFiltersBar = document.getElementById('active-filters');
  var activeFilterTags = document.getElementById('active-filter-tags');
  var clearAllBtn = document.getElementById('clear-all-filters');

  if (!toggleBtn || !filterPanel) return;

  // Mobile toggle
  toggleBtn.addEventListener('click', function () {
    if (filterPanel.classList.contains('hidden')) {
      filterPanel.classList.remove('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.classList.add('rotate-180');
    } else {
      if (window.innerWidth < 1024) {
        filterPanel.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (chevron) chevron.classList.remove('rotate-180');
      }
    }
  });

  var sizeBtns = document.querySelectorAll('.size-filter-btn');
  var colorBtns = document.querySelectorAll('.color-filter-btn');
  var categoryChecks = document.querySelectorAll('input[name="category"]');
  var priceMin = document.getElementById('price-min');
  var priceMax = document.getElementById('price-max');
  var inStockToggle = document.getElementById('in-stock-toggle');

  // Size filter buttons
  sizeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isActive = btn.getAttribute('data-active') === 'true';
      if (isActive) {
        btn.setAttribute('data-active', 'false');
        btn.className = 'size-filter-btn px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300';
      } else {
        btn.setAttribute('data-active', 'true');
        btn.className = 'size-filter-btn px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer border-primary-500 dark:border-primary-500 bg-primary-500 dark:bg-primary-500 text-white';
      }
      dispatchFilterChange();
    });
  });

  // Color filter buttons
  colorBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isActive = btn.getAttribute('data-active') === 'true';
      if (isActive) {
        btn.setAttribute('data-active', 'false');
        btn.classList.remove('ring-2', 'ring-primary-500');
      } else {
        btn.setAttribute('data-active', 'true');
        btn.classList.add('ring-2', 'ring-primary-500');
      }
      dispatchFilterChange();
    });
  });

  // Category checkboxes
  categoryChecks.forEach(function (cb) {
    cb.addEventListener('change', function () { dispatchFilterChange(); });
  });

  // Price inputs
  if (priceMin) priceMin.addEventListener('input', function () { dispatchFilterChange(); });
  if (priceMax) priceMax.addEventListener('input', function () { dispatchFilterChange(); });

  // In-stock toggle
  if (inStockToggle) inStockToggle.addEventListener('change', function () { dispatchFilterChange(); });

  // Clear all filters
  function clearAllFilters() {
    categoryChecks.forEach(function (cb) { cb.checked = false; });
    sizeBtns.forEach(function (btn) {
      btn.setAttribute('data-active', 'false');
      btn.className = 'size-filter-btn px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300';
    });
    colorBtns.forEach(function (btn) {
      btn.setAttribute('data-active', 'false');
      btn.classList.remove('ring-2', 'ring-primary-500');
    });
    if (priceMin) priceMin.value = '';
    if (priceMax) priceMax.value = '';
    if (inStockToggle) inStockToggle.checked = false;
    dispatchFilterChange();
  }

  if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);
  if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllFilters);

  function dispatchFilterChange() {
    var selectedCategories = [];
    categoryChecks.forEach(function (cb) {
      if (cb.checked) selectedCategories.push(cb.value);
    });

    var selectedSizes = [];
    sizeBtns.forEach(function (btn) {
      if (btn.getAttribute('data-active') === 'true' && btn.getAttribute('data-size')) {
        selectedSizes.push(btn.getAttribute('data-size'));
      }
    });

    var selectedColors = [];
    colorBtns.forEach(function (btn) {
      if (btn.getAttribute('data-active') === 'true' && btn.getAttribute('data-color')) {
        selectedColors.push(btn.getAttribute('data-color'));
      }
    });

    var filterState = {
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      priceMin: priceMin && priceMin.value ? parseFloat(priceMin.value) : null,
      priceMax: priceMax && priceMax.value ? parseFloat(priceMax.value) : null,
      inStock: inStockToggle ? inStockToggle.checked : false
    };

    document.dispatchEvent(new CustomEvent('bazaar:filter-change', { detail: filterState }));
    renderActiveFilters(filterState);
  }

  // Listen for filter-change events to apply filters
  document.addEventListener('bazaar:filter-change', function (e) {
    var state = e.detail;
    // Merge with current sort
    var currentState = getFilterState();
    state.sort = currentState.sort;
    var cards = document.querySelectorAll('[data-product-card]');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var visible = true;

      if (state.categories && state.categories.length) {
        var cat = card.getAttribute('data-category') || '';
        if (state.categories.indexOf(cat) === -1) visible = false;
      }

      if (state.priceMin !== null && state.priceMin !== undefined) {
        var price = Number(card.getAttribute('data-price') || 0);
        if (price < state.priceMin) visible = false;
      }

      if (state.priceMax !== null && state.priceMax !== undefined) {
        var price = Number(card.getAttribute('data-price') || 0);
        if (price > state.priceMax) visible = false;
      }

      if (state.sizes && state.sizes.length) {
        var sizes = (card.getAttribute('data-sizes') || '').split(',');
        var hasSize = state.sizes.some(function (s) { return sizes.indexOf(s) !== -1; });
        if (!hasSize) visible = false;
      }

      if (state.colors && state.colors.length) {
        var colors = (card.getAttribute('data-colors') || '').split(',');
        var hasColor = state.colors.some(function (c) { return colors.indexOf(c) !== -1; });
        if (!hasColor) visible = false;
      }

      if (state.inStock) {
        if (card.getAttribute('data-instock') !== 'true') visible = false;
      }

      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    var countEl = document.getElementById('product-count');
    if (countEl) {
      countEl.textContent = 'Showing ' + visibleCount + ' product' + (visibleCount !== 1 ? 's' : '');
    }

    sortProducts(state.sort || 'featured');
    updateURLParams(state);
  });

  // Render active filter tags
  function renderActiveFilters(state) {
    if (!activeFiltersBar || !activeFilterTags) return;

    var tags = [];

    if (state.categories) {
      state.categories.forEach(function (c) {
        tags.push({ label: c.charAt(0).toUpperCase() + c.slice(1), type: 'category', value: c });
      });
    }
    if (state.sizes) {
      state.sizes.forEach(function (s) {
        tags.push({ label: 'Size: ' + s, type: 'size', value: s });
      });
    }
    if (state.colors) {
      state.colors.forEach(function (c) {
        tags.push({ label: 'Color: ' + c, type: 'color', value: c });
      });
    }
    if (state.priceMin !== null) tags.push({ label: 'Min: $' + state.priceMin, type: 'priceMin', value: '' });
    if (state.priceMax !== null) tags.push({ label: 'Max: $' + state.priceMax, type: 'priceMax', value: '' });
    if (state.inStock) tags.push({ label: 'In Stock', type: 'inStock', value: '' });

    if (tags.length === 0) {
      activeFiltersBar.classList.add('hidden');
      activeFiltersBar.classList.remove('flex');
      return;
    }

    activeFiltersBar.classList.remove('hidden');
    activeFiltersBar.classList.add('flex');

    activeFilterTags.innerHTML = tags.map(function (tag) {
      return '<button type="button" class="active-filter-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors cursor-pointer" data-type="' + tag.type + '" data-value="' + tag.value + '">' +
        tag.label +
        '<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>' +
      '</button>';
    }).join('');

    // Bind remove handlers
    activeFilterTags.querySelectorAll('.active-filter-tag').forEach(function (tag) {
      tag.addEventListener('click', function () {
        var type = tag.getAttribute('data-type');
        var value = tag.getAttribute('data-value');

        if (type === 'category') {
          categoryChecks.forEach(function (cb) { if (cb.value === value) cb.checked = false; });
        } else if (type === 'size') {
          sizeBtns.forEach(function (b) {
            if (b.getAttribute('data-size') === value) {
              b.setAttribute('data-active', 'false');
              b.className = 'size-filter-btn px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300';
            }
          });
        } else if (type === 'color') {
          colorBtns.forEach(function (b) {
            if (b.getAttribute('data-color') === value) {
              b.setAttribute('data-active', 'false');
              b.classList.remove('ring-2', 'ring-primary-500');
            }
          });
        } else if (type === 'priceMin' && priceMin) {
          priceMin.value = '';
        } else if (type === 'priceMax' && priceMax) {
          priceMax.value = '';
        } else if (type === 'inStock' && inStockToggle) {
          inStockToggle.checked = false;
        }

        dispatchFilterChange();
      });
    });
  }
}


/* ==========================================================================
   Theme Toggle
   Dark/light mode toggle button handler
   ========================================================================== */
function initThemeToggle() {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    toggleTheme();
  });

  // Also handle custom events from features page
  document.addEventListener('toggle-dark-mode', function () {
    toggleTheme();
  });
}


/* ==========================================================================
   Language Switcher
   Desktop dropdown language selector
   ========================================================================== */
function initLanguageSwitcher() {
  var langToggle = document.getElementById('lang-toggle');
  var dropdown = document.getElementById('lang-dropdown');
  if (!langToggle || !dropdown) return;

  function updateChecks() {
    var locale = getLocale();
    dropdown.querySelectorAll('.lang-option').forEach(function (btn) {
      var check = btn.querySelector('.lang-check');
      if (check) {
        check.classList.toggle('hidden', btn.getAttribute('data-locale') !== locale);
      }
    });
  }
  updateChecks();

  // Toggle dropdown
  langToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  // Select locale
  dropdown.querySelectorAll('.lang-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var locale = btn.getAttribute('data-locale') || 'en';
      setLocale(locale);
      updateChecks();
      dropdown.classList.add('hidden');
    });
  });

  // Close on outside click
  document.addEventListener('click', function () {
    dropdown.classList.add('hidden');
  });

  dropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}


/* ==========================================================================
   Sticky Add to Cart
   Fixed bottom bar on product pages, appears when main button scrolls away
   ========================================================================== */
function initStickyAddToCart() {
  var stickyBar = document.querySelector('[data-sticky-bar]');
  if (!stickyBar) return;

  // Show/hide based on main add-to-cart button visibility
  var mainBtn = document.querySelector('.add-to-cart-btn');
  if (!mainBtn) return;

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      stickyBar.classList.add('translate-y-full');
    } else {
      stickyBar.classList.remove('translate-y-full');
    }
  }, { threshold: 0 });
  observer.observe(mainBtn);

  // Add to cart
  var atcBtn = stickyBar.querySelector('.sticky-atc-btn');
  var atcText = stickyBar.querySelector('.sticky-atc-text');
  var sizeSelect = stickyBar.querySelector('.sticky-size-select');

  if (atcBtn) {
    atcBtn.addEventListener('click', function () {
      var selectedSize = sizeSelect ? sizeSelect.value : '';

      addToCart({
        id: Number(stickyBar.getAttribute('data-product-id')),
        slug: stickyBar.getAttribute('data-product-slug') || '',
        title: stickyBar.getAttribute('data-product-title') || '',
        price: Number(stickyBar.getAttribute('data-product-price')),
        salePrice: stickyBar.getAttribute('data-product-sale-price') ? Number(stickyBar.getAttribute('data-product-sale-price')) : null,
        size: selectedSize,
        color: '',
        quantity: 1,
        image: stickyBar.getAttribute('data-product-image') || '',
        placeholderColor: stickyBar.getAttribute('data-product-color') || ''
      });

      if (atcText) {
        var orig = atcText.textContent;
        atcText.textContent = 'Added!';
        setTimeout(function () { atcText.textContent = orig; }, 1500);
      }
    });
  }
}


/* ==========================================================================
   Grid/List View Toggle
   Switches product grid between grid and list layout with localStorage
   ========================================================================== */
function initGridListToggle() {
  var gridBtn = document.getElementById('view-grid');
  var listBtn = document.getElementById('view-list');
  var productGrid = document.getElementById('product-grid');

  if (!gridBtn || !listBtn || !productGrid) return;

  function setView(view) {
    setShopView(view);
    if (view === 'list') {
      productGrid.classList.remove('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
      productGrid.classList.add('grid-cols-1');
      gridBtn.classList.remove('bg-surface-200', 'dark:bg-surface-700', 'text-surface-900', 'dark:text-white');
      gridBtn.classList.add('text-surface-400');
      listBtn.classList.add('bg-surface-200', 'dark:bg-surface-700', 'text-surface-900', 'dark:text-white');
      listBtn.classList.remove('text-surface-400');
    } else {
      productGrid.classList.remove('grid-cols-1');
      productGrid.classList.add('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
      listBtn.classList.remove('bg-surface-200', 'dark:bg-surface-700', 'text-surface-900', 'dark:text-white');
      listBtn.classList.add('text-surface-400');
      gridBtn.classList.add('bg-surface-200', 'dark:bg-surface-700', 'text-surface-900', 'dark:text-white');
      gridBtn.classList.remove('text-surface-400');
    }
  }

  // Init from localStorage
  setView(getShopView());

  gridBtn.addEventListener('click', function () { setView('grid'); });
  listBtn.addEventListener('click', function () { setView('list'); });
}


/* ==========================================================================
   Load More
   Shows additional product cards in batches
   ========================================================================== */
function initLoadMore() {
  var loadMoreBtn = document.getElementById('load-more-btn');
  if (!loadMoreBtn) return;

  var batchSize = 6;
  var productGrid = document.getElementById('product-grid');
  if (!productGrid) return;

  var allCards = Array.prototype.slice.call(productGrid.querySelectorAll('[data-product-card]'));
  var visibleLimit = parseInt(loadMoreBtn.getAttribute('data-initial') || '12', 10);

  // Hide cards beyond initial limit
  allCards.forEach(function (card, index) {
    if (index >= visibleLimit) {
      card.classList.add('hidden');
      card.setAttribute('data-load-hidden', 'true');
    }
  });

  // Update button visibility
  function updateBtn() {
    var hidden = productGrid.querySelectorAll('[data-load-hidden="true"]');
    if (hidden.length === 0) {
      loadMoreBtn.classList.add('hidden');
    }
  }
  updateBtn();

  loadMoreBtn.addEventListener('click', function () {
    var hidden = Array.prototype.slice.call(productGrid.querySelectorAll('[data-load-hidden="true"]'));
    var toShow = hidden.slice(0, batchSize);
    toShow.forEach(function (card) {
      card.classList.remove('hidden');
      card.removeAttribute('data-load-hidden');
    });
    updateBtn();
  });
}


/* ==========================================================================
   Checkout Form (single page)
   Billing same-as-shipping toggle, form validation, demo submit
   ========================================================================== */
function initCheckoutForm() {
  var sameAsShipping = document.getElementById('same-as-shipping');
  var billingFields = document.getElementById('billing-fields');
  var checkoutForm = document.getElementById('checkout-form');

  if (sameAsShipping && billingFields) {
    sameAsShipping.addEventListener('change', function () {
      if (sameAsShipping.checked) {
        billingFields.classList.add('hidden');
      } else {
        billingFields.classList.remove('hidden');
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearCart();
      alert('Order placed successfully! (Demo)');
      window.location.href = '/';
    });
  }
}


/* ==========================================================================
   Checkout Multi-Step
   3-step wizard with step navigation and validation
   ========================================================================== */
function initCheckoutMultiStep() {
  var container = document.getElementById('checkout-multistep');
  if (!container) return;

  var steps = container.querySelectorAll('[data-step]');
  var stepIndicators = container.querySelectorAll('[data-step-indicator]');
  var nextBtns = container.querySelectorAll('[data-step-next]');
  var prevBtns = container.querySelectorAll('[data-step-prev]');
  var placeOrderBtn = container.querySelector('[data-place-order]');
  var currentStep = 1;

  function showStep(step) {
    currentStep = step;
    steps.forEach(function (s) {
      var stepNum = parseInt(s.getAttribute('data-step'), 10);
      if (stepNum === step) {
        s.classList.remove('hidden');
      } else {
        s.classList.add('hidden');
      }
    });

    // Update indicators
    stepIndicators.forEach(function (ind) {
      var indStep = parseInt(ind.getAttribute('data-step-indicator'), 10);
      ind.classList.remove('step-active', 'step-completed', 'step-future');
      if (indStep < step) {
        ind.classList.add('step-completed');
      } else if (indStep === step) {
        ind.classList.add('step-active');
      } else {
        ind.classList.add('step-future');
      }
    });

    // Populate review step if step 3
    if (step === 3) {
      populateReview();
    }
  }

  function validateStep(step) {
    var stepEl = container.querySelector('[data-step="' + step + '"]');
    if (!stepEl) return true;
    var required = stepEl.querySelectorAll('[required]');
    var valid = true;
    required.forEach(function (input) {
      if (!input.value.trim()) {
        input.classList.add('!border-red-500');
        valid = false;
      } else {
        input.classList.remove('!border-red-500');
      }
    });
    return valid;
  }

  function populateReview() {
    // Collect shipping info
    var reviewShipping = document.getElementById('review-shipping');
    var reviewBilling = document.getElementById('review-billing');
    var reviewItems = document.getElementById('review-items');
    var reviewSubtotal = document.getElementById('review-subtotal');
    var reviewShippingCost = document.getElementById('review-shipping-cost');
    var reviewTax = document.getElementById('review-tax');
    var reviewTotal = document.getElementById('review-total');

    if (reviewShipping) {
      var firstName = container.querySelector('[name="shipping-first-name"]');
      var lastName = container.querySelector('[name="shipping-last-name"]');
      var address = container.querySelector('[name="shipping-address"]');
      var city = container.querySelector('[name="shipping-city"]');
      var state = container.querySelector('[name="shipping-state"]');
      var zip = container.querySelector('[name="shipping-zip"]');

      reviewShipping.innerHTML =
        '<p class="font-medium">' + (firstName ? firstName.value : '') + ' ' + (lastName ? lastName.value : '') + '</p>' +
        '<p class="text-sm text-surface-500">' + (address ? address.value : '') + '</p>' +
        '<p class="text-sm text-surface-500">' + (city ? city.value : '') + ', ' + (state ? state.value : '') + ' ' + (zip ? zip.value : '') + '</p>';
    }

    if (reviewBilling) {
      var billingSame = container.querySelector('[name="billing-same"]');
      if (billingSame && billingSame.checked) {
        reviewBilling.innerHTML = '<p class="text-sm text-surface-500">Same as shipping address</p>';
      } else {
        var bFirstName = container.querySelector('[name="billing-first-name"]');
        var bAddress = container.querySelector('[name="billing-address"]');
        reviewBilling.innerHTML =
          '<p class="font-medium">' + (bFirstName ? bFirstName.value : '') + '</p>' +
          '<p class="text-sm text-surface-500">' + (bAddress ? bAddress.value : '') + '</p>';
      }
    }

    // Cart items
    var cart = getCart();
    var subtotal = getCartTotal();
    var shippingCost = subtotal >= 99 ? 0 : 9.95;
    var tax = subtotal * 0.08;
    var total = subtotal + shippingCost + tax;

    if (reviewItems) {
      reviewItems.innerHTML = cart.map(function (item) {
        var itemPrice = item.salePrice != null ? item.salePrice : item.price;
        return '<div class="flex justify-between text-sm">' +
          '<span>' + item.title + ' x' + item.quantity + '</span>' +
          '<span>$' + (itemPrice * item.quantity).toFixed(2) + '</span>' +
        '</div>';
      }).join('');
    }

    if (reviewSubtotal) reviewSubtotal.textContent = '$' + subtotal.toFixed(2);
    if (reviewShippingCost) reviewShippingCost.textContent = shippingCost === 0 ? 'Free' : '$' + shippingCost.toFixed(2);
    if (reviewTax) reviewTax.textContent = '$' + tax.toFixed(2);
    if (reviewTotal) reviewTotal.textContent = '$' + total.toFixed(2);
  }

  nextBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        showStep(currentStep + 1);
      }
    });
  });

  prevBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showStep(currentStep - 1);
    });
  });

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function (e) {
      e.preventDefault();
      clearCart();
      alert('Order placed successfully! (Demo)');
      window.location.href = '/';
    });
  }

  showStep(1);
}


/* ==========================================================================
   Product Gallery
   Thumbnail selection, hover zoom lens, lightbox modal
   ========================================================================== */
function initProductGallery() {
  var mainImage = document.getElementById('gallery-main-image');
  var thumbnails = document.querySelectorAll('.gallery-thumbnail');
  var zoomLens = document.getElementById('gallery-zoom-lens');
  var lightbox = document.getElementById('gallery-lightbox');
  var lightboxImg = document.getElementById('lightbox-image');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');

  if (!mainImage) return;

  var currentIndex = 0;
  var imageSources = [];

  thumbnails.forEach(function (thumb, index) {
    var src = thumb.getAttribute('data-src') || thumb.querySelector('img')?.src || '';
    imageSources.push(src);

    thumb.addEventListener('click', function () {
      currentIndex = index;
      if (mainImage.tagName === 'IMG') {
        mainImage.src = src;
      } else {
        var img = mainImage.querySelector('img');
        if (img) img.src = src;
      }
      // Update active thumbnail
      thumbnails.forEach(function (t) {
        t.classList.remove('ring-2', 'ring-primary-500');
      });
      thumb.classList.add('ring-2', 'ring-primary-500');
    });
  });

  // Hover zoom lens
  var galleryContainer = document.getElementById('gallery-container');
  if (galleryContainer && zoomLens) {
    galleryContainer.addEventListener('mouseenter', function () {
      zoomLens.classList.remove('hidden');
    });

    galleryContainer.addEventListener('mouseleave', function () {
      zoomLens.classList.add('hidden');
    });

    galleryContainer.addEventListener('mousemove', function (e) {
      var rect = galleryContainer.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      zoomLens.style.backgroundPosition = x + '% ' + y + '%';
      zoomLens.style.left = (e.clientX - rect.left - 75) + 'px';
      zoomLens.style.top = (e.clientY - rect.top - 75) + 'px';
    });
  }

  // Lightbox
  if (galleryContainer && lightbox) {
    galleryContainer.addEventListener('click', function () {
      openLightbox(currentIndex);
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || imageSources.length === 0) return;
    currentIndex = index;
    lightboxImg.src = imageSources[currentIndex] || '';
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
      if (lightboxImg) lightboxImg.src = imageSources[currentIndex] || '';
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % imageSources.length;
      if (lightboxImg) lightboxImg.src = imageSources[currentIndex] || '';
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });
}


/* ==========================================================================
   Product Info
   Variant picker, quantity selector, add to cart on product detail page
   ========================================================================== */
function initProductInfo() {
  var productInfo = document.getElementById('product-info');
  if (!productInfo) return;

  // Size selection
  var sizeButtons = productInfo.querySelectorAll('.size-select-btn');
  var selectedSizeInput = document.getElementById('selected-size');

  sizeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sizeButtons.forEach(function (b) {
        b.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-950', 'text-primary-700', 'dark:text-primary-300', 'font-semibold');
        b.classList.add('border-surface-300', 'dark:border-surface-600', 'text-surface-700', 'dark:text-surface-300');
      });
      btn.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-primary-950', 'text-primary-700', 'dark:text-primary-300', 'font-semibold');
      btn.classList.remove('border-surface-300', 'dark:border-surface-600', 'text-surface-700', 'dark:text-surface-300');
      if (selectedSizeInput) selectedSizeInput.value = btn.getAttribute('data-size') || '';
    });
  });

  // Color selection
  var colorButtons = productInfo.querySelectorAll('.color-select-btn');
  var selectedColorInput = document.getElementById('selected-color');
  var colorNameDisplay = document.getElementById('selected-color-name');

  colorButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      colorButtons.forEach(function (b) {
        b.classList.remove('ring-2', 'ring-offset-2', 'ring-primary-500', 'dark:ring-offset-surface-900');
      });
      btn.classList.add('ring-2', 'ring-offset-2', 'ring-primary-500', 'dark:ring-offset-surface-900');
      var colorName = btn.getAttribute('data-color') || '';
      if (selectedColorInput) selectedColorInput.value = colorName;
      if (colorNameDisplay) colorNameDisplay.textContent = colorName;
    });
  });

  // Quantity selector
  var qtyMinus = productInfo.querySelector('.qty-minus');
  var qtyPlus = productInfo.querySelector('.qty-plus');
  var qtyDisplay = productInfo.querySelector('.qty-display');
  var qtyValue = 1;

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function () {
      if (qtyValue > 1) {
        qtyValue--;
        if (qtyDisplay) qtyDisplay.textContent = String(qtyValue);
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function () {
      if (qtyValue < 10) {
        qtyValue++;
        if (qtyDisplay) qtyDisplay.textContent = String(qtyValue);
      }
    });
  }

  // Main Add to Cart button
  var addToCartBtn = productInfo.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      if (addToCartBtn.disabled) return;

      var productData = {
        id: Number(productInfo.getAttribute('data-product-id')),
        slug: productInfo.getAttribute('data-product-slug') || '',
        title: productInfo.getAttribute('data-product-title') || '',
        price: Number(productInfo.getAttribute('data-product-price')),
        salePrice: productInfo.getAttribute('data-product-sale-price') ? Number(productInfo.getAttribute('data-product-sale-price')) : null,
        size: selectedSizeInput ? selectedSizeInput.value : '',
        color: selectedColorInput ? selectedColorInput.value : '',
        quantity: qtyValue,
        image: productInfo.getAttribute('data-product-image') || '',
        placeholderColor: productInfo.getAttribute('data-product-placeholder') || ''
      };

      addToCart(productData);

      // Success feedback
      var origText = addToCartBtn.textContent;
      addToCartBtn.textContent = '\u2713 Added to Cart!';
      addToCartBtn.classList.add('!bg-emerald-500', '!from-emerald-500', '!to-emerald-500');
      setTimeout(function () {
        addToCartBtn.textContent = origText;
        addToCartBtn.classList.remove('!bg-emerald-500', '!from-emerald-500', '!to-emerald-500');
      }, 2000);
    });
  }

  // Wishlist toggle on product page
  var wishlistToggle = productInfo.querySelector('.product-wishlist-toggle');
  if (wishlistToggle) {
    function updateWishlistToggle() {
      var id = Number(productInfo.getAttribute('data-product-id'));
      var inList = isInWishlist(id);
      var svg = wishlistToggle.querySelector('svg');
      if (svg) svg.setAttribute('fill', inList ? 'currentColor' : 'none');
      var text = wishlistToggle.querySelector('.wishlist-text');
      if (text) text.textContent = inList ? 'In Wishlist' : 'Add to Wishlist';
      wishlistToggle.classList.toggle('text-primary-500', inList);
    }

    wishlistToggle.addEventListener('click', function () {
      var id = Number(productInfo.getAttribute('data-product-id'));
      if (isInWishlist(id)) {
        removeFromWishlist(id);
      } else {
        addToWishlist({
          id: id,
          slug: productInfo.getAttribute('data-product-slug') || '',
          title: productInfo.getAttribute('data-product-title') || '',
          price: Number(productInfo.getAttribute('data-product-price')),
          salePrice: productInfo.getAttribute('data-product-sale-price') ? Number(productInfo.getAttribute('data-product-sale-price')) : null,
          image: productInfo.getAttribute('data-product-image') || '',
          placeholderColor: productInfo.getAttribute('data-product-placeholder') || ''
        });
      }
      updateWishlistToggle();
    });

    updateWishlistToggle();
    document.addEventListener('bazaar:wishlist-updated', updateWishlistToggle);
  }

  // Compare toggle on product page
  var compareToggle = productInfo.querySelector('.product-compare-toggle');
  if (compareToggle) {
    function updateCompareToggle() {
      var id = Number(productInfo.getAttribute('data-product-id'));
      var inList = isInCompare(id);
      var text = compareToggle.querySelector('.compare-text');
      if (text) text.textContent = inList ? 'In Compare' : 'Add to Compare';
      compareToggle.classList.toggle('text-secondary-500', inList);
    }

    compareToggle.addEventListener('click', function () {
      var id = Number(productInfo.getAttribute('data-product-id'));
      if (isInCompare(id)) {
        removeFromCompare(id);
      } else {
        addToCompare({
          id: id,
          slug: productInfo.getAttribute('data-product-slug') || '',
          title: productInfo.getAttribute('data-product-title') || '',
          price: Number(productInfo.getAttribute('data-product-price')),
          salePrice: productInfo.getAttribute('data-product-sale-price') ? Number(productInfo.getAttribute('data-product-sale-price')) : null,
          image: productInfo.getAttribute('data-product-image') || '',
          placeholderColor: productInfo.getAttribute('data-product-placeholder') || ''
        });
      }
      updateCompareToggle();
    });

    updateCompareToggle();
    document.addEventListener('bazaar:compare-updated', updateCompareToggle);
  }

  // Size guide modal
  var sizeGuideBtn = productInfo.querySelector('.size-guide-trigger');
  var sizeGuideModal = document.getElementById('size-guide-modal');
  var sizeGuideClose = document.getElementById('size-guide-close');

  if (sizeGuideBtn && sizeGuideModal) {
    sizeGuideBtn.addEventListener('click', function () {
      sizeGuideModal.classList.remove('hidden');
      sizeGuideModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  }

  if (sizeGuideClose && sizeGuideModal) {
    sizeGuideClose.addEventListener('click', function () {
      sizeGuideModal.classList.add('hidden');
      sizeGuideModal.classList.remove('flex');
      document.body.style.overflow = '';
    });
    sizeGuideModal.addEventListener('click', function (e) {
      if (e.target === sizeGuideModal) {
        sizeGuideModal.classList.add('hidden');
        sizeGuideModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  // Track recently viewed
  var slug = productInfo.getAttribute('data-product-slug');
  if (slug) trackView(slug);

  // Frequently Bought Together
  var fbtContainer = document.getElementById('fbt-container');
  if (fbtContainer) {
    var fbtAddAll = fbtContainer.querySelector('.fbt-add-all');
    var fbtChecks = fbtContainer.querySelectorAll('.fbt-check');
    var fbtTotalEl = fbtContainer.querySelector('.fbt-total');

    function updateFbtTotal() {
      var total = 0;
      fbtChecks.forEach(function (cb) {
        if (cb.checked) {
          total += Number(cb.getAttribute('data-price') || 0);
        }
      });
      if (fbtTotalEl) fbtTotalEl.textContent = '$' + total.toFixed(2);
    }

    fbtChecks.forEach(function (cb) {
      cb.addEventListener('change', updateFbtTotal);
    });

    if (fbtAddAll) {
      fbtAddAll.addEventListener('click', function () {
        fbtChecks.forEach(function (cb) {
          if (cb.checked) {
            addToCart({
              id: Number(cb.getAttribute('data-id')),
              slug: cb.getAttribute('data-slug') || '',
              title: cb.getAttribute('data-title') || '',
              price: Number(cb.getAttribute('data-original-price') || cb.getAttribute('data-price')),
              salePrice: cb.getAttribute('data-sale-price') ? Number(cb.getAttribute('data-sale-price')) : null,
              size: cb.getAttribute('data-size') || '',
              color: cb.getAttribute('data-color') || '',
              quantity: 1,
              image: cb.getAttribute('data-image') || '',
              placeholderColor: cb.getAttribute('data-placeholder') || ''
            });
          }
        });
      });
    }

    updateFbtTotal();
  }
}


/* ==========================================================================
   Account Page
   Sign in / register tabs, mock dashboard
   ========================================================================== */
function initAccountPage() {
  var authSection = document.getElementById('auth-section');
  var dashboardSection = document.getElementById('dashboard-section');
  var signInTab = document.getElementById('signin-tab');
  var registerTab = document.getElementById('register-tab');
  var signInForm = document.getElementById('signin-form');
  var registerForm = document.getElementById('register-form');
  var logoutBtn = document.getElementById('logout-btn');

  if (!authSection) return;

  // Tab switching
  if (signInTab && registerTab && signInForm && registerForm) {
    signInTab.addEventListener('click', function () {
      signInForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      signInTab.classList.add('border-primary-500', 'text-primary-600');
      signInTab.classList.remove('border-transparent', 'text-surface-500');
      registerTab.classList.remove('border-primary-500', 'text-primary-600');
      registerTab.classList.add('border-transparent', 'text-surface-500');
    });

    registerTab.addEventListener('click', function () {
      registerForm.classList.remove('hidden');
      signInForm.classList.add('hidden');
      registerTab.classList.add('border-primary-500', 'text-primary-600');
      registerTab.classList.remove('border-transparent', 'text-surface-500');
      signInTab.classList.remove('border-primary-500', 'text-primary-600');
      signInTab.classList.add('border-transparent', 'text-surface-500');
    });
  }

  // Mock sign in
  if (signInForm) {
    signInForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (authSection) authSection.classList.add('hidden');
      if (dashboardSection) dashboardSection.classList.remove('hidden');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (authSection) authSection.classList.add('hidden');
      if (dashboardSection) dashboardSection.classList.remove('hidden');
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      if (dashboardSection) dashboardSection.classList.add('hidden');
      if (authSection) authSection.classList.remove('hidden');
    });
  }
}


/* ==========================================================================
   Update All Badges
   Refreshes cart, wishlist, and compare badge counts across all locations
   ========================================================================== */
function updateAllBadges() {
  var cartCount = getCartCount();
  var wishlistCount = getWishlist().length;
  var compareCount = getCompareCount();

  // Header badges
  var cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
    cartBadge.textContent = String(cartCount);
    cartBadge.classList.toggle('hidden', cartCount === 0);
  }

  var wishlistBadge = document.getElementById('wishlist-count');
  if (wishlistBadge) {
    wishlistBadge.textContent = String(wishlistCount);
    wishlistBadge.classList.toggle('hidden', wishlistCount === 0);
  }

  var compareBadge = document.getElementById('compare-count');
  if (compareBadge) {
    compareBadge.textContent = String(compareCount);
    compareBadge.classList.toggle('hidden', compareCount === 0);
  }

  // Mobile bottom nav badges
  var mobileCartBadge = document.querySelector('.mobile-cart-badge');
  if (mobileCartBadge) {
    mobileCartBadge.textContent = String(cartCount);
    mobileCartBadge.classList.toggle('hidden', cartCount === 0);
  }

  var mobileWishlistBadge = document.querySelector('.mobile-wishlist-badge');
  if (mobileWishlistBadge) {
    mobileWishlistBadge.textContent = String(wishlistCount);
    mobileWishlistBadge.classList.toggle('hidden', wishlistCount === 0);
  }
}
