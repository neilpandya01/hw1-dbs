/* v08 Welcome Mat — cycles "Welcome" through our families' languages.
   The full list of hellos is static HTML; this only animates the big word. */
(function () {
  var word = document.getElementById('welcome-word');
  var label = document.getElementById('welcome-lang');
  var links = Array.prototype.slice.call(document.querySelectorAll('.hellos a[data-word]'));
  if (!word || !label || !links.length) return;

  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var items = [{ word: 'Welcome', lang: 'en', dir: 'ltr', name: 'English', el: null }].concat(links.map(function (a) {
    return { word: a.getAttribute('data-word'), lang: a.getAttribute('lang'), dir: a.getAttribute('dir') || 'ltr', name: a.getAttribute('data-name'), el: a };
  }));
  var i = 0, timer = null, paused = false;

  function motionOff() { return (mq && mq.matches) || root.classList.contains('a11y-motion'); }

  function show(n) {
    var it = items[n];
    word.textContent = it.word;
    word.classList.toggle('is-long', it.word.length > 11);
    word.setAttribute('lang', it.lang);
    word.setAttribute('dir', it.dir);
    label.textContent = it.name;
    links.forEach(function (a) { a.classList.toggle('is-current', a === it.el); });
  }

  function step() {
    if (paused || motionOff()) { stop(); return; }
    word.classList.add('is-out');
    setTimeout(function () {
      i = (i + 1) % items.length;
      show(i);
      word.classList.remove('is-out');
    }, 450);
  }

  function start() { if (!timer && !paused && !motionOff()) timer = setInterval(step, 2400); sync(); }
  function stop() { clearInterval(timer); timer = null; sync(); }

  // Pause / play control (auto-updating content must be pausable)
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cycle-toggle';
  label.parentNode.insertBefore(btn, label.nextSibling);
  var wrap = document.createElement('div');
  wrap.className = 'hero__langrow';
  label.parentNode.insertBefore(wrap, label);
  wrap.appendChild(label); wrap.appendChild(btn);

  function sync() {
    var off = motionOff();
    btn.hidden = off;
    btn.innerHTML = timer ? '<span aria-hidden="true">❚❚</span> Pause greetings' : '<span aria-hidden="true">▶</span> Play greetings';
  }
  btn.addEventListener('click', function () {
    paused = !!timer;
    if (timer) stop(); else start();
  });

  // Hover on a hello previews it
  links.forEach(function (a, n) {
    a.addEventListener('mouseenter', function () { if (!timer) return; i = n + 1; show(i); });
  });

  if (mq && mq.addEventListener) mq.addEventListener('change', function () { motionOff() ? stop() : start(); });
  new MutationObserver(function () { motionOff() ? stop() : start(); }).observe(root, { attributes: true, attributeFilter: ['class'] });

  show(0);
  start();
})();
