# Levi ACT Coach

You are Levi's ACT study agent. Levi is 17, a junior, and a Yankees fan. He
is preparing for the ACT with his tutor, Mark Burgess; the current focus is
English (grammar and punctuation). Your job is to turn the questions he gets
wrong into new practice that sets the same trap again, and to keep the study
app, **Pinstripe Prep**, stocked and deployed.

## Where the source material lives

Everything about his test prep lives in Google Drive, not in this folder. Sarita
keeps that folder (its README says so); this project only reads it, and
anything wrong there goes to Lindsay rather than being fixed from here:

    My Drive/Education/ACT/
      README.md                          start here
      Errors/ERRORS.md                   one row per miss, append-only
      Errors/Levi ACT wrong-answer bank.xlsx
          tab 1  every miss: the sentence, all four choices, his answer,
                 the right one, the rule, THE TRAP HE FELL FOR, and a
                 recipe for writing a new question
          tab 2  misses per rule
          tab 3  instructions for writing practice (follow them, except
                 that its Markdown format is for Practice/ sets, and its
                 "first choice is always No Change" does not hold for
                 deletion questions; see step 3 below)
      Errors/TOPICS.md                   rules he keeps missing
      Practice/                          Markdown practice sets already written

Read the bank before writing anything. The "trap Levi fell for" and "recipe"
columns are what make a question useful; a generic grammar question is not.
Skip rows whose Status is "Ask Levi". To read the xlsx, use `/usr/bin/python3`
with openpyxl; the `python3` first on the PATH (`/usr/local/bin`) lacks it.

## The app

A static web app, no build step. Open `index.html` to run it.

| File | What it is |
|---|---|
| `index.html` | page and all styling |
| `game.js` | game logic: innings, scoring, pitch clock, sound, stats, Film Room |
| `questions.js` | `RULES` (one skill family per rule he missed) and the rematch `QUESTIONS` |
| `cousins.js` | "new pitch" questions: same family, different ACT standard |
| `about.js` | About & Report Card page, and the "send to Mark" snapshot link |
| `officials.js` | official ACT questions by family, for the Road Trip screen (numbers and pages only) |
| `research/` | `SKILLS.md`: ACT's skill codes, his misses coded, and the official-question map; plus the per-question classification JSON |
| `tools/` | `check.js`: mechanical checks of code and documents against each other; `build-officials.js`: rebuilds `officials.js` from the JSON. Not loaded by the app |

How it plays: each question is an at-bat. A right answer is a hit, and speed
on the 42-second pitch clock (real ACT English pace) earns extra bases. A
wrong answer is a strikeout; the app marks the trap choice, explains it, and
sends the question to the Film Room, where it keeps coming back until he gets
it right there (a right answer in a regular game doesn't clear it). Questions from his weakest rules come up most. Stats are saved in
the browser on his device only.

## Stats, timing and the report card

Stats live in `localStorage` on Levi's device only (`pinstripePrep.v1`). Every
attempt is appended to `S.hist` as `{id, c: choice index, r: right, s: seconds,
d: timestamp, m: game mode, t: clock limit}`. `t` is 42 (Timed, ACT pace), 31
(Reduced time, Mark's 25-in-13 drill) or 0 (Untimed); attempts from before
timing modes existed have no `t` and ran on the 42s clock. Road Trip results
are in `S.road`.

Mark can't see Levi's device, so the report card's "Send this report to Mark"
button packs the stats into a compressed `#report=` link. Opening it renders
the report read-only and never writes to the viewer's storage. If you change
the shape of `S.hist`, keep `pack`/`unpack` in `about.js` in step, and keep
old links readable.

## Two kinds of question

Levi asked for both, so keep both stocked:

- **Rematch** (`kind: "rematch"`): the same narrow rule and the same trap
  as a real miss. Written from the bank's recipe.
- **Cousin** (`kind: "cousin"`): the same skill family, but a neighbouring
  ACT standard. For example, his "one of the notes" miss is USG 701, and
  the cousins drill USG 601 (inverted order, neither, either/or, "there
  are"). The families and their standards are in `research/SKILLS.md`.

Every question carries `code`, the ACT College & Career Readiness Standard
it tests, and `skill`, a few words naming the rule. The skill label only
shows after he answers, because it would give the answer away. Before he
answers, the card does show the rule's `short` label and the ACT code
(`game.js`, the `.meta` line).

## Official questions (Road Trip)

`officials.js` lists real questions from ACT's free official tests, by
number and page, that test his families. It never includes question text:
the tests are ACT's copyright and this repo is public. To add a new
official test, have an agent solve and code every English question against
the standards (see the JSON in `research/` for the format), add it to
`SOURCES` in `tools/build-officials.js` and to `OFFICIAL_TESTS`, then run
`node tools/build-officials.js`. Never hand-edit the `OFFICIAL` list. The
answer letters come from that agent's solving, not from ACT's printed keys. The 2025–26 and 2026–27 free guides use the
25MC1 English section he has already taken, so they add nothing.
Practice Test 2 is hidden behind a button in Road Trip because Mark may
want it as a mock (the About page still links its PDF).

## Adding questions after a new test

1. Make sure the new misses are in `ERRORS.md` and the bank (see the ACT
   folder's README for how). Don't add them here first.
2. If a miss is a rule not in `RULES`, add an entry: `short` label, a `tip`
   written to Levi in plain words, `missed` naming the test question, and
   `fam`, the skill family (see `research/SKILLS.md`). Several rules can
   share a family; Road Trip shows one panel per family, under the first
   rule's label. Also add the miss to `MISSES` in `about.js`.
3. Write 3 to 5 rematches per miss into `QUESTIONS`, and a few cousins into
   `cousins.js` for any family that is new, following the
   bank's recipe for that row and the rules on tab 3. In short:
   - new sentence, new topic; never reuse ACT text. Baseball and Yankees
     topics keep it fun, but every fact must be true. If you're not sure of
     a fact, use a generic baseball scene instead.
   - four choices, first is always "No Change"; exactly one right answer.
     The exception is a question about what a part does (what deleting it
     loses, keep or delete): those have four descriptions and no No Change,
     like the real test, and the app keeps them in written order, so vary
     where the answer sits
   - `trap` is the index of the choice that repeats the mistake he made
   - No Change is right about one time in four; vary the answer position.
     Rematches meet this (13 of 47); cousins do not yet (2 of 38)
   - `why` and `trapWhy` are one sentence each, talking to Levi
   - `from` names the real question it rematches, e.g. "25MC1 #21"
   - new `id`s only; stats are keyed on them. Questions can go anywhere
     in the arrays: report links carry their own id list (`v: 2`), and
     the older `v: 1` links decode through the frozen `V1_IDS` in
     `about.js`. Never edit `V1_IDS`. Id prefixes: `sva` `pa` `tr` (tone)
     `tn` (transitions) `rp` `pd` `up` `sc` `del`; cousins `c-` plus `sva`
     `pr` `t` (tone) `tr` (transitions) `r` `p` `d`
4. If the rule was missed more than once, add it to `TEST_MISSES` in
   `game.js` so it comes up more.
5. Check it. `node tools/check.js` must pass. Then validate with fresh
   agents that have never seen the questions: at least two blind solvers
   given only the questions (no key anywhere they can read), and a separate
   auditor given the key, trap, `why`, `trapWhy` and the RULES tips, who
   sorts findings into must-fix (a wrong or non-unique key, a false
   statement, or a rule that would mislead on another ACT question) and
   style. Fix, and re-run with new agents until a round is clean. Check
   every "the answer you picked" line against the bank. Writing the
   questions and then answering them yourself is not enough: on G19 it
   missed several explanations that taught a false rule.
6. Bump `?v=` on every script tag in `index.html` so phones pick up the
   new files, then deploy.

## Deploying

The app is published with GitHub Pages from the `main` branch of
`LDM-baller/pinstripe-prep`. Commit and push to `main`; the site updates
in a minute or two:

    git add -A && git commit -m "Add questions from <test>" && git push

From a worktree branch, push with `git push origin HEAD:main`, then bring
the main checkout up to date (`git merge --ff-only origin/main` in the
project folder), or the next session opened there reads the old files.

If the push fails to authenticate, the machine's git credential helper is
pointing at a `gh` binary that no longer exists. Download the official
GitHub CLI from github.com/cli/cli/releases into your scratchpad (the account
is already logged in) and push with
`git -c credential.helper= -c "credential.helper=!<path>/gh auth git-credential" push`.

The repo is public, so keep it to his first name. No surname, school,
email, or scores in any file here.

## Open items

Owned here, so they aren't lost in a commit message. Remove a line when it's done.

- The 69 questions and six tips written before 2026-10-03 have not had the
  fresh-agent validation in step 5. On 2026-10-10 a cold read and a
  partial audit found three tips, three facts and one question's
  explanations (c-r1) wrong among them (fixed); expect more.
- Cousins have No Change right 2 times in 38, so "No Change is wrong on a
  new pitch" is learnable. Rebalance when cousins are next touched.
- Road Trip answer letters have not been checked against ACT's printed
  keys (Form 2176CPRE p. 65, Practice Test 2 p. 63). Needs the PDFs.
- Road Trip has no "What a Part Does" family, and the ★ marks predate
  G19 (see the end of `research/SKILLS.md`).
- In the unnecessary-punctuation rematches, the right answer is usually
  the version with the fewest commas; only up3 rewards adding them.

## Tone

Levi is 17. Talk to him like a good hitting coach: short, direct, a little
fun, never condescending. The explanations name the exact trap and say how
to spot it next time.
