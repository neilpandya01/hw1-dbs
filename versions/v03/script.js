/* v03 — Ask Hall: search combobox, menu disclosure, audience tabs, notice filters. */
(function () {
  'use strict';

  var BELL = 'https://hall.whps.org/school-information/bell';
  var COUNS = 'https://hall.whps.org/school-counseling';
  var NAV = 'https://student.naviance.com';
  var TRANS = 'https://translate.google.com/translate?sl=en&tl=es&u=https://hall.whps.org';

  // t: title, d: description, c: category, u: url, k: synonyms, ext: opens new tab, act: special action
  var INDEX = [
    { t: 'Bell schedule', d: 'Odd and even day block times and lunch waves.', c: 'Today', u: BELL, k: 'bell schedule blocks block period periods time times odd even day start end dismissal early release advisory when' },
    { t: 'Lunch menu', d: 'Today: chicken teriyaki rice bowl · veg: black bean burrito.', c: 'Today', u: '#', k: 'lunch food menu cafeteria eat eating breakfast hungry meal vegetarian' },
    { t: 'Report an absence', d: 'Sick, late, or leaving early — tell the attendance office.', c: 'Families', u: '#', k: 'absent absence sick ill attendance late tardy dismissal doctor appointment excuse note missing out call in' },
    { t: 'PowerSchool', d: 'Grades, attendance records and schedules.', c: 'Students & families', u: '#', k: 'powerschool grades grade report card gpa marks portal parent portal scores progress' },
    { t: 'Schoology', d: 'Homework, assignments and class materials.', c: 'Students', u: '#', k: 'schoology homework assignment assignments class classes classwork teacher materials lms due' },
    { t: 'Naviance', d: 'College search, applications, careers and scholarships.', c: 'Students', u: NAV, ext: true, k: 'naviance college colleges university application applications career careers scholarship scholarships recommendation' },
    { t: 'School Counseling', d: 'Course choices, college planning, and someone to talk to.', c: 'Support', u: COUNS, k: 'counseling counselor counselors guidance college schedule change course selection stress talk help advice' },
    { t: 'Calendar', d: 'Days off, testing dates and events.', c: 'Today', u: 'https://hall.whps.org/calendar', k: 'calendar dates events holiday holidays vacation break no school day off days off' },
    { t: 'Anonymous Alerts', d: 'Report bullying or a safety concern privately.', c: 'Support', u: '#', k: 'anonymous alerts bully bullying bullied unsafe safety safe report harassment threat threats worried fight' },
    { t: 'Support Services', d: 'Psychologists, social workers, special education and 504s.', c: 'Support', u: '#', k: 'support services special education sped 504 iep psychologist social worker mental health wellness' },
    { t: 'Health office', d: 'School nurse, medication forms and immunizations.', c: 'Support', u: '#', k: 'nurse health medication medicine immunization immunizations physical injury hurt sick at school' },
    { t: 'Athletics', d: 'Teams, tryouts, game schedules and scores.', c: 'Activities', u: 'https://hall.whps.org/athletics', k: 'athletics sports sport game games team teams football soccer basketball tryouts tryout scores coach warriors' },
    { t: 'Athletic registration', d: 'Sign up for a team and upload a sports physical.', c: 'Activities', u: '#', k: 'registration sport sports physical eligibility permission tryout signup sign up athletics' },
    { t: 'Clubs & Publications', d: 'Clubs, newspaper, yearbook and student groups.', c: 'Activities', u: '#', k: 'clubs club activities activity newspaper yearbook publications groups extracurricular after school' },
    { t: 'Music & Fine Arts', d: 'Band, choir, orchestra, art and theater.', c: 'Activities', u: '#', k: 'music band choir orchestra art arts theater theatre drama concert gala midfest' },
    { t: 'Library', d: 'Research databases, books, printing and study space.', c: 'Students', u: '#', k: 'library books book databases research printing print librarian study' },
    { t: 'Directory', d: 'Staff directory with email addresses.', c: 'Contact', u: 'https://hall.whps.org/directory', k: 'directory teacher teachers email staff contact teacher phone' },
    { t: 'Contact us', d: '975 North Main Street · 860-232-4561.', c: 'Contact', u: 'https://hall.whps.org/contact-us', k: 'contact address phone fax directions map main office call location where' },
    { t: 'New families & enrollment', d: 'Register, transfer, or schedule a tour.', c: 'New to Hall', u: '#', k: 'new family families enroll enrollment register registration tour visit moving move transfer prospective incoming freshman' },
    { t: 'Program of studies', d: 'Every course, elective and pathway.', c: 'Academics', u: '#', k: 'courses course classes electives program of studies catalog course selection pathway' },
    { t: 'AP & UConn ECE', d: 'College-level courses and college credit at Hall.', c: 'Academics', u: '#', k: 'ap advanced placement uconn ece early college credit honors' },
    { t: 'Testing: PSAT, SAT, ACT', d: 'PSAT Oct 14 · SAT Oct 3 · ACT Oct 17.', c: 'Academics', u: '#', k: 'test testing tests sat psat act exam exams scores standardized bluebook' },
    { t: 'Transcripts & records', d: 'Request an official transcript.', c: 'Academics', u: COUNS, k: 'transcript transcripts records request official' },
    { t: 'Seniors', d: 'Portraits, graduation, deadlines for the class of 2027.', c: 'Students', u: '#', k: 'senior seniors graduation graduate portraits portrait prom cap gown class of 2027' },
    { t: 'Bus & transportation', d: 'Bus routes, late buses and stop times.', c: 'Families', u: '#', k: 'bus buses transportation ride route routes late bus stop' },
    { t: 'Student parking', d: 'Parking permits and rules.', c: 'Students', u: '#', k: 'parking park permit car drive driving' },
    { t: 'eCollect annual forms', d: 'Emergency card and permission forms online.', c: 'Families', u: '#', k: 'forms form ecollect annual emergency card permission paperwork' },
    { t: 'Lunch account & payments', d: 'Add money, check balance, free and reduced meals.', c: 'Families', u: '#', k: 'pay payment money balance lunch account free reduced meals' },
    { t: 'Weekly newsletter', d: 'The principal’s Friday update.', c: 'News', u: '#', k: 'newsletter news update updates email principal weekly' },
    { t: 'Announcements', d: 'All school notices and news.', c: 'News', u: 'https://hall.whps.org/announcements', k: 'announcements announcement news notices notice' },
    { t: 'Student handbook', d: 'Rules, phone policy, dress code and discipline.', c: 'Students', u: '#', k: 'handbook rules rule policy policies phone phones dress code discipline' },
    { t: 'Chromebook & tech help', d: 'Passwords, Wi-Fi, broken devices.', c: 'Students', u: '#', k: 'chromebook laptop computer tech technology password wifi wi-fi login broken device help desk' },
    { t: 'PTO & volunteering', d: 'Parent groups, boosters and ways to help.', c: 'Families', u: '#', k: 'pto parents parent volunteer volunteering booster boosters donate' },
    { t: 'About Hall', d: 'School profile, mission and achievements.', c: 'About', u: '#', k: 'about profile mission history principal stats achievements awards us news' },
    { t: 'Translate this site', d: 'Español, 中文, Português, Tiếng Việt, العربية…', c: 'Help', u: TRANS, ext: true, k: 'translate translation language languages spanish espanol español chinese mandarin portuguese vietnamese arabic' },
    { t: 'Accessibility options', d: 'Larger text, high contrast, readable font.', c: 'Help', u: '#', act: 'a11y', k: 'accessibility accessible larger text bigger font contrast dyslexia readable zoom low vision' },
    { t: 'West Hartford Public Schools', d: 'District home page.', c: 'District', u: 'https://www.whps.org', ext: true, k: 'district whps west hartford board of education superintendent' }
  ];

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9&\s-]/g, ' ').trim(); }
  INDEX.forEach(function (it) {
    it.nt = norm(it.t);
    it.words = norm(it.t + ' ' + it.k).split(/\s+/);
  });

  function score(it, q, terms) {
    var s = 0;
    if (it.nt.indexOf(q) === 0) s += 100;
    else if (it.nt.indexOf(q) > -1) s += 60;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i], hit = 0;
      for (var j = 0; j < it.words.length; j++) {
        var w = it.words[j];
        if (w === term) { hit = Math.max(hit, 30); }
        else if (term.length >= 2 && w.indexOf(term) === 0) { hit = Math.max(hit, 20); }
      }
      if (!hit) return s >= 60 ? s : 0; // every word must match something
      s += hit;
    }
    return s;
  }

  function search(raw) {
    var q = norm(raw);
    if (!q) return [];
    var terms = q.split(/\s+/);
    return INDEX.map(function (it) { return { it: it, s: score(it, q, terms) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 6)
      .map(function (r) { return r.it; });
  }

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function highlight(title, raw) {
    var q = raw.trim();
    var i = q ? title.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (i < 0) return esc(title);
    return esc(title.slice(0, i)) + '<mark>' + esc(title.slice(i, i + q.length)) + '</mark>' + esc(title.slice(i + q.length));
  }

  /* ---------- Combobox ---------- */
  var form = document.getElementById('ask-form');
  var input = document.getElementById('ask');
  var list = document.getElementById('ask-results');
  var status = document.getElementById('ask-status');
  var results = [];
  var active = -1;
  var announceTimer;

  if (input && list) {
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'ask-results');

    var render = function () {
      var raw = input.value;
      results = search(raw);
      active = -1;
      input.removeAttribute('aria-activedescendant');
      if (!raw.trim()) { close(); status.textContent = ''; return; }

      var html = results.map(function (it, i) {
        return '<li class="opt" role="option" id="opt-' + i + '" aria-selected="false" data-i="' + i + '">' +
          '<span class="opt-t">' + highlight(it.t, raw) + (it.ext ? ' <span class="vh">(opens in new tab)</span>' : '') + '</span>' +
          '<span class="opt-c">' + esc(it.c) + '</span>' +
          '<span class="opt-d">' + esc(it.d) + '</span></li>';
      }).join('');
      var n = results.length;
      html += '<li class="opt opt-search" role="option" id="opt-' + n + '" aria-selected="false" data-i="' + n + '">' +
        '<span class="opt-t">Search all of hall.whps.org for “' + esc(raw.trim()) + '”</span></li>';
      list.innerHTML = html;
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');

      clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        status.textContent = n === 0
          ? 'No matching pages. Press Enter to search the whole site.'
          : n + (n === 1 ? ' suggestion' : ' suggestions') + '. Use up and down arrows to choose.';
      }, 450);
    };

    var close = function () {
      list.hidden = true;
      active = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    };

    var setActive = function (i) {
      var opts = list.querySelectorAll('.opt');
      if (!opts.length) return;
      if (i < 0) i = opts.length - 1;
      if (i >= opts.length) i = 0;
      opts.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      opts[i].setAttribute('aria-selected', 'true');
      opts[i].scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', opts[i].id);
      active = i;
    };

    var go = function (i) {
      if (i >= results.length) { close(); form.submit(); return; }
      var it = results[i];
      close();
      if (it.act === 'a11y') {
        var btn = document.querySelector('.site-head [data-a11y-toggle]') || document.querySelector('[data-a11y-toggle]');
        if (btn) btn.click();
        return;
      }
      if (it.ext) window.open(it.u, '_blank', 'noopener');
      else window.location.href = it.u;
    };

    input.addEventListener('input', render);
    input.addEventListener('focus', function () { if (input.value.trim()) render(); });
    input.addEventListener('keydown', function (e) {
      var open = !list.hidden;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) { render(); }
        setActive(active + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (open) setActive(active - 1);
      } else if (e.key === 'Enter') {
        if (open && active > -1) { e.preventDefault(); go(active); }
        else if (open && results.length) { e.preventDefault(); go(0); }
      } else if (e.key === 'Escape') {
        if (open) { e.preventDefault(); close(); }
        else if (input.value) { input.value = ''; }
      } else if (e.key === 'Tab') {
        close();
      }
    });
    list.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep focus in input
    list.addEventListener('click', function (e) {
      var o = e.target.closest('.opt');
      if (o) go(Number(o.dataset.i));
    });
    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) close();
    });
  }

  /* ---------- Menu disclosure ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('site-menu');
  if (menuBtn && menu) {
    var setMenu = function (open, returnFocus) {
      menu.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
      else if (returnFocus) menuBtn.focus();
    };
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true', false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    document.addEventListener('click', function (e) {
      if (menuBtn.getAttribute('aria-expanded') === 'true' && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false, false);
    });
    menu.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !menu.contains(e.relatedTarget) && e.relatedTarget !== menuBtn) setMenu(false, false);
    });
  }

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') n = tabs[0];
      else if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- Notice filters ---------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var notices = Array.prototype.slice.call(document.querySelectorAll('#inbox > li'));
  var nStatus = document.getElementById('notice-status');
  var empty = document.getElementById('inbox-empty');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var type = f.dataset.filter, shown = 0;
      filters.forEach(function (x) { x.setAttribute('aria-pressed', String(x === f)); });
      notices.forEach(function (li) {
        var on = type === 'all' || li.dataset.type === type;
        li.hidden = !on;
        if (on) shown++;
      });
      empty.hidden = shown > 0;
      nStatus.textContent = 'Showing ' + shown + (shown === 1 ? ' notice' : ' notices') + '.';
    });
  });
})();
