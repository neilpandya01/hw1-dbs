/* v21 — Hall Stories
 * Now: the current block in the today line.
 * Sample day is Thu Oct 1 (Even Day). Preview any time with ?t=HH:MM.
 */
(function () {
  var BLOCKS = [
    { name: 'Block 2', start: '07:30', end: '08:52' },
    { name: 'Block 4', start: '08:58', end: '10:20' },
    { name: 'Advisory', start: '10:26', end: '10:46' },
    { name: 'Block 6 + Lunch', start: '10:52', end: '12:44' },
    { name: 'Block 8', start: '12:50', end: '14:10' }
  ];
  var out = document.getElementById('today-now');
  if (!out) return;

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

  var blocks = BLOCKS.map(function (b) { return { name: b.name, start: toMin(b.start), end: toMin(b.end) }; });

  function update() {
    var m = nowMin(), text = '';
    var cur = blocks.filter(function (b) { return m >= b.start && m < b.end; })[0];
    var next = blocks.filter(function (b) { return b.start > m; })[0];
    if (cur) text = 'Now: ' + cur.name + ' until ' + clock(cur.end);
    else if (next && m >= blocks[0].start) text = 'Next: ' + next.name + ' at ' + clock(next.start);
    if (out.textContent !== text) out.textContent = text;
  }
  update();
  setInterval(update, 30000);
})();
