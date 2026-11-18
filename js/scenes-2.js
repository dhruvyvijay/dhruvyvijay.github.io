/* scenes-2.js: Bend rapids, Mt. Hood */
(function () {
  const A = Art, f = A.f, P = A.poly;
  const fill = (id) => `<rect x="-700" y="-700" width="3400" height="3200" fill="url(#${id})"/>`;

  /* =====================================================================
     03 BEND: whitewater
     ===================================================================== */
  Scenes.rapids = (function () {
    const C = '#1b4431';
    // a band of water with a foam crest along its top edge
    const wave = (y, amp, seed, body, foamH) => {
      const r = A.rng(seed), ph = [r() * 6, r() * 6, r() * 6];
      const top = (x) => y + Math.sin(x / 140 + ph[0]) * amp * 0.6 + Math.sin(x / 61 + ph[1]) * amp * 0.3 + Math.sin(x / 27 + ph[2]) * amp * 0.12;
      let d1 = `M -600 2200 L -600 ${f(top(-600))}`, d2 = `M -600 ${f(top(-600))}`;
      for (let x = -600; x <= 2600; x += 20) { d1 += ` L ${x} ${f(top(x))}`; d2 += ` L ${x} ${f(top(x))}`; }
      d1 += ' L 2600 2200 Z';
      for (let x = 2600; x >= -600; x -= 20) {
        const th = foamH * (0.4 + 0.6 * (Math.sin(x / 90 + ph[1] * 2) * 0.5 + 0.5)) * (0.7 + 0.3 * Math.sin(x / 33 + ph[2]));
        d2 += ` L ${x} ${f(top(x) + th)}`;
      }
      let spray = ''; const r2 = A.rng(seed + 9);
      for (let i = 0; i < 70; i++) { const x = -500 + r2() * 3000; spray += `<circle cx="${f(x)}" cy="${f(top(x) - 6 - r2() * amp * 1.3)}" r="${f(2 + r2() * 5)}" opacity="${(0.4 + r2() * 0.6).toFixed(2)}"/>`; }
      return `<path d="${d1}" fill="${body}"/><path d="${d2} Z" fill="#f6fcfa"/><g fill="#ffffff">${spray}</g>`;
    };
    const bushes = (seed, yf, n, x0, x1) => {
      const r = A.rng(seed), cols = ['#6ea552', '#4f8a45', '#86b866', '#3f7a40']; let s = '';
      for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), rr = 16 + r() * 30; s += `<ellipse cx="${f(x)}" cy="${f(yf(x) + (r() - 0.5) * 16)}" rx="${f(rr * 1.25)}" ry="${f(rr)}" fill="${cols[(r() * 4) | 0]}"/>`; }
      return s;
    };
    const far = A.treeline({ x0: -600, x1: 2600, top: (x) => 236 + Math.sin(x / 260) * 22, base: 2000, step: 24, hMin: 26, hMax: 60, seed: 71 });
    const near = A.treeline({ x0: -600, x1: 2600, top: (x) => 322 + Math.sin(x / 180 + 1) * 20, base: 2000, step: 30, hMin: 40, hMax: 96, seed: 72 });
    const bankPts = A.ridgePts({ x0: -600, x1: 2600, y: 452, amp: 36, wave: 200, rough: 0.7, step: 32, seed: 73 });
    const bank2 = A.ridge({ x0: -600, x1: 2600, y: 512, amp: 30, wave: 150, rough: 0.8, step: 30, seed: 74, base: 2000 });
    const bankY = A.at(bankPts);
    const paddler = (x, y, vest, skin, hair, dir) => `<g transform="translate(${x} ${y})">
        <path d="M ${8 * dir} -34 L ${56 * dir} 30" stroke="#2f6fb5" stroke-width="7" stroke-linecap="round" fill="none"/>
        <ellipse cx="${60 * dir}" cy="37" rx="9" ry="17" fill="#2f6fb5" transform="rotate(${-32 * dir} ${60 * dir} 37)"/>
        <rect x="-17" y="-46" width="34" height="50" rx="10" fill="${vest}"/>
        <rect x="-17" y="-28" width="34" height="8" fill="#1e1e1e" opacity=".5"/>
        <circle cx="0" cy="-60" r="15" fill="${skin}"/><path d="M -15 -61 a 15 15 0 0 1 30 0 Z" fill="${hair}"/></g>`;
    const raft = `<g transform="translate(1000 800) scale(1.3)">
        <path d="M -206 -6 Q -226 -50 -168 -54 L 170 -54 Q 234 -48 214 2 Z" fill="#c98d14"/>
        ${paddler(-176, -44, '#b23b3b', '#e0b08a', '#2d4a5a', -1)}
        ${paddler(-112, -50, '#ee5f2a', '#c98d6b', '#3a2a22', 1)}${paddler(-52, -50, '#ee5f2a', '#e0b08a', '#8a5a2c', 1)}
        ${paddler(10, -50, '#ee5f2a', '#8a5a3c', '#1f1a18', 1)}${paddler(72, -50, '#ee5f2a', '#e0b08a', '#2b211d', 1)}${paddler(134, -50, '#ee5f2a', '#c98d6b', '#2b211d', 1)}
        <path d="M -212 -4 Q -226 -40 -176 -34 L 176 -34 Q 240 -30 216 6 Q 192 46 150 48 L -150 48 Q -198 44 -212 -4 Z" fill="#f4c42c"/>
        <path d="M -202 14 Q -182 48 -150 48 L 150 48 Q 196 44 214 8 Q 150 32 0 32 Q -150 32 -202 14 Z" fill="#d59a1c"/>
        <path d="M -190 -8 L 200 -8" stroke="#c98d14" stroke-width="4" fill="none"/>
        <path d="M 150 -26 L 176 -2 L 150 22 L 162 -2 Z M 116 -26 L 142 -2 L 116 22 L 128 -2 Z" fill="#262626"/>
        <g fill="#ffffff"><circle cx="232" cy="20" r="14"/><circle cx="252" cy="0" r="9"/><circle cx="214" cy="44" r="16"/><circle cx="262" cy="30" r="6"/><circle cx="-226" cy="30" r="12"/><circle cx="-244" cy="14" r="7"/><circle cx="244" cy="-22" r="5"/></g>
      </g>`;
    const brush = A.ridge({ x0: -600, x1: 2600, y: (x) => 1150 - Math.pow(Math.abs(x - 1000) / 1000, 2.2) * 200, amp: 42, wave: 170, rough: 0.5, step: 26, seed: 75, base: 2200, smooth: true });
    const r = A.rng(76); let blades = '';
    for (let i = 0; i < 110; i++) { const x = -500 + r() * 3000, y = 1150 - Math.pow(Math.abs(x - 1000) / 1000, 2.2) * 200 + 20, h = 50 + r() * 110, lean = (r() - 0.5) * 60; blades += `M ${f(x - 7)} ${f(y)} Q ${f(x + lean * 0.4)} ${f(y - h * 0.6)} ${f(x + lean)} ${f(y - h)} Q ${f(x + lean * 0.5 + 6)} ${f(y - h * 0.5)} ${f(x + 7)} ${f(y)} Z `; }
    return {
      size: [2000, 1250], focus: [1000, 640],
      curtain: { color: C, edge: 'bush' },
      defs: `
        <linearGradient id="rap-sky" x1="0" y1="-200" x2="0" y2="360" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6fb6e0"/><stop offset="1" stop-color="#e2f1e6"/></linearGradient>
        <linearGradient id="rap-water" x1="0" y1="560" x2="0" y2="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#43a6ad"/><stop offset="1" stop-color="#1f7c8e"/></linearGradient>`,
      layers: [
        { depth: 0, svg: fill('rap-sky') + A.cloud(1500, 110, 0.6, '#ffffff', 0.85) },
        { depth: 0.16, svg: `<path d="${far}" fill="#6c9a78"/><path d="${near}" fill="#2f6247"/>${A.tex({ n: 380, x0: -600, x1: 2600, top: (x) => 330 + Math.sin(x / 180 + 1) * 20, base: 520, seed: 77, scale: 0.75 })}` },
        {
          depth: 0.3, svg: `<path d="${A.shape(bankPts, 2000)}" fill="#2f2d2b"/><path d="${bank2}" fill="#45423f"/>
            ${A.dots({ n: 80, x0: -600, x1: 2600, y0: 520, y1: 590, rMin: 8, rMax: 26, seed: 78, fill: '#5a5651', opMin: 0.4, opMax: 0.9 })}
            ${bushes(79, (x) => bankY(x) - 4, 90, -600, 2600)}
            <rect x="-700" y="578" width="3400" height="2000" fill="url(#rap-water)"/>
            ${bushes(80, () => 584, 46, -600, 2600)}
            ${A.ripples({ n: 40, x0: -600, x1: 2600, y0: 600, y1: 700, wMin: 60, wMax: 220, seed: 81, fill: '#f6fcfa', op: 0.75, h: 6 })}`
        },
        { depth: 0.5, key: 'w1', svg: wave(660, 24, 82, '#3a9ca6', 30) },
        { depth: 0.66, key: 'w2', svg: wave(770, 34, 83, '#2d8c9a', 52) },
        { depth: 0.8, key: 'raft', svg: raft },
        { depth: 0.94, key: 'w3', svg: wave(880, 44, 84, '#237d8f', 74) },
        { depth: 1.06, key: 'w4', svg: wave(1010, 50, 85, '#1a6f83', 90) },
        { depth: 1.2, curtain: true, svg: `<path d="${blades}" fill="${C}"/><path d="${brush}" fill="${C}"/>` }
      ],
      layout(S) {
        const b = S.B / S.unit;
        S.L.raft.node.style.transformOrigin = `${((1000 - (S.vb.x - b)) * S.unit).toFixed(0)}px ${((800 - (S.vb.y - b)) * S.unit).toFixed(0)}px`;
      },
      update(c) {
        const t = c.time, m = c.reduce ? 0 : 1, sp = [0.3, 0.5, 0.7, 0.9];
        [c.L.w1, c.L.w2, c.L.w3, c.L.w4].forEach((l, i) => {
          l.x += -(c.d - 0.5) * c.B * sp[i] + Math.sin(t * 0.7 + i * 1.7) * 5 * m;
          l.y += Math.sin(t * 1.25 + i * 1.3) * (3 + i * 2) * m;
        });
        const R = c.L.raft;
        R.x += (-0.27 + 0.54 * c.d) * c.vw;
        R.y += Math.sin(t * 1.9) * 7 * m + Math.sin(c.d * Math.PI * 3) * c.vh * 0.018;
        R.rot = Math.sin(t * 1.5 + 0.6) * 2.6 * m - 2;
      }
    };
  })();

  /* =====================================================================
     04 MT. HOOD over Trillium Lake: drawn from the photo, so the two line up
     ===================================================================== */
  Scenes.hood = (function () {
    const C = '#173a31', H = 1500;
    const ridge = (x) => 20 + (x / 960) * 452, shore = (x) => 532 + (Math.max(0, x - 1000) / 1000) * 82;
    const hillD = A.treeline({ x0: -500, x1: 1085, top: (x) => Math.min(ridge(x), 536), base: 542, step: 20, hMin: 16, hMax: 44, seed: 3 });
    const farBack = A.treeline({ x0: 940, x1: 2500, top: (x) => 474 - (Math.max(0, x - 900) / 1200) * 62, base: (x) => shore(x) + 4, step: 20, hMin: 14, hMax: 30, seed: 11 });
    const farFront = A.treeline({ x0: 960, x1: 2500, top: (x) => 496 - Math.pow(Math.max(0, x - 930) / 1170, 1.4) * 95, base: (x) => shore(x) + 4, step: 22, hMin: 18, hMax: 46, seed: 5 });
    // the far trees' reflection tapers in from the left so it has no hard edge
    const farRefl = A.treeline({
      x0: 960, x1: 2500, base: (x) => shore(x) + 4, step: 22, hMin: 6, hMax: 30, seed: 5,
      top: (x) => { const t = Math.min(1, (x - 960) / 300), b = shore(x) + 4, o = 496 - Math.pow(Math.max(0, x - 930) / 1170, 1.4) * 95; return b - (b - o) * t; }
    });
    const mtn = `
      <path fill="url(#hood-lit)" d="M1452 284 L1420 290 L1385 301 L1345 319 L1300 347 L1250 373 L1190 403 L1120 425 L1040 441 L960 454 L760 494 L760 566 L2500 566 L2500 498 L1900 449 L1800 429 L1730 409 L1660 387 L1600 363 L1545 337 L1505 311 L1478 292 Z"/>
      <path fill="url(#hood-shade)" opacity=".92" d="M1452 284 L1478 292 L1505 311 L1545 337 L1600 363 L1660 387 L1730 409 L1800 429 L1900 449 L2500 498 L2500 566 L1614 566 L1576 500 L1540 440 L1508 380 L1480 330 Z"/>
      <g fill="#c7857c" opacity=".55">
        <path d="M1392 350 L1372 420 L1338 474 L1378 446 L1398 386 Z"/><path d="M1440 398 L1432 452 L1408 506 L1452 464 L1456 400 Z"/>
        <path d="M1300 372 L1262 420 L1206 452 L1282 430 L1322 392 Z"/><path d="M1150 440 L1090 470 L1010 486 L1100 478 L1170 452 Z"/>
      </g>
      <path fill="#fff5e8" d="M1452 284 L1420 290 L1388 300 L1362 322 L1382 330 L1356 356 L1392 350 L1398 386 L1424 352 L1440 398 L1456 356 L1474 372 L1480 330 L1466 304 Z"/>
      <g fill="#fff5e8" opacity=".85">
        <path d="M1345 319 L1300 347 L1250 373 L1200 398 L1244 394 L1292 376 L1334 350 Z"/><path d="M1180 406 L1120 425 L1050 439 L1112 437 L1172 424 Z"/>
      </g>
      <g fill="#dcaab0" opacity=".5"><path d="M1520 356 L1572 372 L1604 404 L1560 398 Z"/><path d="M1640 402 L1722 422 L1762 454 L1682 444 Z"/></g>`;
    const pinesL = A.conifers({ x0: -340, x1: 250, base: 1600, count: 6, hMin: 720, hMax: 1260, seed: 81, wr: 0.28, tiers: 8 });
    const pinesR = A.conifers({ x0: 1750, x1: 2340, base: 1600, count: 6, hMin: 720, hMax: 1260, seed: 82, wr: 0.28, tiers: 8 });
    const brush = A.ridge({ x0: -500, x1: 2500, y: (x) => 1470 - Math.pow(Math.abs(x - 1000) / 1000, 2) * 60, amp: 26, wave: 150, rough: 0.5, step: 26, seed: 83, base: 2800, smooth: true });
    return {
      size: [2000, H], focus: [1150, 640], focusNarrow: [1430, 750], extraBottom: 260,
      curtain: { color: C, edge: 'trees' },
      defs: `
        <linearGradient id="hood-sky" x1="0" y1="-200" x2="0" y2="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8fb3c8"/><stop offset=".42" stop-color="#c3d6d4"/><stop offset=".78" stop-color="#f7e0ad"/><stop offset="1" stop-color="#f8c08c"/></linearGradient>
        <radialGradient id="hood-glow" cx="900" cy="520" r="720" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff1bd" stop-opacity=".95"/><stop offset="1" stop-color="#fff1bd" stop-opacity="0"/></radialGradient>
        <linearGradient id="hood-lit" x1="0" y1="284" x2="0" y2="566" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbdcc6"/><stop offset=".45" stop-color="#f0b49d"/><stop offset="1" stop-color="#c78f90"/></linearGradient>
        <linearGradient id="hood-shade" x1="0" y1="284" x2="0" y2="566" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#c999a6"/><stop offset="1" stop-color="#8f6d88"/></linearGradient>
        <linearGradient id="hood-haze" x1="0" y1="400" x2="0" y2="566" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4d7ab" stop-opacity="0"/><stop offset="1" stop-color="#f4d7ab" stop-opacity=".72"/></linearGradient>
        <linearGradient id="hood-hill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#628f77"/><stop offset=".5" stop-color="#2d5a4a"/><stop offset="1" stop-color="#143a30"/></linearGradient>
        <linearGradient id="hood-lake" x1="0" y1="500" x2="0" y2="1500" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f6dcae"/><stop offset=".2" stop-color="#e6d9c0"/><stop offset=".5" stop-color="#bccdc9"/><stop offset="1" stop-color="#8fb0ba"/></linearGradient>
        <radialGradient id="hood-lglow" cx="900" cy="600" r="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff1bd" stop-opacity=".6"/><stop offset="1" stop-color="#fff1bd" stop-opacity="0"/></radialGradient>
        <linearGradient id="hood-shore" x1="0" y1="1130" x2="0" y2="1500" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6d675c"/><stop offset="1" stop-color="#38393a"/></linearGradient>
        <clipPath id="hood-hillclip"><path d="${hillD}"/></clipPath>`,
      layers: [
        {
          depth: 0, svg: fill('hood-sky') + `<rect x="-700" y="-300" width="3400" height="1000" fill="url(#hood-glow)"/>
            <g fill="#fff7e6" opacity=".7"><ellipse cx="430" cy="62" rx="170" ry="6"/><ellipse cx="560" cy="108" rx="110" ry="5"/><ellipse cx="1840" cy="255" rx="130" ry="5"/><ellipse cx="1720" cy="282" rx="80" ry="4"/></g>`
        },
        { depth: 0.18, svg: `${mtn}<rect x="-700" y="400" width="3400" height="170" fill="url(#hood-haze)"/>` },
        {
          depth: 0.42, svg: `<rect x="-700" y="500" width="3400" height="2400" fill="url(#hood-lake)"/><rect x="-700" y="500" width="3400" height="700" fill="url(#hood-lglow)"/>
            <g transform="translate(0 1130) scale(1 -1)" opacity=".5">${mtn}</g>
            <path d="${farRefl}" fill="#2a5443" opacity=".6" transform="translate(0 1150) scale(1 -1)"/>
            <path d="${hillD}" fill="#1b4135" opacity=".9" transform="translate(0 1005) scale(1 -0.9)"/>
            ${A.ripples({ n: 9, x0: -200, x1: 900, y0: 590, y1: 880, wMin: 160, wMax: 320, seed: 84, fill: '#efe7cc', op: 0.45, h: 4 })}
            ${A.ripples({ n: 7, x0: 1100, x1: 2100, y0: 620, y1: 820, wMin: 200, wMax: 420, seed: 85, fill: '#fff3df', op: 0.5, h: 4 })}
            ${A.ripples({ n: 12, x0: 100, x1: 2100, y0: 880, y1: 1120, wMin: 220, wMax: 420, seed: 86, fill: '#7f9fa6', op: 0.5, h: 5 })}
            <path d="M-700 521 L1000 521 L2700 660 L2700 676 L1000 536 L-700 536 Z" fill="#a3b98a"/>
            <path d="${farBack}" fill="#7d9d85"/><path d="${farFront}" fill="#2a5443"/>`
        },
        { depth: 0.6, svg: `<path d="${hillD}" fill="url(#hood-hill)"/><g clip-path="url(#hood-hillclip)">${A.tex({ n: 720, x0: -500, x1: 1000, top: ridge, base: 542, seed: 7, scale: (x) => 0.55 + (1 - Math.max(0, x) / 1000) * 0.55 })}</g>` },
        {
          depth: 0.9, svg: `<path fill="url(#hood-shore)" d="M-700 1218 L300 1182 L700 1152 L1000 1142 L1250 1166 L1400 1232 L1500 1332 L1560 1422 L1620 2000 L-700 2000 Z"/>
            <path d="M-700 1218 L300 1182 L700 1152 L1000 1142 L1250 1166 L1400 1232 L1500 1332 L1560 1422" fill="none" stroke="#b9b09c" stroke-width="5" opacity=".55"/>
            <g stroke="#a39c8c" stroke-width="3" opacity=".25" fill="none"><path d="M-700 1296 L1380 1230"/><path d="M-700 1344 L1450 1292"/><path d="M-700 1396 L1510 1358"/><path d="M-700 1450 L1550 1422"/></g>
            <path fill="#c2bdb0" d="M1400 1292 L1420 1226 L1482 1210 L1532 1250 L1526 1302 Z"/>
            <path fill="#e0dacb" d="M1562 2000 L1580 1322 L1642 1232 L1790 1196 L1962 1216 L2700 1320 L2700 2000 Z"/>
            <path fill="#aaa79b" d="M1580 1322 L1642 1232 L1702 1300 L1684 1424 L1566 1560 Z"/>`
        },
        { depth: 0, key: 'photo', cls: 'graded', svg: `<image href="assets/photos/hood.jpg" x="0" y="0" width="2000" height="1500" preserveAspectRatio="none"/>` },
        { depth: 1.25, curtain: true, svg: `<path d="${pinesL} ${pinesR}" fill="${C}"/><path d="${brush}" fill="${C}"/>` }
      ],
      update(c) {
        const b = c.easeIO(c.beats.photo || 0);
        const pan = Math.max(0, Math.min(250, H - c.vb.h) - c.vb.y) * c.unit * b;
        c.layers.forEach((l) => {
          if (l.def.curtain) { l.y += b * c.vh * 1.1; return; }
          l.x *= 1 - b; l.y = l.y * (1 - b) - pan;
        });
        c.L.photo.o = b;
      }
    };
  })();
})();
