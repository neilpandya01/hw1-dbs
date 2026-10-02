/* v11 Game Day: menu, portals dropdown, today disclosure, kickoff countdown */
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

  /* ---------- Kickoff countdown ----------
     The page is a sample for Thu Oct 1, 2026, so the clock always starts
     from a sample "now" of Oct 1 at noon and ticks forward from there,
     matching the Today strip. */
  var clock = document.getElementById('clock');
  if (!clock) return;
  var KICK = new Date(2026, 9, 2, 19, 0, 0).getTime();
  var SAMPLE_NOW = new Date(2026, 9, 1, 12, 0, 0).getTime();
  var t0 = performance.now();
  function now() { return SAMPLE_NOW + (performance.now() - t0); }

  var el = {
    d: document.getElementById('cd-d'), h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'), s: document.getElementById('cd-s'),
    label: document.getElementById('clock-label')
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var timer;
  function tick() {
    var s = Math.floor((KICK - now()) / 1000);
    if (s <= 0) {
      el.label.textContent = 'Game day: kickoff 7:00 PM';
      clock.classList.add('is-done');
      clearInterval(timer);
      return;
    }
    el.d.textContent = pad(Math.floor(s / 86400));
    el.h.textContent = pad(Math.floor(s / 3600) % 24);
    el.m.textContent = pad(Math.floor(s / 60) % 60);
    el.s.textContent = pad(s % 60);
  }
  tick();
  timer = setInterval(tick, 1000);
})();
