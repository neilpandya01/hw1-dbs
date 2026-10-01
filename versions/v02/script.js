/* v02 — small disclosure widgets: portal menu, mobile nav, today panels. */
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
    target.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { set(false); btn.focus(); }
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') set(false);
    });
    if (opts.outside) {
      document.addEventListener('click', function (e) {
        if (btn.getAttribute('aria-expanded') === 'true' && !btn.contains(e.target) && !target.contains(e.target)) set(false);
      });
    }
    return set;
  }

  var portalBtn = document.querySelector('.portal__btn');
  var portalMenu = document.getElementById('portal-menu');
  if (portalBtn && portalMenu) {
    disclosure(portalBtn, portalMenu, { outside: true });
    // close when focus leaves the widget
    portalMenu.parentElement.addEventListener('focusout', function (e) {
      if (!portalMenu.parentElement.contains(e.relatedTarget) && e.relatedTarget) {
        portalBtn.setAttribute('aria-expanded', 'false');
        portalMenu.hidden = true;
      }
    });
  }

  var navBtn = document.querySelector('.primary__toggle');
  var navList = document.getElementById('primary-links');
  if (navBtn && navList) disclosure(navBtn, navList, { cls: 'is-open', outside: true });

  // "Today" panels: only one open at a time. Hidden only once JS is running.
  var btns = Array.prototype.slice.call(document.querySelectorAll('.today__btn'));
  var setters = [];
  btns.forEach(function (b, i) {
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = true;
    setters[i] = disclosure(b, panel, {
      onOpen: function () { setters.forEach(function (s, j) { if (j !== i && s) s(false); }); }
    });
  });
})();
