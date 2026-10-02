/* v06 — Quiet Hall. Small enhancements: time-of-day greeting and the current block. */
(function () {
  'use strict';

  /* ---------- Time-of-day greeting ---------- */
  var greet = document.getElementById('greeting');
  var hour = new Date().getHours();
  if (greet) {
    greet.textContent = hour < 12 ? 'Good morning.' : hour < 17 ? 'Good afternoon.' : 'Good evening.';
  }

  /* ---------- Current block ---------- */
  function mins(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm + (h < 12 ? ' AM' : ' PM');
  }
  var nowLine = document.getElementById('now-line');
  var rows = Array.prototype.slice.call(document.querySelectorAll('#bells li'));

  function placeNow() {
    var d = new Date(), t = d.getHours() * 60 + d.getMinutes();
    var msg = '', dayEnd = mins(rows[rows.length - 1].dataset.end);
    rows.forEach(function (li, i) {
      var s = mins(li.dataset.start), e = mins(li.dataset.end);
      var name = li.querySelector('.bells__n').firstChild.textContent.trim();
      var isNow = t >= s && t < e;
      li.classList.toggle('is-now', isNow);
      li.classList.toggle('is-past', t >= e && t < dayEnd);
      if (isNow) {
        li.setAttribute('aria-current', 'time');
        msg = 'Now: ' + name + ', until ' + fmt(e) + '.';
      } else {
        li.removeAttribute('aria-current');
        if (!msg && t < s) {
          msg = i === 0 ? 'School starts at ' + fmt(s) + ' with ' + name + '.'
                        : 'Passing time. Next: ' + name + ' at ' + fmt(s) + '.';
        }
      }
    });
    if (!msg) msg = 'The school day ended at 2:10 PM.';
    if (nowLine) { nowLine.textContent = msg; nowLine.hidden = false; }
  }
  placeNow();
  setInterval(placeNow, 60000);
})();
