'use strict';
/* ===== Physik Baukasten – Engine =====
 * Kleines Framework: Welten registrieren Demos, die Engine kümmert sich um
 * Navigation, Canvas-Schleife, Regler, Knöpfe, Töne und Sterne.
 */
const Baukasten = (() => {
  const W = 800, H = 500;           // logische Bühnengröße
  const welten = [];
  const weltenById = {};

  let sterne = {};
  try { sterne = JSON.parse(localStorage.getItem('pb_sterne') || '{}'); } catch (e) {}
  let tonAn = localStorage.getItem('pb_ton') !== 'aus';
  let dunkelAn = localStorage.getItem('pb_dunkel') === 'an';

  /* ---------- Registrierung ---------- */
  function welt(def) {
    def.demos = [];
    welten.push(def);
    weltenById[def.id] = def;
  }
  function demo(weltId, def) {
    weltenById[weltId].demos.push(def);
  }

  /* ---------- Audio ---------- */
  let audioCtx = null;
  function holeAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function ton(freq, dauer = 0.35, typ = 'sine', vol = 0.2) {
    if (!tonAn) return;
    const ac = holeAudio();
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = typ; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dauer);
    o.connect(g).connect(ac.destination);
    o.start(); o.stop(ac.currentTime + dauer);
  }
  // Dauerton mit Handle (für die Klang-Welt)
  function dauerton(freq, typ = 'sine', vol = 0.15) {
    const ac = holeAudio();
    if (!ac || !tonAn) return { setFreq() {}, setVol() {}, stop() {} };
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = typ; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g).connect(ac.destination);
    o.start();
    return {
      setFreq(f) { o.frequency.setTargetAtTime(f, ac.currentTime, 0.02); },
      setVol(v) { g.gain.setTargetAtTime(v, ac.currentTime, 0.02); },
      stop() {
        g.gain.setTargetAtTime(0.0001, ac.currentTime, 0.05);
        o.stop(ac.currentTime + 0.3);
      }
    };
  }

  /* ---------- Sterne ---------- */
  function sternZahl() { return Object.keys(sterne).length; }
  function demoZahl() { return welten.reduce((n, w) => n + w.demos.length, 0); }
  function verdieneStern(demoId) {
    if (sterne[demoId]) return;
    sterne[demoId] = true;
    try { localStorage.setItem('pb_sterne', JSON.stringify(sterne)); } catch (e) {}
    const el = document.createElement('div');
    el.className = 'stern-blitz';
    el.textContent = '⭐';
    el.style.left = (window.innerWidth / 2 - 24) + 'px';
    el.style.top = (window.innerHeight / 2 - 24) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
    ton(880, 0.15, 'triangle', 0.15);
    setTimeout(() => ton(1320, 0.25, 'triangle', 0.15), 120);
    const anzeige = document.querySelector('.stern-zaehler');
    if (anzeige) anzeige.textContent = `⭐ ${sternZahl()} / ${demoZahl()}`;
  }

  /* ---------- Navigation ---------- */
  const app = () => document.getElementById('app');
  let aktiv = null; // laufende Station

  function stoppeAktiv() {
    if (!aktiv) return;
    cancelAnimationFrame(aktiv.raf);
    if (aktiv.state && aktiv.state._aufraeumen) {
      try { aktiv.state._aufraeumen(); } catch (e) {}
    }
    aktiv = null;
  }

  function setzeHash(h) {
    if (('#' + h) !== location.hash) {
      ignoriereHash = true;
      location.hash = h;
    }
  }
  let ignoriereHash = false;
  window.addEventListener('hashchange', () => {
    if (ignoriereHash) { ignoriereHash = false; return; }
    route();
  });

  function route() {
    const teile = location.hash.replace('#', '').split('/');
    if (teile[0] && weltenById[teile[0]]) {
      const w = weltenById[teile[0]];
      if (teile.length > 1 && w.demos[+teile[1]]) zeigeStation(w, +teile[1], false);
      else zeigeWelt(w, false);
    } else {
      zeigeHome(false);
    }
  }

  /* ---------- Startseite ---------- */
  function zeigeHome(hash = true) {
    stoppeAktiv();
    if (hash) setzeHash('');
    const a = app();
    a.innerHTML = '';
    a.appendChild(bauKopf());

    const gitter = document.createElement('div');
    gitter.className = 'welt-gitter';
    for (const w of welten) {
      const fertig = w.demos.filter(d => sterne[d.id]).length;
      const karte = document.createElement('button');
      karte.className = 'welt-karte';
      karte.innerHTML = `
        <span class="band" style="background:${w.farbe}"></span>
        <span class="emoji">${w.emoji}</span>
        <h2>${w.name}</h2>
        <p>${w.beschreibung}</p>
        <span class="fortschritt" style="color:${w.farbe}">${'⭐'.repeat(fertig)}${'☆'.repeat(w.demos.length - fertig)}</span>`;
      karte.onclick = () => zeigeWelt(w);
      gitter.appendChild(karte);
    }
    a.appendChild(gitter);

    const leiste = document.createElement('div');
    leiste.className = 'zufall-leiste';
    const zufall = document.createElement('button');
    zufall.className = 'grosser-knopf';
    zufall.textContent = '🎲 Überrasch mich!';
    zufall.onclick = () => {
      const w = welten[Math.floor(Math.random() * welten.length)];
      zeigeStation(w, Math.floor(Math.random() * w.demos.length));
    };
    leiste.appendChild(zufall);
    a.appendChild(leiste);
  }

  function bauKopf() {
    const kopf = document.createElement('div');
    kopf.className = 'kopf';
    kopf.innerHTML = `
      <h1><span class="wackel">🔭</span> Physik Baukasten</h1>
      <div class="kopf-knoepfe">
        <span class="stern-zaehler">⭐ ${sternZahl()} / ${demoZahl()}</span>
        <button class="runder-knopf" id="dunkel-knopf" title="Hell/Dunkel">${dunkelAn ? '☀️' : '🌙'}</button>
        <button class="runder-knopf" id="ton-knopf" title="Ton an/aus">${tonAn ? '🔔' : '🔕'}</button>
      </div>
      <div class="untertitel">Drehen, schieben, staunen – so fühlt sich Physik an!</div>`;
    kopf.querySelector('#ton-knopf').onclick = (ev) => {
      tonAn = !tonAn;
      try { localStorage.setItem('pb_ton', tonAn ? 'an' : 'aus'); } catch (e) {}
      ev.target.textContent = tonAn ? '🔔' : '🔕';
      if (tonAn) ton(660, 0.15);
    };
    kopf.querySelector('#dunkel-knopf').onclick = (ev) => {
      dunkelAn = !dunkelAn;
      try { localStorage.setItem('pb_dunkel', dunkelAn ? 'an' : 'aus'); } catch (e) {}
      document.body.classList.toggle('dunkel', dunkelAn);
      ev.target.textContent = dunkelAn ? '☀️' : '🌙';
    };
    return kopf;
  }

  /* ---------- Welt-Seite ---------- */
  function zeigeWelt(w, hash = true) {
    stoppeAktiv();
    if (hash) setzeHash(w.id);
    const a = app();
    a.innerHTML = '';

    const leiste = document.createElement('div');
    leiste.className = 'zurueck-leiste';
    const zurueck = document.createElement('button');
    zurueck.className = 'zurueck-knopf';
    zurueck.textContent = '⬅️ Übersicht';
    zurueck.onclick = () => zeigeHome();
    leiste.appendChild(zurueck);
    const titel = document.createElement('h2');
    titel.className = 'welt-titel';
    titel.innerHTML = `<span>${w.emoji}</span> ${w.name}`;
    leiste.appendChild(titel);
    a.appendChild(leiste);

    const liste = document.createElement('div');
    liste.className = 'station-liste';
    w.demos.forEach((d, i) => {
      const karte = document.createElement('button');
      karte.className = 'station-karte';
      karte.innerHTML = `
        <span class="emoji">${d.emoji}</span>
        <span><h3>${i + 1}. ${d.name}</h3><p>${d.frage}</p></span>
        <span class="stern">${sterne[d.id] ? '⭐' : '☆'}</span>`;
      karte.onclick = () => zeigeStation(w, i);
      liste.appendChild(karte);
    });
    a.appendChild(liste);
  }

  /* ---------- Stations-Seite ---------- */
  function zeigeStation(w, idx, hash = true) {
    stoppeAktiv();
    if (hash) setzeHash(w.id + '/' + idx);
    const d = w.demos[idx];
    const a = app();
    a.innerHTML = '';

    // Kopf
    const kopf = document.createElement('div');
    kopf.className = 'station-kopf';
    const zurueck = document.createElement('button');
    zurueck.className = 'zurueck-knopf';
    zurueck.textContent = `⬅️ ${w.emoji}`;
    zurueck.onclick = () => zeigeWelt(w);
    kopf.appendChild(zurueck);
    const titel = document.createElement('h2');
    titel.textContent = `${d.emoji} ${d.name}`;
    kopf.appendChild(titel);
    a.appendChild(kopf);

    // Bühne
    const buehne = document.createElement('div');
    buehne.className = 'buehne';
    const canvas = document.createElement('canvas');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    buehne.appendChild(canvas);
    a.appendChild(buehne);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Parameter
    const params = {};
    (d.params || []).forEach(pd => { params[pd.key] = pd.start; });

    // Regler + Knöpfe
    const kasten = document.createElement('div');
    kasten.className = 'regler-kasten';
    (d.params || []).forEach(pd => {
      const zeile = document.createElement('div');
      zeile.className = 'regler-zeile';
      const label = document.createElement('label');
      label.textContent = pd.label;
      const regler = document.createElement('input');
      regler.type = 'range';
      regler.min = pd.min; regler.max = pd.max;
      regler.step = pd.step || 1; regler.value = pd.start;
      const wert = document.createElement('span');
      wert.className = 'regler-wert';
      const zeigWert = () => {
        wert.textContent = pd.format ? pd.format(params[pd.key]) : params[pd.key];
      };
      regler.addEventListener('input', () => {
        // Exakt aufs Regler-Raster runden: verhindert Fließkomma-Schmutz,
        // durch den Anzeigen an Schwellen je nach Zieh-Richtung springen
        const st = parseFloat(pd.step || 1);
        let v = parseFloat(regler.value);
        v = Math.round((v - pd.min) / st) * st + pd.min;
        params[pd.key] = Math.round(v * 1e6) / 1e6;
        zeigWert();
        if ((d.neustartBei || []).includes(pd.key)) neustart();
        verdieneStern(d.id);
      });
      zeigWert();
      zeile.appendChild(label); zeile.appendChild(regler); zeile.appendChild(wert);
      kasten.appendChild(zeile);
    });

    const knopfZeile = document.createElement('div');
    knopfZeile.className = 'knopf-zeile';
    (d.knoepfe || []).forEach(kd => {
      const k = document.createElement('button');
      k.className = 'aktions-knopf';
      k.textContent = kd.label;
      k.onclick = () => { kd.tue(zustand(), params); verdieneStern(d.id); };
      knopfZeile.appendChild(k);
    });
    const reset = document.createElement('button');
    reset.className = 'aktions-knopf neustart';
    reset.textContent = '🔄 Neu starten';
    reset.onclick = () => neustart();
    knopfZeile.appendChild(reset);
    kasten.appendChild(knopfZeile);
    a.appendChild(kasten);

    // Erklärungen
    const erkl = document.createElement('div');
    erkl.className = 'erklaer-kasten';
    erkl.innerHTML = `
      <div class="sprech-blase"><h4>🧐 Was passiert hier?</h4>${d.erklaerung}</div>
      ${d.wow ? `<div class="sprech-blase wow"><h4>🤯 Schon gewusst?</h4>${d.wow}</div>` : ''}`;
    a.appendChild(erkl);

    // Vor/Zurück
    const nav = document.createElement('div');
    nav.className = 'nav-leiste';
    const vorher = document.createElement('button');
    vorher.className = 'nav-knopf';
    vorher.textContent = '⬅️ Vorherige Station';
    vorher.disabled = idx === 0;
    vorher.onclick = () => zeigeStation(w, idx - 1);
    const zufall = document.createElement('button');
    zufall.className = 'nav-knopf';
    zufall.textContent = '🎲 Überrasch mich!';
    zufall.onclick = () => {
      const zw = welten[Math.floor(Math.random() * welten.length)];
      zeigeStation(zw, Math.floor(Math.random() * zw.demos.length));
    };
    const weiter = document.createElement('button');
    weiter.className = 'nav-knopf';
    if (idx < w.demos.length - 1) {
      weiter.textContent = 'Nächste Station ➡️';
      weiter.onclick = () => zeigeStation(w, idx + 1);
    } else {
      weiter.textContent = 'Zur Übersicht 🏠';
      weiter.onclick = () => zeigeHome();
    }
    nav.appendChild(vorher); nav.appendChild(zufall); nav.appendChild(weiter);
    a.appendChild(nav);

    // Zustand + Schleife
    aktiv = { welt: w, idx, demo: d, canvas, ctx, params, state: null, raf: 0, tLast: 0 };
    function zustand() { return aktiv ? aktiv.state : {}; }
    function neustart() {
      if (!aktiv) return;
      if (aktiv.state && aktiv.state._aufraeumen) {
        try { aktiv.state._aufraeumen(); } catch (e) {}
      }
      const s = { w: W, h: H, zeit: 0 };
      aktiv.state = s;
      if (d.init) d.init(s, params);
    }
    neustart();

    // Zeiger-Eingaben
    function xy(ev) {
      const r = canvas.getBoundingClientRect();
      return [(ev.clientX - r.left) / r.width * W, (ev.clientY - r.top) / r.height * H];
    }
    if (d.zeiger) {
      canvas.addEventListener('pointerdown', ev => {
        try { canvas.setPointerCapture(ev.pointerId); } catch (e) {}
        const [x, y] = xy(ev);
        d.zeiger(zustand(), params, 'runter', x, y);
        verdieneStern(d.id);
      });
      canvas.addEventListener('pointermove', ev => {
        const [x, y] = xy(ev);
        d.zeiger(zustand(), params, 'zieh', x, y);
      });
      canvas.addEventListener('pointerup', ev => {
        const [x, y] = xy(ev);
        d.zeiger(zustand(), params, 'hoch', x, y);
      });
    }

    function schleife(t) {
      if (!aktiv) return;
      const dt = Math.min(0.033, aktiv.tLast ? (t - aktiv.tLast) / 1000 : 0.016);
      aktiv.tLast = t;
      aktiv.state.zeit += dt;
      if (d.schritt) d.schritt(aktiv.state, params, dt);
      ctx.save();
      ctx.clearRect(0, 0, W, H);
      d.malen(ctx, aktiv.state, params);
      ctx.restore();
      aktiv.raf = requestAnimationFrame(schleife);
    }
    aktiv.raf = requestAnimationFrame(schleife);
    window.scrollTo(0, 0);
  }

  function start() {
    document.body.classList.toggle('dunkel', dunkelAn);
    route();
  }

  // Nur für Tests: Zugriff auf die laufende Station
  function _debug() { return aktiv; }

  return { welt, demo, start, ton, dauerton, W, H, _debug };
})();

/* ===== PBU – kleine Mal-Helfer für alle Welten ===== */
const PBU = {
  emoji(ctx, e, x, y, groesse) {
    ctx.save();
    ctx.font = `${groesse}px "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // dezenter Schatten, damit die blassen Win10-Glyphen vom Hintergrund abheben
    ctx.shadowColor = 'rgba(40,35,70,0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText(e, x, y);
    ctx.restore();
  },
  // Emoji auf weißer Spielstein-Plakette – für kleine Sammel-Objekte
  plakette(ctx, e, x, y, gr) {
    PBU.kreis(ctx, x, y, gr * 0.72, '#ffffff');
    PBU.ring(ctx, x, y, gr * 0.72, '#3a3352', 2.5);
    PBU.emoji(ctx, e, x, y + 1, gr * 0.85);
  },
  text(ctx, t, x, y, groesse = 20, farbe = '#3a3352', ausrichtung = 'center') {
    ctx.save();
    ctx.font = `bold ${groesse}px "Segoe UI", sans-serif`;
    ctx.fillStyle = farbe;
    ctx.textAlign = ausrichtung;
    ctx.textBaseline = 'middle';
    ctx.fillText(t, x, y);
    ctx.restore();
  },
  // Himmel-Verlauf als Hintergrund
  himmel(ctx, w, h, oben = '#bde7ff', unten = '#eaf9ff') {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, oben);
    g.addColorStop(1, unten);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  },
  nacht(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0e1035');
    g.addColorStop(1, '#2a2d5e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  },
  boden(ctx, w, h, hoehe = 60, farbe = '#8bc34a') {
    ctx.fillStyle = farbe;
    ctx.fillRect(0, h - hoehe, w, hoehe);
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, h - hoehe, w, 8);
  },
  kreis(ctx, x, y, r, farbe) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = farbe;
    ctx.fill();
  },
  ring(ctx, x, y, r, farbe, dicke = 3) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = farbe;
    ctx.lineWidth = dicke;
    ctx.stroke();
  },
  kasten(ctx, x, y, w, h, farbe, radius = 8) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, radius);
    else ctx.rect(x, y, w, h);
    ctx.fillStyle = farbe;
    ctx.fill();
  },
  pfeil(ctx, x1, y1, x2, y2, farbe = '#e63946', dicke = 5) {
    const dx = x2 - x1, dy = y2 - y1;
    const laenge = Math.hypot(dx, dy);
    if (laenge < 2) return;
    const wx = dx / laenge, wy = dy / laenge;
    ctx.save();
    ctx.strokeStyle = farbe; ctx.fillStyle = farbe;
    ctx.lineWidth = dicke; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - wx * 12, y2 - wy * 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - wx * 16 - wy * 8, y2 - wy * 16 + wx * 8);
    ctx.lineTo(x2 - wx * 16 + wy * 8, y2 - wy * 16 - wx * 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
  // Konfetti-Partikel in state._konfetti
  konfettiStart(s, x, y, anzahl = 40) {
    s._konfetti = s._konfetti || [];
    const farben = ['#e63946', '#f5c518', '#42a5f5', '#7ed321', '#b565d8'];
    for (let i = 0; i < anzahl; i++) {
      s._konfetti.push({
        x, y,
        vx: (Math.random() - 0.5) * 400,
        vy: -Math.random() * 350 - 80,
        farbe: farben[i % farben.length],
        leben: 1.2 + Math.random() * 0.6,
        gr: 4 + Math.random() * 5
      });
    }
  },
  konfettiSchritt(s, dt) {
    if (!s._konfetti) return;
    for (const k of s._konfetti) {
      k.vy += 600 * dt;
      k.x += k.vx * dt;
      k.y += k.vy * dt;
      k.leben -= dt;
    }
    s._konfetti = s._konfetti.filter(k => k.leben > 0);
  },
  konfettiMalen(ctx, s) {
    if (!s._konfetti) return;
    for (const k of s._konfetti) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, k.leben);
      ctx.fillStyle = k.farbe;
      ctx.fillRect(k.x - k.gr / 2, k.y - k.gr / 2, k.gr, k.gr);
      ctx.restore();
    }
  },
  klemme(v, min, max) { return Math.max(min, Math.min(max, v)); },

  /* --- Kräftige, selbst gezeichnete Figuren (Win10-Emojis sind zu blass) --- */
  malStein(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#7d7f8a';
    ctx.beginPath();
    ctx.moveTo(-r, 2);
    ctx.quadraticCurveTo(-r * 0.9, -r, 0, -r * 0.85);
    ctx.quadraticCurveTo(r, -r * 0.7, r * 0.95, r * 0.1);
    ctx.quadraticCurveTo(r * 0.6, r * 0.85, -r * 0.3, r * 0.8);
    ctx.quadraticCurveTo(-r * 1.05, r * 0.6, -r, 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5c5e68'; ctx.lineWidth = 2.5; ctx.stroke();
    PBU.kreis(ctx, -r * 0.3, -r * 0.35, r * 0.26, 'rgba(255,255,255,0.22)');
    PBU.kreis(ctx, r * 0.3, r * 0.28, r * 0.2, 'rgba(0,0,0,0.16)');
    ctx.restore();
  },
  malBlatt(ctx, x, y, gr, drehung = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(drehung);
    ctx.fillStyle = '#55a832';
    ctx.beginPath();
    ctx.moveTo(0, -gr * 0.55);
    ctx.quadraticCurveTo(gr * 0.6, -gr * 0.2, 0, gr * 0.55);
    ctx.quadraticCurveTo(-gr * 0.6, -gr * 0.2, 0, -gr * 0.55);
    ctx.fill();
    ctx.strokeStyle = '#3a7a1f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -gr * 0.72); ctx.lineTo(0, gr * 0.5); ctx.stroke();
    ctx.restore();
  },
  malAstronaut(ctx, x, y, gr) { // x = Mitte, y = Füße
    const f = gr / 60;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    ctx.lineCap = 'round';
    // Beine
    ctx.strokeStyle = '#dfe3ee'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-5, -22); ctx.lineTo(-10, -2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(7, -22); ctx.lineTo(12, -2); ctx.stroke();
    // Rucksack
    PBU.kasten(ctx, -20, -48, 10, 24, '#9aa3b5', 3);
    // Körper
    PBU.kasten(ctx, -13, -52, 27, 32, '#f4f6fb', 9);
    ctx.strokeStyle = '#b9c0d4'; ctx.lineWidth = 2;
    ctx.strokeRect(-7, -44, 15, 9); // Brust-Panel
    // Arme
    ctx.strokeStyle = '#dfe3ee'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-9, -46); ctx.lineTo(-21, -32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, -46); ctx.lineTo(23, -32); ctx.stroke();
    // Helm + Visier
    PBU.kreis(ctx, 1, -62, 14, '#f4f6fb');
    ctx.fillStyle = '#2b2f4a';
    ctx.beginPath(); ctx.ellipse(3, -62, 9, 7, 0, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, 6, -65, 2.5, 'rgba(255,255,255,0.8)');
    ctx.restore();
  },
  malSchieber(ctx, x, y, schiebt) { // x = Füße, schaut nach rechts
    ctx.save();
    ctx.translate(x, y);
    if (schiebt) ctx.rotate(0.12);
    ctx.lineCap = 'round';
    // Beine
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-2, -26); ctx.lineTo(-16, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, -26); ctx.lineTo(9, 0); ctx.stroke();
    // Körper
    ctx.strokeStyle = '#c1272d'; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(-3, -27); ctx.lineTo(6, -50); ctx.stroke();
    // Arme nach vorn
    ctx.strokeStyle = '#f0bd93'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(5, -48); ctx.lineTo(26, -40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, -43); ctx.lineTo(26, -33); ctx.stroke();
    // Kopf + Haar
    PBU.kreis(ctx, 11, -61, 10, '#f0bd93');
    ctx.fillStyle = '#6b4a1e';
    ctx.beginPath(); ctx.arc(11, -63, 10, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    ctx.restore();
  },
  malBall(ctx, x, y, r, sorte, quetsch = 0) {
    ctx.save();
    ctx.translate(x, y);
    if (quetsch > 0) ctx.scale(1 + quetsch * 0.3, 1 - quetsch * 0.35);
    if (sorte === 0) { // Knetball: braun, matt, leicht verbeult
      ctx.fillStyle = '#8a6248';
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.9, 0.25, 0, Math.PI * 2); ctx.fill();
      PBU.kreis(ctx, -r * 0.3, r * 0.2, r * 0.28, 'rgba(0,0,0,0.13)');
      PBU.kreis(ctx, r * 0.35, -r * 0.25, r * 0.2, 'rgba(0,0,0,0.1)');
    } else if (sorte === 1) { // Fußball
      PBU.kreis(ctx, 0, 0, r, '#f6f6f6');
      ctx.strokeStyle = '#2b2b33'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#2b2b33';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const w = -Math.PI / 2 + i * Math.PI * 2 / 5;
        const px = Math.cos(w) * r * 0.34, py = Math.sin(w) * r * 0.34;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const w = -Math.PI / 2 + i * Math.PI * 2 / 5;
        ctx.strokeStyle = '#2b2b33'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(w) * r * 0.34, Math.sin(w) * r * 0.34);
        ctx.lineTo(Math.cos(w) * r * 0.85, Math.sin(w) * r * 0.85);
        ctx.stroke();
      }
    } else if (sorte === 2) { // Basketball
      PBU.kreis(ctx, 0, 0, r, '#e4762b');
      ctx.strokeStyle = '#5a2d0c'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * 0.55, 0, 0, r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(-r * 0.55, 0, 0, r); ctx.stroke();
    } else { // Super-Flummi: knallig und glänzend
      const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      g.addColorStop(0, '#ff6b9c');
      g.addColorStop(0.6, '#e6255f');
      g.addColorStop(1, '#a3123f');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.ellipse(-r * 0.35, -r * 0.4, r * 0.25, r * 0.15, -0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
  malKind(ctx, x, y, gr, sitzt = false) { // x = Mitte, y = Füße
    const f = gr / 56;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    ctx.lineCap = 'round';
    // Beine
    ctx.strokeStyle = '#3a5ba0'; ctx.lineWidth = 7;
    if (sitzt) {
      ctx.beginPath(); ctx.moveTo(-2, -20); ctx.lineTo(12, -17); ctx.lineTo(14, -4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(2, -20); ctx.lineTo(17, -15); ctx.lineTo(19, -2); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(-1, -22); ctx.lineTo(-7, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1, -22); ctx.lineTo(7, 0); ctx.stroke();
    }
    // Körper
    ctx.strokeStyle = '#ff8c42'; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(0, -40); ctx.stroke();
    // Arme
    ctx.strokeStyle = '#f0bd93'; ctx.lineWidth = 5;
    if (sitzt) {
      ctx.beginPath(); ctx.moveTo(-1, -36); ctx.lineTo(13, -26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(3, -37); ctx.lineTo(16, -28); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(0, -37); ctx.lineTo(-11, -26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -37); ctx.lineTo(11, -26); ctx.stroke();
    }
    // Kopf + Haar + Gesicht
    PBU.kreis(ctx, 0, -50, 10, '#f0bd93');
    ctx.fillStyle = '#6b4a1e';
    ctx.beginPath(); ctx.arc(0, -52, 10, Math.PI, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, -3.5, -50, 1.4, '#3a3352');
    PBU.kreis(ctx, 3.5, -50, 1.4, '#3a3352');
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -47.5, 4, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.restore();
  },
  malHaus(ctx, x, y, gr) { // x = Mitte, y = Boden, gr = Breite
    const b = gr, h = gr * 0.72;
    ctx.save();
    ctx.translate(x, y);
    PBU.kasten(ctx, -b / 2, -h, b, h, '#f2e3c2', 3);
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = Math.max(2, gr * 0.05);
    ctx.strokeRect(-b / 2, -h, b, h);
    ctx.fillStyle = '#c1272d';
    ctx.beginPath();
    ctx.moveTo(-b * 0.6, -h); ctx.lineTo(0, -h - b * 0.45); ctx.lineTo(b * 0.6, -h);
    ctx.closePath(); ctx.fill();
    PBU.kasten(ctx, -b * 0.13, -h * 0.55, b * 0.26, h * 0.55, '#7a5326', 2);
    PBU.kasten(ctx, b * 0.15, -h * 0.82, b * 0.24, h * 0.3, '#9adcf5', 2);
    ctx.restore();
  },
  malBaum(ctx, x, y, gr) { // y = Boden, gr = Höhe
    PBU.kasten(ctx, x - gr * 0.07, y - gr * 0.42, gr * 0.14, gr * 0.42, '#7a5326', 3);
    PBU.kreis(ctx, x - gr * 0.2, y - gr * 0.52, gr * 0.24, '#5fae3d');
    PBU.kreis(ctx, x + gr * 0.2, y - gr * 0.52, gr * 0.24, '#5fae3d');
    PBU.kreis(ctx, x, y - gr * 0.66, gr * 0.3, '#4d9e12');
  },
  malHund(ctx, x, y, gr) { // y = Boden
    const f = gr / 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 4;
    for (const bx of [-12, -5, 6, 12]) {
      ctx.beginPath(); ctx.moveTo(bx, -8); ctx.lineTo(bx, 0); ctx.stroke();
    }
    ctx.fillStyle = '#a5713a';
    ctx.beginPath(); ctx.ellipse(0, -14, 15, 8, 0, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, 16, -22, 8, '#a5713a');
    ctx.fillStyle = '#7a5326';
    ctx.beginPath(); ctx.ellipse(12, -28, 3, 5.5, 0.5, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, 23, -20, 2, '#3a3352');
    PBU.kreis(ctx, 17, -24, 1.5, '#3a3352');
    ctx.strokeStyle = '#a5713a'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-14, -16); ctx.quadraticCurveTo(-21, -24, -18, -29); ctx.stroke();
    ctx.restore();
  },
  malEnte(ctx, x, y, gr) { // y = Körpermitte
    const f = gr / 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    ctx.fillStyle = '#f5c518';
    ctx.beginPath(); ctx.ellipse(0, 3, 16, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e0a800';
    ctx.beginPath(); ctx.ellipse(-3, 4, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();
    PBU.kreis(ctx, 11, -9, 8, '#f5c518');
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath(); ctx.moveTo(17, -10); ctx.lineTo(26, -8); ctx.lineTo(17, -5); ctx.closePath(); ctx.fill();
    PBU.kreis(ctx, 13, -11, 1.7, '#3a3352');
    ctx.restore();
  },
  malHase(ctx, x, y, gr) { // y = Mitte
    const f = gr / 60;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    // Ohren
    for (const [ox, rot] of [[-6, -0.16], [6, 0.16]]) {
      ctx.save();
      ctx.translate(ox, -16);
      ctx.rotate(rot);
      ctx.fillStyle = '#f5f5f7';
      ctx.beginPath(); ctx.ellipse(0, -11, 4.5, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#b9b4c8'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#f7c8d4';
      ctx.beginPath(); ctx.ellipse(0, -10, 2, 8.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // Körper + Kopf
    ctx.fillStyle = '#f5f5f7';
    ctx.beginPath(); ctx.ellipse(0, 15, 13, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b9b4c8'; ctx.lineWidth = 2; ctx.stroke();
    PBU.kreis(ctx, 0, -7, 11, '#f5f5f7');
    ctx.beginPath(); ctx.arc(0, -7, 11, 0, Math.PI * 2); ctx.stroke();
    // Gesicht
    PBU.kreis(ctx, -4, -9, 1.6, '#3a3352');
    PBU.kreis(ctx, 4, -9, 1.6, '#3a3352');
    ctx.fillStyle = '#f78fb3';
    ctx.beginPath(); ctx.moveTo(-2, -4); ctx.lineTo(2, -4); ctx.lineTo(0, -1.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#b9b4c8'; ctx.lineWidth = 1;
    for (const wy of [-4, -2.5]) {
      ctx.beginPath(); ctx.moveTo(3, wy); ctx.lineTo(10, wy - 1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-3, wy); ctx.lineTo(-10, wy - 1); ctx.stroke();
    }
    ctx.restore();
  },
  malTaschenlampe(ctx, x, y, gr, winkel = 0) { // leuchtet nach rechts
    const f = gr / 50;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(winkel);
    ctx.scale(f, f);
    PBU.kasten(ctx, -24, -7, 32, 14, '#5b6270', 5);
    PBU.kasten(ctx, -20, -4, 10, 3, '#8a93a5', 1);
    ctx.fillStyle = '#8a93a5';
    ctx.beginPath();
    ctx.moveTo(8, -8); ctx.lineTo(20, -13); ctx.lineTo(20, 13); ctx.lineTo(8, 8);
    ctx.closePath(); ctx.fill();
    PBU.kasten(ctx, 20, -13, 5, 26, '#ffe97a', 2);
    ctx.restore();
  },
  malMagnet(ctx, x, y, gr) { // Hufeisen, Öffnung unten, x/y = Mitte
    const f = gr / 50;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    ctx.lineCap = 'butt';
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.arc(0, -3, 16, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-16, -3); ctx.lineTo(-16, 13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, -3); ctx.lineTo(16, 13); ctx.stroke();
    ctx.strokeStyle = '#eef1f8';
    ctx.beginPath(); ctx.moveTo(-16, 13); ctx.lineTo(-16, 23); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, 13); ctx.lineTo(16, 23); ctx.stroke();
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 1.5;
    ctx.strokeRect(-23, 13, 14, 10);
    ctx.strokeRect(9, 13, 14, 10);
    ctx.restore();
  },
  malGluehbirne(ctx, x, y, gr, an) { // y = Kolbenmitte
    const f = gr / 48;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    ctx.fillStyle = an ? '#ffe97a' : '#e7eaf2';
    ctx.beginPath(); ctx.arc(0, -6, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = an ? '#e0a800' : '#9aa3b5'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = an ? '#ff8c42' : '#9aa3b5'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, 1); ctx.lineTo(-2, -6); ctx.lineTo(2, 0); ctx.lineTo(5, -6);
    ctx.stroke();
    PBU.kasten(ctx, -7, 8, 14, 10, '#8a93a5', 2);
    ctx.strokeStyle = '#5b6270'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-7, 11); ctx.lineTo(7, 12);
    ctx.moveTo(-7, 14.5); ctx.lineTo(7, 15.5);
    ctx.stroke();
    ctx.restore();
  },
  malErde(ctx, x, y, r) {
    ctx.save();
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r);
    g.addColorStop(0, '#7ec3f7');
    g.addColorStop(1, '#1d5c94');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    PBU.kreis(ctx, x - r * 0.35, y - r * 0.2, r * 0.34, '#5fae3d');
    PBU.kreis(ctx, x + r * 0.3, y + r * 0.3, r * 0.26, '#5fae3d');
    PBU.kreis(ctx, x + r * 0.2, y - r * 0.45, r * 0.17, '#5fae3d');
    ctx.restore();
  },
  malBallon(ctx, x, y, r, farbe = '#e63946') {
    ctx.fillStyle = farbe;
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.8, r, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.2, r * 0.12, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.moveTo(x, y + r); ctx.lineTo(x + 2, y + r + r * 0.35); ctx.stroke();
  },
  malBuecher(ctx, x, y, gr) { // y = Stapelmitte
    const f = gr / 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    PBU.kasten(ctx, -16, 4, 32, 8, '#42a5f5', 2);
    PBU.kasten(ctx, -14, -4, 28, 8, '#e63946', 2);
    PBU.kasten(ctx, -15, -12, 30, 8, '#7ed321', 2);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillRect(-14, 6, 28, 1.5);
    ctx.fillRect(-12, -2, 24, 1.5);
    ctx.fillRect(-13, -10, 26, 1.5);
    ctx.restore();
  },
  malBlume(ctx, x, y, gr, farbe = '#f5c518') { // x = Mitte, y = Boden
    const f = gr / 34;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, f);
    ctx.lineCap = 'round';
    // Stängel + Blatt
    ctx.strokeStyle = '#4d9e12'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(1, -12, 0, -20); ctx.stroke();
    ctx.fillStyle = '#5fae3d';
    ctx.beginPath(); ctx.ellipse(-4, -9, 4.5, 2, -0.6, 0, Math.PI * 2); ctx.fill();
    // Blütenblätter
    ctx.fillStyle = farbe;
    for (let i = 0; i < 6; i++) {
      const w = i / 6 * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(w) * 5.5, -26 + Math.sin(w) * 5.5, 4, 2.6, w, 0, Math.PI * 2);
      ctx.fill();
    }
    PBU.kreis(ctx, 0, -26, 3.6, '#e07b39');
    ctx.restore();
  },
  malWurfball(ctx, x, y, r) { // weißer Ball mit roten Nähten
    PBU.kreis(ctx, x, y, r, '#f6f6f6');
    ctx.save();
    ctx.strokeStyle = '#3a3352'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x - r * 1.3, y, r * 1.5, -0.5, 0.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + r * 1.3, y, r * 1.5, Math.PI - 0.5, Math.PI + 0.5); ctx.stroke();
    ctx.restore();
  },
  malWasserballon(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(66,165,245,0.68)';
    ctx.beginPath(); ctx.ellipse(0, 2, r * 0.92, r, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1d5c94'; ctx.lineWidth = 3; ctx.stroke();
    // Knoten oben
    ctx.fillStyle = '#1d5c94';
    ctx.beginPath(); ctx.moveTo(-6, -r - 3); ctx.lineTo(6, -r - 3); ctx.lineTo(0, -r + 7); ctx.closePath(); ctx.fill();
    // Glanz + Wasserlinie
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.22, r * 0.12, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 2, r * 0.6, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.restore();
  }
};
