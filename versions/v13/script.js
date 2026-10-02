/* v13 — Today + Announcements
 * 1) "Bell schedule & lunch" disclosure (without JS the detail is shown).
 * 2) One-line now/next readout and a thin day bar from the even-day bell schedule.
 *    Sample day is Thu Oct 1 (Even Day). Preview any time with ?t=HH:MM.
 */
(function () {
  document.documentElement.classList.add('js');

  /* ---------- Disclosure ---------- */
  var btn = document.querySelector('.more-btn');
  var panel = document.getElementById('today-more');
  if (btn && panel) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
    });
  }

  /* ---------- Now / next ---------- */
  function toMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    return (((h + 11) % 12) + 1) + ':' + (mm < 10 ? '0' : '') + mm;
  }

  var NAMES = ['Block 2', 'Block 4', 'Advisory', 'Block 6', 'Block 8'];
  var items = Array.prototype.slice.call(document.querySelectorAll('#dayline li'));
  var blocks = items.map(function (el, i) {
    return { el: el, name: NAMES[i], start: toMin(el.dataset.start), end: toMin(el.dataset.end) };
  });
  var waves = [['A', '10:52', '11:20'], ['B', '11:24', '11:52'], ['C', '11:56', '12:24']];
  var text = document.getElementById('now-text');
  if (!text || !blocks.length) return;

  var override = null;
  var q = /[?&]t=(\d{1,2}):?(\d{2})/.exec(location.search);
  if (q) override = +q[1] * 60 + +q[2];

  function now() {
    if (override !== null) return override;
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function render() {
    var t = now(), first = blocks[0], last = blocks[blocks.length - 1];
    var cur = -1, nxt = -1;
    blocks.forEach(function (b, i) {
      if (t >= b.start && t < b.end) cur = i;
      if (nxt === -1 && t < b.start) nxt = i;
    });

    var html;
    if (t < first.start) {
      html = '<b>Before school</b> <span class="faint">· First bell 7:30 AM, Block 2</span>';
    } else if (t >= last.end) {
      html = '<b>School day ended 2:10 PM</b> <span class="faint">· Fri, Oct 2 is an odd day</span>';
    } else if (cur >= 0) {
      var b = blocks[cur], n = blocks[cur + 1];
      html = '<b>Now: ' + b.name + '</b> until ' + fmt(b.end);
      if (b.name === 'Block 6') {
        waves.forEach(function (w) {
          if (t >= toMin(w[1]) && t < toMin(w[2])) html += ' · Lunch wave ' + w[0] + ' until ' + fmt(toMin(w[2]));
        });
      }
      html += n ? ' <span class="faint">· Next: ' + n.name + ' at ' + fmt(n.start) + '</span>'
                : ' <span class="faint">· Dismissal at 2:10 PM</span>';
    } else {
      var nb = blocks[nxt];
      html = '<b>Passing time</b> <span class="faint">· ' + nb.name + ' at ' + fmt(nb.start) + '</span>';
    }
    text.innerHTML = html;

    blocks.forEach(function (b, i) {
      var done = t >= b.end ? 1 : t <= b.start ? 0 : (t - b.start) / (b.end - b.start);
      b.el.style.setProperty('--done', done.toFixed(3));
      b.el.classList.toggle('is-now', i === cur);
    });
  }

  render();
  if (override === null) setInterval(render, 30000);
})();
