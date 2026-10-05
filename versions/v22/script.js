/* v22 — Today Band + Stories
 * 1) Mobile menu toggle and nav dropdowns (v16; open on hover/focus in CSS, Escape closes).
 * 2) Language menu and browser-language offer (v17). Preview the offer with ?lang=es
 *    (or zh, pt, vi, ar). "No thanks" is remembered.
 * 3) Today band (v13): "Bell schedule, lunch & events" disclosure, a one-line now/next
 *    readout, a thin day bar, and the current block highlighted in the bell schedule.
 *    Sample day is Thu Oct 1 (Even Day). Preview any time with ?t=HH:MM.
 * 4) Search (v03): suggestions from everyday words; some jump to this page's sections.
 * Without JS the band's details are shown and the search box searches hall.whps.org.
 */
(function () {
  document.documentElement.classList.add('js');

  function disclosure(btn, target, opts) {
    opts = opts || {};
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      if (opts.cls) target.classList.toggle(opts.cls, open);
      else target.hidden = !open;
      if (opts.onSet) opts.onSet(open);
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    [btn, target].forEach(function (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true' && !e.defaultPrevented) { set(false); btn.focus(); }
      });
    });
    if (opts.outside) {
      document.addEventListener('click', function (e) {
        if (btn.getAttribute('aria-expanded') === 'true' && !btn.contains(e.target) && !target.contains(e.target)) set(false);
      });
    }
    return set;
  }

  /* ---------- Menu + dropdowns ---------- */
  var navBtn = document.querySelector('.primary__toggle');
  var navList = document.getElementById('primary-links');
  if (navBtn && navList) disclosure(navBtn, navList, { cls: 'is-open', outside: true });

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

  /* ---------- Language menu ---------- */
  var langBtn = document.querySelector('.lang__btn');
  var langMenu = document.getElementById('lang-menu');
  if (langBtn && langMenu) {
    var setLang = disclosure(langBtn, langMenu, { outside: true });
    langMenu.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !langMenu.parentElement.contains(e.relatedTarget)) setLang(false);
    });
  }

  /* ---------- Today band: disclosure ---------- */
  var moreBtn = document.querySelector('.more-btn');
  var morePanel = document.getElementById('today-more');
  var setMore = function () {};
  if (moreBtn && morePanel) setMore = disclosure(moreBtn, morePanel, { cls: 'is-open' });

  /* ---------- Today band: now / next ---------- */
  function toMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    return (((h + 11) % 12) + 1) + ':' + (mm < 10 ? '0' : '') + mm;
  }

  var NAMES = ['Block 2', 'Block 4', 'Advisory', 'Block 6', 'Block 8'];
  var bars = Array.prototype.slice.call(document.querySelectorAll('#dayline li'));
  var rows = Array.prototype.slice.call(document.querySelectorAll('#bells li'));
  var blocks = bars.map(function (el, i) {
    return { bar: el, row: rows[i], name: NAMES[i], start: toMin(el.dataset.start), end: toMin(el.dataset.end) };
  });
  var waves = [['A', '10:52', '11:20'], ['B', '11:24', '11:52'], ['C', '11:56', '12:24']];
  var nowText = document.getElementById('now-text');

  var override = null;
  var tq = /[?&]t=(\d{1,2}):?(\d{2})/.exec(location.search);
  if (tq) override = +tq[1] * 60 + +tq[2];

  function minutes() {
    if (override !== null) return override;
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function renderNow() {
    var t = minutes(), first = blocks[0], last = blocks[blocks.length - 1];
    var cur = -1, nxt = -1;
    blocks.forEach(function (b, i) {
      if (t >= b.start && t < b.end) cur = i;
      if (nxt === -1 && t < b.start) nxt = i;
    });

    var html;
    if (t < first.start) {
      html = '<b>Before school</b> <span class="faint">· First bell 7:30 AM, Block 2</span>';
    } else if (t >= last.end) {
      html = '<b>School day ended 2:10 PM</b> <span class="faint">· Fri, Oct 2 is an odd day</span>';
    } else if (cur >= 0) {
      var b = blocks[cur], n = blocks[cur + 1];
      html = '<b>Now: ' + b.name + '</b> until ' + fmt(b.end);
      if (b.name === 'Block 6') {
        waves.forEach(function (w) {
          if (t >= toMin(w[1]) && t < toMin(w[2])) html += ' · Lunch ' + w[0] + ' until ' + fmt(toMin(w[2]));
        });
      }
      html += n ? ' <span class="faint">· Next: ' + n.name + ' at ' + fmt(n.start) + '</span>'
                : ' <span class="faint">· Dismissal at 2:10 PM</span>';
    } else {
      html = '<b>Passing time</b> <span class="faint">· ' + blocks[nxt].name + ' at ' + fmt(blocks[nxt].start) + '</span>';
    }
    nowText.innerHTML = html;

    blocks.forEach(function (b, i) {
      var done = t >= b.end ? 1 : t <= b.start ? 0 : (t - b.start) / (b.end - b.start);
      b.bar.style.setProperty('--done', done.toFixed(3));
      b.bar.classList.toggle('is-now', i === cur);
      if (!b.row) return;
      b.row.classList.toggle('is-now', i === cur);
      b.row.classList.toggle('is-past', t >= b.end);
      if (i === cur) b.row.setAttribute('aria-current', 'time');
      else b.row.removeAttribute('aria-current');
    });
  }

  if (nowText && blocks.length) {
    renderNow();
    if (override === null) setInterval(renderNow, 30000);
  }

  /* ---------- Search ----------
   t: title, d: description, c: category, u: url, k: everyday words people type,
   ext: opens in a new tab, act: does something on this page instead of leaving it. */
  var BELL = 'https://hall.whps.org/school-information/bell';
  var COUNS = 'https://hall.whps.org/school-counseling';
  var INDEX = [
    { t: 'Today’s bell schedule', d: 'Even day: blocks 2, 4, 6 and 8, with advisory and lunch waves.', c: 'Today', act: 'today', k: 'bell schedule blocks block period periods time times odd even day start end advisory when today now next' },
    { t: 'Lunch today', d: 'Chicken teriyaki rice bowl · black bean burrito (vegetarian) · salad bar.', c: 'Today', act: 'today', k: 'lunch food menu cafeteria eat eating hungry meal vegetarian waves' },
    { t: 'All bell schedules', d: 'Odd, even, early dismissal and delayed opening.', c: 'Schedules', u: BELL, k: 'bell schedules early dismissal delayed opening half day odd even' },
    { t: 'Game day & events', d: 'Home games, concerts, testing and schedule changes.', c: 'On this page', u: '#events', k: 'events game games football sports concert show gala calendar coming up upcoming this week weekend' },
    { t: 'Bulletin', d: 'Early dismissal, PSAT, senior portraits and other notices.', c: 'On this page', u: '#bulletin', k: 'bulletin announcements announcement news notices notice updates' },
    { t: 'New to Hall?', d: 'Tours, the program of studies and registering with WHPS.', c: 'On this page', u: '#visit', k: 'new family families enroll enrollment register registration tour visit moving move transfer prospective incoming freshman ninth grade' },
    { t: 'Calendar', d: 'Days off, testing dates and events.', c: 'Schedules', u: 'https://hall.whps.org/calendar', k: 'calendar dates events holiday holidays vacation break no school day off days off snow' },
    { t: 'Report an absence', d: 'Sick, late or leaving early: tell the attendance office.', c: 'Families', u: 'https://hall.whps.org/attendance', k: 'absent absence sick ill attendance late tardy dismissal doctor appointment excuse note missing out call in' },
    { t: 'PowerSchool', d: 'Grades, attendance records and schedules.', c: 'Portals', u: 'https://whps.powerschool.com/public/', ext: true, k: 'powerschool grades grade report card gpa marks portal parent portal progress' },
    { t: 'Schoology', d: 'Homework, assignments and class materials.', c: 'Portals', u: 'https://whps.schoology.com/', ext: true, k: 'schoology homework assignment assignments class classes classwork teacher materials due' },
    { t: 'Naviance', d: 'College search, applications, careers and scholarships.', c: 'Portals', u: 'https://student.naviance.com/hallhs', ext: true, k: 'naviance college colleges university application applications career careers scholarship scholarships recommendation' },
    { t: 'School counseling', d: 'Course choices, college planning and someone to talk to.', c: 'Support', u: COUNS, k: 'counseling counselor counselors guidance college schedule change course selection stress talk help advice' },
    { t: 'Support services', d: 'Psychologists, social workers, special education and 504s.', c: 'Support', u: 'https://hall.whps.org/support-services', k: 'support services special education sped 504 iep psychologist social worker mental health wellness' },
    { t: 'Anonymous Alerts', d: 'Report bullying or a safety concern privately.', c: 'Support', u: 'https://www.anonymousalerts.com', ext: true, k: 'anonymous alerts bully bullying bullied unsafe safety safe report harassment threat worried' },
    { t: 'English learner support', d: 'Teachers who help students who are new to English.', c: 'Support', u: 'https://hall.whps.org/english-learners', k: 'english learners ell esl esol new to english language translate interpreter' },
    { t: 'Health office', d: 'School nurse, medication forms and immunizations.', c: 'Support', u: 'https://hall.whps.org/health-office', k: 'nurse health medication medicine immunization immunizations physical injury hurt sick at school' },
    { t: 'Athletics', d: 'Teams, tryouts, schedules and scores.', c: 'Activities', u: 'https://hall.whps.org/athletics', k: 'athletics sports sport team teams football soccer basketball tryouts tryout scores coach warriors' },
    { t: 'Tryouts & eligibility', d: 'Sign up for a team and upload a sports physical.', c: 'Activities', u: 'https://hall.whps.org/athletics/eligibility', k: 'registration sport sports physical eligibility permission tryout tryouts signup sign up' },
    { t: 'Clubs & publications', d: 'Student government, newspaper, yearbook and more.', c: 'Activities', u: 'https://hall.whps.org/activities', k: 'clubs club activities activity newspaper yearbook publications groups extracurricular after school join' },
    { t: 'Music & fine arts', d: 'Bands, choirs, orchestra, theater and visual art.', c: 'Activities', u: 'https://hall.whps.org/fine-arts', k: 'music band choir orchestra art arts theater theatre drama concert gala midfest' },
    { t: 'Program of studies', d: 'Every course, elective and pathway.', c: 'Academics', u: 'https://hall.whps.org/school-counseling/program-of-studies', k: 'courses course classes electives program of studies catalog course selection pathway' },
    { t: 'AP & UConn ECE', d: 'College-level courses and college credit at Hall.', c: 'Academics', u: 'https://hall.whps.org/academics/ap-ece', k: 'ap advanced placement uconn ece early college credit honors' },
    { t: 'Testing: PSAT, SAT, ACT, AP', d: 'SAT Oct 3 · PSAT Oct 14 for grades 9–11.', c: 'Academics', u: 'https://hall.whps.org/testing', k: 'test testing tests sat psat act ap exam exams scores standardized bluebook' },
    { t: 'Library', d: 'Research databases, books, printing and study space.', c: 'Academics', u: 'https://hall.whps.org/library', k: 'library books book databases research printing print librarian study' },
    { t: 'Transcripts & records', d: 'Request an official transcript.', c: 'Academics', u: COUNS, k: 'transcript transcripts records request official' },
    { t: 'Senior portraits', d: 'Sign-ups open through Oct 24, Rooms E131 / E119.', c: 'Class of 2027', u: '#bulletin', k: 'senior seniors portraits portrait photo photos yearbook class of 2027 graduation' },
    { t: 'Bus & transportation', d: 'Routes and stops, set by the WHPS transportation office.', c: 'Families', u: 'https://www.whps.org/transportation', ext: true, k: 'bus buses transportation ride route routes late bus stop' },
    { t: 'eCollect annual forms', d: 'Emergency card and permission forms online.', c: 'Families', u: 'https://whps.ecollectforms.com', ext: true, k: 'forms form ecollect annual emergency card permission paperwork' },
    { t: 'Directory', d: 'Find a teacher or office.', c: 'Contact', u: 'https://hall.whps.org/directory', k: 'directory teacher teachers email staff contact phone' },
    { t: 'Contact & directions', d: '975 North Main Street · 860-232-4561.', c: 'Contact', u: 'https://hall.whps.org/contact-us', k: 'contact address phone directions map main office call location where' },
    { t: 'Accessibility options', d: 'Larger text, high contrast, readable font.', c: 'Help', act: 'a11y', k: 'accessibility accessible larger text bigger font contrast dyslexia readable zoom low vision' },
    { t: 'Read this site in another language', d: 'Español, 中文, Português, Tiếng Việt, العربية…', c: 'Help', act: 'lang', k: 'translate translation language languages spanish espanol español chinese mandarin portuguese vietnamese arabic idioma' },
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
        if (w === term) hit = Math.max(hit, 30);
        else if (term.length >= 2 && w.indexOf(term) === 0) hit = Math.max(hit, 20);
      }
      if (!hit) return s >= 60 ? s : 0; // every word must match something
      s += hit;
    }
    return s;
  }

  function find(raw) {
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
    var q = raw.trim(), i = q ? title.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (i < 0) return esc(title);
    return esc(title.slice(0, i)) + '<mark>' + esc(title.slice(i, i + q.length)) + '</mark>' + esc(title.slice(i + q.length));
  }

  var form = document.getElementById('search-form');
  var input = document.getElementById('q');
  var list = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  var toggle = document.querySelector('.search-toggle');
  if (!form || !input || !list) return langOffer();

  /* on narrow screens the box hides behind an icon button */
  var setSearch = function () {};
  if (toggle) {
    setSearch = disclosure(toggle, form, {
      cls: 'is-open', outside: true,
      onSet: function (open) { if (open) input.focus(); }
    });
  }

  var results = [], active = -1, announce;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'search-results');

  function close() {
    list.hidden = true;
    active = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function render() {
    var raw = input.value;
    results = find(raw);
    active = -1;
    input.removeAttribute('aria-activedescendant');
    if (!raw.trim()) { close(); status.textContent = ''; return; }

    var n = results.length;
    list.innerHTML = results.map(function (it, i) {
      return '<li class="opt" role="option" id="opt-' + i + '" aria-selected="false" data-i="' + i + '">' +
        '<span class="opt__t">' + highlight(it.t, raw) + (it.ext ? '<span class="sr-only"> (opens in new tab)</span>' : '') + '</span>' +
        '<span class="opt__c">' + esc(it.c) + '</span>' +
        '<span class="opt__d">' + esc(it.d) + '</span></li>';
    }).join('') +
      '<li class="opt opt--site" role="option" id="opt-' + n + '" aria-selected="false" data-i="' + n + '">' +
      '<span class="opt__t">Search all of hall.whps.org for “' + esc(raw.trim()) + '”</span></li>';
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');

    clearTimeout(announce);
    announce = setTimeout(function () {
      status.textContent = n === 0
        ? 'No matching pages. Press Enter to search the whole site.'
        : n + (n === 1 ? ' suggestion' : ' suggestions') + '. Use the up and down arrows to choose.';
    }, 450);
  }

  function setActive(i) {
    var opts = list.querySelectorAll('.opt');
    if (!opts.length) return;
    if (i < 0) i = opts.length - 1;
    if (i >= opts.length) i = 0;
    Array.prototype.forEach.call(opts, function (o) { o.setAttribute('aria-selected', 'false'); });
    opts[i].setAttribute('aria-selected', 'true');
    opts[i].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', opts[i].id);
    active = i;
  }

  function jumpTo(id, focusEl) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'start' });
    (focusEl || el).focus({ preventScroll: true });
  }

  function go(i) {
    if (i >= results.length) { close(); form.submit(); return; }
    var it = results[i];
    close();
    input.value = '';
    setSearch(false);
    if (it.act === 'today') {
      setMore(true);
      jumpTo('today', moreBtn);
    } else if (it.act === 'a11y') {
      var a = document.querySelector('[data-a11y-toggle]');
      if (a) a.click();
    } else if (it.act === 'lang') {
      if (langBtn) { window.scrollTo(0, 0); langBtn.click(); var f = langMenu.querySelector('a'); if (f) f.focus(); }
    } else if (it.u.charAt(0) === '#') {
      var target = document.getElementById(it.u.slice(1));
      if (target) {
        target.setAttribute('tabindex', '-1');
        jumpTo(it.u.slice(1));
        history.replaceState(null, '', it.u);
      }
    } else if (it.ext) {
      window.open(it.u, '_blank', 'noopener');
    } else {
      window.location.href = it.u;
    }
  }

  input.addEventListener('input', render);
  input.addEventListener('focus', function () { if (input.value.trim()) render(); });
  input.addEventListener('keydown', function (e) {
    var open = !list.hidden;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) render();
      setActive(active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) setActive(active - 1);
    } else if (e.key === 'Enter') {
      if (open && active > -1) { e.preventDefault(); go(active); }
      else if (open && results.length) { e.preventDefault(); go(0); }
    } else if (e.key === 'Escape') {
      if (open) { e.preventDefault(); close(); }
      else if (input.value) { e.preventDefault(); input.value = ''; }
    } else if (e.key === 'Tab') {
      close();
    }
  });
  list.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep focus in the box
  list.addEventListener('click', function (e) {
    var o = e.target.closest('.opt');
    if (o) go(Number(o.dataset.i));
  });
  document.addEventListener('click', function (e) { if (!form.contains(e.target)) close(); });

  /* "/" jumps to search, as on many sites, unless you're typing somewhere */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || document.activeElement.isContentEditable) return;
    e.preventDefault();
    if (toggle && getComputedStyle(toggle).display !== 'none') setSearch(true);
    else input.focus();
  });

  langOffer();

  /* ---------- Language offer (v17) ---------- */
  function langOffer() {
    var OFFERS = {
      es: { tl: 'es', q: '¿Quiere ver este sitio en español?', yes: 'Sí, traducir', no: 'No, gracias' },
      zh: { tl: 'zh-CN', q: '要用中文浏览本网站吗？', yes: '是的，翻译', no: '不用了', lang: 'zh-Hans' },
      pt: { tl: 'pt', q: 'Quer ver este site em português?', yes: 'Sim, traduzir', no: 'Não, obrigado' },
      vi: { tl: 'vi', q: 'Bạn có muốn xem trang này bằng tiếng Việt không?', yes: 'Có, dịch trang', no: 'Không, cảm ơn' },
      ar: { tl: 'ar', q: 'هل تريد عرض هذا الموقع باللغة العربية؟', yes: 'نعم، ترجم', no: 'لا، شكراً', dir: 'rtl' }
    };
    var offer = document.getElementById('lang-offer');
    if (!offer) return;

    var dismissed = false;
    try { dismissed = localStorage.getItem('hall-lang-offer') === 'no'; } catch (e) {}

    var lq = /[?&]lang=([a-z]{2})/.exec(location.search);
    var prefs = lq ? [lq[1]] : (navigator.languages || [navigator.language || 'en']);
    var code = String(prefs[0] || 'en').slice(0, 2).toLowerCase();
    var o = OFFERS[code];
    if (!o || (dismissed && !lq)) return;

    var inner = offer.querySelector('.lang-offer__inner');
    inner.setAttribute('lang', o.lang || code);
    if (o.dir) inner.setAttribute('dir', o.dir);
    document.getElementById('lang-offer-q').textContent = o.q;
    var yes = document.getElementById('lang-offer-yes');
    yes.textContent = o.yes;
    yes.href = 'https://translate.google.com/translate?sl=en&tl=' + o.tl + '&u=https://hall.whps.org';
    var no = document.getElementById('lang-offer-no');
    no.textContent = o.no;
    no.addEventListener('click', function () {
      offer.hidden = true;
      try { localStorage.setItem('hall-lang-offer', 'no'); } catch (e) {}
    });
    offer.hidden = false;
  }
})();
