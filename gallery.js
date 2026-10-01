// Scale each live preview (rendered at 1280×800) down to its tile's width.
(function () {
  var BASE = 1280;
  var previews = document.querySelectorAll('.preview');
  if (!('ResizeObserver' in window)) return;
  var ro = new ResizeObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.style.setProperty('--scale', e.contentRect.width / BASE);
    });
  });
  previews.forEach(function (p) { ro.observe(p); });
})();
