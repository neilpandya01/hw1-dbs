/* v17 — Families First
 * 1) Mobile menu toggle and nav dropdowns (open on hover/focus in CSS; Escape closes).
 * 2) Language menu in the utility bar.
 * 3) Current-students strip: Bell schedule and Lunch panels, one open at a time.
 * 4) Language offer: if the browser's preferred language is one Hall families
 *    often speak, offer to open the site in Google Translate, in that language.
 *    Preview with ?lang=es (or zh, pt, vi, ar). "No thanks" is remembered.
 * Without JS: the panels stay open; Language at the top needs JS, so the footer also links to Translate.
 */
(function () {
  function disclosure(btn, target, opts) {
    opts = opts || {};
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      if (opts.cls) target.classList.toggle(opts.cls, open);
      else target.hidden = !open;
      if (open && opts.onOpen) opts.onOpen();
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    [btn, target].forEach(function (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
      });
    });
    if (opts.outside) {
      document.addEventListener('click', function (e) {
        if (btn.getAttribute('aria-expanded') === 'true' && !btn.contains(e.target) && !target.contains(e.target)) set(false);
      });
    }
    return set;
  }

  /* ---------- Menu + dropdowns ---------- */
  var navBtn = document.querySelector('.primary__toggle');
  var navList = document.getElementById('primary-links');
  if (navBtn && navList) disclosure(navBtn, navList, { cls: 'is-open', outside: true });

  Array.prototype.forEach.call(document.querySelectorAll('.nav-item'), function (item) {
    var top = item.querySelector('.nav-item__link');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { item.classList.add('is-closed'); top.focus(); }
    });
    item.addEventListener('mouseleave', function () { item.classList.remove('is-closed'); });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) item.classList.remove('is-closed');
    });
  });

  /* ---------- Language menu ---------- */
  var langBtn = document.querySelector('.lang__btn');
  var langMenu = document.getElementById('lang-menu');
  if (langBtn && langMenu) {
    var setLang = disclosure(langBtn, langMenu, { outside: true });
    langMenu.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !langMenu.parentElement.contains(e.relatedTarget)) setLang(false);
    });
  }

  /* ---------- Current-students panels ---------- */
  var btns = Array.prototype.slice.call(document.querySelectorAll('.current__btn'));
  var setters = [];
  btns.forEach(function (b, i) {
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = true;
    setters[i] = disclosure(b, panel, {
      onOpen: function () { setters.forEach(function (s, j) { if (j !== i && s) s(false); }); }
    });
  });

  /* ---------- Language offer ---------- */
  var OFFERS = {
    es: { tl: 'es', q: '¿Quiere ver este sitio en español?', yes: 'Sí, traducir', no: 'No, gracias' },
    zh: { tl: 'zh-CN', q: '要用中文浏览本网站吗？', yes: '是的，翻译', no: '不用了', lang: 'zh-Hans' },
    pt: { tl: 'pt', q: 'Quer ver este site em português?', yes: 'Sim, traduzir', no: 'Não, obrigado' },
    vi: { tl: 'vi', q: 'Bạn có muốn xem trang này bằng tiếng Việt không?', yes: 'Có, dịch trang', no: 'Không, cảm ơn' },
    ar: { tl: 'ar', q: 'هل تريد عرض هذا الموقع باللغة العربية؟', yes: 'نعم، ترجم', no: 'لا، شكراً', dir: 'rtl' }
  };
  var offer = document.getElementById('lang-offer');
  if (!offer) return;

  var dismissed = false;
  try { dismissed = localStorage.getItem('hall-lang-offer') === 'no'; } catch (e) {}

  var q = /[?&]lang=([a-z]{2})/.exec(location.search);
  var prefs = q ? [q[1]] : (navigator.languages || [navigator.language || 'en']);
  var code = String(prefs[0] || 'en').slice(0, 2).toLowerCase();
  var o = OFFERS[code];
  if (!o || (dismissed && !q)) return;

  var inner = offer.querySelector('.lang-offer__inner');
  inner.setAttribute('lang', o.lang || code);
  if (o.dir) inner.setAttribute('dir', o.dir);
  document.getElementById('lang-offer-q').textContent = o.q;
  var yes = document.getElementById('lang-offer-yes');
  yes.textContent = o.yes;
  yes.href = 'https://translate.google.com/translate?sl=en&tl=' + o.tl + '&u=https://hall.whps.org';
  var no = document.getElementById('lang-offer-no');
  no.textContent = o.no;
  no.addEventListener('click', function () {
    offer.hidden = true;
    try { localStorage.setItem('hall-lang-offer', 'no'); } catch (e) {}
  });
  offer.hidden = false;
})();
