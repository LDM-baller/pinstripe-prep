// Pinstripe Prep — game logic. Questions live in questions.js.
(() => {
"use strict";

const $ = (s, r = document) => r.querySelector(s);
const PITCH_CLOCK = 42;          // real ACT English pace: 50 questions in 35 minutes
const AB_PER_INNING = 3;
const RIVALS = [
  { abbr: "BOS", name: "Red Sox" }, { abbr: "BAL", name: "Orioles" },
  { abbr: "TOR", name: "Blue Jays" }, { abbr: "TB", name: "Rays" },
  { abbr: "HOU", name: "Astros" }, { abbr: "LAD", name: "Dodgers" },
  { abbr: "CLE", name: "Guardians" }, { abbr: "NYM", name: "Mets" },
];
const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

// ---------- saved stats (per device) ----------
const KEY = "pinstripePrep.v1";
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
}
let S = load() || { q: {}, w: 0, l: 0, muted: false };
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
function qs(id) { return (S.q[id] ||= { seen: 0, right: 0, film: false, last: null }); }

function ruleStats(rule) {
  let ab = 0, h = 0;
  for (const q of QUESTIONS) if (q.rule === rule && S.q[q.id]) { ab += S.q[q.id].seen; h += S.q[q.id].right; }
  return { ab, h };
}
function avg(h, ab) { return ab ? (h / ab).toFixed(3).replace(/^0/, "") : ".000"; }
function filmIds() { return QUESTIONS.filter(q => S.q[q.id]?.film).map(q => q.id); }

// ---------- sound ----------
let ac;
function ctx() { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); return ac; }
function noise(dur) {
  const a = ctx(), b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = a.createBufferSource(); s.buffer = b; return s;
}
function crack() {
  if (S.muted) return; const a = ctx(), t = a.currentTime;
  const n = noise(0.12), f = a.createBiquadFilter(), g = a.createGain();
  f.type = "bandpass"; f.frequency.value = 2600; f.Q.value = 0.8;
  g.gain.setValueAtTime(1.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  n.connect(f).connect(g).connect(a.destination); n.start(t);
  const o = a.createOscillator(), og = a.createGain();
  o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.08);
  og.gain.setValueAtTime(0.8, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  o.connect(og).connect(a.destination); o.start(t); o.stop(t + 0.12);
}
function crowd(dur = 2.5, peak = 0.35) {
  if (S.muted) return; const a = ctx(), t = a.currentTime;
  const n = noise(dur), f = a.createBiquadFilter(), g = a.createGain();
  f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 0.5;
  g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.35);
  g.gain.setValueAtTime(peak, t + dur * 0.55); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  n.connect(f).connect(g).connect(a.destination); n.start(t);
}
function organ(notes, step = 0.16) {
  if (S.muted) return; const a = ctx(); let t = a.currentTime + 0.05;
  for (const [f, len] of notes) {
    for (const mult of [1, 2, 3]) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = "sine"; o.frequency.value = f * mult;
      const v = 0.12 / mult;
      g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + step * len * 0.85); g.gain.linearRampToValueAtTime(0, t + step * len);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + step * len + 0.02);
    }
    t += step * len;
  }
}
const CHARGE = [[392, 1], [523, 1], [659, 1], [784, 2], [659, 1], [784, 3]];
const WIN = [[523, 1], [659, 1], [784, 1], [1047, 2], [784, 1], [1047, 4]];
function whiff() {
  if (S.muted) return; const a = ctx(), t = a.currentTime;
  const o = a.createOscillator(), g = a.createGain();
  o.type = "triangle"; o.frequency.setValueAtTime(330, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.6);
  g.gain.setValueAtTime(0.25, t); g.gain.linearRampToValueAtTime(0, t + 0.65);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.7);
}
function say(text) {
  if (S.muted || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text); u.rate = 1.02; u.pitch = 0.9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function buzz(p) { if (navigator.vibrate) navigator.vibrate(p); }

// ---------- effects ----------
const fx = $("#fx");
function call(cls, big, small, ms = 1700) {
  const d = document.createElement("div");
  d.className = "call " + cls; d.innerHTML = `${big}<small>${small || ""}</small>`;
  fx.appendChild(d); setTimeout(() => d.remove(), ms);
}
function banner(big, small, ms = 2200) {
  const d = document.createElement("div");
  d.className = "banner"; d.innerHTML = `<b>${big}</b><span>${small}</span>`;
  document.body.appendChild(d); setTimeout(() => d.remove(), ms);
}
function flash() { const d = document.createElement("div"); d.className = "flash"; fx.appendChild(d); setTimeout(() => d.remove(), 500); }
function shake() { const g = $("#game"); g.classList.remove("shake"); void g.offsetWidth; g.classList.add("shake"); }
function confetti(n = 80) {
  const colors = ["#f3c552", "#ffffff", "#1f4e8c", "#e0474c"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div"); c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.8 + Math.random() * 2 + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(c); setTimeout(() => c.remove(), 4600);
  }
}
function ballFlight(kind) {
  const b = document.createElement("div"); b.className = "ball"; document.body.appendChild(b);
  const dx = (Math.random() * 0.6 - 0.3) * innerWidth;
  const up = kind === "hr" ? innerHeight * 1.1 : kind === "single" ? innerHeight * 0.35 : innerHeight * 0.6;
  const anim = b.animate([
    { transform: "translate(-50%,0) scale(1.4)" },
    { transform: `translate(calc(-50% + ${dx * 0.6}px), ${-up * 0.8}px) scale(.8)`, offset: 0.6 },
    { transform: `translate(calc(-50% + ${dx}px), ${-up}px) scale(${kind === "hr" ? 0.2 : 0.5})`, opacity: kind === "hr" ? 0 : 1 },
  ], { duration: kind === "hr" ? 1300 : 800, easing: "cubic-bezier(.2,.7,.4,1)" });
  anim.onfinish = () => b.remove();
}

// ---------- screens ----------
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
  scrollTo(0, 0);
}
function home() {
  stopClock(); show("title");
  $("#filmCount").textContent = filmIds().length;
  let ab = 0, h = 0; for (const k in S.q) { ab += S.q[k].seen; h += S.q[k].right; }
  $("#seasonAvg").textContent = avg(h, ab);
  $("#record").textContent = `${S.w}–${S.l}`;
  requestAnimationFrame(() => $("#title").classList.add("lit"));
}

// ---------- picking questions ----------
// Weakest rules come up most: weight by the misses on the real test, then by
// this app's own record, and bring Film Room questions back more often.
const TEST_MISSES = { "Subject-verb agreement": 2 };
function pick(pool, used) {
  let cand = pool.filter(q => !used.has(q.id));
  if (!cand.length) { used.clear(); cand = pool.slice(); }
  const weights = cand.map(q => {
    const st = S.q[q.id], rs = ruleStats(q.rule);
    let w = 1 + (TEST_MISSES[q.rule] || 1) * 0.5;
    w *= 1 + (rs.ab ? (1 - rs.h / rs.ab) : 0.5);
    if (!st || !st.seen) w *= 2;
    if (st?.film) w *= 3;
    if (st && st.last === true && st.right >= 2) w *= 0.4;
    return w;
  });
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < cand.length; i++) { r -= weights[i]; if (r <= 0) return cand[i]; }
  return cand[cand.length - 1];
}

// ---------- game state ----------
let G = null;
let clockT = null, clockStart = 0;

function newGame(mode, opts = {}) {
  const rival = mode === "full" ? RIVALS[0] : RIVALS[Math.floor(Math.random() * RIVALS.length)];
  const innings = mode === "full" ? 9 : mode === "quick" ? 3 : 0;
  G = {
    mode, innings, rival, inning: 1, ab: 0, abNum: 0, outs: 0, bases: [0, 0, 0],
    streak: 0, used: new Set(), opp: [], nyy: [], log: [],
    pool: opts.pool || QUESTIONS, label: opts.label || "", ledAtStart: false,
  };
  show("game");
  const scored = mode === "quick" || mode === "full";
  $("#board").style.display = scored ? "" : "none";
  $(".diamond").style.display = scored ? "" : "none";
  $(".outs").style.display = scored ? "" : "none";
  if (scored) {
    topHalf(() => {
      banner(rival.name === "Red Sox" ? "RIVALRY NIGHT" : "PLAY BALL", `Yankees vs. ${rival.name} · ${innings} innings`, 2400);
      organ(CHARGE); crowd(3, 0.25);
      setTimeout(nextAtBat, 1600);
    });
  } else nextAtBat();
}

function oppRuns() {
  // Scaled so a clean game usually wins and a sloppy one usually doesn't.
  const r = Math.random();
  return r < 0.55 ? 0 : r < 0.85 ? 1 : r < 0.97 ? 2 : 3;
}
function topHalf(then) {
  const runs = oppRuns(); G.opp[G.inning - 1] = runs; G.nyy[G.inning - 1] = null;
  drawBoard();
  if (G.inning > 1 && runs > 0) {
    banner(`${G.rival.abbr} +${runs}`, `Top of the ${ORD[G.inning]} · ${G.rival.name} score ${runs}`, 1800);
    setTimeout(then, 1900);
  } else then();
}
const sum = a => a.reduce((x, y) => x + (y || 0), 0);

function drawBoard() {
  if (!G.innings) return;
  const n = Math.max(G.innings, G.inning);
  const cells = (arr, team) => Array.from({ length: n }, (_, i) =>
    `<span class="${i === G.inning - 1 ? "cur" : ""}">${arr[i] == null ? (team === "nyy" && i === G.inning - 1 ? "·" : "") : arr[i]}</span>`).join("");
  $("#board").style.setProperty("--inn", n);
  $("#board").innerHTML = `
    <div class="line hdr"><span class="tm"></span>${Array.from({ length: n }, (_, i) => `<span>${i + 1}</span>`).join("")}<span>R</span></div>
    <div class="line"><span class="tm">${G.rival.abbr}</span>${cells(G.opp, "opp")}<span class="r">${sum(G.opp)}</span></div>
    <div class="line nyy"><span class="tm">NYY</span>${cells(G.nyy, "nyy")}<span class="r">${sum(G.nyy)}</span></div>`;
  ["b1", "b2", "b3"].forEach((b, i) => $("#" + b).classList.toggle("on", !!G.bases[i]));
  ["o1", "o2", "o3"].forEach((o, i) => $("#" + o).classList.toggle("on", i < G.outs));
}

function inningTag() {
  if (G.mode === "bp") return `BATTING PRACTICE<small>${RULES[G.label].short.toUpperCase()}</small>`;
  if (G.mode === "film") return `FILM ROOM<small>${filmIds().length} PLAYS TO REVIEW</small>`;
  const n = G.nyy.map(x => x || 0), diff = sum(n) - sum(G.opp);
  const late = G.inning >= G.innings;
  return `BOT ${ORD[G.inning]}${late && diff <= 0 ? " · CLUTCH" : ""}<small>AT-BAT ${G.ab + 1} OF ${AB_PER_INNING}</small>`;
}

function nextAtBat() {
  let pool = G.pool;
  if (G.mode === "film") {
    const ids = filmIds();
    if (!ids.length) { banner("FILM ROOM CLEAR", "Every missed pitch has been fixed", 2200); setTimeout(home, 2300); return; }
    pool = QUESTIONS.filter(q => ids.includes(q.id));
  }
  const q = pick(pool, G.used); G.used.add(q.id); G.q = q; G.abNum++; G.answered = false;
  $("#inningTag").innerHTML = inningTag();
  drawBoard();
  const letters = G.abNum % 2 ? ["A", "B", "C", "D"] : ["F", "G", "H", "J"];
  G.letters = letters;
  const passage = q.passage.replace(/\[\[(.+?)\]\]/, (_, u) => `<u>${u}</u><span class="num">${G.abNum}</span>`);
  $("#stage").innerHTML = `
    <div class="card">
      <div class="meta"><span>${RULES[q.rule].short}</span><span>Rematch of <b>${q.from}</b></span></div>
      <p class="passage">${passage}</p>
      <p class="stem">${G.abNum}. ${q.stem}</p>
      <div class="choices">${q.choices.map((c, i) =>
        `<button class="choice" data-i="${i}"><span class="L">${letters[i]}</span><span>${c}</span></button>`).join("")}</div>
    </div>`;
  $("#stage").querySelectorAll(".choice").forEach(b => b.onclick = () => answer(+b.dataset.i));
  startClock();
}

function startClock() {
  stopClock(); clockStart = Date.now();
  const el = $("#clock"), n = $("#clockN");
  const tick = () => {
    const left = Math.max(0, PITCH_CLOCK - Math.floor((Date.now() - clockStart) / 1000));
    n.textContent = left;
    el.classList.toggle("hot", left > PITCH_CLOCK - 15);
    el.classList.toggle("cold", left === 0);
  };
  tick(); clockT = setInterval(tick, 250);
}
function stopClock() { clearInterval(clockT); clockT = null; }

function hitType(secs) {
  // Speed earns extra bases, but a right answer always reaches base.
  let bases = secs <= 15 ? 4 : secs <= 24 ? 3 : secs <= 34 ? 2 : 1;
  if (G.streak >= 3 && bases < 4) bases++;
  return bases;
}
const HIT = {
  1: { cls: "hit", big: "SINGLE!", say: "Base hit!" },
  2: { cls: "hit", big: "DOUBLE!", say: "Into the gap, that's a double!" },
  3: { cls: "hit", big: "TRIPLE!", say: "Off the wall! He's going to third!" },
  4: { cls: "hr", big: "HOME RUN!", say: "It is high, it is far, it is gone!" },
};

function answer(i) {
  if (G.answered) return;
  G.answered = true;
  stopClock();
  const q = G.q, secs = (Date.now() - clockStart) / 1000, right = i === q.answer;
  const box = $("#stage .choices"); box.classList.add("locked");
  const btns = box.querySelectorAll(".choice");
  btns[q.answer].classList.add("right");
  if (!right) { btns[i].classList.add("wrong"); btns[q.trap].classList.add("trapmark"); }

  const st = qs(q.id); st.seen++; st.last = right;
  if (right) { st.right++; if (G.mode === "film") st.film = false; } else st.film = true;
  save();
  G.log.push({ id: q.id, rule: q.rule, right });

  const scored = G.mode === "quick" || G.mode === "full";
  let headline;
  if (right) {
    G.streak++;
    const bases = hitType(secs), h = HIT[bases];
    crack(); buzz(40); ballFlight(bases === 4 ? "hr" : bases === 1 ? "single" : "gap");
    if (scored) {
      const runs = advance(bases);
      G.nyy[G.inning - 1] = (G.nyy[G.inning - 1] || 0) + runs;
      setTimeout(() => {
        call(h.cls, h.big, runs ? `${runs} run${runs > 1 ? "s" : ""} score${runs > 1 ? "" : "s"}` : `${secs.toFixed(0)} seconds`);
        if (bases === 4) { flash(); confetti(60); crowd(3, 0.45); organ(CHARGE); } else crowd(1.6, 0.25);
        say(h.say); drawBoard();
      }, 250);
    } else {
      setTimeout(() => { call(h.cls, bases === 4 ? "GONE!" : "BARRELED", `${secs.toFixed(0)} seconds`); if (bases === 4) crowd(1.6, 0.3); }, 250);
    }
    headline = G.streak >= 3 ? `ON FIRE · ${G.streak} STRAIGHT` : "SQUARED IT UP";
  } else {
    G.streak = 0;
    whiff(); shake(); buzz([60, 40, 90]);
    const chased = i === q.trap;
    setTimeout(() => call("k", "STRIKE THREE", chased ? "chased the trap pitch" : "caught looking"), 150);
    say(chased ? "Strike three! He chased it!" : "Strike three called!");
    if (scored) { G.outs++; drawBoard(); }
    headline = chased ? "CHASED THE TRAP" : "STRUCK OUT";
  }

  const L = G.letters;
  const film = document.createElement("div");
  film.className = "film " + (right ? "good" : "bad");
  film.innerHTML = `
    <h4>${headline}</h4>
    <p><b>${L[q.answer]} is right.</b> ${q.why}</p>
    ${right ? `<p style="opacity:.8"><b>The trap was ${L[q.trap]}.</b> ${q.trapWhy}</p>`
            : `<p><b>${i === q.trap ? "You swung at " + L[q.trap] + ", the trap." : "The trap was " + L[q.trap] + "."}</b> ${q.trapWhy}</p>`}
    ${right ? "" : `<p class="tip">📋 ${RULES[q.rule].tip}</p><p style="font-size:13px;opacity:.75">Sent to the Film Room. It'll come back until you hit it.</p>`}
    <button class="btn primary next">${nextLabel()}</button>`;
  $("#stage").appendChild(film);
  film.querySelector(".next").onclick = advanceGame;
  setTimeout(() => film.scrollIntoView({ behavior: "smooth", block: "nearest" }), 600);
}

function advance(bases) {
  // Every runner moves up the same number of bases as the batter.
  let runs = 0; const nb = [0, 0, 0];
  for (let b = 2; b >= 0; b--) if (G.bases[b]) { const to = b + bases; if (to >= 3) runs++; else nb[to] = 1; }
  if (bases >= 4) runs++; else nb[bases - 1] = 1;
  G.bases = nb; return runs;
}

function isWalkoff() {
  // Bottom of the last inning (or extras): taking the lead ends it on the spot.
  return G.inning >= G.innings && !G.ledAtStart && sum(G.nyy) > sum(G.opp);
}
function nextLabel() {
  if (G.mode === "bp" || G.mode === "film") return "Next pitch ▸";
  if (isWalkoff()) return "WALK-OFF ▸";
  if (G.ab + 1 < AB_PER_INNING) return "Next batter ▸";
  return G.inning >= G.innings && sum(G.nyy) !== sum(G.opp) ? "Final ▸" : "End of inning ▸";
}

function scoreLine() {
  const us = sum(G.nyy), them = sum(G.opp);
  return us > them ? `Yankees lead ${us}–${them}` : us === them ? `Tied ${us}–${them}` : `${G.rival.name} lead ${them}–${us}`;
}

function advanceGame() {
  if (G.mode === "bp" || G.mode === "film") return nextAtBat();
  if (isWalkoff()) return endGame(true);
  G.ab++;
  if (G.ab < AB_PER_INNING) return nextAtBat();
  // inning over
  G.nyy[G.inning - 1] ||= 0;
  const lob = G.bases.filter(Boolean).length;
  if (G.inning >= G.innings && sum(G.nyy) !== sum(G.opp)) return endGame(false);
  G.inning++; G.ab = 0; G.outs = 0; G.bases = [0, 0, 0];
  const extra = G.inning > G.innings;
  if (extra) G.bases = [0, 1, 0]; // free runner on second in extras
  $("#stage").innerHTML = ""; $("#inningTag").innerHTML = `MID ${ORD[G.inning - 1]}<small>CHANGING SIDES</small>`;
  topHalf(() => {
    const last = G.inning >= G.innings;
    G.ledAtStart = sum(G.nyy) > sum(G.opp);
    const title = extra ? `FREE BASEBALL · ${ORD[G.inning].toUpperCase()}`
      : `BOTTOM OF THE ${ORD[G.inning].toUpperCase()}`;
    banner(title, (extra ? "Runner on second · " : "") + scoreLine() + (lob ? ` · ${lob} left on base last inning` : ""), 2000);
    if (last && !G.ledAtStart) { organ(CHARGE); say(`Bottom of the ${ORD[G.inning]}. ${scoreLine()}.`); }
    setTimeout(nextAtBat, 1800);
  });
}

function endGame(walkoff) {
  const us = sum(G.nyy), them = sum(G.opp), win = us > them;
  win ? S.w++ : S.l++; save();
  const hits = G.log.filter(x => x.right).length;
  const byRule = {};
  for (const x of G.log) { (byRule[x.rule] ||= { ab: 0, h: 0 }).ab++; if (x.right) byRule[x.rule].h++; }
  const missed = G.log.filter(x => !x.right).length;
  $("#end").innerHTML = `
    <div class="big ${win ? "win" : "loss"}">${walkoff ? "WALK-OFF!" : win ? "YANKEES<br>WIN!" : "TOUGH<br>LOSS"}</div>
    <div class="final">NYY ${us} · ${G.rival.abbr} ${them}</div>
    <p class="center">${hits} for ${G.log.length} today · ${avg(hits, G.log.length)}</p>
    <div class="panel"><h3>Box score by rule</h3>
      ${Object.entries(byRule).map(([r, v]) => rowHTML(RULES[r].short, v.h, v.ab)).join("")}
    </div>
    <div class="menu" style="opacity:1;animation:none">
      ${missed ? `<button class="btn primary" id="toFilm">Film Room <small>${filmIds().length} plays to review</small></button>` : ""}
      <button class="btn ${missed ? "" : "primary"}" id="again">Play again</button>
      <button class="btn" id="toHome">Clubhouse</button>
    </div>`;
  show("end");
  if (win) { organ(WIN); crowd(4, 0.45); confetti(140); say(walkoff ? "Walk-off! The Yankees win it! Levi, you are a hero in the Bronx!" : G.rival.name === "Red Sox" ? "Ballgame over! Yankees win! And the Red Sox go home!" : "Ballgame over! Yankees win!"); }
  else { whiff(); say("That one got away. Let's go to the film room."); }
  $("#again").onclick = () => newGame(G.mode);
  $("#toHome").onclick = home;
  if ($("#toFilm")) $("#toFilm").onclick = () => newGame("film");
}

function rowHTML(label, h, ab, note = "") {
  const pct = ab ? h / ab : 0, cls = pct >= 0.8 ? "" : pct >= 0.5 ? "mid" : "low";
  return `<div class="row"><span>${label} <span style="color:var(--dim)">${h}-for-${ab}</span></span><span class="ba">${avg(h, ab)}</span>
    <div class="bar"><i class="${ab ? cls : ""}" style="width:${ab ? Math.max(4, pct * 100) : 0}%"></i></div>${note ? `<div class="note">${note}</div>` : ""}</div>`;
}

function scout() {
  let ab = 0, h = 0; for (const k in S.q) { ab += S.q[k].seen; h += S.q[k].right; }
  $("#scout").innerHTML = `
    <button class="back" id="sBack">◂ Clubhouse</button>
    <h2 class="bebas">Scouting Report</h2>
    <p class="center" style="text-align:left">Season: ${h}-for-${ab}, ${avg(h, ab)} · Record ${S.w}–${S.l} · Film Room ${filmIds().length}</p>
    <div class="panel"><h3>By rule</h3>
      ${Object.entries(RULES).map(([r, info]) => { const s = ruleStats(r); return rowHTML(info.short, s.h, s.ab, `Missed on the real test: ${info.missed}. ${info.tip}`); }).join("")}
    </div>
    <button class="btn" id="reset" style="width:100%">Reset all stats</button>`;
  show("scout");
  $("#sBack").onclick = home;
  $("#reset").onclick = () => { if (confirm("Wipe every stat on this device?")) { S = { q: {}, w: 0, l: 0, muted: S.muted }; save(); scout(); } };
}

function bpPicker() {
  $("#bp").innerHTML = `
    <button class="back" id="bBack">◂ Clubhouse</button>
    <h2 class="bebas">Batting Practice</h2>
    <p style="color:var(--dim)">Pick one rule and take as many swings as you want. No score, no pressure.</p>
    <div class="menu" style="opacity:1;animation:none;width:100%">
      ${Object.entries(RULES).map(([r, info]) => { const s = ruleStats(r); return `<button class="btn" data-rule="${r}">${info.short} <small>${info.missed} · ${avg(s.h, s.ab)}</small></button>`; }).join("")}
    </div>`;
  show("bp");
  $("#bBack").onclick = home;
  $("#bp").querySelectorAll("[data-rule]").forEach(b => b.onclick = () =>
    newGame("bp", { pool: QUESTIONS.filter(q => q.rule === b.dataset.rule), label: b.dataset.rule }));
}

// ---------- wiring ----------
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
  ctx();
  const go = b.dataset.go;
  if (go === "quick" || go === "full") newGame(go);
  else if (go === "bp") bpPicker();
  else if (go === "scout") scout();
  else if (go === "filmroom") {
    if (!filmIds().length) { banner("FILM ROOM EMPTY", "Go miss something first", 1800); return; }
    newGame("film");
  }
});
const mute = $("#mute");
const drawMute = () => mute.textContent = S.muted ? "🔇" : "🔊";
mute.onclick = () => { S.muted = !S.muted; save(); drawMute(); if (S.muted && "speechSynthesis" in window) speechSynthesis.cancel(); };
drawMute();
home();
})();
