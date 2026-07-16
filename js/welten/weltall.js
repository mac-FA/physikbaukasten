'use strict';
/* ===== Welt 8: Himmel & Weltall ===== */
Baukasten.welt({
  id: 'weltall',
  name: 'Himmel & Weltall',
  emoji: '🪐',
  farbe: '#22223b',
  beschreibung: 'Warum wird es Nacht? Warum sieht der Mond jede Woche anders aus?'
});

/* --- 1. Tag & Nacht --- */
Baukasten.demo('weltall', {
  id: 'tagnacht',
  name: 'Warum wird es dunkel?',
  emoji: '🌗',
  frage: 'Geht die Sonne wirklich „unter"? Oder passiert etwas ganz anderes?',
  erklaerung: `Die Sonne bleibt, wo sie ist – die <b>Erde dreht sich</b> wie ein Karussell!
    Dein Zuhause (das kleine Haus 🏠) wird mal zur Sonne hingedreht (Tag ☀️)
    und mal von ihr weg (Nacht 🌙). Eine ganze Drehung dauert genau <b>einen Tag</b>!`,
  wow: `Du sitzt gerade auf einem Riesen-Karussell: Die Erde wirbelt dich mit über
    <b>1000 km/h</b> im Kreis – schneller als ein Düsenjet! Du merkst nichts, weil sich alles mitdreht.`,
  params: [
    { key: 'tempo', label: 'Dreh-Tempo', min: 0, max: 2, step: 0.01, start: 0.5,
      format: v => v < 0.1 ? '⏸️ Angehalten' : v < 0.8 ? '🌍 Gemütlich' : '🌪️ Zeitraffer!' }
  ],
  init(s) { s.drehung = 0.8; },
  schritt(s, p, dt) { s.drehung += p.tempo * dt; },
  malen(ctx, s, p) {
    PBU.nacht(ctx, s.w, s.h);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) ctx.fillRect((i * 173 + 20) % s.w, (i * 97) % s.h, 2, 2);
    const ex = 480, ey = 260, er = 110;
    // Sonne links mit Strahlen
    const sx = 80, sy = 260;
    const g = ctx.createRadialGradient(sx, sy, 10, sx, sy, 90);
    g.addColorStop(0, '#fff6c8'); g.addColorStop(0.5, '#ffd54f'); g.addColorStop(1, 'rgba(255,213,79,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(sx, sy, 90, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, sx, sy, 45, '#ffd54f');
    // Lichtstrahlen zur Erde
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.moveTo(sx + 40, sy - 30);
    ctx.lineTo(ex, ey - er); ctx.lineTo(ex, ey + er);
    ctx.lineTo(sx + 40, sy + 30);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // Erde (Blick von oben auf den Nordpol)
    const eg = ctx.createRadialGradient(ex, ey, 20, ex, ey, er);
    eg.addColorStop(0, '#7ec3f7'); eg.addColorStop(1, '#1d5c94');
    ctx.fillStyle = eg;
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
    // Kontinente sind FEST verankert und drehen sich als Ganzes mit
    ctx.save();
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.clip();
    ctx.translate(ex, ey);
    ctx.rotate(s.drehung);
    for (const [kx, ky, kr] of [[62, -20, 24], [-30, 58, 20], [-55, -45, 16], [18, 30, 13], [-8, -72, 12]]) {
      PBU.kreis(ctx, kx, ky, kr, '#7ed321');
    }
    ctx.restore();
    // Haus: auf der Oberfläche angewachsen, dreht mit der Erde
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(s.drehung);
    ctx.translate(er, 0);
    ctx.rotate(Math.PI / 2);
    PBU.malHaus(ctx, 0, 2, 26);
    ctx.restore();
    // Nachtseite: die sonnenabgewandte Hälfte liegt im Dunkeln (fest im Raum!)
    ctx.save();
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.clip();
    const ng = ctx.createLinearGradient(ex - er, ey, ex + er, ey);
    ng.addColorStop(0, 'rgba(10,15,40,0)');
    ng.addColorStop(0.5, 'rgba(10,15,40,0.15)');
    ng.addColorStop(1, 'rgba(10,15,40,0.85)');
    ctx.fillStyle = ng;
    ctx.fillRect(ex - er, ey - er, er * 2, er * 2);
    ctx.restore();
    // Sonne-oder-Mond-Anzeige über dem Haus
    const hw = s.drehung;
    const hx = ex + Math.cos(hw) * (er + 42);
    const hy = ey + Math.sin(hw) * (er + 42);
    const tagseite = Math.cos(hw) < -0.05;
    PBU.emoji(ctx, tagseite ? '☀️' : '🌙', hx, hy, 22);
    // Anzeige
    PBU.text(ctx, tagseite ? '☀️ Beim Haus ist gerade TAG' : '🌙 Beim Haus ist gerade NACHT',
      s.w / 2, 50, 26, '#fff');
    PBU.text(ctx, 'Die Sonne bleibt – die Erde dreht sich!', s.w / 2, 465, 18, 'rgba(255,255,255,0.7)');
  }
});

/* --- 2. Mondphasen --- */
Baukasten.demo('weltall', {
  id: 'mondphasen',
  name: 'Warum ändert sich der Mond?',
  emoji: '🌙',
  frage: 'Wohin verschwindet der halbe Mond?',
  erklaerung: `Der Mond leuchtet <b>gar nicht selbst</b> – die Sonne strahlt ihn an,
    immer nur von einer Seite! Während der Mond um die Erde wandert, siehst du mal seine
    <b>helle Seite</b> (Vollmond 🌕), mal seine <b>dunkle</b> (Neumond 🌑), meistens etwas dazwischen.
    Schieb den Mond einmal ganz herum!`,
  wow: `Der Mond braucht ungefähr <b>einen Monat</b> für eine Runde um die Erde –
    daher kommt das Wort <b>„Monat“</b>! Mond… Monat… hörst du's?`,
  params: [
    { key: 'position', label: 'Mond-Position', min: 0, max: 360, step: 1, start: 180,
      format: v => {
        const w = ((v % 360) + 360) % 360;
        return w < 22 || w >= 338 ? '🌑 Neumond' : w < 112 ? '🌒 Zunehmend' : w < 158 ? '🌔 Fast voll' :
          w < 202 ? '🌕 Vollmond' : w < 248 ? '🌖 Abnehmend' : '🌘 Fast weg';
      } }
  ],
  init() {},
  malen(ctx, s, p) {
    PBU.nacht(ctx, s.w, s.h);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 60; i++) ctx.fillRect((i * 191 + 10) % s.w, (i * 83) % s.h, 2, 2);
    const ex = 330, ey = 250;
    // Sonnenlicht von links (Pfeile)
    for (const py of [120, 250, 380]) {
      ctx.save(); ctx.globalAlpha = 0.5;
      PBU.pfeil(ctx, 30, py, 110, py, '#ffd54f', 4);
      ctx.restore();
    }
    PBU.text(ctx, '☀️ Sonnenlicht', 70, 80, 16, '#ffd54f');
    // Mondbahn
    ctx.setLineDash([5, 9]);
    PBU.ring(ctx, ex, ey, 150, 'rgba(255,255,255,0.25)', 2);
    ctx.setLineDash([]);
    // Erde
    PBU.malErde(ctx, ex, ey, 32);
    // Mond auf der Bahn: 0° = zwischen Erde und Sonne (links) = Neumond
    const w = (p.position - 180) * Math.PI / 180; // 180 -> rechts der Erde? Berechnung: pos=0 => links
    const mx = ex + Math.cos(Math.PI + (p.position * Math.PI / 180)) * 150 * -1;
    const mondW = p.position * Math.PI / 180; // 0 = links (zur Sonne)
    const mX = ex - Math.cos(mondW) * 150;
    const mY = ey - Math.sin(mondW) * 150;
    // Mond: helle Hälfte immer zur Sonne (links)
    const mr = 26;
    ctx.save();
    ctx.beginPath(); ctx.arc(mX, mY, mr, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#2a2d5e'; ctx.fillRect(mX - mr, mY - mr, mr * 2, mr * 2);
    ctx.fillStyle = '#f0eede';
    ctx.fillRect(mX - mr, mY - mr, mr, mr * 2); // linke Hälfte hell
    ctx.restore();
    PBU.ring(ctx, mX, mY, mr, 'rgba(255,255,255,0.5)', 2);
    // Sichtlinie Erde->Mond
    ctx.save(); ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(mX, mY); ctx.stroke();
    ctx.restore();
    // Inset: So siehst DU den Mond von der Erde aus
    const ix = 660, iy = 130, ir = 56;
    PBU.kasten(ctx, ix - 85, iy - 90, 170, 185, 'rgba(255,255,255,0.08)', 14);
    PBU.text(ctx, 'So siehst du ihn:', ix, iy - 68, 15, '#fff');
    // Phase berechnen: Winkel zwischen Sonne-Richtung und Erde->Mond-Richtung
    const phase = ((p.position % 360) + 360) % 360; // 0=Neumond, 180=Vollmond
    ctx.save();
    ctx.beginPath(); ctx.arc(ix, iy + 10, ir, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#141233'; ctx.fillRect(ix - ir, iy + 10 - ir, ir * 2, ir * 2);
    ctx.fillStyle = '#f0eede';
    const ph = phase * Math.PI / 180;
    const beleuchtet = (1 - Math.cos(ph)) / 2; // 0..1
    // Halbkreis + Ellipsen-Trick für Sichel
    if (phase <= 180) {
      // zunehmend: rechts hell
      ctx.beginPath(); ctx.arc(ix, iy + 10, ir, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(ix, iy + 10, Math.abs(ir * Math.cos(ph)), ir, 0, 0, Math.PI * 2);
      ctx.fillStyle = phase < 90 ? '#141233' : '#f0eede';
      ctx.fill();
    } else {
      // abnehmend: links hell
      ctx.beginPath(); ctx.arc(ix, iy + 10, ir, Math.PI / 2, 3 * Math.PI / 2); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(ix, iy + 10, Math.abs(ir * Math.cos(ph)), ir, 0, 0, Math.PI * 2);
      ctx.fillStyle = phase > 270 ? '#141233' : '#f0eede';
      ctx.fill();
    }
    ctx.restore();
    PBU.ring(ctx, ix, iy + 10, ir, 'rgba(255,255,255,0.4)', 2);
    PBU.text(ctx, 'Die halbe Mond-Kugel ist IMMER hell –', s.w / 2, 440, 17, 'rgba(255,255,255,0.75)');
    PBU.text(ctx, 'du siehst nur mal mehr, mal weniger davon!', s.w / 2, 466, 17, 'rgba(255,255,255,0.75)');
  }
});

/* --- 3. Planeten-Karussell --- */
Baukasten.demo('weltall', {
  id: 'planeten',
  name: 'Das Planeten-Karussell',
  emoji: '🪐',
  frage: 'Welcher Planet saust am schnellsten um die Sonne?',
  erklaerung: `Alle Planeten fliegen um die Sonne – aber nicht gleich schnell!
    Die Sonne hält sie mit ihrer Schwerkraft fest wie an unsichtbaren Schnüren.
    <b>Nah an der Sonne</b> muss ein Planet <b>rasen</b>, um nicht hineinzufallen.
    <b>Weit draußen</b> reicht gemütliches Schweben. Beobachte den kleinen Merkur flitzen!`,
  wow: `Ein „Jahr“ ist eine Sonnen-Runde: Merkur schafft sie in <b>88 Tagen</b>,
    unsere Erde braucht 365 – und der ferne Neptun trödelt <b>165 Erden-Jahre</b> für eine einzige Runde!`,
  params: [
    { key: 'zeitraffer', label: 'Zeitraffer', min: 0.2, max: 3, step: 0.01, start: 1,
      format: v => v < 0.7 ? '🐢 Langsam' : v < 1.8 ? '▶️ Normal' : '⏩ Superschnell' }
  ],
  init(s) {
    s.planeten = [
      { name: 'Merkur', e: '🟤', r: 70, gr: 12, w: Math.random() * 6, runden: 0 },
      { name: 'Venus', e: '🟠', r: 115, gr: 17, w: Math.random() * 6, runden: 0 },
      { name: 'Erde', e: '🌍', r: 165, gr: 19, w: Math.random() * 6, runden: 0 },
      { name: 'Mars', e: '🔴', r: 215, gr: 15, w: Math.random() * 6, runden: 0 }
    ];
  },
  schritt(s, p, dt) {
    for (const pl of s.planeten) {
      // Kepler-artig: Tempo ~ 1/sqrt(r) – gemütlich, damit man zusehen kann
      const omega = 900 / Math.pow(pl.r, 1.5) * 1.2;
      const alt = pl.w;
      pl.w += omega * p.zeitraffer * dt;
      if (Math.floor(pl.w / (Math.PI * 2)) > Math.floor(alt / (Math.PI * 2))) pl.runden++;
    }
  },
  malen(ctx, s, p) {
    PBU.nacht(ctx, s.w, s.h);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 70; i++) ctx.fillRect((i * 167 + 30) % s.w, (i * 111) % s.h, 2, 2);
    const cx = 400, cy = 250;
    // Bahnen
    for (const pl of s.planeten) {
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, pl.r, pl.r * 0.55, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Sonne
    const g = ctx.createRadialGradient(cx, cy, 5, cx, cy, 55);
    g.addColorStop(0, '#fff6c8'); g.addColorStop(0.6, '#ffd54f'); g.addColorStop(1, 'rgba(255,213,79,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.fill();
    PBU.emoji(ctx, '☀️', cx, cy, 44);
    // Planeten (hinten zuerst)
    const sortiert = [...s.planeten].sort((a, b) =>
      (cy + Math.sin(a.w) * a.r * 0.55) - (cy + Math.sin(b.w) * b.r * 0.55));
    for (const pl of sortiert) {
      const x = cx + Math.cos(pl.w) * pl.r;
      const y = cy + Math.sin(pl.w) * pl.r * 0.55;
      if (pl.name === 'Erde') PBU.malErde(ctx, x, y, pl.gr);
      else PBU.emoji(ctx, pl.e, x, y, pl.gr * 2);
    }
    // Runden-Tafel
    PBU.kasten(ctx, 20, 20, 190, 138, 'rgba(255,255,255,0.1)', 12);
    PBU.text(ctx, 'Sonnen-Runden:', 115, 42, 16, '#fff');
    s.planeten.forEach((pl, i) => {
      PBU.text(ctx, `${pl.e} ${pl.name}: ${pl.runden}`, 35, 70 + i * 24, 15, '#fff', 'left');
    });
    PBU.text(ctx, 'Innen = flitzen, außen = trödeln!', s.w / 2, 470, 18, 'rgba(255,255,255,0.75)');
  }
});

/* --- 4. Jahreszeiten --- */
Baukasten.demo('weltall', {
  id: 'jahreszeiten',
  name: 'Sommer und Winter',
  emoji: '🍂',
  frage: 'Warum ist es im Winter kalt – ist die Sonne dann weiter weg?',
  erklaerung: `Nein – die Erde steht das ganze Jahr <b>schief</b>! Wie ein schräg gehaltener Kreisel
    wandert sie um die Sonne. Im Sommer ist unsere Hälfte <b>zur Sonne gekippt</b>:
    Das Licht trifft uns voll – warm! Im Winter sind wir <b>weggekippt</b>:
    Das Licht kommt nur flach und schwach an – brrr! Wandere einmal durchs Jahr!`,
  wow: `Wenn bei uns Winter ist, ist in Australien <b>Hochsommer</b> –
    die Kinder dort feiern Weihnachten beim Baden am Strand! 🏖️🎅`,
  params: [
    { key: 'monat', label: 'Monat', min: 0, max: 11.99, step: 0.01, start: 6,
      format: v => ['Januar ⛄', 'Februar ⛄', 'März 🌱', 'April 🌱', 'Mai 🌷', 'Juni ☀️',
        'Juli ☀️', 'August ☀️', 'September 🍂', 'Oktober 🍂', 'November 🌧️', 'Dezember ⛄'][
        PBU.klemme(Math.floor(Math.round(v * 100) / 100), 0, 11)] }
  ],
  init() {},
  malen(ctx, s, p) {
    PBU.nacht(ctx, s.w, s.h);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) ctx.fillRect((i * 179 + 15) % s.w, (i * 101) % s.h, 2, 2);
    const cx = 330, cy = 255;
    // Umlaufbahn
    ctx.setLineDash([5, 9]);
    ctx.beginPath(); ctx.ellipse(cx, cy, 240, 120, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.setLineDash([]);
    // Sonne
    const g = ctx.createRadialGradient(cx, cy, 5, cx, cy, 60);
    g.addColorStop(0, '#fff6c8'); g.addColorStop(0.6, '#ffd54f'); g.addColorStop(1, 'rgba(255,213,79,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.fill();
    PBU.emoji(ctx, '☀️', cx, cy, 48);
    // Erde: Monat 6 (Juli) = links? Wir setzen Juni/Juli rechts? Einfach: Winkel = (monat/12)*2π, Dez/Jan rechts.
    const w = (p.monat / 12) * Math.PI * 2 + Math.PI / 2 * 0 + 0; // Jan = 0 rechts
    const ex = cx + Math.cos(w) * 240;
    const ey = cy + Math.sin(w) * 120;
    const er = 42;
    // Erdkugel
    const eg = ctx.createRadialGradient(ex - 10, ey - 10, 5, ex, ey, er);
    eg.addColorStop(0, '#79c1f7'); eg.addColorStop(1, '#1a4a80');
    ctx.fillStyle = eg;
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
    // Achse: immer gleich gekippt (nach rechts oben), unabhängig vom Monat!
    const kipp = 0.4; // Radiant – Nordpol zeigt nach oben-rechts
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(kipp);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(0, -er - 16); ctx.lineTo(0, er + 16); ctx.stroke();
    ctx.setLineDash([]);
    // Äquator
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, er, er * 0.25, 0, 0, Math.PI); ctx.stroke();
    // Norden markieren
    PBU.text(ctx, 'N', 0, -er - 28, 18, '#7ed321');
    ctx.restore();
    // (Bewusst KEIN Tag/Nacht-Schatten hier – der würde in dieser Ansicht
    //  fälschlich nach Dauertag/Dauernacht aussehen. Tag & Nacht hat Station 1!)
    // Deutschland-Fähnchen auf Nordhalbkugel
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(kipp);
    PBU.malHaus(ctx, 12, -er * 0.55 + 9, 18);
    ctx.restore();
    // Jahreszeit für den Norden bestimmen:
    // Achse kippt nach "rechts oben" -> Nordpol zeigt Richtung +x-ish.
    // Sommer im Norden, wenn Erde LINKS von der Sonne (Nordpol zur Sonne geneigt) -> Monat ~ Juni/Juli (w≈π)
    const m = PBU.klemme(Math.floor(Math.round(p.monat * 100) / 100), 0, 11);
    const jahreszeit = [11, 0, 1].includes(m) ? '⛄ WINTER' : [2, 3, 4].includes(m) ? '🌱 FRÜHLING'
      : [5, 6, 7].includes(m) ? '☀️ SOMMER' : '🍂 HERBST';
    PBU.text(ctx, `Bei uns im Norden: ${jahreszeit}`, s.w / 2, 45, 26, '#fff');
    PBU.text(ctx, 'Die Erdachse bleibt IMMER gleich schief gekippt!', s.w / 2, 468, 17, 'rgba(255,255,255,0.75)');
    // Info-Kasten: Lichteinfall
    const sommer = [5, 6, 7].includes(m), winter = [11, 0, 1].includes(m);
    if (sommer || winter) {
      PBU.kasten(ctx, 590, 330, 190, 110, 'rgba(255,255,255,0.1)', 12);
      PBU.text(ctx, sommer ? 'Licht trifft uns voll:' : 'Licht kommt nur flach:', 685, 355, 14, '#fff');
      // kräftig gezeichnetes Gesicht statt blassem Emoji
      const gx = 685, gy = 400;
      PBU.kreis(ctx, gx, gy, 21, sommer ? '#e8543f' : '#7ec8ff');
      ctx.strokeStyle = '#1c1a24'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(gx, gy, 21, 0, Math.PI * 2); ctx.stroke();
      PBU.kreis(ctx, gx - 7, gy - 5, 2.6, '#1c1a24');
      PBU.kreis(ctx, gx + 7, gy - 5, 2.6, '#1c1a24');
      ctx.strokeStyle = '#1c1a24'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      if (sommer) {
        // erschöpft: offener Mund + Schweißtropfen
        ctx.beginPath(); ctx.arc(gx, gy + 8, 5, 0, Math.PI); ctx.stroke();
        ctx.fillStyle = '#7ec8ff';
        ctx.beginPath();
        ctx.moveTo(gx + 26, gy - 14);
        ctx.quadraticCurveTo(gx + 31, gy - 6, gx + 26, gy - 4);
        ctx.quadraticCurveTo(gx + 21, gy - 6, gx + 26, gy - 14);
        ctx.fill();
      } else {
        // bibbernd: Zickzack-Mund + Frost-Sternchen
        ctx.beginPath();
        ctx.moveTo(gx - 8, gy + 9); ctx.lineTo(gx - 4, gy + 6); ctx.lineTo(gx, gy + 9);
        ctx.lineTo(gx + 4, gy + 6); ctx.lineTo(gx + 8, gy + 9);
        ctx.stroke();
        ctx.strokeStyle = '#dff2ff'; ctx.lineWidth = 1.5;
        for (let sw = 0; sw < 3; sw++) {
          const w2 = sw * Math.PI / 3;
          ctx.beginPath();
          ctx.moveTo(gx + 28 - Math.cos(w2) * 6, gy - 10 - Math.sin(w2) * 6);
          ctx.lineTo(gx + 28 + Math.cos(w2) * 6, gy - 10 + Math.sin(w2) * 6);
          ctx.stroke();
        }
      }
    }
  }
});
