/* ==========================================================================
   Recently Viewed Utilities
   Tracks recently viewed product slugs in localStorage (max 6)
   ========================================================================== */

var RV_KEY = 'bazaar-recently-viewed';
var RV_MAX = 6;

function trackView(slug) {
  var items = getRecentlyViewed().filter(function (s) { return s !== slug; });
  items.unshift(slug);
  localStorage.setItem(RV_KEY, JSON.stringify(items.slice(0, RV_MAX)));
}

function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RV_KEY) || '[]');
  } catch (e) {
    return [];
  }
}
