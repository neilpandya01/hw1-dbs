/* v07 Warrior Season: menu, portals, today disclosure, schedule filters,
   team tablist (remembered), big-game countdown. */
(function () {
  document.documentElement.classList.add('js');

  /* ---------- disclosures (from v04) ---------- */
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
    if (mq.addEventListener) mq.addEventListener('change', function () { setMenu(false); });
  }

  var pBtn = document.querySelector('.portals-btn');
  var pMenu = document.getElementById('portal-menu');
  if (pBtn && pMenu) disclosure(pBtn, pMenu, { dismiss: true });

  document.querySelectorAll('[data-disclosure]').forEach(function (b) {
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    if (panel) disclosure(b, panel);
  });

  /* ---------- schedule filters: All / Sports / School & arts ---------- */
  var LABELS = { all: 'all events', sports: 'sports only', school: 'school and arts only' };
  document.querySelectorAll('[data-filter-for]').forEach(function (group) {
    var listId = group.getAttribute('data-filter-for');
    var list = document.getElementById(listId);
    var status = document.getElementById(listId + '-status');
    if (!list) return;
    var buttons = group.querySelectorAll('button[data-show]');
    buttons.forEach(function (b) { b.setAttribute('aria-controls', listId); });

    function apply(show) {
      var count = 0;
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-show') === show));
      });
      list.querySelectorAll('.day').forEach(function (day) {
        var visible = 0;
        day.querySelectorAll('.ev').forEach(function (ev) {
          var on = show === 'all' || ev.getAttribute('data-kind') === show;
          ev.hidden = !on;
          if (on) visible++;
        });
        day.hidden = visible === 0;
        count += visible;
      });
      if (status) status.textContent = 'Showing ' + LABELS[show] + ': ' + count + (count === 1 ? ' event.' : ' events.');
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-show')); });
    });
  });

  /* ---------- team tablist ---------- */
  var KEY = 'v07-team-tab';
  var tablist = document.querySelector('.team-tabs[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    panels.forEach(function (p, i) {
      if (!p) return;
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-labelledby', tabs[i].id);
      p.setAttribute('tabindex', '0');
    });

    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[j]) panels[j].hidden = !on;
      });
      if (focus) {
        tabs[i].focus();
        if (tabs[i].scrollIntoView) tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      try { localStorage.setItem(KEY, tabs[i].id); } catch (e) {}
    }

    var start = 0;
    try {
      var saved = localStorage.getItem(KEY);
      tabs.forEach(function (t, i) { if (t.id === saved) start = i; });
    } catch (e) {}
    select(start, false);

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
    });
    tablist.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var n = tabs.length, next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });
  }

  /* ---------- countdown to the big game ---------- */
  function parseDay(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  }
  var cd = document.querySelector('[data-countdown]');
  if (cd) {
    var param = null;
    try { param = new URLSearchParams(window.location.search).get('d'); } catch (e) {}
    var today = parseDay(param) || parseDay('2026-10-01'); // sample date
    var game = parseDay(cd.getAttribute('data-countdown'));
    var days = Math.round((game - today) / 86400000);
    var num = cd.querySelector('[data-cd-num]');
    var label = cd.querySelector('[data-cd-label]');
    if (days > 1) { num.textContent = days; label.textContent = 'days to kickoff'; }
    else if (days === 1) { num.textContent = '1'; label.textContent = 'day to kickoff'; }
    else if (days === 0) { num.textContent = 'Tonight'; label.textContent = 'Kickoff 7:00 PM'; }
    else { num.textContent = 'Final'; label.textContent = 'See results on Athletics'; }
  }
})();
