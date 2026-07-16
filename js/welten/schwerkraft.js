'use strict';
/* ===== Welt 2: Schwerkraft & Fallen ===== */
Baukasten.welt({
  id: 'schwerkraft',
  name: 'Schwerkraft & Fallen',
  emoji: '🍎',
  farbe: '#7ed321',
  beschreibung: 'Warum fällt der Apfel nach unten? Und hüpft man auf dem Mond wirklich höher?'
});

/* --- 1. Fallturm: Feder gegen Stein --- */
Baukasten.demo('schwerkraft', {
  id: 'fallturm',
  name: 'Blatt gegen Stein',
  emoji: '🍃',
  frage: 'Was landet zuerst – das Blatt oder der Stein?',
  erklaerung: `Die Schwerkraft zieht an <b>allem gleich stark</b> – an Blättern genauso wie an Steinen!
    Nur die <b>Luft</b> bremst das leichte Blatt aus, wie ein winziger Fallschirm.
    Schieb den Luft-Regler ganz nach links: Ohne Luft landen beide <b>genau gleichzeitig</b>!`,
  wow: `Ein Astronaut hat das auf dem Mond wirklich ausprobiert: Hammer und Feder
    fielen dort <b>exakt gleich schnell</b> – denn auf dem Mond gibt es keine Luft!`,
  params: [
    { key: 'luft', label: 'Luft im Turm', min: 0, max: 1, step: 0.01, start: 1,
      format: v => v < 0.1 ? '🌑 Keine (Vakuum)' : v < 0.5 ? '💨 Wenig' : '🌬️ Normale Luft' }
  ],
  knoepfe: [
    { label: '✋ Fallen lassen!', tue: (s) => {
        s.y1 = 90; s.y2 = 90; s.v1 = 0; s.v2 = 0;
        s.laeuft = true; s.zeit1 = 0; s.zeit2 = 0; s.uhr = 0;
      } }
  ],
  init(s) {
    s.y1 = 90; s.y2 = 90; s.v1 = 0; s.v2 = 0;
    s.laeuft = false; s.zeit1 = 0; s.zeit2 = 0; s.uhr = 0;
  },
  schritt(s, p, dt) {
    if (!s.laeuft) return;
    s.uhr += dt;
    const g = 500, bodenY = 400;
    // Stein: fast keine Luftbremse; Feder: riesige Luftbremse
    if (s.y1 < bodenY) {
      s.v1 += (g - p.luft * 0.02 * s.v1 * s.v1) * dt;
      s.y1 += s.v1 * dt;
      if (s.y1 >= bodenY) { s.y1 = bodenY; s.zeit1 = s.uhr; Baukasten.ton(100, 0.2, 'square', 0.15); }
    }
    if (s.y2 < bodenY) {
      const bremse = p.luft * 1.1 * s.v2 * s.v2;
      s.v2 += (g - bremse) * dt;
      if (s.v2 < 0) s.v2 = 0;
      s.y2 += s.v2 * dt;
      if (s.y2 >= bodenY) { s.y2 = bodenY; s.zeit2 = s.uhr; Baukasten.ton(600, 0.15, 'sine', 0.08); }
    }
    if (s.y1 >= bodenY && s.y2 >= bodenY) s.laeuft = false;
  },
  malen(ctx, s, p) {
    // Turm-Innenraum – dunkler bei Vakuum
    const dunkel = 1 - p.luft * 0.6;
    ctx.fillStyle = `rgb(${Math.round(190 * dunkel + 40)}, ${Math.round(205 * dunkel + 45)}, ${Math.round(235 * dunkel + 20)})`;
    ctx.fillRect(0, 0, s.w, s.h);
    // zwei Röhren
    for (const rx of [200, 520]) {
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(rx - 90, 40, 180, 400);
      ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 5;
      ctx.strokeRect(rx - 90, 40, 180, 400);
    }
    // Luft-Wirbel sichtbar machen
    if (p.luft > 0.1) {
      ctx.save();
      ctx.globalAlpha = p.luft * 0.5;
      for (let i = 0; i < 10; i++) {
        const wx = 130 + (i * 173) % 540;
        const wy = 70 + (i * 97 + s.zeit * 20) % 350;
        PBU.emoji(ctx, '〰️', wx, wy, 16);
      }
      ctx.restore();
    }
    PBU.boden(ctx, s.w, s.h, 55, '#8bc34a');
    // Objekte
    PBU.malStein(ctx, 200, s.y1, 24);
    const flattert = s.laeuft && s.y2 < 398;
    PBU.malBlatt(ctx, 520, s.y2, 42, flattert ? Math.sin(s.zeit * 5) * 0.45 : 0.15);
    PBU.text(ctx, 'Stein', 200, 465, 20, '#3a3352');
    PBU.text(ctx, 'Blatt', 520, 465, 20, '#3a3352');
    // Ergebnisse
    if (s.zeit1 > 0) PBU.text(ctx, `⏱️ ${s.zeit1.toFixed(1)} s`, 200, 60, 22, '#e63946');
    if (s.zeit2 > 0) PBU.text(ctx, `⏱️ ${s.zeit2.toFixed(1)} s`, 520, 60, 22, '#e63946');
    if (s.zeit1 > 0 && s.zeit2 > 0) {
      const gleich = Math.abs(s.zeit1 - s.zeit2) < 0.15;
      PBU.text(ctx, gleich ? '🎉 Gleichzeitig gelandet!' : 'Die Luft hat das Blatt gebremst!',
        s.w / 2, 25, 22, gleich ? '#7ed321' : '#3a3352');
    }
    if (p.luft < 0.1) PBU.text(ctx, 'VAKUUM – hier ist gar keine Luft!', s.w / 2, 470 + 12, 16, '#fff');
  }
});

/* --- 2. Weitwurf: Kanone --- */
Baukasten.demo('schwerkraft', {
  id: 'weitwurf',
  name: 'Die Konfetti-Kanone',
  emoji: '🎯',
  frage: 'Mit welchem Winkel triffst du den Eimer?',
  erklaerung: `Der Ball fliegt in einem <b>Bogen</b>: Erst geht es steil nach oben,
    aber die Schwerkraft zieht ihn die ganze Zeit nach unten.
    Schräg nach oben (mittlerer Winkel) fliegt er am weitesten. Triff den Eimer!`,
  wow: `Springbrunnen, Basketballwürfe und Wasserschlauch-Strahlen machen
    <b>genau denselben Bogen</b>. Er heißt „Parabel“ – die Lieblingskurve der Schwerkraft!`,
  params: [
    { key: 'winkel', label: 'Rohr-Winkel', min: 10, max: 80, step: 1, start: 45,
      format: v => `↗️ ${Math.round(v)}°` },
    { key: 'power', label: 'Wumms', min: 240, max: 660, step: 5, start: 420,
      format: v => v < 350 ? '🧨 Klein' : v < 520 ? '💥 Mittel' : '🎆 Riesig!' }
  ],
  knoepfe: [
    { label: '🚀 Feuer!', tue: (s, p) => {
        const wk = -p.winkel * Math.PI / 180;
        s.bx = 80 + Math.cos(wk) * 55;
        s.by = 400 + Math.sin(wk) * 55;
        s.bvx = Math.cos(wk) * p.power;
        s.bvy = Math.sin(wk) * p.power;
        s.fliegt = true; s.spur = []; s.getroffen = false;
        Baukasten.ton(150, 0.3, 'sawtooth', 0.12);
      } }
  ],
  init(s) {
    s.fliegt = false; s.spur = []; s.getroffen = false;
    s.eimerX = 380 + Math.random() * 320;
    s.treffer = 0;
  },
  schritt(s, p, dt) {
    PBU.konfettiSchritt(s, dt);
    if (!s.fliegt) return;
    s.bvy += 600 * dt;
    s.bx += s.bvx * dt; s.by += s.bvy * dt;
    s.spur.push({ x: s.bx, y: s.by });
    // Eimer-Treffer?
    if (s.by > 385 && s.by < 425 && Math.abs(s.bx - s.eimerX) < 32 && s.bvy > 0) {
      s.fliegt = false; s.getroffen = true; s.treffer++;
      PBU.konfettiStart(s, s.eimerX, 390, 50);
      Baukasten.ton(523, 0.15, 'triangle'); setTimeout(() => Baukasten.ton(784, 0.3, 'triangle'), 130);
      setTimeout(() => { if (s.getroffen) s.eimerX = 380 + Math.random() * 320; s.getroffen = false; s.spur = []; }, 1600);
    }
    if (s.by > 430 || s.bx > s.w + 40) {
      s.fliegt = false;
      Baukasten.ton(90, 0.15, 'square', 0.08);
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h);
    PBU.emoji(ctx, '☁️', 300, 80, 50);
    PBU.emoji(ctx, '☁️', 620, 130, 40);
    PBU.boden(ctx, s.w, s.h, 70, '#8bc34a');
    // Kanone
    ctx.save();
    ctx.translate(80, 400);
    ctx.rotate(-p.winkel * Math.PI / 180);
    PBU.kasten(ctx, 0, -14, 70, 28, '#3a3352', 10);
    ctx.restore();
    PBU.kreis(ctx, 80, 408, 26, '#e63946');
    PBU.kreis(ctx, 80, 408, 12, '#3a3352');
    // Ziel-Eimer
    ctx.fillStyle = '#42a5f5';
    ctx.beginPath();
    ctx.moveTo(s.eimerX - 32, 392); ctx.lineTo(s.eimerX + 32, 392);
    ctx.lineTo(s.eimerX + 24, 432); ctx.lineTo(s.eimerX - 24, 432);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#1d5c94'; ctx.lineWidth = 4; ctx.stroke();
    // Flugspur (gepunkteter Bogen)
    ctx.fillStyle = 'rgba(230,57,70,0.55)';
    s.spur.forEach((t, i) => { if (i % 4 === 0) PBU.kreis(ctx, t.x, t.y, 4, 'rgba(230,57,70,0.55)'); });
    // Ball
    if (s.fliegt) PBU.malWurfball(ctx, s.bx, s.by, 13);
    PBU.konfettiMalen(ctx, s);
    if (s.getroffen) PBU.text(ctx, '🎉 TREFFER!', s.eimerX, 340, 34, '#e63946');
    if (s.treffer > 0) PBU.text(ctx, `Treffer: ${s.treffer} 🏆`, s.w - 20, 30, 20, '#3a3352', 'right');
    PBU.text(ctx, 'Stell Winkel und Wumms ein – triff den Eimer!', s.w / 2, 470, 17, '#2c5d16');
  }
});

/* --- 3. Auf dem Mond --- */
Baukasten.demo('schwerkraft', {
  id: 'mond',
  name: 'Hüpfen auf dem Mond',
  emoji: '👨‍🚀',
  frage: 'Wie hoch springst du auf dem Mond? Und auf dem Riesen-Planeten Jupiter?',
  erklaerung: `Jeder Himmelskörper zieht <b>unterschiedlich stark</b> an dir!
    Der kleine Mond zieht nur schwach – du springst <b>sechsmal höher</b> als zu Hause.
    Der Riese Jupiter zieht so stark, dass du kaum vom Boden wegkommst.`,
  wow: `Auf dem Mond konnten Astronauten trotz ihrer <b>80 kg schweren</b> Raumanzüge
    hüpfen wie Kängurus – alles fühlte sich federleicht an!`,
  params: [
    { key: 'ort', label: 'Wo bist du?', min: 0, max: 2, step: 0.01, start: 1,
      format: v => v < 0.5 ? '🌙 Mond' : v < 1.5 ? '🌍 Erde' : '🪐 Jupiter' }
  ],
  knoepfe: [
    { label: '🦘 Springen!', tue: (s, p) => {
        if (s.y >= 369) {
          s.vy = -330;
          Baukasten.ton(330, 0.2, 'triangle', 0.12);
        }
      } }
  ],
  init(s) { s.y = 370; s.vy = 0; s.maxHoehe = 0; },
  schritt(s, p, dt) {
    // g: Mond 130, Erde 750, Jupiter 1900
    const g = p.ort < 0.5 ? 130 : p.ort < 1.5 ? 750 : 1900;
    if (s.y < 370 || s.vy < 0) {
      s.vy += g * dt;
      s.y += s.vy * dt;
      s.maxHoehe = Math.max(s.maxHoehe, 370 - s.y);
      if (s.y >= 370) { s.y = 370; s.vy = 0; Baukasten.ton(110, 0.1, 'square', 0.06); }
    }
  },
  malen(ctx, s, p) {
    const ort = p.ort < 0.5 ? 'mond' : p.ort < 1.5 ? 'erde' : 'jupiter';
    if (ort === 'mond') {
      PBU.nacht(ctx, s.w, s.h);
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 40; i++) ctx.fillRect((i * 211) % s.w, (i * 137) % 350, 2, 2);
      PBU.malErde(ctx, 690, 80, 26);
      PBU.boden(ctx, s.w, s.h, 90, '#9e9e9e');
      // Krater
      for (const [kx, ky, kr] of [[200, 438, 24], [600, 448, 17], [420, 465, 13]]) {
        ctx.fillStyle = '#82828c';
        ctx.beginPath(); ctx.ellipse(kx, ky, kr, kr * 0.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#6c6c76';
        ctx.beginPath(); ctx.ellipse(kx, ky + 1, kr * 0.7, kr * 0.26, 0, 0, Math.PI * 2); ctx.fill();
      }
    } else if (ort === 'erde') {
      PBU.himmel(ctx, s.w, s.h);
      PBU.emoji(ctx, '☀️', 700, 70, 55);
      PBU.emoji(ctx, '☁️', 250, 100, 45);
      PBU.boden(ctx, s.w, s.h, 90, '#8bc34a');
      PBU.malBlume(ctx, 200, 428, 36);
      PBU.malBaum(ctx, 640, 428, 90);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, s.h);
      g.addColorStop(0, '#d88a4a'); g.addColorStop(1, '#f2c088');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s.w, s.h);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      for (let i = 0; i < 4; i++) ctx.fillRect(0, 60 + i * 80, s.w, 22);
      PBU.boden(ctx, s.w, s.h, 90, '#b06a35');
    }
    // Sprunghöhen-Lineal
    ctx.strokeStyle = 'rgba(58,51,82,0.4)'; ctx.lineWidth = 2;
    for (let hM = 50; hM <= 350; hM += 60) {
      ctx.beginPath(); ctx.moveTo(85, 410 - hM); ctx.lineTo(110, 410 - hM); ctx.stroke();
    }
    if (s.maxHoehe > 10) {
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#e63946';
      ctx.beginPath(); ctx.moveTo(80, 410 - s.maxHoehe - 78); ctx.lineTo(s.w - 80, 410 - s.maxHoehe - 78); ctx.stroke();
      ctx.setLineDash([]);
      PBU.text(ctx, 'Rekord!', s.w - 75, 410 - s.maxHoehe - 78, 16, '#e63946', 'left');
    }
    // Astronaut (Füße auf der Bodenkante bei 410)
    PBU.malAstronaut(ctx, 400, s.y + 40, 66);
    const name = ort === 'mond' ? 'MOND – schwache Anziehung' : ort === 'erde' ? 'ERDE – normale Anziehung' : 'JUPITER – MEGA-Anziehung!';
    PBU.text(ctx, name, s.w / 2, 35, 24, ort === 'mond' ? '#fff' : '#3a3352');
  }
});

/* --- 4. Flummi --- */
// Regler-Werte sauber runden, damit Hoch- und Runterschieben an der
// gleichen Position immer denselben Ball ergeben (Fließkomma-Falle!)
function flummiSorte(g) {
  g = Math.round(g * 100) / 100;
  return g < 0.3 ? 0 : g < 0.6 ? 1 : g < 0.85 ? 2 : 3;
}
Baukasten.demo('schwerkraft', {
  id: 'flummi',
  name: 'Flummi-Forschung',
  emoji: '🏀',
  frage: 'Warum hüpft ein Flummi nie höher, als du ihn fallen lässt?',
  erklaerung: `Beim Aufprall verwandelt der Ball seinen Schwung in <b>Zusammendrücken</b> –
    und schnellt dann wie eine Feder zurück. Aber ein bisschen Schwung geht <b>immer verloren</b>
    (er wird zu Wärme!). Darum wird jeder Hüpfer kleiner.`,
  wow: `Ein Flummi aus Spezial-Gummi springt aus 1 Meter fast <b>90 cm</b> hoch zurück.
    Ein Knetball dagegen: <b>0 cm</b> – die Knete schluckt allen Schwung!`,
  params: [
    { key: 'gummi', label: 'Ball-Sorte', min: 0.1, max: 0.92, step: 0.01, start: 0.75,
      format: v => ['🟤 Knetball', '⚽ Fußball', '🏀 Basketball', '🔴 Super-Flummi'][flummiSorte(v)] },
    { key: 'hoehe', label: 'Fall-Höhe', min: 100, max: 330, step: 5, start: 280,
      format: v => v < 180 ? '✋ Niedrig' : v < 260 ? '🙋 Hüfthoch' : '🏔️ Ganz oben' }
  ],
  neustartBei: ['hoehe'],
  knoepfe: [
    { label: '✋ Fallen lassen!', tue: (s, p) => {
        s.y = 400 - p.hoehe; s.vy = 0; s.laeuft = true; s.gipfel = [];
      } }
  ],
  init(s, p) { s.y = 400 - p.hoehe; s.vy = 0; s.laeuft = false; s.gipfel = []; s.quetsch = 0; },
  schritt(s, p, dt) {
    if (!s.laeuft) return;
    if (s.quetsch > 0) s.quetsch -= dt * 6;
    s.vy += 900 * dt;
    s.y += s.vy * dt;
    if (s.y >= 400) {
      s.y = 400;
      if (Math.abs(s.vy) < 25) { s.laeuft = false; s.vy = 0; }
      else {
        s.vy = -s.vy * p.gummi;
        s.quetsch = 1;
        s.steigend = true;
        Baukasten.ton(80 + p.gummi * 200, 0.1, 'square', 0.1);
      }
    }
    // Gipfelpunkt merken
    if (s.steigend && s.vy >= 0) {
      s.steigend = false;
      if (400 - s.y > 15) s.gipfel.push({ x: 0, y: s.y });
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#ffe3ec', '#fff6fa');
    PBU.boden(ctx, s.w, s.h, 100, '#deb887');
    // Start-Markierung
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#42a5f5'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(100, 400 - p.hoehe - 24); ctx.lineTo(700, 400 - p.hoehe - 24); ctx.stroke();
    ctx.setLineDash([]);
    PBU.text(ctx, 'Start-Höhe', 110, 400 - p.hoehe - 40, 15, '#42a5f5', 'left');
    // Gipfel-Markierungen
    s.gipfel.forEach((g, i) => {
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = 'rgba(230,57,70,0.5)';
      ctx.beginPath(); ctx.moveTo(320, g.y - 24); ctx.lineTo(480, g.y - 24); ctx.stroke();
      ctx.setLineDash([]);
      PBU.text(ctx, `${i + 1}.`, 495, g.y - 24, 14, '#e63946', 'left');
    });
    // Ball (gequetscht beim Aufprall)
    PBU.malBall(ctx, 400, s.y - 24, 24, flummiSorte(p.gummi), Math.max(0, s.quetsch));
    if (!s.laeuft && s.gipfel.length > 0) {
      PBU.text(ctx, 'Jeder Hüpfer ein bisschen kleiner!', s.w / 2, 50, 22, '#3a3352');
    }
  }
});
