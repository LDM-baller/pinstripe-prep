// Mechanical drift check for Pinstripe Prep: documents and code against files.
// Usage, from the repo root: node tools/check.js   (exit 1 on any failure)
// It cannot tell whether a question is right or a document is true; see CLAUDE.md.
const fs = require("fs"), path = require("path"), cp = require("child_process");
const R = process.argv[2] || path.join(__dirname, "..");
const rd = f => fs.readFileSync(path.join(R, f), "utf8");
let fails = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || !detail ? "" : "  -> " + detail}`); if (!ok) fails++; };

// 1. Every script parses.
const js = fs.readdirSync(R).filter(f => f.endsWith(".js"));  // the app's own scripts, at the root
for (const f of js) { let ok = true; try { cp.execFileSync("node", ["--check", path.join(R, f)], { stdio: "pipe" }); } catch { ok = false; } check(`node --check ${f}`, ok); }

// 2. index.html: every script exists, all share one ?v=.
const html = rd("index.html");
const tags = [...html.matchAll(/<script src="([^"?]+)\?v=(\d+)"/g)];
check("index.html loads every .js file", js.every(f => tags.some(t => t[1] === f)), js.filter(f => !tags.some(t => t[1] === f)).join(", "));
check("index.html script tags share one ?v=", new Set(tags.map(t => t[2])).size === 1, tags.map(t => t[1] + "=" + t[2]).join(" "));

// 3. CLAUDE.md file table names real files.
const claude = rd("CLAUDE.md");
const named = [...claude.matchAll(/^\| `([^`]+)` \|/gm)].map(m => m[1]);
check("CLAUDE.md file table: every file exists", named.length > 0 && named.every(f => fs.existsSync(path.join(R, f))), named.filter(f => !fs.existsSync(path.join(R, f))).join(", "));
check("CLAUDE.md file table: every .js file is listed", js.every(f => named.includes(f)), js.filter(f => !named.includes(f)).join(", "));

// 4. Load the data the way the page does.
const ctx = {};
new Function("ctx", ["questions.js", "cousins.js", "officials.js"].map(rd).join("\n") + "\nctx.RULES = RULES; ctx.QUESTIONS = QUESTIONS; ctx.OFFICIAL = OFFICIAL; ctx.OFFICIAL_TESTS = OFFICIAL_TESTS;")(ctx);
const { RULES, QUESTIONS, OFFICIAL } = ctx;
const ids = QUESTIONS.map(q => q.id);
check("question ids unique", new Set(ids).size === ids.length, ids.filter((x, i) => ids.indexOf(x) !== i).join(", "));
const bad = QUESTIONS.filter(q => !RULES[q.rule] || q.choices.length !== 4 || new Set(q.choices).size !== 4 || q.answer === q.trap
  || !(q.answer >= 0 && q.answer < 4) || !(q.trap >= 0 && q.trap < 4) || !/\[\[.+?\]\]/.test(q.passage)
  || !["rematch", "cousin"].includes(q.kind) || !/^(USG|SST|PUN|KLA|ORG|TOD) \d{3}$/.test(q.code)
  || ["skill", "from", "stem", "why", "trapWhy"].some(k => !q[k]));
check("every question well-formed", !bad.length, bad.map(q => q.id).join(", "));
const noNC = QUESTIONS.filter(q => q.choices[0] !== "No Change");
check("questions without No Change are only purpose/deletion ones", noNC.every(q => q.code.startsWith("TOD")), noNC.filter(q => !q.code.startsWith("TOD")).map(q => q.id).join(", "));
check("every rule has questions", Object.keys(RULES).every(r => QUESTIONS.some(q => q.rule === r)), Object.keys(RULES).filter(r => !QUESTIONS.some(q => q.rule === r)).join(", "));
check("every rule has short, tip, missed, fam", Object.values(RULES).every(i => i.short && i.tip && i.missed && i.fam));
check("cousins live in cousins.js, rematches in questions.js",
  QUESTIONS.every(q => (q.kind === "cousin") === /^c-/.test(q.id)), QUESTIONS.filter(q => (q.kind === "cousin") !== /^c-/.test(q.id)).map(q => q.id).join(", "));

// 5. RULES.missed agrees with the rematches' from fields.
for (const [r, info] of Object.entries(RULES)) {
  const test = info.missed.split(" ")[0];
  const nums = [...info.missed.matchAll(/#(\d+)/g)].map(m => m[1]).sort();
  const froms = [...new Set(QUESTIONS.filter(q => q.rule === r && q.kind === "rematch").map(q => q.from.replace(/ \(.*\)$/, "")))];
  const fromNums = [...new Set(froms.map(f => f.match(/#(\d+)/)?.[1]))].sort();
  check(`RULES["${r}"].missed matches rematch from`, froms.every(f => f.startsWith(test)) && JSON.stringify(nums) === JSON.stringify(fromNums), `${info.missed} vs ${froms.join(", ")}`);
}

// 6. about.js MISSES covers every rule, codes and question numbers agree.
const about = rd("about.js");
const missesSrc = about.slice(about.indexOf("const MISSES"), about.indexOf("};", about.indexOf("const MISSES")) + 2);
const MISSES = new Function(missesSrc + "; return MISSES;")();
check("about.js MISSES has every rule", Object.keys(RULES).every(r => MISSES[r]), Object.keys(RULES).filter(r => !MISSES[r]).join(", "));
check("about.js MISSES has no stray rule", Object.keys(MISSES).every(r => RULES[r]), Object.keys(MISSES).filter(r => !RULES[r]).join(", "));
for (const [r, rows] of Object.entries(MISSES)) if (RULES[r]) {
  const a = rows.map(x => x[0]).sort().join(","), b = (() => { const t = RULES[r].missed.split(" ")[0]; return [...RULES[r].missed.matchAll(/#(\d+)/g)].map(m => `${t} #${m[1]}`).sort().join(","); })();
  check(`MISSES["${r}"] names the same misses as RULES`, a === b, `${a} vs ${b}`);
}

// 7. V1_IDS: frozen, 69 long, all still exist.
const v1 = JSON.parse(about.match(/const V1_IDS = (\[[^\]]+\])/)[1].replace(/\s+/g, ""));
check("V1_IDS still 69 ids and all exist", v1.length === 69 && v1.every(i => ids.includes(i)), `${v1.length}; missing ${v1.filter(i => !ids.includes(i)).join(", ")}`);

// 8. TEST_MISSES = rules missed more than once.
const game = rd("game.js");
const TM = new Function("return " + game.match(/const TEST_MISSES = (\{[^}]*\})/)[1])();
const multi = Object.entries(RULES).filter(([, i]) => (i.missed.match(/#/g) || []).length > 1).map(([r, i]) => [r, (i.missed.match(/#/g)).length]);
check("TEST_MISSES = every rule missed more than once, with its count",
  multi.length === Object.keys(TM).length && multi.every(([r, n]) => TM[r] === n), `${JSON.stringify(TM)} vs ${JSON.stringify(Object.fromEntries(multi))}`);

// 9. officials.js matches the research JSON it is generated from.
const json = [...JSON.parse(rd("research/form-2176CPRE-english.json")).map(q => ({ ...q, t: "2176" })),
              ...JSON.parse(rd("research/practice-test-2-english.json")).map(q => ({ ...q, t: "pt2" }))].filter(q => q.family !== "none");
const key = o => [o.t, o.q, o.p ?? o.page, o.fam ?? o.family, o.code, o.skill, o.core, o.ans ?? o.answer].join("|");
const a = OFFICIAL.map(key).sort(), b = json.map(key).sort();
check("officials.js matches research JSON", JSON.stringify(a) === JSON.stringify(b), `${a.length} vs ${b.length}; first diff ${a.find((x, i) => x !== b[i])}`);
check("every official family has a rule", [...new Set(OFFICIAL.map(o => o.fam))].every(f => Object.values(RULES).some(i => i.fam === f)));

// 10. SKILLS.md family table names every code the questions use.
const skills = rd("research/SKILLS.md");
const used = [...new Set(QUESTIONS.map(q => q.code))];
// A code counts as named when its prefix starts a run of numbers that includes it, e.g. "PUN 401, 501 (...)".
const named2 = c => { const [pre, num] = c.split(" "); return [...skills.matchAll(new RegExp(pre + " (\\d{3}(?:(?:,| and| or|/) ?\\d{3})*)", "g"))].some(m => m[1].match(/\d{3}/g).includes(num)); };
check("SKILLS.md mentions every code the questions use", used.every(named2), used.filter(c => !named2(c)).sort().join(", "));

// 11. README points at the live site.
const readme = rd("README.md");
check("README links the live site", readme.includes("https://ldm-baller.github.io/pinstripe-prep/"));

// 12. Public-repo privacy: no email, no family surname.
const all = fs.readdirSync(R, { recursive: true }).filter(f => !f.startsWith(".git") && /\.(js|md|html|json)$/.test(f)).map(f => rd(f)).join("\n");
check("no email addresses in repo files", !/[\w.+-]+@[\w-]+\.\w+/.test(all.replace(/noreply@anthropic\.com/g, "")));
// Family surnames, stored as hashes so the names never appear in this public repo.
const crypto = require("crypto"), SURNAMES = ["befb90274c7db469","c3e366d472090aa5"];
const hits = [...new Set(all.toLowerCase().match(/[a-z]+/g))].filter(w => SURNAMES.includes(crypto.createHash("sha256").update(w).digest("hex").slice(0, 16)));
check("no family surname in repo files", !hits.length, hits.join(", "));

// 13. Changed scripts need a new ?v= or phones keep the cached copies.
//     Compared with what is deployed (origin/main); skipped when git can't tell.
try {
  const git = args => cp.execFileSync("git", ["-C", R, ...args], { stdio: ["ignore", "pipe", "ignore"] }).toString();
  const live = git(["show", "origin/main:index.html"]).match(/\?v=(\d+)"/)[1];
  const changed = js.filter(f => { try { return git(["show", "origin/main:" + f]) !== rd(f); } catch { return true; } });
  const now = tags[0] && tags[0][2];
  check("?v= bumped when a script differs from origin/main", !changed.length || now !== live, `changed ${changed.join(", ")} but ?v= is still ${live}`);
} catch { console.log("skip ?v= vs origin/main (no git or no origin/main)"); }

console.log(`\n${fails ? fails + " FAILED" : "all passed"}`);
process.exit(fails ? 1 : 0);
