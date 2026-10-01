/* Shared accessibility panel, used by every version.
 *
 * - Injects an always-visible "Accessibility" button (bottom-right) unless
 *   <html data-a11y-fab="off">. Any element with [data-a11y-toggle] also opens it.
 * - Options toggle classes on <html>; shared/a11y.css + each version's
 *   CSS tokens (--bg, --surface, --text, --muted, --brand, --brand-2,
 *   --accent, --line, --on-brand) do the rest.
 * - Choices are remembered per browser (localStorage, best effort).
 */
(function () {
  var root = document.documentElement;
  var KEY = 'hall-a11y';
  if (window.self !== window.top) root.classList.add('in-frame');

  var OPTIONS = [
    { id: 'contrast', label: 'High contrast', hint: 'White and yellow text on black' },
    { id: 'readable', label: 'Readable font', hint: 'Atkinson Hyperlegible, wider spacing' },
    { id: 'spacing', label: 'More line spacing', hint: 'Easier to track lines of text' },
    { id: 'links', label: 'Underline all links', hint: 'Links don’t rely on color' },
    { id: 'motion', label: 'Stop motion', hint: 'Pause animation and video' }
  ];
  var SIZES = ['Default', 'Large', 'Larger', 'Largest'];

  var prefs = {};
  try { prefs = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { prefs = {}; }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }

  function loadReadableFont() {
    if (document.getElementById('hha-font')) return;
    var l = document.createElement('link');
    l.id = 'hha-font';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';
    document.head.appendChild(l);
  }

  function apply() {
    OPTIONS.forEach(function (o) { root.classList.toggle('a11y-' + o.id, !!prefs[o.id]); });
    for (var i = 1; i < SIZES.length; i++) root.classList.toggle('a11y-text-' + i, prefs.size === i);
    if (prefs.readable) loadReadableFont();
    if (prefs.motion) document.querySelectorAll('video').forEach(function (v) { v.pause(); });
  }
  apply();

  function build() {
    var panel = document.createElement('div');
    panel.className = 'hha-panel';
    panel.id = 'hha-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'hha-title');
    panel.hidden = true;

    var html = '<div class="hha-head"><h2 id="hha-title" tabindex="-1">Accessibility</h2>' +
      '<button type="button" class="hha-close" aria-label="Close accessibility options">&times;</button></div>' +
      '<fieldset class="hha-sizes"><legend>Text size</legend>';
    SIZES.forEach(function (s, i) {
      html += '<label><input type="radio" name="hha-size" value="' + i + '"' +
        ((prefs.size || 0) === i ? ' checked' : '') + '><span style="font-size:' + (0.85 + i * 0.15) + 'rem">A</span><span class="hha-sr">' + s + '</span></label>';
    });
    html += '</fieldset><ul class="hha-list">';
    OPTIONS.forEach(function (o) {
      html += '<li><label class="hha-switch"><input type="checkbox" data-opt="' + o.id + '"' + (prefs[o.id] ? ' checked' : '') + '>' +
        '<span class="hha-track" aria-hidden="true"></span><span class="hha-text"><strong>' + o.label + '</strong><small>' + o.hint + '</small></span></label></li>';
    });
    html += '</ul><div class="hha-foot">' +
      '<a href="https://translate.google.com/translate?sl=en&tl=es&u=https://hall.whps.org" target="_blank" rel="noopener">Translate site <span aria-hidden="true">↗</span></a>' +
      '<button type="button" class="hha-reset">Reset all</button></div>' +
      '<p class="hha-note">Need help using this site? Call <a href="tel:+18602324561">860-232-4561</a>.</p>';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    if (root.getAttribute('data-a11y-fab') !== 'off') {
      var fab = document.createElement('button');
      fab.type = 'button';
      fab.className = 'hha-fab';
      fab.setAttribute('data-a11y-toggle', '');
      fab.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="4" r="2.2" fill="currentColor"/><path d="M4 7.5l8 1.6 8-1.6M12 9.1v5.4m0 0l-3.6 7m3.6-7l3.6 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Accessibility</span>';
      document.body.appendChild(fab);
    }

    var triggers = document.querySelectorAll('[data-a11y-toggle]');
    var lastTrigger = null;
    triggers.forEach(function (t) {
      t.setAttribute('aria-controls', 'hha-panel');
      t.setAttribute('aria-expanded', 'false');
      t.addEventListener('click', function () { panel.hidden ? open(t) : close(); });
    });

    function setExpanded(v) { triggers.forEach(function (t) { t.setAttribute('aria-expanded', String(v)); }); }
    function open(t) {
      lastTrigger = t || null;
      panel.hidden = false;
      setExpanded(true);
      panel.querySelector('#hha-title').focus();
    }
    function close() {
      panel.hidden = true;
      setExpanded(false);
      if (lastTrigger) lastTrigger.focus();
    }

    panel.querySelector('.hha-close').addEventListener('click', close);
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('keydown', function (e) {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) { e.preventDefault(); panel.hidden ? open(null) : close(); }
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !e.target.closest('[data-a11y-toggle]')) close();
    });

    panel.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'hha-size') prefs.size = Number(t.value);
      else if (t.dataset.opt) prefs[t.dataset.opt] = t.checked;
      save(); apply();
    });
    panel.querySelector('.hha-reset').addEventListener('click', function () {
      prefs = {};
      panel.querySelectorAll('input[type=checkbox]').forEach(function (c) { c.checked = false; });
      panel.querySelector('input[name=hha-size][value="0"]').checked = true;
      save(); apply();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
