/* main.js: the scroll engine.
   Each .stop is a tall section with a pinned .stage. The stage holds a scene made of
   stacked SVG layers; scrolling moves the layers at different speeds (parallax),
   lowers the stop's own foreground "curtain" to reveal it, and raises the next
   stop's curtain to leave. Cards scroll over the pinned scene as normal content. */
(function () {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.documentElement;

  // every gradient lives in one hidden svg so all layers can share them
  const defs = document.createElementNS(NS, 'svg');
  defs.setAttribute('class', 'defs'); defs.setAttribute('aria-hidden', 'true');
  defs.innerHTML = '<defs>' + Object.values(Scenes).map((s) => s.defs || '').join('') + '</defs>';
  document.body.prepend(defs);

  // ---------- build ----------
  const els = [...document.querySelectorAll('.stop')];
  const stops = els.map((el, i) => {
    const scene = Scenes[el.dataset.scene], stage = el.querySelector('.stage'), holder = el.querySelector('.scene');
    const next = els[i + 1] ? Scenes[els[i + 1].dataset.scene] : null;
    const layers = scene.layers.map((L) => {
      let node, svg = null;
      if (L.html) {
        node = document.createElement('div'); node.className = 'layer-html ' + (L.cls || ''); node.innerHTML = L.html;
      } else {
        svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'layer ' + (L.cls || '')); svg.innerHTML = L.svg; node = svg;
        if (L.curtain) { node = document.createElement('div'); node.className = 'curtain'; node.style.setProperty('--c', scene.curtain.color); node.appendChild(svg); }
      }
      holder.appendChild(node);
      return { def: L, node, svg, depth: L.depth || 0, key: L.key, x: 0, y: 0, s: 1, o: 1, rot: 0, last: '', hidden: false, wasHidden: false };
    });
    const exit = el.querySelector('.exit');
    if (exit && next) {
      exit.style.setProperty('--c', next.curtain.color);
      exit.innerHTML = `<svg viewBox="0 0 2000 240" preserveAspectRatio="none"><path d="${Art.edge(next.curtain.edge, i + 3)}" fill="${next.curtain.color}"/></svg>`;
    }
    if (scene.curtain) { stage.style.background = scene.curtain.color; el.classList.toggle('on-light', scene.curtain.text === 'dark'); }
    const S = { el, stage, holder, scene, layers, exit: next ? exit : null, chapter: el.querySelector('.chapter'), tag: el.querySelector('.stop-tag'),
      beatEls: [...el.querySelectorAll('.beat')], beats: [], active: null, L: {} };
    layers.forEach((l) => { if (l.key) S.L[l.key] = l; });
    if (scene.init) scene.init(S);
    return S;
  });

  // ---------- layout ----------
  let vw = 0, vh = 0, B = 60;
  function layout() {
    vw = root.clientWidth; vh = stops[0].stage.clientHeight;
    B = Math.round(Math.max(48, vw * 0.045));
    root.style.setProperty('--B', B + 'px');
    const y = scrollY;
    // A frame says how a drawing sits on screen: its size in drawing units, where it starts (origin),
    // the point kept centred (focus), and optionally the least width that must stay visible (minW).
    const fit = (fr) => {
      const W = fr.size[0], H = fr.size[1], o = fr.origin || [0, 0];
      const focus = (vw / vh < 1 && fr.focusNarrow) || fr.focus;
      let unit = Math.max(vw / W, vh / H);
      if (fr.minW && vw / unit < fr.minW) unit = vw / fr.minW;
      const uw = vw / unit, uh = vh / unit;
      const x0 = clamp(focus[0] - uw / 2, o[0], Math.max(o[0], o[0] + W - uw));
      const y0 = uh > H ? focus[1] - uh / 2 : clamp(focus[1] - uh / 2, o[1], o[1] + H - uh);
      return { unit, vb: { x: x0, y: y0, w: uw, h: uh } };
    };
    stops.forEach((S) => {
      const sc = S.scene, base = fit(sc);
      S.unit = base.unit; S.B = B; S.vb = base.vb;
      S.layers.forEach((l) => {
        if (!l.svg) return;
        // a layer may bring its own frame; extraTop / extraBottom keep drawing beyond the frame for scenes that pan
        const fr = l.def.frame || sc, ft = l.def.frame ? fit(fr) : base;
        const b = B / ft.unit, et = fr.extraTop || 0, ex = fr.extraBottom || 0;
        l.unit = ft.unit; l.vb = ft.vb; l.padBot = ex * ft.unit;
        l.svg.setAttribute('viewBox', `${ft.vb.x - b} ${ft.vb.y - b - et} ${ft.vb.w + 2 * b} ${ft.vb.h + 2 * b + ex + et}`);
        l.svg.style.height = `calc(100% + ${2 * B + (ex + et) * ft.unit}px)`;
        l.svg.style.top = -(B + et * ft.unit) + 'px';
        if (l.def.curtain) l.node.style.setProperty('--cb', B + l.padBot + 'px');
        l.last = '';
      });
      const r = S.el.getBoundingClientRect();
      S.top = r.top + y; S.h = r.height;
      S.beats = S.beatEls.map((b2) => { const br = b2.getBoundingClientRect(); return { name: b2.dataset.beat, top: br.top - r.top, h: br.height }; });
      if (sc.layout) sc.layout(S);
    });
  }

  // ---------- pointer ----------
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => { tmx = (e.clientX / vw - 0.5) * 2; tmy = (e.clientY / vh - 0.5) * 2; }, { passive: true });
  }

  // ---------- frame ----------
  function frame(t) {
    const y = scrollY, time = t / 1000;
    mx += (tmx - mx) * 0.07; my += (tmy - my) * 0.07;
    let current = 0;
    stops.forEach((S, i) => {
      const s = y - S.top, total = S.h - vh;
      if (s > -vh * 0.5) current = i;
      const near = s > -vh * 1.5 && s < total + vh * 1.5;
      if (near !== S.active) { S.active = near; S.holder.style.display = near ? '' : 'none'; S.layers.forEach((l) => (l.last = '')); }
      if (!near) return;

      const R = S.scene.noReveal ? 0 : 0.9 * vh, X = S.exit ? 0.9 * vh : 0;
      const r = R ? clamp(s / R) : 1, x = X ? clamp((s - (total - X)) / X) : 0;
      const d = clamp((s - R) / Math.max(1, total - R - X)), e = easeOut(r);
      const beats = {}, beatEnd = {};
      S.beats.forEach((b) => { beats[b.name] = clamp((s - (b.top - vh)) / b.h); beatEnd[b.name] = b.top - vh + b.h; });

      S.layers.forEach((l) => {
        l.x = 0; l.s = 1; l.o = 1; l.rot = 0; l.hidden = false;
        l.y = l.def.curtain ? -(1 - e) * (vh + B + 6 + (l.padBot || 0)) : -(1 - e) * l.depth * vh * 0.16;
        if (!reduce) { l.x += -(d - 0.5) * l.depth * vw * 0.03 - mx * l.depth * 9; l.y += -my * l.depth * 4; }
      });
      if (S.scene.update) S.scene.update({ S, s, total, r, e, x, d, beats, beatEnd, vw, vh, unit: S.unit, vb: S.vb, B, time, L: S.L, layers: S.layers, reduce, clamp, easeIO, easeOut });
      S.layers.forEach((l) => {
        // a scene can switch a layer off entirely (two views sharing one stop)
        if (l.hidden !== l.wasHidden) { l.node.style.display = l.hidden ? 'none' : ''; l.wasHidden = l.hidden; l.last = ''; }
        if (l.hidden) return;
        const tf = `translate3d(${l.x.toFixed(1)}px,${l.y.toFixed(1)}px,0)` + (l.s !== 1 ? ` scale(${l.s.toFixed(4)})` : '') + (l.rot ? ` rotate(${l.rot.toFixed(2)}deg)` : '');
        const key = tf + '|' + l.o.toFixed(3);
        if (key !== l.last) { l.node.style.transform = tf; l.node.style.opacity = l.o.toFixed(3); l.last = key; }
      });

      if (S.chapter) { S.chapter.style.transform = `translate3d(0,${(e * vh * 0.5).toFixed(1)}px,0)`; S.chapter.style.opacity = clamp(1 - e * 1.8).toFixed(3); }
      if (S.tag) S.tag.style.opacity = (clamp((r - 0.8) * 5) * clamp(1 - x * 3)).toFixed(3);
      if (S.exit) S.exit.style.transform = `translate3d(0,calc((100% + 16vh) * ${(1 - easeIO(x)).toFixed(4)}),0)`;
    });
    nav(current, y);
    requestAnimationFrame(frame);
  }

  // ---------- route nav ----------
  const route = document.getElementById('route');
  const dots = stops.map((S, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.innerHTML = `<i></i><span>${S.el.dataset.nav}</span>`; b.setAttribute('aria-label', 'Go to ' + S.el.dataset.nav);
    b.addEventListener('click', () => jump(i));
    route.appendChild(b); return b;
  });
  let lastCur = -1;
  function nav(cur, y) {
    if (cur !== lastCur) { dots.forEach((b, i) => { b.classList.toggle('on', i === cur); b.classList.toggle('done', i < cur); }); lastCur = cur; }
    const S = stops[cur], nx = stops[cur + 1];
    const local = nx ? clamp((y - S.top) / (nx.top - S.top)) : 0;
    route.style.setProperty('--p', clamp((cur + local) / (stops.length - 1)).toFixed(4));
  }
  function jump(i) {
    const S = stops[i];
    scrollTo({ top: S.top + (S.scene.noReveal ? 0 : 0.95 * vh), behavior: reduce ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); const i = stops.findIndex((S) => S.el.id === a.dataset.jump); if (i >= 0) jump(i);
  }));

  // ---------- quick view: every card in one plain list ----------
  const quick = document.getElementById('quick'), list = document.getElementById('quick-list');
  if (quick && list) {
    stops.forEach((S) => {
      const cards = S.el.querySelectorAll('.card[data-quick]'); if (!cards.length) return;
      const h = document.createElement('h3'); h.className = 'q-stop'; h.textContent = S.el.dataset.quick || S.el.dataset.nav; list.appendChild(h);
      cards.forEach((c) => { const d = document.createElement('div'); d.className = 'q-item'; d.innerHTML = c.innerHTML; list.appendChild(d); });
    });
    document.querySelectorAll('[data-open-quick]').forEach((b) => b.addEventListener('click', () => quick.showModal()));
    quick.addEventListener('click', (e) => { if (e.target === quick || e.target.closest('[data-close]')) quick.close(); });
    if (location.hash === '#quick') quick.showModal();   // a link ending in #quick opens straight to the one-page view
  }

  // ---------- go ----------
  layout();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  addEventListener('load', layout);
  requestAnimationFrame(frame);
})();
