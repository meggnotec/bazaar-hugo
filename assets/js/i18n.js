/* ==========================================================================
   i18n Utilities
   Language switching with localStorage persistence and DOM translation
   ========================================================================== */

var LOCALE_KEY = 'bazaar-locale';

function getLocale() {
  return localStorage.getItem(LOCALE_KEY) || 'en';
}

function setLocale(locale) {
  localStorage.setItem(LOCALE_KEY, locale);
  var dir = getDir(locale);
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', dir);
  applyTranslations(locale);
  document.dispatchEvent(new CustomEvent('bazaar:locale-changed', {
    detail: { locale: locale, dir: dir }
  }));
}

function getDir(locale) {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

function getTranslations() {
  var el = document.getElementById('i18n-data');
  if (!el) return {};
  try {
    return JSON.parse(el.textContent || '{}');
  } catch (e) {
    return {};
  }
}

function t(key, params) {
  var locale = getLocale();
  var translations = getTranslations();
  var dict = translations[locale] || translations['en'] || {};
  var text = dict[key] || key;
  if (params) {
    Object.keys(params).forEach(function (k) {
      text = text.replace('{' + k + '}', String(params[k]));
    });
  }
  return text;
}

function applyTranslations(locale) {
  var translations = getTranslations();
  var dict = translations[locale] || translations['en'];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(function (node) {
    var key = node.getAttribute('data-i18n') || '';
    if (dict[key]) node.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (node) {
    var key = node.getAttribute('data-i18n-placeholder') || '';
    if (dict[key]) node.placeholder = dict[key];
  });
}
