'use strict';
/* ===== Welt 9: Bausteine der Welt – die große Reise =====
 * Pipeline von "Woraus besteht alles?" zu "Welche Ur-Regeln steuern es?"
 */
Baukasten.welt({
  id: 'grund',
  name: 'Bausteine der Welt',
  emoji: '⚛️',
  farbe: '#0f9b8e',
  beschreibung: 'Die große Reise: Woraus besteht wirklich ALLES? Und welche Ur-Regeln stecken dahinter?'
});

/* --- 1. Die Zoom-Reise --- */
Baukasten.demo('grund', {
  id: 'zoomreise',
  name: 'Die Zoom-Reise',
  emoji: '🔬',
  frage: 'Was findest du, wenn du immer weiter hineinzoomst?',
  erklaerung: `Nimm das stärkste Mikroskop der Welt und zoome hinein – in deine eigene Hand!
    Hinter jeder Stufe wartet eine neue, kleinere Welt: Zellen, Moleküle, Atome …
    bis zu den <b>Quarks</b>, den kleinsten Bausteinen, die wir kennen.
    <b>Alles auf der Welt</b> – du, dein Hund, die Sterne – ist aus denselben Winzlingen gebaut!`,
  wow: `In einem einzigen Sandkorn stecken mehr Atome, als es <b>Sterne in unserer ganzen
    Galaxie</b> gibt. Du bist ein wandelnder Berg aus Milliarden Milliarden Bausteinchen!`,
  params: [
    { key: 'zoom', label: 'Hineinzoomen', min: 0, max: 8, step: 0.01, start: 0,
      format: v => ['🧒 Ein Kind', '🐞 Marienkäfer', '🧵 Ein Haar', '🟢 Hautzelle', '🦠 Bakterie',
        '💧 Molekül', '⚛️ Atom', '🔴 Atomkern', '✨ Quarks'][
        Math.round(PBU.klemme(Math.round(v * 100) / 100, 0, 8))] }
  ],
  init(s) {
    s.stufen = [
      { name: 'Ein Kind', text: 'Etwa 1 Meter groß – das bist du!', mal(ctx) { PBU.malKind(ctx, 0, 62, 118); } },
      { name: 'Ein Marienkäfer', text: '100-mal kleiner – krabbelt auf deiner Hand', mal(ctx) {
        ctx.fillStyle = '#e63946';
        ctx.beginPath(); ctx.ellipse(0, 8, 52, 46, 0, 0, Math.PI * 2); ctx.fill();
        PBU.kreis(ctx, 0, -38, 20, '#2b2b33');
        ctx.strokeStyle = '#2b2b33'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, 54); ctx.stroke();
        for (const [px, py, pr] of [[-24, -6, 8], [24, -6, 8], [-30, 24, 7], [30, 24, 7], [-13, 40, 6], [13, 40, 6]]) {
          PBU.kreis(ctx, px, py, pr, '#2b2b33');
        }
        PBU.kreis(ctx, -8, -42, 4, '#fff');
        PBU.kreis(ctx, 8, -42, 4, '#fff');
        // Fühler
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-8, -54); ctx.quadraticCurveTo(-14, -66, -20, -68); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(8, -54); ctx.quadraticCurveTo(14, -66, 20, -68); ctx.stroke();
      } },
      { name: 'Ein Haar', text: '10-mal dünner als der Käfer breit ist', mal(ctx) {
        ctx.strokeStyle = '#8a6d3b'; ctx.lineWidth = 26; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-90, 40); ctx.quadraticCurveTo(0, -50, 90, 20); ctx.stroke();
        ctx.strokeStyle = '#b99862'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(-88, 34); ctx.quadraticCurveTo(0, -54, 88, 14); ctx.stroke();
      } },
      { name: 'Eine Hautzelle', text: 'Dein Körper ist aus Milliarden Zellen gebaut', mal(ctx) {
        PBU.kreis(ctx, 0, 0, 80, 'rgba(126,211,33,0.35)');
        PBU.ring(ctx, 0, 0, 80, '#7ed321', 5);
        PBU.kreis(ctx, -15, -8, 26, '#4d9e12');
        PBU.kreis(ctx, 35, 30, 10, 'rgba(77,158,18,0.5)');
        PBU.kreis(ctx, -45, 38, 7, 'rgba(77,158,18,0.5)');
      } },
      { name: 'Eine Bakterie', text: 'Winzige Lebewesen – auf allem und überall!', mal(ctx) {
        ctx.save();
        ctx.rotate(0.25);
        ctx.fillStyle = '#69c95f';
        ctx.beginPath(); ctx.ellipse(0, 0, 58, 36, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#3f8a36'; ctx.lineWidth = 4; ctx.stroke();
        // Härchen ringsum
        ctx.lineWidth = 3; ctx.lineCap = 'round';
        for (let i = 0; i < 12; i++) {
          const w = i / 12 * Math.PI * 2;
          const wx = Math.cos(w) * 58, wy = Math.sin(w) * 36;
          ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx * 1.22, wy * 1.22); ctx.stroke();
        }
        PBU.kreis(ctx, -18, 4, 9, 'rgba(63,138,54,0.5)');
        PBU.kreis(ctx, 14, 10, 6, 'rgba(63,138,54,0.5)');
        // Kulleraugen
        PBU.kreis(ctx, 8, -12, 6, '#fff'); PBU.kreis(ctx, 9.5, -12, 3, '#3a3352');
        PBU.kreis(ctx, 26, -8, 6, '#fff'); PBU.kreis(ctx, 27.5, -8, 3, '#3a3352');
        ctx.restore();
      } },
      { name: 'Ein Wasser-Molekül', text: 'Drei Atome halten sich an den Händen', mal(ctx) {
        ctx.strokeStyle = '#8fa8c8'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(-55, -35); ctx.moveTo(0, 10); ctx.lineTo(55, -35); ctx.stroke();
        PBU.kreis(ctx, 0, 10, 46, '#e63946'); PBU.text(ctx, 'O', 0, 10, 30, '#fff');
        PBU.kreis(ctx, -55, -35, 28, '#dfe8f5'); PBU.text(ctx, 'H', -55, -35, 22, '#3a3352');
        PBU.kreis(ctx, 55, -35, 28, '#dfe8f5'); PBU.text(ctx, 'H', 55, -35, 22, '#3a3352');
      } },
      { name: 'Ein Atom', text: 'Der Legostein der Welt – und fast ganz leer!', mal(ctx, s2) {
        PBU.kreis(ctx, 0, 0, 95, 'rgba(66,165,245,0.15)');
        PBU.ring(ctx, 0, 0, 95, 'rgba(66,165,245,0.6)', 3);
        PBU.kreis(ctx, 0, 0, 8, '#e63946');
        for (let i = 0; i < 3; i++) {
          const w = s2.zeit * 2.2 + i * 2.1;
          PBU.kreis(ctx, Math.cos(w) * 95, Math.sin(w) * 95 * 0.5, 6, '#ffd166');
        }
      } },
      { name: 'Der Atomkern', text: '10.000-mal kleiner als das ganze Atom!', mal(ctx) {
        const pos = [[0, -22], [-20, 8], [20, 8], [0, 30], [-18, -14], [18, -14], [0, 4]];
        pos.forEach(([x, y], i) => {
          PBU.kreis(ctx, x * 2, y * 2, 26, i % 2 ? '#e63946' : '#42a5f5');
          PBU.kreis(ctx, x * 2 - 8, y * 2 - 8, 8, 'rgba(255,255,255,0.5)');
        });
      } },
      { name: 'Quarks', text: 'Die kleinsten Bausteine, die wir kennen. Noch kleiner? Das weiß NIEMAND!', mal(ctx, s2) {
        const w = s2.zeit * 3;
        [['#e63946', 0], ['#7ed321', 2.1], ['#42a5f5', 4.2]].forEach(([f, o]) => {
          const x = Math.cos(w + o) * 40, y = Math.sin(w + o) * 40;
          PBU.kreis(ctx, x, y, 22, f);
          PBU.emoji(ctx, '✨', x + 18, y - 18, 18);
        });
        PBU.text(ctx, '?', 0, 0, 34, '#fff');
      } }
    ];
  },
  malen(ctx, s, p) {
    // Hintergrund wird mit der Tiefe dunkler und "quantiger"
    const tiefe = p.zoom / 8;
    const g = ctx.createLinearGradient(0, 0, 0, s.h);
    g.addColorStop(0, `rgb(${Math.round(190 - tiefe * 170)}, ${Math.round(230 - tiefe * 200)}, ${Math.round(255 - tiefe * 190)})`);
    g.addColorStop(1, `rgb(${Math.round(230 - tiefe * 195)}, ${Math.round(250 - tiefe * 210)}, ${Math.round(255 - tiefe * 185)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s.w, s.h);
    const z = Math.round(p.zoom * 100) / 100; // gegen Fließkomma-Springen am Stufenrand
    const i = Math.min(7, Math.floor(z));
    const f = PBU.klemme(z - i, 0, 1);
    const cx = 400, cy = 235;
    // aktuelle Stufe: wächst und verblasst (früh ausblenden = ruhiger Übergang)
    const raus = PBU.klemme(1 - f * 1.5, 0, 1);
    if (raus > 0.01) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + f * 6, 1 + f * 6);
      ctx.globalAlpha = raus * raus;
      s.stufen[i].mal(ctx, s);
      ctx.restore();
    }
    // nächste Stufe: taucht sanft (smoothstep) auf
    if (f > 0.02 && i + 1 <= 8) {
      const ein = f * f * (3 - 2 * f);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(Math.max(0.06, ein), Math.max(0.06, ein));
      ctx.globalAlpha = ein;
      s.stufen[i + 1].mal(ctx, s);
      ctx.restore();
    }
    const aktiv = f > 0.5 ? i + 1 : i;
    const st = s.stufen[aktiv];
    PBU.text(ctx, `Stufe ${aktiv + 1} von 9: ${st.name}`, s.w / 2, 45, 26, tiefe > 0.4 ? '#fff' : '#3a3352');
    PBU.text(ctx, st.text, s.w / 2, 465, 19, tiefe > 0.4 ? 'rgba(255,255,255,0.85)' : '#6b6489');
    // Zoom-Leiste
    PBU.kasten(ctx, 30, 100, 14, 300, 'rgba(128,128,140,0.3)', 7);
    PBU.kasten(ctx, 30, 100, 14, 300 * (p.zoom / 8) + 4, '#0f9b8e', 7);
    PBU.emoji(ctx, '🔬', 37, 80, 26);
  }
});

/* --- 2. Atome: Die Legosteine --- */
Baukasten.demo('grund', {
  id: 'atomlego',
  name: 'Die Lego-Steine der Natur',
  emoji: '🧱',
  frage: 'Wie baut die Natur aus 100 Bausteinen Millionen verschiedene Dinge?',
  erklaerung: `Es gibt nur rund <b>100 Sorten</b> von Atomen – aber wie mit Legosteinen kann
    man sie <b>endlos kombinieren</b>! Zwei Wasserstoff + ein Sauerstoff = Wasser.
    Natrium + Chlor (zwei gefährliche Stoffe!) = harmloses Speisesalz.
    Wähle ein Rezept und drück auf „Zusammenbauen“!`,
  wow: `Wasser, Zucker, Luft, dein ganzer Körper – alles nur <b>verschiedene Anordnungen</b>
    derselben Bausteine. Und die Atome in dir sind uralt: geboren im Inneren
    <b>explodierender Sterne</b>. Du bist echter Sternenstaub!`,
  params: [
    { key: 'rezept', label: 'Rezept wählen', min: 0, max: 3, step: 1, start: 0,
      format: v => ['💧 Wasser', '🧂 Speisesalz', '🥤 Sprudel-Gas', '🎈 Ballon-Gas'][Math.round(v)] }
  ],
  neustartBei: ['rezept'],
  knoepfe: [
    { label: '🔧 Zusammenbauen!', tue: (s) => {
        if (s.phase === 0) { s.phase = 1; Baukasten.ton(330, 0.15, 'triangle', 0.1); }
      } }
  ],
  init(s, p) {
    const rezepte = [
      { name: 'Wasser', emoji: '💧', satz: '2 × Wasserstoff + 1 × Sauerstoff = WASSER!',
        atome: [
          { sym: 'H', farbe: '#dfe8f5', tf: '#3a3352', r: 26, start: [120, 140], ziel: [-52, -34] },
          { sym: 'H', farbe: '#dfe8f5', tf: '#3a3352', r: 26, start: [120, 360], ziel: [52, -34] },
          { sym: 'O', farbe: '#e63946', tf: '#fff', r: 42, start: [680, 250], ziel: [0, 10] }
        ] },
      { name: 'Speisesalz', emoji: '🧂', satz: 'Natrium + Chlor = SALZ für die Suppe!',
        atome: [
          { sym: 'Na', farbe: '#ff8c42', tf: '#fff', r: 38, start: [120, 250], ziel: [-40, 0] },
          { sym: 'Cl', farbe: '#7ed321', tf: '#fff', r: 40, start: [680, 250], ziel: [42, 0] }
        ] },
      { name: 'Sprudel-Gas', emoji: '🥤', satz: '1 × Kohlenstoff + 2 × Sauerstoff = das Kribbeln in der Limo!',
        atome: [
          { sym: 'O', farbe: '#e63946', tf: '#fff', r: 38, start: [120, 250], ziel: [-75, 0] },
          { sym: 'C', farbe: '#4a4a58', tf: '#fff', r: 36, start: [400, 100], ziel: [0, 0] },
          { sym: 'O', farbe: '#e63946', tf: '#fff', r: 38, start: [680, 250], ziel: [75, 0] }
        ] },
      { name: 'Ballon-Gas', emoji: '🎈', satz: 'Helium bleibt für sich – der Einzelgänger unter den Atomen!',
        atome: [
          { sym: 'He', farbe: '#b565d8', tf: '#fff', r: 34, start: [400, 250], ziel: [0, 0] }
        ] }
    ];
    s.r = rezepte[Math.round(p.rezept)];
    s.atome = s.r.atome.map(a => ({ ...a, x: a.start[0], y: a.start[1] }));
    s.phase = 0; // 0 = Zutaten, 1 = fliegen, 2 = fertig
    s.fertigZeit = 0;
  },
  schritt(s, p, dt) {
    PBU.konfettiSchritt(s, dt);
    if (s.phase === 1) {
      let alleDa = true;
      for (const a of s.atome) {
        const zx = 400 + a.ziel[0], zy = 250 + a.ziel[1];
        a.x += (zx - a.x) * 3.5 * dt * 2;
        a.y += (zy - a.y) * 3.5 * dt * 2;
        if (Math.hypot(zx - a.x, zy - a.y) > 4) alleDa = false;
      }
      if (alleDa) {
        s.phase = 2;
        PBU.konfettiStart(s, 400, 250, 40);
        Baukasten.ton(523, 0.12, 'triangle'); setTimeout(() => Baukasten.ton(784, 0.3, 'triangle'), 120);
      }
    }
    if (s.phase === 2) s.fertigZeit += dt;
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#e0f7f4', '#f4fdfc');
    // Regal mit den ~100 Bausteinen andeuten
    for (let i = 0; i < 14; i++) {
      ctx.save(); ctx.globalAlpha = 0.25;
      PBU.kreis(ctx, 60 + i * 52, 458, 14, ['#e63946', '#42a5f5', '#7ed321', '#ff8c42', '#b565d8'][i % 5]);
      ctx.restore();
    }
    PBU.text(ctx, '… nur rund 100 Sorten gibt es – für ALLES auf der Welt!', s.w / 2, 430, 15, '#6b6489');
    // Verbindungs-Linien wenn fertig
    if (s.phase === 2 && s.atome.length > 1) {
      ctx.strokeStyle = '#8fa8c8'; ctx.lineWidth = 7;
      for (let i = 1; i < s.atome.length; i++) {
        ctx.beginPath();
        ctx.moveTo(s.atome[0].x, s.atome[0].y);
        ctx.lineTo(s.atome[i].x, s.atome[i].y);
        ctx.stroke();
      }
    }
    // Atome
    for (const a of s.atome) {
      const wobbel = s.phase === 2 ? Math.sin(s.zeit * 5 + a.x) * 2 : 0;
      PBU.kreis(ctx, a.x, a.y + wobbel, a.r, a.farbe);
      PBU.kreis(ctx, a.x - a.r * 0.3, a.y + wobbel - a.r * 0.3, a.r * 0.22, 'rgba(255,255,255,0.55)');
      PBU.text(ctx, a.sym, a.x, a.y + wobbel, a.r * 0.75, a.tf);
    }
    PBU.konfettiMalen(ctx, s);
    if (s.phase === 0) PBU.text(ctx, 'Die Zutaten liegen bereit …', s.w / 2, 55, 22, '#3a3352');
    if (s.phase === 2) {
      PBU.emoji(ctx, s.r.emoji, 400, 130 + Math.sin(s.fertigZeit * 3) * 6, 60);
      PBU.text(ctx, s.r.satz, s.w / 2, 55, 21, '#0f9b8e');
    }
  }
});

/* --- 3. Atome sind fast leer --- */
Baukasten.demo('grund', {
  id: 'leere',
  name: 'Das große Nichts im Atom',
  emoji: '🕳️',
  frage: 'Was ist WIRKLICH in einem Atom drin? (Fahre mit der Lupe darüber!)',
  erklaerung: `Ein Atom ist wie ein <b>Fußballstadion</b>: Die Hülle ist riesig,
    aber der Kern in der Mitte ist nur so groß wie eine <b>Erbse auf dem Anstoßpunkt</b>!
    Dazwischen? <b>NICHTS.</b> Gähnende Leere.
    Fahre mit der Lupe über das Atom und such den winzigen Kern!`,
  wow: `Auch DU bist fast nur leerer Raum! Würde man alle Leere aus den Menschen
    herauspressen, würde die <b>ganze Menschheit in einen Zuckerwürfel</b> passen.`,
  params: [
    { key: 'lupe', label: 'Lupen-Stärke', min: 1, max: 4, step: 0.05, start: 2,
      format: v => '🔍'.repeat(Math.round(v)) }
  ],
  init(s) { s.lx = 250; s.ly = 250; },
  zeiger(s, p, typ, x, y) { s.lx = x; s.ly = y; },
  malen(ctx, s, p) {
    ctx.fillStyle = '#10132e';
    ctx.fillRect(0, 0, s.w, s.h);
    const ax = 400, ay = 250, ar = 190;
    // Elektronen-Hülle als Wolke
    const g = ctx.createRadialGradient(ax, ay, 20, ax, ay, ar);
    g.addColorStop(0, 'rgba(66,165,245,0.05)');
    g.addColorStop(0.85, 'rgba(66,165,245,0.16)');
    g.addColorStop(1, 'rgba(66,165,245,0.02)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.fill();
    PBU.ring(ctx, ax, ay, ar, 'rgba(66,165,245,0.5)', 2);
    // flitzende Elektronen am Rand
    for (let i = 0; i < 3; i++) {
      const w = s.zeit * (1.5 + i * 0.4) + i * 2.1;
      PBU.kreis(ctx, ax + Math.cos(w) * ar, ay + Math.sin(w) * ar, 5, '#ffd166');
    }
    // Lupe
    const lr = 85;
    ctx.save();
    ctx.beginPath(); ctx.arc(s.lx, s.ly, lr, 0, Math.PI * 2); ctx.clip();
    // Innenansicht: vergrößerter Blick auf die Stelle unter der Lupe
    ctx.fillStyle = '#181c42';
    ctx.fillRect(s.lx - lr, s.ly - lr, lr * 2, lr * 2);
    const abst = Math.hypot(s.lx - ax, s.ly - ay);
    const kernSicht = 3 + p.lupe * 5; // wie groß der Kern in der Lupe erscheint
    if (abst < 30 * (5 - p.lupe) / 4 + 18) {
      // Kern gefunden!
      const kx = s.lx + (ax - s.lx) * 0.4, ky = s.ly + (ay - s.ly) * 0.4;
      [[0, -1], [-1, 0.6], [1, 0.6], [0, 0.1]].forEach(([ox, oy], i) => {
        const px2 = kx + ox * kernSicht * 0.8, py2 = ky + oy * kernSicht * 0.8;
        PBU.kreis(ctx, px2, py2, kernSicht, i % 2 ? '#ff4d5e' : '#57b1ff');
        ctx.strokeStyle = '#05060f'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(px2, py2, kernSicht, 0, Math.PI * 2); ctx.stroke();
      });
      PBU.text(ctx, 'DER KERN!', s.lx, s.ly + 55, 18, '#ffd166');
    } else if ((() => {
      // Saust gerade ein Elektron durch die Lupe?
      for (let ei = 0; ei < 3; ei++) {
        const w = s.zeit * (1.5 + ei * 0.4) + ei * 2.1;
        const exx = ax + Math.cos(w) * ar, eyy = ay + Math.sin(w) * ar;
        if (Math.hypot(s.lx - exx, s.ly - eyy) < 60) {
          const px2 = s.lx + (exx - s.lx) * 0.4, py2 = s.ly + (eyy - s.ly) * 0.4;
          const er2 = 4 + p.lupe * 4;
          PBU.kreis(ctx, px2, py2, er2, '#ffd166');
          ctx.strokeStyle = '#05060f'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(px2, py2, er2, 0, Math.PI * 2); ctx.stroke();
          PBU.text(ctx, 'Ein Elektron!', s.lx, s.ly + 38, 14, '#ffd166');
          return true;
        }
      }
      return false;
    })()) {
      // Elektron gezeichnet
    } else if (abst < ar + 40) {
      // nur Leere
      ctx.save(); ctx.globalAlpha = 0.35 + Math.sin(s.zeit * 4) * 0.1;
      PBU.text(ctx, 'nichts …', s.lx, s.ly, 20, '#5b6296');
      ctx.restore();
    } else {
      PBU.text(ctx, 'außerhalb', s.lx, s.ly, 15, '#5b6296');
    }
    ctx.restore();
    // Lupenrand + Griff
    PBU.ring(ctx, s.lx, s.ly, lr, '#d9a441', 8);
    ctx.strokeStyle = '#a97a2a'; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s.lx + lr * 0.72, s.ly + lr * 0.72);
    ctx.lineTo(s.lx + lr * 1.45, s.ly + lr * 1.45);
    ctx.stroke();
    PBU.text(ctx, 'Ein Atom, stark vergrößert', s.w / 2, 35, 22, '#fff');
    PBU.text(ctx, 'Hülle = Stadion 🏟️ … Kern = Erbse 🟢 in der Mitte!', s.w / 2, 470, 17, 'rgba(255,255,255,0.75)');
  }
});

/* --- 4. Die vier Urkräfte --- */
Baukasten.demo('grund', {
  id: 'urkraefte',
  name: 'Die 4 Zauberkräfte der Natur',
  emoji: '🧙',
  frage: 'Nur VIER Kräfte steuern alles im Universum. Was passiert, wenn du eine abschaltest?',
  erklaerung: `Das ganze Universum wird von nur <b>vier Grundkräften</b> zusammengehalten:
    <b>Schwerkraft</b> (zieht alles zu allem), <b>Elektro-Kraft</b> (hält Stoffe zusammen und macht Licht),
    die <b>starke Kraft</b> (klebt Atomkerne) und die <b>schwache Kraft</b> (lässt die Sonne brennen).
    Schalte sie testweise ab – und sieh zu, was mit der Welt passiert!`,
  wow: `Alle anderen „Kräfte“, die du kennst – Muskelkraft, Windkraft, Klebekraft, Federkraft –
    sind in Wahrheit <b>verkleidete Elektro-Kraft</b> zwischen Atomen. Nur vier Ur-Kräfte. Mehr braucht das Universum nicht!`,
  knoepfe: [
    { label: '🌍 Schwerkraft an/aus', tue: (s) => { s.schwer = !s.schwer; Baukasten.ton(s.schwer ? 500 : 200, 0.15, 'triangle', 0.1); } },
    { label: '🧲 Elektro-Kraft an/aus', tue: (s) => { s.elektro = !s.elektro; Baukasten.ton(s.elektro ? 550 : 220, 0.15, 'triangle', 0.1); } },
    { label: '💪 Starke Kraft an/aus', tue: (s) => { s.stark = !s.stark; Baukasten.ton(s.stark ? 600 : 240, 0.15, 'triangle', 0.1); } },
    { label: '☀️ Schwache Kraft an/aus', tue: (s) => { s.schwach = !s.schwach; Baukasten.ton(s.schwach ? 650 : 260, 0.15, 'triangle', 0.1); } }
  ],
  init(s) {
    s.schwer = true; s.elektro = true; s.stark = true; s.schwach = true;
    s.dinge = [
      { typ: 'haus', x: 180, gr: 66, hub: 0 },
      { typ: 'baum', x: 300, gr: 80, hub: 0 },
      { typ: 'kind', x: 420, gr: 52, hub: 0 },
      { typ: 'ball', x: 500, gr: 30, hub: 0 },
      { typ: 'hund', x: 580, gr: 42, hub: 0 }
    ];
    // Zerfalls-Punkte für den Elektro-Effekt
    for (const d of s.dinge) {
      d.punkte = [];
      for (let i = 0; i < 14; i++) {
        d.punkte.push({ ox: (Math.random() - 0.5) * d.gr, oy: (Math.random() - 0.5) * d.gr, wx: (Math.random() - 0.5) * 130, wy: (Math.random() - 0.5) * 130 });
      }
      d.zerfall = 0;
    }
    s.kernTeile = [];
    for (let i = 0; i < 6; i++) s.kernTeile.push({ w: i * 1.05, r: 0 });
    s.sonnenGlut = 1;
  },
  schritt(s, p, dt) {
    for (const d of s.dinge) {
      // Schwerkraft aus -> alles schwebt davon
      if (!s.schwer) d.hub = Math.min(d.hub + (30 + d.gr) * dt, 500);
      else d.hub = Math.max(0, d.hub - 300 * dt);
      // Elektro aus ODER starke Kraft aus -> Dinge zerbröseln
      // (ohne starke Kraft zerplatzen ja die Atomkerne selbst!)
      if (!s.elektro || !s.stark) d.zerfall = Math.min(1, d.zerfall + 1.2 * dt);
      else d.zerfall = Math.max(0, d.zerfall - 2 * dt);
    }
    // Starke Kraft aus -> Kern zerplatzt
    for (const k of s.kernTeile) {
      if (!s.stark) k.r = Math.min(k.r + 140 * dt, 120);
      else k.r = Math.max(0, k.r - 300 * dt);
    }
    // Schwache Kraft aus -> Sonne erlischt langsam
    if (!s.schwach) s.sonnenGlut = Math.max(0, s.sonnenGlut - 0.5 * dt);
    else s.sonnenGlut = Math.min(1, s.sonnenGlut + 0.8 * dt);
  },
  malen(ctx, s, p) {
    // Himmel: dunkler ohne Sonne / ohne Elektro (kein Licht!)
    const hell = Math.min(s.sonnenGlut, s.elektro ? 1 : 0.35);
    const g = ctx.createLinearGradient(0, 0, 0, s.h);
    g.addColorStop(0, `rgb(${Math.round(30 + hell * 159)}, ${Math.round(35 + hell * 196)}, ${Math.round(60 + hell * 195)})`);
    g.addColorStop(1, `rgb(${Math.round(40 + hell * 194)}, ${Math.round(45 + hell * 204)}, ${Math.round(70 + hell * 185)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s.w, s.h);
    // Sonne
    ctx.save();
    ctx.globalAlpha = 0.25 + s.sonnenGlut * 0.75;
    const sonnenFarbe = s.sonnenGlut > 0.5 ? '#ffd54f' : '#8d8d99';
    PBU.kreis(ctx, 690, 80, 38 + s.sonnenGlut * 8, sonnenFarbe);
    if (s.sonnenGlut > 0.5) {
      for (let i = 0; i < 8; i++) {
        const w = i * Math.PI / 4 + s.zeit * 0.5;
        ctx.strokeStyle = sonnenFarbe; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(690 + Math.cos(w) * 54, 80 + Math.sin(w) * 54);
        ctx.lineTo(690 + Math.cos(w) * 68, 80 + Math.sin(w) * 68);
        ctx.stroke();
      }
    }
    ctx.restore();
    PBU.boden(ctx, s.w, s.h, 85, hell > 0.5 ? '#8bc34a' : '#3e5a2e');
    // Dinge (kräftig gezeichnet)
    for (const d of s.dinge) {
      const by = 412 - d.hub; // Boden-Linie des Objekts
      if (d.zerfall < 0.05) {
        ctx.save();
        if (d.hub > 1) ctx.translate(0, Math.sin(s.zeit * 2 + d.x) * 6);
        if (d.typ === 'haus') PBU.malHaus(ctx, d.x, by, 62);
        else if (d.typ === 'baum') PBU.malBaum(ctx, d.x, by, 85);
        else if (d.typ === 'kind') PBU.malKind(ctx, d.x, by, 52);
        else if (d.typ === 'ball') PBU.malBall(ctx, d.x, by - 14, 14, 1);
        else PBU.malHund(ctx, d.x, by, 42);
        ctx.restore();
      } else {
        // zerbröselt in Atome
        const cy = by - d.gr * 0.55;
        for (const pt of d.punkte) {
          ctx.save();
          ctx.globalAlpha = 1 - d.zerfall * 0.4;
          PBU.kreis(ctx, d.x + pt.ox + pt.wx * d.zerfall, cy + pt.oy + pt.wy * d.zerfall, 5,
            !s.stark ? '#ff6b5e' : '#b565d8');
          ctx.restore();
        }
      }
    }
    // Atomkern-Fenster links oben
    PBU.kasten(ctx, 25, 25, 165, 150, 'rgba(0,0,0,0.35)', 14);
    PBU.text(ctx, 'Im Atomkern:', 107, 47, 14, '#fff');
    const kx = 107, ky = 110;
    const kernPos = [[0, -14], [-13, 7], [13, 7], [0, 0], [-8, -5], [8, -5]];
    s.kernTeile.forEach((k, i) => {
      const [ox, oy] = kernPos[i];
      const x = kx + ox + Math.cos(k.w) * k.r;
      const y = ky + oy + Math.sin(k.w) * k.r * 0.6;
      PBU.kreis(ctx, x, y, 9, i % 2 ? '#e63946' : '#42a5f5');
    });
    if (!s.stark) PBU.emoji(ctx, '💥', kx, ky, 30 + Math.sin(s.zeit * 10) * 4);
    // Status-Lampen
    const lampen = [
      ['🌍', s.schwer], ['🧲', s.elektro], ['💪', s.stark], ['☀️', s.schwach]
    ];
    lampen.forEach(([e, an], i) => {
      const x = 280 + i * 70;
      PBU.kreis(ctx, x, 45, 24, an ? 'rgba(126,211,33,0.9)' : 'rgba(230,57,70,0.9)');
      PBU.emoji(ctx, e, x, 45, 26);
      PBU.text(ctx, an ? 'AN' : 'AUS', x, 78, 13, '#fff');
    });
    // Kommentar
    let text = 'Alle vier Kräfte laufen – die Welt ist in Ordnung! ✅';
    if (!s.schwer) text = '🌍 AUS: Ohne Schwerkraft schwebt einfach ALLES davon!';
    if (!s.elektro) text = '🧲 AUS: Ohne Elektro-Kraft zerbröseln alle Stoffe – und es gibt kein Licht!';
    if (!s.stark) text = '💪 AUS: Ohne starke Kraft zerplatzt jeder Atomkern – und ALLES zerfällt!';
    if (!s.schwach) text = '☀️ AUS: Ohne schwache Kraft erlischt langsam die Sonne …';
    if (!s.schwer && !s.elektro) text = '😱 Totales Chaos! Gut, dass das nur ein Test ist …';
    PBU.text(ctx, text, s.w / 2, 465, 18, '#fff');
  }
});

/* --- 5. Energie: Der Umzieh-Trick --- */
Baukasten.demo('grund', {
  id: 'energie',
  name: 'Energie kann nicht verschwinden',
  emoji: '♻️',
  frage: 'Wohin geht der Schwung, wenn die Kugel liegen bleibt?',
  erklaerung: `Das vielleicht wichtigste Gesetz der ganzen Physik: Energie kann <b>niemals
    verschwinden</b> – sie zieht nur um! Oben auf der Rampe steckt sie als <b>Höhen-Energie</b>
    in der Kugel. Beim Runterrollen wird sie zu <b>Schwung</b>. Und die Reibung verwandelt
    sie Stück für Stück in <b>Wärme</b>. Schau auf den Balken: Zusammen bleibt es IMMER gleich viel!`,
  wow: `Reib deine Hände ganz schnell aneinander – warm, oder? Du hast gerade
    Bewegungs-Energie in Wärme <b>umziehen lassen</b>. Kein bisschen ging verloren!`,
  params: [
    { key: 'reibung', label: 'Bahn-Belag', min: 0.02, max: 1, step: 0.01, start: 0.25,
      format: v => v < 0.2 ? '⛸️ Spiegelglatt' : v < 0.6 ? '🎢 Normale Bahn' : '🟫 Sandpapier' },
    { key: 'start', label: 'Start-Höhe', min: 0.3, max: 1, step: 0.01, start: 0.9,
      format: v => v < 0.55 ? '✋ Halbe Höhe' : v < 0.85 ? '🙋 Hoch' : '🏔️ Ganz oben' }
  ],
  neustartBei: ['start'],
  knoepfe: [
    { label: '✋ Loslassen!', tue: (s, p) => {
        s.x = 400 - 120 - p.start * 210;
        s.v = 0; s.heiss = 0; s.delle = 0; s.laeuft = true;
        s.delleL = false; s.delleR = false;
        s.total = 500 * s.hoeheBei(s.x);
      } }
  ],
  init(s, p) {
    // Ein echtes TAL: Mitte unten, Ränder oben
    s.bahnY = x => 415 - 240 * (1 - Math.exp(-Math.pow((x - 400) / 210, 2)));
    s.hoeheBei = x => (415 - s.bahnY(x)) / 240; // 0 = Talsohle, ~1 = ganz oben
    s.x = 400 - 120 - p.start * 210;
    s.v = 0; s.heiss = 0; s.delle = 0; s.laeuft = false;
    s.delleL = false; s.delleR = false;
    s.total = 500 * s.hoeheBei(s.x);
    s.funken = [];
  },
  schritt(s, p, dt) {
    if (!s.laeuft) return;
    const steig = (s.bahnY(s.x + 2) - s.bahnY(s.x - 2)) / 4;
    const a = steig * 620 - p.reibung * 1.1 * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
    if (s.x < 72) { s.x = 72; s.v = Math.abs(s.v) * 0.4; }
    // Brett auf halber Höhe der Gegenflanke: nur mit viel Start-Höhe
    // erreichbar – und dann steckt der Schwung als DELLE im Holz!
    if (s.x > 652) {
      s.x = 652;
      if (s.v > 40) {
        const kin = s.v * s.v / 595;
        s.delle += kin * 0.85;
        s.delleR = true;
        Baukasten.ton(85, 0.25, 'square', 0.16);
      }
      s.v = -Math.abs(s.v) * 0.25;
    }
    // Reibungs-Funken
    if (p.reibung > 0.3 && Math.abs(s.v) > 80 && Math.random() < 0.4) {
      s.funken.push({ x: s.x, y: s.bahnY(s.x) + 14, leben: 0.4 });
    }
    for (const f of s.funken) f.leben -= dt;
    s.funken = s.funken.filter(f => f.leben > 0);
    if (Math.abs(s.v) < 6 && s.hoeheBei(s.x) < 0.03) {
      s.laeuft = false;
      s.v = 0;
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#e8f8ee', '#f8fdf9');
    // Bahn
    ctx.beginPath();
    ctx.moveTo(40, s.h);
    for (let x = 40; x <= 760; x += 8) ctx.lineTo(x, s.bahnY(x) + 16);
    ctx.lineTo(760, s.h);
    ctx.closePath();
    ctx.fillStyle = p.reibung < 0.2 ? '#cfeffd' : p.reibung < 0.6 ? '#c5b3e6' : '#d2a679';
    ctx.fill();
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 40; x <= 760; x += 8) {
      const y = s.bahnY(x) + 16;
      x === 40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Funken
    for (const f of s.funken) {
      ctx.save(); ctx.globalAlpha = f.leben / 0.4;
      PBU.emoji(ctx, '✨', f.x + (Math.random() - 0.5) * 8, f.y, 14);
      ctx.restore();
    }
    // Kugel
    const y = s.bahnY(s.x);
    PBU.kreis(ctx, s.x, y - 2, 18, '#e63946');
    PBU.kreis(ctx, s.x - 6, y - 8, 5, 'rgba(255,255,255,0.6)');
    // Das Brett an der Gegenflanke (verformt sich beim Aufprall)
    ctx.save();
    ctx.translate(660, s.bahnY(660) + 14);
    if (s.delleR) ctx.rotate(0.24);
    PBU.kasten(ctx, -7, -88, 14, 92, s.delleR ? '#6e4522' : '#8a5a2b', 4);
    ctx.strokeStyle = '#4a2f14'; ctx.lineWidth = 2;
    ctx.strokeRect(-7, -88, 14, 92);
    if (s.delleR) {
      ctx.beginPath();
      ctx.moveTo(-7, -42); ctx.lineTo(-1, -34); ctx.lineTo(-6, -25);
      ctx.stroke();
    }
    ctx.restore();
    // Energie-Balken (immer gleich hoch!). Schwung kommt DIREKT aus dem
    // echten Tempo – so passt der Balken immer zum sichtbaren Rollen.
    const total = Math.max(s.total, 1);
    const ePot = PBU.klemme(500 * s.hoeheBei(s.x), 0, total);
    const eDelle = PBU.klemme(s.delle, 0, total);
    const eKin = PBU.klemme(s.v * s.v / 595, 0, Math.max(0, total - ePot - eDelle));
    const eHeiss = PBU.klemme(total - ePot - eDelle - eKin, 0, total);
    const bx = 676, bTop = 60, bH = 240, bW = 50;
    let yCur = bTop + bH;
    const teile = [
      [ePot, '#7ed321', '🏔️'], [eKin, '#42a5f5', '💨'], [eHeiss, '#e63946', '🔥'], [eDelle, '#8a93a5', '🔨']
    ];
    for (const [wert, farbe, e] of teile) {
      const h = bH * wert / total;
      if (h > 1) {
        PBU.kasten(ctx, bx, yCur - h, bW, h, farbe, 4);
        if (h > 26) PBU.emoji(ctx, e, bx + bW / 2, yCur - h / 2, 20);
      }
      yCur -= h;
    }
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 3;
    ctx.strokeRect(bx, bTop, bW, bH);
    PBU.text(ctx, 'Energie', bx + bW / 2, bTop - 18, 15, '#3a3352');
    PBU.text(ctx, 'immer voll!', bx + bW / 2, bTop + bH + 20, 13, '#6b6489');
    // Legende
    PBU.text(ctx, '🏔️ Höhe   💨 Schwung   🔥 Wärme   🔨 Delle', 300, 60, 19, '#3a3352');
    if (s.delle > total * 0.1) {
      PBU.text(ctx, 'KNACK! Die Energie steckt jetzt als Delle im Brett!', 320, 95, 18, '#8a93a5');
    } else if (!s.laeuft && eHeiss > total * 0.85) {
      PBU.text(ctx, 'Alles ist zu Wärme umgezogen – nichts ging verloren!', 340, 95, 18, '#e63946');
    }
  }
});

/* --- 6. Der Quanten-Würfel --- */
Baukasten.demo('grund', {
  id: 'quanten',
  name: 'Die Natur würfelt',
  emoji: '🎲',
  frage: 'Wo landet das nächste Lichtteilchen? Das weiß NIEMAND im Universum!',
  erklaerung: `Ganz tief drinnen, bei den allerkleinsten Teilchen, wird die Welt <b>zufällig</b>:
    Wo genau das nächste Lichtteilchen landet, kann <b>niemand</b> vorhersagen – nicht mal
    der klügste Professor! Aber das Verrückte: Nach tausenden Teilchen entsteht <b>immer
    dasselbe Streifen-Muster</b>. Einzeln: Zufall. Zusammen: Ordnung! Öffne mal den zweiten Spalt …`,
  wow: `Jedes einzelne Lichtteilchen fliegt dabei irgendwie durch <b>beide Spalte gleichzeitig</b>
    – als Welle! Das versteht bis heute niemand so richtig. Physiker sagen: „Gewöhn dich dran!“`,
  params: [
    { key: 'spalte', label: 'Spalte in der Wand', min: 1, max: 2, step: 1, start: 2,
      format: v => Math.round(v) === 1 ? '1 Spalt' : '2 Spalte' },
    { key: 'tempo', label: 'Teilchen-Strom', min: 3, max: 120, step: 1, start: 30,
      format: v => v < 20 ? '💧 Tröpfelnd' : v < 70 ? '🚿 Fließend' : '🌊 Volle Kanne' }
  ],
  neustartBei: ['spalte'],
  init(s) {
    s.punkte = []; s.rest = 0; s.flieger = [];
    s.bins = new Array(30).fill(0);
  },
  schritt(s, p, dt) {
    s.rest += p.tempo * dt;
    const zwei = Math.round(p.spalte) === 2;
    while (s.rest >= 1) {
      s.rest -= 1;
      // Landeposition auswürfeln (Rejection Sampling)
      let y = 250;
      for (let t = 0; t < 60; t++) {
        const k = (Math.random() * 2 - 1) * 200; // relativ zur Mitte
        const wahrscheinlich = zwei
          ? Math.pow(Math.cos(k * 0.045), 2) * Math.exp(-(k * k) / (2 * 95 * 95))
          : Math.exp(-(k * k) / (2 * 60 * 60));
        if (Math.random() < wahrscheinlich) { y = 250 + k; break; }
      }
      if (s.punkte.length < 3500) s.punkte.push({ x: 660 + Math.random() * 55, y });
      const bin = PBU.klemme(Math.floor((y - 50) / 400 * 30), 0, 29);
      s.bins[bin]++;
      if (s.flieger.length < 14) s.flieger.push({ t: 0, zielY: y, spalt: zwei ? (Math.random() < 0.5 ? 200 : 300) : 250 });
    }
    for (const f of s.flieger) f.t += dt * 3;
    s.flieger = s.flieger.filter(f => f.t < 1);
  },
  malen(ctx, s, p) {
    ctx.fillStyle = '#141233';
    ctx.fillRect(0, 0, s.w, s.h);
    const zwei = Math.round(p.spalte) === 2;
    // Lampe
    PBU.malTaschenlampe(ctx, 70, 250, 58);
    // Wand mit Spalten
    ctx.fillStyle = '#4a4a68';
    if (zwei) {
      ctx.fillRect(330, 40, 26, 140);   // oben
      ctx.fillRect(330, 220, 26, 60);   // Mitte
      ctx.fillRect(330, 320, 26, 140);  // unten
    } else {
      ctx.fillRect(330, 40, 26, 190);
      ctx.fillRect(330, 270, 26, 190);
    }
    // Schirm rechts
    ctx.fillStyle = '#22203f';
    ctx.fillRect(650, 40, 75, 420);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
    ctx.strokeRect(650, 40, 75, 420);
    // Histogramm hinter dem Schirm
    for (let i = 0; i < 30; i++) {
      const max = Math.max(...s.bins, 8);
      const w = s.bins[i] / max * 55;
      ctx.fillStyle = 'rgba(255,209,102,0.35)';
      ctx.fillRect(728, 52 + i * 400 / 30, w, 400 / 30 - 2);
    }
    // gelandete Teilchen
    ctx.fillStyle = '#ffd166';
    for (const pt of s.punkte) ctx.fillRect(pt.x, pt.y, 2.5, 2.5);
    // fliegende Teilchen
    for (const f of s.flieger) {
      let x, y;
      if (f.t < 0.45) { // Lampe -> Spalt
        const u = f.t / 0.45;
        x = 100 + (343 - 100) * u;
        y = 250 + (f.spalt - 250) * u;
      } else { // Spalt -> Schirm
        const u = (f.t - 0.45) / 0.55;
        x = 343 + (660 - 343) * u;
        y = f.spalt + (f.zielY - f.spalt) * u;
      }
      ctx.save();
      ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 10;
      PBU.kreis(ctx, x, y, 4, '#fff3b0');
      ctx.restore();
    }
    PBU.text(ctx, `Schon gelandet: ${s.punkte.length} Teilchen`, 240, 470, 16, 'rgba(255,255,255,0.7)', 'left');
    PBU.text(ctx, zwei ? 'Streifen! Obwohl jedes Teilchen zufällig fliegt!' : 'Ein Fleck – öffne mal den zweiten Spalt!',
      s.w / 2, 25, 20, '#fff');
  }
});

/* --- 7. Newtons Kanone: ein Gesetz für Apfel UND Mond --- */
function malApfel(ctx, x, y, r) {
  ctx.save();
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
  g.addColorStop(0, '#ff7a6e');
  g.addColorStop(1, '#c1272d');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#5c3317'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x + 2, y - r - 5, x + 4, y - r - 7); ctx.stroke();
  ctx.fillStyle = '#5fae3d';
  ctx.beginPath(); ctx.ellipse(x + 7, y - r - 4, 4.5, 2.4, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
Baukasten.demo('grund', {
  id: 'orbit',
  name: 'Vom Apfel zur Mondbahn',
  emoji: '🛰️',
  frage: 'Wirf schnell genug – und dein Apfel fällt IMMER um die Erde herum!',
  erklaerung: `Warum fällt der Mond nicht runter? <b>Er fällt doch!</b> Aber er ist so schnell
    unterwegs, dass er beim Fallen immer <b>an der Erde vorbei</b> saust – für immer im Kreis.
    Genau <b>dasselbe Gesetz</b> lässt den Apfel vom Baum plumpsen und hält den Mond am Himmel.
    Probier es: Wirf zu langsam → plumps. Wirf richtig → Umlaufbahn!`,
  wow: `Die Astronauten in der Raumstation schweben nicht, weil dort keine Schwerkraft wäre –
    sie <b>fallen pausenlos um die Erde herum</b>, mit 28.000 km/h. Dauerfall = Schweben!`,
  params: [
    { key: 'tempo', label: 'Abwurf-Tempo', min: 60, max: 280, step: 2, start: 140,
      format: v => v < 115 ? '🤾 Werfen' : v < 161 ? '🚄 Zug-Tempo' : v < 240 ? '🚀 Raketen-Tempo' : '🌌 Turbo-Rakete!' }
  ],
  knoepfe: [
    { label: '🍎 Abwurf!', tue: (s, p) => {
        s.bx = 400; s.by = 270 - 64;
        s.vx = p.tempo; s.vy = 0;
        s.fliegt = true; s.spur = []; s.winkelSumme = 0; s.status = '';
        s.letzterWinkel = Math.atan2(s.by - 270, s.bx - 400);
        Baukasten.ton(300, 0.15, 'triangle', 0.1);
      } }
  ],
  init(s) {
    s.fliegt = false; s.spur = []; s.status = ''; s.winkelSumme = 0; s.runden = 0;
  },
  schritt(s, p, dt) {
    if (!s.fliegt) return;
    const cx = 400, cy = 270, R = 52;
    // Schwerkraft Richtung Erdmitte. Umlaufbahn erst ab ~161 (Raketen-Tempo),
    // Entkommen erst ab ~240 (Turbo) – Zug-Tempo plumpst IMMER!
    for (let unter = 0; unter < 4; unter++) {
      const schrittDt = dt / 4;
      const dx = cx - s.bx, dy = cy - s.by;
      const r = Math.hypot(dx, dy);
      const a = 1850000 / (r * r);
      s.vx += dx / r * a * schrittDt;
      s.vy += dy / r * a * schrittDt;
      s.bx += s.vx * schrittDt;
      s.by += s.vy * schrittDt;
    }
    s.spur.push({ x: s.bx, y: s.by });
    if (s.spur.length > 700) s.spur.shift();
    // Rundenzähler
    const w = Math.atan2(s.by - cy, s.bx - cx);
    let dw = w - s.letzterWinkel;
    if (dw > Math.PI) dw -= 2 * Math.PI;
    if (dw < -Math.PI) dw += 2 * Math.PI;
    s.winkelSumme += dw;
    s.letzterWinkel = w;
    if (Math.abs(s.winkelSumme) > 2 * Math.PI) {
      s.runden++;
      s.winkelSumme = 0;
      s.status = `🛰️ UMLAUFBAHN! Schon ${s.runden} ${s.runden === 1 ? 'Runde' : 'Runden'} – er fällt für immer VORBEI!`;
      Baukasten.ton(700 + s.runden * 100, 0.2, 'triangle', 0.12);
    }
    const dist = Math.hypot(s.bx - cx, s.by - cy);
    if (dist < R) {
      s.fliegt = false;
      s.status = s.runden > 0 ? s.status : '🍎 Plumps! Zu langsam – wie ein Apfel vom Baum.';
      Baukasten.ton(110, 0.2, 'square', 0.1);
    }
    if (dist > 1400) {
      s.fliegt = false;
      s.status = '👋 So schnell schafft nur die Rakete: Der Apfel entwischt der Erde für immer!';
    }
  },
  malen(ctx, s, p) {
    PBU.nacht(ctx, s.w, s.h);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 60; i++) ctx.fillRect((i * 157 + 25) % s.w, (i * 89) % s.h, 2, 2);
    const cx = 400, cy = 270, R = 52;
    // Erde (klein, damit auch weite Ellipsen-Bahnen Platz haben)
    const g = ctx.createRadialGradient(cx - 14, cy - 14, 6, cx, cy, R);
    g.addColorStop(0, '#79c1f7'); g.addColorStop(1, '#1a4a80');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, cx - 16, cy - 10, 13, 'rgba(126,211,33,0.75)');
    PBU.kreis(ctx, cx + 19, cy + 13, 10, 'rgba(126,211,33,0.75)');
    PBU.kreis(ctx, cx + 5, cy + 27, 7, 'rgba(126,211,33,0.75)');
    // Berg + Werfer oben
    ctx.fillStyle = '#8d8d99';
    ctx.beginPath();
    ctx.moveTo(cx - 13, cy - R + 3);
    ctx.lineTo(cx, cy - R - 9);
    ctx.lineTo(cx + 13, cy - R + 3);
    ctx.closePath(); ctx.fill();
    PBU.malKind(ctx, cx - 3, cy - R - 7, 18);
    // Mond weit draußen als Vorbild
    const mw = s.zeit * 0.15;
    PBU.emoji(ctx, '🌙', cx + Math.cos(mw) * 330, cy + Math.sin(mw) * 155, 26);
    // Flugspur
    ctx.strokeStyle = 'rgba(255,209,102,0.6)'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    s.spur.forEach((t, i) => i === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y));
    ctx.stroke();
    // Ball
    if (s.fliegt) malApfel(ctx, s.bx, s.by, 9);
    // Status
    const distJetzt = Math.hypot(s.bx - cx, s.by - cy);
    if (s.status) PBU.text(ctx, s.status, s.w / 2, 40, 19, '#ffd166');
    else if (s.fliegt && distJetzt > 320) {
      // Reicht die Energie zum Entkommen? Dann NICHT „kommt zurück“ behaupten!
      const v2 = s.vx * s.vx + s.vy * s.vy;
      const entkommt = 0.5 * v2 - 1850000 / distJetzt >= 0;
      PBU.text(ctx, entkommt
        ? 'Der ist zu schnell – die Schwerkraft kriegt ihn nicht mehr …'
        : 'Weit draußen … aber die Schwerkraft holt ihn zurück!', s.w / 2, 40, 19, '#ffd166');
    } else PBU.text(ctx, 'Stell das Tempo ein und drück „Abwurf“!', s.w / 2, 40, 20, '#fff');
    PBU.text(ctx, 'Der Mond macht nichts anderes – er fällt seit 4 Milliarden Jahren vorbei!',
      s.w / 2, 470, 16, 'rgba(255,255,255,0.7)');
  }
});

/* --- 8. Emergenz: Aus einfach wird Wunder --- */
Baukasten.demo('grund', {
  id: 'schwarm',
  name: 'Der Schwarm ohne Chef',
  emoji: '🐦',
  frage: 'Wer sagt tausend Vögeln, wohin sie fliegen sollen? NIEMAND!',
  erklaerung: `Das große Finale: Jeder Vogel kennt nur <b>drei winzige Regeln</b> –
    „bleib bei den anderen“, „rempel keinen an“, „flieg mit“. Kein Vogel ist der Chef,
    keiner kennt den Plan. Und trotzdem entsteht ein <b>wunderschöner Schwarm-Tanz</b>!
    So macht es die ganze Natur: Aus einfachen Regeln für kleine Teile
    entsteht die große, komplizierte Welt. Dreh die Regeln auf null – und wieder hoch!`,
  wow: `Auch <b>dein Gehirn</b> funktioniert so: Eine einzelne Gehirnzelle ist stocksimpel und
    versteht gar nichts. Aber 86 Milliarden davon zusammen – das bist <b>DU</b>, mit allen
    deinen Gedanken. Das Ganze ist mehr als seine Teile!`,
  params: [
    { key: 'naehe', label: 'Regel 1: Bleib beim Schwarm', min: 0, max: 2, step: 0.01, start: 1,
      format: v => v < 0.3 ? '❌ Aus' : v < 1.3 ? '✅ An' : '💪 Stark' },
    { key: 'abstand', label: 'Regel 2: Nicht anrempeln', min: 0, max: 2, step: 0.01, start: 1,
      format: v => v < 0.3 ? '❌ Aus' : v < 1.3 ? '✅ An' : '💪 Stark' },
    { key: 'mitflug', label: 'Regel 3: Flieg mit den Nachbarn', min: 0, max: 2, step: 0.01, start: 1,
      format: v => v < 0.3 ? '❌ Aus' : v < 1.3 ? '✅ An' : '💪 Stark' }
  ],
  init(s) {
    s.voegel = [];
    for (let i = 0; i < 34; i++) {
      const w = Math.random() * Math.PI * 2;
      s.voegel.push({
        x: Math.random() * 800, y: Math.random() * 500,
        vx: Math.cos(w) * 90, vy: Math.sin(w) * 90
      });
    }
  },
  schritt(s, p, dt) {
    const sichtweite = 110, minAbstand = 34;
    for (const v of s.voegel) {
      let mx = 0, my = 0, ax = 0, ay = 0, gx = 0, gy = 0, n = 0;
      for (const u of s.voegel) {
        if (u === v) continue;
        const dx = u.x - v.x, dy = u.y - v.y;
        const d = Math.hypot(dx, dy);
        if (d < sichtweite) {
          n++;
          mx += u.x; my += u.y;          // Schwerpunkt (Regel 1)
          gx += u.vx; gy += u.vy;        // Flugrichtung (Regel 3)
          if (d < minAbstand && d > 0.1) { // Abstand (Regel 2)
            ax -= dx / d * (minAbstand - d);
            ay -= dy / d * (minAbstand - d);
          }
        }
      }
      if (n > 0) {
        v.vx += ((mx / n - v.x) * 0.9 * p.naehe + ax * 5.5 * p.abstand + (gx / n - v.vx) * 2.4 * p.mitflug) * dt;
        v.vy += ((my / n - v.y) * 0.9 * p.naehe + ay * 5.5 * p.abstand + (gy / n - v.vy) * 2.4 * p.mitflug) * dt;
      }
      // sanfte Zufalls-Störung + Tempolimit
      v.vx += (Math.random() - 0.5) * 35 * dt;
      v.vy += (Math.random() - 0.5) * 35 * dt;
      const sp = Math.hypot(v.vx, v.vy) || 1;
      const maxSp = 130, minSp = 55;
      if (sp > maxSp) { v.vx *= maxSp / sp; v.vy *= maxSp / sp; }
      if (sp < minSp) { v.vx *= minSp / sp; v.vy *= minSp / sp; }
      v.x += v.vx * dt; v.y += v.vy * dt;
      // Ränder: weich zurückdrängen
      if (v.x < 50) v.vx += 220 * dt;
      if (v.x > 750) v.vx -= 220 * dt;
      if (v.y < 50) v.vy += 220 * dt;
      if (v.y > 450) v.vy -= 220 * dt;
    }
  },
  malen(ctx, s, p) {
    // Abendhimmel
    const g = ctx.createLinearGradient(0, 0, 0, s.h);
    g.addColorStop(0, '#3d2b56'); g.addColorStop(0.6, '#b5527a'); g.addColorStop(1, '#f2a154');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s.w, s.h);
    PBU.kreis(ctx, 620, 400, 42, '#ffd9a0');
    // Vögel als kleine Dreiecke in Flugrichtung
    for (const v of s.voegel) {
      const w = Math.atan2(v.vy, v.vx);
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.rotate(w);
      ctx.fillStyle = '#241c33';
      ctx.beginPath();
      ctx.moveTo(9, 0); ctx.lineTo(-7, -5.5); ctx.lineTo(-3, 0); ctx.lineTo(-7, 5.5);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // Wie "schwarmig" ist es? (Ausrichtung messen)
    let sx = 0, sy = 0;
    for (const v of s.voegel) {
      const sp = Math.hypot(v.vx, v.vy) || 1;
      sx += v.vx / sp; sy += v.vy / sp;
    }
    const ordnung = Math.hypot(sx, sy) / s.voegel.length;
    const anzahlAn = [p.naehe, p.abstand, p.mitflug].filter(x => x > 0.3).length;
    let text;
    if (anzahlAn === 0) text = '🌀 Alle Regeln aus: jeder für sich – Wirrwarr!';
    else if (ordnung > 0.7) text = '✨ Ein SCHWARM! Und niemand ist der Chef!';
    else if (anzahlAn < 3) text = 'Schon besser … schalte alle drei Regeln an!';
    else text = 'Der Schwarm findet sich gerade …';
    PBU.text(ctx, text, s.w / 2, 40, 22, '#fff');
    PBU.text(ctx, '3 Mini-Regeln × 34 Vögel = 1 Wunder', s.w / 2, 472, 17, 'rgba(255,255,255,0.8)');
  }
});
