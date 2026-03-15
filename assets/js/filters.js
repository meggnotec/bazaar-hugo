/* ==========================================================================
   Filter & Sort Utilities
   Product filtering via URL params, DOM data attributes, and sort reordering
   ========================================================================== */

var VIEW_KEY = 'bazaar-shop-view';

function getFilterState() {
  var params = new URLSearchParams(window.location.search);
  var catParam = params.get('cat');
  var sizesParam = params.get('sizes');
  var colorsParam = params.get('colors');

  return {
    categories: catParam ? catParam.split(',').filter(Boolean) : [],
    priceMin: params.get('min') ? Number(params.get('min')) : null,
    priceMax: params.get('max') ? Number(params.get('max')) : null,
    sizes: sizesParam ? sizesParam.split(',').filter(Boolean) : [],
    colors: colorsParam ? colorsParam.split(',').filter(Boolean) : [],
    inStock: params.get('instock') === '1',
    sort: params.get('sort') || 'featured'
  };
}

function updateURLParams(state) {
  var params = new URLSearchParams();
  if (state.categories.length) params.set('cat', state.categories.join(','));
  if (state.priceMin !== null) params.set('min', String(state.priceMin));
  if (state.priceMax !== null) params.set('max', String(state.priceMax));
  if (state.sizes.length) params.set('sizes', state.sizes.join(','));
  if (state.colors.length) params.set('colors', state.colors.join(','));
  if (state.inStock) params.set('instock', '1');
  if (state.sort !== 'featured') params.set('sort', state.sort);

  var qs = params.toString();
  var url = qs ? window.location.pathname + '?' + qs : window.location.pathname;
  window.history.replaceState({}, '', url);
}

function applyFilters() {
  var state = getFilterState();
  var cards = document.querySelectorAll('[data-product-card]');
  var visibleCount = 0;

  cards.forEach(function (card) {
    var visible = true;

    // Category filter
    if (state.categories.length) {
      var cat = card.getAttribute('data-category') || '';
      if (state.categories.indexOf(cat) === -1) visible = false;
    }

    // Price min filter
    if (state.priceMin !== null) {
      var price = Number(card.getAttribute('data-price') || 0);
      if (price < state.priceMin) visible = false;
    }

    // Price max filter
    if (state.priceMax !== null) {
      var price = Number(card.getAttribute('data-price') || 0);
      if (price > state.priceMax) visible = false;
    }

    // Size filter
    if (state.sizes.length) {
      var sizes = (card.getAttribute('data-sizes') || '').split(',');
      var hasSize = state.sizes.some(function (s) { return sizes.indexOf(s) !== -1; });
      if (!hasSize) visible = false;
    }

    // Color filter
    if (state.colors.length) {
      var colors = (card.getAttribute('data-colors') || '').split(',');
      var hasColor = state.colors.some(function (c) { return colors.indexOf(c) !== -1; });
      if (!hasColor) visible = false;
    }

    // In stock filter
    if (state.inStock) {
      if (card.getAttribute('data-instock') !== 'true') visible = false;
    }

    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  // Update product count display
  var countEl = document.getElementById('product-count');
  if (countEl) {
    countEl.textContent = 'Showing ' + visibleCount + ' product' + (visibleCount !== 1 ? 's' : '');
  }

  sortProducts(state.sort);
  updateURLParams(state);
}

function sortProducts(sort) {
  var container = document.getElementById('product-grid');
  if (!container) return;

  var cards = Array.prototype.slice.call(container.querySelectorAll('[data-product-card]'));

  cards.sort(function (a, b) {
    switch (sort) {
      case 'price-asc':
        return Number(a.getAttribute('data-price') || 0) - Number(b.getAttribute('data-price') || 0);
      case 'price-desc':
        return Number(b.getAttribute('data-price') || 0) - Number(a.getAttribute('data-price') || 0);
      case 'newest':
        return (b.getAttribute('data-isnew') === 'true' ? 1 : 0) - (a.getAttribute('data-isnew') === 'true' ? 1 : 0);
      case 'rating':
        return Number(b.getAttribute('data-rating') || 0) - Number(a.getAttribute('data-rating') || 0);
      default:
        return Number(b.getAttribute('data-featured') || 0) - Number(a.getAttribute('data-featured') || 0);
    }
  });

  cards.forEach(function (card) {
    container.appendChild(card);
  });
}

function getShopView() {
  return localStorage.getItem(VIEW_KEY) || 'grid';
}

function setShopView(view) {
  localStorage.setItem(VIEW_KEY, view);
}
