/* v01 — Today Dashboard
 * 1) Dismissible alert banner (remembered in localStorage, best effort).
 * 2) Live "Now / Next" readout + timeline highlight from the even-day bell schedule
 *    against the visitor's clock. Sample day is Thu Oct 1 (Even Day).
 *    Preview any time with ?t=HH:MM (e.g. ?t=11:30).
 * Without JS the static schedule in the HTML is the whole story.
 */
(function () {
  /* ---------- Alert banner ---------- */
  var ALERT_KEY = 'hall-v01-alert-oct9';
  var alertEl = document.getElementById('alert');
  var closeBtn = document.getElementById('alert-close');
  try { if (localStorage.getItem(ALERT_KEY) === '1') alertEl.hidden = true; } catch (e) {}
  if (closeBtn) closeBtn.addEventListener('click', function () {
    alertEl.hidden = true;
    try { localStorage.setItem(ALERT_KEY, '1'); } catch (e) {}
    var main = document.getElementById('main');
    if (main) main.focus();
  });

  /* ---------- Schedule ---------- */
  function toMin(hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm;
  }
  function fmtAmPm(m) { return fmt(m) + (m < 720 ? ' AM' : ' PM'); }

  var items = Array.prototype.slice.call(document.querySelectorAll('#timeline .tl'));
  var blocks = items.map(function (el) {
    return {
      el: el,
      name: el.querySelector('.tl__name').firstChild.textContent.trim(),
      start: toMin(el.dataset.start),
      end: toMin(el.dataset.end)
    };
  });
  var waves = [
    { name: 'A', start: toMin('10:52'), end: toMin('11:20') },
    { name: 'B', start: toMin('11:24'), end: toMin('11:52') },
    { name: 'C', start: toMin('11:56'), end: toMin('12:24') }
  ];

  var nowBox = document.getElementById('now');
  var labelEl = document.getElementById('now-label');
  var mainEl = document.getElementById('now-main');
  var nextEl = document.getElementById('now-next');
  var timeline = document.getElementById('timeline');
  if (!nowBox || !blocks.length) return;

  var override = null;
  var m = /[?&]t=(\d{1,2}):?(\d{2})/.exec(location.search);
  if (m) override = +m[1] * 60 + +m[2];

  var marker = document.createElement('span');
  marker.className = 'now-marker';
  marker.setAttribute('aria-hidden', 'true');

  function currentMinutes() {
    if (override !== null) return override;
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function waveNote(t) {
    for (var i = 0; i < waves.length; i++) {
      var w = waves[i];
      if (t >= w.start && t < w.end) return 'Lunch wave ' + w.name + ' is eating now (until ' + fmt(w.end) + ').';
      if (t < w.start) return 'Next lunch: wave ' + w.name + ' at ' + fmt(w.start) + '.';
    }
    return 'All lunch waves done.';
  }

  function placeMarker(t) {
    var first = blocks[0], last = blocks[blocks.length - 1];
    if (t < first.start || t >= last.end || window.matchMedia('(max-width: 720px)').matches) {
      if (marker.parentNode) marker.parentNode.removeChild(marker);
      return;
    }
    var tlRect = timeline.getBoundingClientRect();
    var x = null;
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i], r = b.el.getBoundingClientRect();
      if (t >= b.start && t < b.end) { x = r.left + r.width * (t - b.start) / (b.end - b.start); break; }
      var nb = blocks[i + 1];
      if (nb && t >= b.end && t < nb.start) {
        var nr = nb.el.getBoundingClientRect();
        x = r.right + (nr.left - r.right) * (t - b.end) / (nb.start - b.end); break;
      }
    }
    if (x === null) return;
    marker.style.left = (x - tlRect.left) + 'px';
    if (!marker.parentNode) timeline.appendChild(marker);
  }

  function render() {
    var t = currentMinutes();
    var label = 'Right now · ' + fmtAmPm(t);
    var main = '', next = '';
    var nowIdx = -1, nextIdx = -1;

    blocks.forEach(function (b, i) {
      if (t >= b.start && t < b.end) nowIdx = i;
      if (nextIdx === -1 && t < b.start) nextIdx = i;
    });

    var first = blocks[0], last = blocks[blocks.length - 1];
    if (t < first.start) {
      main = 'Before school';
      next = 'First bell ' + fmtAmPm(first.start) + ' — ' + first.name + '.';
    } else if (t >= last.end) {
      main = 'School’s out';
      next = 'Tomorrow, Fri Oct 2, is an Odd Day · first bell 7:30 AM.';
    } else if (nowIdx >= 0) {
      var b = blocks[nowIdx];
      main = b.name + ' <span class="faint">· ends ' + fmt(b.end) + '</span>';
      var nb = blocks[nowIdx + 1];
      next = nb ? 'Next: ' + nb.name + ' at ' + fmt(nb.start) + '.' : 'Dismissal at ' + fmtAmPm(b.end) + '.';
      if (b.name === 'Block 6') next = waveNote(t) + ' ' + next;
    } else {
      var n = blocks[nextIdx];
      main = 'Passing time';
      next = n.name + ' starts at ' + fmt(n.start) + ' (' + (n.start - t) + ' min).';
    }

    labelEl.textContent = label;
    mainEl.innerHTML = main;
    nextEl.textContent = next;
    nowBox.hidden = false;

    blocks.forEach(function (b, i) {
      b.el.classList.toggle('is-now', i === nowIdx);
      b.el.classList.toggle('is-past', t >= b.end);
      b.el.classList.toggle('is-next', nowIdx === -1 && i === nextIdx);
      if (i === nowIdx) b.el.setAttribute('aria-current', 'time');
      else b.el.removeAttribute('aria-current');
    });
    placeMarker(t);
  }

  render();
  if (override === null) setInterval(render, 30000);
  window.addEventListener('resize', function () { placeMarker(currentMinutes()); });
})();
