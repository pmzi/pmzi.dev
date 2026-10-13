/* pmzi.dev: Down the Stack. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var clamp = function (n, lo, hi) { return Math.min(hi, Math.max(lo, n)); };
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ── Reveal fallback (when CSS scroll-driven animation is unavailable) ── */
  if (!root.classList.contains('sdt') && 'IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { revealIO.observe(el); });
  } else if (!root.classList.contains('sdt')) {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Depth gauge: tracks scroll, drives palette-aware theme-color ── */
  var gauge = $('#gauge');
  var tip = $('#gauge-tip');
  var links = $$('a', gauge);
  var layers = $$('.layer');
  var resume = $('#resume');
  var themeMeta = $('meta[name="theme-color"]');
  var tipTimer;
  var active = 'surface';

  function setActive(layer) {
    if (layer.dataset.layer === active) return;
    active = layer.dataset.layer;
    document.body.dataset.active = active;
    links.forEach(function (a) {
      a.setAttribute('aria-current', a.dataset.layer === active ? 'true' : 'false');
    });
    if (themeMeta) themeMeta.setAttribute('content', layer.dataset.color);
  }

  function showTip(layerName) {
    tip.textContent = layerName;
    gauge.classList.add('tip-on');
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { gauge.classList.remove('tip-on'); }, 1400);
  }

  links.forEach(function (a) {
    var nameFor = { surface: 'Surface', browser: 'Browser', node: 'Node', rails: 'Backend', core: 'Core', beyond: 'Beyond' };
    var show = function () { showTip(nameFor[a.dataset.layer]); };
    a.addEventListener('click', show);
    a.addEventListener('focus', show);
  });

  if ('IntersectionObserver' in window) {
    var gaugeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === resume) {
          gauge.classList.toggle('is-hidden', e.isIntersecting);
        } else if (e.isIntersecting) {
          setActive(e.target);
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    layers.forEach(function (l) { gaugeIO.observe(l); });
    gaugeIO.observe(resume);
  }

  /* ── 00 Surface: inspect me ── */
  var name = $('#name');
  var sel = $('#inspect-sel');
  var inspectState = { weight: true, width: false, tilt: true };

  function applyInspect() {
    name.style.setProperty('--w', inspectState.weight ? 300 : 800);
    name.style.setProperty('--wd', inspectState.width ? 75 : 100);
    name.style.setProperty('--tilt', inspectState.tilt ? '-3deg' : '0deg');
    $$('.switch-row').forEach(function (btn) {
      var p = btn.dataset.prop;
      var on = inspectState[p];
      btn.setAttribute('aria-checked', String(on));
      var out = $('[data-out]', btn);
      if (p === 'weight') out.textContent = on ? '300' : '800';
      if (p === 'width') out.textContent = on ? '75' : '100';
      if (p === 'tilt') out.textContent = on ? '-3deg' : '0deg';
    });
  }

  $$('.switch-row').forEach(function (btn) {
    btn.addEventListener('click', function () {
      inspectState[btn.dataset.prop] = !inspectState[btn.dataset.prop];
      applyInspect();
    });
  });

  var inspectTimer;
  function inspectName() {
    var r = name.getBoundingClientRect();
    sel.textContent = 'h1.name  ' + Math.round(r.width) + ' x ' + Math.round(r.height);
    name.classList.add('is-inspected');
    clearTimeout(inspectTimer);
    inspectTimer = setTimeout(function () {
      name.classList.remove('is-inspected');
      sel.textContent = 'h1.name';
    }, 1800);
  }
  name.addEventListener('click', inspectName);
  name.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inspectName(); }
  });
  applyInspect();

  /* ── 01 Browser: fill the map ── */
  var dotsEl = $('#dots');
  var dots = $$('.dot', dotsEl);
  var dotsCount = $('#dots-count');
  var filled = 10;

  function renderDots() {
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i < filled); });
    dotsEl.setAttribute('aria-valuenow', String(filled));
    var text = filled === 10 ? 'all 10 filled: 10M+' : filled + (filled === 1 ? ' dot filled' : ' dots filled');
    dotsCount.textContent = text;
    dotsEl.setAttribute('aria-valuetext', filled === 10 ? '10 dots filled: 10M+' : text);
  }

  function dotsFromPointer(e) {
    var r = dotsEl.getBoundingClientRect();
    var last = dots[dots.length - 1].getBoundingClientRect();
    var span = last.right - r.left;
    return clamp(Math.ceil(((e.clientX - r.left) / span) * 10), 1, 10);
  }

  var dotsDragging = false;
  dotsEl.addEventListener('pointerdown', function (e) {
    dotsDragging = true;
    var n = dotsFromPointer(e);
    filled = n === filled ? n - 1 : n;
    renderDots();
  });
  dotsEl.addEventListener('pointermove', function (e) {
    if (!dotsDragging) return;
    filled = dotsFromPointer(e);
    renderDots();
  });
  window.addEventListener('pointerup', function () { dotsDragging = false; });
  dotsEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') filled = clamp(filled + 1, 0, 10);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') filled = clamp(filled - 1, 0, 10);
    else if (e.key === 'Home') filled = 0;
    else if (e.key === 'End') filled = 10;
    else return;
    e.preventDefault();
    renderDots();
  });

  // Starts at 3 so the toy invites a tap; fills up when it scrolls into view.
  if (!reduced.matches) {
    filled = 3;
    renderDots();
    if ('IntersectionObserver' in window) {
      var mapIO = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        mapIO.disconnect();
        var n = filled;
        var t = setInterval(function () {
          if (dotsDragging) { clearInterval(t); return; }
          n += 1;
          if (n > 10) { clearInterval(t); return; }
          if (n > filled) { filled = n; renderDots(); }
        }, 140);
      }, { threshold: 0.8 });
      mapIO.observe(dotsEl);
    }
  }

  /* ── 02 Node: DOM mirror ── */
  var pane = $('#pane-page');
  var barPage = $('#bar-page');
  var barMirror = $('#bar-mirror');
  var mirror = 45;

  function renderMirror() {
    barPage.style.setProperty('--v', mirror + '%');
    barMirror.style.setProperty('--v', mirror + '%');
    pane.setAttribute('aria-valuenow', String(mirror));
    pane.setAttribute('aria-valuetext', mirror + ' percent');
  }

  function mirrorFromPointer(e) {
    var r = pane.getBoundingClientRect();
    var pad = 10;
    var w = r.width - pad * 2;
    mirror = clamp(Math.round(((e.clientX - r.left - pad) / w) * 100), 10, 100);
    renderMirror();
  }

  var mirrorDragging = false;
  pane.addEventListener('pointerdown', function (e) {
    mirrorDragging = true;
    pane.setPointerCapture(e.pointerId);
    mirrorFromPointer(e);
  });
  pane.addEventListener('pointermove', function (e) { if (mirrorDragging) mirrorFromPointer(e); });
  pane.addEventListener('pointerup', function () { mirrorDragging = false; });
  pane.addEventListener('pointercancel', function () { mirrorDragging = false; });
  pane.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') mirror = clamp(mirror + 5, 10, 100);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') mirror = clamp(mirror - 5, 10, 100);
    else return;
    e.preventDefault();
    renderMirror();
  });
  renderMirror();

  /* ── 03 Backend: tag shuffle ── */
  var tagsEl = $('#tags');
  var related = {
    'Ruby': ['Rails'],
    'Rails': ['Ruby'],
    'TypeScript': ['React', 'Node.js'],
    'React': ['TypeScript'],
    'Node.js': ['TypeScript', 'gRPC'],
    'gRPC': ['Node.js']
  };

  function renderTags(pick) {
    var chips = $$('.chip', tagsEl);
    var first = new Map();
    chips.forEach(function (c) { first.set(c, c.getBoundingClientRect()); });
    var picked = chips.filter(function (c) { return c.textContent === pick; })[0];
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c === picked));
      c.classList.toggle('is-related', (related[pick] || []).indexOf(c.textContent) !== -1);
    });
    tagsEl.classList.add('has-pick');
    if (picked) tagsEl.insertBefore(picked, tagsEl.firstChild);
    if (reduced.matches) return;
    chips.forEach(function (c) {
      var a = first.get(c);
      var b = c.getBoundingClientRect();
      var dx = a.left - b.left;
      var dy = a.top - b.top;
      if (!dx && !dy) return;
      c.animate(
        [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
        { duration: 380, easing: 'cubic-bezier(.3,1.3,.5,1)' }
      );
    });
  }

  tagsEl.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (chip) renderTags(chip.textContent);
  });
  tagsEl.classList.add('has-pick');
  $$('.chip', tagsEl).forEach(function (c) {
    c.classList.toggle('is-related', (related.TypeScript || []).indexOf(c.textContent) !== -1);
  });

  /* ── 04 Core: coins ── */
  var coinsEl = $('#coins');
  var coins = $$('.coin', coinsEl);
  var dropped = [];
  var ticking = false;

  function coinH() { return coinsEl.clientHeight; }

  function renderCoins() {
    ticking = false;
    var vh = window.innerHeight;
    var r = coinsEl.getBoundingClientRect();
    var p = reduced.matches ? 1 : clamp((vh - r.top) / (vh * 0.7), 0, 1);
    var H = coinH();
    var bottomPad = 28;
    coins.forEach(function (c, i) {
      var s = +c.dataset.s;
      var x = +c.dataset.x;
      var y0 = +c.dataset.y;
      var k = +c.dataset.k;
      var yEnd = H - s - bottomPad - (i % 2) * 14;
      var t = clamp((p - (1 - k) * 0.35) / (0.65 + (1 - k) * 0.35), 0, 1);
      var eased = t * t * (3 - 2 * t);
      c.style.transform = 'translate(' + x + 'px,' + (y0 + (yEnd - y0) * eased).toFixed(1) + 'px)';
      c.style.setProperty('--glow', (8 + eased * 28).toFixed(0) + 'px');
      c.style.opacity = (0.85 + eased * 0.15).toFixed(2);
    });
  }

  function requestCoins() {
    if (!ticking) { ticking = true; requestAnimationFrame(renderCoins); }
  }

  window.addEventListener('scroll', requestCoins, { passive: true });
  window.addEventListener('resize', requestCoins);
  renderCoins();

  coinsEl.addEventListener('click', function (e) {
    if (reduced.matches) return;
    var r = coinsEl.getBoundingClientRect();
    var s = 24 + Math.round(Math.random() * 16);
    var x = clamp(e.clientX - r.left - s / 2, 0, r.width - s);
    var coin = document.createElement('span');
    coin.className = 'coin';
    coin.style.width = coin.style.height = s + 'px';
    coin.style.setProperty('--glow', '24px');
    coin.style.transform = 'translate(' + x + 'px,0px)';
    coinsEl.appendChild(coin);
    var yEnd = coinH() - s - 28;
    coin.animate(
      [{ transform: 'translate(' + x + 'px,0px)', opacity: 0 }, { transform: 'translate(' + x + 'px,' + yEnd + 'px)', opacity: 1 }],
      { duration: 700, easing: 'cubic-bezier(.5,0,.9,.6)', fill: 'forwards' }
    );
    dropped.push(coin);
    if (dropped.length > 12) dropped.shift().remove();
  });

  /* ── 05 Beyond: back to the surface ── */
  $('#back').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
    name.focus({ preventScroll: true });
  });
})();
