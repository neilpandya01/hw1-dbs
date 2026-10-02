/* v06 — Hour by Hour
 * Drives everything time-based from the visitor's clock (sample day: Thu Oct 1, Even Day):
 *  - big clock, greeting and time-of-day tint on the Now band
 *  - current block / passing time / before / after school, minutes left, next up, lunch wave
 *  - school-day progress bar (7:30 -> 2:10)
 *  - "The whole day" list: past/now/next states, per-row "in 2 h 5 min", and a moving now-line
 * Preview any time with ?t=HH:MM (e.g. ?t=11:30, ?t=18:45). Without JS the static lists are the page.
 */
(function () {
  'use strict';

  var DAY_START = 7 * 60 + 30;   // first bell
  var DAY_END = 14 * 60 + 10;    // dismissal
  var SUNSET = 18 * 60 + 36;     // sample

  function toMin(hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) {
    m = ((m % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm;
  }
  function ampm(m) { return m % 1440 < 720 ? 'AM' : 'PM'; }
  function fmtAmPm(m) { return fmt(m) + ' ' + ampm(m); }
  function dur(m) {
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- time source ---------- */
  var override = null;
  var q = /[?&]t=(\d{1,2}):?(\d{2})/.exec(location.search);
  if (q && +q[1] < 24 && +q[2] < 60) override = +q[1] * 60 + +q[2];

  function nowMin() {
    if (override !== null) return override;
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  /* ---------- read the day from the HTML ---------- */
  var day = $('day');
  var slots = Array.prototype.slice.call(document.querySelectorAll('#day .slot')).map(function (el) {
    return {
      el: el,
      name: el.getAttribute('data-name'),
      kind: el.getAttribute('data-kind') || 'other',
      wave: el.getAttribute('data-wave'),
      start: toMin(el.getAttribute('data-start')),
      end: el.hasAttribute('data-end') ? toMin(el.getAttribute('data-end')) : null,
      when: el.querySelector('.slot__when')
    };
  });
  if (!slots.length) return;

  var classes = slots.filter(function (s) { return s.kind === 'class'; });
  var waves = slots.filter(function (s) { return s.kind === 'lunch'; });

  var band = $('now-band');
  var els = {
    clock: $('clock'), ap: $('clock-ap'), greet: $('greet'), preview: $('preview-note'),
    state: $('now-state'), left: $('now-left'), next: $('now-next'), lunch: $('now-lunch'),
    live: $('now-live'),
    pct: $('prog-pct'), progLeft: $('prog-left'), prog: $('prog'), fill: $('prog-fill'),
    sunset: $('sunset-in'),
    nowline: $('nowline'), nowtag: $('nowline-tag')
  };

  if (override !== null && els.preview) {
    els.preview.textContent = 'Preview: ' + fmtAmPm(override);
    els.preview.hidden = false;
  }

  /* ---------- helpers ---------- */
  function isActive(s, t) { return s.end !== null && t >= s.start && t < s.end; }
  function isPast(s, t) { return t >= (s.end !== null ? s.end : s.start + 1); }

  function timeOfDay(t) {
    if (t >= 5 * 60 && t < DAY_START) return { cls: 'tod-dawn', greet: 'Good morning' };
    if (t >= DAY_START && t < 12 * 60) return { cls: 'tod-day', greet: 'Good morning' };
    if (t >= 12 * 60 && t < 17 * 60) return { cls: 'tod-afternoon', greet: 'Good afternoon' };
    return { cls: 'tod-evening', greet: t < 5 * 60 ? 'Late night' : 'Good evening' };
  }

  function lunchNote(t) {
    if (t >= DAY_END) return 'All lunch waves done';
    for (var i = 0; i < waves.length; i++) {
      var w = waves[i];
      if (t >= w.start && t < w.end) return 'Wave ' + w.wave + ' eating now, until ' + fmt(w.end);
      if (t < w.start) {
        var tail = t >= w.start - 120 ? ' (in ' + dur(w.start - t) + ')' : '';
        return 'Wave ' + w.wave + ' at ' + fmt(w.start) + tail;
      }
    }
    return 'All lunch waves done';
  }

  /* What's happening right now, as {state, left, next} */
  function readout(t) {
    var cur = null, nextClass = null, i;
    for (i = 0; i < classes.length; i++) {
      if (isActive(classes[i], t)) cur = classes[i];
      if (!nextClass && t < classes[i].start) nextClass = classes[i];
    }
    // next non-lunch item on the day list
    var nextAny = null;
    for (i = 0; i < slots.length; i++) {
      if (slots[i].kind !== 'lunch' && slots[i].start > t) { nextAny = slots[i]; break; }
    }
    var r = { state: '', left: '', next: '' };
    // after dismissal: what's going on right now (rehearsal, games, college night...)
    var happening = slots.filter(function (s) {
      return s.kind === 'other' && s.start >= DAY_END && isActive(s, t);
    }).map(function (s) { return s.name; });

    if (t < 6 * 60 + 45 && t >= 0) {
      r.state = 'Before school';
      r.left = 'building opens 6:45';
      r.next = 'First bell 7:30 AM, Block 2 (in ' + dur(DAY_START - t) + ')';
    } else if (t < DAY_START) {
      r.state = 'Before school';
      r.left = 'first bell in ' + dur(DAY_START - t);
      r.next = 'Block 2 at 7:30';
    } else if (cur) {
      r.state = cur.name;
      r.left = (cur.end - t) + ' min left · ends ' + fmt(cur.end);
      r.next = nextClass ? nextClass.name + ' at ' + fmt(nextClass.start) + ' (in ' + dur(nextClass.start - t) + ')'
                         : 'Dismissal at 2:10 (in ' + dur(DAY_END - t) + ')';
    } else if (t < DAY_END) {
      r.state = 'Passing time';
      r.left = nextClass ? (nextClass.start - t) + ' min to ' + nextClass.name : '';
      r.next = nextClass ? nextClass.name + ' at ' + fmt(nextClass.start) : 'Dismissal at 2:10';
    } else if (t < 17 * 60 + 30) {
      r.state = 'After school';
      r.left = happening.length ? 'now: ' + happening.join(', ') : 'dismissed at 2:10';
      r.next = nextAny ? nextAny.name + ' at ' + fmt(nextAny.start) + ' (in ' + dur(nextAny.start - t) + ')' : '';
    } else if (t < 21 * 60) {
      r.state = 'Tonight at Hall';
      r.left = happening.length ? 'now: ' + happening.join(', ') : 'building open until 9:00';
      r.next = nextAny ? nextAny.name + ' at ' + fmt(nextAny.start) + ' (in ' + dur(nextAny.start - t) + ')'
                       : 'Tomorrow: Odd Day, first bell 7:30 AM';
    } else {
      r.state = 'School’s closed for the night';
      r.left = '';
      r.next = 'Tomorrow, Fri Oct 2: Odd Day, first bell 7:30 AM';
    }
    if (t >= 17 * 60 + 30 && !nextAny) r.next = 'Tomorrow, Fri Oct 2: Odd Day, first bell 7:30 AM';
    return r;
  }

  /* ---------- the now-line in the day list ---------- */
  function placeLine(t) {
    if (!els.nowline || !day) return;
    var base = day.getBoundingClientRect().top;
    function top(s) { return s.el.getBoundingClientRect().top - base; }
    var idx = -1;
    for (var i = 0; i < slots.length; i++) if (slots[i].start <= t) idx = i;
    var y;
    if (idx === -1) {
      y = top(slots[0]) - 4;
    } else if (idx === slots.length - 1) {
      var last = slots[idx], h = last.el.getBoundingClientRect().height;
      y = top(last) + Math.min(1, (t - last.start) / 60) * h;
    } else {
      var a = slots[idx], b = slots[idx + 1];
      var span = b.start - a.start;
      var frac = span > 0 ? (t - a.start) / span : 0;
      y = top(a) + (top(b) - top(a)) * Math.max(0, Math.min(1, frac));
    }
    els.nowline.style.top = Math.round(y) + 'px';
    els.nowtag.textContent = 'Now ' + fmt(t);
    els.nowline.hidden = false;
  }

  /* ---------- render ---------- */
  var lastLive = '';

  function render() {
    var t = nowMin();

    // Clock + greeting + tint
    els.clock.textContent = fmt(t);
    els.ap.textContent = ampm(t);
    var tod = timeOfDay(t);
    band.classList.remove('tod-dawn', 'tod-day', 'tod-afternoon', 'tod-evening');
    band.classList.add(tod.cls);
    els.greet.textContent = tod.greet + ' · today';

    // Status
    var r = readout(t);
    els.state.textContent = r.state;
    els.left.textContent = r.left ? '· ' + r.left : '';
    els.next.textContent = r.next;
    els.lunch.textContent = lunchNote(t);

    // Announce only when the state itself changes (not every minute)
    var live = 'It is ' + fmtAmPm(t) + '. ' + r.state + '. Next: ' + r.next + '.';
    if (r.state !== lastLive) { els.live.textContent = live; lastLive = r.state; }

    // Progress
    var total = DAY_END - DAY_START;
    var done = Math.max(0, Math.min(total, t - DAY_START));
    var pct = Math.round(done / total * 100);
    els.pct.textContent = pct + '%';
    els.fill.style.width = (done / total * 100) + '%';
    els.prog.setAttribute('aria-valuenow', String(pct));
    if (t < DAY_START) {
      els.progLeft.textContent = 'School starts in ' + dur(DAY_START - t);
      els.prog.setAttribute('aria-valuetext', 'School has not started. First bell in ' + dur(DAY_START - t) + '.');
    } else if (t < DAY_END) {
      els.progLeft.textContent = dur(DAY_END - t) + ' until dismissal';
      els.prog.setAttribute('aria-valuetext', pct + '% done, ' + dur(DAY_END - t) + ' until dismissal');
    } else {
      els.progLeft.textContent = 'Dismissed at 2:10 PM · ' + dur(t - DAY_END) + ' ago';
      els.prog.setAttribute('aria-valuetext', 'School day complete.');
    }

    // Sunset
    if (els.sunset) els.sunset.textContent = t < SUNSET ? 'in ' + dur(SUNSET - t) : '';

    // Day list states
    var nextMarked = false;
    slots.forEach(function (s) {
      var active = isActive(s, t);
      var past = !active && isPast(s, t);
      var upcoming = !active && !past;
      var isNext = upcoming && !nextMarked && s.kind !== 'lunch';
      if (isNext) nextMarked = true;
      s.el.classList.toggle('is-now', active);
      s.el.classList.toggle('is-past', past);
      s.el.classList.toggle('is-next', isNext);
      if (active) s.el.setAttribute('aria-current', 'time');
      else s.el.removeAttribute('aria-current');

      var txt = '';
      if (active) txt = 'now · ' + dur(s.end - t) + ' left';
      else if (past) txt = s.end !== null ? 'done' : 'earlier';
      else txt = 'in ' + dur(s.start - t);
      s.when.textContent = txt;
    });

    placeLine(t);
  }

  render();

  // Keep the line in place when layout changes (resize, text-size options, fonts loading)
  var relayout = function () { placeLine(nowMin()); };
  window.addEventListener('resize', relayout);
  if (window.ResizeObserver && day) new ResizeObserver(relayout).observe(day);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  // Live updates: land on the next minute boundary, then every 30 s
  if (override === null) {
    var d = new Date();
    var ms = (60 - d.getSeconds()) * 1000 - d.getMilliseconds() + 50;
    setTimeout(function () { render(); setInterval(render, 30000); }, ms);
  }
})();
