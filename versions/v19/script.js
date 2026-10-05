/* v19 — Game Week
 * 1) This week's day tabs (v10's week view): one panel open at a time, arrow keys move.
 * 2) Now: today's current block in the score bug and in today's panel.
 *    Sample day is Thu Oct 1 (Even Day). Preview any time with ?t=HH:MM.
 * 3) Escape closes the mobile menu.
 */
(function () {
  /* ---------- Day tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.day[role="tab"]'));

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });
  var current = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
  if (current) select(current);

  /* ---------- Now ---------- */
  function toMin(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function clock(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    return (h > 12 ? h - 12 : h) + ':' + (mm < 10 ? '0' : '') + mm;
  }
  function nowMin() {
    var t = new URLSearchParams(location.search).get('t');
    if (t && /^\d{1,2}:\d{2}$/.test(t)) return toMin(t);
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }
  function fullName(label) {
    return label.replace(/^B(\d)/, 'Block $1').replace(/^Adv$/, 'Advisory');
  }

  var blocks = Array.prototype.slice.call(document.querySelectorAll('#today-blocks li')).map(function (el) {
    return { el: el, start: toMin(el.dataset.start), end: toMin(el.dataset.end), name: fullName(el.querySelector('b').textContent) };
  });
  var out = document.getElementById('bug-now');

  function update() {
    var m = nowMin(), text, cur = -1;
    blocks.forEach(function (b, i) { if (m >= b.start && m < b.end) cur = i; });
    blocks.forEach(function (b, i) { b.el.classList.toggle('is-now', i === cur); });

    if (cur >= 0) {
      text = blocks[cur].name + ' · ' + clock(blocks[cur].start) + '–' + clock(blocks[cur].end);
    } else if (m < blocks[0].start) {
      text = 'School starts at ' + clock(blocks[0].start);
    } else if (m >= blocks[blocks.length - 1].end) {
      text = 'School ended at ' + clock(blocks[blocks.length - 1].end);
    } else {
      var next = blocks.filter(function (b) { return b.start > m; })[0];
      text = 'Next: ' + next.name + ' at ' + clock(next.start);
    }
    if (out && out.textContent !== text) out.textContent = text;
  }
  if (blocks.length) {
    update();
    setInterval(update, 30000);
  }

  /* ---------- Mobile menu ---------- */
  var menu = document.querySelector('.mobile-menu');
  if (menu) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
  }
})();
