/* v10 On the Calendar (Swiss wall calendar): menu, portals dropdown, Escape closes the bell schedule.
   Category filters and the bell schedule work without JS. */
(function () {
  document.documentElement.classList.add('js');

  function disclosure(btn, panel) {
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !panel.contains(e.target)) set(false);
    });
    return set;
  }

  var menuBtn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('nav-menu');
  if (menuBtn && menu) {
    var setMenu = disclosure(menuBtn, menu);
    window.matchMedia('(min-width: 61.0625em)').addEventListener('change', function () { setMenu(false); });
  }

  var pBtn = document.querySelector('.portals-btn');
  var pMenu = document.getElementById('portal-menu');
  if (pBtn && pMenu) disclosure(pBtn, pMenu);

  var bell = document.querySelector(".t-bell");
  if (bell) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bell.open) { bell.open = false; bell.querySelector('summary').focus(); }
    });
    document.addEventListener('click', function (e) {
      if (bell.open && !bell.contains(e.target)) bell.open = false;
    });
  }
})();
