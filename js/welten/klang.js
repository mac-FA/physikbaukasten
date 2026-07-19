'use strict';
/* ===== Welt 5: Klang & Schwingung ===== */
Baukasten.welt({
  id: 'klang',
  name: 'Klang & Schwingung',
  emoji: '🎵',
  farbe: '#b565d8',
  beschreibung: 'Zupfen, schwingen, lauschen – woher kommen hohe und tiefe Töne?'
});

/* --- 1. Gummiband-Gitarre --- */
Baukasten.demo('klang', {
  id: 'gitarre',
  name: 'Die Gummiband-Gitarre',
  emoji: '🎸',
  frage: 'Warum klingt eine kurze Saite höher als eine lange?',
  erklaerung: `Ton ist <b>Zittern</b>! Wenn die Saite ganz schnell hin- und herwackelt,
    wackelt auch die Luft – und dein Ohr hört einen Ton.
    <b>Kurze, stramme</b> Saiten zittern schnell → hoher Ton.
    <b>Lange, lockere</b> Saiten zittern langsam → tiefer Ton. Zupf mal! (Ton anschalten 🔔)`,
  wow: `Eine Hummel brummt, weil ihre Flügel <b>200-mal pro Sekunde</b> schlagen.
    Deine Stimme kommt von zwei kleinen Bändern im Hals, die genauso zittern – fass mal an beim Summen!`,
  params: [
    { key: 'laenge', label: 'Saiten-Länge', min: 200, max: 560, step: 2, start: 400,
      format: v => v < 320 ? '📏 Kurz' : v < 460 ? '📏 Mittel' : '📏 Lang' },
    { key: 'spannung', label: 'Straffheit', min: 0.5, max: 2, step: 0.01, start: 1,
      format: v => v < 0.9 ? '🥱 Locker' : v < 1.5 ? '👌 Mittel' : '💪 Stramm' }
  ],
  knoepfe: [
    { label: '🎸 Zupfen!', tue: (s, p) => {
        s.ampl = 26;
        const freq = 60000 * p.spannung / p.laenge;
        s.freq = freq;
        Baukasten.ton(freq, 1.2, 'triangle', 0.22);
      } }
  ],
  init(s) { s.ampl = 0; s.freq = 150; s.phase = 0; },
  schritt(s, p, dt) {
    s.ampl *= (1 - 1.1 * dt);
    if (s.ampl < 0.3) s.ampl = 0;
    s.phase += dt * PBU.klemme(s.freq * 0.15, 8, 40);
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#f3e5f5', '#fdf7ff');
    // Brett
    PBU.kasten(ctx, 60, 180, 680, 140, '#b07a3f', 16);
    ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 5;
    ctx.strokeRect(60, 180, 680, 140);
    // zwei Nägel
    const x1 = 400 - p.laenge / 2, x2 = 400 + p.laenge / 2, y = 250;
    PBU.kreis(ctx, x1, y, 10, '#3a3352');
    PBU.kreis(ctx, x2, y, 10, '#3a3352');
    // Saite als schwingende Kurve – tiefschwarz für satten Kontrast
    ctx.strokeStyle = '#111118'; ctx.lineWidth = 3 + (2 - p.spannung);
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const sx = x1 + (x2 - x1) * t;
      const sy = y + Math.sin(t * Math.PI) * Math.sin(s.phase * 6) * s.ampl;
      i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    // Unschärfe-Geist der Schwingung
    if (s.ampl > 2) {
      ctx.save(); ctx.globalAlpha = 0.25;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const sx = x1 + (x2 - x1) * t;
        const sy = y - Math.sin(t * Math.PI) * Math.sin(s.phase * 6) * s.ampl;
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.restore();
    }
    // Schallwellen zum Ohr
    if (s.ampl > 2) {
      const n = Math.round(PBU.klemme(s.freq / 60, 2, 7));
      for (let i = 0; i < n; i++) {
        ctx.save();
        ctx.globalAlpha = 0.5 - i * 0.06;
        PBU.ring(ctx, 400, y, 40 + i * (200 / n) + (s.zeit * 80) % (200 / n), '#b565d8', 3);
        ctx.restore();
      }
    }
    PBU.emoji(ctx, '👂', 730, 100, 44);
    const freqNow = 60000 * p.spannung / p.laenge;
    const note = freqNow < 120 ? '🐻 Brumm-tief' : freqNow < 200 ? '🎵 Mittel' : freqNow < 300 ? '🎶 Hoch' : '🐭 Piepsig!';
    PBU.text(ctx, note, s.w / 2, 90, 26, '#3a3352');
    PBU.text(ctx, s.ampl > 2 ? 'Die Saite zittert – das IST der Ton!' : 'Drück auf Zupfen!', s.w / 2, 420, 20, '#6b6489');
  }
});

/* --- 2. Wellen im Wasser --- */
Baukasten.demo('klang', {
  id: 'wellen',
  name: 'Wellen-Teich',
  emoji: '🌊',
  frage: 'Reist die Ente mit der Welle mit? Tippe ins Wasser!',
  erklaerung: `Du schaust hier von OBEN auf den Teich – wie ein Vogel! Tipp irgendwo hinein:
    Die Welle breitet sich als <b>Kreis</b> aus. Und wenn der Kreis die Ente erreicht,
    hüpft sie nur <b>auf und ab</b> – sie wird kein Stückchen zur Seite geschoben!
    Eine Welle transportiert nämlich kein Wasser, nur <b>Bewegung</b>.
    Genau so reist auch der Schall durch die Luft zu deinem Ohr.`,
  wow: `Schall-Wellen von einem Gewitterdonner wandern <b>340 Meter pro Sekunde</b> durch die Luft.
    Darum siehst du den Blitz zuerst und hörst den Donner später!`,
  params: [
    { key: 'staerke', label: 'Platsch-Stärke', min: 8, max: 30, step: 1, start: 18,
      format: v => v < 14 ? '💧 Tröpfchen' : v < 24 ? '🥌 Steinchen' : '🥌 Brocken!' }
  ],
  init(s) {
    s.ringe = [];
    s.enteX = 520; s.enteY = 172;
    s.bob = 0; s.platsch = 0;
  },
  zeiger(s, p, typ, x, y) {
    if (typ !== 'runter') return;
    if (x > 50 && x < 750 && y > 44 && y < 300) {
      s.ringe.push({ x, y, r: 6, staerke: p.staerke, leben: 4 });
      Baukasten.ton(200 + Math.random() * 100, 0.15, 'sine', 0.1);
    }
  },
  schritt(s, p, dt) {
    for (const r of s.ringe) { r.r += 120 * dt; r.leben -= dt; }
    s.ringe = s.ringe.filter(r => r.leben > 0);
    // Hüpf-Höhe der Ente: Summe aller Wellenfronten am Enten-Ort
    let h = 0;
    for (const r of s.ringe) {
      const d = Math.hypot(s.enteX - r.x, s.enteY - r.y);
      const front = Math.abs(d - r.r);
      if (front < 40) {
        h += Math.cos(front / 40 * Math.PI / 2) * r.staerke * PBU.klemme(r.leben / 4, 0, 1);
      }
    }
    s.bob += (h - s.bob) * 10 * dt;
    if (Math.abs(s.bob) > 8 && s.platsch <= 0) s.platsch = 0.4;
    if (s.platsch > 0) s.platsch -= dt;
  },
  malen(ctx, s, p) {
    // Sand-Ufer rundherum
    ctx.fillStyle = '#e0c68e';
    ctx.fillRect(0, 0, s.w, s.h);
    // ===== Oben: Draufsicht =====
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(40, 34, 720, 276, 50);
    else ctx.rect(40, 34, 720, 276);
    const g = ctx.createRadialGradient(400, 170, 50, 400, 170, 400);
    g.addColorStop(0, '#63b8f0');
    g.addColorStop(1, '#2a7fc4');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.clip();
    // Seerosen
    for (const [sx, sy, sr] of [[115, 95, 24], [688, 262, 26]]) {
      ctx.fillStyle = '#4d9e12';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.arc(sx, sy, sr, 0.5, 0.5 + Math.PI * 1.75);
      ctx.closePath(); ctx.fill();
      PBU.kreis(ctx, sx + sr * 0.5, sy - sr * 0.5, 6, '#f78fb3');
    }
    // Wellen als perfekte Kreise – treffen die Ente exakt dann, wenn man es sieht!
    for (const r of s.ringe) {
      const a = PBU.klemme(r.leben / 4, 0, 1);
      ctx.save();
      ctx.globalAlpha = a * 0.85;
      ctx.strokeStyle = '#eaf7ff';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = a * 0.4;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, Math.max(2, r.r - 14), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    // Markierung: hier bleibt die Ente!
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s.enteX, s.enteY, 44, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    // Platsch-Ring um die hüpfende Ente
    if (s.platsch > 0) {
      ctx.save();
      ctx.globalAlpha = s.platsch * 1.5;
      PBU.ring(ctx, s.enteX, s.enteY, 34 + (0.4 - s.platsch) * 70, '#fff', 2.5);
      ctx.restore();
    }
    // Ente von oben – beim Hüpfen kommt sie „näher ans Auge“ (wird größer)
    const hop = 1 + PBU.klemme(Math.abs(s.bob), 0, 30) * 0.012;
    ctx.save();
    ctx.translate(s.enteX, s.enteY);
    // Schatten wandert beim Hochhüpfen zur Seite
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#0d2b52';
    ctx.beginPath();
    ctx.ellipse(6 + Math.abs(s.bob) * 0.4, 9 + Math.abs(s.bob) * 0.4, 26, 17, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.scale(hop, hop);
    ctx.rotate(-0.5);
    // Körper von oben
    ctx.fillStyle = '#f5c518';
    ctx.beginPath(); ctx.ellipse(0, 0, 26, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-24, -6); ctx.lineTo(-37, 0); ctx.lineTo(-24, 6); ctx.closePath(); ctx.fill();
    // Flügel
    ctx.fillStyle = '#e0a800';
    ctx.beginPath(); ctx.ellipse(-4, -9, 13, 5.5, -0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-4, 9, 13, 5.5, 0.15, 0, Math.PI * 2); ctx.fill();
    // Kopf + Schnabel + Augen
    PBU.kreis(ctx, 20, 0, 10, '#f5c518');
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath(); ctx.moveTo(28, -4); ctx.lineTo(42, 0); ctx.lineTo(28, 4); ctx.closePath(); ctx.fill();
    PBU.kreis(ctx, 22, -5, 1.8, '#3a3352');
    PBU.kreis(ctx, 22, 5, 1.8, '#3a3352');
    ctx.restore();
    ctx.restore(); // Teich-Ausschnitt
    // ===== Unten: dieselbe Szene von der Seite =====
    PBU.kasten(ctx, 40, 330, 720, 158, '#cdeffd', 14);
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(40, 330, 720, 158, 14);
    else ctx.rect(40, 330, 720, 158);
    ctx.clip();
    // Wasseroberfläche: der Schnitt genau durch die Enten-Reihe
    const oberY = x => {
      let h = 0;
      for (const ring of s.ringe) {
        const d = Math.hypot(x - ring.x, s.enteY - ring.y);
        const front = Math.abs(d - ring.r);
        if (front < 40) h += Math.cos(front / 40 * Math.PI / 2) * ring.staerke * PBU.klemme(ring.leben / 4, 0, 1);
      }
      return 412 - h * 1.4;
    };
    ctx.fillStyle = '#3f93d6';
    ctx.beginPath();
    ctx.moveTo(40, 490);
    for (let x = 40; x <= 760; x += 8) ctx.lineTo(x, oberY(x));
    ctx.lineTo(760, 490);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#eaf7ff'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 40; x <= 760; x += 8) {
      const y = oberY(x);
      x === 40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Ente reitet auf der Oberfläche – nur hoch und runter!
    ctx.setLineDash([5, 7]);
    ctx.strokeStyle = 'rgba(58,51,82,0.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s.enteX, 340); ctx.lineTo(s.enteX, 484); ctx.stroke();
    ctx.setLineDash([]);
    PBU.malEnte(ctx, s.enteX, oberY(s.enteX) - 12, 40);
    ctx.restore();
    // Beschriftungen
    PBU.text(ctx, '🐦 VON OBEN', 116, 20, 15, '#6b5a33', 'left');
    PBU.text(ctx, '👀 VON DER SEITE', 60, 345, 14, '#3a3352', 'left');
    PBU.text(ctx, '👆 Tipp oben ins Wasser!', 620, 20, 16, '#6b5a33');
    if (Math.abs(s.bob) > 6) {
      PBU.text(ctx, 'Nur AUF und AB!', s.enteX, 358, 16, '#e63946');
    }
  }
});

/* --- 3. Pendel --- */
Baukasten.demo('klang', {
  id: 'pendel',
  name: 'Die Pendel-Uhr',
  emoji: '🕰️',
  frage: 'Was macht ein Pendel schneller – kürzere Schnur oder schwerere Kugel?',
  erklaerung: `Überraschung: Nur die <b>Schnur-Länge</b> zählt!
    Ein kurzes Pendel tickt schnell, ein langes schwingt gemächlich.
    Die <b>schwere Kugel schwingt kein bisschen schneller</b> – probier es aus!
    Deshalb steuern Pendel seit Jahrhunderten unsere Uhren.`,
  wow: `In manchen Museen hängt ein <b>riesiges Pendel</b> an einer langen Schnur von der Decke. Es braucht viele Sekunden für einen Schwung
    und beweist damit sogar, dass sich die <b>Erde dreht</b>!`,
  params: [
    { key: 'laenge', label: 'Schnur-Länge', min: 80, max: 300, step: 2, start: 180,
      format: v => v < 150 ? '📏 Kurz' : v < 240 ? '📏 Mittel' : '📏 Lang' },
    { key: 'masse', label: 'Kugel-Gewicht', min: 1, max: 5, step: 0.1, start: 2,
      format: v => v < 2.3 ? '🏐 Leicht' : v < 3.8 ? '⚽ Mittel' : '🎳 Schwer' }
  ],
  init(s, p) {
    s.winkel = 0.6; s.geschw = 0; s.ticks = 0; s.letztesVorzeichen = 1; s.tickBlitz = 0;
    s.len = p.laenge;
  },
  schritt(s, p, dt) {
    const g = 900;
    // Schnur schwingt weiter, während sie sanft auf die neue Länge kurbelt
    s.len += (p.laenge - s.len) * Math.min(1, 5 * dt);
    s.geschw += -(g / s.len) * Math.sin(s.winkel) * dt;
    s.geschw *= (1 - 0.02 * dt);
    s.winkel += s.geschw * dt;
    // Tick beim Nulldurchgang
    const vz = Math.sign(s.winkel) || 1;
    if (vz !== s.letztesVorzeichen) {
      s.letztesVorzeichen = vz;
      s.ticks++;
      s.tickBlitz = 0.15;
      Baukasten.ton(vz > 0 ? 700 : 550, 0.06, 'square', 0.07);
    }
    if (s.tickBlitz > 0) s.tickBlitz -= dt;
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#fbe9d0', '#fdf6e9');
    // Uhrengehäuse
    PBU.kasten(ctx, 250, 30, 300, 70, '#b07a3f', 14);
    PBU.emoji(ctx, '🕰️', 400, 65, 46);
    const ax = 400, ay = 100;
    const bx = ax + Math.sin(s.winkel) * s.len;
    const by = ay + Math.cos(s.winkel) * s.len;
    // Schwungbereich
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#b565d8';
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.arc(ax, ay, s.len, Math.PI / 2 - 0.65, Math.PI / 2 + 0.65);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // Schnur + Kugel
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    const r = 12 + p.masse * 5;
    PBU.kreis(ctx, bx, by, r, '#b565d8');
    PBU.kreis(ctx, bx - r * 0.3, by - r * 0.3, r * 0.25, 'rgba(255,255,255,0.6)');
    // Tick-Anzeige
    if (s.tickBlitz > 0) PBU.text(ctx, 'TICK!', ax, ay + s.len + 60, 30, '#e63946');
    PBU.text(ctx, `Ticks: ${s.ticks}`, 70, 60, 22, '#3a3352', 'left');
    PBU.text(ctx, 'Ändere das Gewicht – ändert sich das Tempo? 🤔', s.w / 2, 465, 18, '#6b6489');
  }
});

/* --- 4. Ton-Maschine --- */
Baukasten.demo('klang', {
  id: 'tonmaschine',
  name: 'Die Ton-Maschine',
  emoji: '📢',
  frage: 'Wie sieht ein hoher Ton aus? Und ein lauter?',
  erklaerung: `Hier siehst du den Ton als <b>Welle</b>:
    <b>Hoch oder tief</b> = wie <b>eng</b> die Wellenberge zusammenstehen (schnelles Zittern = hoch).
    <b>Laut oder leise</b> = wie <b>groß</b> die Wellenberge sind (starkes Zittern = laut).
    Schalte den Ton ein 🔔 und spiele mit beiden Reglern!`,
  wow: `Fledermäuse rufen so <b>extrem hohe Töne</b>, dass Menschen sie gar nicht hören können.
    Elefanten grummeln so tief, dass wir es auch nicht hören – nur ihre Freunde, kilometerweit!`,
  params: [
    { key: 'hoehe', label: 'Tonhöhe', min: 80, max: 800, step: 5, start: 260,
      format: v => v < 200 ? '🐘 Brumm-tief' : v < 450 ? '🗣️ Mittel' : '🐦 Piep-hoch' },
    { key: 'laut', label: 'Lautstärke', min: 0, max: 1, step: 0.01, start: 0.5,
      format: v => v < 0.25 ? '🤫 Flüstern' : v < 0.7 ? '🗣️ Sprechen' : '📣 Rufen!' }
  ],
  knoepfe: [
    { label: '▶️ Ton an / aus', tue: (s, p) => {
        if (s.handle) { s.handle.stop(); s.handle = null; }
        else { s.handle = Baukasten.dauerton(p.hoehe, 'sine', p.laut * 0.25); s.spielt = true; }
      } }
  ],
  init(s) {
    s.handle = null;
    s._aufraeumen = () => { if (s.handle) { s.handle.stop(); s.handle = null; } };
  },
  schritt(s, p) {
    if (s.handle) {
      s.handle.setFreq(p.hoehe);
      s.handle.setVol(p.laut * 0.25);
    }
  },
  malen(ctx, s, p) {
    ctx.fillStyle = '#1a1832';
    ctx.fillRect(0, 0, s.w, s.h);
    // Gitter wie Oszilloskop
    ctx.strokeStyle = 'rgba(120,220,160,0.12)'; ctx.lineWidth = 1;
    for (let x = 0; x < s.w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s.h); ctx.stroke(); }
    for (let y = 0; y < s.h; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s.w, y); ctx.stroke(); }
    // Welle
    const mitte = 250;
    const ampl = 20 + p.laut * 130;
    const wl = 9000 / p.hoehe; // Wellenlänge in Pixeln
    ctx.save();
    ctx.strokeStyle = '#66ffa6'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.shadowColor = '#66ffa6'; ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let x = 90; x <= s.w - 20; x += 3) {
      const y = mitte + Math.sin((x / wl) * Math.PI * 2 - s.zeit * (s.handle ? 8 : 1.5)) * ampl;
      x === 90 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
    // Lautsprecher, der mitwackelt
    const wums = s.handle ? Math.sin(s.zeit * 30) * p.laut * 5 : 0;
    PBU.emoji(ctx, '📢', 48 + wums, mitte, 62);
    PBU.text(ctx, s.handle ? '🔊 Ton läuft…' : 'Drück auf „Ton an“! (und 🔔 oben rechts)', s.w / 2, 60, 22, '#fff');
    PBU.text(ctx, 'Wellenberge eng = hoch  •  Wellenberge groß = laut', s.w / 2, 450, 17, 'rgba(255,255,255,0.7)');
  }
});
