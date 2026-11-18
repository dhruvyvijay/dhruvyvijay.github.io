/* scenes-0-summit.js: the view from the top of Half Dome.
   Drawn in the dome scene's colours: warm sunlit granite, violet-blue shadow, deep green, blue haze.
   x 0-1500, y 0-2000 is the space of the photo, so the middle of the drawing lines up with it;
   the left and right continue the view (a sheer cliff on the left, a round dome on the right rim).
   No people: they only appear when the drawing turns into the photo. */
(function () {
  const A = Art, f = A.f, P = A.poly;
  const fill = (id) => `<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${id})"/>`;
  // tree tips along a line, as points, so a forest edge can close along any bottom line
  const zig = (x0, x1, top, step, hMin, hMax, seed) => {
    const r = A.rng(seed), pts = [[x0, top(x0)]];
    for (let x = x0; x < x1;) {
      const w = step * (0.7 + r() * 0.6), h = hMin + r() * (hMax - hMin);
      pts.push([x + w / 2, top(x + w / 2) - h], [x + w, top(x + w)]);
      x += w;
    }
    return pts;
  };
  const line = (pts) => {
    let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) d += ` Q ${f(pts[i][0])} ${f(pts[i][1])} ${f((pts[i][0] + pts[i + 1][0]) / 2)} ${f((pts[i][1] + pts[i + 1][1]) / 2)}`;
    const l = pts[pts.length - 1];
    return d + ` L ${f(l[0])} ${f(l[1])}`;
  };
  // a thin streak down a rock face
  const streak = (x, w, y0, y1, dx) => `<path d="M ${x} ${y0} L ${x + w} ${y0} L ${f(x + w * 0.75 + (dx || 0))} ${y1} L ${f(x + w * 0.25 + (dx || 0))} ${y1} Z"/>`;

  window.HalfDomeSummit = function (FB) {
    const L = (depth, svg, more) => Object.assign({ grp: 'B', frame: FB, depth, svg }, more || {});

    /* ---------- the far horizon and the valley running away ---------- */
    const hz1 = A.ridge({ x0: -1500, x1: 3000, y: 318, amp: 7, wave: 260, step: 30, seed: 201, base: 1200, smooth: true });
    const hz2 = A.ridge({ x0: -1500, x1: 3000, y: 350, amp: 9, wave: 220, step: 30, seed: 202, base: 1200, smooth: true });
    const hz3 = A.ridge({ x0: -1500, x1: 3000, y: A.at([[-1500, 384], [-500, 386], [300, 372], [620, 350], [800, 368], [950, 392], [1100, 380], [1300, 366], [2000, 368], [3000, 374]]), amp: 7, wave: 160, step: 26, seed: 203, base: 1200, smooth: true });
    const far = A.ridge({ x0: 360, x1: 1140, y: A.at([[360, 446], [520, 418], [640, 408], [760, 412], [880, 434], [980, 450], [1140, 478]]), amp: 5, wave: 120, step: 20, seed: 205, base: 1150, smooth: true });
    const spurR = 'M1140 452 L1040 470 L960 502 L890 550 L830 614 L792 690 L772 770 L1140 830 Z';
    const spurL = 'M360 468 L520 486 L620 522 L700 582 L752 652 L786 732 L800 812 L360 890 Z';
    const farFloor = 'M690 742 L772 772 L850 826 L930 872 L1010 908 L1040 1150 L610 1150 L640 900 Z';

    /* ---------- the left side: a wooded mountain with granite faces ---------- */
    const leftFar = A.ridge({ x0: -1500, x1: 280, y: A.at([[-1500, 240], [-1050, 224], [-700, 252], [-300, 292], [100, 322], [280, 338]]), amp: 9, wave: 240, step: 30, seed: 261, base: 1200, smooth: true });
    const leftTop = A.at([[-1500, 304], [-1100, 292], [-880, 300], [-400, 318], [-20, 310], [60, 314], [150, 322], [250, 330], [350, 340], [430, 352], [480, 372], [520, 410], [555, 470], [585, 540], [600, 620], [605, 700], [600, 780], [610, 860], [640, 950], [700, 1080]]);
    const leftMtn = P(zig(-1500, 700, leftTop, 11, 4, 12, 206).concat([[700, 1100], [-1500, 1100]]));
    const skirt = (x0, x1, y0, y1, drop, seed) => P(zig(x0, x1, (x) => y0 + ((x - x0) / (x1 - x0)) * (y1 - y0), 10, 5, 14, seed).concat([[x1, y1 + drop], [x0, y0 + drop]]));
    const slopeTop = A.at([[-1500, 500], [-900, 532], [-500, 556], [0, 565], [100, 590], [180, 640], [240, 700], [290, 760], [330, 800], [380, 858], [440, 876], [520, 886], [580, 902], [630, 950], [680, 1030], [730, 1130]]);
    const slope = P(zig(-1500, 730, slopeTop, 12, 5, 16, 210).concat([[730, 2700], [-1500, 2700]]));

    /* ---------- the right side: the sunlit wall, with a round dome on its rim ---------- */
    const rimPts = [[1040, 472], [1080, 452], [1120, 432], [1180, 420], [1250, 412], [1350, 406], [1450, 400], [1900, 396], [2300, 384], [3000, 372]];
    const rim = A.at(rimPts);
    const wall = P(rimPts.concat([[3000, 1350], [1900, 1340], [1500, 1322], [1300, 1316], [1100, 1302], [1050, 1272], [980, 1232], [930, 1172], [900, 1112], [880, 1052], [870, 1002], [875, 952], [885, 902], [900, 852], [925, 792], [950, 732], [975, 682], [1000, 642], [1025, 602], [1035, 562], [1030, 502]]));
    const wallEdge = 'M1040 472 L1075 505 L1068 600 L1040 680 L1000 760 L960 860 L930 960 L918 1060 L935 1150 L900 1112 L880 1052 L870 1002 L875 952 L885 902 L900 852 L925 792 L950 732 L975 682 L1000 642 L1025 602 L1035 562 L1030 502 Z';
    const rimForest = P(zig(1030, 3000, (x) => rim(x) + 2, 9, 3, 10, 208).concat(
      A.ridgePts({ x0: 1030, x1: 3000, y: A.at([[1030, 505], [1100, 525], [1160, 508], [1230, 522], [1300, 560], [1380, 602], [1450, 640], [1900, 700], [3000, 738]]), amp: 8, wave: 70, rough: 0.4, step: 14, seed: 207 }).reverse()));
    const domePts = [[1790, 410], [1850, 330], [1930, 268], [2024, 228], [2120, 214], [2216, 228], [2306, 268], [2380, 330], [2436, 410]];
    const domeD = line(domePts) + ' L 2436 440 L 1790 440 Z';
    const floorPts = [[640, 1090], [868, 1066], [880, 1052], [900, 1112], [930, 1172], [980, 1232], [1050, 1272], [1100, 1302], [1300, 1317], [1900, 1338], [3000, 1350]];
    const floorTop = A.at(floorPts);
    const floor = P(floorPts.concat([[3000, 2700], [640, 2700]]));

    /* ---------- the Diving Board: stacked slabs, bright on top, deep shadow under the overhang ---------- */
    const boardTop = [[-1500, 880], [-1190, 900], [-1130, 876], [-960, 890], [-905, 926], [-700, 940], [-640, 914], [-470, 930], [-430, 966], [-200, 986], [0, 996], [130, 982], [290, 990], [400, 1012], [470, 1032], [940, 1040]];
    const board = P(boardTop.concat([[948, 1100], [958, 1145], [1055, 1195], [1080, 1300], [1095, 1440], [1075, 1500], [1040, 1575], [960, 1638], [870, 1710], [800, 1805], [750, 1910], [725, 2700], [-1500, 2700]]));
    const lipOff = [46, 64, 50, 70, 54, 66, 48, 60, 52, 46, 42, 50, 56, 48, 40, 0];
    const lip = boardTop.map(([x, y], i) => [x, y + lipOff[i]]);
    const boardLit = P(boardTop.slice(0, 15).concat(lip.slice(0, 15).reverse()));
    const boardLip = P(lip.slice(0, 15).concat(lip.slice(0, 15).reverse().map(([x, y]) => [x, y + 13])));
    // long ledges across the face: a line of light with a line of shadow under it
    const ledge = (y0, y1) => `<path d="M-1500 ${y0} L1100 ${y1} L1100 ${y1 + 5} L-1500 ${y0 + 5} Z" fill="#fff8e6" opacity=".6"/><path d="M-1500 ${y0 + 5} L1100 ${y1 + 5} L1100 ${y1 + 17} L-1500 ${y0 + 17} Z" fill="#6f76a3" opacity=".24"/>`;

    return {
      defs: `
        <linearGradient id="hdS-sky" x1="0" y1="-500" x2="0" y2="340" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4f8fd0"/><stop offset=".55" stop-color="#9cc4e8"/><stop offset="1" stop-color="#e2ecf3"/></linearGradient>
        <linearGradient id="hdS-haze" x1="0" y1="290" x2="0" y2="620" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e6eff6" stop-opacity=".6"/><stop offset="1" stop-color="#e6eff6" stop-opacity="0"/></linearGradient>
        <linearGradient id="hdS-vhaze" x1="0" y1="420" x2="0" y2="1100" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#dfe9f4" stop-opacity=".3"/><stop offset="1" stop-color="#dfe9f4" stop-opacity="0"/></linearGradient>
        <linearGradient id="hdS-left" x1="0" y1="280" x2="0" y2="1050" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5a8581"/><stop offset="1" stop-color="#2a514d"/></linearGradient>
        <linearGradient id="hdS-lit" x1="0" y1="260" x2="0" y2="880" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fdf2da"/><stop offset="1" stop-color="#dcc6a2"/></linearGradient>
        <linearGradient id="hdS-shade" x1="0" y1="260" x2="0" y2="1200" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a6abcf"/><stop offset="1" stop-color="#6d79a1"/></linearGradient>
        <linearGradient id="hdS-wall" x1="0" y1="380" x2="0" y2="1340" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff5df"/><stop offset=".5" stop-color="#f3e0bd"/><stop offset="1" stop-color="#e2c69d"/></linearGradient>
        <linearGradient id="hdS-dome" x1="1790" y1="0" x2="2436" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff1d1"/><stop offset=".5" stop-color="#f4d3a4"/><stop offset=".78" stop-color="#b9a9bd"/><stop offset="1" stop-color="#8e93bb"/></linearGradient>
        <linearGradient id="hdS-floor" x1="0" y1="1050" x2="0" y2="1900" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#40745c"/><stop offset="1" stop-color="#143a30"/></linearGradient>
        <linearGradient id="hdS-hill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#628f77"/><stop offset=".5" stop-color="#2d5a4a"/><stop offset="1" stop-color="#143a30"/></linearGradient>
        <linearGradient id="hdS-board" x1="0" y1="980" x2="0" y2="1900" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f6ead1"/><stop offset=".45" stop-color="#e3caa2"/><stop offset="1" stop-color="#c9a985"/></linearGradient>
        <clipPath id="hdS-leftclip"><path d="${leftMtn}"/></clipPath>
        <clipPath id="hdS-floorclip"><path d="${floor}"/></clipPath>
        <clipPath id="hdS-slopeclip"><path d="${slope}"/></clipPath>
        <clipPath id="hdS-boardclip"><path d="${board}"/></clipPath>
        <clipPath id="hdS-wallclip"><path d="${wall}"/></clipPath>`,
      layers: [
        L(0, fill('hdS-sky') + `<g fill="#ffffff" opacity=".75"><ellipse cx="130" cy="152" rx="44" ry="5"/><ellipse cx="190" cy="168" rx="26" ry="4"/><ellipse cx="2260" cy="128" rx="170" ry="6"/><ellipse cx="2400" cy="160" rx="90" ry="4"/><ellipse cx="-560" cy="150" rx="180" ry="6"/></g>`),

        L(0.12, `<path d="${hz1}" fill="#c2d3e7"/><path d="${hz2}" fill="#a6bedb"/><path d="${hz3}" fill="#8aa8cc"/>
          <rect x="-3000" y="280" width="8000" height="340" fill="url(#hdS-haze)"/>
          <path d="${far}" fill="#9bb3d0"/><path d="${farFloor}" fill="#4a7183"/>
          <path d="${line([[786, 800], [826, 852], [900, 892], [960, 960], [1000, 1080]])}" fill="none" stroke="#d3e6ee" stroke-width="5" opacity=".6"/>
          <path d="${spurR}" fill="#84a1c3"/><path d="${spurL}" fill="#6d8dae"/>
          <rect x="-3000" y="400" width="8000" height="720" fill="url(#hdS-vhaze)"/>`),

        L(0.28, `<path d="${leftFar}" fill="#7396ac"/>
          <path d="${leftMtn}" fill="url(#hdS-left)"/>
          <g clip-path="url(#hdS-leftclip)">${A.tex({ n: 700, x0: -1500, x1: 700, top: (x) => leftTop(x) + 4, base: 1100, seed: 217, scale: 0.38 })}</g>
          <path fill="url(#hdS-lit)" d="M-836 520 L-822 380 L-790 318 L-712 276 L-632 258 L-616 300 L-606 420 L-600 560 L-606 668 L-700 676 L-800 644 Z"/>
          <path fill="url(#hdS-shade)" d="M-632 258 L-566 270 L-486 306 L-436 360 L-424 460 L-440 566 L-496 640 L-606 668 L-600 560 L-606 420 L-616 300 Z"/>
          <g fill="#8b8fb0" opacity=".3">${streak(-780, 12, 340, 620, -6)}${streak(-716, 10, 310, 640, -4)}${streak(-664, 12, 290, 600, -2)}</g>
          <path d="${skirt(-860, -400, 628, 600, 60, 252)}" fill="url(#hdS-left)"/>
          <path fill="url(#hdS-lit)" d="M-84 478 L-70 396 L20 378 L96 384 L150 404 L176 432 L262 446 L322 474 L352 548 L368 632 L352 712 L304 756 L252 700 L214 640 L190 584 L150 560 L96 568 L-50 558 Z"/>
          <path fill="url(#hdS-shade)" d="M322 474 L352 548 L368 632 L352 712 L304 756 L296 690 L308 610 L314 530 Z"/>
          <path fill="#6d79a1" opacity=".75" d="M158 470 L190 478 L204 566 L196 610 L174 588 L162 530 Z"/>
          <g fill="#8b8fb0" opacity=".3">${streak(-20, 12, 400, 548, 2)}${streak(70, 10, 396, 556, 2)}${streak(244, 10, 462, 680, 10)}</g>
          <path d="${skirt(-110, 160, 540, 552, 50, 253)}" fill="url(#hdS-left)"/>
          <path fill="url(#hdS-lit)" d="M396 704 L432 682 L480 668 L492 734 L514 804 L544 868 L520 882 L468 852 L436 800 L410 760 Z"/>
          <path fill="url(#hdS-shade)" d="M480 668 L502 692 L528 752 L552 812 L568 862 L544 868 L514 804 L492 734 Z"/>

          <path d="${domeD}" fill="url(#hdS-dome)"/>
          <g fill="none" stroke="#b9805f" stroke-width="3" opacity=".3"><path d="${line([[1900, 340], [2000, 280], [2120, 262], [2240, 282], [2330, 340]])}"/><path d="${line([[1960, 380], [2040, 330], [2130, 316], [2220, 332], [2290, 380]])}"/></g>
          <path d="${wall}" fill="url(#hdS-wall)"/>
          <g clip-path="url(#hdS-wallclip)">
            <path fill="url(#hdS-shade)" opacity=".42" d="M2010 400 L2090 500 L2130 700 L2170 1350 L1990 1350 L2010 900 Z"/>
            <g fill="#8b8fb0" opacity=".3">${streak(1150, 16, 560, 1060, -8)}${streak(1262, 14, 590, 1180, -4)}${streak(1372, 12, 640, 1210, 4)}${streak(1478, 10, 690, 1150, 6)}${streak(1700, 14, 700, 1240, 6)}${streak(2330, 14, 720, 1250, 6)}${streak(2560, 12, 700, 1260, 6)}</g>
            <g fill="#ffffff" opacity=".45">${streak(1205, 17, 580, 1120, -4)}${streak(1440, 12, 670, 1230, 6)}${streak(1840, 14, 720, 1260, 6)}</g>
          </g>
          <path fill="url(#hdS-shade)" d="${wallEdge}"/>
          <path d="${rimForest}" fill="#2f5a49"/>`),

        L(0.44, `<path d="${floor}" fill="url(#hdS-floor)"/>
          <g clip-path="url(#hdS-floorclip)">${A.tex({ n: 560, x0: 640, x1: 3000, top: (x) => floorTop(x) + 4, base: 2300, seed: 219, scale: 0.34 })}</g>
          <path d="M1090 1322 L1180 1308 L1290 1330 L1312 1362 L1232 1386 L1120 1380 Z M1185 1442 L1262 1436 L1352 1460 L1334 1500 L1240 1496 Z M2040 1420 L2200 1406 L2340 1436 L2310 1482 L2120 1478 Z" fill="#a9c77c" opacity=".9"/>
          <path d="${line([[1140, 1548], [1320, 1566], [1480, 1534], [1680, 1574], [1900, 1544], [2150, 1584], [2450, 1562], [3000, 1604]])}" fill="none" stroke="#bcd8e0" stroke-width="6" opacity=".55"/>
          <path d="${slope}" fill="url(#hdS-hill)"/>
          <g clip-path="url(#hdS-slopeclip)">${A.tex({ n: 560, x0: -1500, x1: 730, top: (x) => slopeTop(x) + 4, base: 1400, seed: 220, scale: 0.4 })}</g>`),

        L(0.62, `<path d="${board}" fill="url(#hdS-board)"/>
          <g clip-path="url(#hdS-boardclip)">
            ${ledge(1186, 1226)}${ledge(1336, 1366)}${ledge(1500, 1520)}
            <path d="M1095 1440 L1075 1500 L1040 1575 L960 1638 L870 1710 L800 1805 L750 1910 L725 2700 L500 2700 L560 1990 L660 1800 L800 1660 L960 1540 Z" fill="#565e8c" opacity=".8"/>
          </g>
          <path d="${boardLit}" fill="#fff7e4"/><path d="${boardLip}" fill="#7d83ad" opacity=".5"/>
          <path fill="#fff7e4" d="M-860 946 L-828 866 L-744 842 L-664 870 L-650 950 Z"/><path fill="#a9a6c0" d="M-744 842 L-664 870 L-650 950 L-716 948 Z"/>
          <path fill="#fff7e4" d="M-330 990 L-306 952 L-250 944 L-204 964 L-198 996 Z"/><path fill="#a9a6c0" d="M-250 944 L-204 964 L-198 996 L-238 994 Z"/>
          <path fill="#fff7e4" d="M120 985 L215 968 L288 985 L300 1030 L250 1046 L150 1038 Z"/><path fill="#a9a6c0" d="M215 968 L288 985 L300 1030 L250 1046 L262 1000 Z"/>
          <path fill="#f1dfbd" d="M398 1015 L438 1007 L458 1035 L452 1098 L408 1110 L394 1060 Z"/>
          <path fill="#fff7e4" d="M470 1032 L940 1040 L942 1056 L470 1050 Z"/>
          <path fill="#edd9b4" d="M470 1050 L942 1056 L948 1100 L472 1094 Z"/>
          <path fill="#6d75a2" opacity=".62" d="M472 1094 L948 1100 L956 1142 L640 1136 L500 1152 L470 1114 Z"/>
          <path fill="#4d557f" opacity=".8" d="M500 1150 L630 1138 L632 1200 L520 1196 Z"/>
          <path fill="#fff7e4" d="M625 1135 L935 1130 L955 1150 L938 1292 L870 1302 L720 1262 L632 1205 Z"/>
          <path fill="#6d75a2" opacity=".62" d="M632 1205 L720 1262 L870 1302 L938 1292 L935 1318 L870 1328 L715 1288 L628 1226 Z"/>`),

        L(1.1, `<path d="${A.ridge({ x0: -1600, x1: 3100, y: (x) => 1730 - Math.pow(Math.abs(x - 750) / 1800, 2) * (x < 750 ? 480 : 330), amp: 34, wave: 340, rough: 0.4, step: 46, seed: 251, base: 3200 })}" fill="#232c3a"/>`, { key: 'rim' })
      ]
    };
  };
})();
