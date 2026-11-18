/* art.js: small helpers for drawing the poster-style scenes as SVG strings.
   Every scene is built from flat shapes: ridges, tree lines, conifers, dots. */
(function () {
  const A = (window.Art = {});
  window.Scenes = {};

  const f = (A.f = (n) => Math.round(n * 10) / 10);
  const fn = (v) => (typeof v === 'function' ? v : () => v);

  // seeded random, so every visit draws the same landscape
  A.rng = function (seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // smooth 1-D noise
  A.noise = function (seed) {
    const r = A.rng(seed), g = Array.from({ length: 256 }, () => r());
    return (x) => {
      const i = Math.floor(x), q = x - i, u = q * q * (3 - 2 * q);
      return g[i & 255] + (g[(i + 1) & 255] - g[i & 255]) * u;
    };
  };

  A.poly = (pts) => 'M ' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join(' L ') + ' Z';

  // linear interpolation through a list of [x, y] points
  A.at = function (pts) {
    return (x) => {
      if (x <= pts[0][0]) return pts[0][1];
      for (let i = 1; i < pts.length; i++) {
        if (x <= pts[i][0]) {
          const a = pts[i - 1], b = pts[i];
          return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
        }
      }
      return pts[pts.length - 1][1];
    };
  };

  // points along an organic ridge line
  A.ridgePts = function (o) {
    const n = A.noise(o.seed || 1), y = fn(o.y), wave = o.wave || 320;
    const rough = o.rough == null ? 0.35 : o.rough, pts = [];
    for (let x = o.x0; x <= o.x1 + 0.1; x += o.step || 40) {
      const v = (n(x / wave) - 0.5) * 2 + (n(x / (wave / 3.1) + 57) - 0.5) * 2 * rough + (n(x / (wave / 9) + 131) - 0.5) * 2 * rough * 0.45;
      pts.push([x, y(x) + v * o.amp]);
    }
    return pts;
  };

  // closed silhouette: the points on top, filled down to `base`
  A.shape = function (pts, base, smooth) {
    const b = fn(base), first = pts[0], last = pts[pts.length - 1];
    let d = `M ${f(first[0])} ${f(b(first[0]))} L ${f(first[0])} ${f(first[1])}`;
    if (smooth) {
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
        d += ` Q ${f(pts[i][0])} ${f(pts[i][1])} ${f(mx)} ${f(my)}`;
      }
      d += ` L ${f(last[0])} ${f(last[1])}`;
    } else {
      for (let i = 1; i < pts.length; i++) d += ` L ${f(pts[i][0])} ${f(pts[i][1])}`;
    }
    return d + ` L ${f(last[0])} ${f(b(last[0]))} Z`;
  };
  A.ridge = (o) => A.shape(A.ridgePts(o), o.base, o.smooth);

  // distant conifer tree line: zigzag tips riding on a top line
  A.treeline = function (o) {
    const r = A.rng(o.seed || 1), top = fn(o.top), base = fn(o.base);
    let x = o.x0, d = `M ${f(o.x0)} ${f(base(o.x0))} L ${f(o.x0)} ${f(top(o.x0))}`;
    while (x < o.x1) {
      const w = (o.step || 20) * (0.7 + r() * 0.6), h = o.hMin + r() * (o.hMax - o.hMin);
      d += ` L ${f(x + w / 2)} ${f(top(x + w / 2) - h)} L ${f(x + w)} ${f(top(x + w))}`;
      x += w;
    }
    return d + ` L ${f(x)} ${f(base(x))} Z`;
  };

  // one detailed conifer; (x, y) is the centre of its base
  A.conifer = function (x, y, h, w, tiers, seed) {
    const r = A.rng(seed || 1), n = tiers || 6, R = [], L = [], tw = w * 0.07;
    for (let i = 1; i <= n; i++) {
      const t = i / n, yy = y - h + h * 0.9 * t, hw = (w / 2) * (0.22 + 0.78 * t) * (0.85 + r() * 0.3);
      R.push(`L ${f(x + hw)} ${f(yy)} L ${f(x + hw * 0.42)} ${f(yy - h * 0.03)}`);
      L.unshift(`L ${f(x - hw)} ${f(yy)} L ${f(x - hw * 0.42)} ${f(yy - h * 0.03)}`);
    }
    return `M ${f(x)} ${f(y - h)} ${R.join(' ')} L ${f(x + tw)} ${f(y - h * 0.1)} L ${f(x + tw)} ${f(y)} L ${f(x - tw)} ${f(y)} L ${f(x - tw)} ${f(y - h * 0.1)} ${L.join(' ')} Z`;
  };

  // a stand of conifers as one path
  A.conifers = function (o) {
    const r = A.rng(o.seed || 1), base = fn(o.base), list = [];
    for (let i = 0; i < o.count; i++) {
      const x = o.x0 + r() * (o.x1 - o.x0), h = o.hMin + r() * (o.hMax - o.hMin);
      list.push([x, h, r(), r()]);
    }
    list.sort((a, b) => a[1] - b[1]);
    return list.map(([x, h, k, k2]) => A.conifer(x, base(x) + (o.spread || 0) * k2, h, h * (o.wr || 0.34) * (0.85 + k * 0.3), o.tiers || 6, 1 + Math.floor(k * 1e4))).join(' ');
  };

  // little triangles that read as forest texture
  A.tex = function (o) {
    const r = A.rng(o.seed || 1), top = fn(o.top), base = fn(o.base), pts = [];
    for (let i = 0; i < o.n; i++) {
      const x = o.x0 + r() * (o.x1 - o.x0), yt = top(x), yb = base(x);
      if (yb - yt < 12) { r(); r(); continue; }
      pts.push([x, yt + 8 + r() * (yb - yt - 8), r()]);
    }
    pts.sort((a, b) => a[1] - b[1]);
    const sc = fn(o.scale == null ? 1 : o.scale);
    return pts.map(([x, y, k]) => {
      const s = sc(x, y), w = (16 + k * 10) * s, h = (46 + k * 26) * s, light = k > 0.55;
      return `<path d="M ${f(x)} ${f(y - h)} L ${f(x + w / 2)} ${f(y)} L ${f(x - w / 2)} ${f(y)} Z" fill="${light ? '#ffffff' : '#06140f'}" opacity="${light ? o.lo || 0.06 : o.do || 0.17}"/>`;
    }).join('');
  };

  A.dots = function (o) {
    const r = A.rng(o.seed || 1); let s = '';
    for (let i = 0; i < o.n; i++) {
      const x = o.x0 + r() * (o.x1 - o.x0), y = o.y0 + r() * (o.y1 - o.y0);
      const rad = o.rMin + r() * (o.rMax - o.rMin), op = o.opMin == null ? 1 : o.opMin + r() * ((o.opMax || 1) - o.opMin);
      if (o.test && !o.test(x, y)) continue;
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" opacity="${op.toFixed(2)}"/>`;
    }
    return `<g fill="${o.fill}">${s}</g>`;
  };

  A.ripples = function (o) {
    const r = A.rng(o.seed || 1), h = o.h || 4; let s = '';
    for (let i = 0; i < o.n; i++) {
      const w = o.wMin + r() * (o.wMax - o.wMin), x = o.x0 + r() * (o.x1 - o.x0 - w), y = o.y0 + Math.pow(r(), o.bias || 1) * (o.y1 - o.y0);
      s += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${h}" rx="${h / 2}"/>`;
    }
    return `<g fill="${o.fill}" opacity="${o.op == null ? 0.5 : o.op}">${s}</g>`;
  };

  A.cloud = function (x, y, s, fill, op) {
    const e = [[0, 0, 150, 26], [-70, -18, 70, 38], [10, -40, 90, 50], [90, -14, 70, 34]];
    return `<g fill="${fill}" opacity="${op == null ? 1 : op}">` + e.map(([a, b, rx, ry]) => `<ellipse cx="${f(x + a * s)}" cy="${f(y + b * s)}" rx="${f(rx * s)}" ry="${f(ry * s)}"/>`).join('') + '</g>';
  };

  // top edge of the curtain that rises between stops, drawn in a 2000 x 240 box
  A.edge = function (kind, seed) {
    seed = seed || 1;
    if (kind === 'rocks') return A.ridge({ x0: -40, x1: 2040, y: 150, amp: 70, wave: 230, rough: 0.7, step: 34, seed, base: 262 });
    if (kind === 'bush') return A.ridge({ x0: -40, x1: 2040, y: 150, amp: 60, wave: 150, rough: 0.5, step: 26, seed, base: 262, smooth: true });
    if (kind === 'fog') return A.ridge({ x0: -40, x1: 2040, y: 150, amp: 62, wave: 250, rough: 0.2, step: 40, seed, base: 262, smooth: true });
    if (kind === 'crowd') return A.ridge({ x0: -40, x1: 2040, y: 160, amp: 44, wave: 74, rough: 0.1, step: 18, seed, base: 262, smooth: true });
    const n = A.noise(seed);
    return A.treeline({ x0: -40, x1: 2040, top: (x) => 170 + (n(x / 260) - 0.5) * 70, base: 262, step: 36, hMin: 50, hMax: 130, seed });
  };
})();
