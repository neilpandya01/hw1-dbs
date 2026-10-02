/* v12 Find Your People: menu and bell-schedule disclosure */
(function () {
  document.documentElement.classList.add('js');

  function disclosure(btn, panel, opts) {
    opts = opts || {};
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
    }
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    if (opts.dismiss) {
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
      });
      document.addEventListener('click', function (e) {
        if (!btn.contains(e.target) && !panel.contains(e.target)) set(false);
      });
    }
    return set;
  }

  var menuBtn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('nav-menu');
  if (menuBtn && menu) {
    var setMenu = disclosure(menuBtn, menu, { dismiss: true });
    var mq = window.matchMedia('(min-width: 61.0625em)');
    mq.addEventListener('change', function () { setMenu(false); });
  }

  var pBtn = document.querySelector('.portals-btn');
  var pMenu = document.getElementById('portal-menu');
  if (pBtn && pMenu) disclosure(pBtn, pMenu, { dismiss: true });

  document.querySelectorAll('[data-disclosure]').forEach(function (b) {
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    if (panel) disclosure(b, panel);
  });
})();
