'use strict';
/* ===== Welt 3: Wasser & Luft ===== */
Baukasten.welt({
  id: 'wasser',
  name: 'Wasser & Luft',
  emoji: '🛁',
  farbe: '#42a5f5',
  beschreibung: 'Warum schwimmen riesige Schiffe, aber kleine Steine gehen unter?'
});

/* --- 1. Schwimmt oder sinkt? --- */
// Gerundete Bänder, damit der Regler in beide Richtungen dasselbe Objekt liefert
function schwimmBand(v) {
  v = Math.round(v * 100) / 100;
  return v < 0.5 ? 0 : v < 0.95 ? 1 : v <= 1.05 ? 2 : v < 1.6 ? 3 : 4;
}
function malSchwimmObjekt(ctx, x, y, gr, band) {
  const r = gr / 2;
  if (band === 0) { // Luftballon
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.8, r, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a92832'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.2, r * 0.12, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a92832';
    ctx.beginPath(); ctx.moveTo(x, y + r); ctx.lineTo(x + 3, y + r + 11); ctx.stroke();
  } else if (band === 1) { // Holzklotz
    PBU.kasten(ctx, x - r, y - r * 0.75, gr, r * 1.5, '#b07a3f', 6);
    ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 3;
    ctx.strokeRect(x - r, y - r * 0.75, gr, r * 1.5);
    ctx.strokeStyle = 'rgba(122,83,38,0.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - r + 5, y - r * 0.25); ctx.lineTo(x + r - 5, y - r * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - r + 5, y + r * 0.3); ctx.lineTo(x + r - 5, y + r * 0.35); ctx.stroke();
  } else if (band === 2) { // Wasserballon – genau so schwer wie Wasser
    PBU.malWasserballon(ctx, x, y, r);
  } else if (band === 3) { // nasser Schwamm
    PBU.kasten(ctx, x - r, y - r * 0.6, gr, r * 1.2, '#cfae3d', 8);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    for (const [ox, oy, or] of [[-0.5, -0.25, 0.14], [0.15, 0.1, 0.18], [0.55, -0.3, 0.11], [-0.15, 0.38, 0.12], [0.5, 0.35, 0.1]]) {
      ctx.beginPath(); ctx.arc(x + ox * r, y + oy * r, or * r, 0, Math.PI * 2); ctx.fill();
    }
    PBU.kreis(ctx, x - r * 0.6, y + r * 0.75, 4, '#42a5f5');
    PBU.kreis(ctx, x + r * 0.4, y + r * 0.8, 3, '#42a5f5');
  } else { // Stein
    PBU.malStein(ctx, x, y, r * 0.9);
  }
}
Baukasten.demo('wasser', {
  id: 'schwimmen',
  name: 'Schwimmt es oder sinkt es?',
  emoji: '🦆',
  frage: 'Warum schwimmt ein riesiges Schiff, aber ein kleiner Stein sinkt?',
  erklaerung: `Das Wasser <b>drückt von unten</b> gegen alles, was hineinfällt!
    Ist das Ding <b>leichter als das Wasser</b>, das es wegschiebt, dann schwimmt es.
    Ist es schwerer, gluckert es nach unten. Es kommt nicht auf die Größe an – sondern
    ob es innen <b>luftig oder massiv</b> ist!`,
  wow: `Riesige Stahlschiffe schwimmen, weil sie innen <b>voller Luft</b> sind.
    Knetest du dieselbe Menge Stahl zu einer Kugel, säuft sie sofort ab!`,
  params: [
    { key: 'fuellung', label: 'Was ist drin?', min: 0.1, max: 2.4, step: 0.01, start: 0.5,
      format: v => ['🎈 Luft-Ballon', '🟫 Holzklotz', '💧 Wasserballon', '🧽 Nasser Schwamm', '🥌 Stein'][schwimmBand(v)] },
    { key: 'groesse', label: 'Größe', min: 30, max: 90, step: 1, start: 60,
      format: v => v < 50 ? '🐁 Klein' : v < 72 ? '📦 Mittel' : '🐘 Riesig' }
  ],
  init(s) { s.y = 130; s.vy = 0; s.wellen = []; },
  schritt(s, p, dt) {
    const wasserY = 210;
    const r = p.groesse / 2;
    // Eintauchtiefe 0..1
    const tiefe = PBU.klemme((s.y + r - wasserY) / (2 * r), 0, 1);
    const gewicht = 400 * p.fuellung;
    const auftrieb = 400 * tiefe * 1.0; // Wasser hat "Dichte 1"
    s.vy += (gewicht - auftrieb) * dt;
    s.vy *= (1 - 2.2 * tiefe * dt); // Wasserwiderstand
    s.y += s.vy * dt;
    if (s.y > 452 - r) { s.y = 452 - r; s.vy = 0; } // Flussbett
    if (s.y < 60) { s.y = 60; s.vy = 0; }
    // Wellen am Eintauchen
    if (tiefe > 0 && tiefe < 1 && Math.abs(s.vy) > 40 && Math.random() < 0.3) {
      s.wellen.push({ x: 400 + (Math.random() - 0.5) * p.groesse, r: 5, leben: 1 });
    }
    for (const w of s.wellen) { w.r += 40 * dt; w.leben -= dt; }
    s.wellen = s.wellen.filter(w => w.leben > 0);
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h);
    const wasserY = 210;
    // Wasser
    const g = ctx.createLinearGradient(0, wasserY, 0, s.h);
    g.addColorStop(0, 'rgba(66,165,245,0.75)');
    g.addColorStop(1, 'rgba(21,101,192,0.9)');
    ctx.fillStyle = g;
    ctx.fillRect(0, wasserY, s.w, s.h - wasserY);
    // Solides Flussbett
    ctx.fillStyle = '#9c7a4f';
    ctx.fillRect(0, 455, s.w, s.h - 455);
    ctx.fillStyle = '#8a6b45';
    ctx.fillRect(0, 455, s.w, 6);
    for (let i = 0; i < 16; i++) {
      const kx = (i * 53 + 20) % s.w;
      ctx.fillStyle = i % 2 ? '#b09468' : '#7d654a';
      ctx.beginPath();
      ctx.ellipse(kx, 458 + (i * 29) % 30, 9 + (i * 7) % 8, 5 + (i * 3) % 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Wellenlinie
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= s.w; x += 10) {
      const y = wasserY + Math.sin(x * 0.05 + s.zeit * 2) * 4;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Ringe
    for (const w of s.wellen) {
      ctx.save(); ctx.globalAlpha = w.leben * 0.6;
      PBU.ring(ctx, w.x, wasserY, w.r, '#fff', 2);
      ctx.restore();
    }
    // Objekt (kräftig gezeichnet)
    const r = p.groesse / 2;
    malSchwimmObjekt(ctx, 400, s.y, p.groesse, schwimmBand(p.fuellung));
    // Auftriebs-Pfeile
    const tiefe = PBU.klemme((s.y + r - wasserY) / (2 * r), 0, 1);
    if (tiefe > 0.05) {
      const st = 20 + tiefe * 40;
      PBU.pfeil(ctx, 340, s.y + r + 40, 340, s.y + r + 40 - st, '#7ed321', 5);
      PBU.pfeil(ctx, 460, s.y + r + 40, 460, s.y + r + 40 - st, '#7ed321', 5);
      PBU.text(ctx, 'Wasser drückt hoch!', 570, s.y + r + 20, 16, '#eaffea', 'left');
    }
    // Gewichts-Pfeil
    PBU.pfeil(ctx, 400, s.y - r - 8, 400, s.y - r - 8 + 15 + p.fuellung * 25, '#e63946', 5);
    let status = '';
    if (Math.abs(s.vy) < 6 && s.y + r > wasserY + 8) {
      if (s.y >= 450 - r) status = '⬇️ Gesunken – bis auf den Grund!';
      else if (tiefe >= 0.97) status = '🌊 Es schwebt mitten im Wasser!';
      else if (tiefe > 0.03) status = '🎉 Es schwimmt!';
    }
    if (status) PBU.text(ctx, status, s.w / 2, 40, 26, '#3a3352');
    PBU.text(ctx, '🔴 = Gewicht zieht runter   🟢 = Wasser drückt hoch', s.w / 2, 475, 16, '#fff');
  }
});

/* --- 2. Wasserdruck: Löcher im Eimer --- */
Baukasten.demo('wasser', {
  id: 'druck',
  name: 'Der löchrige Eimer',
  emoji: '🚰',
  frage: 'Aus welchem Loch spritzt das Wasser am weitesten?',
  erklaerung: `Je tiefer du im Wasser bist, desto mehr Wasser <b>drückt von oben</b> auf dich!
    Darum spritzt es aus dem <b>untersten Loch am stärksten</b> –
    dort schiebt das ganze Wasser darüber mit. Füll den Eimer voll und schau genau hin!`,
  wow: `Tief unten im Meer ist der Druck so riesig, dass U-Boote <b>extra dicke Stahlwände</b>
    brauchen – sonst würden sie zerquetscht wie eine Getränkedose!`,
  params: [
    { key: 'stand', label: 'Wasser im Eimer', min: 0.15, max: 1, step: 0.01, start: 1,
      format: v => v < 0.4 ? '💧 Wenig' : v < 0.75 ? '💦 Halb voll' : '🌊 Randvoll' }
  ],
  init(s) { s.tropfen = []; },
  schritt(s, p, dt) {
    const topY = 120, bodenY = 420;
    const wasserY = bodenY - (bodenY - topY) * p.stand;
    const loecher = [200, 290, 380];
    for (const ly of loecher) {
      if (wasserY < ly - 5) {
        const druck = (ly - wasserY) / (bodenY - topY); // 0..1
        const speed = 90 + druck * 330;
        if (Math.random() < 0.85) {
          s.tropfen.push({ x: 320, y: ly, vx: speed, vy: (Math.random() - 0.5) * 15, leben: 3 });
        }
      }
    }
    for (const t of s.tropfen) {
      t.vy += 500 * dt;
      t.x += t.vx * dt; t.y += t.vy * dt;
      t.leben -= dt;
      if (t.y > 455) t.leben = 0;
    }
    s.tropfen = s.tropfen.filter(t => t.leben > 0);
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#fff3d6', '#fffaf0');
    PBU.boden(ctx, s.w, s.h, 45, '#c8a165');
    const topY = 120, bodenY = 420;
    const wasserY = bodenY - (bodenY - topY) * p.stand;
    // Eimer
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(140, topY - 20, 180, bodenY - topY + 20);
    // Wasser im Eimer
    ctx.fillStyle = 'rgba(66,165,245,0.8)';
    ctx.fillRect(140, wasserY, 180, bodenY - wasserY);
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 5;
    ctx.strokeRect(140, topY - 20, 180, bodenY - topY + 20);
    // Druck-Pfeile im Wasser (nach unten größer werdend)
    for (let py = wasserY + 30; py < bodenY - 20; py += 55) {
      const druck = (py - wasserY) / (bodenY - topY);
      ctx.save(); ctx.globalAlpha = 0.5;
      PBU.pfeil(ctx, 230, py, 230 - 15 - druck * 45, py, '#1d5c94', 3);
      PBU.pfeil(ctx, 230, py, 230 + 15 + druck * 45, py, '#1d5c94', 3);
      ctx.restore();
    }
    // Löcher
    const loecher = [200, 290, 380];
    loecher.forEach((ly, i) => {
      PBU.kreis(ctx, 320, ly, 7, '#3a3352');
      PBU.text(ctx, ['oben', 'Mitte', 'unten'][i], 108, ly, 15, '#6b6489', 'left');
    });
    // Wasserstrahlen
    ctx.fillStyle = 'rgba(66,165,245,0.85)';
    for (const t of s.tropfen) PBU.kreis(ctx, t.x, t.y, 4, 'rgba(66,165,245,0.85)');
    // Pfützen
    ctx.fillStyle = 'rgba(66,165,245,0.5)';
    ctx.beginPath(); ctx.ellipse(560, 452, 180, 10, 0, 0, Math.PI * 2); ctx.fill();
    PBU.text(ctx, 'Unten drückt das ganze Wasser von oben mit!', s.w / 2, 50, 21, '#3a3352');
  }
});

/* --- 3. Luftballon-Rakete --- */
Baukasten.demo('wasser', {
  id: 'rakete',
  name: 'Die Luftballon-Rakete',
  emoji: '🎈',
  frage: 'Warum saust ein losgelassener Luftballon durchs Zimmer?',
  erklaerung: `Die Luft schießt <b>hinten raus</b> – und schiebt den Ballon dabei
    <b>nach vorne</b>! Das nennt man Rückstoß: Was du nach hinten wegpustest,
    drückt dich nach vorne. Je mehr Luft im Ballon, desto weiter fliegt er.`,
  wow: `Echte Raketen funktionieren <b>genauso</b>: Sie pusten Feuergas nach unten raus
    und werden dadurch nach oben geschoben – sogar im Weltall, wo es keine Luft gibt!`,
  params: [
    { key: 'luft', label: 'Aufpusten', min: 0.3, max: 1, step: 0.01, start: 0.7,
      format: v => v < 0.5 ? '💨 Ein Puster' : v < 0.8 ? '😤 Kräftig' : '🥵 Bis zum Platzen!' }
  ],
  knoepfe: [
    { label: '✋ Loslassen!', tue: (s, p) => {
        s.x = 100; s.v = 0; s.wolken = []; s.wackel = 0;
        s.fliegt = true; s.tank = p.luft * 1.6;
      } }
  ],
  init(s, p) {
    s.x = 100; s.v = 0; s.fliegt = false; s.tank = 0; s.wolken = []; s.wackel = 0;
  },
  schritt(s, p, dt) {
    if (s.fliegt && s.tank > 0) {
      s.tank -= dt;
      s.v += 420 * dt;
      s.wackel = Math.sin(s.zeit * 25) * 6;
      if (Math.random() < 0.7) s.wolken.push({ x: s.x - 30, y: 220 + s.wackel, r: 6, leben: 0.8 });
    } else {
      s.wackel *= 0.9;
      s.v -= s.v * 1.2 * dt; // Luftwiderstand bremst aus
      if (s.v < 3) s.v = 0;
    }
    s.x += s.v * dt;
    if (s.x > s.w - 40) { s.x = s.w - 40; s.v = 0; }
    for (const w of s.wolken) { w.r += 25 * dt; w.leben -= dt; w.x -= 40 * dt; }
    s.wolken = s.wolken.filter(w => w.leben > 0);
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#e8f6ff', '#fdfdff');
    // Wäscheleine
    ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(s.w, 200); ctx.stroke();
    PBU.boden(ctx, s.w, s.h, 60, '#8bc34a');
    // Luftwolken hinter dem Ballon
    for (const w of s.wolken) {
      ctx.save(); ctx.globalAlpha = w.leben * 0.5;
      PBU.kreis(ctx, w.x, w.y, w.r, '#cfe8f7');
      ctx.restore();
    }
    // Ballon: Größe = Restluft
    const gr = 30 + (s.fliegt ? Math.max(0.15, s.tank / 1.6) : p.luft) * 55;
    const y = 220 + s.wackel;
    // Halterung an der Leine
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s.x, 200); ctx.lineTo(s.x, y - gr * 0.5); ctx.stroke();
    // Ballonkörper
    ctx.save();
    ctx.translate(s.x, y);
    ctx.beginPath();
    ctx.ellipse(0, 0, gr, gr * 0.72, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#e63946'; ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-gr * 0.35, -gr * 0.2, gr * 0.2, gr * 0.13, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
    // Öffnung hinten
    ctx.fillStyle = '#a92832';
    ctx.beginPath();
    ctx.moveTo(-gr, -7); ctx.lineTo(-gr - 12, -10); ctx.lineTo(-gr - 12, 10); ctx.lineTo(-gr, 7);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // Rückstoß-Pfeile
    if (s.fliegt && s.tank > 0) {
      PBU.pfeil(ctx, s.x - gr - 20, y + 40, s.x - gr - 75, y + 40, '#42a5f5', 5);
      PBU.text(ctx, 'Luft raus', s.x - gr - 48, y + 62, 14, '#42a5f5');
      PBU.pfeil(ctx, s.x + gr + 15, y - 40, s.x + gr + 70, y - 40, '#e63946', 5);
      PBU.text(ctx, 'Ballon vor!', s.x + gr + 42, y - 62, 14, '#e63946');
    }
    // Messband
    ctx.fillStyle = 'rgba(58,51,82,0.5)';
    for (let mx = 100; mx < s.w; mx += 100) {
      ctx.fillRect(mx, s.h - 60, 3, 12);
    }
    if (!s.fliegt) PBU.text(ctx, 'Puste den Ballon auf und lass ihn los!', s.w / 2, 60, 22, '#3a3352');
    else if (s.v === 0 && s.tank <= 0) PBU.text(ctx, `🏁 Geflogen bis hier!`, PBU.klemme(s.x, 150, 650), 100, 22, '#e63946');
  }
});

/* --- 4. Fallschirm --- */
function malPassagier(ctx, x, y, gr, art) { // 0 = Maus, 1 = Teddy, 2 = Elefant
  const f = gr / 44;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(f, f);
  if (art === 0) { // Maus
    PBU.kreis(ctx, -8, -15, 6, '#b9bfcc');
    PBU.kreis(ctx, 8, -15, 6, '#b9bfcc');
    PBU.kreis(ctx, -8, -15, 3, '#f7c8d4');
    PBU.kreis(ctx, 8, -15, 3, '#f7c8d4');
    ctx.fillStyle = '#cfd4de';
    ctx.beginPath(); ctx.ellipse(0, 5, 11, 14, 0, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, 0, -8, 9, '#cfd4de');
    PBU.kreis(ctx, -3, -9, 1.5, '#3a3352');
    PBU.kreis(ctx, 3, -9, 1.5, '#3a3352');
    PBU.kreis(ctx, 0, -5, 2, '#f78fb3');
    ctx.strokeStyle = '#f7c8d4'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(9, 14); ctx.quadraticCurveTo(19, 12, 17, 3); ctx.stroke();
  } else if (art === 1) { // Teddy
    PBU.kreis(ctx, -8, -16, 5.5, '#a5713a');
    PBU.kreis(ctx, 8, -16, 5.5, '#a5713a');
    PBU.kreis(ctx, -8, -16, 2.6, '#d9a86b');
    PBU.kreis(ctx, 8, -16, 2.6, '#d9a86b');
    ctx.fillStyle = '#b07a3f';
    ctx.beginPath(); ctx.ellipse(0, 7, 12, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d9a86b';
    ctx.beginPath(); ctx.ellipse(0, 9, 7, 8, 0, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, -12, 1, 4.5, '#b07a3f');
    PBU.kreis(ctx, 12, 1, 4.5, '#b07a3f');
    PBU.kreis(ctx, 0, -9, 10, '#b07a3f');
    PBU.kreis(ctx, 0, -5.5, 4.5, '#d9a86b');
    PBU.kreis(ctx, -3.5, -11, 1.6, '#3a3352');
    PBU.kreis(ctx, 3.5, -11, 1.6, '#3a3352');
    PBU.kreis(ctx, 0, -7, 1.9, '#3a3352');
  } else { // Elefant
    ctx.fillStyle = '#9aa3b5';
    ctx.beginPath(); ctx.ellipse(-11, -8, 7, 9, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(11, -8, 7, 9, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#aeb6c6';
    ctx.beginPath(); ctx.ellipse(0, 8, 13, 12, 0, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, 0, -8, 10, '#aeb6c6');
    ctx.strokeStyle = '#aeb6c6'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.quadraticCurveTo(2, 6, 9, 8); ctx.stroke();
    PBU.kreis(ctx, -3.5, -11, 1.6, '#3a3352');
    PBU.kreis(ctx, 3.5, -11, 1.6, '#3a3352');
  }
  ctx.restore();
}
Baukasten.demo('wasser', {
  id: 'fallschirm',
  name: 'Fallschirm-Flug',
  emoji: '🪂',
  frage: 'Wie groß muss der Schirm sein, damit Teddy sanft landet?',
  erklaerung: `Der Fallschirm fängt beim Fallen <b>ganz viel Luft</b> ein –
    und die Luft drückt dagegen und <b>bremst</b>. Je größer der Schirm,
    desto mehr Luft bremst mit, desto sanfter die Landung. Hilf Teddy sicher runter!`,
  wow: `Fallschirmspringer fallen zuerst mit <b>200 km/h</b>! Mit offenem Schirm sind es
    nur noch etwa 20 km/h – so schnell, wie wenn du vom Stuhl hüpfst.`,
  params: [
    { key: 'schirm', label: 'Schirm-Größe', min: 10, max: 100, step: 1, start: 40,
      format: v => v < 30 ? '☂️ Winzig' : v < 65 ? '🪂 Mittel' : '🎪 Riesig' },
    { key: 'gewicht', label: 'Wer springt?', min: 1, max: 4, step: 0.1, start: 2,
      format: v => v < 2 ? '🐭 Maus' : v < 3 ? '🧸 Teddy' : '🐘 Elefant' }
  ],
  knoepfe: [
    { label: '🛫 Absprung!', tue: (s, p) => {
        s.y = 60; s.vy = 0; s.laeuft = true; s.gelandet = false; s.x = 250 + Math.random() * 300;
      } }
  ],
  init(s, p) { s.y = 60; s.vy = 0; s.laeuft = false; s.gelandet = false; s.x = 400; s.landeTempo = 0; },
  schritt(s, p, dt) {
    if (!s.laeuft) { PBU.konfettiSchritt(s, dt); return; }
    const g = 420;
    const bremse = 0.000022 * (p.schirm * p.schirm) / p.gewicht;
    s.vy += (g - bremse * s.vy * s.vy) * dt;
    if (s.vy < 0) s.vy = 0;
    s.y += s.vy * dt;
    s.x += Math.sin(s.zeit * 2) * 18 * dt;
    if (s.y >= 385) {
      s.y = 385; s.laeuft = false; s.gelandet = true;
      s.landeTempo = s.vy;
      if (s.vy < 120) {
        PBU.konfettiStart(s, s.x, 380, 40);
        Baukasten.ton(523, 0.15, 'triangle'); setTimeout(() => Baukasten.ton(659, 0.25, 'triangle'), 120);
      } else {
        Baukasten.ton(90, 0.3, 'square', 0.15);
      }
    }
    PBU.konfettiSchritt(s, dt);
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h);
    PBU.emoji(ctx, '☁️', 150, 100, 55);
    PBU.emoji(ctx, '☁️', 600, 160, 45);
    PBU.emoji(ctx, '🛩️', 100, 50, 50);
    PBU.boden(ctx, s.w, s.h, 70, '#8bc34a');
    PBU.malBlume(ctx, 150, 445, 30);
    PBU.malBlume(ctx, 660, 445, 30, '#e6399b');
    const figurArt = p.gewicht < 2 ? 0 : p.gewicht < 3 ? 1 : 2;
    const schirmR = 12 + p.schirm * 0.9;
    if (s.laeuft || (!s.gelandet && s.y <= 61)) {
      // Schirm
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.arc(s.x, s.y - 55, schirmR, Math.PI, 0);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#a92832'; ctx.lineWidth = 3; ctx.stroke();
      // Leinen
      ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 2;
      for (const lx of [-1, -0.4, 0.4, 1]) {
        ctx.beginPath();
        ctx.moveTo(s.x + lx * schirmR * 0.9, s.y - 55);
        ctx.lineTo(s.x, s.y - 10);
        ctx.stroke();
      }
      // Luft-Brems-Pfeile unterm Schirm
      if (s.laeuft && s.vy > 60) {
        const st = PBU.klemme(s.vy * 0.15, 10, 50);
        PBU.pfeil(ctx, s.x - schirmR - 18, s.y - 30, s.x - schirmR - 18, s.y - 30 - st, '#42a5f5', 4);
        PBU.pfeil(ctx, s.x + schirmR + 18, s.y - 30, s.x + schirmR + 18, s.y - 30 - st, '#42a5f5', 4);
      }
    }
    malPassagier(ctx, s.x, s.y + (s.gelandet ? 12 : 0), 46, figurArt);
    PBU.konfettiMalen(ctx, s);
    // Tempo-Anzeige
    if (s.laeuft) {
      const tempoText = s.vy < 100 ? '🐢 Schön langsam' : s.vy < 200 ? '🏃 Ganz schön flott' : '⚡ Viel zu schnell!';
      PBU.text(ctx, tempoText, s.w / 2, 40, 22, '#3a3352');
    }
    if (s.gelandet) {
      PBU.text(ctx, s.landeTempo < 120 ? '🎉 Sanfte Landung – super Schirm!' : '💥 Autsch! Der Schirm war zu klein!',
        s.w / 2, 40, 24, s.landeTempo < 120 ? '#2c8a1e' : '#e63946');
    }
  }
});
