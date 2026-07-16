'use strict';
/* ===== Welt 7: Magnete & Strom ===== */
Baukasten.welt({
  id: 'strom',
  name: 'Magnete & Strom',
  emoji: '🧲',
  farbe: '#5e60ce',
  beschreibung: 'Unsichtbare Kräfte! Magnete, die durch die Luft ziehen, und flitzende Strom-Teilchen.'
});

/* --- 1. Magnet-Angeln --- */
Baukasten.demo('strom', {
  id: 'angeln',
  name: 'Die Magnet-Angel',
  emoji: '🧲',
  frage: 'Zieh den Magneten übers Bild – was bleibt alles kleben?',
  erklaerung: `Ein Magnet hat eine <b>unsichtbare Kraft-Wolke</b> um sich herum!
    Kommt etwas aus <b>Eisen</b> hinein, wird es angezogen – Büroklammern, Schrauben, Nägel.
    Aber Holz, Gummi und Papier lassen den Magneten völlig kalt.
    <b>Fahre mit dem Finger/der Maus über das Bild</b> und angle die Eisensachen!`,
  wow: `Die <b>ganze Erde</b> ist ein Riesenmagnet! Deshalb zeigt eine Kompassnadel
    immer nach Norden – sie wird von der Erde festgehalten wie deine Büroklammern hier.`,
  params: [
    { key: 'staerke', label: 'Magnet-Stärke', min: 40, max: 160, step: 1, start: 90,
      format: v => v < 70 ? '🧲 Kühlschrank-Magnet' : v < 120 ? '🧲 Kräftig' : '🧲 SUPER-Magnet' }
  ],
  init(s) {
    s.mx = 400; s.my = 150;
    s.dranZahl = 0;
    s.dinge = [];
    // bunt durchgemischt – Eisen und Nicht-Eisen liegen durcheinander!
    const sorten = [
      { e: '📎', eisen: true }, { e: '🟫', eisen: false }, { e: '🔩', eisen: true },
      { e: '🧸', eisen: false }, { e: '🔑', eisen: true }, { e: '📎', eisen: true },
      { e: '🍂', eisen: false }, { e: '🧷', eisen: true }, { e: '🧦', eisen: false }
    ];
    sorten.forEach((d, i) => {
      s.dinge.push({
        ...d, x: 90 + (i % 5) * 150 + Math.random() * 40, y: 330 + Math.floor(i / 5) * 70 + Math.random() * 20,
        vx: 0, vy: 0, klebt: false, slot: -1
      });
    });
  },
  zeiger(s, p, typ, x, y) {
    // Magnet erreicht jede Ecke
    s.mx = PBU.klemme(x, 30, 770);
    s.my = PBU.klemme(y, 40, 430);
  },
  schritt(s, p, dt) {
    for (const d of s.dinge) {
      const dx = s.mx - d.x, dy = (s.my + 30) - d.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (d.eisen) {
        if (d.klebt || dist < 27) {
          if (!d.klebt) {
            d.klebt = true;
            d.slot = s.dranZahl++;
            Baukasten.ton(500 + d.slot * 60, 0.08, 'triangle', 0.08);
          }
          // Knäuel: jedes Teil bekommt einen eigenen, versetzten Platz in der Traube
          const ox = (d.slot % 2 === 0 ? -1 : 1) * (7 + Math.floor(d.slot / 2) * 8);
          const oy = 36 + Math.floor(d.slot / 2) * 13 + (d.slot % 2) * 6;
          d.x += (s.mx + ox - d.x) * 15 * dt;
          d.y += (s.my + oy - d.y) * 15 * dt;
          continue;
        }
        if (dist < p.staerke) {
          const kraft = 5200 * (1 - dist / p.staerke) / dist;
          d.vx += dx * kraft * dt;
          d.vy += dy * kraft * dt;
        }
      } else if (dist < 48) {
        // kein Eisen: der Magnet zieht nicht – aber anstupsen kann er!
        d.vx -= dx / dist * (48 - dist) * 110 * dt;
        d.vy -= dy / dist * (48 - dist) * 60 * dt;
      }
      d.vy += 300 * dt; // Schwerkraft
      d.vx *= (1 - 3 * dt);
      d.x += d.vx * dt; d.y += d.vy * dt;
      if (d.y > 300 + (d.x % 60)) { d.y = 300 + (d.x % 60); d.vy = 0; d.vx *= 0.6; }
      d.x = PBU.klemme(d.x, 40, 760);
      if (d.y > 460) d.y = 460;
    }
    // Am Boden nicht übereinander stapeln: sanft auseinanderschieben
    for (let i = 0; i < s.dinge.length; i++) {
      for (let j = i + 1; j < s.dinge.length; j++) {
        const a = s.dinge[i], b = s.dinge[j];
        if (a.klebt || b.klebt) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d < 34 && d > 0.01) {
          const schub = (34 - d) / 2 * Math.sign(dx || 1);
          a.x -= schub; b.x += schub;
        }
      }
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#e8eaf6', '#f6f7fc');
    PBU.boden(ctx, s.w, s.h, 130, '#d7ccc8');
    // Kraft-Wolke des Magneten
    const g = ctx.createRadialGradient(s.mx, s.my + 30, 10, s.mx, s.my + 30, p.staerke);
    g.addColorStop(0, 'rgba(94,96,206,0.35)');
    g.addColorStop(1, 'rgba(94,96,206,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(s.mx, s.my + 30, p.staerke, 0, Math.PI * 2); ctx.fill();
    ctx.setLineDash([6, 8]);
    PBU.ring(ctx, s.mx, s.my + 30, p.staerke, 'rgba(94,96,206,0.5)', 2);
    ctx.setLineDash([]);
    // Angel-Schnur
    ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s.mx, 0); ctx.lineTo(s.mx, s.my); ctx.stroke();
    // Magnet (gezeichnetes Hufeisen)
    PBU.malMagnet(ctx, s.mx, s.my + 20, 52);
    // Dinge als Spielstein-Plaketten (heben sich kräftig ab)
    for (const d of s.dinge) PBU.plakette(ctx, d.e, d.x, d.y, 34);
    const dran = s.dinge.filter(d => d.klebt).length;
    PBU.text(ctx, `Geangelt: ${dran} von 5 Eisen-Dingen`, s.w / 2, 30, 20, '#3a3352');
    if (dran >= 5) PBU.text(ctx, '🎉 Alle 5! Teddy & Co. kann man nur schubsen – kein Eisen!', s.w / 2, 62, 19, '#5e60ce');
  }
});

/* --- 2. Anziehen & Abstoßen --- */
// Stabmagnet mit etwas Tiefe: kräftige Umrandung, Glanzkante, Bodenschatten
function malStabMagnet(ctx, x, y, farbeL, farbeR, tL, tR) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  ctx.beginPath(); ctx.ellipse(x, y + 34, 62, 7, 0, 0, Math.PI * 2); ctx.fill();
  PBU.kasten(ctx, x - 60, y - 28, 60, 56, farbeL, 7);
  PBU.kasten(ctx, x, y - 28, 60, 56, farbeR, 7);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(x - 57, y + 17, 114, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x - 55, y - 24, 110, 6);
  ctx.strokeStyle = '#1c1a24'; ctx.lineWidth = 3.5;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x - 60, y - 28, 120, 56, 7);
  else ctx.rect(x - 60, y - 28, 120, 56);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y - 28); ctx.lineTo(x, y + 28); ctx.stroke();
  PBU.text(ctx, tL, x - 30, y, 26, '#fff');
  PBU.text(ctx, tR, x + 30, y, 26, '#fff');
  ctx.restore();
}
Baukasten.demo('strom', {
  id: 'pole',
  name: 'Magnet-Kräfte spüren',
  emoji: '⚡',
  frage: 'Warum schubsen sich Magnete manchmal weg?',
  erklaerung: `Jeder Magnet hat <b>zwei Enden</b>: einen roten Nordpol und einen blauen Südpol.
    <b>Verschiedene Enden ziehen sich an</b> – Rot und Blau wollen kuscheln!
    <b>Gleiche Enden schubsen sich weg</b> – Rot und Rot? Bäh, weg da!
    Schieb den linken Magneten näher und dreh ihn um!
    <br><b>⚠️ Ganz wichtig:</b> Mit <b>echten starken Magneten spielt man gar nicht erst</b>!
    Merkregel: Bekommst du zwei Magnete nur schwer wieder auseinander, sind sie
    <b>zu stark für Kinderhände</b> – sie schnappen blitzschnell zu und können böse zwicken.`,
  wow: `In Japan und China schweben <b>ganze Züge</b> auf Magnet-Schubskraft –
    ohne Räder, fast ohne Reibung, über 400 km/h schnell!`,
  params: [
    { key: 'abstand', label: 'Magnet schieben', min: 100, max: 380, step: 1, start: 350,
      format: v => v < 180 ? '🤏 Ganz nah' : v < 290 ? '↔️ Mittel' : '↔️ Weit weg' }
  ],
  knoepfe: [
    { label: '🔄 Magnet umdrehen', tue: (s) => { s.gedreht = !s.gedreht; Baukasten.ton(400, 0.1, 'triangle', 0.1); } }
  ],
  init(s) { s.gedreht = false; s.freiX = 500; s.freiV = 0; },
  schritt(s, p, dt) {
    const linksRand = p.abstand + 60; // rechte Kante des linken Magneten
    const d = Math.max(20, s.freiX - 60 - linksRand);
    const anziehend = s.gedreht; // gedreht: Süd zeigt nach rechts -> zieht Nord an
    const kraft = 260000 / (d * d) * (anziehend ? -1 : 1);
    s.freiV += kraft * dt;
    s.freiV *= (1 - 1.6 * dt); // Reibung
    s.freiX += s.freiV * dt;
    // Anschläge
    if (s.freiX - 60 < linksRand) { s.freiX = linksRand + 60; s.freiV = 0; } // angedockt
    if (s.freiX > 720) { s.freiX = 720; s.freiV = 0; }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#efe9fb', '#faf8fe');
    // Tisch
    PBU.kasten(ctx, 40, 290, 720, 26, '#b07a3f', 8);
    const y = 255;
    // Führungsschiene: der linke Magnet wird von dir geschoben
    ctx.fillStyle = '#8a93a5';
    ctx.fillRect(60, 315, 380, 6);
    // Linker Magnet auf Schlitten (per Regler geschoben)
    const lx = p.abstand;
    PBU.kasten(ctx, lx - 42, y + 28, 84, 12, '#5b6270', 4);
    // Unverdreht zeigt das N-Ende nach rechts: N trifft N -> abstoßen!
    malStabMagnet(ctx, lx, y, s.gedreht ? '#e63946' : '#42a5f5', s.gedreht ? '#42a5f5' : '#e63946',
      s.gedreht ? 'N' : 'S', s.gedreht ? 'S' : 'N');
    PBU.text(ctx, '🔩 ist befestigt', lx, y + 62, 13, '#6b6489');
    // Rechter Magnet: rollt frei auf dem Tisch
    malStabMagnet(ctx, s.freiX, y, '#e63946', '#42a5f5', 'N', 'S');
    PBU.kreis(ctx, s.freiX - 38, y + 32, 7, '#3a3352');
    PBU.kreis(ctx, s.freiX + 38, y + 32, 7, '#3a3352');
    PBU.text(ctx, 'rollt frei', s.freiX, y + 62, 13, '#6b6489');
    // Kraft-Zone zwischen den Magneten
    const anziehend = s.gedreht;
    const mitte = (lx + 60 + s.freiX - 60) / 2;
    const d = s.freiX - 60 - (lx + 60);
    if (d < 160 && d > 5) {
      if (anziehend) {
        PBU.pfeil(ctx, mitte + d / 2 - 5, y - 60, mitte + 10, y - 60, '#7ed321', 5);
        PBU.pfeil(ctx, mitte - d / 2 + 5, y - 60, mitte - 10, y - 60, '#7ed321', 5);
        PBU.text(ctx, '😍 Anziehen!', mitte, y - 90, 20, '#4d9e12');
      } else {
        PBU.pfeil(ctx, mitte, y - 60, mitte + d / 2 + 30, y - 60, '#e63946', 5);
        PBU.pfeil(ctx, mitte, y - 60, mitte - d / 2 - 30, y - 60, '#e63946', 5);
        PBU.text(ctx, '😤 Wegschubsen!', mitte, y - 90, 20, '#e63946');
      }
      // Zitterlinien
      ctx.strokeStyle = 'rgba(94,96,206,0.4)'; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let t = 0; t <= 1; t += 0.1) {
          const zx = lx + 60 + d * t;
          const zy = y + (i - 1) * 14 + Math.sin(t * 12 + s.zeit * 10) * 3;
          t === 0 ? ctx.moveTo(zx, zy) : ctx.lineTo(zx, zy);
        }
        ctx.stroke();
      }
    }
    if (s.freiX - 60 <= lx + 61 && anziehend) PBU.text(ctx, '🧲💕 Zusammengeschnappt!', s.w / 2, 100, 24, '#5e60ce');
    PBU.text(ctx, 'Rot+Blau = kuscheln  •  Rot+Rot = schubsen', s.w / 2, 428, 18, '#6b6489');
    PBU.text(ctx, '⚠️ Echte starke Magnete sind KEIN Spielzeug! Schwer zu trennen = zu stark – Hände weg!',
      s.w / 2, 464, 15, '#e63946');
  }
});

/* --- 3. Stromkreis --- */
Baukasten.demo('strom', {
  id: 'stromkreis',
  name: 'Der Strom-Kreisverkehr',
  emoji: '💡',
  frage: 'Warum leuchtet die Lampe nur, wenn der Kreis geschlossen ist?',
  erklaerung: `Strom besteht aus winzigen Flitzern (Elektronen), die im Draht
    <b>im Kreis sausen</b> – wie Autos im Kreisverkehr!
    Ist der Schalter offen, ist die Straße <b>unterbrochen</b>: Alle bleiben stehen, die Lampe ist dunkel.
    Schalter zu → alle flitzen los → die Lampe glüht!`,
  wow: `Die Strom-Flitzer in der Leitung schieben sich gegenseitig an – das Anschubsen rast <b>fast mit Lichtgeschwindigkeit</b> durch den Draht. Darum leuchtet die Lampe sofort, wenn du den Schalter drückst!`,
  params: [
    { key: 'power', label: 'Batterie-Stärke', min: 0.2, max: 1, step: 0.01, start: 0.6,
      format: v => v < 0.45 ? '🔋 Schwach' : v < 0.8 ? '🔋 Normal' : '🔋🔋 Doppelt stark!' }
  ],
  knoepfe: [
    { label: '🔘 Schalter drücken', tue: (s) => {
        s.zu = !s.zu;
        Baukasten.ton(s.zu ? 600 : 300, 0.1, 'square', 0.1);
      } }
  ],
  init(s) {
    s.zu = false;
    s.flitzer = [];
    for (let i = 0; i < 14; i++) s.flitzer.push({ pos: i / 14 });
  },
  schritt(s, p, dt) {
    if (!s.zu) return;
    for (const f of s.flitzer) {
      f.pos = (f.pos + p.power * 0.22 * dt) % 1;
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#fbf3e4', '#fdfaf3');
    // Rechteckiger Stromkreis-Pfad
    const L = 160, R = 640, T = 120, B = 380;
    ctx.strokeStyle = '#8a6d3b'; ctx.lineWidth = 10; ctx.lineJoin = 'round';
    ctx.beginPath();
    // Lücke für Schalter oben rechts, Lampe oben Mitte, Batterie unten
    ctx.moveTo(400 + 40, T);
    ctx.lineTo(520, T); // zum Schalter
    if (s.zu) ctx.lineTo(590, T);
    ctx.moveTo(590, T);
    ctx.lineTo(R, T); ctx.lineTo(R, B); ctx.lineTo(460, B);
    ctx.moveTo(340, B);
    ctx.lineTo(L, B); ctx.lineTo(L, T); ctx.lineTo(400 - 40, T);
    ctx.stroke();
    // Schalter (Klappe)
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(520, T);
    if (s.zu) ctx.lineTo(590, T);
    else ctx.lineTo(575, T - 45);
    ctx.stroke();
    PBU.kreis(ctx, 520, T, 8, '#3a3352');
    PBU.kreis(ctx, 590, T, 8, '#3a3352');
    // Batterie unten
    PBU.kasten(ctx, 340, B - 24, 120, 48, '#4caf50', 8);
    PBU.kasten(ctx, 456, B - 12, 12, 24, '#3a3352', 3);
    PBU.text(ctx, `🔋${p.power > 0.8 ? '🔋' : ''}`, 400, B, 30);
    // Dunkle Nische hinter der Lampe – so hebt sich das Leuchten richtig ab!
    PBU.kasten(ctx, 352, T - 82, 96, 108, '#2b2545', 14);
    // Lampe oben Mitte
    const hell = s.zu ? p.power : 0;
    if (hell > 0) {
      const g = ctx.createRadialGradient(400, T - 10, 5, 400, T - 10, 40 + hell * 60);
      g.addColorStop(0, `rgba(255,240,150,${0.85 * hell})`);
      g.addColorStop(1, 'rgba(255,240,150,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(400, T - 10, 40 + hell * 60, 0, Math.PI * 2); ctx.fill();
    }
    PBU.malGluehbirne(ctx, 400, T - 8, 50, hell > 0);
    // Strom-Flitzer
    if (s.zu) {
      const umfang = 2 * (R - L) + 2 * (B - T);
      for (const f of s.flitzer) {
        let d = f.pos * umfang;
        let x, y;
        if (d < R - L) { x = L + d; y = T; }
        else if (d < (R - L) + (B - T)) { x = R; y = T + (d - (R - L)); }
        else if (d < 2 * (R - L) + (B - T)) { x = R - (d - (R - L) - (B - T)); y = B; }
        else { x = L; y = B - (d - 2 * (R - L) - (B - T)); }
        PBU.kreis(ctx, x, y, 7, '#ffd166');
        PBU.kreis(ctx, x, y, 3, '#fff');
      }
    }
    PBU.text(ctx, s.zu ? '🎉 Der Kreis ist zu – alle Flitzer sausen!' : 'Der Kreis ist offen – niemand kann fahren.',
      s.w / 2, 462, 22, '#3a3352');
    PBU.text(ctx, 'Schalter', 552, T + 30, 15, '#6b6489');
  }
});

/* --- 4. Zauber-Ballon (statische Elektrizität) --- */
Baukasten.demo('strom', {
  id: 'ballonzauber',
  name: 'Der Zauber-Ballon',
  emoji: '🎈',
  frage: 'Schrubbel den Ballon übers Haar – und schau, was er dann alles anzieht!',
  erklaerung: `Pack den Ballon und <b>schrubbel ihn über die langen Haare</b> – hoch und runter,
    schön flott! Dabei <b>klaut er winzige Ladungs-Teilchen</b> aus dem Haar.
    Der geladene Ballon zieht dann alles Leichte an: Papierschnipsel hüpfen hoch,
    die Haare stellen sich auf! Wartest du zu lange, tragen die Luft-Teilchen die Ladung
    langsam wieder davon. Und bei voller Ladung springt sie als <b>Mini-Blitz</b> zurück – zack!`,
  wow: `Ein echter <b>Gewitter-Blitz</b> entsteht genauso: Eiskörnchen in der Wolke
    rubbeln aneinander, bis die Ladung als Riesen-Funke zur Erde springt!`,
  init(s) {
    s.bx = 380; s.by = 240;
    s.zieht = false;
    s.ladung = 0;
    s.wuschel = 0;
    s.blitz = null;
    s.reibTon = 0;
    s.schnipsel = [];
    for (let i = 0; i < 11; i++) {
      s.schnipsel.push({
        x: 555 + i * 20 + Math.random() * 10, y: 406 + Math.random() * 8,
        vx: 0, vy: 0, dran: false, winkel: 0, drehung: Math.random() * 0.8 - 0.4
      });
    }
  },
  zeiger(s, p, typ, x, y) {
    if (typ === 'runter') {
      // Ballon springt zur Hand – ohne dass der Sprung als Reiben zählt
      s.zieht = true;
      s.bx = PBU.klemme(x, 60, 740);
      s.by = PBU.klemme(y, 95, 390);
      return;
    }
    if (typ === 'hoch') { s.zieht = false; return; }
    if (!s.zieht) return;
    const altY = s.by;
    s.bx = PBU.klemme(x, 60, 740);
    s.by = PBU.klemme(y, 95, 390);
    // Reibung: Ballon-Unterkante streicht durchs Haar
    const dy = s.by - altY;
    // Reibzone: der Haarkranz rund um den Kopf (seitlich und oben)
    const dxK = s.bx - 170, dyK = s.by - 250;
    const dK = Math.hypot(dxK, dyK);
    const wk = Math.atan2(dyK, dxK);
    const imHaar = dK > 58 && dK < 170 && !(wk > 0.45 && wk < 2.69);
    if (Math.abs(dy) > 0.5 && imHaar) {
      s.ladung = Math.min(1, s.ladung + Math.abs(dy) * 0.0035);
      s.wuschel = 0.35;
      s.reibTon -= Math.abs(dy);
      if (s.reibTon <= 0) {
        s.reibTon = 60;
        Baukasten.ton(700 + Math.random() * 300, 0.05, 'triangle', 0.05);
      }
    }
  },
  schritt(s, p, dt) {
    // Die Luft trägt die Ladung ganz langsam davon
    s.ladung = Math.max(0, s.ladung - 0.022 * dt);
    if (s.wuschel > 0) s.wuschel -= dt;
    if (s.blitz) { s.blitz.t -= dt; if (s.blitz.t <= 0) s.blitz = null; }
    // Mini-Blitz zurück zur Figur, wenn voll geladen und nah dran
    const distKopf = Math.hypot(s.bx - 170, s.by - 250);
    if (s.ladung > 0.75 && distKopf < 240 && !s.blitz && Math.random() < 1.3 * dt) {
      const wz = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
      s.blitz = { t: 0.22, x1: s.bx, y1: s.by + 34,
        x2: 170 + Math.cos(wz) * 88, y2: 250 + Math.sin(wz) * 88 };
      s.ladung -= 0.17;
      Baukasten.ton(120, 0.12, 'sawtooth', 0.14);
      setTimeout(() => Baukasten.ton(900, 0.06, 'square', 0.08), 40);
      // ein Schnipsel blättert ab
      const dranListe = s.schnipsel.filter(sc => sc.dran);
      if (dranListe.length) {
        const ab = dranListe[Math.floor(Math.random() * dranListe.length)];
        ab.dran = false; ab.vy = 60; ab.vx = (Math.random() - 0.5) * 80;
        ab.immun = 1.1; // kurz „taub“, damit er wirklich abblättert statt sofort wieder anzudocken
      }
    }
    // Schnipsel-Physik
    for (const sc of s.schnipsel) {
      if (sc.dran) {
        if (s.ladung < 0.1) { sc.dran = false; sc.vy = 0; continue; }
        // klebt am Ballon-Rand, folgt ihm
        sc.x += (s.bx + Math.cos(sc.winkel) * 46 - sc.x) * 18 * dt;
        sc.y += (s.by + Math.sin(sc.winkel) * 55 - sc.y) * 18 * dt;
        continue;
      }
      if (sc.immun > 0) sc.immun -= dt;
      const dx = s.bx - sc.x, dy = s.by - sc.y;
      const d = Math.hypot(dx, dy) || 1;
      if (s.ladung > 0.15 && d < 60 + s.ladung * 170 && !(sc.immun > 0)) {
        sc.vx += dx / d * 700 * s.ladung * dt;
        sc.vy += dy / d * 950 * s.ladung * dt;
      }
      sc.vy += 420 * dt;
      sc.vx *= (1 - 2 * dt);
      sc.x += sc.vx * dt;
      sc.y += sc.vy * dt;
      if (sc.y > 412) { sc.y = 412; sc.vy = 0; sc.vx *= 0.5; }
      sc.x = PBU.klemme(sc.x, 30, 770);
      if (d < 64 && s.ladung > 0.15 && !(sc.immun > 0)) {
        sc.dran = true;
        sc.winkel = Math.atan2(sc.y - s.by, sc.x - s.bx);
      }
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#fdeef5', '#fef8fb');
    PBU.boden(ctx, s.w, s.h, 80, '#e0cda8');
    // Sitzende Freundin: großes Smiley-Gesicht mit langem Haupthaar, Blick zu uns
    const KX = 170, KY = 250;
    ctx.lineCap = 'round';
    // Schultern/Büste
    ctx.fillStyle = '#b565d8';
    ctx.beginPath(); ctx.ellipse(KX, 442, 92, 56, 0, Math.PI, Math.PI * 2); ctx.fill();
    // Haar: Hinterkopf + zwei lange Seitenpartien
    ctx.fillStyle = '#7a5326';
    PBU.kreis(ctx, KX, KY - 8, 76, '#7a5326');
    PBU.kasten(ctx, KX - 98, KY - 24, 34, 190, '#7a5326', 16);
    PBU.kasten(ctx, KX + 64, KY - 24, 34, 190, '#7a5326', 16);
    // Gesicht
    PBU.kreis(ctx, KX, KY, 60, '#f0bd93');
    // Pony
    ctx.fillStyle = '#7a5326';
    ctx.beginPath(); ctx.arc(KX, KY - 6, 60, Math.PI * 1.08, Math.PI * 1.92); ctx.closePath(); ctx.fill();
    // Augen mit Glanz, Lächeln, Wangen
    PBU.kreis(ctx, KX - 21, KY - 2, 6.5, '#3a3352');
    PBU.kreis(ctx, KX + 21, KY - 2, 6.5, '#3a3352');
    PBU.kreis(ctx, KX - 19, KY - 4, 2.2, '#fff');
    PBU.kreis(ctx, KX + 23, KY - 4, 2.2, '#fff');
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(KX, KY + 16, 24, 0.3, Math.PI - 0.3); ctx.stroke();
    PBU.kreis(ctx, KX - 40, KY + 16, 7, 'rgba(247,143,179,0.55)');
    PBU.kreis(ctx, KX + 40, KY + 16, 7, 'rgba(247,143,179,0.55)');
    // Einzelne Strähnen im Haarkranz – steigen dem geladenen Ballon entgegen!
    ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
      const seite = i < 5 ? -1 : 1;
      const j = i % 5;
      const basisX = KX + seite * (30 + j * 10);
      const basisY = KY - 66 + j * 4;
      const endX0 = KX + seite * (84 + j * 7);
      const endY0 = 396 - j * 14;
      const dxB = s.bx - endX0, dyB = (s.by + 40) - endY0;
      const dB = Math.hypot(dxB, dyB) || 1;
      const zieh = s.ladung * PBU.klemme(1 - dB / 260, 0, 1);
      const endX = endX0 + dxB / dB * 65 * zieh + (s.wuschel > 0 ? Math.sin(s.zeit * 30 + i) * 6 : 0);
      const endY = endY0 + dyB / dB * 65 * zieh;
      ctx.beginPath();
      ctx.moveTo(basisX, basisY);
      ctx.quadraticCurveTo(KX + seite * (100 + j * 8), (basisY + endY) / 2 - zieh * 20, endX, endY);
      ctx.stroke();
    }
    // Blitzbogen zum Haar
    if (s.blitz) {
      ctx.save();
      ctx.strokeStyle = '#ffe97a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.shadowColor = '#ffe97a'; ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(s.blitz.x1, s.blitz.y1);
      for (let k = 1; k <= 5; k++) {
        const t = k / 5;
        ctx.lineTo(
          s.blitz.x1 + (s.blitz.x2 - s.blitz.x1) * t + (k < 5 ? (Math.random() - 0.5) * 26 : 0),
          s.blitz.y1 + (s.blitz.y2 - s.blitz.y1) * t + (k < 5 ? (Math.random() - 0.5) * 16 : 0)
        );
      }
      ctx.stroke();
      ctx.restore();
      PBU.emoji(ctx, '⚡', (s.blitz.x1 + s.blitz.x2) / 2, (s.blitz.y1 + s.blitz.y2) / 2 - 24, 26);
    }
    // Ladungs-Aura
    if (s.ladung > 0.15) {
      const g = ctx.createRadialGradient(s.bx, s.by, 20, s.bx, s.by, s.ladung * 150 + 55);
      g.addColorStop(0, 'rgba(255,215,80,0.28)');
      g.addColorStop(1, 'rgba(255,215,80,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(s.bx, s.by, s.ladung * 150 + 55, 0, Math.PI * 2); ctx.fill();
    }
    // Ballon (schwebt sanft, wenn man ihn nicht hält)
    const bob = s.zieht ? 0 : Math.sin(s.zeit * 2) * 4;
    const by = s.by + bob;
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.ellipse(s.bx, by, 46, 56, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s.bx - 16, by - 18, 12, 8, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
    ctx.fillStyle = '#a92832';
    ctx.beginPath();
    ctx.moveTo(s.bx - 5, by + 55); ctx.lineTo(s.bx + 5, by + 55); ctx.lineTo(s.bx, by + 63);
    ctx.closePath(); ctx.fill();
    // Minus-Zeichen = Ladung
    const nLadung = Math.round(s.ladung * 8);
    for (let i = 0; i < nLadung; i++) {
      const w = (i / 8) * Math.PI * 2 + 0.4;
      PBU.text(ctx, '−', s.bx + Math.cos(w) * 58, by + Math.sin(w) * 68, 22, '#5e60ce');
    }
    // Schnipsel
    for (const sc of s.schnipsel) {
      ctx.save();
      ctx.translate(sc.x, sc.y);
      ctx.rotate(sc.drehung + (sc.dran ? 0 : Math.sin(s.zeit * 3 + sc.x) * 0.1));
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#c9c4d8'; ctx.lineWidth = 1.5;
      ctx.fillRect(-9, -6, 18, 12);
      ctx.strokeRect(-9, -6, 18, 12);
      ctx.restore();
    }
    // Ladungs-Anzeige
    PBU.kasten(ctx, 24, 24, 150, 22, 'rgba(255,255,255,0.6)', 10);
    PBU.kasten(ctx, 27, 27, 144 * s.ladung, 16, s.ladung > 0.75 ? '#e63946' : '#f5c518', 8);
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, 150, 22);
    PBU.text(ctx, '⚡ Ladung', 186, 36, 15, '#3a3352', 'left');
    const dran = s.schnipsel.filter(x => x.dran).length;
    const text = s.ladung < 0.15
      ? '👋 Greif den Ballon und schrubbel ihn über die Haare – hoch und runter!'
      : s.ladung > 0.75 ? '⚡ Voll geladen – gleich blitzt es!'
      : dran > 0 ? `✨ ${dran} Schnipsel kleben am Ballon!`
      : 'Geladen! Halte ihn über die Schnipsel rechts …';
    PBU.text(ctx, text, s.w / 2, 74, 19, '#3a3352');
  }
});
