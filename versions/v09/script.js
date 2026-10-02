/* v09 The Bulletin: menu, portals dropdown, bell disclosure, notice filters */
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
    menu.addEventListener('click', function (e) { if (e.target.closest('a[href^="#"]')) setMenu(false); });
  }

  var pBtn = document.querySelector('.portals-btn');
  var pMenu = document.getElementById('portal-menu');
  if (pBtn && pMenu) disclosure(pBtn, pMenu, { dismiss: true });

  document.querySelectorAll('[data-disclosure]').forEach(function (b) {
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    if (panel) disclosure(b, panel);
  });

  /* ---- notice filters (without JS every notice is visible and the chips stay hidden) ---- */
  var bar = document.querySelector('.filters');
  if (!bar) return;
  var chips = bar.querySelectorAll('.chip');
  var notices = document.querySelectorAll('.notice');
  var groups = document.querySelectorAll('.nlist-group');
  var status = document.querySelector('.filter-status');
  var empty = document.querySelector('.filter-empty');
  bar.hidden = false;
  status.hidden = false;

  function apply(filter) {
    var shown = 0, label = 'All';
    chips.forEach(function (c) {
      var on = c.dataset.filter === filter;
      c.setAttribute('aria-pressed', String(on));
      if (on) label = c.textContent;
    });
    notices.forEach(function (n) {
      var match = filter === 'all' || n.dataset.tags.split(' ').indexOf(filter) !== -1;
      n.hidden = !match;
      if (match) shown++;
    });
    groups.forEach(function (g) {
      g.hidden = !g.querySelector('.notice:not([hidden])');
    });
    empty.hidden = shown !== 0;
    status.textContent = filter === 'all'
      ? 'Showing all ' + shown + ' notices'
      : 'Showing ' + shown + ' of ' + notices.length + ' notices · ' + label;
  }
  bar.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (c) apply(c.dataset.filter);
  });
  empty.querySelector('button').addEventListener('click', function () { apply('all'); chips[0].focus(); });
  apply('all');
})();
