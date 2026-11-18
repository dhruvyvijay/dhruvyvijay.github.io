/* scenes-3.js: Portland at night, the redwoods in fog */
(function () {
  const A = Art, f = A.f, P = A.poly;
  const fill = (id) => `<rect x="-700" y="-700" width="3400" height="3200" fill="url(#${id})"/>`;

  /* =====================================================================
     05 PORTLAND: fireworks over the river
     ===================================================================== */
  Scenes.portland = (function () {
    const C = '#070c22', r = A.rng(91);
    // skyline blocks with lit windows
    let blocks = '', win = '', x = 120;
    while (x < 1900) {
      const w = 46 + r() * 90, h = 70 + Math.pow(r(), 1.6) * 250, col = ['#141d48', '#19245a', '#101840', '#1d2a66'][(r() * 4) | 0];
      blocks += `<rect x="${f(x)}" y="${f(705 - h)}" width="${f(w)}" height="${f(h + 12)}" fill="${col}"/>`;
      for (let wy = 705 - h + 12; wy < 690; wy += 17) for (let wx = x + 7; wx < x + w - 9; wx += 13) {
        const k = r(); if (k < 0.36) win += `<rect x="${f(wx)}" y="${f(wy)}" width="6" height="8" fill="${k < 0.03 ? '#8fe6d6' : '#ffd88a'}" opacity="${(0.45 + r() * 0.5).toFixed(2)}"/>`;
      }
      x += w + (r() < 0.3 ? 8 + r() * 30 : 0);
    }
    let stripes = ''; for (let y = 286; y < 700; y += 14) stripes += `<rect x="1240" y="${y}" width="120" height="3"/>`;
    const landmarks = `
      <rect x="1020" y="380" width="92" height="336" fill="#131b46"/><path d="${P([[1020, 382], [1066, 296], [1112, 382]])}" fill="#131b46"/><rect x="1063" y="262" width="6" height="40" fill="#131b46"/>
      <rect x="1262" y="238" width="76" height="44" fill="#1c2764"/><rect x="1240" y="270" width="120" height="446" fill="#1c2764"/>
      <rect x="1240" y="270" width="120" height="300" fill="url(#pdx-pink)"/><g fill="#0a1030" opacity=".28">${stripes}</g>
      <rect x="1240" y="266" width="120" height="7" fill="#e3b0ff"/><rect x="1262" y="234" width="76" height="6" fill="#e3b0ff"/>
      <rect x="1432" y="424" width="82" height="292" fill="#223074"/><rect x="1432" y="424" width="82" height="42" fill="#7fe0d0" opacity=".75"/>
      <rect x="520" y="640" width="164" height="76" fill="#121a44"/><path d="M 562 640 a 40 40 0 0 1 80 0 Z" fill="#121a44"/>
      <path d="M 520 640 L 562 640 a 40 40 0 0 1 80 0 L 684 640" fill="none" stroke="#49e39a" stroke-width="4"/>`;
    // lamps along the waterfront and their reflections
    let lamps = '', refl = '';
    for (let lx = -560; lx < 2560; lx += 44 + r() * 26) {
      lamps += `<circle cx="${f(lx)}" cy="712" r="15" fill="#ffb45a" opacity=".28"/><circle cx="${f(lx)}" cy="712" r="5" fill="#ffd9a0"/>`;
      refl += `<rect x="${f(lx - 4)}" y="726" width="8" height="${f(70 + r() * 150)}" rx="4"/>`;
    }
    const hills = A.ridgePts({ x0: -600, x1: 2600, y: 612, amp: 30, wave: 520, seed: 92, step: 40 });
    const hillY = A.at(hills);
    const burst = (cx, cy, R, col, delay) => {
      let s = ''; const n = 22;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r() * 0.12, r1 = R * (0.26 + r() * 0.1), r2 = R * (0.8 + r() * 0.2), cs = Math.cos(a), sn = Math.sin(a);
        s += `<path d="M ${f(cx + cs * r1)} ${f(cy + sn * r1)} L ${f(cx + cs * r2)} ${f(cy + sn * r2)}"/><circle cx="${f(cx + cs * (r2 + 12))}" cy="${f(cy + sn * (r2 + 12))}" r="${f(3 + r() * 3)}" fill="${col}" stroke="none"/>`;
      }
      return `<g class="burst" style="--d:${delay}s" stroke="${col}" stroke-width="4.5" stroke-linecap="round" fill="none">${s}</g>`;
    };
    // the crowd at the railing
    let crowd = '';
    for (let i = 0; i < 32; i++) {
      const cx = -480 + i * 94 + r() * 40, hr = 26 + r() * 9, cy = 1050 + r() * 52;
      crowd += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(hr)}"/><rect x="${f(cx - hr * 1.8)}" y="${f(cy + hr * 0.7)}" width="${f(hr * 3.6)}" height="1400" rx="${f(hr)}"/>`;
    }
    const tower = (tx) => `<rect x="${tx}" y="468" width="30" height="240"/><rect x="${tx - 8}" y="456" width="46" height="16"/>
      <path d="M ${tx} 500 L ${tx + 30} 560 M ${tx + 30} 500 L ${tx} 560 M ${tx} 560 L ${tx + 30} 620 M ${tx + 30} 560 L ${tx} 620 M ${tx} 620 L ${tx + 30} 680 M ${tx + 30} 620 L ${tx} 680" stroke="#0a1030" stroke-width="5" fill="none"/>`;
    let truss = 'M 1380 690 ';
    for (let tx = 1380, up = true; tx < 2700; tx += 44, up = !up) truss += `L ${tx + 44} ${up ? 646 : 690} `;
    return {
      size: [2000, 1250], focus: [1000, 640],
      curtain: { color: C, edge: 'crowd' },
      defs: `
        <linearGradient id="pdx-sky" x1="0" y1="-200" x2="0" y2="720" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#060c26"/><stop offset=".5" stop-color="#15286a"/><stop offset=".82" stop-color="#3f4595"/><stop offset="1" stop-color="#8a5f9e"/></linearGradient>
        <linearGradient id="pdx-river" x1="0" y1="720" x2="0" y2="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1b2763"/><stop offset="1" stop-color="#080f2c"/></linearGradient>
        <linearGradient id="pdx-pink" x1="0" y1="270" x2="0" y2="570" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f7b0ea"/><stop offset=".5" stop-color="#b48ef2" stop-opacity=".8"/><stop offset="1" stop-color="#b48ef2" stop-opacity="0"/></linearGradient>
        <linearGradient id="pdx-refl" x1="0" y1="724" x2="0" y2="950" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb45a" stop-opacity=".7"/><stop offset="1" stop-color="#ffb45a" stop-opacity="0"/></linearGradient>
        <linearGradient id="pdx-prefl" x1="0" y1="724" x2="0" y2="1040" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d79cf0" stop-opacity=".5"/><stop offset="1" stop-color="#d79cf0" stop-opacity="0"/></linearGradient>`,
      layers: [
        { depth: 0, svg: fill('pdx-sky') + A.dots({ n: 150, x0: -500, x1: 2500, y0: -300, y1: 520, rMin: 0.9, rMax: 2.6, seed: 93, fill: '#ffffff', opMin: 0.25, opMax: 0.95 }) },
        {
          depth: 0.08, svg: `<path d="${A.shape(hills, 2000, true)}" fill="#0e1638"/>
            ${A.dots({ n: 150, x0: -500, x1: 2500, y0: 590, y1: 705, rMin: 1.4, rMax: 3, seed: 94, fill: '#ffcf8a', opMin: 0.3, opMax: 0.9, test: (px, py) => py > hillY(px) + 10 })}
            <rect x="818" y="${f(hillY(820) - 70)}" width="4" height="80" fill="#0e1638"/><circle cx="820" cy="${f(hillY(820) - 72)}" r="5" fill="#ff5a4a"/>
            <rect x="1578" y="${f(hillY(1580) - 56)}" width="4" height="66" fill="#0e1638"/><circle cx="1580" cy="${f(hillY(1580) - 58)}" r="5" fill="#ff5a4a"/>`
        },
        {
          depth: 0.12, key: 'fx', cls: 'fx', svg: burst(520, 330, 150, '#ff8a6b', 0) + burst(900, 210, 195, '#ffd76a', 1.3) + burst(1560, 300, 160, '#7fe0d0', 0.6) +
            burst(1170, 130, 120, '#f7a6e6', 2.2) + burst(260, 190, 115, '#ffd76a', 2.9) + burst(1800, 150, 105, '#ff8a6b', 1.9)
        },
        {
          depth: 0.24, svg: blocks + win + landmarks + `<rect x="-700" y="704" width="3400" height="22" fill="#0b1334"/>${lamps}
            <rect x="-700" y="722" width="3400" height="2200" fill="url(#pdx-river)"/>
            <g fill="url(#pdx-refl)">${refl}</g><rect x="1240" y="724" width="120" height="320" fill="url(#pdx-prefl)"/><rect x="1432" y="724" width="82" height="150" fill="#7fe0d0" opacity=".1"/>
            ${A.ripples({ n: 70, x0: -500, x1: 2500, y0: 736, y1: 1100, wMin: 80, wMax: 340, seed: 96, fill: '#080f2c', op: 0.55, h: 5, bias: 1.3 })}
            ${A.ripples({ n: 26, x0: -500, x1: 2500, y0: 760, y1: 1100, wMin: 60, wMax: 200, seed: 97, fill: '#7f8fe0', op: 0.22, h: 3 })}`
        },
        {
          depth: 0.5, svg: `<g fill="#0a1030">${tower(1640)}${tower(2030)}<rect x="1640" y="474" width="420" height="12"/>
            <rect x="1380" y="686" width="1320" height="16"/><rect x="1636" y="700" width="40" height="60"/><rect x="2026" y="700" width="40" height="60"/></g>
            <path d="${truss}" fill="none" stroke="#0a1030" stroke-width="6"/><path d="M 1380 646 L 1640 646 M 2060 646 L 2700 646" stroke="#0a1030" stroke-width="7" fill="none"/>
            <circle cx="1655" cy="450" r="6" fill="#ff5a4a"/><circle cx="2045" cy="450" r="6" fill="#ff5a4a"/>
            ${A.dots({ n: 24, x0: 1390, x1: 2600, y0: 680, y1: 684, rMin: 2.4, rMax: 3.4, seed: 98, fill: '#ffe2ad', opMin: 0.7, opMax: 1 })}`
        },
        {
          depth: 1.1, curtain: true, svg: `<g fill="${C}">${crowd}<rect x="-700" y="1128" width="3400" height="16"/><rect x="-700" y="1170" width="3400" height="1600"/></g>
            <rect x="712" y="968" width="20" height="34" rx="4" fill="#cfe3ff"/><path d="M 700 1060 L 722 990" stroke="${C}" stroke-width="20" stroke-linecap="round"/>
            <rect x="1286" y="980" width="20" height="34" rx="4" fill="#ffe2c2"/><path d="M 1310 1070 L 1296 1004" stroke="${C}" stroke-width="20" stroke-linecap="round"/>`
        }
      ],
      update(c) {
        const on = c.r > 0.6 && c.x < 0.95;
        if (on !== c.S.on) { c.S.on = on; c.L.fx.svg.classList.toggle('go', on); }
      }
    };
  })();

  /* =====================================================================
     06 REDWOODS: fog, and what's next
     ===================================================================== */
  Scenes.redwoods = (function () {
    const C = '#e4e9df';
    const trunks = (seed, n, wMin, wMax, col, lean) => {
      const r = A.rng(seed); let s = '';
      for (let i = 0; i < n; i++) {
        const x = -500 + ((i + r() * 0.8) / n) * 3000, w = wMin + r() * (wMax - wMin), l = (r() - 0.5) * lean;
        s += `<path d="M ${f(x - w / 2)} 1800 L ${f(x - w * 0.36 + l)} -600 L ${f(x + w * 0.36 + l)} -600 L ${f(x + w / 2)} 1800 Z"/>`;
      }
      return `<g fill="${col}">${s}</g>`;
    };
    const boughs = (seed, n, col, yMax, size, op) => {
      const r = A.rng(seed); let s = '';
      for (let i = 0; i < n; i++) {
        // a drooping bough: a short fan of thin needle sprays
        const x = -500 + r() * 3000, y = -300 + Math.pow(r(), 1.5) * (yMax + 300), len = size * (0.6 + r() * 0.8), dir = r() < 0.5 ? -1 : 1;
        for (let j = 0; j < 4; j++) {
          const cx = x + dir * len * (0.25 + j * 0.24), cy = y + j * j * len * 0.035, rx = len * (0.3 - j * 0.035), rot = dir * (8 + j * 7);
          s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(rx * 0.22)}" transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})"/>`;
        }
      }
      return `<g fill="${col}" opacity="${op}">${s}</g>`;
    };
    const fog = (seed, y, n, op) => {
      const r = A.rng(seed); let s = '';
      for (let i = 0; i < n; i++) { const x = -600 + r() * 3200, rx = 220 + r() * 320; s += `<ellipse cx="${f(x)}" cy="${f(y + (r() - 0.5) * 70)}" rx="${f(rx)}" ry="${f(34 + r() * 40)}"/>`; }
      return `<g fill="#f0f3ea" opacity="${op}">${s}</g>`;
    };
    const ferns = (seed, n, x0, x1, yf, col, size) => {
      const r = A.rng(seed); let d = '';
      for (let i = 0; i < n; i++) {
        const x = x0 + r() * (x1 - x0), y = yf(x) + 14;
        for (let j = 0; j < 7; j++) { const a = -1.25 + (j / 6) * 2.5 + (r() - 0.5) * 0.2, h = size * (0.6 + r() * 0.6), tx = x + Math.sin(a) * h, ty = y - Math.cos(a) * h * 0.8; d += `M ${f(x - 5)} ${f(y)} Q ${f((x + tx) / 2 - 6)} ${f((y + ty) / 2 - h * 0.25)} ${f(tx)} ${f(ty)} Q ${f((x + tx) / 2 + 8)} ${f((y + ty) / 2 - h * 0.1)} ${f(x + 5)} ${f(y)} Z `; }
      }
      return `<path d="${d}" fill="${col}"/>`;
    };
    const groundY = (x) => 1030 - Math.pow(Math.abs(x - 950) / 1000, 1.5) * 95;
    const groundPts = A.ridgePts({ x0: -600, x1: 2600, y: groundY, amp: 18, wave: 200, seed: 101, step: 40 });
    const gY = A.at(groundPts);
    const bark = (x0, x1, seed) => {
      const r = A.rng(seed); let s = '';
      for (let i = 0; i < 16; i++) { const x = x0 + r() * (x1 - x0), w = 8 + r() * 14, light = r() > 0.6; s += `<path d="M ${f(x)} 1800 Q ${f(x + (r() - 0.5) * 40)} 600 ${f(x + (r() - 0.5) * 30)} -600" stroke="${light ? '#6d4536' : '#35201a'}" stroke-width="${f(w)}" opacity="${light ? 0.5 : 0.6}" fill="none"/>`; }
      return s;
    };
    const bank = A.ridge({ x0: -600, x1: 2600, y: 1180, amp: 34, wave: 280, rough: 0.2, step: 40, seed: 102, base: 2600, smooth: true });
    return {
      size: [2000, 1250], focus: [1000, 640],
      curtain: { color: C, edge: 'fog', text: 'dark' },
      defs: `
        <linearGradient id="red-fog" x1="0" y1="-200" x2="0" y2="1300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#c9d4c6"/><stop offset=".35" stop-color="#e9ede3"/><stop offset=".7" stop-color="#d6ddd0"/><stop offset="1" stop-color="#b3c0b0"/></linearGradient>
        <linearGradient id="red-ground" x1="0" y1="930" x2="0" y2="1300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#86a08a"/><stop offset=".4" stop-color="#456650"/><stop offset="1" stop-color="#27432f"/></linearGradient>
        <linearGradient id="red-road" x1="0" y1="910" x2="0" y2="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#c2cbbf"/><stop offset=".35" stop-color="#8b938c"/><stop offset="1" stop-color="#555d5a"/></linearGradient>
        <linearGradient id="red-line" x1="0" y1="910" x2="0" y2="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d9d3a8" stop-opacity=".3"/><stop offset=".5" stop-color="#e3b93c"/><stop offset="1" stop-color="#e9b62a"/></linearGradient>`,
      layers: [
        { depth: 0, svg: fill('red-fog') },
        { depth: 0.12, svg: trunks(103, 20, 20, 38, '#c9d3c6', 30) + boughs(104, 60, '#c3cec0', 620, 110, 0.85) },
        {
          depth: 0.28, svg: trunks(105, 11, 44, 78, '#a9b8a8', 40) + boughs(106, 46, '#a3b3a3', 560, 150, 0.85) +
            `<g fill="#fffdf2" opacity=".2"><path d="${P([[1480, -400], [1700, -400], [900, 1400], [600, 1400]])}"/><path d="${P([[1860, -400], [1990, -400], [1320, 1400], [1140, 1400]])}"/><path d="${P([[1100, -400], [1220, -400], [420, 1400], [250, 1400]])}"/></g>`
        },
        { depth: 0.36, key: 'fog1', svg: fog(107, 760, 14, 0.6) },
        { depth: 0.52, svg: trunks(108, 6, 96, 150, '#6f8475', 50) + boughs(109, 30, '#637a6b', 470, 210, 0.9) },
        {
          depth: 0.78, svg: `<g transform="translate(0 -120)"><path d="${A.shape(groundPts, 2400, true)}" fill="url(#red-ground)"/>
            <path d="M 1340 1800 C 1270 1480 1130 1200 1000 1072 S 800 942 716 916 L 698 916 C 762 938 850 1002 870 1092 S 790 1480 640 1800 Z" fill="url(#red-road)"/>
            <path d="M 990 1800 C 978 1480 962 1230 922 1090" fill="none" stroke="url(#red-line)" stroke-width="10"/>
            <path d="M 922 1090 C 890 1010 790 944 708 916" fill="none" stroke="url(#red-line)" stroke-width="4"/>
            <path d="M 1300 1800 C 1236 1480 1104 1200 984 1080 M 690 1800 C 820 1480 880 1180 856 1094" fill="none" stroke="#f1eee0" stroke-width="5" opacity=".45"/>
            ${ferns(110, 46, -600, 2600, gY, '#3f6247', 70)}${ferns(111, 30, -600, 2600, (x) => gY(x) + 90, '#27432f', 110)}
            ${fog(112, 960, 10, 0.5)}</g>`
        },
        {
          depth: 1, svg: `<path d="${P([[-460, 2000], [-380, -700], [180, -700], [300, 2000]])}" fill="#4b2f26"/>${bark(-380, 240, 113)}
            <path d="${P([[1690, 2000], [1800, -700], [2360, -700], [2460, 2000]])}" fill="#4b2f26"/>${bark(1750, 2380, 114)}
            ${ferns(115, 16, -300, 440, () => 1250, '#1f3a29', 130)}${ferns(116, 16, 1540, 2300, () => 1250, '#1f3a29', 130)}`
        },
        { depth: 1.18, curtain: true, svg: `<g fill="${C}" opacity=".55"><ellipse cx="300" cy="1140" rx="420" ry="46"/><ellipse cx="1150" cy="1130" rx="520" ry="52"/><ellipse cx="1900" cy="1150" rx="400" ry="44"/></g><path d="${bank}" fill="${C}"/>` }
      ],
      update(c) {
        const t = c.time, m = c.reduce ? 0 : 1;
        c.L.fog1.x += Math.sin(t * 0.13) * c.B * 0.5 * m;
        c.layers.forEach((l) => { if (!l.def.curtain && l.depth > 0) l.y += c.d * l.depth * c.vh * 0.045; });
      }
    };
  })();
})();
