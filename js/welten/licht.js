'use strict';
/* ===== Welt 4: Licht & Farben ===== */
Baukasten.welt({
  id: 'licht',
  name: 'Licht & Farben',
  emoji: '🌈',
  farbe: '#f5c518',
  beschreibung: 'Farben mischen, Schatten zaubern und einen Regenbogen aus weißem Licht holen.'
});

/* --- 1. Farbmischpult --- */
Baukasten.demo('licht', {
  id: 'farben',
  name: 'Das Farb-Mischpult',
  emoji: '🎨',
  frage: 'Was passiert, wenn rotes, grünes und blaues Licht zusammentreffen?',
  erklaerung: `Licht mischt sich <b>anders als Tuschkasten-Farben</b>!
    Rotes + grünes Licht = <b>Gelb</b>. Alle drei zusammen = <b>Weiß</b>!
    Denn weißes Licht ist in Wahrheit ein Mix aus allen Farben.
    Dreh an den drei Lampen und mische deine eigene Farbe!`,
  wow: `Dein Fernseher und dein Tablet können <b>nur diese 3 Farben</b> leuchten lassen!
    Jedes Bild besteht aus winzigen roten, grünen und blauen Pünktchen – schau mal mit einer Lupe!`,
  params: [
    { key: 'rot', label: '🔴 Rote Lampe', min: 0, max: 1, step: 0.01, start: 1,
      format: v => v < 0.05 ? 'Aus' : `${Math.round(v * 100)} %` },
    { key: 'gruen', label: '🟢 Grüne Lampe', min: 0, max: 1, step: 0.01, start: 0,
      format: v => v < 0.05 ? 'Aus' : `${Math.round(v * 100)} %` },
    { key: 'blau', label: '🔵 Blaue Lampe', min: 0, max: 1, step: 0.01, start: 0,
      format: v => v < 0.05 ? 'Aus' : `${Math.round(v * 100)} %` }
  ],
  init() {},
  malen(ctx, s, p) {
    ctx.fillStyle = '#14122b';
    ctx.fillRect(0, 0, s.w, s.h);
    // drei Scheinwerfer oben
    const lampen = [
      { x: 250, farbe: `rgba(255,40,40,`, an: p.rot, name: 'Rot' },
      { x: 400, farbe: `rgba(40,255,60,`, an: p.gruen, name: 'Grün' },
      { x: 550, farbe: `rgba(60,90,255,`, an: p.blau, name: 'Blau' }
    ];
    // Lichtkreise (additiv!)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const ziele = [{ x: 330, y: 300 }, { x: 400, y: 240 }, { x: 470, y: 300 }];
    lampen.forEach((l, i) => {
      if (l.an < 0.03) return;
      const z = ziele[i];
      const g = ctx.createRadialGradient(z.x, z.y, 10, z.x, z.y, 150);
      g.addColorStop(0, l.farbe + (l.an * 0.95) + ')');
      g.addColorStop(1, l.farbe + '0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(z.x, z.y, 150, 0, Math.PI * 2); ctx.fill();
      // Lichtkegel von der Lampe
      ctx.globalAlpha = l.an * 0.18;
      ctx.fillStyle = l.farbe + '1)';
      ctx.beginPath();
      ctx.moveTo(l.x - 15, 70); ctx.lineTo(l.x + 15, 70);
      ctx.lineTo(z.x + 120, z.y); ctx.lineTo(z.x - 120, z.y);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    });
    ctx.restore();
    // Lampengehäuse
    lampen.forEach(l => {
      PBU.kasten(ctx, l.x - 28, 30, 56, 42, '#3a3352', 10);
      PBU.kreis(ctx, l.x, 72, 16, l.an > 0.03 ? l.farbe + '1)' : '#555');
    });
    // Mischfarbe bestimmen und benennen
    const r = p.rot, g2 = p.gruen, b = p.blau;
    let name = '';
    const an = v => v > 0.35;
    if (an(r) && an(g2) && an(b)) name = '⚪ WEISS – alle Farben zusammen!';
    else if (an(r) && an(g2)) name = '💛 GELB – Überraschung!';
    else if (an(r) && an(b)) name = '💜 MAGENTA (Pink-Lila)';
    else if (an(g2) && an(b)) name = '🌊 CYAN (Türkis)';
    else if (an(r)) name = '❤️ ROT';
    else if (an(g2)) name = '💚 GRÜN';
    else if (an(b)) name = '💙 BLAU';
    else name = '⚫ Dunkel – mach eine Lampe an!';
    PBU.text(ctx, name, s.w / 2, 440, 26, '#fff');
    PBU.text(ctx, 'In der Mitte mischen sich die Lichter!', s.w / 2, 475, 15, 'rgba(255,255,255,0.6)');
  }
});

/* --- 2. Schattentheater --- */
Baukasten.demo('licht', {
  id: 'schatten',
  name: 'Schatten-Theater',
  emoji: '🕯️',
  frage: 'Wie machst du einen RIESEN-Schatten an die Wand?',
  erklaerung: `Licht fliegt immer <b>schnurgerade</b>. Steht etwas im Weg, kommt dahinter
    kein Licht mehr hin – das ist der <b>Schatten</b>!
    Rückst du die Lampe <b>nah</b> ans Häschen, wird sein Schatten riesengroß.
    Schiebst du sie weit weg, schrumpft er.`,
  wow: `Bei einer Sonnenfinsternis macht der <b>Mond</b> einen Schatten auf die Erde!
    Wer im Schatten steht, sieht die Sonne dunkel werden – mitten am Tag.`,
  params: [
    { key: 'lampe', label: 'Lampen-Abstand', min: 120, max: 480, step: 2, start: 300,
      format: v => v < 220 ? '🔦 Ganz nah' : v < 380 ? '🔦 Mittel' : '🔦 Weit weg' },
    { key: 'groesse', label: 'Häschen-Größe', min: 30, max: 90, step: 1, start: 55,
      format: v => v < 50 ? '🐰 Klein' : v < 72 ? '🐰 Mittel' : '🐰 Groß' }
  ],
  init() {},
  malen(ctx, s, p) {
    // dunkles Zimmer
    const g = ctx.createLinearGradient(0, 0, 0, s.h);
    g.addColorStop(0, '#2b2545'); g.addColorStop(1, '#453d68');
    ctx.fillStyle = g; ctx.fillRect(0, 0, s.w, s.h);
    ctx.fillStyle = '#37305a'; ctx.fillRect(0, s.h - 70, s.w, 70);
    const wandX = 720;
    const objX = 560, objY = 340;
    const lampX = objX - p.lampe, lampY = 340;
    const halbe = p.groesse / 2;
    // Schattengröße per Strahlensatz
    const distLampeObj = objX - lampX;
    const distLampeWand = wandX - lampX;
    const schattenHalbe = halbe * distLampeWand / distLampeObj;
    // Lichtkegel: fester Öffnungswinkel der Lampe (ändert sich NICHT mit dem Abstand!)
    ctx.save();
    ctx.fillStyle = 'rgba(255,236,160,0.22)';
    const kegel = (wandX - lampX) * 0.52;
    ctx.beginPath();
    ctx.moveTo(lampX, lampY);
    ctx.lineTo(wandX, lampY - kegel);
    ctx.lineTo(wandX, lampY + kegel);
    ctx.closePath(); ctx.fill();
    // Lichtstrahlen (Ränder, gestrichelt)
    ctx.strokeStyle = 'rgba(255,236,160,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(lampX, lampY);
    ctx.lineTo(objX, objY - halbe);
    ctx.lineTo(wandX, lampY - schattenHalbe);
    ctx.moveTo(lampX, lampY);
    ctx.lineTo(objX, objY + halbe);
    ctx.lineTo(wandX, lampY + schattenHalbe);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    // Wand
    ctx.fillStyle = '#efe6d0';
    ctx.fillRect(wandX, 60, 60, 370);
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 4;
    ctx.strokeRect(wandX, 60, 60, 370);
    // Schatten an der Wand
    ctx.save();
    ctx.beginPath(); ctx.rect(wandX, 60, 58, 370); ctx.clip();
    ctx.fillStyle = 'rgba(43,37,69,0.85)';
    ctx.beginPath();
    ctx.ellipse(wandX + 30, lampY, 26, PBU.klemme(schattenHalbe, 10, 190), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Lampe & Häschen (kräftig gezeichnet)
    PBU.malTaschenlampe(ctx, lampX, lampY, 54);
    PBU.malHase(ctx, objX, objY, p.groesse);
    PBU.text(ctx, 'Wand', wandX + 30, 45, 16, '#efe6d0');
    const riesig = schattenHalbe > 120;
    PBU.text(ctx, riesig ? 'WAAAH – ein Riesen-Hase! 👻' : 'Schieb die Lampe näher ran…',
      s.w / 2 - 60, 40, 22, '#fff');
  }
});

/* --- 3. Spiegel-Zielen --- */
Baukasten.demo('licht', {
  id: 'spiegel',
  name: 'Der Spiegel-Trick',
  emoji: '🔦',
  frage: 'Kannst du mit dem Spiegel den Stern treffen?',
  erklaerung: `Licht prallt vom Spiegel ab wie ein Ball von der Wand:
    <b>Genauso schräg, wie es ankommt, fliegt es weiter!</b>
    Kippe die Taschenlampe, bis der Lichtstrahl über den Spiegel den Stern trifft.`,
  wow: `Katzenaugen am Fahrrad sind Mini-Spiegel, die Licht <b>immer genau zurück</b>
    zum Autofahrer werfen – deshalb leuchten sie im Dunkeln so hell!`,
  params: [
    { key: 'winkel', label: 'Lampen-Neigung', min: 15, max: 75, step: 0.5, start: 30,
      format: v => `📐 ${Math.round(v)}°` }
  ],
  init(s) {
    s.sternX = 300 + Math.random() * 400;
    s.treffer = 0; s.getroffen = 0;
  },
  schritt(s, p, dt) {
    PBU.konfettiSchritt(s, dt);
    if (s.getroffen > 0) {
      s.getroffen -= dt;
      if (s.getroffen <= 0) {
        s.sternX = 300 + Math.random() * 400;
      }
    }
  },
  malen(ctx, s, p) {
    PBU.nacht(ctx, s.w, s.h);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 30; i++) ctx.fillRect((i * 211 + 40) % s.w, (i * 149) % 200, 2, 2);
    // Spiegel am Boden
    const spiegelY = 420;
    ctx.fillStyle = '#bfe3f5';
    ctx.fillRect(120, spiegelY, 580, 14);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.strokeRect(120, spiegelY, 580, 14);
    // Lampe links oben
    const lampX = 90, lampY = 120;
    const wk = p.winkel * Math.PI / 180;
    // Strahl bis zum Spiegel
    const dx = Math.cos(wk), dy = Math.sin(wk);
    const tSpiegel = (spiegelY - lampY) / dy;
    const hitX = lampX + dx * tSpiegel;
    // Reflektierter Strahl
    const rx = dx, ry = -dy;
    const tEnde = 600;
    const endX = hitX + rx * tEnde, endY = spiegelY + ry * tEnde;
    // Stern-Treffer prüfen (Abstand Punkt-Strahl)
    const sx = s.sternX, sy = 90;
    const px = sx - hitX, py = sy - spiegelY;
    const proj = px * rx + py * ry;
    let trifft = false;
    if (proj > 0 && hitX > 120 && hitX < 700) {
      const abst = Math.hypot(px - rx * proj, py - ry * proj);
      trifft = abst < 30;
    }
    if (trifft && s.getroffen <= 0) {
      s.getroffen = 1.4; s.treffer++;
      PBU.konfettiStart(s, sx, sy, 35);
      Baukasten.ton(659, 0.12, 'triangle'); setTimeout(() => Baukasten.ton(988, 0.3, 'triangle'), 110);
    }
    // Strahl zeichnen
    ctx.save();
    ctx.strokeStyle = '#ffe97a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.shadowColor = '#ffe97a'; ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(lampX, lampY);
    if (hitX > 120 && hitX < 700) {
      ctx.lineTo(hitX, spiegelY);
      ctx.lineTo(endX, endY);
    } else {
      ctx.lineTo(lampX + dx * 900, lampY + dy * 900);
    }
    ctx.stroke();
    ctx.restore();
    // Winkel-Bögen am Spiegel
    if (hitX > 120 && hitX < 700) {
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(hitX, spiegelY, 34, Math.PI + wk - 0.02, Math.PI + wk + 0.02); ctx.stroke();
      ctx.beginPath(); ctx.arc(hitX, spiegelY, 34, -wk - 0.02, -wk + 0.02); ctx.stroke();
      ctx.beginPath(); ctx.arc(hitX, spiegelY, 28, Math.PI, Math.PI + wk); ctx.stroke();
      ctx.beginPath(); ctx.arc(hitX, spiegelY, 28, -wk, 0); ctx.stroke();
      PBU.text(ctx, 'gleich schräg rein und raus!', hitX, spiegelY + 40, 15, 'rgba(255,255,255,0.75)');
    }
    // Lampe
    ctx.save();
    ctx.translate(lampX, lampY);
    ctx.rotate(wk);
    PBU.kasten(ctx, -46, -13, 52, 26, '#9e9e9e', 8);
    PBU.kasten(ctx, 2, -16, 12, 32, '#f5c518', 4);
    ctx.restore();
    // Stern
    PBU.emoji(ctx, s.getroffen > 0 ? '🌟' : '⭐', sx, sy, s.getroffen > 0 ? 62 : 44);
    PBU.konfettiMalen(ctx, s);
    if (s.getroffen > 0) PBU.text(ctx, '🎉 Getroffen!', s.w / 2, 45, 28, '#ffe97a');
    if (s.treffer > 0) PBU.text(ctx, `Sterne getroffen: ${s.treffer}`, s.w - 20, 30, 17, '#fff', 'right');
  }
});

/* --- 4. Prisma --- */
Baukasten.demo('licht', {
  id: 'prisma',
  name: 'Der Regenbogen-Macher',
  emoji: '🌈',
  frage: 'Wo versteckt sich der Regenbogen im weißen Licht?',
  erklaerung: `Weißes Licht sieht langweilig aus – aber in ihm stecken <b>alle Farben</b>!
    Ein Glas-Prisma sortiert sie auseinander: Jede Farbe macht im Glas eine
    <b>etwas andere Kurve</b> – Blau biegt stark ab, Rot nur wenig. Und schwupps: Regenbogen!`,
  wow: `Ein echter Regenbogen funktioniert genauso: Millionen <b>Regentropfen</b>
    spielen Prisma und zerlegen das Sonnenlicht in Farben!`,
  params: [
    { key: 'faecher', label: 'Farb-Auffächerung', min: 0, max: 1, step: 0.01, start: 0.4,
      format: v => v < 0.2 ? '🤏 Kaum' : v < 0.6 ? '👌 Mittel' : '🖐️ Weit auf' },
    { key: 'hell', label: 'Licht-Stärke', min: 0.3, max: 1, step: 0.01, start: 0.9,
      format: v => v < 0.55 ? '🕯️ Schwach' : '💡 Hell' }
  ],
  init() {},
  malen(ctx, s, p) {
    ctx.fillStyle = '#191631';
    ctx.fillRect(0, 0, s.w, s.h);
    const px = 400, py = 250; // Prisma-Mitte
    // Weißer Strahl von links
    ctx.save();
    ctx.globalAlpha = p.hell;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.shadowColor = '#fff'; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.moveTo(40, 310); ctx.lineTo(px - 35, py + 25); ctx.stroke();
    ctx.restore();
    // Regenbogen-Fächer: die Farben ÜBERLAGERN sich additiv –
    // liegen sie aufeinander, verschmelzen sie wieder zu Weiß!
    const farben = ['#ff2d2d', '#ff9d00', '#ffe600', '#3dd63d', '#2d9dff', '#7b2dff'];
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    farben.forEach((f, i) => {
      const grundW = -0.12;
      const w = grundW + (i - 2.5) * 0.09 * p.faecher;
      ctx.globalAlpha = p.hell * 0.55;
      ctx.strokeStyle = f; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.shadowColor = f; ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(px + 20, py + 5);
      ctx.lineTo(px + 20 + Math.cos(w) * 340, py + 5 + Math.sin(w) * 340);
      ctx.stroke();
    });
    ctx.restore();
    // Prisma (Dreieck) obendrauf
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(px, py - 85);
    ctx.lineTo(px - 75, py + 55);
    ctx.lineTo(px + 75, py + 55);
    ctx.closePath();
    const g = ctx.createLinearGradient(px - 75, py, px + 75, py);
    g.addColorStop(0, 'rgba(190,225,255,0.35)');
    g.addColorStop(1, 'rgba(190,225,255,0.15)');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(220,240,255,0.9)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
    PBU.text(ctx, 'weißes Licht', 110, 275, 16, '#fff');
    PBU.text(ctx, 'Prisma', px, py + 80, 16, '#bfe3f5');
    PBU.text(ctx, 'Im Weiß stecken ALLE Farben drin!', s.w / 2, 60, 24, '#fff');
  }
});
