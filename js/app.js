
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  };
  function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
  }
  function boom(opts) {
    if (typeof window.confetti !== 'function') return;
    const colors = ['#e3256b', '#ff8fb6', '#ffd1e0', '#ffe9a8', '#ffffff'];
    window.confetti(Object.assign({ particleCount: 140, spread: 90, origin: { y: .6 }, colors, zIndex: 100 }, opts || {}));
  }
  function hearts(x, y) {
    for (let i = 0; i < 8; i++) {
      const h = document.createElement('span'); h.className = 'burst'; h.textContent = ['💗', '💖', '💕'][i % 3];
      h.style.left = x + 'px'; h.style.top = y + 'px';
      h.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px'); h.style.setProperty('--dy', (-60 - Math.random() * 80) + 'px');
      document.body.appendChild(h); setTimeout(() => h.remove(), 1000);
    }
  }

  const { DIM, BOARDS, BNAME, POEM, PINS, byId, REASONS, NOTIFS, JOKES } = window.POM_DATA;

  /* ================= LOGIN ================= */
  const LS_IN = 'pom-in-v1', LS_CAKE = 'pom-cake-v1';
  function buildWall() {
    const imgs = ['m01', 'm07', 'm14', 'm03', 'm10', 'm19', 'm05', 'm11', 'm15', 'm09', 'm08', 'm17', 'm06', 'm12', 'm13', 'm16', 'm02', 'm04', 'm18'];
    const wall = $('#wall'); let html = '';
    for (let c = 0; c < 5; c++) {
      const set = []; for (let i = 0; i < 5; i++) set.push(imgs[(c * 4 + i) % imgs.length]);
      const all = set.concat(set);
      html += '<div class="col">' + all.map(n => '<img src="img/' + n + '.jpg" alt="" loading="lazy">').join('') + '</div>';
    }
    wall.innerHTML = html;
  }
  const HINTS = [
    'Think about what makes you happiest… after me 😌',
    'It\'s what you are at every restaurant, every café, every midnight snack run.',
    '<b>F _ _ _ _ E</b>'
  ];
  const WRONG = [
    'Nope. Would the birthday girl really forget herself?',
    'Wrong, Tingu. Buddhu is judging you lovingly.',
    'Still no. Think about what you ARE, not what you like.',
    'Pagal Bacchi, focus 😤',
    'Incorrect. But you\'re cute, so try again.',
    'Wrong again. Should I just send you a pastry as a hint?'
  ];
  const FOODS = ['pasta', 'paratha', 'parantha', 'aloo', 'dal', 'daal', 'chawal', 'pastry', 'pastries', 'pizza', 'momo', 'momos', 'biryani', 'maggi', 'chocolate', 'cake', 'burger', 'panipuri', 'golgappa', 'chaat', 'icecream', 'food', 'khana', 'noodles', 'fries', 'coffee', 'sandwich', 'dosa', 'idli', 'samosa', 'vadapav', 'paneer'];
  const NAMES = ['tingu', 'cutu', 'pagal', 'bacchi', 'pagalbacchi', 'mitali', 'nighoskar', 'buddhu', 'bandar'];
  let wrong = 0, hintsShown = 0;
  function showHint() {
    if (hintsShown >= HINTS.length) return false;
    const d = document.createElement('div'); d.className = 'hint';
    d.innerHTML = '<b>Hint ' + (hintsShown + 1) + ':</b> ' + HINTS[hintsShown];
    $('#hints').appendChild(d); hintsShown++; return true;
  }
  function checkPw(raw) {
    const v = raw.toLowerCase().replace(/[^a-z]/g, '');
    if (!v) return { msg: 'Type something, Tingu. Anything. Ideally the right thing.' };
    if (/food(ie|y|ii)/.test(v) || v === 'foodiee' || v === 'foodi') return { ok: true };
    if (FOODS.some(f => v.includes(f))) return { msg: 'So close. You literally ARE the answer. What do you call someone who loves all of this?' };
    if (NAMES.some(n => v.includes(n))) return { msg: 'That\'s a name, not a quality 😌 Try what you ARE.' };
    if (/love|iloveyou|babe|baby/.test(v)) return { msg: 'Aww. Also wrong. 🥺' };
    if (/monica|chandler|friends/.test(v)) return { msg: 'Could this BE any more wrong?' };
    if (/salsa|dancer|poet|poem|writer/.test(v)) return { msg: 'You ARE that too! But Buddhu picked something tastier.' };
    if (/cute|pretty|beautiful|kind|sweet|smart|funny/.test(v)) return { msg: 'True, but not the password. Think tastier.' };
    return { msg: WRONG[wrong % WRONG.length] };
  }
  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const pw = $('#pw'), res = checkPw(pw.value);
    if (res.ok) {
      $('#reply').textContent = 'Correct. The biggest foodie of them all 💗';
      $('#loginBtn').textContent = 'Welcome, Tingu 💗';
      boom();
      store.set(LS_IN, '1');
      setTimeout(() => { $('#login').hidden = true; startCake(); }, 1400);
      return;
    }
    wrong++;
    $('#reply').textContent = res.msg;
    const card = $('#loginForm'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    if (wrong === 2 || wrong === 4 || wrong === 6) showHint();
    $('#tries').textContent = wrong + (wrong === 1 ? ' wrong guess' : ' wrong guesses') + ' · Buddhu is counting';
    pw.select();
  });
  $('#forgot').addEventListener('click', () => {
    if (!showHint()) toast('All hints used. Starts with F, ends with E, rhymes with your whole personality.');
    else $('#reply').textContent = 'Buddhu says: you can\'t forget this one. Here\'s a hint.';
  });

  /* ================= CAKE ================= */
  const NS = 'http://www.w3.org/2000/svg';
  let left = 24, cakeDone = false;
  function drawCake() {
    const s = $('#cakeSvg');
    let h = '';
    h += '<defs><linearGradient id="ck" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff9cc0"/><stop offset="1" stop-color="#e3517f"/></linearGradient>' +
      '<linearGradient id="ck2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff3f7"/><stop offset="1" stop-color="#ffd3e2"/></linearGradient>' +
      '<radialGradient id="glow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>';
    h += '<ellipse cx="180" cy="270" rx="170" ry="24" fill="#f6e7ee"/><ellipse cx="180" cy="266" rx="160" ry="20" fill="#ffffff"/>';
    h += '<path d="M40 150 v100 a140 22 0 0 0 280 0 v-100z" fill="url(#ck)"/>';
    h += '<path d="M40 150 v20 q12 22 24 0 q14 30 28 0 q12 18 26 0 q14 26 28 0 q12 16 26 0 q14 30 28 0 q12 20 26 0 q14 26 28 0 q12 18 26 0 q12 22 26 0 v-20z" fill="url(#ck2)"/>';
    h += '<ellipse cx="180" cy="150" rx="140" ry="26" fill="#fff6f9"/>';
    h += '<text x="180" y="226" text-anchor="middle" font-family="Caveat, cursive" font-size="34" font-weight="700" fill="#fff">Tingu · 24</text>';
    for (let i = 0; i < 9; i++) { h += '<circle cx="' + (66 + i * 29) + '" cy="' + (252 + (i % 2) * 6) + '" r="4" fill="#fff" opacity=".85"/>'; }
    const pos = [];
    for (let i = 0; i < 12; i++) pos.push([64 + i * 21, 146]);
    for (let i = 0; i < 12; i++) pos.push([76 + i * 19, 166]);
    pos.forEach((p, i) => {
      const [x, y] = p, hgt = 30, col = ['#ffd1e0', '#fff3b0', '#c9f0ff', '#e5d6ff'][i % 4];
      h += '<g class="candle" data-i="' + i + '">' +
        '<rect x="' + (x - 10) + '" y="' + (y - hgt - 30) + '" width="20" height="' + (hgt + 34) + '" fill="transparent"/>' +
        '<rect x="' + (x - 3.5) + '" y="' + (y - hgt) + '" width="7" height="' + hgt + '" rx="2" fill="' + col + '"/>' +
        '<rect x="' + (x - 3.5) + '" y="' + (y - hgt + 6) + '" width="7" height="3" fill="#e3256b" opacity=".55"/>' +
        '<rect x="' + (x - 3.5) + '" y="' + (y - hgt + 16) + '" width="7" height="3" fill="#e3256b" opacity=".55"/>' +
        '<line x1="' + x + '" y1="' + (y - hgt) + '" x2="' + x + '" y2="' + (y - hgt - 4) + '" stroke="#3a2430" stroke-width="1.4"/>' +
        '<g class="flame"><circle cx="' + x + '" cy="' + (y - hgt - 11) + '" r="11" fill="url(#glow)"/>' +
        '<path d="M' + x + ' ' + (y - hgt - 22) + ' q7 9 0 17 q-7 -8 0 -17z" fill="#ffb02e"/>' +
        '<path d="M' + x + ' ' + (y - hgt - 15) + ' q3.5 5 0 9 q-3.5 -4 0 -9z" fill="#fff6c8"/></g></g>';
    });
    s.innerHTML = h;
    s.querySelectorAll('.candle').forEach(c => c.dataset.top = c.querySelector('line').getAttribute('y2'));
  }
  function blow(c) {
    if (!c || c.classList.contains('out')) return;
    c.classList.add('out'); left--;
    const line = c.querySelector('line');
    const sm = document.createElementNS(NS, 'circle');
    sm.setAttribute('cx', line.getAttribute('x2')); sm.setAttribute('cy', line.getAttribute('y2')); sm.setAttribute('r', '3'); sm.setAttribute('class', 'smoke');
    sm.style.transformBox = 'fill-box'; sm.style.transformOrigin = 'center';
    $('#cakeSvg').appendChild(sm); setTimeout(() => sm.remove(), 1500);
    $('#count').textContent = left > 0 ? left + (left === 1 ? ' candle left' : ' candles left') : 'All 24 out!';
    if (left === 0) finishCake();
  }
  function finishCake() {
    if (cakeDone) return; cakeDone = true;
    $('#cheat').hidden = true;
    $('#wish').textContent = 'Make a wish, Tingu ✨';
    boom({ particleCount: 200, spread: 120 });
    store.set(LS_CAKE, '1');
    setTimeout(() => { $('#cake').hidden = true; startPoem(); }, 2600);
  }
  function startCake() {
    left = 24; cakeDone = false; drawCake();
    $('#count').textContent = '24 candles left'; $('#wish').textContent = '';
    $('#cake').hidden = false; $('#cake').scrollTop = 0;
    $('#cheat').hidden = true;
    setTimeout(() => { if (!cakeDone) $('#cheat').hidden = false; }, 12000);
  }
  (function cakeInput() {
    const s = $('#cakeSvg'); let down = false;
    const hit = e => { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.closest && el.closest('.candle'); };
    s.addEventListener('pointerdown', e => { down = true; blow(hit(e)); });
    s.addEventListener('pointermove', e => { if (down || e.pointerType === 'mouse' && e.buttons) blow(hit(e)); });
    window.addEventListener('pointerup', () => down = false);
    s.addEventListener('pointercancel', () => down = false);
  })();
  $('#cheat').addEventListener('click', () => { document.querySelectorAll('#cakeSvg .candle:not(.out)').forEach(blow); });

  /* ================= POEM ================= */
  let poemTimers = [];
  function startPoem() {
    const box = $('#poemText');
    box.innerHTML = POEM.map(l => l ? '<span class="ln">' + esc(l) + '</span>' : '<span class="gap"></span>').join('');
    $('#note').classList.remove('on'); $('#poemActions').hidden = true; $('#skipPoem').hidden = false;
    $('#poem').hidden = false; $('#poem').scrollTop = 0;
    const lines = [...box.querySelectorAll('.ln')];
    poemTimers.forEach(clearTimeout); poemTimers = [];
    lines.forEach((l, i) => poemTimers.push(setTimeout(() => l.classList.add('on'), 600 + i * 1500)));
    poemTimers.push(setTimeout(showNote, 600 + lines.length * 1500 + 800));
  }
  function showNote() {
    poemTimers.forEach(clearTimeout); poemTimers = [];
    document.querySelectorAll('#poemText .ln').forEach(l => l.classList.add('on'));
    $('#note').classList.add('on'); $('#poemActions').hidden = false; $('#skipPoem').hidden = true;
    boom({ particleCount: 160, origin: { y: .8 } });
  }
  $('#skipPoem').addEventListener('click', showNote);
  $('#toFeed').addEventListener('click', () => { $('#poem').hidden = true; openApp(); boom({ particleCount: 80 }); });

  /* ================= TIME ================= */
  const BDAY = Date.parse('2026-10-20T00:00:00+05:30');
  function fmtTime(tz) { return new Intl.DateTimeFormat('en-IN', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date()); }
  function istDay(d) { const s = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d || new Date()); return Date.parse(s + 'T00:00:00Z'); }
  function daysSince(iso) { return Math.round((istDay() - Date.parse(iso + 'T00:00:00Z')) / 86400000); }
  function ageLine() {
    const diff = Date.now() - BDAY;
    if (diff < 0) { const m = Math.ceil(-diff / 60000); return 'Turning 24 in ' + Math.floor(m / 60) + 'h ' + (m % 60) + 'm'; }
    const hrs = Math.floor(diff / 3600000);
    return hrs < 1 ? '24 for a few minutes and already perfect' : '24 for ' + hrs + (hrs === 1 ? ' hour' : ' hours') + ' and counting';
  }
  function tick() {
    const p = fmtTime('Asia/Kolkata'), s = fmtTime('Australia/Sydney');
    $('#tPune').textContent = p; $('#tSyd').textContent = s;
    document.querySelectorAll('[data-clock="pune"]').forEach(e => e.textContent = p);
    document.querySelectorAll('[data-clock="syd"]').forEach(e => e.textContent = s);
    document.querySelectorAll('[data-age]').forEach(e => e.textContent = ageLine());
  }

  /* ================= PINS ================= */
  const saved = new Set();
  function byline(p) {
    return p.by === 'm' ? '<div class="pin-by"><span class="mini m" aria-hidden="true">🐒</span>Bandar</div>'
      : '<div class="pin-by"><span class="mini b" aria-hidden="true">B</span>Buddhu</div>';
  }
  function textBody(p, big) {
    const sz = big ? 1.35 : 1;
    switch (p.kind) {
      case 'level': return '<span class="k">Birthday girl</span><div class="big" style=\"--fs:' + (96 * sz) + 'px\">24</div><p><b>Level 24 unlocked</b><br><span data-age>' + ageLine() + '</span></p>';
      case 'cake': return '<span class="emoji">🎂</span><div><div class="big" style=\"--fs:' + (28 * sz) + 'px\">24 candles are waiting</div><p style="margin-top:8px;color:#f4c9da">Tap to light them again and blow them out.</p></div>';
      case 'food': return '<span class="emoji">' + p.e + '</span><div><div class="big" style=\"--fs:' + (34 * sz) + 'px\">' + esc(p.big) + '</div><p style="margin-top:8px">' + esc(p.cap) + '</p></div>';
      case 'poem': return '<span class="k" style="color:var(--accent-ink)">For the poet</span><div class="hi" lang="hi">' + POEM.slice(0, big ? POEM.length : 5).map(l => l ? esc(l) : '').join('<br>') + (big ? '' : '<br>…') + '</div><span class="hand" style="color:var(--accent)">— Buddhu</span>';
      case 'friends': return '<span class="k">Season 24, Episode 1</span><div class="big" style=\"--fs:' + (30 * sz) + 'px\">The One Where Tingu Turns 24</div><p>Could you BE any more 24?</p>';
      case 'reasons': return '<span class="emoji">💌</span><div><div class="big" style=\"--fs:' + (30 * sz) + 'px\">24 reasons I love you</div><p style="margin-top:8px">One for every year. Tap to read them all.</p></div>';
      case 'song': return '<span class="k" style="color:#f4c9da">Our song · Frankie Valli</span><div class="big" style=\"--fs:' + (28 * sz) + 'px\">Can\'t Take My Eyes Off You</div><p style="color:#f4c9da">22 Nov 2025, at a concert. I couldn\'t, and I still can\'t.</p><a class="link-pill" href="https://open.spotify.com/search/Can%27t%20Take%20My%20Eyes%20Off%20You%20Frankie%20Valli" target="_blank" rel="noopener">▶ Play it</a>';
      case 'distance': return '<span class="k">Pune ⇄ Sydney</span><div class="big" style=\"--fs:' + (40 * sz) + 'px\">10,037 km</div><p>Times I thought about you today: <b>∞</b></p>';
      case 'clocks': return '<span class="k">Two time zones, one heart</span><div class="clock2"><div><span>Tingu · Pune</span><b data-clock="pune">' + fmtTime('Asia/Kolkata') + '</b></div><div><span>Buddhu · Sydney</span><b data-clock="syd">' + fmtTime('Australia/Sydney') + '</b></div></div><p>When it\'s midnight in Pune, it\'s 5:30 am in Sydney. Buddhu is still awake for you.</p>';
      case 'salsa': return '<span class="emoji">💃🕺</span><div><div class="big" style=\"--fs:' + (30 * sz) + 'px\">Salsa Nights with Buddhu</div><p style="margin-top:8px">Lead: Tingu. Stepping on toes: Bandar. Music: never stops.</p></div>';
      case 'monica': return '<span class="emoji">🛋️</span><div><div class="big" style=\"--fs:' + (28 * sz) + 'px\">She\'s my Monica. I\'m her Chandler.</div><p style="margin-top:8px">She keeps everything perfect. I make the bad jokes. It works.</p></div>';
      case 'eatery': return '<span class="emoji">🍽️</span><div><div class="big" style=\"--fs:' + (30 * sz) + 'px\">Eatery hopping</div><p style="margin-top:8px">Rule 1: always order dessert. Rule 2: see rule 1.</p></div>';
      case '22': return '<span class="k">22 Nov · 22 Mar · 22 Aug</span><div class="big" style=\"--fs:' + (84 * sz) + 'px\">22</div><p>Met on the 22nd. Official on the 22nd. Photobooth on the 22nd. It\'s our number.</p>';
    }
    return '';
  }
  function pinHTML(p) {
    const save = '<button class="save' + (saved.has(p.id) ? ' saved' : '') + '" data-save="' + p.id + '">' + (saved.has(p.id) ? 'Saved' : 'Save') + '</button>';
    if (p.kind === 'scratch') {
      return '<article class="pin" data-pin="' + p.id + '"><div class="scratch" id="scratchBox"><div class="under"><span style="font-size:40px">🎟️</span><div class="big">One pasta date</div><p>Redeemable the moment 10,037 km becomes 0. Buddhu pays. No sharing rules apply.</p></div><canvas aria-label="Scratch to reveal"></canvas></div>' +
        '<div class="pin-meta"><p class="pin-title">Mystery pin: scratch me 🪙</p>' + byline({ by: 'b' }) + '</div></article>';
    }
    if (p.img) {
      return '<article class="pin" data-pin="' + p.id + '"><div class="pin-media" style="aspect-ratio:1/' + p.r + '" tabindex="0" role="button" aria-label="Open pin: ' + esc(p.title) + '">' +
        '<img src="img/' + p.img + '.jpg" alt="' + esc(p.title) + '" loading="lazy">' +
        (p.tag ? '<span class="pin-tag">' + esc(p.tag) + '</span>' : '') +
        '<div class="pin-over"><div class="row"><span class="board-name">' + esc(BNAME[p.boards[0]]) + '</span>' + save + '</div>' +
        '<div class="row" style="justify-content:flex-end;gap:8px"><span class="round" aria-hidden="true">♡</span><span class="round" aria-hidden="true">⋯</span></div></div></div>' +
        '<div class="pin-meta"><p class="pin-title">' + esc(p.title) + '</p>' + byline(p) + '</div></article>';
    }
    return '<article class="pin" data-pin="' + p.id + '"><div class="tcard ' + p.t + '" style="aspect-ratio:1/' + p.r + '" tabindex="0" role="button" aria-label="Open pin: ' + esc(p.title) + '">' + textBody(p, false) + '</div>' +
      '<div class="pin-meta"><p class="pin-title">' + esc(p.title) + '</p>' + byline(p) + '</div></article>';
  }
  function renderGrid(el, list) {
    el.innerHTML = list.length ? list.map(pinHTML).join('') : '<p class="empty">No pins for that. But Buddhu still thinks you\'re the best result.</p>';
    if (el.querySelector('#scratchBox')) initScratch(el.querySelector('#scratchBox'));
  }

  /* scratch card */
  let scratched = false;
  function initScratch(box) {
    const cv = box.querySelector('canvas');
    if (scratched) { cv.style.display = 'none'; return; }
    const ctx = cv.getContext('2d');
    const size = () => {
      const r = box.getBoundingClientRect(); if (!r.width) return;
      cv.width = r.width * 2; cv.height = r.height * 2;
      const g = ctx.createLinearGradient(0, 0, cv.width, cv.height);
      g.addColorStop(0, '#e3256b'); g.addColorStop(1, '#ff8fb6');
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = 'rgba(255,255,255,.18)';
      for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(Math.random() * cv.width, Math.random() * cv.height, 6 + Math.random() * 14, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = '900 ' + Math.round(cv.width / 9) + 'px Figtree, sans-serif'; ctx.fillText('Mystery pin', cv.width / 2, cv.height / 2 - 10);
      ctx.font = '700 ' + Math.round(cv.width / 16) + 'px Figtree, sans-serif'; ctx.fillText('Scratch here with your finger', cv.width / 2, cv.height / 2 + cv.width / 10);
    };
    requestAnimationFrame(size);
    let down = false, n = 0;
    const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
    const scratch = e => {
      const [x, y] = pt(e); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(x, y, cv.width / 10, 0, 7); ctx.fill();
      if (++n % 12 === 0) check();
    };
    const check = () => {
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0, tot = 0;
      for (let i = 3; i < d.length; i += 64) { tot++; if (d[i] === 0) clear++; }
      if (clear / tot > .5 && !scratched) { scratched = true; cv.style.opacity = 0; setTimeout(() => cv.style.display = 'none', 600); boom({ particleCount: 90 }); toast('Coupon unlocked: one pasta date 🍝'); }
    };
    cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); scratch(e); });
    cv.addEventListener('pointermove', e => { if (down) scratch(e); });
    cv.addEventListener('pointerup', () => { down = false; check(); });
    cv.addEventListener('pointercancel', () => down = false);
  }

  /* ================= FEED ================= */
  let curBoard = 'all';
  function renderChips() {
    const all = [{ id: 'all', name: 'All', e: '' }].concat(BOARDS);
    $('#chips').innerHTML = all.map(b => '<button class="chip" data-board="' + b.id + '" aria-pressed="' + (b.id === curBoard) + '">' + (b.e ? b.e + ' ' : '') + esc(b.name) + '</button>').join('');
  }
  function showBoard(id) {
    curBoard = id; $('#q').value = ''; $('#searchBanner').innerHTML = '';
    $('#hero').hidden = id !== 'all';
    renderChips();
    renderGrid($('#grid'), id === 'all' ? PINS : PINS.filter(p => p.boards.includes(id)));
  }
  function doSearch(raw) {
    const q = raw.trim().toLowerCase();
    if (!q) { showBoard('all'); return; }
    setView('feed');
    curBoard = 'none'; renderChips(); $('#hero').hidden = true;
    const words = q.split(/\s+/);
    const joke = JOKES.find(j => j[0].some(k => words.includes(k) || q.includes(k) && k.length > 3));
    let list;
    if (joke) {
      list = joke[2].board ? PINS.filter(p => p.boards.includes(joke[2].board)) : joke[2].ids.map(i => byId[i]);
    } else {
      list = PINS.filter(p => (p.title + ' ' + (p.cap || '') + ' ' + (p.big || '')).toLowerCase().includes(q));
    }
    const msg = joke ? joke[1] : (list.length ? list.length + ' pins for "' + raw.trim() + '"' : 'No pins for "' + raw.trim() + '".');
    $('#searchBanner').innerHTML = '<div class="banner"><p>' + esc(msg) + '<small>Search results for "' + esc(raw.trim()) + '" · ' + list.length + (list.length === 1 ? ' result' : ' results') + '</small></p><button class="btn btn-soft" data-board="all" type="button">Clear</button></div>';
    renderGrid($('#grid'), list);
  }
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSearch(e.target.value); e.target.blur(); } });
  $('#q').addEventListener('search', e => doSearch(e.target.value));

  /* ================= PIN VIEW ================= */
  function openPin(id) {
    const p = byId[id]; if (!p) return;
    if (p.kind === 'cake') { $('#app').hidden = true; startCake(); return; }
    if (p.kind === 'reasons') { openReasons(); return; }
    if (p.kind === 'scratch') return;
    const left = p.img ? '<img src="img/' + p.img + '.jpg" alt="' + esc(p.title) + '">' : '<div class="tcard ' + p.t + '">' + textBody(p, true) + '</div>';
    const cmts = (p.c || []).map(c => '<div class="cmt"><span class="mini ' + c[0] + '" aria-hidden="true">' + (c[0] === 'm' ? '🐒' : 'B') + '</span><p><b>' + (c[0] === 'm' ? 'Bandar' : 'Buddhu') + '</b>' + esc(c[1]) + '<small>Just now · ❤️ 1</small></p></div>').join('');
    const more = PINS.filter(x => x.id !== p.id && x.boards.some(b => p.boards.includes(b)) && x.kind !== 'scratch').slice(0, 10);
    const m = $('#modal');
    m.innerHTML = '<div class="sheet"><button class="close" aria-label="Close" data-close>✕</button>' +
      '<div class="pv"><div class="pv-img">' + left + '</div><div class="pv-side">' +
      '<div class="pv-actions"><div class="left"><button class="icon-btn" data-heart aria-label="Love this">♡</button><button class="icon-btn" data-share aria-label="Share">⤴</button></div>' +
      '<button class="save' + (saved.has(p.id) ? ' saved' : '') + '" data-save="' + p.id + '">' + (saved.has(p.id) ? 'Saved' : 'Save') + '</button></div>' +
      '<span style="font-size:13px;font-weight:700;color:var(--muted)">' + esc(BNAME[p.boards[0]]) + '</span>' +
      '<h2>' + esc(p.title) + '</h2>' + (p.cap && p.img ? '<p class="cap">' + esc(p.cap) + '</p>' : '') +
      '<div class="who"><img src="img/m14.jpg" alt=""><div><b>Mitali Nighoskar</b><span>1 follower who adores her</span></div></div>' +
      '<div class="comments"><h4>' + ((p.c || []).length ? (p.c.length + (p.c.length === 1 ? ' comment' : ' comments')) : 'Comments') + '</h4>' + (cmts || '<p style="margin:0;color:var(--muted);font-size:14px">No comments yet. Buddhu is speechless.</p>') + '<div id="myCmts"></div></div>' +
      '<form class="add-cmt" id="cmtForm"><input id="cmtIn" placeholder="Add a comment for Buddhu" aria-label="Add a comment"><button class="btn btn-accent" style="height:44px">Post</button></form>' +
      '</div></div>' +
      (more.length ? '<div class="more"><h3>More like this</h3><div class="grid" id="moreGrid"></div></div>' : '') +
      '</div>';
    m.hidden = false; m.scrollTop = 0; document.body.style.overflow = 'hidden';
    if (more.length) renderGrid($('#moreGrid'), more);
    $('#cmtForm').addEventListener('submit', e => {
      e.preventDefault(); const v = $('#cmtIn').value.trim(); if (!v) return;
      const d = document.createElement('div'); d.className = 'cmt';
      d.innerHTML = '<span class="mini"><img src="img/m14.jpg" alt=""></span><p><b>Tingu</b>' + esc(v) + '<small>Just now</small></p>';
      $('#myCmts').appendChild(d); $('#cmtIn').value = '';
      setTimeout(() => toast('Buddhu liked your comment 💗'), 700);
    });
    m.querySelector('.close').focus();
  }
  function openReasons() {
    const m = $('#modal');
    m.innerHTML = '<div class="sheet"><button class="close" aria-label="Close" data-close>✕</button><div class="reasons"><h2>24 reasons I love you</h2><p>One for every year, Tingu. (The real list is much longer.)</p><ol class="rlist">' +
      REASONS.map((r, i) => '<li><b>' + (i + 1) + '</b><span>' + esc(r) + '</span></li>').join('') + '</ol><p class="hand" style="color:var(--accent);margin-top:20px;font-size:30px">— Buddhu 🐒</p></div></div>';
    m.hidden = false; m.scrollTop = 0; document.body.style.overflow = 'hidden';
    m.querySelector('.close').focus();
  }
  function closeModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; document.body.style.overflow = ''; }
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#modal').hidden) closeModal(); $('#notif').hidden = true; } });

  /* global clicks: save, open pin, chips, hearts */
  document.addEventListener('click', e => {
    const sv = e.target.closest('[data-save]');
    if (sv) {
      e.stopPropagation();
      const id = sv.dataset.save, on = !saved.has(id);
      on ? saved.add(id) : saved.delete(id);
      document.querySelectorAll('[data-save="' + id + '"]').forEach(b => { b.classList.toggle('saved', on); b.textContent = on ? 'Saved' : 'Save'; });
      if (on) { toast('Saved to Buddhu\'s heart 💗'); hearts(e.clientX, e.clientY); }
      return;
    }
    if (e.target.closest('[data-heart]')) { hearts(e.clientX, e.clientY); toast('Buddhu loved this too'); return; }
    if (e.target.closest('[data-share]')) { toast('Shared with: Buddhu. (Only Buddhu.)'); return; }
    const ch = e.target.closest('[data-board]');
    if (ch) { setView('feed'); showBoard(ch.dataset.board); window.scrollTo({ top: 0 }); return; }
    if (e.target.closest('a')) return;
    const card = e.target.closest('.pin-media, .tcard');
    const pin = card && card.closest('[data-pin]');
    if (pin && !card.closest('.pv-img')) {
      if (!$('#modal').hidden) closeModal();
      openPin(pin.dataset.pin);
    }
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.pin-media, .tcard[role=button]')) {
      e.preventDefault(); e.target.click();
    }
  });

  /* ================= NOTIFICATIONS ================= */
  $('#notif').innerHTML = '<h3>Updates for Tingu</h3>' + NOTIFS.map(n =>
    '<div class="nitem"><span class="mini ' + n[0] + '" aria-hidden="true">' + (n[0] === 'm' ? '🐒' : 'B') + '</span><div><p>' + n[1] + '</p><small>' + n[2] + '</small></div></div>').join('');
  $('#bell').addEventListener('click', e => {
    e.stopPropagation();
    const n = $('#notif'); n.hidden = !n.hidden;
    $('#bell').setAttribute('aria-expanded', String(!n.hidden));
    $('#nbadge').hidden = true;
  });
  document.addEventListener('click', e => { if (!e.target.closest('#notif') && !e.target.closest('#bell')) $('#notif').hidden = true; });

  /* ================= STORY ================= */
  function renderStory() {
    const firstChat = daysSince('2025-07-20'), off = daysSince('2026-03-22');
    const tl = [
      { d: '20 Jul 2025', ic: '💬', h: 'The first random chat at IDP', p: 'Not a real meeting. Just a random conversation, nothing exchanged and somehow, the very first page of us.', img:'idp' },
      { d: '22 Nov 2025', ic: '🎶', h: 'Our first proper in-person meeting', p: 'A concert, a crowd, and one person I still couldn\'t stop looking at.', img: 'concert', note: 'Spot the two people who are about to fall for each other 👀' },
      { d: '13 Dec 2025', ic: '🎳', h: 'Bowling night', p: 'Not together yet. But definitely something there. We both had way too much fun.', img: 'bowling', note: 'Strike? No. Spark? Yes.' },
      { d: '15 Dec 2025', ic: '!!', h: 'My First Confession 😢', p: 'Do we hold something?.', img: 'insta' },
      { d: '23 - 28 Feb 2026', ic: '🍩', h: 'The 6 DAYS APART', p: 'Did you get a self realisation?'},
      { d: '22 Mar 2026', ic: '💞', h: 'We made it official', p: 'The day "us" became official. The 22nd, again.', card: 't-pink', big: 'Officially yours' },
      { d: '28 Mar 2026', ic: '❤️', h: 'The first "I love you"', p: 'Six days after making it official. Three words. Zero hesitation.', card: 't-blush', big: 'I love you.' },
      { d: '22 Aug 2026', ic: '📸', h: 'Photobooth date, LDR edition', p: 'Two cities, one photobooth strip. Distance tried. It didn\'t work.', img: 'booth' },
      { d: '20 Oct 2026', ic: '🎂', h: 'Tingu turns 24', p: 'Today. And Buddhu built you a whole website for it.', card: 't-night', big: 'Happy 24th', cake: true }
    ];
    $('#v-story').innerHTML = '<div class="story-head"><h1>Our Story 💞</h1><p>From one random July chat to 10,037 km and counting</p>' +
      '<div class="story-hero"><img src="img/us.jpg" alt="Tingu and Buddhu at sunset"></div>' +
      '<div class="counters"><div class="counter"><b>' + firstChat + '</b><span>days since our first chat</span></div><div class="counter"><b>' + off + '</b><span>days official</span></div><div class="counter"><b>22</b><span>our number</span></div></div></div>' +
      '<div class="timeline">' + tl.map(t =>
        '<div class="tl"><span class="dot" aria-hidden="true">' + t.ic + '</span><time>' + t.d + '</time><h3>' + esc(t.h) + '</h3><p>' + esc(t.p) + '</p>' +
        (t.chat ? '<div class="chat-moment"><span>THE STORY STARTED HERE · NO BIG PLANS</span><p>Just a random conversation. Nothing exchanged, except a first impression.</p><b>“I thought you were such an annoying, confused girl.” Hehe. Look at us now. 💞</b></div>'
          : t.img ? '<div class="shot"><img src="img/' + t.img + '.jpg" alt="' + esc(t.h) + '" loading="lazy">' + (t.note ? '<span class="find-hint">' + esc(t.note) + '</span>' : '') + '</div>'
            : '<div class="tcard card ' + t.card + '" style="cursor:default;min-height:0"><div class="big" style="font-size:40px">' + esc(t.big) + '</div>' + (t.cake ? '<button class="btn btn-accent" id="replayCake" style="align-self:flex-start">Blow the candles again 🎂</button>' : '') + '</div>') +
        '</div>').join('') + '</div>';
    const rc = $('#replayCake'); if (rc) rc.addEventListener('click', () => { $('#app').hidden = true; startCake(); });
  }

  /* ================= PROFILE ================= */
  function renderProfile() {
    const cover = b => {
      const ps = PINS.filter(p => p.boards.includes(b.id));
      const imgs = ps.filter(p => p.img).map(p => p.img);
      const cells = [];
      for (let i = 0; i < 3; i++) {
        if (imgs[i]) cells.push('<img src="img/' + imgs[i] + '.jpg" alt="" loading="lazy">');
        else cells.push('<div class="fill" style="background:' + ['#ffe4ee', '#fff1e3', '#ece4ff'][i] + '">' + b.e + '</div>');
      }
      return '<button class="board" data-board="' + b.id + '"><div class="cover">' + cells.join('') + '</div><h3>' + b.e + ' ' + esc(b.name) + '</h3><span>' + ps.length + ' pins</span></button>';
    };
    $('#v-profile').innerHTML = '<div class="prof"><img class="pa" src="img/m14.jpg" alt="Mitali"><h1>Mitali Nighoskar</h1><p class="handle">@tingu · also answers to Cutu and Pagal Bacchi</p>' +
      '<p class="bio">24 today 🎂 · Pune · Foodie · Poet · Salsa partner · Monica Geller in spirit · Paraglided in Himachal</p>' +
      '<p class="stats">1 follower who adores her · ∞ following her every move</p>' +
      '<div class="acts"><button class="btn btn-soft" id="editProf">Edit profile</button><button class="btn btn-accent" id="profCake">Replay birthday cake 🎂</button><button class="btn btn-soft" id="profPoem">Read the poem again</button></div></div>' +
      '<div class="boards">' + BOARDS.map(cover).join('') + '</div>';
    $('#editProf').addEventListener('click', () => toast('Nothing to edit. Already perfect.'));
    $('#profCake').addEventListener('click', () => { $('#app').hidden = true; startCake(); });
    $('#profPoem').addEventListener('click', () => { $('#app').hidden = true; startPoem(); });
  }

  /* ================= VIEWS ================= */
  function setView(v) {
    ['feed', 'story', 'profile'].forEach(k => $('#v-' + k).hidden = k !== v);
    document.querySelectorAll('.nav [data-view]').forEach(b => b.toggleAttribute('aria-current', false));
    const nb = document.querySelector('.nav [data-view="' + v + '"]'); if (nb) nb.setAttribute('aria-current', 'page');
    if (v === 'story') renderStory();
    if (v === 'profile') renderProfile();
  }
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { setView(b.dataset.view); window.scrollTo({ top: 0 }); }));
  $('#homeLogo').addEventListener('click', e => { e.preventDefault(); setView('feed'); showBoard('all'); window.scrollTo({ top: 0 }); });

  function openApp() {
    $('#app').hidden = false;
    if (!$('#grid').children.length) showBoard('all');
    setView('feed');
    window.scrollTo({ top: 0 });
  }

  /* ================= BOOT ================= */
  buildWall();
  tick(); setInterval(tick, 20000);
  const startFn = () => {
    if (store.get(LS_IN) === '1') {
      $('#login').hidden = true;
      if (store.get(LS_CAKE) === '1') openApp(); else startCake();
    }
  };
  startFn();
})();
