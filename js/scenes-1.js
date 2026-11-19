/* scenes-1.js: Start (dawn road), Lassen Peak, Crater Lake */
(function () {
  const A = Art, f = A.f, P = A.poly;
  const fill = (id) => `<rect x="-700" y="-700" width="3400" height="3200" fill="url(#${id})"/>`;

  /* =====================================================================
     START: a road heading north at dawn
     ===================================================================== */
  Scenes.hero = (function () {
    const vpY = 1012, K = 488;
    let dashes = '';
    for (let z = 1; z < 15; z += 0.62) {
      const z2 = z + 0.3, y1 = vpY + K / z, y2 = vpY + K / z2, w1 = 11 / z, w2 = 11 / z2;
      dashes += `M ${f(1000 - w1)} ${f(y1)} L ${f(1000 + w1)} ${f(y1)} L ${f(1000 + w2)} ${f(y2)} L ${f(1000 - w2)} ${f(y2)} Z `;
    }
    const R = (y, amp, wave, seed) => A.ridgePts({ x0: -500, x1: 2500, y, amp, wave, seed, step: 40 });
    const r1 = R(770, 44, 520, 21), r2 = R(812, 52, 430, 22), r3 = R(862, 58, 600, 23), r4 = R(915, 54, 520, 24), r5 = R(968, 40, 640, 25);
    const crest = A.ridgePts({ x0: -500, x1: 2500, y: (x) => 1012 - Math.pow(Math.abs(x - 1000) / 1000, 2) * 34, amp: 6, wave: 400, seed: 9, step: 50 });
    const S = (pts) => A.shape(pts, 2100, true);
    // the open top edge of a smoothed ridge (same curve A.shape draws), lifted by `lift` units: the credentials ride on it
    const skyline = (pts, lift) => {
      let d = `M ${f(pts[0][0])} ${f(pts[0][1] - lift)}`;
      for (let i = 1; i < pts.length - 1; i++) d += ` Q ${f(pts[i][0])} ${f(pts[i][1] - lift)} ${f((pts[i][0] + pts[i + 1][0]) / 2)} ${f((pts[i][1] + pts[i + 1][1]) / 2 - lift)}`;
      const l = pts[pts.length - 1];
      return d + ` L ${f(l[0])} ${f(l[1] - lift)}`;
    };
    const blobs = (pts, seed, n, color) => {
      const r = A.rng(seed), yf = A.at(pts); let s = '';
      for (let i = 0; i < n; i++) { const x = -400 + r() * 2800, rr = 12 + r() * 24; s += `<ellipse cx="${f(x)}" cy="${f(yf(x) + rr * 0.15)}" rx="${f(rr * 1.3)}" ry="${f(rr)}"/>`; }
      return `<g fill="${color}">${s}</g>`;
    };
    return {
      size: [2000, 1250], focus: [1000, 700], noReveal: true,
      defs: `
        <linearGradient id="hero-sky" x1="0" y1="-200" x2="0" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#14264a"/><stop offset=".34" stop-color="#42487a"/><stop offset=".56" stop-color="#b3748a"/>
          <stop offset=".72" stop-color="#ee9c7c"/><stop offset=".86" stop-color="#f9cb8f"/><stop offset="1" stop-color="#fdeab4"/>
        </linearGradient>
        <linearGradient id="hero-day" x1="0" y1="-200" x2="0" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#5fa3d3"/><stop offset=".7" stop-color="#b9dcea"/><stop offset="1" stop-color="#f5ecd0"/>
        </linearGradient>
        <radialGradient id="hero-glow" cx="1210" cy="800" r="440" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffe9ad" stop-opacity=".95"/><stop offset=".22" stop-color="#ffd198" stop-opacity=".55"/><stop offset="1" stop-color="#ffd198" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="hero-road" x1="0" y1="1000" x2="0" y2="1500" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#46555f"/><stop offset="1" stop-color="#2a363e"/>
        </linearGradient>`,
      layers: [
        { depth: 0, svg: fill('hero-sky') + A.dots({ n: 90, x0: -300, x1: 2300, y0: -250, y1: 430, rMin: 0.9, rMax: 2.4, seed: 5, fill: '#fff', opMin: 0.25, opMax: 0.9 }) },
        { depth: 0, key: 'day', svg: fill('hero-day') },
        { depth: 0.03, key: 'sun', svg: `<circle cx="1210" cy="800" r="440" fill="url(#hero-glow)"/><circle cx="1210" cy="800" r="62" fill="#fff4cf"/>` },
        { depth: 0.14, svg: `<path d="${S(r1)}" fill="#ab8ca9"/><path d="${S(r2)}" fill="#8b789f"/>` },
        {
          // the credentials, set along the far skyline; same depth as the ridge so they move with it
          depth: 0.14, key: 'creds', svg: `<path id="hero-skyline" fill="none"/>
            <text font-family="DM Mono, monospace" font-weight="500" letter-spacing="0.08em" fill="#3a2347"><textPath href="#hero-skyline">PRODUCT ANALYST<tspan dx="0.75em" fill="#c4512f">/</tspan><tspan dx="0.75em">NATIONAL SPEAKER</tspan><tspan dx="0.75em" fill="#c4512f">/</tspan><tspan dx="0.75em">AI POLICY WORK FEATURED IN THE WASHINGTON POST</tspan></textPath></text>`
        },
        { depth: 0.34, svg: `<path d="${S(r3)}" fill="#66698e"/>${blobs(r3, 61, 40, '#5b5f85')}<path d="${S(r4)}" fill="#465a7c"/>${blobs(r4, 62, 55, '#3c4f70')}` },
        { depth: 0.6, svg: `<path d="${S(r5)}" fill="#2c4a62"/>${blobs(r5, 63, 70, '#223d54')}` },
        {
          depth: 1, svg: `<path d="${S(crest)}" fill="#15303b"/>
            <path d="${P([[994, 1012], [1006, 1012], [1733, 1700], [267, 1700]])}" fill="url(#hero-road)"/>
            <path d="${P([[994.6, 1012], [995.8, 1012], [322, 1700], [282, 1700]])} ${P([[1004.2, 1012], [1005.4, 1012], [1718, 1700], [1678, 1700]])}" fill="#efe3c8" opacity=".6"/>
            <path d="${dashes}" fill="#f4c95a"/>
            <rect x="1316" y="1092" width="8" height="200" fill="#0c1f26"/>
            <rect x="1228" y="1004" width="184" height="92" rx="10" fill="#1f6b52" stroke="#f1e8d6" stroke-width="5"/>
            <text x="1320" y="1063" text-anchor="middle" font-family="DM Mono, monospace" font-weight="500" font-size="31" letter-spacing="3" fill="#f1e8d6">NORTH ↑</text>`
        }
      ],
      init(S) { S.copy = S.el.querySelector('.hero-copy'); S.cue = S.el.querySelector('.cue'); },
      layout(S) {
        // size the skyline text in real pixels and start it under the left edge of the intro.
        // Where the whole line can't fit between there and the route dots (phones, narrow windows),
        // the plain list in the page is shown instead.
        const L = S.L.creds, vw = S.stage.clientWidth;
        const u = L.unit, path = L.svg.querySelector('#hero-skyline'), tp = L.svg.querySelector('textPath'), text = L.svg.querySelector('text');
        let fits = vw > 640;
        if (fits) {
          text.setAttribute('font-size', f(Math.min(13, Math.max(12, vw * 0.0092)) / u));
          path.setAttribute('d', skyline(r1, 11 / u));
          try {
            const x = L.vb.x + S.copy.offsetLeft / u;
            let lo = 0, hi = path.getTotalLength();
            for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (path.getPointAtLength(m).x < x) lo = m; else hi = m; }
            tp.setAttribute('startOffset', f(lo));
            const bb = text.getBBox();                  // the rendered line, slashes and spacing included
            fits = bb.width > 0 && (bb.x + bb.width - L.vb.x) * u <= vw - 76;
          } catch (err) { fits = false; }
        }
        S.credsOff = !fits;
        S.el.classList.toggle('creds-curved', fits);
      },
      update(c) {
        const d = c.d, e = 1 - Math.pow(1 - d, 2);
        c.L.creds.hidden = !!c.S.credsOff;
        c.L.creds.o = Math.max(0, 1 - d * 1.7);   // fades with the name and intro
        c.L.sun.y -= e * 215 * c.unit;
        c.L.day.o = Math.min(1, d * 1.3) * 0.8;
        c.layers.forEach((l) => { if (l.depth > 0.05) l.y += d * l.depth * c.vh * 0.08; });
        const k = (d * 100 | 0);
        if (k !== c.S.k) {
          c.S.k = k;
          c.S.copy.style.transform = `translate3d(0,${(-d * c.vh * 0.2).toFixed(1)}px,0)`;
          c.S.copy.style.opacity = Math.max(0, 1 - d * 1.7).toFixed(3);
          c.S.cue.style.opacity = Math.max(0, 1 - d * 6).toFixed(3);
        }
      }
    };
  })();

  /* =====================================================================
     01 LASSEN PEAK: the climb
     ===================================================================== */
  Scenes.lassen = (function () {
    const C = '#2b3734';
    const slopeY = (x) => 1080 - ((x + 500) / 3000) * 240;
    const peak = [[-500, 830], [150, 790], [330, 740], [520, 680], [680, 580], [800, 470], [900, 380], [980, 330], [1050, 300], [1110, 296], [1170, 312], [1250, 360], [1340, 440], [1450, 520], [1580, 610], [1720, 690], [1900, 750], [2500, 810], [2500, 960], [-500, 960]];
    const shade = [[1110, 296], [1170, 312], [1250, 360], [1340, 440], [1450, 520], [1580, 610], [1720, 690], [1900, 750], [2500, 810], [2500, 960], [1250, 960], [1215, 780], [1182, 640], [1152, 520], [1128, 400]];
    const snow = [
      [[1050, 300], [1088, 298], [1064, 380], [1022, 470], [962, 560], [926, 604], [972, 500], [1010, 400]],
      [[900, 380], [934, 370], [892, 470], [832, 560], [796, 584], [848, 470]],
      [[760, 520], [792, 518], [742, 620], [692, 684], [668, 684], [718, 600]],
      [[590, 652], [620, 648], [580, 720], [540, 760], [522, 756], [556, 706]]
    ];
    const snowSh = [[[1190, 400], [1232, 430], [1262, 520], [1242, 604], [1214, 500]], [[1330, 480], [1372, 520], [1402, 600], [1372, 644], [1344, 560]], [[1500, 600], [1540, 630], [1556, 700], [1520, 690]]];
    const bands = [[[600, 650], [760, 560], [822, 600], [702, 700], [540, 742]], [[1000, 600], [1100, 520], [1132, 640], [1042, 742], [940, 762]], [[300, 770], [450, 720], [520, 742], [400, 800]]];
    const far = A.treeline({ x0: -500, x1: 2500, top: (x) => 812 + Math.sin(x / 300) * 14, base: 2000, step: 18, hMin: 10, hMax: 26, seed: 31 });
    const mid = A.treeline({ x0: -500, x1: 2500, top: (x) => 872 + Math.sin(x / 210 + 2) * 18, base: 2000, step: 24, hMin: 18, hMax: 46, seed: 32 });
    const scree = A.ridge({ x0: -500, x1: 2500, y: slopeY, amp: 12, wave: 300, seed: 33, step: 50, smooth: true, base: 2100 });
    const trail = 'M 300 1500 C 480 1340 560 1260 720 1210 S 940 1150 1040 1090 S 1250 1030 1340 990 S 1540 950 1660 925';
    const hiker = (id, torso, pack, pants) => `<g id="${id}"><g transform="scale(1.45)">
        <path d="M -6 0 L -2 -26 M 8 0 L 3 -26" stroke="${pants}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <rect x="-21" y="-57" width="15" height="29" rx="5" fill="${pack}"/>
        <rect x="-11" y="-59" width="23" height="35" rx="8" fill="${torso}"/>
        <circle cx="2" cy="-69" r="10" fill="#2b211d"/></g></g>`;
    const rocks = A.ridge({ x0: -500, x1: 2500, y: (x) => 1150 - Math.pow(Math.abs(x - 1000) / 1000, 2) * 70, amp: 44, wave: 240, rough: 0.7, step: 34, seed: 34, base: 2200 });
    const pinesL = A.conifers({ x0: -260, x1: 300, base: 1230, count: 6, hMin: 430, hMax: 800, seed: 41, wr: 0.3 });
    const pinesR = A.conifers({ x0: 1700, x1: 2260, base: 1230, count: 6, hMin: 430, hMax: 800, seed: 42, wr: 0.3 });
    return {
      size: [2000, 1250], focus: [1050, 640],
      curtain: { color: C, edge: 'rocks' },
      defs: `
        <linearGradient id="las-sky" x1="0" y1="-200" x2="0" y2="820" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4f97cf"/><stop offset=".55" stop-color="#a3d0e6"/><stop offset="1" stop-color="#eaf2e2"/></linearGradient>
        <linearGradient id="las-lit" x1="0" y1="296" x2="0" y2="960" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f0dfc6"/><stop offset=".6" stop-color="#d9c2a2"/><stop offset="1" stop-color="#bfae94"/></linearGradient>
        <linearGradient id="las-shade" x1="0" y1="296" x2="0" y2="960" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#b9a69c"/><stop offset="1" stop-color="#8f838b"/></linearGradient>
        <linearGradient id="las-haze" x1="0" y1="640" x2="0" y2="860" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#dfece6" stop-opacity="0"/><stop offset="1" stop-color="#dfece6" stop-opacity=".8"/></linearGradient>
        <linearGradient id="las-scree" x1="0" y1="860" x2="0" y2="1350" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#eadfca"/><stop offset="1" stop-color="#cdbfa3"/></linearGradient>`,
      layers: [
        { depth: 0, svg: fill('las-sky') + A.cloud(420, 250, 1.1, '#ffffff', 0.9) + A.cloud(1640, 190, 0.8, '#ffffff', 0.85) + A.cloud(1220, 120, 0.5, '#ffffff', 0.7) },
        {
          depth: 0.16, svg: `<path d="${P(peak)}" fill="url(#las-lit)"/><path d="${P(shade)}" fill="url(#las-shade)"/>
            <g fill="#b79f84" opacity=".6">${bands.map((b) => `<path d="${P(b)}"/>`).join('')}</g>
            <g fill="#fffaf0">${snow.map((b) => `<path d="${P(b)}"/>`).join('')}</g>
            <g fill="#e3e6ec" opacity=".85">${snowSh.map((b) => `<path d="${P(b)}"/>`).join('')}</g>
            <path d="${P([[1036, 306], [1050, 282], [1064, 300], [1080, 272], [1096, 292], [1112, 280], [1128, 304], [1110, 312], [1060, 314]])}" fill="#8b7b72"/>
            <rect x="-700" y="640" width="3400" height="330" fill="url(#las-haze)"/>`
        },
        {
          depth: 0.36, svg: `<path d="${far}" fill="#6a927d"/><path d="${mid}" fill="#3a6a56"/>
            ${A.tex({ n: 420, x0: -500, x1: 2500, top: (x) => 880 + Math.sin(x / 210 + 2) * 18, base: 1100, seed: 35, scale: 0.6 })}`
        },
        {
          depth: 0.7, key: 'scree', svg: `<path d="${scree}" fill="url(#las-scree)"/>
            ${A.dots({ n: 420, x0: -500, x1: 2500, y0: 850, y1: 1500, rMin: 2, rMax: 6.5, seed: 36, fill: '#8f816a', opMin: 0.2, opMax: 0.6, test: (x, y) => y > slopeY(x) + 22 })}
            ${A.dots({ n: 130, x0: -500, x1: 2500, y0: 850, y1: 1500, rMin: 5, rMax: 13, seed: 37, fill: '#8fa468', opMin: 0.5, opMax: 0.9, test: (x, y) => y > slopeY(x) + 26 })}
            <path d="${trail}" fill="none" stroke="#a39378" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 17"/>
            <path id="las-trail" d="${trail}" fill="none" stroke="#ee7b5b" stroke-width="6" stroke-linecap="round"/>
            ${hiker('las-h2', '#7c5a3c', '#2b2b2b', '#cdbb9d')}${hiker('las-h1', '#9c3f3a', '#69b94a', '#efe7d6')}`
        },
        {
          depth: 1.15, curtain: true, svg: `<path d="${rocks}" fill="${C}"/><path d="${pinesL} ${pinesR}" fill="${C}"/>
            ${A.dots({ n: 60, x0: -400, x1: 2400, y0: 1130, y1: 1260, rMin: 10, rMax: 30, seed: 38, fill: '#3a4844', opMin: 0.5, opMax: 0.9, test: (x, y) => y > 1190 - Math.pow(Math.abs(x - 1000) / 1000, 2) * 70 })}`
        }
      ],
      update(c) {
        const S = c.S, svg = c.L.scree.svg;
        if (!S.trail) { S.trail = svg.querySelector('#las-trail'); S.h1 = svg.querySelector('#las-h1'); S.h2 = svg.querySelector('#las-h2'); S.len = 0; }
        if (!S.len) { try { S.len = S.trail.getTotalLength(); } catch (e) { S.len = 0; } if (!S.len) return; S.trail.style.strokeDasharray = S.len; }
        const p = 0.52 + 0.45 * c.d * c.e, k = Math.round(p * 500);
        if (k === S.k) return; S.k = k;
        S.trail.style.strokeDashoffset = (S.len * (1 - p)).toFixed(1);
        const a = S.trail.getPointAtLength(S.len * p), b = S.trail.getPointAtLength(Math.max(0, S.len * p - 95));
        S.h1.setAttribute('transform', `translate(${f(a.x)} ${f(a.y)})`);
        S.h2.setAttribute('transform', `translate(${f(b.x)} ${f(b.y)})`);
      }
    };
  })();

  /* =====================================================================
     02 CRATER LAKE: the deep
     ===================================================================== */
  Scenes.crater = (function () {
    const C = '#1c2f38';
    const rimY = (x) => 398 - 62 * Math.exp(-Math.pow((x - 1480) / 170, 2)) - 26 * Math.exp(-Math.pow((x - 430) / 210, 2));
    const rim = A.ridgePts({ x0: -500, x1: 2500, y: rimY, amp: 15, wave: 210, rough: 0.6, step: 38, seed: 51 });
    const rimD = A.shape(rim, 482), rimIn = A.shape(rim.map(([x, y]) => [x, y + 13]), 482);
    const r = A.rng(52); let chutes = '';
    for (let i = 0; i < 22; i++) { const x = -400 + r() * 2800, y1 = A.at(rim)(x) + 20 + r() * 20, w = 14 + r() * 22; chutes += `M ${f(x)} ${f(y1)} L ${f(x + w)} 481 L ${f(x - w * 1.3)} 481 Z `; }
    const isle = [[500, 642], [590, 618], [670, 570], [725, 533], [760, 522], [800, 531], [840, 522], [880, 535], [930, 572], [1010, 620], [1100, 642]];
    const isleY = A.at(isle);
    const left = [[-500, 450], [-100, 520], [200, 640], [420, 800], [560, 960], [640, 1110]];
    const right = [[1500, 1110], [1560, 980], [1720, 820], [1900, 680], [2150, 560], [2500, 480]];
    const leftD = P([...left, [640, 2100], [-500, 2100]]), rightD = P([...right, [2500, 2100], [1500, 2100]]);
    const lY = A.at(left), rY = A.at(right);
    const treesL = A.conifers({ x0: -420, x1: 520, base: (x) => lY(x) + 30, spread: 300, count: 26, hMin: 70, hMax: 170, seed: 53, wr: 0.36 });
    const treesR = A.conifers({ x0: 1620, x1: 2420, base: (x) => rY(x) + 30, spread: 300, count: 26, hMin: 70, hMax: 170, seed: 54, wr: 0.36 });
    const rocks = A.ridge({ x0: -500, x1: 2500, y: (x) => 1120 - Math.pow(Math.abs(x - 1000) / 1000, 2) * 110, amp: 40, wave: 230, rough: 0.7, step: 34, seed: 55, base: 2200 });
    const pinesL = A.conifers({ x0: -300, x1: 330, base: 1200, count: 5, hMin: 380, hMax: 700, seed: 56, wr: 0.38, tiers: 5 });
    const pinesR = A.conifers({ x0: 1680, x1: 2300, base: 1200, count: 5, hMin: 380, hMax: 700, seed: 57, wr: 0.38, tiers: 5 });
    return {
      size: [2000, 1250], focus: [1000, 640],
      curtain: { color: C, edge: 'rocks' },
      defs: `
        <linearGradient id="cra-sky" x1="0" y1="-200" x2="0" y2="482" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1c69b8"/><stop offset=".6" stop-color="#63abe0"/><stop offset="1" stop-color="#cfe8f3"/></linearGradient>
        <linearGradient id="cra-wall" x1="0" y1="320" x2="0" y2="482" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#58728f"/><stop offset="1" stop-color="#93a5b6"/></linearGradient>
        <linearGradient id="cra-lake" x1="0" y1="482" x2="0" y2="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a8ad2"/><stop offset=".22" stop-color="#1a62b6"/><stop offset="1" stop-color="#0b3f8c"/></linearGradient>
        <linearGradient id="cra-slope" x1="0" y1="450" x2="0" y2="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#dccba6"/><stop offset="1" stop-color="#b6a27c"/></linearGradient>`,
      layers: [
        { depth: 0, svg: fill('cra-sky') + A.cloud(560, 230, 0.7, '#ffffff', 0.92) + A.cloud(1700, 150, 0.55, '#ffffff', 0.85) },
        { depth: 0.1, svg: `<path d="${rimD}" fill="#3f5d68"/><path d="${rimIn}" fill="url(#cra-wall)"/><path d="${chutes}" fill="#e4dcc6" opacity=".3"/>` },
        {
          depth: 0.22, svg: `<rect x="-700" y="482" width="3400" height="2000" fill="url(#cra-lake)"/>
            <path d="${rimIn}" fill="#a9c8ea" opacity=".2" transform="translate(0 964) scale(1 -1)"/>
            <rect x="-700" y="480" width="3400" height="5" fill="#d9e6ee" opacity=".8"/>
            <path d="${P(isle)}" fill="#082a66" opacity=".32" transform="translate(0 1288) scale(1 -1)"/>
            ${A.ripples({ n: 26, x0: -400, x1: 2400, y0: 520, y1: 1080, wMin: 120, wMax: 420, seed: 58, fill: '#8fc0ee', op: 0.28, h: 4, bias: 1.6 })}
            <ellipse cx="800" cy="643" rx="312" ry="9" fill="#cfc8ad"/>
            <path d="${P(isle)}" fill="#2b4a50"/>
            <path d="${A.treeline({ x0: 520, x1: 1080, top: (x) => isleY(x) + 5, base: 642, step: 13, hMin: 8, hMax: 20, seed: 59 })}" fill="#2b4a50"/>
            ${A.tex({ n: 150, x0: 520, x1: 1080, top: (x) => isleY(x) + 4, base: 640, seed: 60, scale: 0.42 })}
            <path d="${P([[745, 526], [790, 538], [838, 525], [800, 531], [760, 523]])}" fill="#1c3438"/>`
        },
        {
          depth: 0.6, svg: `<path d="${leftD}" fill="url(#cra-slope)"/><path d="${rightD}" fill="url(#cra-slope)"/>
            <path d="${P([[-500, 450], [-100, 520], [200, 640], [150, 700], [-140, 590], [-500, 540]])} ${P([[2500, 480], [2150, 560], [1900, 680], [1960, 740], [2200, 630], [2500, 580]])}" fill="#eadbb8" opacity=".7"/>
            <path d="${P([[420, 800], [560, 960], [640, 1110], [640, 1400], [470, 1100], [330, 880]])} ${P([[1720, 820], [1560, 980], [1500, 1110], [1500, 1400], [1660, 1090], [1800, 890]])}" fill="#9d8862" opacity=".55"/>
            <path d="${treesL} ${treesR}" fill="#21414a"/>`
        },
        {
          depth: 1.1, curtain: true, svg: `<path d="${rocks}" fill="${C}"/><path d="${pinesL} ${pinesR}" fill="${C}"/>
            ${A.dots({ n: 50, x0: -400, x1: 2400, y0: 1100, y1: 1260, rMin: 10, rMax: 28, seed: 61, fill: '#2a424c', opMin: 0.5, opMax: 0.9, test: (x, y) => y > 1160 - Math.pow(Math.abs(x - 1000) / 1000, 2) * 110 })}`
        },
        {
          depth: 0, key: 'dive', html: `<div class="dive"><div class="dive-rays"></div><div class="dive-dark"></div>
            <div class="dive-gauge"><span class="dive-num">0</span><span class="dive-unit">feet below the surface</span></div>
            <p class="dive-note">Crater Lake is 1,943 feet deep, the deepest lake in the United States.</p></div>`
        }
      ],
      init(S) { S.num = S.el.querySelector('.dive-num'); S.dark = S.el.querySelector('.dive-dark'); },
      update(c) {
        const S = c.S, b = c.easeIO(c.beats.dive || 0), lift = b * c.vh * 0.85;
        c.layers.forEach((l) => { if (l.key !== 'dive') l.y -= lift * (1 + l.depth * 0.13); });
        c.L.dive.x = 0; c.L.dive.y = (1 - b) * (c.vh + 10);
        const end = c.beatEnd.dive || 0, deep = c.clamp((c.s - end) / Math.max(1, c.total - 0.9 * c.vh - end));
        const ft = Math.round(1943 * (0.05 * b + 0.95 * deep));
        if (ft !== S.ft) { S.ft = ft; S.num.textContent = ft.toLocaleString('en-US'); }
        const dk = (deep * 0.72).toFixed(2);
        if (dk !== S.dk) { S.dk = dk; S.dark.style.opacity = dk; }
      }
    };
  })();
})();
