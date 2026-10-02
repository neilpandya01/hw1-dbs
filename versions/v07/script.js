/* v07 — Pep Rally
 * 1) "Right now" cell + block highlight from the even-day schedule (visitor's clock;
 *    preview any time with ?t=HH:MM, e.g. ?t=11:30).
 * 2) Ticker pause button.
 * 3) MAKE SOME NOISE: cheer meter + confetti burst (confetti skipped under reduced motion).
 * 4) Countdown to the next home football game.
 * Without JS the page shows the full static schedule, game time and no noise button.
 */
(function () {
  var reduce = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('a11y-motion');
  };
  function toMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60; return (((h + 11) % 12) + 1) + ':' + (mm < 10 ? '0' : '') + mm; }

  /* ---------- 1) Right now ---------- */
  var names = { B2: 'Block 2', B4: 'Block 4', ADV: 'Advisory', B6: 'Block 6', B8: 'Block 8' };
  var blks = Array.prototype.slice.call(document.querySelectorAll('#blocks .blk')).map(function (el) {
    var code = el.querySelector('.blk__n').firstChild.textContent.trim();
    return { el: el, name: names[code] || code, start: toMin(el.dataset.start), end: toMin(el.dataset.end) };
  });
  var waves = [['A', '10:52', '11:20'], ['B', '11:24', '11:52'], ['C', '11:56', '12:24']].map(function (w) {
    return { n: w[0], s: toMin(w[1]), e: toMin(w[2]) };
  });
  var override = null;
  var q = /[?&]t=(\d{1,2}):?(\d{2})/.exec(location.search);
  if (q) override = +q[1] * 60 + +q[2];
  var nowMain = document.getElementById('now-main');
  var nowNext = document.getElementById('now-next');

  function updateNow() {
    if (!nowMain || !blks.length) return;
    var d = new Date();
    var t = override !== null ? override : d.getHours() * 60 + d.getMinutes();
    var main, next, cur = null;
    blks.forEach(function (b) {
      b.el.classList.toggle('is-now', t >= b.start && t < b.end);
      b.el.classList.toggle('is-past', t >= b.end);
      if (t >= b.start && t < b.end) cur = b;
    });
    if (t < blks[0].start) {
      main = 'Pre-game';
      next = 'Block 2 tips off at 7:30';
    } else if (t >= blks[blks.length - 1].end) {
      main = "School's out";
      next = 'Go Warriors! See you tomorrow';
    } else if (cur) {
      main = cur.name;
      next = 'Until ' + fmt(cur.end);
      if (cur.name === 'Block 6') {
        var w = waves.filter(function (x) { return t >= x.s && t < x.e; })[0];
        var nw = waves.filter(function (x) { return t < x.s; })[0];
        next = w ? 'Lunch wave ' + w.n + ' eating now' : nw ? 'Next: lunch wave ' + nw.n + ' at ' + fmt(nw.s) : next;
      }
    } else {
      var up = blks.filter(function (b) { return t < b.start; })[0];
      main = 'Passing time';
      next = up ? up.name + ' at ' + fmt(up.start) : '';
    }
    nowMain.textContent = main;
    nowNext.textContent = next;
  }
  updateNow();
  setInterval(updateNow, 30000);

  /* ---------- 2) Ticker pause ---------- */
  var ticker = document.querySelector('.ticker');
  var pauseBtn = document.getElementById('ticker-pause');
  if (pauseBtn && ticker) {
    pauseBtn.addEventListener('click', function () {
      var paused = ticker.classList.toggle('is-paused');
      pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      pauseBtn.querySelector('.ticker__pause-label').textContent = paused ? 'Play' : 'Pause';
    });
  }

  /* ---------- 3) Make some noise ---------- */
  var ctrl = document.getElementById('noise-ctrl');
  var nojs = document.getElementById('noise-nojs');
  var btn = document.getElementById('noise-btn');
  var meter = document.getElementById('meter');
  var fill = document.getElementById('meter-fill');
  var level = document.getElementById('meter-level');
  var confetti = document.getElementById('confetti');
  var val = 0, lastLabel = '';
  var levels = [
    [0, 'Warming up…'], [15, 'We can hear you!'], [35, 'Louder!'],
    [60, 'The gym is shaking!'], [85, 'MAXIMUM WARRIOR!']
  ];
  function labelFor(v) { var l = levels[0][1]; levels.forEach(function (x) { if (v >= x[0]) l = x[1]; }); return l; }
  function render() {
    fill.style.width = val + '%';
    var l = labelFor(val);
    meter.setAttribute('aria-valuenow', Math.round(val));
    meter.setAttribute('aria-valuetext', Math.round(val) + ' percent — ' + l);
    if (l !== lastLabel) { level.textContent = l; lastLabel = l; }
  }
  var colors = ['var(--brand)', 'var(--surface)', 'var(--accent)', 'var(--brand-2)', 'var(--bg)'];
  function burst() {
    if (reduce() || !confetti) return;
    var r = btn.getBoundingClientRect(), c = confetti.getBoundingClientRect();
    var ox = r.left - c.left + r.width / 2, oy = r.top - c.top + r.height / 2;
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('i');
      var ang = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 160;
      p.style.setProperty('--x', ox + 'px');
      p.style.setProperty('--y', oy + 'px');
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist - 40 + 'px');
      p.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      p.style.setProperty('--c', colors[i % colors.length]);
      confetti.appendChild(p);
      setTimeout(function (el) { return function () { el.remove(); }; }(p), 1000);
    }
  }
  if (ctrl && btn) {
    ctrl.hidden = false;
    if (nojs) nojs.hidden = true;
    render();
    btn.addEventListener('click', function () {
      val = Math.min(100, val + 14);
      render();
      burst();
      btn.classList.add('is-hit');
      setTimeout(function () { btn.classList.remove('is-hit'); }, 120);
    });
    setInterval(function () { if (val > 0) { val = Math.max(0, val - 3); render(); } }, 700);
  }

  /* ---------- 4) Countdown ---------- */
  var games = [
    { t: new Date(2026, 9, 2, 19, 0), title: 'Football vs. Enfield', when: 'Fri, Oct 2 · 7:00 PM · Home field' },
    { t: new Date(2026, 9, 9, 19, 0), title: 'Football vs. Bristol Central', when: 'Fri, Oct 9 · 7:00 PM · Home field' },
    { t: new Date(2026, 9, 16, 19, 0), title: 'Crosstown Classic vs. Conard', when: 'Fri, Oct 16 · 7:00 PM · Home field' },
    { t: new Date(2026, 9, 23, 19, 0), title: 'Football vs. Wethersfield', when: 'Fri, Oct 23 · 7:00 PM · Home field' }
  ];
  var clock = document.getElementById('cd-clock');
  var el = {
    d: document.getElementById('cd-d'), h: document.getElementById('cd-h2'),
    m: document.getElementById('cd-m'), s: document.getElementById('cd-s'),
    title: document.getElementById('cd-title'), when: document.getElementById('cd-when')
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var now = Date.now();
    var g = games.filter(function (x) { return x.t.getTime() > now; })[0];
    if (!g) { clock.hidden = true; return; }
    if (el.title.textContent !== g.title) { el.title.textContent = g.title; el.when.textContent = g.when; }
    var s = Math.floor((g.t.getTime() - now) / 1000);
    el.d.textContent = Math.floor(s / 86400);
    el.h.textContent = pad(Math.floor(s / 3600) % 24);
    el.m.textContent = pad(Math.floor(s / 60) % 60);
    el.s.textContent = pad(s % 60);
    clock.hidden = false;
  }
  if (clock) { tick(); setInterval(tick, 1000); }
})();
