# How ACT classifies English questions, and where Levi's misses fit

Researched 2026-09-26. Every source below is published by ACT itself.

## Sources

| Source | What it is |
|---|---|
| [ACT College & Career Readiness Standards: English](https://www.act.org/content/dam/act/unsecured/documents/CCRS-EnglishStandards.pdf) | ACT's own skill codes. Every English question tests one of these. |
| [Description of the English Test](https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/description-of-english-test.html) | The three reporting categories and their weights |
| [Preparing for the ACT 2025–26](https://www.act.org/content/dam/act/unsecured/documents/Preparing-for-the-ACT-e.pdf) | The free official test. **Its English section is 25MC1**, the test Levi already took. The 2026–27 edition has the same English section. |
| [ACT Practice Test 2](https://www.act.org/content/dam/act/secured/documents/ACT-Test-Prep-ACT-Practice-Test-2-Form.pdf) | A second full official test in the current 50-question format. **Levi hasn't seen it.** |
| [Preparing for the ACT 2024–25 (Form 2176CPRE)](https://www.act.org/content/dam/act/unsecured/documents/Preparing-for-the-ACT-24-25.pdf) | The previous official test: 75 English questions in the older format, same skills. **Levi hasn't seen it.** |

Older official forms (74FPRE, 72CPRE and others) circulate on tutoring
sites, but act.org no longer hosts them, so they are left out here.

## The classification

ACT sorts English questions into three **reporting categories**, which are
printed on every scoring key:

- **POW, Production of Writing** (38–43%): topic development (TOD) and
  organization, unity and cohesion (ORG). Transitions live here.
- **KLA, Knowledge of Language** (18–23%): style, tone, concision and
  precise word choice.
- **CSE, Conventions of Standard English** (38–43%): sentence structure
  (SST), usage (USG) and punctuation (PUN).

Under those sit about 90 numbered standards. The hundreds digit is the
score band: 3xx is 16–19, 4xx is 20–23, 5xx is 24–27, 6xx is 28–32, and
7xx is 33–36.

## Levi's misses, coded

| 25MC1 | Miss | ACT standard | Band |
|---|---|---|---|
| #9 | "Partnering … have" | USG 402: subject-verb agreement with text between subject and verb | 20–23 |
| #21 | "the last one of the notes fade" | USG 701: agreement when a phrase between them suggests a different number | 33–36 |
| #5 | "trees die once its" | USG 602 / USG 303: its, and pronoun-antecedent agreement | 28–32 |
| #6 | "churn out" | KLA 503: expressions that deviate in subtle ways from the style and tone | 24–27 |
| #30 | "Granted" for "Conversely" | ORG 501: transitions for subtle logical relationships | 24–27 |
| #31 | "that which" | SST 401: missing or incorrect relative pronouns | 20–23 |
| #33 | "can, and should" | PUN 503: punctuation to set off complex parenthetical elements | 24–27 |

Most of his misses sit in the 24–32 bands, which is the right place to
push for a score in the high 20s or above. #21 is a 33–36 skill; missing
it is normal at this stage.

## The same skill, different angle

Each family in the app covers these related standards:

| Family | Standards drilled |
|---|---|
| Subject-verb | USG 302, 402, 601 (inverted order, indefinite pronouns, either/or, "there is"), 701 |
| Pronouns | USG 303, 502 (across sentences), 503 (vague pronoun), 602 (its/it's, who/whom, reflexive); SST 502 (person shift) |
| Tone & word choice | KLA 401, 502, 602 (redundancy and wordiness); KLA 503 (tone); USG 603 (confused words) |
| Transitions | ORG 401, 501, 601; KLA 504, 603 (conjunctions within a sentence) |
| Relative clauses | SST 401; SST 301 (fragments); PUN 602, 701 (which vs. that, commas); USG 602 (whose, who/whom) |
| Punctuation | PUN 401, 501 (unnecessary commas); PUN 502, 702 (colons and semicolons); PUN 503, 602, 701 (interruptions, essential vs. not); SST 301 (comma splices) |

## Official questions by family

Every English question in the two unseen official tests was solved and
coded against the standards. The full per-question data is in the two
JSON files in this folder; the app's Road Trip screen reads it from
`officials.js`. ★ marks the same narrow rule as one of his actual misses.

| Family | Questions (test, number, PDF page, standard) |
|---|---|
| Subject-verb agreement | ★2176CPRE #55 (p.23, USG 402), ★PT2 #32 (p.11, USG 402), ★PT2 #47 (p.14, USG 402), 2176CPRE #41 (p.20, SST 501), 2176CPRE #71 (p.25, USG 302), PT2 #6 (p.5, USG 601) |
| Pronouns | ★2176CPRE #24 (p.18, USG 502), 2176CPRE #9 (p.15, USG 502), 2176CPRE #27 (p.18, USG 503), 2176CPRE #32 (p.19, USG 503), 2176CPRE #40 (p.20, USG 305), 2176CPRE #58 (p.23, USG 503), PT2 #22 (p.9, USG 602), PT2 #28 (p.10, USG 602), PT2 #29 (p.10, USG 503) |
| Tone & word choice | ★2176CPRE #54 (p.23, KLA 503), ★PT2 #23 (p.9, KLA 503), ★PT2 #48 (p.15, KLA 503), 2176CPRE #3 (p.15, KLA 502), 2176CPRE #5 (p.15, KLA 505), 2176CPRE #7 (p.15, KLA 505), 2176CPRE #17 (p.17, KLA 502), 2176CPRE #20 (p.17, KLA 503), 2176CPRE #36 (p.20, KLA 505), 2176CPRE #59 (p.23, KLA 602), 2176CPRE #62 (p.24, KLA 602), 2176CPRE #64 (p.24, KLA 604), 2176CPRE #75 (p.25, KLA 602), PT2 #1 (p.4, KLA 401), PT2 #4 (p.5, KLA 401), PT2 #14 (p.7, KLA 505), PT2 #19 (p.8, KLA 401), PT2 #24 (p.9, KLA 505), PT2 #30 (p.11, KLA 401), PT2 #33 (p.11, KLA 401), PT2 #42 (p.13, KLA 505) |
| Transitions | 2176CPRE #2 (p.14, ORG 501), 2176CPRE #8 (p.15, ORG 501), 2176CPRE #26 (p.18, ORG 501), 2176CPRE #69 (p.25, ORG 501), 2176CPRE #72 (p.25, ORG 501), 2176CPRE #73 (p.25, ORG 501), PT2 #26 (p.10, ORG 601), PT2 #40 (p.13, ORG 601) |
| Relative clauses | 2176CPRE #6 (p.15, SST 501), 2176CPRE #22 (p.17, SST 501), 2176CPRE #57 (p.23, USG 602) |
| Punctuation & clause boundaries | ★2176CPRE #47 (p.22, PUN 503), ★2176CPRE #49 (p.22, PUN 602), ★2176CPRE #68 (p.24, PUN 503), ★2176CPRE #74 (p.25, PUN 503), 2176CPRE #1 (p.14, PUN 701), 2176CPRE #16 (p.17, SST 501), 2176CPRE #23 (p.18, PUN 502), 2176CPRE #30 (p.19, PUN 702), 2176CPRE #31 (p.19, PUN 401), 2176CPRE #34 (p.19, PUN 602), 2176CPRE #35 (p.20, PUN 401), 2176CPRE #42 (p.20, SST 601), 2176CPRE #46 (p.21, SST 501), 2176CPRE #61 (p.24, PUN 401), 2176CPRE #63 (p.24, SST 501), 2176CPRE #70 (p.25, SST 501), PT2 #2 (p.4, PUN 503), PT2 #3 (p.4, SST 401), PT2 #8 (p.5, SST 301), PT2 #11 (p.6, PUN 701), PT2 #15 (p.7, PUN 503), PT2 #18 (p.8, PUN 603), PT2 #36 (p.12, PUN 401), PT2 #38 (p.12, PUN 602), PT2 #46 (p.14, PUN 701) |

Gaps: neither test repeats the Granted-vs-Conversely confusion or "that
which" exactly, and Practice Test 2 has no relative-clause questions at
all. The app's own questions cover those.

PT2 #16–25 are unscored field-test items on the official key, but they
are still real ACT questions and fine for practice.

## Why the official questions aren't inside the app

ACT's tests are copyrighted and the app's repository is public, so the
app lists question numbers and pages and links to ACT's own PDFs rather
than copying any question text.
