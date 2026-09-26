// Pinstripe Prep question bank.
// Every question is new, written from the recipes in Levi's wrong-answer bank
// (Education/ACT/Errors/Levi ACT wrong-answer bank.xlsx). No ACT text is reused.
//
// Fields:
//   id        unique, never reuse one (stats are keyed on it)
//   rule      must match a key in RULES below
//   kind      "rematch" (same trap as a real miss) or "cousin" (same skill family,
//             different rule; those live in cousins.js)
//   code      the ACT College & Career Readiness Standard it tests, e.g. USG 701
//   skill     a few words naming the exact rule
//   from      the real test question it is modelled on
//   passage   the sentence(s); the underlined part goes in [[double brackets]]
//   stem      the question asked, copied from the bank's "Question asked"
//   choices   exactly four; the first is always "No Change"
//   answer    index 0-3 of the right choice
//   trap      index 0-3 of the choice that is Levi's trap
//   why       one sentence: why the answer is right
//   trapWhy   one sentence: why the trap is wrong

const RULES = {
  "Subject-verb agreement": {
    short: "Subject–Verb", fam: "SVA",
    tip: "Find the TRUE subject, then say it with the verb alone. An -ing phrase is singular. \"One of the ___\" is singular. Ignore the noun sitting next to the verb.",
    missed: "25MC1 #9 and #21",
  },
  "Pronoun and verb agreement": {
    short: "Pronouns", fam: "PRON",
    tip: "Noun, verb AND pronoun all have to match. Check the pronoun last — that's where you stopped on 25MC1 #5. And its = belongs to it; it's = it is.",
    missed: "25MC1 #5",
  },
  "Tone and register": {
    short: "Tone & Word Choice", fam: "TONE",
    tip: "Pick the phrase that sounds like the essay: formal, plain, neutral. Lively is not better. Watch for words whose connotation fights the point.",
    missed: "25MC1 #6",
  },
  "Transitions": {
    short: "Transitions", fam: "TRANS",
    tip: "Name the relationship between the two sentences first (opposite? cause? example? add-on? concession?), THEN pick the word. \"Granted\" concedes a point — it is not \"the opposite.\"",
    missed: "25MC1 #30",
  },
  "Relative pronouns": {
    short: "Relative Clauses", fam: "REL",
    tip: "One relative word, and the right kind: that/which for things, who for people, where only for places. Never \"that which,\" never \"that it.\"",
    missed: "25MC1 #31",
  },
  "Paired dashes around an interruption": {
    short: "Punctuation", fam: "PUNC",
    tip: "An interruption needs a MATCHING pair: two dashes, two commas, or two parentheses. Open with one, close with the same. Then check the pair is around the right words.",
    missed: "25MC1 #33",
  },
};

const QUESTIONS = [
  // ---------- Subject-verb agreement (missed twice: #9 and #21) ----------
  {
    id: "sva1", kind: "rematch", code: "USG 402", skill: "-ing phrase as subject", rule: "Subject-verb agreement", from: "25MC1 #9",
    passage: "At every home game, raking the infield dirt between innings [[keep]] the grounds crew busy.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "are keeping", "keeps", "have kept"],
    answer: 2, trap: 0,
    why: "The subject is the -ing phrase \"raking the infield dirt,\" one activity, so it takes the singular keeps.",
    trapWhy: "Keep sounds right next to \"innings,\" but innings isn't the subject. Same trap as #9: you matched the verb to the wrong noun.",
  },
  {
    id: "sva2", kind: "rematch", code: "USG 701", skill: "\"each one of\" + plural noun", rule: "Subject-verb agreement", from: "25MC1 #21",
    passage: "After sunset, each one of the pennants above the bleachers [[catch]] the glow of the stadium lights.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "catches", "are catching", "have caught"],
    answer: 1, trap: 0,
    why: "The subject is each one, not pennants. Each one is singular, so catches.",
    trapWhy: "Catch agrees with \"pennants\" and \"bleachers,\" the plural nouns right before the verb. That's exactly the #21 trap (\"the last one of the notes fade\").",
  },
  {
    id: "sva3", kind: "rematch", code: "USG 701", skill: "plural subject, singular noun beside verb", rule: "Subject-verb agreement", from: "25MC1 #9 (flipped)",
    passage: "The regulars in one right-field bleacher section [[chants]] the name of every Yankees starter in the top of the first inning.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "is chanting", "has chanted", "chant"],
    answer: 3, trap: 0,
    why: "The subject is regulars, which is plural, so chant. \"In one right-field bleacher section\" just says where they sit.",
    trapWhy: "Chants agrees with \"section,\" the singular noun right before the verb. The trap flipped: this time the nearby noun is singular and the real subject is plural.",
  },
  {
    id: "sva4", kind: "rematch", code: "USG 701", skill: "\"one of the\" + plural noun", rule: "Subject-verb agreement", from: "25MC1 #21",
    passage: "Only one of the pitchers on this year's staff [[throw]] a knuckleball.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "have thrown", "throws", "are throwing"],
    answer: 2, trap: 0,
    why: "The subject is one. One throws.",
    trapWhy: "Throw agrees with \"pitchers,\" the noun inside the of-phrase. Cover up \"of the pitchers on this year's staff\" and \"one throw\" sounds wrong right away.",
  },
  {
    id: "sva5", kind: "rematch", code: "USG 402", skill: "-ing phrase as subject", rule: "Subject-verb agreement", from: "25MC1 #9",
    passage: "Signing autographs along the first-base railing before games [[has made]] the rookie a fan favorite.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "have made", "make", "are making"],
    answer: 0, trap: 1,
    why: "The subject is the -ing phrase \"Signing autographs,\" one activity, so the singular has made is already right.",
    trapWhy: "Have made agrees with \"autographs\" or \"games.\" Neither one is doing the verb — Signing is.",
  },
  {
    id: "sva6", kind: "rematch", code: "USG 701", skill: "plural subject, singular noun beside verb", rule: "Subject-verb agreement", from: "25MC1 #21 (flipped)",
    passage: "The bronze plaques behind the center-field fence [[honors]] the franchise's greatest legends.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "honor", "is honoring", "has honored"],
    answer: 1, trap: 0,
    why: "The subject is plaques, which is plural, so honor.",
    trapWhy: "Honors agrees with \"fence,\" the singular noun right before the verb. It's the flipped version of the nearest-noun trap.",
  },
  {
    id: "sva7", kind: "rematch", code: "USG 701", skill: "\"the last one of\" + plural noun", rule: "Subject-verb agreement", from: "25MC1 #21",
    passage: "The last one of the fireworks [[fades]] just as the players jog back to the dugout.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "fade", "have faded", "are fading"],
    answer: 0, trap: 1,
    why: "The subject is the last one, which is singular, so fades is right. No Change.",
    trapWhy: "Fade matches \"fireworks.\" This is almost word for word the question you missed on #21 — the last ONE fades.",
  },
  {
    id: "sva8", kind: "rematch", code: "USG 402", skill: "-ing phrase as subject", rule: "Subject-verb agreement", from: "25MC1 #9",
    passage: "Stealing bases against catchers with strong arms [[require]] almost perfect timing.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "have required", "are requiring", "requires"],
    answer: 3, trap: 0,
    why: "The subject is the -ing phrase \"Stealing bases,\" which is singular, so requires.",
    trapWhy: "Require matches \"bases,\" \"catchers\" and \"arms\" — three plural nouns lined up to fool you. The subject is Stealing.",
  },

  // ---------- Pronoun and verb agreement (#5) ----------
  {
    id: "pa1", kind: "rematch", code: "USG 602", skill: "noun, verb and its agree", rule: "Pronoun and verb agreement", from: "25MC1 #5",
    passage: "Built across the street from the original ballpark, the new [[stadium opened its]] gates in 2009.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "stadium opened their", "stadiums opened its", "stadium opened it's"],
    answer: 0, trap: 2,
    why: "Stadium, opened and its are all singular, and its (no apostrophe) is the possessive.",
    trapWhy: "Stadiums is plural but its stayed singular. That's the #5 trap: you fixed the noun and verb and never checked the pronoun.",
  },
  {
    id: "pa2", kind: "rematch", code: "USG 602", skill: "noun, verb and their agree", rule: "Pronoun and verb agreement", from: "25MC1 #5",
    passage: "Worn smooth by decades of metal cleats, the dugout [[steps show its]] age.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "step shows their", "steps show their", "steps show they're"],
    answer: 2, trap: 1,
    why: "Steps is plural and show is plural, so the pronoun has to be the plural their.",
    trapWhy: "Step shows switches the noun and verb to singular but leaves their plural. Check all three, pronoun last.",
  },
  {
    id: "pa3", kind: "rematch", code: "USG 602", skill: "noun, verb and its agree", rule: "Pronoun and verb agreement", from: "25MC1 #5",
    passage: "Signed by every player on the 1998 roster, the [[baseballs keep its]] place of honor on my grandfather's shelf.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "baseball keeps its", "baseballs keep it's", "baseball keeps their"],
    answer: 1, trap: 0,
    why: "Baseball, keeps and its are all singular: one ball, one place of honor.",
    trapWhy: "The original is the #5 trap itself: plural noun and verb (baseballs keep) with a singular pronoun (its).",
  },
  {
    id: "pa4", kind: "rematch", code: "USG 602", skill: "its vs. it's", rule: "Pronoun and verb agreement", from: "25MC1 #5",
    passage: "Once the final out is recorded, the giant center-field [[scoreboard flashes it's]] victory message.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "scoreboards flash its", "scoreboard flashes its", "scoreboard flashes their"],
    answer: 2, trap: 1,
    why: "Scoreboard, flashes and its are all singular, and the possessive its has no apostrophe.",
    trapWhy: "Scoreboards flash is plural but its is singular — the #5 pattern. And the original's it's means \"it is,\" which makes no sense here.",
  },
  {
    id: "pa5", kind: "rematch", code: "USG 602", skill: "noun, verb and their agree", rule: "Pronoun and verb agreement", from: "25MC1 #5",
    passage: "Painted on the outfield wall, the retired [[numbers keep their]] bright colors all season long.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "numbers keep its", "number keeps their", "numbers keep they're"],
    answer: 0, trap: 2,
    why: "Numbers, keep and their are all plural. No Change.",
    trapWhy: "Number keeps goes singular but their stays plural. When the noun changes, the pronoun has to change with it.",
  },

  // ---------- Tone and register (#6) ----------
  {
    id: "tr1", kind: "rematch", code: "KLA 503", skill: "tone: connotation", rule: "Tone and register", from: "25MC1 #6",
    passage: "Before each game, the grounds crew mows the outfield grass in a crisscross pattern. The practice helps the field [[look its best]] for the television cameras and the fans in the upper deck.",
    stem: "Which choice most effectively maintains the essay's tone?",
    choices: ["No Change", "look straight-up fire", "show off", "radiate a transcendent, unparalleled splendor"],
    answer: 0, trap: 2,
    why: "\"Look its best\" is plain and neutral, which is the register of an informative essay.",
    trapWhy: "Show off means about the same thing and sounds lively, but it suggests vanity. That's the #6 trap: a lively word with the wrong connotation.",
  },
  {
    id: "tr2", kind: "rematch", code: "KLA 503", skill: "tone: connotation", rule: "Tone and register", from: "25MC1 #6",
    passage: "The original Yankee Stadium opened in the Bronx in April 1923. In the very first game played there, Babe Ruth [[went ahead and smacked]] a home run into the right-field seats.",
    stem: "Which choice most effectively maintains the essay's tone?",
    choices: ["No Change", "managed to squeak out", "hit", "majestically bestowed upon the adoring throngs"],
    answer: 2, trap: 1,
    why: "Hit is plain and formal, like the rest of the passage.",
    trapWhy: "Squeak out sounds fun, but it means barely getting it — which fights the image of a home run into the seats. Same trap as #6.",
  },
  {
    id: "tr3", kind: "rematch", code: "KLA 503", skill: "tone: slang", rule: "Tone and register", from: "25MC1 #6",
    passage: "Monument Park, located beyond the center-field fence, [[gives a shout-out to]] the players and managers who shaped the franchise's history.",
    stem: "Which choice most effectively maintains the essay's tone?",
    choices: ["No Change", "pays eternal, reverent homage unto", "shows off", "honors"],
    answer: 3, trap: 2,
    why: "Honors is formal and neutral, and it says exactly what a memorial does.",
    trapWhy: "Shows off turns a memorial into bragging. Right meaning, wrong connotation.",
  },
  {
    id: "tr4", kind: "rematch", code: "KLA 503", skill: "tone: precise meaning", rule: "Tone and register", from: "25MC1 #6",
    passage: "Mariano Rivera relied almost entirely on a single pitch. His cut fastball, which broke late and sharply, [[baffled]] hitters for nearly two decades.",
    stem: "Which choice most effectively maintains the essay's tone?",
    choices: ["No Change", "totally messed with", "annoyed", "tormented the very souls of"],
    answer: 0, trap: 2,
    why: "Baffled is formal and precise: hitters couldn't figure the pitch out.",
    trapWhy: "Annoyed is formal enough, but it changes the meaning — the point is that hitters couldn't solve it, not that it bugged them.",
  },
  {
    id: "tr5", kind: "rematch", code: "KLA 503", skill: "tone: connotation", rule: "Tone and register", from: "25MC1 #6",
    passage: "Lou Gehrig left baseball in 1939 after being diagnosed with a fatal disease. In his farewell speech at Yankee Stadium, he [[bragged that he was]] the luckiest man on the face of the earth.",
    stem: "Which choice most effectively maintains the essay's tone?",
    choices: ["No Change", "called himself", "was all like he's", "declared, with trembling majesty, that he was"],
    answer: 1, trap: 0,
    why: "Called himself is plain and fits a serious, formal passage.",
    trapWhy: "Bragged sounds vivid, but it's the opposite of a humble farewell — the connotation fights the passage, exactly the #6 trap.",
  },

  // ---------- Transitions (#30) ----------
  {
    id: "tn1", kind: "rematch", code: "ORG 501", skill: "contrast vs. concession", rule: "Transitions", from: "25MC1 #30",
    passage: "During the regular season, a team can recover from a bad week over the course of 162 games. [[Granted,]] in the postseason a single loss can end everything.",
    stem: "Which transition word is most logical in context?",
    choices: ["No Change", "In contrast,", "For instance,", "As a result,"],
    answer: 1, trap: 0,
    why: "The second sentence describes the opposite situation — lots of room for error vs. none — so it's a contrast.",
    trapWhy: "Granted concedes a point to the other side; it doesn't set up an opposite. That's the #30 trap.",
  },
  {
    id: "tn2", kind: "rematch", code: "ORG 501", skill: "cause vs. concession", rule: "Transitions", from: "25MC1 #30",
    passage: "Heavy rain soaked the field for three straight hours, leaving puddles across the infield. [[Granted,]] the umpires postponed the game until the next afternoon.",
    stem: "Which transition word is most logical in context?",
    choices: ["No Change", "Conversely,", "As a result,", "For example,"],
    answer: 2, trap: 0,
    why: "The rain caused the postponement, so the relationship is cause and effect.",
    trapWhy: "Granted admits a point against your argument. Nobody is arguing here — the rain simply led to the postponement.",
  },
  {
    id: "tn3", kind: "rematch", code: "ORG 501", skill: "concession (the flip)", rule: "Transitions", from: "25MC1 #30 (flipped)",
    passage: "Some longtime fans still miss the original Yankee Stadium. [[Granted,]] the old ballpark had a closeness that is hard to replace, but the new stadium offers wider concourses, better sight lines and far more comfortable seats.",
    stem: "Which transition word is most logical in context?",
    choices: ["No Change", "Conversely,", "As a result,", "For instance,"],
    answer: 0, trap: 1,
    why: "The writer admits a point for the other side (\"the old ballpark had a closeness\") and then answers it with \"but.\" That's a concession, so Granted is right.",
    trapWhy: "Conversely means the opposite of the sentence before — but this sentence agrees with the fans. This is the #30 confusion from the other side.",
  },
  {
    id: "tn4", kind: "rematch", code: "ORG 501", skill: "example vs. concession", rule: "Transitions", from: "25MC1 #30",
    passage: "Three perfect games have been thrown by Yankees pitchers at Yankee Stadium. [[Granted,]] David Wells retired all 27 batters he faced in May 1998.",
    stem: "Which transition word is most logical in context?",
    choices: ["No Change", "In contrast,", "Nevertheless,", "For instance,"],
    answer: 3, trap: 0,
    why: "Wells's game is one of the three perfect games — it's an example.",
    trapWhy: "Granted would mean Wells's game somehow cuts against the first sentence. It doesn't; it's proof of it.",
  },
  {
    id: "tn5", kind: "rematch", code: "ORG 501", skill: "addition vs. concession", rule: "Transitions", from: "25MC1 #30",
    passage: "Derek Jeter collected more than 3,000 hits during his twenty seasons with the Yankees. [[Conversely,]] he won five World Series titles with the team.",
    stem: "Which transition word is most logical in context?",
    choices: ["No Change", "Furthermore,", "Granted,", "For instance,"],
    answer: 1, trap: 2,
    why: "The second sentence adds another accomplishment to the first, so the relationship is addition.",
    trapWhy: "Granted would set up a concession, as if the titles weakened the first point. They add to it.",
  },

  // ---------- Relative pronouns (#31) ----------
  {
    id: "rp1", kind: "rematch", code: "SST 401", skill: "doubled relative", rule: "Relative pronouns", from: "25MC1 #31",
    passage: "The glove [[that which]] protected the shortstop's hand in the championship game now sits in a glass case.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "where it", "Delete the underlined portion.", "that"],
    answer: 3, trap: 0,
    why: "A glove is a thing, and the clause needs one relative word: that.",
    trapWhy: "\"That which\" sounds formal, but it doubles up the relative pronoun — exactly the #31 trap.",
  },
  {
    id: "rp2", kind: "rematch", code: "SST 401", skill: "who for people", rule: "Relative pronouns", from: "25MC1 #31",
    passage: "The closer [[who]] recorded the final out was mobbed by his teammates on the mound.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "who that", "which", "where he"],
    answer: 0, trap: 1,
    why: "A closer is a person, so who. One relative word, no extra pronoun. No Change.",
    trapWhy: "\"Who that\" doubles the relative pronoun, the same mistake as \"that which.\"",
  },
  {
    id: "rp3", kind: "rematch", code: "SST 401", skill: "where for places", rule: "Relative pronouns", from: "25MC1 #31",
    passage: "The team has played its home games in the Bronx, [[which]] the original Yankee Stadium opened in 1923.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "that which", "where", "that"],
    answer: 2, trap: 1,
    why: "The Bronx is a place, and the clause says what happened there, so where.",
    trapWhy: "\"That which\" is the #31 trap: two relative words where one belongs.",
  },
  {
    id: "rp4", kind: "rematch", code: "SST 401", skill: "repeated pronoun", rule: "Relative pronouns", from: "25MC1 #31",
    passage: "Fans still line up for the garlic fries [[that they]] are sold near the left-field gate.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "where they", "that", "Delete the underlined portion."],
    answer: 2, trap: 0,
    why: "That starts the clause and already stands for the fries, so it needs nothing after it.",
    trapWhy: "\"That they\" repeats the noun with a pronoun. The clause gets one word for the fries, not two.",
  },
  {
    id: "rp5", kind: "rematch", code: "SST 401", skill: "doubled relative after a comma", rule: "Relative pronouns", from: "25MC1 #31",
    passage: "The team's pinstripes, [[that which]] have become one of the most recognizable designs in sports, appear only on its home uniforms.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "which", "where they", "which they"],
    answer: 1, trap: 0,
    why: "Pinstripes are things, and after a comma the relative word is which.",
    trapWhy: "\"That which\" is the double relative from #31. It sounds fancy; it's wrong.",
  },

  // ---------- Paired dashes / punctuation around an interruption (#33) ----------
  {
    id: "pd1", kind: "rematch", code: "PUN 503", skill: "mismatched pair", rule: "Paired dashes around an interruption", from: "25MC1 #33",
    passage: "The rookie's first career hit[[—a towering blast to left field,]] brought the entire crowd to its feet.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "—a towering blast to left field—", ", a towering blast to left field", "a towering blast to left field—"],
    answer: 1, trap: 2,
    why: "The interruption opens with a dash and closes with a dash: a matching pair.",
    trapWhy: "This one opens with a comma and never closes, so the interruption runs straight into \"brought.\" That's the #33 trap.",
  },
  {
    id: "pd2", kind: "rematch", code: "PUN 503", skill: "dashes between helping verb and verb", rule: "Paired dashes around an interruption", from: "25MC1 #33",
    passage: "The Yankees [[have—by a wide margin—won]] more World Series titles than any other franchise.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "have, by a wide margin—won", "have, by a wide margin won", "have by a wide margin—won"],
    answer: 0, trap: 2,
    why: "Two dashes surround the interruption between the helping verb and the verb, just like \"can—and should—be.\" No Change.",
    trapWhy: "An opening comma with no closing one. You picked this exact pattern on #33.",
  },
  {
    id: "pd3", kind: "rematch", code: "PUN 602", skill: "commas around a which-clause", rule: "Paired dashes around an interruption", from: "25MC1 #33",
    passage: "Monument Park[[, which sits just beyond the center-field fence]] draws crowds of visitors before every home game.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "—which sits just beyond the center-field fence,", ", which sits just beyond the center-field fence,", "which sits just beyond the center-field fence,"],
    answer: 2, trap: 0,
    why: "The clause interrupts the subject and verb, so it needs a comma on both sides.",
    trapWhy: "The original opens with a comma and never closes it. Count the marks: you need two, and they need to match.",
  },
  {
    id: "pd4", kind: "rematch", code: "PUN 503", skill: "pair around the right words", rule: "Paired dashes around an interruption", from: "25MC1 #33",
    passage: "My grandfather[[, a season-ticket holder since 1978—]] still keeps every ticket stub in a shoebox.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "—a season-ticket holder—since 1978", "—a season-ticket holder since 1978—", ", a season-ticket holder since 1978"],
    answer: 2, trap: 3,
    why: "Two dashes around the whole interruption, \"a season-ticket holder since 1978.\"",
    trapWhy: "An opening comma with no closing mark — the #33 trap. (And watch the choice with two dashes around only part of the phrase: a matched pair around the wrong words.)",
  },
  {
    id: "pd5", kind: "rematch", code: "PUN 503", skill: "parentheses as a pair", rule: "Paired dashes around an interruption", from: "25MC1 #33",
    passage: "The final pitch[[—a slider that broke sharply)]] dove under the batter's swing for strike three.",
    stem: "Which choice makes the sentence most grammatically acceptable?",
    choices: ["No Change", "(a slider that broke sharply)", "(a slider that broke sharply", ", a slider that broke sharply)"],
    answer: 1, trap: 2,
    why: "Parentheses work as a pair too: open and close with the same kind of mark.",
    trapWhy: "Opens with a parenthesis and never closes it. One mark is never enough for an interruption.",
  },
];
