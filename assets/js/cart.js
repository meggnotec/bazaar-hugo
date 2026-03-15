/* ==========================================================================
   Cart Utilities
   localStorage-based cart management for Bazaar
   ========================================================================== */

var CART_KEY = 'bazaar-cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function addToCart(item) {
  var cart = getCart();
  var existingIndex = cart.findIndex(function (i) {
    return i.id === item.id && i.size === item.size && i.color === item.color;
  });
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent('bazaar:cart-updated'));
}

function removeFromCart(id, size, color) {
  var cart = getCart().filter(function (i) {
    return !(i.id === id && i.size === size && i.color === color);
  });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent('bazaar:cart-updated'));
}

function updateQuantity(id, size, color, quantity) {
  var cart = getCart();
  var item = cart.find(function (i) {
    return i.id === id && i.size === size && i.color === color;
  });
  if (item) {
    item.quantity = Math.max(1, quantity);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('bazaar:cart-updated'));
  }
}

function getCartCount() {
  return getCart().reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
}

function getCartTotal() {
  return getCart().reduce(function (sum, item) {
    var price = item.salePrice != null ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  document.dispatchEvent(new CustomEvent('bazaar:cart-updated'));
}
