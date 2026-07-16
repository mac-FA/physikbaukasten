'use strict';
/* ===== Welt 1: Kraft & Bewegung ===== */
Baukasten.welt({
  id: 'bewegung',
  name: 'Kraft & Bewegung',
  emoji: '🛷',
  farbe: '#e63946',
  beschreibung: 'Schubsen, rutschen, krachen – warum Dinge losflitzen und wieder stehen bleiben.'
});

/* --- 1. Anschubsen: Reibung & Trägheit --- */
Baukasten.demo('bewegung', {
  id: 'anschubsen',
  name: 'Der Schlitten-Schubser',
  emoji: '🛷',
  frage: 'Wie weit rutscht der Schlitten auf Eis, Wiese oder Sand?',
  erklaerung: `Einmal angeschubst, will der Schlitten einfach <b>weiterfahren</b> – von ganz alleine!
    Nur der Boden bremst ihn: Er reibt am Schlitten wie eine unsichtbare Hand.
    Auf glattem Eis reibt fast nichts, im Sand ganz doll.
    Und Vorsicht: Am Ende wartet ein Zaun – mit genug Schwung kracht es! 💥`,
  wow: `Im Weltall gibt es keinen Boden und keine Luft, die bremsen. Ein Ball, den du dort wirfst,
    fliegt <b>für immer</b> weiter – ohne je müde zu werden!`,
  params: [
    { key: 'boden', label: 'Boden', min: 0, max: 1, step: 0.01, start: 0.1,
      format: v => v < 0.25 ? '⛸️ Glattes Eis' : v < 0.6 ? '🌿 Wiese' : '🏖️ Tiefer Sand' },
    { key: 'kraft', label: 'Schubs-Kraft', min: 100, max: 500, step: 10, start: 300,
      format: v => v < 220 ? '🤏 Sanft' : v < 380 ? '💪 Kräftig' : '🦍 Mega!' }
  ],
  knoepfe: [
    { label: '👉 Anschubsen!', tue: (s, p) => {
        // Nur zurück an den Start, wenn der Schlitten durch den Zaun weg ist
        if (s.weg || (s.crash && s.crash.stufe === 3)) {
          s.x = 80; s.spur = []; s.crash = null; s.weg = false;
          s.zaunKaputt = false; s.zaunTeile = []; s.kidDreh = 0;
        }
        if (s.crash) s.crash = null;
        s.v = p.kraft;
        s.geschoben = 0.4;
        Baukasten.ton(220 + p.kraft / 3, 0.2, 'square', 0.08);
      } }
  ],
  init(s) {
    s.x = 80; s.v = 0; s.geschoben = 0; s.spur = []; s.weiteste = 0;
    s.crash = null; s.weg = false; s.zaunKaputt = false; s.zaunTeile = []; s.kidDreh = 0;
    s.zaunX = 700;
  },
  schritt(s, p, dt) {
    if (s.geschoben > 0) s.geschoben -= dt;
    if (s.crash) { s.crash.timer -= dt; if (s.crash.timer <= 0 && s.crash.stufe < 3) s.crash = null; }
    if (s.kidDreh > 0) s.kidDreh -= dt;
    // fliegende Zaunlatten
    for (const t of s.zaunTeile) {
      t.vy += 700 * dt;
      t.x += t.vx * dt; t.y += t.vy * dt; t.rot += t.rotV * dt;
    }
    s.zaunTeile = s.zaunTeile.filter(t => t.y < 600);
    if (s.weg) { // durch den Zaun: einfach weiterfahren, raus aus dem Bild
      s.x += s.v * dt;
      return;
    }
    if (s.v > 0) {
      const bremse = 30 + p.boden * 470;
      s.v -= bremse * dt;
      if (s.v < 0) s.v = 0;
      s.x += s.v * dt;
      // Zaun-Crash!
      if (!s.zaunKaputt && s.x + 38 >= s.zaunX && s.v > 0) {
        const stufe = s.v < 150 ? 1 : s.v < 300 ? 2 : 3;
        if (stufe === 3) {
          s.zaunKaputt = true; s.weg = true;
          s.v *= 0.75;
          s.crash = { stufe: 3, timer: 3 };
          for (let i = 0; i < 4; i++) {
            s.zaunTeile.push({
              x: s.zaunX + 5, y: 330 + i * 22,
              vx: 120 + Math.random() * 180, vy: -150 - Math.random() * 180,
              rot: 0, rotV: (Math.random() - 0.5) * 14
            });
          }
          PBU.konfettiStart(s, s.zaunX, 360, 30);
          Baukasten.ton(80, 0.3, 'square', 0.18);
          setTimeout(() => Baukasten.ton(60, 0.4, 'sawtooth', 0.12), 100);
        } else if (stufe === 2) {
          s.x = s.zaunX - 38; s.v = -s.v * 0.25;
          s.crash = { stufe: 2, timer: 1.8 };
          s.kidDreh = 1.2;
          Baukasten.ton(100, 0.2, 'square', 0.16);
        } else {
          s.x = s.zaunX - 38; s.v = 0;
          s.crash = { stufe: 1, timer: 1.5 };
          Baukasten.ton(170, 0.12, 'square', 0.08);
        }
      }
      if (s.v < 0) { // kleiner Rückprall nach Stufe-2-Crash
        s.x += s.v * dt;
        s.v += 200 * dt;
        if (s.v > 0) s.v = 0;
      }
      // Schleifspur: nur alle paar Zentimeter ein Punkt (kein Geister-Fleck!)
      if (!s.spur.length || s.x - s.spur[s.spur.length - 1].x > 16) {
        s.spur.push({ x: s.x, leben: 2.2 });
      }
      s.weiteste = Math.max(s.weiteste, Math.min(s.x, s.zaunX - 45));
    }
    for (const t of s.spur) t.leben -= dt;
    s.spur = s.spur.filter(t => t.leben > 0);
    PBU.konfettiSchritt(s, dt);
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h);
    const bodenFarbe = p.boden < 0.25 ? '#cfeffd' : p.boden < 0.6 ? '#8bc34a' : '#eecf8a';
    PBU.boden(ctx, s.w, s.h, 90, bodenFarbe);
    if (p.boden >= 0.6) {
      ctx.fillStyle = '#e0b96a';
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(40 + i * 65, s.h - 88, 12, Math.PI, 0);
        ctx.fill();
      }
    } else if (p.boden >= 0.25) {
      ctx.strokeStyle = '#5a9e2f'; ctx.lineWidth = 3;
      for (let i = 0; i < 20; i++) {
        const gx = 30 + i * 40;
        ctx.beginPath(); ctx.moveTo(gx, s.h - 88); ctx.lineTo(gx - 4, s.h - 102); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx, s.h - 88); ctx.lineTo(gx + 4, s.h - 100); ctx.stroke();
      }
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 15; i++) {
        const gx = (i * 137 + 50) % s.w;
        ctx.fillRect(gx, s.h - 70 + (i * 53) % 50, 4, 4);
      }
    }
    // Schleifspur
    for (const t of s.spur) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.5, t.leben / 2.2 * 0.5);
      PBU.kreis(ctx, t.x - 22, s.h - 84, 4, '#8a8a94');
      ctx.restore();
    }
    // Rekord-Fahne (nicht direkt am Zaun)
    if (s.weiteste > 130 && s.weiteste < s.zaunX - 60) {
      PBU.emoji(ctx, '🚩', s.weiteste + 10, s.h - 118, 28);
    }
    // Zaun
    if (!s.zaunKaputt) {
      ctx.fillStyle = '#8a5a2b';
      const zitter = s.crash && s.crash.stufe === 2 && s.crash.timer > 1.3 ? Math.sin(s.zeit * 50) * 3 : 0;
      ctx.fillRect(s.zaunX + zitter, 315, 10, 95);       // Pfosten
      ctx.fillRect(s.zaunX + 26 + zitter, 315, 10, 95);
      for (let i = 0; i < 4; i++) ctx.fillRect(s.zaunX - 4 + zitter, 322 + i * 24, 44, 10); // Latten
    } else {
      ctx.fillStyle = '#8a5a2b';
      ctx.fillRect(s.zaunX, 385, 10, 25);   // Stummel
      ctx.fillRect(s.zaunX + 26, 390, 10, 20);
    }
    for (const t of s.zaunTeile) {
      ctx.save();
      ctx.translate(t.x, t.y); ctx.rotate(t.rot);
      ctx.fillStyle = '#8a5a2b'; ctx.fillRect(-22, -5, 44, 10);
      ctx.restore();
    }
    // Schlitten (selbst gezeichnet, schön kräftig)
    const y = s.h - 104;
    if (!s.weg || s.x < s.w + 70) {
      ctx.save();
      ctx.translate(s.x, y);
      if (s.crash && s.crash.stufe >= 2 && !s.weg) ctx.rotate(-0.12);
      // Kufen
      ctx.strokeStyle = '#6b4a1e'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-34, 16); ctx.lineTo(28, 16);
      ctx.quadraticCurveTo(40, 16, 40, 2);
      ctx.stroke();
      // Körper
      PBU.kasten(ctx, -34, -4, 64, 16, '#c1272d', 6);
      PBU.kasten(ctx, -34, -4, 64, 5, '#e05a5e', 3);
      ctx.restore();
      // Kind (dreht bei Stufe-2-Crash einen Purzelbaum)
      ctx.save();
      ctx.translate(s.x, y - 26);
      if (s.kidDreh > 0) ctx.rotate((1.2 - s.kidDreh) * 5.5);
      PBU.malKind(ctx, -6, 22, 46, true);
      ctx.restore();
      // Crash-Sterne kreisen um den Kopf
      if (s.crash && s.crash.stufe === 2) {
        for (let i = 0; i < 3; i++) {
          const w = s.zeit * 6 + i * 2.1;
          PBU.emoji(ctx, '⭐', s.x + Math.cos(w) * 26, y - 48 + Math.sin(w) * 9, 16);
        }
      }
    }
    if (s.geschoben > 0) {
      PBU.emoji(ctx, '👉', s.x - 52, y - 8, 40);
      PBU.pfeil(ctx, s.x - 94, y - 8, s.x - 60, y - 8, '#e63946', 6);
    }
    PBU.konfettiMalen(ctx, s);
    // Schwung-Pfeil
    if (s.v > 1 && !s.weg) {
      PBU.pfeil(ctx, s.x + 30, y - 55, s.x + 30 + s.v * 0.25, y - 55, '#42a5f5', 5);
      PBU.text(ctx, 'Schwung', s.x + 30, y - 75, 15, '#42a5f5', 'left');
    }
    // Meldungen
    let text = 'Drück auf „Anschubsen“!';
    if (s.v > 1 && !s.crash) text = '';
    if (s.v === 0 && s.weiteste > 130 && !s.crash && !s.weg) text = 'Angehalten – der Boden hat gebremst!';
    if (s.crash) {
      if (s.crash.stufe === 1) text = '💫 Plopp! Sanft am Zaun angedockt.';
      if (s.crash.stufe === 2) text = '💥 KRACH! Voll in den Zaun!';
      if (s.crash.stufe === 3) text = s.x > s.w + 60 ? 'Und weg ist er! 👋 Durch den Zaun und tschüss!' : '🌟💥 MEGA-CRASH! Durch den Zaun!';
    }
    if (text) PBU.text(ctx, text, s.w / 2, 60, 23, '#3a3352');
  }
});

/* --- 2. Schwer und leicht: Masse --- */
Baukasten.demo('bewegung', {
  id: 'masse',
  name: 'Schwer oder leicht?',
  emoji: '📦',
  frage: 'Warum ist eine volle Kiste so viel schwerer anzuschieben?',
  erklaerung: `Gleicher Schubs, ganz anderes Ergebnis! Eine <b>leichte</b> Kiste flitzt sofort los.
    Eine <b>schwere</b> Kiste ist träge – sie kommt nur langsam in Schwung.
    Je mehr in der Kiste drin ist, desto sturer ist sie. Und an der Mauer siehst du,
    wie viel Wucht die Kiste mitbringt!`,
  wow: `Deshalb brauchen große Schiffe <b>kilometerweit</b>, um zu bremsen –
    so viel Gewicht will einfach weiterfahren!`,
  params: [
    { key: 'gewicht', label: 'Kisten-Inhalt', min: 1, max: 10, step: 0.5, start: 2,
      format: v => v < 3 ? '🎈 Luftballons' : v < 7 ? '📚 Bücher' : '🥌 Steine' },
    { key: 'kraft', label: 'Schubs-Kraft', min: 100, max: 600, step: 10, start: 300,
      format: v => v < 250 ? '🤏 Sanft' : v < 450 ? '💪 Kräftig' : '🦍 Mega!' }
  ],
  knoepfe: [
    { label: '👉 Anschieben!', tue: (s, p) => {
        s.v += p.kraft / p.gewicht;
        s.wackel = 0.35;
        Baukasten.ton(160 + 300 / p.gewicht, 0.25, 'square', 0.08);
      } }
  ],
  init(s) { s.x = 110; s.v = 0; s.wackel = 0; s.krach = null; s.wandX = 690; },
  schritt(s, p, dt) {
    if (s.wackel > 0) s.wackel -= dt;
    if (s.krach) { s.krach.timer -= dt; if (s.krach.timer <= 0) s.krach = null; }
    PBU.konfettiSchritt(s, dt);
    const gr = 55 + p.gewicht * 6;
    if (s.v > 0) {
      s.v -= 90 * dt;
      if (s.v < 0) s.v = 0;
      s.x += s.v * dt;
      // Mauer-Crash
      if (s.x + gr / 2 >= s.wandX && s.v > 0) {
        s.x = s.wandX - gr / 2;
        const wucht = s.v * (1 + p.gewicht * 0.15);
        s.krach = { wucht, timer: 1.6 };
        if (wucht >= 300) {
          PBU.konfettiStart(s, s.wandX - 20, 340, 35);
          Baukasten.ton(70, 0.35, 'square', 0.2);
        } else if (wucht >= 140) {
          Baukasten.ton(100, 0.2, 'square', 0.15);
        } else {
          Baukasten.ton(180, 0.1, 'square', 0.07);
        }
        s.v = -s.v * 0.18;
      }
    } else if (s.v < 0) {
      s.x += s.v * dt;
      s.v += 250 * dt;
      if (s.v > 0) s.v = 0;
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#ffe8d1', '#fff6ec');
    PBU.boden(ctx, s.w, s.h, 80, '#c8a165');
    const y = s.h - 80;
    const gr = 55 + p.gewicht * 6;
    // Mauer rechts (zittert beim Crash)
    const zitter = s.krach && s.krach.timer > 1.2 ? Math.sin(s.zeit * 45) * Math.min(5, s.krach.wucht / 70) : 0;
    ctx.save();
    ctx.translate(zitter, 0);
    ctx.fillStyle = '#a85f38';
    ctx.fillRect(s.wandX, y - 190, 44, 190);
    ctx.strokeStyle = '#7c4325'; ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath(); ctx.moveTo(s.wandX, y - 185 + i * 27); ctx.lineTo(s.wandX + 44, y - 185 + i * 27); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.wandX + (i % 2 ? 14 : 28), y - 185 + i * 27); ctx.lineTo(s.wandX + (i % 2 ? 14 : 28), y - 158 + i * 27); ctx.stroke();
    }
    ctx.restore();
    // Kiste
    ctx.save();
    if (s.wackel > 0) ctx.translate(0, Math.sin(s.zeit * 40) * 2);
    if (s.krach && s.krach.timer > 1.2) ctx.translate(0, 0), ctx.transform(0.96, 0, 0, 1, s.x * 0.04, 0); // kurz gequetscht
    PBU.kasten(ctx, s.x - gr / 2, y - gr, gr, gr, '#b07a3f');
    ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 4;
    ctx.strokeRect(s.x - gr / 2, y - gr, gr, gr);
    ctx.beginPath(); ctx.moveTo(s.x - gr / 2, y - gr / 2); ctx.lineTo(s.x + gr / 2, y - gr / 2); ctx.stroke();
    const inhaltY = y - gr / 2 - gr / 4;
    if (p.gewicht < 3) PBU.malBallon(ctx, s.x, inhaltY, gr / 5.5);
    else if (p.gewicht < 7) PBU.malBuecher(ctx, s.x, inhaltY, gr / 2.8);
    else PBU.malStein(ctx, s.x, inhaltY, gr / 5.2);
    ctx.restore();
    // Figur (kräftig gezeichnet – Emojis sind auf Win10 zu blass)
    PBU.malSchieber(ctx, s.x - gr / 2 - 32, y, s.wackel > 0);
    if (s.wackel > 0) PBU.pfeil(ctx, s.x - gr / 2 - 70, y - gr / 2, s.x - gr / 2 - 8, y - gr / 2, '#e63946', 6);
    // Schwung-Pfeil
    if (s.v > 1) {
      PBU.pfeil(ctx, s.x, y - gr - 30, s.x + s.v * 0.3, y - gr - 30, '#42a5f5', 5);
    }
    // Crash-Anzeige
    PBU.konfettiMalen(ctx, s);
    if (s.krach) {
      const w = s.krach.wucht;
      const boom = w >= 300 ? 70 : w >= 140 ? 46 : 28;
      if (s.krach.timer > 0.9) PBU.emoji(ctx, '💥', s.wandX - 14, y - gr / 2 - 20, boom);
      const text = w >= 300 ? '🌟💥 WUMMS!!! Was für eine Wucht!' : w >= 140 ? '💥 KRACH! Ordentlich Schwung dahinter!' : '💫 Bumm. Nur ein Stupserchen.';
      PBU.text(ctx, text, s.w / 2, 60, 22, '#3a3352');
    }
    PBU.text(ctx, `Gewicht: ${'🏋️'.repeat(Math.ceil(p.gewicht / 3.4))}`, 120, 50, 20, '#3a3352', 'left');
    if (s.v < 1 && s.x < 150 && !s.krach) PBU.text(ctx, 'Gleiche Kraft – wie schnell wird die Kiste?', s.w / 2, 90, 20, '#6b6489');
  }
});

/* --- 3. Aufprall: Stöße --- */
Baukasten.demo('bewegung', {
  id: 'aufprall',
  name: 'Kugel-Crash',
  emoji: '🎱',
  frage: 'Was passiert, wenn eine kleine Kugel eine große rammt?',
  erklaerung: `Beim Zusammenstoß gibt die rollende Kugel ihren <b>Schwung weiter</b> – wie beim Billard!
    Und auf diesem Tisch geht es hin und her: Die Kugeln prallen an den Banden ab und
    treffen sich <b>wieder und wieder</b>. Schau zu, wie der Schwung bei jedem Stoß
    den Besitzer wechselt – bis er ganz aufgebraucht ist.`,
  wow: `Genau so schützt dich ein Auto-Airbag: Er nimmt deinen Schwung ganz
    <b>langsam und weich</b> auf, statt ruckartig. Sanft bremsen tut nicht weh.`,
  params: [
    { key: 'm1', label: 'Rote Kugel', min: 1, max: 10, step: 0.5, start: 3,
      format: v => v < 4 ? '🔴 Klein' : v < 7 ? '🔴 Mittel' : '🔴 Riesig' },
    { key: 'm2', label: 'Blaue Kugel', min: 1, max: 10, step: 0.5, start: 7,
      format: v => v < 4 ? '🔵 Klein' : v < 7 ? '🔵 Mittel' : '🔵 Riesig' },
    { key: 'tempo', label: 'Anrollen', min: 100, max: 350, step: 10, start: 220,
      format: v => v < 180 ? '🐢 Gemütlich' : v < 280 ? '🚶 Flott' : '🐇 Schnell' }
  ],
  neustartBei: ['m1', 'm2'],
  knoepfe: [
    { label: '🎳 Losrollen!', tue: (s, p) => {
        s.x1 = 100; s.x2 = 450; s.v1 = p.tempo; s.v2 = 0; s.stoesse = 0;
      } }
  ],
  init(s, p) {
    s.x1 = 100; s.x2 = 450; s.v1 = 0; s.v2 = 0; s.blitz = 0; s.stoesse = 0; s.tonPause = 0;
  },
  schritt(s, p, dt) {
    const r1 = 15 + p.m1 * 3.5, r2 = 15 + p.m2 * 3.5;
    s.x1 += s.v1 * dt; s.x2 += s.v2 * dt;
    if (s.tonPause > 0) s.tonPause -= dt;
    // Stoß – immer wieder, sooft sie sich treffen!
    if (s.x1 + r1 >= s.x2 - r2 && s.v1 > s.v2) {
      const m1 = p.m1, m2 = p.m2, u1 = s.v1, u2 = s.v2;
      s.v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
      s.v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);
      // Überlappung sauber auflösen, damit nichts durchrutscht
      const ueber = (s.x1 + r1) - (s.x2 - r2);
      s.x1 -= ueber / 2; s.x2 += ueber / 2;
      const wucht = Math.abs(u1 - u2);
      if (wucht > 20) {
        s.blitz = 0.3;
        s.stoesse++;
        if (s.tonPause <= 0) {
          Baukasten.ton(90 + Math.min(wucht, 300) * 0.4, 0.12, 'square', Math.min(0.16, 0.04 + wucht / 2000));
          s.tonPause = 0.09;
        }
      }
    }
    if (s.blitz > 0) s.blitz -= dt;
    // Banden links und rechts – für beide Kugeln
    if (s.x1 - r1 < 0 && s.v1 < 0) { s.x1 = r1; s.v1 = -s.v1 * 0.96; }
    if (s.x2 - r2 < 0 && s.v2 < 0) { s.x2 = r2; s.v2 = -s.v2 * 0.96; }
    if (s.x1 + r1 > s.w && s.v1 > 0) { s.x1 = s.w - r1; s.v1 = -s.v1 * 0.96; }
    if (s.x2 + r2 > s.w && s.v2 > 0) { s.x2 = s.w - r2; s.v2 = -s.v2 * 0.96; }
    // ganz sachte Rollreibung, damit es irgendwann gemütlich ausklingt
    s.v1 *= (1 - 0.045 * dt); s.v2 *= (1 - 0.045 * dt);
  },
  malen(ctx, s, p) {
    ctx.fillStyle = '#1d7a46'; ctx.fillRect(0, 0, s.w, s.h);
    ctx.fillStyle = '#155c34'; ctx.fillRect(0, 0, s.w, 40); ctx.fillRect(0, s.h - 40, s.w, 40);
    const y = s.h / 2 + 30;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
    ctx.setLineDash([10, 12]);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s.w, y); ctx.stroke();
    ctx.setLineDash([]);
    const r1 = 15 + p.m1 * 3.5, r2 = 15 + p.m2 * 3.5;
    // Schatten
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(s.x1, y + r1 * 0.9, r1, r1 * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s.x2, y + r2 * 0.9, r2, r2 * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    // Kugeln
    PBU.kreis(ctx, s.x1, y, r1, '#e63946');
    PBU.kreis(ctx, s.x1 - r1 * 0.3, y - r1 * 0.3, r1 * 0.25, 'rgba(255,255,255,0.6)');
    PBU.kreis(ctx, s.x2, y, r2, '#42a5f5');
    PBU.kreis(ctx, s.x2 - r2 * 0.3, y - r2 * 0.3, r2 * 0.25, 'rgba(255,255,255,0.6)');
    // Crash-Blitz
    if (s.blitz > 0) {
      PBU.emoji(ctx, '💥', (s.x1 + s.x2) / 2, y - 50, 60);
    }
    // Schwung-Pfeile
    if (Math.abs(s.v1) > 5) PBU.pfeil(ctx, s.x1, y - r1 - 25, s.x1 + s.v1 * 0.3, y - r1 - 25, '#ffd166', 5);
    if (Math.abs(s.v2) > 5) PBU.pfeil(ctx, s.x2, y - r2 - 25, s.x2 + s.v2 * 0.3, y - r2 - 25, '#ffd166', 5);
    if (s.stoesse > 0) PBU.text(ctx, `Stöße: ${s.stoesse} ⚡`, s.w - 30, 80, 20, '#fff', 'right');
    const ruhig = Math.abs(s.v1) < 4 && Math.abs(s.v2) < 4 && s.stoesse > 0;
    PBU.text(ctx, ruhig ? 'Aller Schwung ist verbraucht – Feierabend!' : 'Der Schwung wird weitergegeben – immer wieder!',
      s.w / 2, 80, 22, '#fff');
  }
});

/* --- 4. Karussell: Trägheit & Pirouette --- */
Baukasten.demo('bewegung', {
  id: 'karussell',
  name: 'Das Ketten-Karussell',
  emoji: '🎠',
  frage: 'Was passiert, wenn du die Schnur kürzer ziehst – und dann loslässt?',
  erklaerung: `Der Ball saust im Kreis, weil die Schnur ihn <b>festhält</b>.
    Und jetzt der Zaubertrick: Zieh die Schnur <b>kürzer</b> – der Ball wirbelt von selbst
    <b>schneller</b>! Genau so macht es die Eiskunstläuferin: Arme anziehen → Turbo-Pirouette. 🩰
    Der Schwung bleibt nämlich erhalten – auf kleinerem Kreis wird daraus mehr Tempo.
    Und lässt du los, fliegt der Ball <b>schnurgerade</b> davon!`,
  wow: `Beim Hammerwerfen drehen sich Sportler ganz schnell im Kreis und lassen dann los –
    der Hammer fliegt über <b>80 Meter</b> weit. Immer schnurgerade am Anfang!`,
  params: [
    { key: 'anschwung', label: 'Anschwung (Energie)', min: 0.8, max: 4, step: 0.1, start: 1.8,
      format: v => v < 1.6 ? '🌀 Sanft' : v < 2.8 ? '🌀🌀 Kräftig' : '🌀🌀🌀 Wild!' },
    { key: 'laenge', label: 'Schnur-Länge', min: 55, max: 165, step: 1, start: 150,
      format: v => v < 92 ? '📏 Kurz gezogen!' : v < 130 ? '📏 Mittel' : '📏 Lang' }
  ],
  neustartBei: ['anschwung'],
  knoepfe: [
    { label: '✂️ Loslassen!', tue: (s, p) => {
        if (s.frei) return;
        s.frei = true;
        const cx = 400, cy = 250;
        s.bx = cx + Math.cos(s.winkel) * s.radius;
        s.by = cy + Math.sin(s.winkel) * s.radius;
        s.bvx = -Math.sin(s.winkel) * s.omega * s.radius;
        s.bvy = Math.cos(s.winkel) * s.omega * s.radius;
        Baukasten.ton(500, 0.2, 'triangle', 0.12);
      } }
  ],
  init(s, p) {
    s.winkel = 0; s.frei = false;
    s.radius = p.laenge;
    // Der Drehschwung ist der Schatz, der IMMER erhalten bleibt
    s.drehschwung = p.anschwung * p.laenge * p.laenge;
    s.omega = p.anschwung;
    s.bx = 0; s.by = 0; s.bvx = 0; s.bvy = 0; s.spur = [];
  },
  schritt(s, p, dt) {
    if (!s.frei) {
      // Schnur sanft auf Wunschlänge kurbeln
      s.radius += (p.laenge - s.radius) * Math.min(1, 4 * dt);
      // Pirouetten-Effekt: Tempo folgt immer aus dem gespeicherten Drehschwung.
      // So kommt beim Wieder-Verlängern exakt das alte Tempo zurück – nichts geht verloren!
      s.omega = Math.min(13, s.drehschwung / (s.radius * s.radius));
      s.winkel += s.omega * dt;
      s.spur = [];
    } else {
      s.bx += s.bvx * dt; s.by += s.bvy * dt;
      s.spur.push({ x: s.bx, y: s.by });
      if (s.spur.length > 60) s.spur.shift();
      if (s.bx < -60 || s.bx > s.w + 60 || s.by < -60 || s.by > s.h + 60) {
        s.frei = false;
      }
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#d9c8f5', '#f4eefc');
    const cx = 400, cy = 250;
    // Kreisbahn
    ctx.setLineDash([8, 10]);
    PBU.ring(ctx, cx, cy, s.radius, 'rgba(58,51,82,0.25)', 2);
    ctx.setLineDash([]);
    // Mast
    PBU.kreis(ctx, cx, cy, 26, '#b565d8');
    PBU.kreis(ctx, cx, cy, 12, '#8e44ad');
    PBU.emoji(ctx, '🎪', cx, cy - 48, 40);
    const bx = s.frei ? s.bx : cx + Math.cos(s.winkel) * s.radius;
    const by = s.frei ? s.by : cy + Math.sin(s.winkel) * s.radius;
    // Schnur
    if (!s.frei) {
      ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
    }
    // Flugspur
    ctx.strokeStyle = 'rgba(230,57,70,0.5)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    s.spur.forEach((t, i) => i === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y));
    ctx.stroke();
    // Ball
    PBU.malBall(ctx, bx, by, 18, 1);
    // Richtungs-Pfeil (Tangente)
    if (!s.frei) {
      const tx = -Math.sin(s.winkel), ty = Math.cos(s.winkel);
      const pl = PBU.klemme(20 + s.omega * s.radius * 0.09, 25, 90);
      PBU.pfeil(ctx, bx, by, bx + tx * pl, by + ty * pl, '#42a5f5', 4);
    }
    // Wirbel-Tacho
    if (!s.frei) {
      const stufe = s.omega < 2 ? '🐌 gemütlich' : s.omega < 4.5 ? '🎠 flott' : s.omega < 8 ? '🌀 wirbelig' : '🌪️ TURBO-PIROUETTE!';
      PBU.text(ctx, `Wirbel-Tempo: ${stufe}`, s.w / 2, 40, 22, '#3a3352');
      PBU.text(ctx, 'Zieh die Schnur kürzer und schau, was passiert!', s.w / 2, 465, 17, '#6b6489');
    } else {
      PBU.text(ctx, 'Schnurgerade davon!', s.w / 2, 40, 24, '#3a3352');
    }
  }
});
