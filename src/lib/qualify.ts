// Lead qualification for Ambition Sports Performance.
//
// WHY THIS EXISTS: both application forms already collected suburb, sport and
// age, but nothing read them. SpeedSystemForm qualified purely on "ready to
// invest", and EnquiryForm hardcoded qualified:true. So a Newcastle basketball
// parent scored identically to a Campbelltown football family, and the Meta
// pixel fired the same generic Lead event for both. This module turns those
// existing answers into a tier that (a) sharpens the Telegram alert and
// (b) drives a distinct pixel event Meta can optimise toward.
//
// DESIGN RULE: never auto-reject on uncertainty. Anything we can't read
// confidently lands in "review" so Anthony still sees the lead.

export type LeadTier = "qualified" | "review" | "unqualified";
export type AreaFit = "in_area" | "out_of_area" | "unknown";
export type SportFit = "core" | "other" | "unknown";

export interface QualifyInput {
  /** Free-text suburb (SpeedSystemForm) or state/country select (EnquiryForm). */
  suburb?: string;
  /** Free-text sport, or "Football · Winger" style composites. */
  sport?: string;
  /** SpeedSystemForm Q7 exact option string. */
  invest?: string;
  /** EnquiryForm online-program commitment option string. */
  commitmentLevel?: string;
  // ---- Meta lead-form answers (forms 1659777891796341 / 1490958988895522) ----
  /** "11-13" | "13-15" | "15-17" | "17+" */
  ageBand?: string;
  /** "$130-$150/week" | "$150-$180/week" | "$180+/week" | "$100-$130/week" */
  budget?: string;
  /** "6-12 months minimum" | "12+ months, whatever it takes" */
  commitLength?: string;
  /** "Local/Association club" | "Representative/Academy" | "Higher NPL to Youth 1st Div" | "State level or higher" */
  level?: string;
  /**
   * "Get scouted/play at the highest level" | "Make a representative or academy
   * team" | "Want to get fit". Only on form 28291627200469783.
   */
  goal?: string;
  /**
   * True when the enquiry is for an offer that can be delivered remotely
   * (the online program). Out-of-area then downgrades to "review" instead of
   * "unqualified", an interstate online applicant is a real lead, it just
   * shouldn't count as a conversion for the Sydney in-person campaign.
   */
  remote?: boolean;
}

export interface QualifyResult {
  tier: LeadTier;
  area: AreaFit;
  sportFit: SportFit;
  investReady: boolean | null;
  /** Human-readable why, surfaced in the Telegram alert and lead notes. */
  reasons: string[];
}

const norm = (s: unknown): string =>
  String(s ?? "")
   .toLowerCase()
   .replace(/[^a-z\s]/g, " ")
   .replace(/\s+/g, " ")
   .trim();

// Serviceable catchment for Georges Hall + Strathfield, roughly a 20 minute
// drive, inner west and Bankstown.
//
// This used to be the whole of Greater Sydney "because Anthony takes them anyway".
// He doesn't. Campbelltown, Liverpool, Fairfield, Parramatta, Penrith and Blacktown
// are OUT (confirmed 2026-08-08), and scoring them as qualified was firing a
// QualifiedLead pixel event that taught Meta to go and find more of them.
const SYDNEY_MARKERS = [
  // Inner west - Strathfield venue
  "strathfield", "burwood", "ashfield", "croydon", "concord", "homebush",
  "north strathfield", "flemington", "five dock", "drummoyne", "canada bay",
  "leichhardt", "haberfield", "summer hill", "lewisham", "petersham",
  "marrickville", "dulwich hill", "earlwood", "rodd point", "russell lea",
  // Bankstown / Georges Hall venue
  "georges hall", "bankstown", "chester hill", "sefton", "yagoona", "birrong",
  "condell park", "padstow", "revesby", "panania", "east hills", "milperra",
  "picnic point", "lansdowne", "villawood", "regents park", "potts hill",
  // Arncliffe venue, Riverine Park. Confirmed as a standing location 2026-08-31.
  //
  // Previously ONLY the word "arncliffe" was here, with a note that the
  // surrounding catchment had never been defined. That meant every St George
  // suburb within a few minutes of the venue scored "Suburb not recognised" and
  // parked in review: Rockdale, Kogarah, Banksia, Bexley, Wolli Creek, Turrella,
  // Bardwell Park, Brighton-Le-Sands and the rest. Those are serviceable leads
  // being held back, which is the mirror image of the 2026-08-08 problem where
  // unserviceable ones were being scored as qualified.
  //
  // All of the below are inside the same "roughly a 20 minute drive" rule the
  // other two venues use.
  "arncliffe", "wolli creek", "turrella", "banksia", "rockdale", "kyeemagh",
  "bardwell park", "bardwell valley", "bexley", "bexley north", "kogarah",
  "carlton", "allawah", "hurstville", "beverley park", "brighton le sands",
  "brighton-le-sands", "monterey", "ramsgate", "sans souci", "sandringham",
  "dolls point", "st george",
  // Inner south, a similar distance to Arncliffe as Strathfield's ring is to
  // Strathfield. Flag if these turn out to churn.
  "tempe", "sydenham", "st peters", "mascot", "botany", "eastlakes", "wolli",
  // Canterbury
  "canterbury", "campsie", "belmore", "lakemba", "wiley park", "punchbowl",
  "greenacre", "roselands", "belfield", "clemton park", "hurlstone park",
  "kingsgrove", "bexley north", "beverly hills", "narwee", "riverwood",
  // Region words parents actually type
  "inner west", "bankstown area", "canterbury bankstown",
];

// Explicitly OUT even though they are Sydney. Too far to sustain weekly
// attendance at Georges Hall or Strathfield, so they churn.
const OUT_OF_CATCHMENT = [
  "campbelltown", "camden", "narellan", "oran park", "gregory hills", "macarthur",
  "liverpool", "casula", "moorebank", "prestons", "hoxton park", "west hoxton",
  "leppington", "austral", "bringelly", "ingleburn", "minto", "leumeah", "glenfield",
  "fairfield", "cabramatta", "canley", "smithfield", "wetherill park", "bonnyrigg",
  "parramatta", "harris park", "westmead", "granville", "auburn", "lidcombe",
  "merrylands", "guildford", "rydalmere", "dundas", "carlingford",
  "blacktown", "seven hills", "toongabbie", "wentworthville", "pendle hill",
  "penrith", "st marys", "kingswood", "emu plains", "glenmore park", "mount druitt",
  "rooty hill", "quakers hill", "schofields", "marsden park", "riverstone",
  "castle hill", "baulkham hills", "kellyville", "rouse hill", "the hills",
  "sutherland", "cronulla", "miranda", "caringbah", "engadine", "menai", "gymea",
  "sylvania", "kirrawee", "jannali", "como", "bangor", "illawong",
  "manly", "dee why", "brookvale", "narrabeen", "mona vale", "avalon", "freshwater",
  "curl curl", "collaroy", "warriewood", "newport", "palm beach", "northern beaches",
  "hornsby", "epping", "castle cove", "western sydney", "greater western sydney",
  "south west sydney", "sw sydney", "sutherland shire", "the shire", "hills district",
  "macarthur region",
];

// Explicitly NOT serviceable for in-person coaching. Checked FIRST, because a
// string like "Newcastle NSW" contains the Sydney marker "nsw".
const OUT_OF_AREA_MARKERS = [
  // Regional NSW
  "newcastle", "hunter", "maitland", "cessnock", "singleton", "port stephens",
  "nelson bay", "wollongong", "illawarra", "shellharbour", "kiama", "nowra",
  "shoalhaven", "central coast", "gosford", "wyong", "terrigal", "the entrance",
  "erina", "tuggerah", "bathurst", "orange", "dubbo", "wagga", "albury", "tamworth",
  "armidale", "coffs harbour", "port macquarie", "taree", "byron", "ballina",
  "lismore", "tweed", "goulburn", "mudgee", "griffith", "broken hill", "blue mountains",
  "katoomba", "springwood", "lithgow", "bowral", "mittagong", "southern highlands",
  // Interstate
  "melbourne", "victoria", "vic", "geelong", "ballarat", "bendigo",
  "brisbane", "queensland", "qld", "gold coast", "sunshine coast", "cairns",
  "townsville", "toowoomba", "ipswich", "logan",
  "perth", "western australia", "wa", "fremantle",
  "adelaide", "south australia", "sa",
  "hobart", "tasmania", "tas", "launceston",
  "darwin", "northern territory", "nt",
  "canberra", "queanbeyan", "act",
  // International
  "international", "overseas", "new zealand", "auckland", "singapore", "dubai",
  "uk", "united kingdom", "london", "usa", "united states", "india", "philippines",
];

// Football is the core. Confirmed 2026-08-08, revisited 2026-08-25: other
// sports are no longer rejected, they reach review and get judged by hand.
const CORE_SPORTS = [
  "football", "soccer", "futsal",
  "npl", "ifa", "academy",          // level words parents type instead of the sport
];

// Whole-word matching only. Plain substring matching is unsafe here because the
// short state codes are substrings of real Sydney suburbs: "wa" is inside
// "Waterloo"/"Wahroonga", "sa" inside "Sans Souci", "nt" inside "International".
// norm() has already reduced the input to lowercase words separated by single
// spaces, so padding both sides lets us test for " marker " exactly.
function matches(haystack: string, needles: string[]): string | null {
  const padded = ` ${haystack} `;
  for (const n of needles) {
    if (padded.includes(` ${n} `)) return n;
  }
  return null;
}

export function classifyArea(suburb?: string): { fit: AreaFit; matched: string | null } {
  const s = norm(suburb);
  if (!s) return { fit: "unknown", matched: null };

  // Out-of-area wins: "Newcastle NSW" must not pass on the "nsw" token.
  const out = matches(s, OUT_OF_AREA_MARKERS) ?? matches(s, OUT_OF_CATCHMENT);
  if (out) return { fit: "out_of_area", matched: out };

  // "Elsewhere in Sydney" on the Meta form is an explicit "I'm in the city but
  // not in one of your catchments". It must land in review, not in_area: the
  // city-level fallback below would otherwise read the word "sydney" and score
  // it as fully in-catchment, firing QualifiedLead for someone an hour away.
  // Checked before the marker list because the option text carries no suburb.
  if (matches(s, ["elsewhere in sydney", "elsewhere"])) {
    return { fit: "unknown", matched: null };
  }

  const inArea = matches(s, SYDNEY_MARKERS);
  if (inArea) return { fit: "in_area", matched: inArea };

  // City-level fallback. Form 28291627200469783 asks "What city are you located
  // in?" and offers Sydney / Brisbane / Victoria, so the answer arrives as a bare
  // metro name with no suburb in it. Without this every Sydney lead from that
  // form scored "unknown" and parked in review, which meant the QualifiedLead
  // pixel event never fired and Meta only ever learned from the generic Lead.
  // The out-of-area and out-of-catchment lists are checked above, so anything
  // reaching here that says Sydney has no disqualifying suburb attached.
  // Deliberately coarser than a suburb, the reason string says so.
  if (matches(s, ["sydney"])) return { fit: "in_area", matched: "sydney (city level)" };

  return { fit: "unknown", matched: null };
}

/**
 * "What's your goal for your athlete?" on the conditional-logic Meta form.
 * "Want to get fit" is the cleanest disqualifier on the whole form, it is an
 * explicit answer, not missing data, so it rejects rather than parks in review.
 */
export function classifyGoal(goal?: string): "elite" | "rep" | "casual" | "unknown" {
  const s = norm(goal);
  if (!s) return "unknown";
  if (s.includes("fit")) return "casual";
  if (s.includes("scouted") || s.includes("highest level")) return "elite";
  if (s.includes("representative") || s.includes("academy")) return "rep";
  return "unknown";
}

export function classifySport(sport?: string): { fit: SportFit; matched: string | null } {
  const s = norm(sport);
  if (!s) return { fit: "unknown", matched: null };
  const core = matches(s, CORE_SPORTS);
  if (core) return { fit: "core", matched: core };
  return { fit: "other", matched: null };
}

/**
 * Reads investment readiness from either form's wording.
 * Returns null when the question wasn't asked (e.g. the football/waitlist
 * variants of EnquiryForm), so absence is never treated as a "no".
 */
export function classifyInvest(invest?: string, commitmentLevel?: string): boolean | null {
  if (invest) return invest === "Yes, ready to invest";
  if (commitmentLevel) return commitmentLevel !== "Not ready to invest at this level";
  return null;
}

// ---------------------------------------------------------------------------
// Meta lead-form answers. These are the real LTV filters, age band, level,
// weekly budget and commitment length are all asked on the live forms and were
// previously ignored, which parked every lead in "review".
// ---------------------------------------------------------------------------

// norm() strips digits (it exists for suburb/sport matching, where "wa" inside
// "Waterloo" is the hazard). These answers are ALL digits, "13-15", "17+",
// "$130-$150/week", so they need a normaliser that keeps them.
const normNum = (s: unknown): string =>
  String(s ?? "").toLowerCase().replace(/[^a-z0-9+\s-]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Age is context, never a veto.
 *
 * This used to enforce a hard 13-17 band, which was right when the offer was
 * "footballers 13 to 17 at NPL, IFA or academy level". It is wrong now. The
 * application accepts Professional, Semi-professional and National / Olympic
 * representative, and every one of those athletes is an adult, so the old rule
 * scored the best applicants `out` on age the moment they arrived. It marked an
 * 18-year-old NPL player at Western Sydney Wanderers UNQUALIFIED on a birthday.
 *
 * Now: 13 and up never downgrades anyone, whatever the number, and level does
 * the work. Below that returns `edge`, which lands the lead in review rather
 * than unqualified, young athletes may still be worth taking, they just want
 * a closer look. Nothing here can produce `out` on its own any more.
 */
export function classifyAge(band?: string): "in" | "edge" | "out" | "unknown" {
  const s = normNum(band);
  if (!s) return "unknown";
  // Below the band the methodology assumes. Worth a look, not a rejection.
  if (s.includes("under 10") || s.includes("under 13") || s.includes("under 14")) return "edge";
  if (s.includes("11-12")) return "edge";
  if (s.includes("11-13")) return "edge";   // straddles it
  // 13 and up, including seniors and professionals.
  if (s.includes("13-15") || s.includes("15-17") || s.includes("17+") || s.includes("18+")) return "in";
  return "unknown";
}

/**
 * Turns a date of birth into one of the age bands `classifyAge` already reads,
 * so the website form can collect an exact DOB without duplicating the banding
 * rules that the Meta lead forms depend on.
 *
 * Returns undefined for anything unparseable, the caller then passes no band
 * and the lead lands in "review", which is the safe default.
 */
export function ageBandFromDob(dob?: string): string | undefined {
  if (!dob) return undefined;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return undefined;

  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const beforeBirthday =
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate());
  if (beforeBirthday) age -= 1;

  // Guard against typos (a mistyped year giving a 300-year-old athlete).
  if (age < 3 || age > 60) return undefined;

  if (age < 11) return "under 10";
  if (age < 13) return "11-12";
  if (age < 15) return "13-15";
  if (age < 18) return "15-17";
  return "17+";
}

/** The exact option strings on the website application's level select. */
// Keys are the normNum() form of each option: lowercased, punctuation to
// spaces, collapsed. "National / Olympic representative" arrives here as
// "national olympic representative".
const WEBSITE_LEVEL: Record<string, "in" | "out" | "unknown"> = {
  "professional": "in",
  "semi-professional": "in",
  "national olympic representative": "in",
  "state representative": "in",
  "npl": "in",
  "ifa": "in",
  "club academy": "in",
  // Genuine athletes, but not the band this programme is built around, review,
  // never auto-reject.
  "school representative": "unknown",
  "school or social": "out",
  "other": "unknown",
};

/** Park football is the churn cohort. Rep/academy and above is the buyer. */
export function classifyLevel(level?: string): "in" | "out" | "unknown" {
  const s = normNum(level);
  if (!s) return "unknown";
  // Exact website options first: "School representative" contains
  // "representative" and would otherwise score as high as NPL.
  if (s in WEBSITE_LEVEL) return WEBSITE_LEVEL[s];
  if (s.includes("local") || s.includes("association")) return "out";
  if (s.includes("representative") || s.includes("academy") || s.includes("npl") ||
      s.includes("state") || s.includes("div")) return "in";
  return "unknown";
}

/** The programme floor is $130/week. Anything under can't sustain it. */
export function classifyBudget(budget?: string): "in" | "under" | "unknown" {
  const nums = String(budget ?? "").match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return "unknown";
  // Use the TOP of the band: "$100-$130/week" tops out exactly at the floor,
  // which is not headroom, treat anything that doesn't clear 130 as under.
  return Math.max(...nums) > 130 ? "in" : "under";
}

/** Long horizon is the whole thesis. Maksim took three years. */
export function classifyCommit(len?: string): "strong" | "ok" | "unknown" {
  const s = normNum(len);
  if (!s) return "unknown";
  // Order matters: "6-12 months minimum" contains "12" but is the LOWER tier.
  // Check the range before the open-ended "12+".
  if (/6\s*-\s*12/.test(s)) return "ok";
  if (s.includes("12+") || /\b12\b/.test(s)) return "strong";
  if (/\b6\b/.test(s)) return "ok";
  return "unknown";
}

export function qualifyLead(input: QualifyInput): QualifyResult {
  const area = classifyArea(input.suburb);
  const sport = classifySport(input.sport);
  const investReady = classifyInvest(input.invest, input.commitmentLevel);
  const reasons: string[] = [];

  let tier: LeadTier = "qualified";

  if (area.fit === "out_of_area") {
    tier = input.remote ? "review" : "unqualified";
    reasons.push(
      input.remote
        ? `Outside Sydney (${area.matched}), online only`
        : `Outside serviceable area (${area.matched})`,
    );
  } else if (area.fit === "unknown") {
    tier = "review";
    reasons.push("Suburb not recognised");
  }

  // An explicit "no" on money still disqualifies. Silence does not.
  //
  // The application deliberately stopped asking about money, no budget band,
  // and the consent box names only the $199 assessment. Treating that silence
  // as "unconfirmed" capped every website lead at review, which meant tier
  // `qualified` was unreachable and the QualifiedLead pixel event had never
  // fired once. Level and area carry the signal instead.
  if (investReady === false) {
    tier = "unqualified";
    reasons.push("Not ready to invest");
  }

  if (tier !== "unqualified") {
    if (sport.fit === "other") {
      if (tier === "qualified") tier = "review";
      reasons.push("Sport outside the core list");
    } else if (sport.fit === "unknown") {
      if (tier === "qualified") tier = "review";
      reasons.push("Sport not provided");
    }
  }

  // ---- Meta lead-form answers. Hard filters first. ----
  const age = classifyAge(input.ageBand);
  const lvl = classifyLevel(input.level);
  const bud = classifyBudget(input.budget);
  const com = classifyCommit(input.commitLength);

  // Age can no longer disqualify. classifyAge never returns "out", seniors and
  // professionals are in scope now, and young athletes get looked at rather
  // than binned.
  if (age === "edge" && tier === "qualified") {
    tier = "review";
    reasons.push("Younger than the methodology assumes, worth a look");
  }

  if (lvl === "out") {
    tier = "unqualified";
    reasons.push("Local/association club, not NPL, IFA or academy");
  }

  if (bud === "under") {
    tier = "unqualified";
    reasons.push("Budget below the $130/week programme floor");
  }

  // "Want to get fit" is an explicit no, not missing data, so it rejects the
  // same way an out-of-area answer does. Without this the strongest signal on
  // the form was collected and then ignored.
  const goal = classifyGoal(input.goal);
  if (goal === "casual") {
    tier = "unqualified";
    reasons.push("Goal is general fitness, not the pathway");
  }

  // Football only, a rugby or AFL lead must never promote to qualified, no
  // matter how well it scores on age, level and budget.
  const sportOk = sport.fit === "core";

  if (tier !== "unqualified") {
    // `bud` only has to not be "under", an explicit under-floor answer has
    // already forced unqualified above, and an absent one must not block green.
    //
    // `tier === "qualified"` is load-bearing: this branch CONFIRMS a clean lead
    // and attaches the reason, it must never promote one that something above
    // already downgraded. Without it an applicant with an unrecognised suburb
    // came out green while still carrying "Suburb not recognised" as its reason.
    if (tier === "qualified" && age === "in" && lvl === "in" && bud !== "under" && sportOk) {
      tier = "qualified";
      // The apply form no longer asks commit length, so "unknown" must not be
      // reported as a 6-12 month horizon we were never told about.
      reasons.push(
        com === "strong"
          ? "Rep/academy+, budget clears, 12+ month horizon"
          : com === "ok"
            ? "Rep/academy+, budget clears, 6-12 month horizon"
            : "Rep/academy+, budget clears",
      );
    } else if (lvl === "unknown" && age === "in" && bud === "in" && sportOk && tier === "qualified") {
      // Form 1659777891796341 doesn't ask level, don't punish the lead for it,
      // but don't claim a level we never asked about either.
      reasons.push("Level not asked on this form");
    }
  }

  if (tier === "qualified" && !reasons.length) {
    reasons.push("In area, core sport, ready to invest");
  }

  return { tier, area: area.fit, sportFit: sport.fit, investReady, reasons };
}

/**
 * Fires the Meta pixel for a completed application.
 *
 * Always sends the standard `Lead` event so the existing pixel history and the
 * campaigns already optimising against it keep working. Additionally sends a
 * `QualifiedLead` custom event ONLY for tier === "qualified", that custom
 * event is what a Meta custom conversion should be built on, since neither form
 * produces a distinct success URL to write a URL rule against.
 */
export function fireLeadPixel(result: QualifyResult, extra: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;

  const params = {
    content_name: "Application Complete",
    lead_tier: result.tier,
    lead_area: result.area,
    lead_sport_fit: result.sportFit,
   ...extra,
  };

  fbq("track", "Lead", params);
  if (result.tier === "qualified") fbq("trackCustom", "QualifiedLead", params);
}
