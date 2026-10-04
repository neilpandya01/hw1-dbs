/* v16 — Today Feed
 * 1) Mobile menu toggle.
 * 2) Escape closes a nav dropdown (they open on hover/focus in CSS).
 * 3) Now/next line and bell-schedule highlight from the even-day schedule.
 *    Sample day is Thu Oct 1 (Even Day). Preview any time with ?t=HH:MM.
 * Without JS the full schedule in the HTML is the whole story.
 */
(function () {
  /* ---------- Menu ---------- */
  var navBtn = document.querySelector('.primary__toggle');
  var navList = document.getElementById('primary-links');
  if (navBtn && navList) {
    function setNav(open) {
      navBtn.setAttribute('aria-expanded', String(open));
      navList.classList.toggle('is-open', open);
    }
    navBtn.addEventListener('click', function () { setNav(navBtn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navBtn.getAttribute('aria-expanded') === 'true') { setNav(false); navBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!navBtn.contains(e.target) && !navList.contains(e.target)) setNav(false);
    });
  }

  /* ---------- Nav dropdowns ----------
   CSS opens them on hover and keyboard focus. Escape closes the open one and
   returns focus to its top link; it reopens on the next hover or focus. */
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

  /* ---------- Now / next ---------- */
  function toMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    return (((h + 11) % 12) + 1) + ':' + (mm < 10 ? '0' : '') + mm;
  }

  var rows = Array.prototype.slice.call(document.querySelectorAll('#bells li'));
  var blocks = rows.map(function (el) {
    return {
      el: el,
      name: el.querySelector('.bells__name').textContent,
      start: toMin(el.dataset.start),
      end: toMin(el.dataset.end)
    };
  });
  var waves = [['A', '10:52', '11:20'], ['B', '11:24', '11:52'], ['C', '11:56', '12:24']];
  var nowEl = document.getElementById('now');
  if (!nowEl || !blocks.length) return;

  var override = null;
  var q = /[?&]t=(\d{1,2}):?(\d{2})/.exec(location.search);
  if (q) override = +q[1] * 60 + +q[2];

  function minutes() {
    if (override !== null) return override;
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function render() {
    var t = minutes(), first = blocks[0], last = blocks[blocks.length - 1];
    var cur = -1, nxt = -1;
    blocks.forEach(function (b, i) {
      if (t >= b.start && t < b.end) cur = i;
      if (nxt === -1 && t < b.start) nxt = i;
    });

    var html;
    if (t < first.start) {
      html = '<b>Before school.</b> <span>First bell at 7:30 AM.</span>';
    } else if (t >= last.end) {
      html = '<b>The school day ended at 2:10 PM.</b> <span>Friday, Oct 2 is an odd day.</span>';
    } else if (cur >= 0) {
      var b = blocks[cur], n = blocks[cur + 1];
      html = '<b>Now: ' + b.name + ', until ' + fmt(b.end) + '.</b>';
      if (b.name === 'Block 6') {
        waves.forEach(function (w) {
          if (t >= toMin(w[1]) && t < toMin(w[2])) html += ' <span>Lunch ' + w[0] + ' until ' + fmt(toMin(w[2])) + '.</span>';
        });
      }
      html += n ? ' <span>Next: ' + n.name + ' at ' + fmt(n.start) + '.</span>' : ' <span>Dismissal at 2:10 PM.</span>';
    } else {
      html = '<b>Passing time.</b> <span>' + blocks[nxt].name + ' at ' + fmt(blocks[nxt].start) + '.</span>';
    }
    nowEl.innerHTML = html;
    nowEl.hidden = false;

    blocks.forEach(function (b, i) {
      b.el.classList.toggle('is-now', i === cur);
      b.el.classList.toggle('is-past', t >= b.end);
      if (i === cur) b.el.setAttribute('aria-current', 'time');
      else b.el.removeAttribute('aria-current');
    });
  }

  render();
  if (override === null) setInterval(render, 30000);
})();
