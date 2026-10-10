// Rebuilds the OFFICIAL list in officials.js from the per-question JSON in research/.
// Keeps everything above "const OFFICIAL = [" (the comment and OFFICIAL_TESTS) as it is.
// Usage, from the repo root: node tools/build-officials.js
// To add a test: add its JSON to research/, a line to SOURCES, and its entry to OFFICIAL_TESTS.
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const SOURCES = [
  ["2176", "research/form-2176CPRE-english.json"],
  ["pt2", "research/practice-test-2-english.json"],
];
const rows = SOURCES.flatMap(([t, file]) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"))
    .filter(q => q.family !== "none")       // only questions in one of his families
    .map(q => ({ t, q: q.q, p: q.page, fam: q.family, code: q.code, skill: q.skill, core: q.core, ans: q.answer })));
const target = path.join(ROOT, "officials.js");
const src = fs.readFileSync(target, "utf8");
const head = src.slice(0, src.indexOf("const OFFICIAL = ["));
fs.writeFileSync(target, head + "const OFFICIAL = [\n" + rows.map(r => JSON.stringify(r, null, 0).replace(/^\{/, "{\n").replace(/\}$/, "\n}").replace(/,"/g, ',\n"').replace(/":/g, '": ')).join(",\n") + "\n];\n");
console.log(`officials.js: ${rows.length} official questions`);
