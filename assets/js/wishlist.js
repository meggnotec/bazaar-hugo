/* ==========================================================================
   Wishlist Utilities
   localStorage-based wishlist management for Bazaar
   ========================================================================== */

var WISHLIST_KEY = 'bazaar-wishlist';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function addToWishlist(item) {
  var list = getWishlist();
  if (!list.some(function (i) { return i.id === item.id; })) {
    list.push(item);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('bazaar:wishlist-updated'));
  }
}

function removeFromWishlist(id) {
  var list = getWishlist().filter(function (i) { return i.id !== id; });
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('bazaar:wishlist-updated'));
}

function isInWishlist(id) {
  return getWishlist().some(function (i) { return i.id === id; });
}
