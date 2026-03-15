/* ==========================================================================
   Compare Utilities
   localStorage-based product comparison for Bazaar (max 4 items)
   ========================================================================== */

var COMPARE_KEY = 'bazaar-compare';
var COMPARE_MAX = 4;

function getCompareList() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function addToCompare(item) {
  var list = getCompareList();
  if (list.length >= COMPARE_MAX) return false;
  if (list.some(function (i) { return i.id === item.id; })) return false;
  list.push(item);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('bazaar:compare-updated'));
  return true;
}

function removeFromCompare(id) {
  var list = getCompareList().filter(function (i) { return i.id !== id; });
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('bazaar:compare-updated'));
}

function isInCompare(id) {
  return getCompareList().some(function (i) { return i.id === id; });
}

function clearCompare() {
  localStorage.removeItem(COMPARE_KEY);
  document.dispatchEvent(new CustomEvent('bazaar:compare-updated'));
}

function getCompareCount() {
  return getCompareList().length;
}
