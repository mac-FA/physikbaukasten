'use strict';
/* ===== Welt 6: Wärme & Teilchen ===== */
Baukasten.welt({
  id: 'waerme',
  name: 'Wärme & Teilchen',
  emoji: '🔥',
  farbe: '#ff8c42',
  beschreibung: 'Alles besteht aus winzigen Kügelchen – und Wärme bringt sie zum Tanzen!'
});

/* --- 1. Teilchen-Tanz --- */
Baukasten.demo('waerme', {
  id: 'teilchen',
  name: 'Der Teilchen-Tanz',
  emoji: '💫',
  frage: 'Was machen die winzigen Teilchen, wenn es heiß wird?',
  erklaerung: `Alles auf der Welt besteht aus <b>winzig kleinen Teilchen</b> – viel zu klein zum Sehen!
    Und die stehen niemals still: Sie flitzen, hüpfen und rempeln sich an.
    <b>Wärme ist nichts anderes als dieses Gewusel!</b> Heiß = schnelles Gewusel, kalt = müdes Gewusel.`,
  wow: `In einem einzigen Wassertropfen stecken mehr Teilchen, als es <b>Sandkörner an allen
    Stränden der Welt</b> gibt. Und alle wuseln gleichzeitig!`,
  params: [
    { key: 'temp', label: 'Temperatur', min: 0.1, max: 3, step: 0.01, start: 1,
      format: v => v < 0.7 ? '🥶 Eiskalt' : v < 1.8 ? '😊 Lauwarm' : '🥵 Kochend heiß' }
  ],
  init(s) {
    s.teile = [];
    for (let i = 0; i < 40; i++) {
      const w = Math.random() * Math.PI * 2;
      s.teile.push({
        x: 120 + Math.random() * 560, y: 100 + Math.random() * 300,
        vx: Math.cos(w), vy: Math.sin(w)
      });
    }
  },
  schritt(s, p, dt) {
    const speed = 40 + p.temp * 110;
    for (const t of s.teile) {
      t.x += t.vx * speed * dt;
      t.y += t.vy * speed * dt;
      const dreh = (Math.random() - 0.5) * 2 * dt;
      const nx = t.vx * Math.cos(dreh) - t.vy * Math.sin(dreh);
      t.vy = t.vx * Math.sin(dreh) + t.vy * Math.cos(dreh);
      t.vx = nx;
      if (t.x < 110 && t.vx < 0) t.vx = -t.vx;
      if (t.x > 690 && t.vx > 0) t.vx = -t.vx;
      if (t.y < 90 && t.vy < 0) t.vy = -t.vy;
      if (t.y > 410 && t.vy > 0) t.vy = -t.vy;
    }
  },
  malen(ctx, s, p) {
    const k = PBU.klemme((p.temp - 0.1) / 2.9, 0, 1);
    ctx.fillStyle = `rgb(${Math.round(40 + k * 90)}, ${Math.round(45 + (1 - Math.abs(k - 0.5) * 2) * 30)}, ${Math.round(120 - k * 80)})`;
    ctx.fillRect(0, 0, s.w, s.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 6;
    ctx.strokeRect(100, 80, 600, 340);
    const farbe = k < 0.4 ? '#7ec8ff' : k < 0.7 ? '#ffd166' : '#ff6b5e';
    for (const t of s.teile) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      PBU.kreis(ctx, t.x - t.vx * 8 * k * 2, t.y - t.vy * 8 * k * 2, 7, farbe);
      ctx.restore();
      PBU.kreis(ctx, t.x, t.y, 9, farbe);
      PBU.kreis(ctx, t.x - 3, t.y - 3, 3, 'rgba(255,255,255,0.7)');
    }
    const label = k < 0.25 ? '🥶 Müdes Gewusel' : k < 0.6 ? '😊 Munteres Gewusel' : '🥵 WILDES Gewusel!';
    PBU.text(ctx, label, s.w / 2, 45, 26, '#fff');
    PBU.text(ctx, 'Wärme = wie schnell die Teilchen wuseln', s.w / 2, 460, 18, 'rgba(255,255,255,0.75)');
  }
});

/* --- 2. Eis, Wasser, Dampf --- */
Baukasten.demo('waerme', {
  id: 'zustaende',
  name: 'Eis, Wasser oder Dampf?',
  emoji: '🧊',
  frage: 'Wie wird aus hartem Eis flüssiges Wasser – und dann Dampf?',
  erklaerung: `Es sind immer <b>dieselben Wasser-Teilchen</b> – sie halten sich nur anders fest!
    <b>Eis:</b> Alle stehen stramm in Reih und Glied und zittern nur. <b>Wasser:</b> Sie kullern
    übereinander und <b>kleben</b> aneinander wie beste Freunde. Je heißer es wird, desto
    schwächer wird das Kleben – und einzelne Ausreißer <b>türmen schon vor dem Kochen ab</b>!
    Beim Sieden reißen sich dann alle los und verteilen sich im ganzen Raum.`,
  wow: `Wasser hat ein Geheimnis, das Forscher erst vor wenigen Jahren gemessen haben:
    Bei ungefähr <b>50 Grad wechselt es heimlich seinen Charakter</b>!
    Darunter halten die Teilchen besonders fest zusammen – darüber wird das Wasser
    plötzlich viel „lockerer“. Du siehst es hier am Regler!`,
  params: [
    { key: 'temp', label: 'Temperatur', min: -20, max: 120, step: 1, start: 20,
      format: v => `🌡️ ${Math.round(v)} °C` }
  ],
  init(s) {
    s.teile = [];
    for (let i = 0; i < 36; i++) {
      s.teile.push({
        heimX: 280 + (i % 6) * 48, heimY: 180 + Math.floor(i / 6) * 44,
        x: 280 + (i % 6) * 48, y: 180 + Math.floor(i / 6) * 44,
        vx: 0, vy: 0, frei: false
      });
    }
  },
  schritt(s, p, dt) {
    const T = p.temp;
    for (const t of s.teile) {
      if (T < 0 && !t.frei) {
        // fest: zurück zum Gitterplatz, zittern (stärker nahe dem Schmelzpunkt)
        const zitter = 1 + (T + 20) * 0.1;
        t.x += (t.heimX - t.x) * 8 * dt + (Math.random() - 0.5) * zitter;
        t.y += (t.heimY - t.y) * 8 * dt + (Math.random() - 0.5) * zitter;
        t.vx = 0; t.vy = 0;
        continue;
      }
      if (t.frei) {
        // Dampf: saust frei durchs Zimmer
        t.x += t.vx * dt; t.y += t.vy * dt;
        if (t.x < 20) { t.x = 20; t.vx = Math.abs(t.vx); }
        if (t.x > 780) { t.x = 780; t.vx = -Math.abs(t.vx); }
        if (t.y < 20) { t.y = 20; t.vy = Math.abs(t.vy); }
        if (t.y > 480) { t.y = 480; t.vy = -Math.abs(t.vy); }
        // wird es kühler, kondensiert der Dampf zurück ins Gefäß
        if (T < 95) {
          t.vx += (400 - t.x) * 0.3 * dt;
          t.vy += (320 - t.y) * 0.3 * dt;
          if (t.x > 240 && t.x < 560 && t.y > 210 && t.y < 380) {
            t.frei = false; t.vx *= 0.3; t.vy *= 0.3;
          }
        }
        continue;
      }
      // flüssig im Gefäß
      const ziel = 40 + Math.max(0, T) * 1.6;
      t.vx += (Math.random() - 0.5) * ziel * 8 * dt;
      t.vy += (Math.random() - 0.5) * ziel * 8 * dt;
      t.vy += 230 * dt;
      // „Klebrigkeit“: unter ~50 Grad ziehen sich nahe Teilchen an – nur als Nuance,
      // damit kühles Wasser trotzdem schön den Boden benetzt
      if (T < 50) {
        const kleb = (1 - T / 50) * 55;
        for (const u of s.teile) {
          if (u === t || u.frei) continue;
          const dx = u.x - t.x, dy = u.y - t.y;
          const d = Math.hypot(dx, dy);
          if (d > 26 && d < 50) {
            t.vx += dx / d * kleb * dt;
            t.vy += dy / d * kleb * dt;
          }
        }
      }
      const sp = Math.hypot(t.vx, t.vy) || 1;
      const max = ziel * 1.7;
      if (sp > max) { t.vx *= max / sp; t.vy *= max / sp; }
      t.x += t.vx * dt; t.y += t.vy * dt;
      // Gefäß: Wände und Boden – oben offen!
      if (t.x < 232) { t.x = 232; t.vx = Math.abs(t.vx) * 0.9; }
      if (t.x > 568) { t.x = 568; t.vx = -Math.abs(t.vx) * 0.9; }
      if (t.y > 388) { t.y = 388; t.vy = -Math.abs(t.vy) * 0.9; }
      if (t.y < 170 && t.vy < 0 && T < 60) t.vy = Math.abs(t.vy) * 0.4;
      // Ausreißer: ab ~60 Grad türmen die schnellsten oben ab – je heißer, desto mehr
      if (T >= 60 && t.y < 215 && Math.random() < (T - 55) * 0.0009) {
        t.frei = true;
        t.vy = -140 - Math.random() * 100 - T;
        t.vx = (Math.random() - 0.5) * 140;
      }
      // Siedepunkt: jetzt reißen sich alle los
      if (T >= 100 && Math.random() < 0.06) {
        t.frei = true;
        t.vy = -160 - Math.random() * 160;
        t.vx = (Math.random() - 0.5) * 220;
      }
    }
    // Kollisionen: Teilchen rempeln sich wirklich an!
    if (T >= 0) {
      for (let i = 0; i < s.teile.length; i++) {
        for (let j = i + 1; j < s.teile.length; j++) {
          const a = s.teile[i], b = s.teile[j];
          if (a.frei !== b.frei) continue;
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d < 24 && d > 0.01) {
            const nx = dx / d, ny = dy / d;
            const ueber = (24 - d) / 2;
            a.x -= nx * ueber; a.y -= ny * ueber;
            b.x += nx * ueber; b.y += ny * ueber;
            const va = a.vx * nx + a.vy * ny;
            const vb = b.vx * nx + b.vy * ny;
            if (va > vb) {
              a.vx += (vb - va) * nx; a.vy += (vb - va) * ny;
              b.vx += (va - vb) * nx; b.vy += (va - vb) * ny;
            }
          }
        }
      }
    }
  },
  malen(ctx, s, p) {
    const T = p.temp;
    if (T < 0) PBU.himmel(ctx, s.w, s.h, '#cfe9ff', '#eef8ff');
    else if (T < 100) PBU.himmel(ctx, s.w, s.h, '#d8f0ff', '#f4fbff');
    else PBU.himmel(ctx, s.w, s.h, '#ffe0d0', '#fff2ea');
    // Gefäß (bleibt immer stehen – der Dampf entweicht einfach oben)
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(220, 160); ctx.lineTo(220, 400); ctx.lineTo(580, 400); ctx.lineTo(580, 160);
    ctx.stroke();
    // Eis-Bindungen
    if (T < 0) {
      ctx.strokeStyle = 'rgba(66,165,245,0.4)'; ctx.lineWidth = 2;
      for (const t of s.teile) {
        for (const u of s.teile) {
          const d = Math.hypot(t.heimX - u.heimX, t.heimY - u.heimY);
          if (d > 1 && d < 50) {
            ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(u.x, u.y); ctx.stroke();
          }
        }
      }
    }
    for (const t of s.teile) {
      const farbe = t.frei ? '#d9dfeb' : T < 0 ? '#9bd1ff' : '#42a5f5';
      PBU.kreis(ctx, t.x, t.y, t.frei ? 10 : 12, farbe);
      PBU.kreis(ctx, t.x - 4, t.y - 4, 4, 'rgba(255,255,255,0.7)');
    }
    // Thermometer
    PBU.kasten(ctx, 60, 100, 26, 300, '#eee', 12);
    const füll = PBU.klemme((T + 20) / 140, 0, 1);
    PBU.kasten(ctx, 63, 100 + 294 * (1 - füll), 20, 294 * füll + 3, T < 0 ? '#42a5f5' : T < 100 ? '#ff8c42' : '#e63946', 8);
    PBU.kreis(ctx, 73, 415, 22, T < 0 ? '#42a5f5' : T < 100 ? '#ff8c42' : '#e63946');
    const zustand = T < 0 ? '🧊 EIS – alle halten sich fest!'
      : T < 50 ? '💧 WASSER – kuschelig und klebrig!'
      : T < 100 ? '💧 HEISSES WASSER – locker! Erste türmen ab …'
      : '☁️ DAMPF – alle verteilen sich im Zimmer!';
    PBU.text(ctx, zustand, s.w / 2 + 30, 60, 24, '#3a3352');
    const entwischt = s.teile.filter(t => t.frei).length;
    if (entwischt > 0 && T < 100) PBU.text(ctx, `Schon entwischt: ${entwischt} 💨`, 660, 100, 17, '#6b6489');
  }
});

/* --- 3. Warme Luft steigt --- */
Baukasten.demo('waerme', {
  id: 'aufsteigen',
  name: 'Warme Luft will hoch hinaus',
  emoji: '🎈',
  frage: 'Warum steigt ein Heißluftballon in den Himmel?',
  erklaerung: `Über der Kerze wird die Luft <b>warm – und warme Luft steigt nach oben</b>!
    Ihre Teilchen wuseln schneller und brauchen mehr Platz – schau, wie die warmen
    Teilchen richtig <b>aufgeblasen</b> aussehen! Dadurch wird die warme Luft „dünner“
    und leichter als die kalte – und schwebt hoch wie ein Korken im Wasser.
    Oben kühlt sie ab, schrumpft und sinkt wieder. Ein ewiges Karussell!`,
  wow: `Greifvögel kennen den Trick: Sie suchen <b>aufsteigende Warmluft-Schläuche</b>
    und lassen sich stundenlang nach oben tragen – ohne einen einzigen Flügelschlag!`,
  params: [
    { key: 'heizung', label: 'Kerzen-Power', min: 0, max: 1, step: 0.01, start: 0.7,
      format: v => v < 0.2 ? '🕯️ Aus' : v < 0.6 ? '🕯️ Kleine Flamme' : '🔥 Große Flamme' }
  ],
  init(s) {
    s.teile = [];
    for (let i = 0; i < 70; i++) {
      s.teile.push({
        x: 100 + Math.random() * 600, y: 80 + Math.random() * 320,
        vx: 0, vy: 0, temp: 0
      });
    }
  },
  schritt(s, p, dt) {
    // Nur echte Physik: Heizen, Abkühlen, Auftrieb, Schwerkraft.
    // KEINE künstlichen Strömungen – der Kreislauf entsteht von selbst!
    for (const t of s.teile) {
      const ueberKerze = Math.abs(t.x - 400) < 70 && t.y > 320;
      if (ueberKerze) t.temp = Math.min(1, t.temp + p.heizung * 2.4 * dt);
      t.temp = Math.max(0, t.temp - (t.y < 150 ? 0.5 : 0.15) * dt);
      t.vy += (42 - t.temp * 300) * dt;
      t.vx += (Math.random() - 0.5) * 30 * dt;
      t.vx *= (1 - 0.8 * dt); t.vy *= (1 - 0.8 * dt);
    }
    // Teilchen verdrängen einander – warme Säule steigt, kalte werden
    // zur Seite und nach unten gedrückt: Konvektion aus dem Gewusel selbst
    for (let i = 0; i < s.teile.length; i++) {
      for (let j = i + 1; j < s.teile.length; j++) {
        const a = s.teile[i], b = s.teile[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 1024 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (32 - d) / 32 * 300 * dt / d;
          a.vx -= dx * f; a.vy -= dy * f;
          b.vx += dx * f; b.vy += dy * f;
        }
      }
    }
    for (const t of s.teile) {
      t.x += t.vx * dt; t.y += t.vy * dt;
      if (t.x < 90) { t.x = 90; t.vx = Math.abs(t.vx); }
      if (t.x > 710) { t.x = 710; t.vx = -Math.abs(t.vx); }
      if (t.y < 70) { t.y = 70; t.vy = Math.abs(t.vy) * 0.2; }
      if (t.y > 410) { t.y = 410; t.vy = -Math.abs(t.vy) * 0.2; }
    }
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#e8eef8', '#f8fafd');
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 5;
    ctx.strokeRect(80, 60, 640, 360);
    // Kerze
    PBU.kasten(ctx, 385, 425, 30, 40, '#f7e8c8', 6);
    if (p.heizung > 0.2) {
      const fl = 10 + p.heizung * 22 + Math.sin(s.zeit * 12) * 3;
      const g = ctx.createRadialGradient(400, 420 - fl / 2, 2, 400, 420 - fl / 2, fl);
      g.addColorStop(0, '#fff3b0'); g.addColorStop(0.6, '#ff9d42'); g.addColorStop(1, 'rgba(255,120,50,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(400, 420 - fl / 2, fl * 0.55, fl, 0, 0, Math.PI * 2); ctx.fill();
    }
    // Teilchen: warm = rot UND aufgeblasen (Luft dehnt sich aus!)
    for (const t of s.teile) {
      const r = Math.round(90 + t.temp * 165);
      const b = Math.round(220 - t.temp * 140);
      PBU.kreis(ctx, t.x, t.y, 5.5 + t.temp * 4.5, `rgb(${r},${Math.round(120 + t.temp * 20)},${b})`);
    }
    // Kreislauf-Pfeile
    ctx.save(); ctx.globalAlpha = 0.35;
    PBU.pfeil(ctx, 430, 330, 430, 150, '#e63946', 6);
    PBU.pfeil(ctx, 480, 110, 620, 110, '#e63946', 4);
    PBU.pfeil(ctx, 650, 160, 650, 330, '#42a5f5', 6);
    PBU.pfeil(ctx, 620, 380, 480, 380, '#42a5f5', 4);
    ctx.restore();
    PBU.text(ctx, '🔴 warm & aufgebläht steigt hoch      🔵 kalt & geschrumpft sinkt', s.w / 2, 40, 19, '#3a3352');
  }
});

/* --- 4. Der Saft-Trick (Mini-Strömungs-Simulation) --- */
// Kleiner "stable fluids"-Löser: Halb-Lagrange-Advektion + Jacobi-Druckprojektion.
// Der Saft wird als Farbfeld durch echtes Verwirbeln + Wärme-Gewusel gemischt.
function saftFluidSchritt(s, temp) {
  const NX = s.NX, NY = s.NY;
  const I = (x, y) => y * NX + x;
  const u = s.u, v = s.v;
  function bilerp(f, x, y) {
    x = x < 0.5 ? 0.5 : x > NX - 1.5 ? NX - 1.5 : x;
    y = y < 0.5 ? 0.5 : y > NY - 1.5 ? NY - 1.5 : y;
    const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0;
    return f[I(x0, y0)] * (1 - fx) * (1 - fy) + f[I(x0 + 1, y0)] * fx * (1 - fy)
      + f[I(x0, y0 + 1)] * (1 - fx) * fy + f[I(x0 + 1, y0 + 1)] * fx * fy;
  }
  function waende() {
    for (let x = 0; x < NX; x++) {
      u[I(x, 0)] = 0; v[I(x, 0)] = 0;
      u[I(x, NY - 1)] = 0; v[I(x, NY - 1)] = 0;
    }
    for (let y = 0; y < NY; y++) {
      u[I(0, y)] = 0; v[I(0, y)] = 0;
      u[I(NX - 1, y)] = 0; v[I(NX - 1, y)] = 0;
    }
  }
  function projiziere() {
    const div = s.div, pr = s.p;
    for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) {
      div[I(x, y)] = -0.5 * (u[I(x + 1, y)] - u[I(x - 1, y)] + v[I(x, y + 1)] - v[I(x, y - 1)]);
      pr[I(x, y)] = 0;
    }
    for (let k = 0; k < 12; k++) {
      for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) {
        pr[I(x, y)] = (div[I(x, y)] + pr[I(x - 1, y)] + pr[I(x + 1, y)] + pr[I(x, y - 1)] + pr[I(x, y + 1)]) / 4;
      }
    }
    for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) {
      u[I(x, y)] -= 0.5 * (pr[I(x + 1, y)] - pr[I(x - 1, y)]);
      v[I(x, y)] -= 0.5 * (pr[I(x, y + 1)] - pr[I(x, y - 1)]);
    }
  }
  waende();
  // Saft ist ein bisschen schwerer + alles wird nur ganz sanft gedämpft
  for (let i = 0; i < s.N; i++) {
    v[i] += s.dye[i] * 0.008;
    u[i] *= 0.9975; v[i] *= 0.9975;
  }
  // Brownsches Gewusel: viele zufällige Schubser, je wärmer desto kräftiger –
  // so kommt die Mischung nie zum Stillstand
  for (let k = 0; k < 80; k++) {
    const i = I(1 + (Math.random() * (NX - 2)) | 0, 1 + (Math.random() * (NY - 2)) | 0);
    u[i] += (Math.random() - 0.5) * temp * 1.3;
    v[i] += (Math.random() - 0.5) * temp * 1.3;
  }
  projiziere();
  s.u0.set(u); s.v0.set(v);
  for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) {
    const i = I(x, y);
    u[i] = bilerp(s.u0, x - s.u0[i], y - s.v0[i]);
    v[i] = bilerp(s.v0, x - s.u0[i], y - s.v0[i]);
  }
  projiziere();
  s.d0.set(s.dye);
  for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) {
    const i = I(x, y);
    s.dye[i] = bilerp(s.d0, x - u[i], y - v[i]);
  }
  // feine Vermischung: warmes Wasser verschmiert den Saft schneller
  const misch = 0.014 + temp * 0.038;
  s.d0.set(s.dye);
  for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) {
    const i = I(x, y);
    s.dye[i] = s.d0[i] * (1 - misch)
      + (s.d0[I(x - 1, y)] + s.d0[I(x + 1, y)] + s.d0[I(x, y - 1)] + s.d0[I(x, y + 1)]) * (misch / 4);
  }
  waende();
}
function malTuete(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  PBU.kasten(ctx, -23, -32, 46, 64, '#ff8c42', 6);
  ctx.strokeStyle = '#c96a1e'; ctx.lineWidth = 3;
  ctx.strokeRect(-23, -32, 46, 64);
  PBU.kasten(ctx, -16, -12, 32, 26, '#fff', 4);
  PBU.text(ctx, 'SAFT', 0, 1, 13, '#e63946');
  // Gieß-Zipfel oben links
  ctx.fillStyle = '#c96a1e';
  ctx.beginPath();
  ctx.moveTo(-23, -32); ctx.lineTo(-14, -43); ctx.lineTo(-5, -32);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
Baukasten.demo('waerme', {
  id: 'diffusion',
  name: 'Der Saft-Trick',
  emoji: '🧃',
  frage: 'Warum verteilt sich Saft im Wasser ganz von allein?',
  erklaerung: `Kipp den Saft ins Wasser und <b>warte einfach ab</b>: Erst zieht er wunderschöne
    Schlieren – wie Milch im Kakao! Dann schubsen die wuselnden Wasser-Teilchen die
    Saft-Teilchen kreuz und quer, bis alles gleichmäßig gemischt ist. <b>Ganz ohne Löffel!</b>
    In <b>warmem</b> Wasser wuseln alle schneller – der Saft verteilt sich viel fixer.`,
  wow: `Genauso wandert der Duft von frischen Keksen durch die ganze Wohnung –
    Duft-Teilchen werden von Luft-Teilchen <b>bis in dein Zimmer geschubst</b>!`,
  params: [
    { key: 'temp', label: 'Wasser-Temperatur', min: 0.2, max: 3, step: 0.01, start: 1,
      format: v => v < 0.8 ? '🥶 Eiswasser' : v < 1.9 ? '🚰 Normal' : '♨️ Heiß' }
  ],
  knoepfe: [
    { label: '🧃 Einkippen!', tue: (s) => {
        if (s.phase === 0 || s.phase >= 3) {
          s.phase = 1; s.phaseT = 0;
          Baukasten.ton(300, 0.12, 'sine', 0.1);
        }
      } }
  ],
  init(s) {
    s.NX = 86; s.NY = 56; s.N = s.NX * s.NY;
    s.u = new Float32Array(s.N); s.v = new Float32Array(s.N);
    s.u0 = new Float32Array(s.N); s.v0 = new Float32Array(s.N);
    s.dye = new Float32Array(s.N); s.d0 = new Float32Array(s.N);
    s.div = new Float32Array(s.N); s.p = new Float32Array(s.N);
    s.phase = 0; s.phaseT = 0;
    s.gitterCv = document.createElement('canvas');
    s.gitterCv.width = s.NX; s.gitterCv.height = s.NY;
    s.gitterCtx = s.gitterCv.getContext('2d');
    s.img = s.gitterCtx.createImageData(s.NX, s.NY);
  },
  schritt(s, p, dt) {
    if (s.phase > 0) s.phaseT += dt;
    if (s.phase === 1 && s.phaseT > 1.1) { s.phase = 2; s.phaseT = 0; }
    if (s.phase === 2 && s.phaseT > 2.2) { s.phase = 3; s.phaseT = 0; }
    if (s.phase === 3 && s.phaseT > 1.1) { s.phase = 4; s.phaseT = 0; }
    // Gießen: Saft + Schwung an der Eintrittsstelle
    if (s.phase === 2) {
      const I = (x, y) => y * s.NX + x;
      const gx = Math.round(s.NX * 0.46);
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = 1; oy <= 3; oy++) {
          const i = I(gx + ox, oy);
          s.dye[i] = Math.min(1, s.dye[i] + 3 * dt);
          s.v[i] += 26 * dt;
          s.u[i] += (Math.random() - 0.5) * 8 * dt;
        }
      }
    }
    saftFluidSchritt(s, p.temp);
  },
  malen(ctx, s, p) {
    PBU.himmel(ctx, s.w, s.h, '#fdf0e0', '#fdf9f2');
    // Farbfeld berechnen: helles Wasser -> leuchtender Saft (wie eine Wärmebild-Kamera)
    const d = s.img.data;
    for (let i = 0; i < s.N; i++) {
      let t = s.dye[i];
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      // Wurzel macht auch dünne Schlieren sichtbar; Verlauf hell -> orange -> dunkles
      // Weinrot: die Helligkeit fällt durchgehend, damit es auch bei
      // Farbenschwäche klar erkennbar bleibt
      t = Math.sqrt(t);
      // Johannisbeersaft: fast-weißes Wasser -> Beeren-Magenta -> fast-schwarzes Purpur
      let r, g, b;
      if (t < 0.5) {
        const k = t / 0.5;
        r = 238 - k * 38; g = 244 - k * 204; b = 252 - k * 142;
      } else {
        const k = (t - 0.5) / 0.5;
        r = 200 - k * 145; g = 40 - k * 40; b = 110 - k * 60;
      }
      d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
    }
    s.gitterCtx.putImageData(s.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(s.gitterCv, 186, 136, 428, 280);
    // Glas
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(180, 100); ctx.lineTo(180, 420); ctx.lineTo(620, 420); ctx.lineTo(620, 100);
    ctx.stroke();
    // Saft-Tüte: steht, kippt, gießt, kommt zurück
    let tx = 692, ty = 372, rot = 0;
    const glatt = t => t * t * (3 - 2 * t);
    if (s.phase === 1) {
      const k = glatt(PBU.klemme(s.phaseT / 1.1, 0, 1));
      tx = 692 + (400 - 692) * k; ty = 372 + (96 - 372) * k; rot = -2.4 * k;
    } else if (s.phase === 2) {
      tx = 400; ty = 96 + Math.sin(s.zeit * 10) * 1.5; rot = -2.4;
    } else if (s.phase === 3) {
      const k = glatt(PBU.klemme(s.phaseT / 1.1, 0, 1));
      tx = 400 + (692 - 400) * k; ty = 96 + (372 - 96) * k; rot = -2.4 * (1 - k);
    }
    // Gieß-Strahl vom Zipfel zur Wasseroberfläche
    if (s.phase === 2) {
      const zx = tx + (-14 * Math.cos(rot) + 42 * Math.sin(rot));
      const zy = ty + (-14 * Math.sin(rot) - 42 * Math.cos(rot));
      ctx.save();
      ctx.strokeStyle = 'rgba(255,120,40,0.85)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(zx, zy);
      ctx.quadraticCurveTo(zx + 2, (zy + 148) / 2, zx + Math.sin(s.zeit * 14) * 2, 152);
      ctx.stroke();
      ctx.restore();
    }
    malTuete(ctx, tx, ty, rot);
    // Wie gut ist es gemischt?
    let summe = 0;
    for (let i = 0; i < s.N; i++) summe += s.dye[i];
    const mittel = summe / s.N;
    let text;
    if (s.phase === 0) text = 'Drück auf „Einkippen“ – und schau ganz genau hin!';
    else if (s.phase === 1) text = 'Vorsichtig anheben …';
    else if (s.phase === 2) text = 'Gluck, gluck – der Saft fließt hinein!';
    else {
      let varianz = 0;
      for (let i = 0; i < s.N; i++) varianz += (s.dye[i] - mittel) * (s.dye[i] - mittel);
      varianz /= s.N;
      text = mittel > 0.03 && varianz < 0.006
        ? '🎉 Fertig gemischt – ganz ohne Löffel!'
        : 'Schau den Schlieren zu – es mischt sich von ganz allein …';
    }
    PBU.text(ctx, text, s.w / 2, 55, 21, '#3a3352');
    PBU.text(ctx, 'Warmes Wasser wuselt stärker – der Saft verteilt sich schneller!', s.w / 2, 460, 16, '#6b6489');
  }
});
