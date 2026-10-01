/* v05 Portal Sidebar — theme toggle, mobile drawer, live bell schedule, nav highlight. */
(function () {
  var root = document.documentElement;
  var THEME_KEY = 'hall-v05-theme';

  /* ---------- Light / dark theme ---------- */
  var themeBtn = document.getElementById('theme-btn');
  function syncThemeBtn() {
    themeBtn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
  }
  if (themeBtn) {
    syncThemeBtn();
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      syncThemeBtn();
    });
    // Follow system changes only while the visitor hasn't chosen explicitly.
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) {
        var saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (err) {}
        if (saved) return;
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        syncThemeBtn();
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
  }

  /* ---------- Mobile drawer ---------- */
  var side = document.getElementById('side');
  var drawer = document.getElementById('drawer');
  var menuBtn = document.getElementById('menu-btn');
  var closeBtn = document.getElementById('drawer-close');
  var scrim = document.getElementById('scrim');
  var mobileMq = window.matchMedia('(max-width: 56.24em)');
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function isOpen() { return side.classList.contains('is-open'); }
  function openDrawer() {
    side.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Site menu');
    scrim.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeDrawer(returnFocus) {
    side.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.removeAttribute('role');
    drawer.removeAttribute('aria-modal');
    drawer.removeAttribute('aria-label');
    scrim.hidden = true;
    document.body.style.overflow = '';
    if (returnFocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () { isOpen() ? closeDrawer(true) : openDrawer(); });
  closeBtn.addEventListener('click', function () { closeDrawer(true); });
  scrim.addEventListener('click', function () { closeDrawer(true); });
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    var panel = document.getElementById('hha-panel');
    if (panel && !panel.hidden) return; // the a11y panel handles its own keys
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(true); return; }
    if (e.key === 'Tab') {
      var items = Array.prototype.filter.call(drawer.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (!drawer.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // In-page links and the a11y trigger close the drawer.
  drawer.addEventListener('click', function (e) {
    var t = e.target.closest('a[href^="#"], [data-a11y-toggle]');
    if (t && isOpen()) closeDrawer(false);
  });
  var onMq = function () { if (!mobileMq.matches && isOpen()) closeDrawer(false); };
  if (mobileMq.addEventListener) mobileMq.addEventListener('change', onMq);

  /* ---------- Greeting ---------- */
  var now = new Date();
  var h = now.getHours();
  var greet = document.getElementById('greet-word');
  if (greet) greet.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  /* ---------- Bell schedule: highlight the current block ----------
     Uses the real clock on a weekday during school hours; otherwise shows
     a sample moment (9:40 AM) so the dashboard still demonstrates "now". */
  var SAMPLE = 9 * 60 + 40;
  var mins = now.getHours() * 60 + now.getMinutes();
  var weekday = now.getDay() > 0 && now.getDay() < 6;
  var live = weekday && mins >= 7 * 60 && mins <= 14 * 60 + 30;
  var m = live ? mins : SAMPLE;

  function fmt(t) {
    var hh = Math.floor(t / 60), mm = t % 60;
    var ap = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12 || 12;
    return hh + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap;
  }

  var items = document.querySelectorAll('#timeline > .tl__item');
  var status = document.getElementById('today-status');
  if (items.length && status) {
    var current = null, next = null;
    items.forEach(function (li) {
      li.classList.remove('is-now', 'is-next', 'is-past');
      li.removeAttribute('aria-current');
      var f = li.querySelector('.tl__flag');
      if (f) f.remove();
      var s = +li.dataset.start, en = +li.dataset.end;
      if (m >= s && m < en) current = li;
      else if (m >= en) li.classList.add('is-past');
      else if (!next) next = li;
    });
    var name = function (li) { return li.querySelector('.tl__name').firstChild.textContent.trim(); };
    var flag = function (li, txt) {
      var f = document.createElement('span');
      f.className = 'tl__flag';
      f.textContent = txt;
      li.appendChild(f);
    };
    var msg;
    if (current) {
      current.classList.add('is-now');
      current.setAttribute('aria-current', 'time');
      flag(current, 'Now');
      var left = +current.dataset.end - m;
      msg = name(current) + ' · ' + left + ' min left';
      current.querySelectorAll('.tl__waves li').forEach(function (w) {
        if (m >= +w.dataset.start && m < +w.dataset.end) {
          w.classList.add('is-now');
          msg += ' · Lunch wave ' + w.querySelector('span').textContent + ' now';
        }
      });
    } else if (next) {
      next.classList.add('is-next');
      flag(next, 'Next');
      msg = (m < 450 ? 'School starts at 7:30 AM' : 'Passing time') + ' — ' + name(next) + ' at ' + fmt(+next.dataset.start);
    } else {
      msg = 'School’s out for today. See you tomorrow, Warriors!';
    }
    status.textContent = live ? msg : 'Sample view at ' + fmt(SAMPLE) + ' — ' + msg;
  }

  /* ---------- Sidebar: highlight the section in view ---------- */
  var spyLinks = document.querySelectorAll('.nav a[data-spy]');
  if ('IntersectionObserver' in window && spyLinks.length) {
    var setCurrent = function (id) {
      spyLinks.forEach(function (a) {
        if (a.dataset.spy === id) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    };
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      // first section (in nav order) that is in view wins
      for (var i = 0; i < spyLinks.length; i++) {
        var id = spyLinks[i].dataset.spy;
        if (visible[id]) { setCurrent(id); return; }
      }
    }, { rootMargin: '-15% 0px -45% 0px' });
    spyLinks.forEach(function (a) {
      var el = document.getElementById(a.dataset.spy);
      if (el) io.observe(el);
    });
  }
})();
