// About & Report Card: where the questions come from, how they map to ACT's
// skill codes, and how Levi is doing, with drill-down to every question.
// Stats live only on Levi's device, so "Send to Mark" packs them into a link;
// opening that link shows the same page as a read-only snapshot.
const PPAbout = (() => {
"use strict";

const $ = s => document.querySelector(s);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const BANDS = { 2: "13–15", 3: "16–19", 4: "20–23", 5: "24–27", 6: "28–32", 7: "33–36" };
const band = code => BANDS[(code.match(/\d/) || [])[0]] || "";
const CATEGORY = { USG: "Conventions (usage)", SST: "Conventions (sentence structure)", PUN: "Conventions (punctuation)",
  KLA: "Knowledge of Language", ORG: "Production of Writing", TOD: "Production of Writing" };

// The real misses behind each family, as he answered them on 25MC1.
const MISSES = {
  "Subject-verb agreement": [["#9", "\"Partnering with … have enabled\" — chose have, needed has", "USG 402"],
                             ["#21", "\"the last one of the notes fade\" — chose fade, needed fades", "USG 701"]],
  "Pronoun and verb agreement": [["#5", "made \"trees die\" plural but left \"its\" singular", "USG 602"]],
  "Tone and register": [["#6", "picked the casual \"churn out\" in a formal essay", "KLA 503"]],
  "Transitions": [["#30", "picked \"Granted\" (concession) where \"Conversely\" (contrast) fit", "ORG 501"]],
  "Relative pronouns": [["#31", "picked the doubled \"that which\" instead of \"that\"", "SST 401"]],
  "Paired dashes around an interruption": [["#33", "opened an interruption with a comma and never closed it", "PUN 503"]],
};

const avg = (h, ab) => ab ? (h / ab).toFixed(3).replace(/^0/, "") : "—";
const pct = (h, ab) => ab ? h / ab : 0;
const fmtDate = d => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const fmtWhen = d => new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const passageHTML = q => esc(q.passage).replace(/\[\[(.+?)\]\]/, "<u>$1</u>");
const MODE = { quick: "Play Ball", full: "Full Nine", bp: "Batting Practice", film: "Film Room" };

function bar(h, ab) {
  const p = pct(h, ab), cls = !ab ? "" : p >= 0.8 ? "" : p >= 0.5 ? "mid" : "low";
  return `<div class="bar"><i class="${cls}" style="width:${ab ? Math.max(4, p * 100) : 0}%"></i></div>`;
}

// ---------- numbers ----------
function tally(S, filter) {
  let ab = 0, h = 0, seenQs = 0;
  for (const q of QUESTIONS) if (filter(q)) { const st = S.q[q.id]; if (st && st.seen) { ab += st.seen; h += st.right; seenQs++; } }
  return { ab, h, seenQs, total: QUESTIONS.filter(filter).length };
}
function missesByTrap(S, filter) {
  const qById = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  let miss = 0, trap = 0;
  for (const a of S.hist || []) { const q = qById[a.id]; if (!q || !filter(q) || a.r) continue; miss++; if (a.c === q.trap) trap++; }
  return { miss, trap };
}

// ---------- timing ----------
// t on each attempt = the clock limit in seconds (42 timed, 31 reduced, 0 untimed).
// Attempts from before timing modes existed have no t; they ran on the 42s clock.
const TMODES = [[42, "Timed (ACT pace, 42s)"], [31, "Reduced time (31s)"], [0, "Untimed"]];
const limOf = a => a.t ?? 42;
function timing(list) {
  const n = list.length; if (!n) return null;
  const timed = list.filter(a => limOf(a));
  const onTime = timed.filter(a => a.s <= limOf(a)).length;
  return { n, avgS: Math.round(list.reduce((x, a) => x + a.s, 0) / n), timed: timed.length, onTime,
    acc: list.filter(a => a.r).length };
}
const onTimeTxt = t => t && t.timed ? `${Math.round(100 * t.onTime / t.timed)}% on time` : "no timed attempts";
function timingHTML(S) {
  const hist = S.hist || [];
  if (!hist.length) return `<p class="fine">No attempts yet.</p>`;
  const qById = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  const rows = TMODES.map(([lim, name]) => {
    const t = timing(hist.filter(a => limOf(a) === lim)); if (!t) return "";
    return `<div class="row"><span>${name} <span style="color:var(--dim)">${t.n} questions</span></span><span class="ba sm">${avg(t.acc, t.n)}</span>
      <div class="note">Average ${t.avgS}s per question${lim ? ` · beat the clock ${t.onTime} of ${t.timed} (${Math.round(100 * t.onTime / t.timed)}%)` : ""} · accuracy ${avg(t.acc, t.n)}</div></div>`;
  }).join("");
  const fams = Object.entries(RULES).map(([r, info]) => {
    const t = timing(hist.filter(a => qById[a.id]?.rule === r)); if (!t) return "";
    const slow = t.avgS > 31;
    return `<div class="row"><span>${info.short}</span><span class="ba sm" style="${slow ? "color:var(--gold)" : ""}">${t.avgS}s</span>
      <div class="note">${onTimeTxt(t)} · ${t.n} attempts</div></div>`;
  }).join("");
  const late = hist.filter(a => limOf(a) && a.s > limOf(a));
  return `<div class="panel"><h3>By timing mode</h3>${rows}
    <p class="fine">Accurate but slow means he knows the rule and needs reps. Fast and wrong on the trap means he's reacting to what sounds right.</p></div>
    <div class="panel"><h3>Average time by skill</h3>${fams}
    <p class="fine">Gold = slower than the 31s reduced-time target.</p></div>
    ${late.length ? `<div class="panel"><h3>Over the clock (${late.length})</h3>${late.slice(-15).reverse().map(a => atBatHTML(a)).join("")}</div>` : ""}`;
}

// ---------- the page ----------
function render(S, snap) {
  const all = tally(S, () => true), rem = tally(S, q => q.kind === "rematch"), cou = tally(S, q => q.kind === "cousin");
  const hist = S.hist || [];
  const film = QUESTIONS.filter(q => S.q[q.id]?.film).length;
  const road = S.road || {};
  const roadDone = OFFICIAL.filter(o => road[o.t + o.q]), roadHits = roadDone.filter(o => road[o.t + o.q] === "hit").length;
  const tAll = timing(hist);
  const trapAll = missesByTrap(S, () => true);

  const fams = Object.entries(RULES).map(([r, info]) => ({ r, info, t: tally(S, q => q.rule === r) }));
  const tried = fams.filter(f => f.t.ab >= 3).sort((a, b) => pct(a.t.h, a.t.ab) - pct(b.t.h, b.t.ab));
  const headline = !all.ab
    ? "Levi hasn't played yet. Numbers show up here after his first at-bat."
    : `Levi has taken ${all.ab} at-bats on ${all.seenQs} different questions and is hitting <b>${avg(all.h, all.ab)}</b>.` +
      (tried.length >= 2 ? ` Strongest: <b>${tried[tried.length - 1].info.short}</b> (${avg(tried[tried.length - 1].t.h, tried[tried.length - 1].t.ab)}). Needs the most work: <b>${tried[0].info.short}</b> (${avg(tried[0].t.h, tried[0].t.ab)}).` : "") +
      (rem.ab && cou.ab ? ` On rematches of his real misses he's at ${avg(rem.h, rem.ab)}; on new angles of the same skills, ${avg(cou.h, cou.ab)}.` : "");

  $("#about").innerHTML = `
    ${snap ? `<div class="snap">📨 Levi's report card, sent ${fmtWhen(snap.at)}. This is a read-only snapshot.</div>` : ""}
    <button class="back" id="aBack">◂ ${snap ? "Open the game" : "Clubhouse"}</button>
    <h2 class="bebas">Report Card</h2>
    <p class="lede">${headline}</p>

    <div class="tiles">
      <div class="tile"><b>${avg(all.h, all.ab)}</b><span>average<br>${all.h}-for-${all.ab}</span></div>
      <div class="tile"><b>${all.seenQs}<small>/${all.total}</small></b><span>questions<br>seen</span></div>
      <div class="tile"><b>${trapAll.miss ? Math.round(100 * trapAll.trap / trapAll.miss) + "%" : "—"}</b><span>of misses were<br>the trap answer</span></div>
      <div class="tile"><b>${tAll ? tAll.avgS : "—"}<small>${tAll ? "s" : ""}</small></b><span>per question<br>${tAll && tAll.timed ? Math.round(100 * tAll.onTime / tAll.timed) + "% beat the clock" : "ACT pace: 42s"}</span></div>
      <div class="tile"><b>${film}</b><span>in the<br>Film Room</span></div>
      <div class="tile"><b>${roadHits}-${roadDone.length}</b><span>official ACT<br>questions</span></div>
    </div>
    ${snap ? "" : `<button class="btn primary" id="share" style="width:100%;margin:6px 0 4px">📨 Send this report to Mark <small>makes a link</small></button><p class="fine" id="shareMsg"></p>`}

    <h3 class="sec">How he's doing, skill by skill</h3>
    <p class="fine">Tap a skill to see ACT's codes for it, then tap a code to see every question and what he picked.</p>
    ${fams.map(f => famHTML(S, f)).join("")}

    <h3 class="sec">Timing</h3>
    ${timingHTML(S)}

    <h3 class="sec">Recent at-bats</h3>
    ${hist.length ? `<div class="panel">${hist.slice(-25).reverse().map(a => atBatHTML(a)).join("")}</div>`
      : `<p class="fine">None yet.</p>`}

    <h3 class="sec">Official ACT questions (Road Trip)</h3>
    ${roadHTML(road)}

    <h3 class="sec">Where the questions come from</h3>
    <div class="panel prose">
      <p>Everything starts with the <b>8 English questions Levi missed on 25MC1</b>, the practice ACT in ACT's free official guide for 2025–26. Seven were confirmed against ACT's answer key; one (#15) is unresolved and not used.</p>
      <details><summary><b>Rematches</b> · ${QUESTIONS.filter(q => q.kind === "rematch").length} questions</summary>
        <p>Each one is a new sentence on the <i>same narrow rule</i> as a real miss, and one wrong answer is always the same trap he fell for. Written from the notes in his wrong-answer bank: what the question tests, the trap, and how to build a new one. About one in four has "No Change" as the answer, like the real test.</p></details>
      <details><summary><b>New pitches</b> · ${QUESTIONS.filter(q => q.kind === "cousin").length} questions</summary>
        <p>Same skill family, different rule. ACT publishes about 90 numbered English skills (its College & Career Readiness Standards). For each miss, these questions drill the <i>neighbouring</i> standards. For example, his "one of the notes" miss is USG 701, so the new pitches cover USG 601: inverted order, "neither," "either/or," "there are." They were added because rematches alone felt too familiar.</p></details>
      <details><summary><b>Road Trip</b> · ${OFFICIAL.length} official ACT questions</summary>
        <p>Real ACT questions from the two free official tests Levi hasn't seen, both posted on act.org: <a href="${OFFICIAL_TESTS[0].url}" target="_blank" rel="noopener">Form 2176CPRE</a> (2024–25 guide) and <a href="${OFFICIAL_TESTS[1].url}" target="_blank" rel="noopener">Practice Test 2</a>. Every English question in both was solved and coded against ACT's standards, and the ones in his skill families are listed by number and page. The app links to ACT's PDFs rather than copying the questions, which are ACT's copyright. The free 2025–26 and 2026–27 guides both use 25MC1's English section, so they add nothing new. Practice Test 2 is hidden by default in case Mark wants it as a mock.</p></details>
      <details><summary>How the sentences are written</summary>
        <p>All app questions are original. Topics are baseball and the Yankees to keep it fun; the facts were checked, and anything uncertain uses a generic ballpark scene. Every question was answered cold to make sure exactly one choice is defensible. Choices after "No Change" are shuffled each time.</p></details>
    </div>

    <h3 class="sec">The skill map</h3>
    <div class="panel prose">
      <p>ACT scores English in three categories: <b>Production of Writing</b> (organization, transitions; 38–43%), <b>Knowledge of Language</b> (tone, concision, word choice; 18–23%) and <b>Conventions of Standard English</b> (grammar, usage, punctuation; 38–43%). Under those sit numbered standards; the first digit is the score band where students typically master it (4xx = 20–23, 5xx = 24–27, 6xx = 28–32, 7xx = 33–36).</p>
      ${Object.entries(RULES).map(([r, info]) => {
        const codes = [...new Set(QUESTIONS.filter(q => q.rule === r).map(q => q.code))].sort();
        return `<details><summary><b>${info.short}</b></summary>
          ${(MISSES[r] || []).map(([n, what, code]) => `<p>Missed 25MC1 ${n}: ${esc(what)}. ACT standard <b>${code}</b> (${CATEGORY[code.slice(0, 3)]}, ${band(code)} band).</p>`).join("")}
          <p>Standards drilled in this family: ${codes.map(c => `<span class="code">${c}</span>`).join(" ")}</p></details>`;
      }).join("")}
      <p class="fine">Source: <a href="https://www.act.org/content/dam/act/unsecured/documents/CCRS-EnglishStandards.pdf" target="_blank" rel="noopener">ACT College & Career Readiness Standards: English</a>.</p>
    </div>`;

  $("#aBack").onclick = () => { if (snap) history.replaceState(null, "", location.pathname); PP.home(); };
  if ($("#share")) $("#share").onclick = () => share(S);
}

function famHTML(S, { r, info, t }) {
  const fq = QUESTIONS.filter(q => q.rule === r);
  const rem = tally(S, q => q.rule === r && q.kind === "rematch"), cou = tally(S, q => q.rule === r && q.kind === "cousin");
  const tr = missesByTrap(S, q => q.rule === r);
  const codes = [...new Set(fq.map(q => q.code))].sort();
  return `<details class="fam"><summary>
      <div class="fam-top"><b>${info.short}</b><span class="ba">${avg(t.h, t.ab)}</span></div>
      ${bar(t.h, t.ab)}
      <div class="fine">${t.h}-for-${t.ab} · ${t.seenQs} of ${t.total} questions seen · real miss: 25MC1 ${info.missed.replace("25MC1 ", "")}</div>
    </summary>
    <div class="fam-body">
      <div class="split"><span>Rematches <b>${avg(rem.h, rem.ab)}</b> <i>${rem.h}-for-${rem.ab}</i></span><span>New pitches <b>${avg(cou.h, cou.ab)}</b> <i>${cou.h}-for-${cou.ab}</i></span></div>
      ${(() => { const t = timing((S.hist || []).filter(a => QUESTIONS.find(q => q.id === a.id)?.rule === r)); return t ? `<p class="fine">⏱ Averages ${t.avgS}s a question here · ${onTimeTxt(t)}</p>` : ""; })()}
      ${tr.miss ? `<p class="fine">${tr.trap} of his ${tr.miss} misses here were the trap answer${tr.trap / tr.miss >= 0.6 ? " — he's still reaching for the tempting wrong choice, which points to the rule, not carelessness." : "."}</p>` : ""}
      <p class="fine" style="color:var(--gold)">📋 ${esc(info.tip)}</p>
      ${codes.map(code => {
        const cq = fq.filter(q => q.code === code), ct = tally(S, q => q.rule === r && q.code === code);
        const labels = [...new Set(cq.map(q => q.skill))];
        return `<details class="code-row"><summary>
            <div class="fam-top"><span><span class="code">${code}</span> ${esc(labels.slice(0, 2).join("; "))}${labels.length > 2 ? "…" : ""}</span><span class="ba sm">${avg(ct.h, ct.ab)}</span></div>
            <div class="fine">${ct.h}-for-${ct.ab} · ${ct.seenQs}/${ct.total} seen · ${band(code)} band</div>
          </summary>${cq.map(q => qHTML(S, q)).join("")}</details>`;
      }).join("")}
    </div></details>`;
}

function qHTML(S, q) {
  const tries = (S.hist || []).filter(a => a.id === q.id), st = S.q[q.id];
  const dots = tries.length ? tries.map(a => `<i class="${a.r ? "y" : "n"}"></i>`).join("")
    : st?.seen ? `<span class="fine">${st.right}/${st.seen}</span>` : `<span class="fine">not seen yet</span>`;
  const picks = [0, 0, 0, 0]; tries.forEach(a => picks[a.c]++);
  const qt = timing(tries);
  return `<details class="q"><summary><span class="dots">${dots}</span><span class="qlabel">${q.kind === "cousin" ? "New" : "Rematch"} · ${esc(q.skill)}</span>${qt ? `<span class="fine" style="margin-left:auto;white-space:nowrap">${qt.avgS}s</span>` : ""}</summary>
    <div class="qbody">
      <p class="qp">${passageHTML(q)}</p>
      ${q.choices.map((c, k) => `<div class="qc ${k === q.answer ? "ok" : ""}">
          <span>${k === q.answer ? "✓" : k === q.trap ? "⚠" : "·"} ${esc(c)}</span>
          <span class="fine">${picks[k] ? `picked ${picks[k]}×` : ""}</span></div>`).join("")}
      <p class="fine"><b>Why:</b> ${esc(q.why)}</p>
      <p class="fine"><b>The trap (⚠):</b> ${esc(q.trapWhy)}</p>
      <p class="fine">${q.kind === "cousin" ? `New pitch on ACT ${q.code}` : `Rematch of ${q.from}`}.
        ${tries.length ? "Attempts: " + tries.map(a => `${fmtDate(a.d)} ${a.r ? "✓" : "✗"} ${a.s}s${limOf(a) ? (a.s > limOf(a) ? ` <b>(over ${limOf(a)}s)</b>` : ` of ${limOf(a)}`) : " untimed"}`).join(" · ") : ""}</p>
    </div></details>`;
}

function atBatHTML(a) {
  const q = QUESTIONS.find(x => x.id === a.id); if (!q) return "";
  return `<details class="q"><summary><span class="dots"><i class="${a.r ? "y" : "n"}"></i></span>
      <span class="qlabel">${RULES[q.rule].short} · ${esc(q.skill)}</span><span class="fine" style="margin-left:auto;white-space:nowrap">${fmtDate(a.d)}</span></summary>
    <div class="qbody">
      <p class="qp">${passageHTML(q)}</p>
      <p class="fine">He picked <b>${esc(q.choices[a.c])}</b>${a.r ? " ✓" : ` ✗ — right answer: <b>${esc(q.choices[q.answer])}</b>${a.c === q.trap ? " (he took the trap)" : ""}`}. ${a.s}s ${limOf(a) ? (a.s > limOf(a) ? `(<b>over</b> the ${limOf(a)}s clock)` : `of ${limOf(a)}s`) : "untimed"} · ${MODE[a.m] || ""} · ${fmtWhen(a.d)}</p>
    </div></details>`;
}

function roadHTML(road) {
  const done = OFFICIAL.filter(o => road[o.t + o.q]);
  if (!done.length) return `<p class="fine">None logged yet. These are real ACT questions he does on paper from ACT's PDFs, then checks in the app.</p>`;
  const name = t => OFFICIAL_TESTS.find(x => x.key === t).name.replace("ACT ", "");
  return `<div class="panel">${Object.entries(RULES).map(([r, info]) => {
    const list = done.filter(o => o.fam === info.fam); if (!list.length) return "";
    const h = list.filter(o => road[o.t + o.q] === "hit").length;
    return `<details class="q"><summary><span class="qlabel"><b>${info.short}</b> ${h}-for-${list.length}</span><span class="ba sm" style="margin-left:auto">${avg(h, list.length)}</span></summary>
      <div class="qbody">${list.map(o => `<div class="qc"><span>${road[o.t + o.q] === "hit" ? "✓" : "✗"} ${o.core ? "★ " : ""}${name(o.t)} #${o.q} · p. ${o.p}</span><span class="fine">${o.code} · ${esc(o.skill)}</span></div>`).join("")}</div></details>`;
  }).join("")}</div>`;
}

// ---------- sharing ----------
// Compact form: history rows become arrays keyed by question index.
function pack(S) {
  const ids = QUESTIONS.map(q => q.id), t0 = (S.hist || [])[0]?.d || Date.now();
  return { v: 1, at: Date.now(), w: S.w, l: S.l, t0, q: S.q, road: S.road || {},
    h: (S.hist || []).map(a => [ids.indexOf(a.id), a.c, a.r, a.s, Math.round((a.d - t0) / 60000), a.m, a.t ?? null]) };
}
function unpack(p) {
  const ids = QUESTIONS.map(q => q.id);
  return { S: { q: p.q || {}, w: p.w, l: p.l, road: p.road || {},
    hist: (p.h || []).filter(a => ids[a[0]]).map(a => ({ id: ids[a[0]], c: a[1], r: a[2], s: a[3], d: p.t0 + a[4] * 60000, m: a[5], ...(a[6] != null ? { t: a[6] } : {}) })) }, at: p.at };
}
const b64 = u8 => { let t = ""; for (const b of u8) t += String.fromCharCode(b); return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const unb64 = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
async function squeeze(str) {
  const bytes = new TextEncoder().encode(str);
  if (!window.CompressionStream) return "p" + b64(bytes);
  const out = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer();
  return "z" + b64(new Uint8Array(out));
}
async function unsqueeze(s) {
  const bytes = unb64(s.slice(1));
  if (s[0] === "p") return new TextDecoder().decode(bytes);
  return await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text();
}
async function share(S) {
  const msg = $("#shareMsg");
  const url = location.origin + location.pathname + "#report=" + await squeeze(JSON.stringify(pack(S)));
  try {
    if (navigator.share) { await navigator.share({ title: "Levi's Pinstripe Prep report", url }); msg.textContent = "Sent."; return; }
  } catch (e) { if (e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(url); msg.textContent = "Link copied. Paste it into a text or email to Mark."; }
  catch { msg.innerHTML = `Copy this link and send it to Mark:<br><textarea readonly style="width:100%;height:80px">${url}</textarea>`; }
}

return {
  open(S) { render(S, null); PP.show("about"); },
  // If the page was opened from a report link, show that snapshot instead of the game.
  fromLink() {
    const m = location.hash.match(/^#report=(.+)$/); if (!m) return false;
    unsqueeze(m[1]).then(t => { const { S, at } = unpack(JSON.parse(t)); render(S, { at }); PP.show("about"); })
      .catch(() => { history.replaceState(null, "", location.pathname); PP.home(); });
    return true;
  },
};
})();
