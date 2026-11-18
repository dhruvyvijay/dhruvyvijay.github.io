/* scenes-0.js: Half Dome.
   Two views share this stop:
   A) the dome in profile; the view rises while two climbers go up the cables
   B) the view from the top (drawn in scenes-0-summit.js), which turns into the real photo
   Between them a slab of granite rises to fill the screen and drops away again. */
(function () {
  const A = Art, f = A.f, P = A.poly;
  const fill = (id) => `<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${id})"/>`;
  const c01 = (v) => Math.min(1, Math.max(0, v));

  // a smooth run through points, continuing from the first one
  const run = (pts) => {
    let d = '';
    for (let i = 1; i < pts.length - 1; i++) d += ` Q ${f(pts[i][0])} ${f(pts[i][1])} ${f((pts[i][0] + pts[i + 1][0]) / 2)} ${f((pts[i][1] + pts[i + 1][1]) / 2)}`;
    const l = pts[pts.length - 1];
    return d + ` L ${f(l[0])} ${f(l[1])}`;
  };
  const line = (pts) => `M ${f(pts[0][0])} ${f(pts[0][1])}` + run(pts);

  Scenes.halfdome = (function () {
    const C = '#16332b', G = '#d9cdb6', PAN = 330;
    const FA = { size: [2000, 1250], focus: [1040, 600], focusNarrow: [1040, 620], minW: 900 };
    const FB = { size: [3700, 1840], origin: [-1100, 60], focus: [750, 980], focusNarrow: [650, 980] };
    const summit = HalfDomeSummit(FB);

    /* =====================================================================
       A: Half Dome in profile, morning light from the right
       ===================================================================== */
    const top = [[748, 238], [800, 230], [850, 225], [905, 222], [960, 224], [1010, 230], [1080, 250], [1150, 280], [1215, 322], [1272, 374], [1322, 436], [1364, 506], [1398, 580], [1424, 652], [1444, 720], [1470, 760]];
    const faceL = 'M 668 905 L 690 800 L 704 690 L 712 580 L 718 470 L 724 380 L 730 310 L 736 262 L 724 250 L 748 238';
    const dome = faceL + run(top) + ' L 1492 830 L 1506 920 L 1510 2700 L 668 2700 Z';
    const face = faceL + run(top.slice(0, 4)) + ' L 916 300 L 926 420 L 930 540 L 926 660 L 916 780 L 902 905 L 902 2700 L 668 2700 Z';
    // dark water streaks down the sheer face, leaning with it
    let streaks = '';
    [[744, 14, 310, 770, 1], [772, 10, 290, 820, 1], [790, 12, 330, 700, 0], [812, 16, 300, 860, 1], [846, 10, 280, 780, 1], [858, 12, 360, 720, 0], [886, 14, 300, 840, 1]].forEach(([x, w, y0, y1, dark]) => {
      const dx = -(y1 - y0) * 0.075;
      streaks += `<path d="M ${x} ${y0} L ${x + w} ${y0} L ${f(x + w * 0.7 + dx)} ${y1} L ${f(x + w * 0.3 + dx)} ${y1} Z" fill="${dark ? '#4f5c8a' : '#d3d7ec'}" opacity="${dark ? 0.32 : 0.3}"/>`;
    });
    // the cable route sits just inside the right-hand skyline
    const route = (off) => top.slice(5).reverse().map((p, i, arr) => {
      const a = arr[Math.max(0, i - 1)], b = arr[Math.min(arr.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const n = Math.hypot(nx, ny); nx /= n; ny /= n;
      if ((1060 - p[0]) * nx + (600 - p[1]) * ny < 0) { nx = -nx; ny = -ny; }
      return [p[0] + nx * off, p[1] + ny * off];
    });
    // the forest at the dome's foot, rising into the wooded shoulder the cables start from
    const baseTop = (x) => 918 + Math.sin(x / 170) * 9 + Math.abs(x - 1100) * 0.03 - 150 * Math.exp(-Math.pow((x - 1650) / 180, 2));
    const baseForest = A.treeline({ x0: -900, x1: 2900, top: baseTop, base: 2700, step: 16, hMin: 10, hMax: 24, seed: 236 });
    const hiker = (id, torso, pack, pants) => `<g id="${id}"><g transform="scale(.62)">
        <path d="M -6 0 L -2 -26 M 8 0 L 3 -26" stroke="${pants}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <rect x="-21" y="-57" width="15" height="29" rx="5" fill="${pack}"/>
        <rect x="-11" y="-59" width="23" height="35" rx="8" fill="${torso}"/>
        <circle cx="2" cy="-69" r="10" fill="#2b211d"/></g></g>`;

    const cloudsRest = (x) => 800 - Math.pow(c01((x - 650) / 1400), 1.15) * 255;
    const midTop = (x) => 892 + Math.sin(x / 260) * 14 + (x < 700 ? (700 - x) * 0.03 : 0);
    const nearTop = (x) => 992 - Math.pow(Math.abs(x - 1040) / 1100, 1.7) * 150;
    const nearForest = A.treeline({ x0: -900, x1: 2900, top: nearTop, base: 2700, step: 22, hMin: 18, hMax: 46, seed: 241 });

    return {
      size: FA.size, focus: FA.focus, focusNarrow: FA.focusNarrow, minW: FA.minW,
      curtain: { color: C, edge: 'trees' },
      defs: `
        <linearGradient id="hdA-sky" x1="0" y1="-500" x2="0" y2="950" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5a97cf"/><stop offset=".5" stop-color="#a6cde6"/><stop offset=".8" stop-color="#f5e6c3"/><stop offset="1" stop-color="#f8cd99"/></linearGradient>
        <radialGradient id="hdA-glow" cx="1720" cy="860" r="900" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff2c4" stop-opacity=".95"/><stop offset="1" stop-color="#fff2c4" stop-opacity="0"/></radialGradient>
        <linearGradient id="hdA-haze" x1="0" y1="560" x2="0" y2="980" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f8dcae" stop-opacity="0"/><stop offset="1" stop-color="#f8dcae" stop-opacity=".62"/></linearGradient>
        <linearGradient id="hdA-lit" x1="1460" y1="260" x2="900" y2="900" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff1d1"/><stop offset=".45" stop-color="#f7d6a8"/><stop offset="1" stop-color="#dfa987"/></linearGradient>
        <radialGradient id="hdA-form" cx="1140" cy="400" r="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#c98b74" stop-opacity="0"/><stop offset=".62" stop-color="#c98b74" stop-opacity="0"/><stop offset="1" stop-color="#c98b74" stop-opacity=".42"/></radialGradient>
        <linearGradient id="hdA-turn" x1="905" y1="0" x2="1100" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#cf9477" stop-opacity=".5"/><stop offset="1" stop-color="#cf9477" stop-opacity="0"/></linearGradient>
        <linearGradient id="hdA-face" x1="0" y1="222" x2="0" y2="905" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a6abcf"/><stop offset=".5" stop-color="#838eb6"/><stop offset="1" stop-color="#6d79a1"/></linearGradient>
        <linearGradient id="hdA-hill" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a9478"/><stop offset=".5" stop-color="#2f5c49"/><stop offset="1" stop-color="#143a30"/></linearGradient>
        <clipPath id="hdA-domeclip"><path d="${dome}"/></clipPath>
        <clipPath id="hdA-baseclip"><path d="${baseForest}"/></clipPath>
        <clipPath id="hdA-nearclip"><path d="${nearForest}"/></clipPath>
        ${summit.defs}`,
      layers: [
        /* ---------- A: the dome ---------- */
        {
          grp: 'A', pan: 0.12, depth: 0, svg: fill('hdA-sky') + `<rect x="-3000" y="-800" width="8000" height="2600" fill="url(#hdA-glow)"/>
            <g fill="#fff8e8" opacity=".75"><ellipse cx="380" cy="150" rx="190" ry="7"/><ellipse cx="520" cy="196" rx="120" ry="5"/><ellipse cx="1690" cy="96" rx="150" ry="6"/></g>`
        },
        {
          grp: 'A', pan: 0.3, depth: 0.1, svg: `<path d="${A.ridge({ x0: -900, x1: 2900, y: (x) => 690 - x * 0.025, amp: 44, wave: 260, rough: 0.6, step: 34, seed: 231, base: 2700 })}" fill="#d6daeb"/>
            <path d="${A.ridge({ x0: -900, x1: 2900, y: cloudsRest, amp: 10, wave: 210, step: 36, seed: 232, base: 2700, smooth: true })}" fill="#bcc5dc"/>
            <path d="${P([[1300, cloudsRest(1300) + 22], [1560, cloudsRest(1560) + 14], [1850, cloudsRest(1850) + 12], [2900, cloudsRest(2900) + 12], [2900, 900], [1900, 900], [1560, 830]])}" fill="#e6e9f3" opacity=".55"/>
            <path d="${A.ridge({ x0: -900, x1: 2900, y: (x) => 846 + Math.sin(x / 330) * 14, amp: 10, wave: 300, step: 40, seed: 233, base: 2700, smooth: true })}" fill="#9fb3c6"/>
            <rect x="-3000" y="560" width="8000" height="440" fill="url(#hdA-haze)"/>`
        },
        {
          grp: 'A', pan: 0.55, depth: 0.22, svg: `<path d="${A.treeline({ x0: -900, x1: 2900, top: midTop, base: 2700, step: 18, hMin: 10, hMax: 26, seed: 234 })}" fill="#739887"/>
            <path d="${A.treeline({ x0: -900, x1: 2900, top: (x) => midTop(x) + 40 + Math.sin(x / 190 + 1) * 10, base: 2700, step: 22, hMin: 14, hMax: 34, seed: 235 })}" fill="#557f6c"/>`
        },
        {
          grp: 'A', pan: 1, depth: 0.38, key: 'dome', svg: `<path d="${dome}" fill="url(#hdA-lit)"/>
            <g clip-path="url(#hdA-domeclip)">
              <rect x="600" y="150" width="1300" height="900" fill="url(#hdA-form)"/>
              <path d="M 905 222 L 1100 236 L 1100 905 L 902 905 L 916 780 L 926 660 L 930 540 L 926 420 L 916 300 Z" fill="url(#hdA-turn)"/>
              <g fill="none" stroke="#b9805f" stroke-width="3" opacity=".3">
                <path d="${line([[1010, 300], [1120, 330], [1210, 400], [1280, 490], [1330, 600], [1360, 720], [1372, 850]])}"/>
                <path d="${line([[1040, 400], [1120, 430], [1190, 500], [1240, 600], [1270, 720], [1280, 860]])}"/>
                <path d="${line([[1090, 540], [1140, 600], [1168, 700], [1176, 840]])}"/>
              </g>
              <path d="${face}" fill="url(#hdA-face)"/>${streaks}
              <path d="M 724 250 L 736 262 L 734 292 L 728 274 Z" fill="#55608a"/>
              <path d="${line(top.slice(3))}" fill="none" stroke="#fff8e6" stroke-width="8" opacity=".65"/>
            </g>
            <g fill="none" stroke="#5a463c" stroke-width="1.7" opacity=".8"><path id="hd-route" d="${line(route(10))}"/><path d="${line(route(16))}"/></g>
            <path d="${baseForest}" fill="#42705c"/>
            <g clip-path="url(#hdA-baseclip)">${A.tex({ n: 420, x0: -900, x1: 2900, top: (x) => baseTop(x) + 4, base: 1500, seed: 237, scale: 0.5 })}</g>
            ${hiker('hd-h2', '#7c5a3c', '#2b2b2b', '#cdbb9d')}${hiker('hd-h1', '#9c3f3a', '#69b94a', '#efe7d6')}`
        },
        {
          grp: 'A', pan: 1.5, depth: 0.7, svg: `<path d="${nearForest}" fill="url(#hdA-hill)"/>
            <g clip-path="url(#hdA-nearclip)">${A.tex({ n: 620, x0: -900, x1: 2900, top: (x) => nearTop(x) + 6, base: 1700, seed: 242, scale: 0.8 })}</g>
            <path d="${A.conifers({ x0: -800, x1: 2800, base: (x) => nearTop(x) + 110, spread: 50, count: 30, hMin: 110, hMax: 210, seed: 247, wr: 0.32, tiers: 6 })}" fill="#2a5644"/>
            <path d="${A.conifers({ x0: -800, x1: 2800, base: (x) => nearTop(x) + 190, spread: 70, count: 22, hMin: 190, hMax: 340, seed: 243, wr: 0.3, tiers: 7 })}" fill="#1d4435"/>`
        },
        {
          grp: 'A', pan: 2.4, depth: 1.15, curtain: true, svg: `<path d="${A.conifers({ x0: -320, x1: 260, base: 1340, count: 6, hMin: 560, hMax: 980, seed: 244, wr: 0.28, tiers: 8 })} ${A.conifers({ x0: 1760, x1: 2340, base: 1340, count: 6, hMin: 560, hMax: 980, seed: 245, wr: 0.28, tiers: 8 })}" fill="${C}"/>
            <path d="${A.ridge({ x0: -900, x1: 2900, y: (x) => 1235 - Math.pow(Math.abs(x - 1000) / 1000, 2) * 60, amp: 28, wave: 160, rough: 0.5, step: 26, seed: 246, base: 3000, smooth: true })}" fill="${C}"/>`
        },

        /* ---------- B: the view from the top ---------- */
        ...summit.layers,

        /* ---------- the photo: framed by a viewfinder, then it turns real and becomes a print ---------- */
        {
          grp: 'B', frame: FB, depth: 0, key: 'photo', cls: 'graded', svg: `
            <g class="pv-dim" opacity="0" fill="#0c1a1c"><rect x="-3000" y="-1000" width="3000" height="4000"/><rect x="1500" y="-1000" width="3000" height="4000"/></g>
            <image class="pv-img" opacity="0" href="assets/photos/halfdome.jpg" x="0" y="0" width="1500" height="2000" preserveAspectRatio="none"/>
            <g class="pv-print" opacity="0"><rect x="-42" y="-1000" width="16" height="4000" fill="#0b1512" opacity=".3"/><rect x="1526" y="-1000" width="16" height="4000" fill="#0b1512" opacity=".3"/>
              <rect x="-26" y="-1000" width="26" height="4000" fill="#fbf6ea"/><rect x="1500" y="-1000" width="26" height="4000" fill="#fbf6ea"/></g>
            <g class="pv-marks" opacity="0" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1">
              <g stroke="#0c1a1c" stroke-opacity=".35"><path pathLength="1"/><path pathLength="1"/><path pathLength="1"/><path pathLength="1"/></g>
              <g stroke="#fbf6ea"><path pathLength="1"/><path pathLength="1"/><path pathLength="1"/><path pathLength="1"/></g></g>`
        },

        /* ---------- the granite that rises between the two views ---------- */
        {
          grp: 'X', depth: 0, key: 'cover', html: `<div class="hd-cover" style="--g:${G}"><svg viewBox="0 0 2000 240" preserveAspectRatio="none">
            <path d="M0 242 L0 170 Q 1000 -30 2000 170 L2000 242 Z" fill="${G}"/>
            <path d="M0 170 Q 1000 -30 2000 170" fill="none" stroke="#fbf3e0" stroke-width="5" vector-effect="non-scaling-stroke" opacity=".8"/></svg></div>`
        }
      ],
      layout(S) {
        // the viewfinder marks sit just inside whatever part of the photo is on screen, clear of the page's buttons
        const ph = S.L.photo, vb = ph.vb, u = ph.unit;
        const x0 = Math.max(0, vb.x) + 20 / u, x1 = Math.min(1500, vb.x + vb.w) - 20 / u;
        const y0 = Math.max(0, vb.y) + 64 / u, y1 = Math.min(2000, vb.y + vb.h) - 66 / u;
        const a = Math.min(56, Math.max(34, S.stage.clientWidth * 0.045)) / u;
        const d = [
          `M ${f(x0)} ${f(y0 + a)} L ${f(x0)} ${f(y0)} L ${f(x0 + a)} ${f(y0)}`, `M ${f(x1)} ${f(y0 + a)} L ${f(x1)} ${f(y0)} L ${f(x1 - a)} ${f(y0)}`,
          `M ${f(x0)} ${f(y1 - a)} L ${f(x0)} ${f(y1)} L ${f(x0 + a)} ${f(y1)}`, `M ${f(x1)} ${f(y1 - a)} L ${f(x1)} ${f(y1)} L ${f(x1 - a)} ${f(y1)}`];
        ph.svg.querySelectorAll('.pv-marks > g').forEach((g, gi) => {
          g.setAttribute('stroke-width', f((gi ? 3.5 : 7.5) / u));
          g.querySelectorAll('path').forEach((p, i) => p.setAttribute('d', d[i]));
        });
      },
      update(c) {
        const S = c.S, pe = c.easeIO(c.beats.climb || 0), sp = c.beats.summit || 0, pp = c.beats.photo || 0;
        const onTop = sp >= 0.5;                                                     // past the cover: we are on the summit
        const cover = sp < 0.5 ? c.easeIO(sp * 2) : 1 - c.easeIO((sp - 0.5) * 2);    // the granite rises, then drops away
        const settle = onTop ? c.easeOut((sp - 0.5) * 2) : 0;
        // the photo arrives in three steps: viewfinder marks, the picture itself, then the print border
        const vf = c.clamp(pp / 0.24), b = c.easeIO(c.clamp((pp - 0.2) / 0.6)), pr = c.clamp((pp - 0.8) / 0.2);
        c.layers.forEach((l) => {
          const g = l.def.grp;
          if (g === 'A') { l.hidden = onTop; if (!onTop) l.y += PAN * l.unit * pe * l.def.pan; }
          else if (g === 'B') {
            l.hidden = !onTop; if (!onTop) return;
            l.y -= (1 - settle) * l.depth * c.vh * 0.16;
            l.x *= 1 - b; l.y *= 1 - b;                                              // same settle as Mt. Hood, so the drawing sits on the photo
          }
        });
        const cv = c.L.cover; cv.x = 0; cv.y = (1 - cover) * c.vh * 1.2; cv.hidden = cover < 0.002;

        const ph = c.L.photo; ph.x = 0; ph.y = 0; ph.hidden = !onTop || pp <= 0;
        if (!ph.hidden) {
          const k = Math.round(pp * 600);
          if (k !== S.pk) {
            S.pk = k;
            const q = S.pv || (S.pv = { dim: ph.svg.querySelector('.pv-dim'), img: ph.svg.querySelector('.pv-img'), print: ph.svg.querySelector('.pv-print'), marks: ph.svg.querySelector('.pv-marks') });
            q.marks.style.strokeDashoffset = (1 - c.easeOut(vf)).toFixed(3);
            q.marks.style.opacity = (Math.min(1, vf * 4) * (1 - pr)).toFixed(3);
            q.dim.style.opacity = (0.4 * c.easeIO(vf)).toFixed(3);
            q.img.style.opacity = b.toFixed(3);
            q.print.style.opacity = pr.toFixed(3);
          }
        }

        if (!onTop) {
          const k = Math.round(pe * 700);
          if (k !== S.hk) {
            const svg = c.L.dome.svg;
            if (!S.route) { S.route = svg.querySelector('#hd-route'); S.h1 = svg.querySelector('#hd-h1'); S.h2 = svg.querySelector('#hd-h2'); S.len = 0; }
            if (!S.len) { try { S.len = S.route.getTotalLength(); } catch (e) { S.len = 0; } }
            if (S.len) {
              S.hk = k;
              const p = 0.06 + 0.92 * pe, a = S.route.getPointAtLength(S.len * p), q = S.route.getPointAtLength(Math.max(0, S.len * p - 70));
              S.h1.setAttribute('transform', `translate(${f(a.x)} ${f(a.y)})`);
              S.h2.setAttribute('transform', `translate(${f(q.x)} ${f(q.y)})`);
            }
          }
        }
      }
    };
  })();
})();
