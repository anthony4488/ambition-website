// Lead qualification for Ambition Sports Performance.
//
// WHY THIS EXISTS: both application forms already collected suburb, sport and
// age, but nothing read them — SpeedSystemForm qualified purely on "ready to
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
  /** "6-12 months minimum" | "12+ months — whatever it takes" */
  commitLength?: string;
  /** "Local/Association club" | "Representative/Academy" | "Higher NPL to Youth 1st Div" | "State level or higher" */
  level?: string;
  /**
   * True when the enquiry is for an offer that can be delivered remotely
   * (the online program). Out-of-area then downgrades to "review" instead of
   * "unqualified" — an interstate online applicant is a real lead, it just
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

// Serviceable catchment for Georges Hall + Strathfield — roughly a 20 minute
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

// Football only. Confirmed 2026-08-08 — AFL and rugby are NOT the target, even
// though earlier ads said "football, soccer, AFL or rugby". Anything outside this
// lands in "review", never auto-rejected, so a genuine enquiry still reaches him.
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

  const inArea = matches(s, SYDNEY_MARKERS);
  if (inArea) return { fit: "in_area", matched: inArea };

  return { fit: "unknown", matched: null };
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
// Meta lead-form answers. These are the real LTV filters — age band, level,
// weekly budget and commitment length are all asked on the live forms and were
// previously ignored, which parked every lead in "review".
// ---------------------------------------------------------------------------

// norm() strips digits (it exists for suburb/sport matching, where "wa" inside
// "Waterloo" is the hazard). These answers are ALL digits — "13-15", "17+",
// "$130-$150/week" — so they need a normaliser that keeps them.
const normNum = (s: unknown): string =>
  String(s ?? "").toLowerCase().replace(/[^a-z0-9+\s-]/g, " ").replace(/\s+/g, " ").trim();

/** 13-17 is the band. 17+ has left the pathway; 11-13 straddles it. */
export function classifyAge(band?: string): "in" | "edge" | "out" | "unknown" {
  const s = normNum(band);
  if (!s) return "unknown";
  if (s.includes("13-15") || s.includes("15-17")) return "in";
  if (s.includes("11-13")) return "edge";   // only the top of this band qualifies
  if (s.includes("17+")) return "out";
  return "unknown";
}

/** Park football is the churn cohort. Rep/academy and above is the buyer. */
export function classifyLevel(level?: string): "in" | "out" | "unknown" {
  const s = normNum(level);
  if (!s) return "unknown";
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
  // which is not headroom — treat anything that doesn't clear 130 as under.
  return Math.max(...nums) > 130 ? "in" : "under";
}

/** Long horizon is the whole thesis — Maksim took three years. */
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
        ? `Outside Sydney (${area.matched}) — online only`
        : `Outside serviceable area (${area.matched})`,
    );
  } else if (area.fit === "unknown") {
    tier = "review";
    reasons.push("Suburb not recognised");
  }

  // A Meta lead answers a budget band instead of the site's yes/no invest
  // question. When budget is present it IS the money signal — don't also
  // demote the lead for not answering a question it was never shown.
  const hasBudgetAnswer = Boolean(input.budget);

  if (investReady === false) {
    tier = "unqualified";
    reasons.push("Not ready to invest");
  } else if (investReady === null && !hasBudgetAnswer && tier === "qualified") {
    tier = "review";
    reasons.push("Investment readiness not asked");
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

  if (age === "out") {
    tier = "unqualified";
    reasons.push("Athlete is 17+ — outside 13-17");
  } else if (age === "edge" && tier === "qualified") {
    tier = "review";
    reasons.push("Age band 11-13 — only qualifies at the top of it");
  }

  if (lvl === "out") {
    tier = "unqualified";
    reasons.push("Local/association club — not NPL, IFA or academy");
  }

  if (bud === "under") {
    tier = "unqualified";
    reasons.push("Budget below the $130/week programme floor");
  }

  // Football only — a rugby or AFL lead must never promote to qualified, no
  // matter how well it scores on age, level and budget.
  const sportOk = sport.fit === "core";

  if (tier !== "unqualified") {
    if (age === "in" && lvl === "in" && bud === "in" && sportOk) {
      tier = "qualified";
      reasons.push(
        com === "strong"
          ? "13-17, rep/academy+, budget clears, 12+ month horizon"
          : "13-17, rep/academy+, budget clears, 6-12 month horizon",
      );
    } else if (lvl === "unknown" && age === "in" && bud === "in" && sportOk && tier === "qualified") {
      // Form 1659777891796341 doesn't ask level — don't punish the lead for it,
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
 * `QualifiedLead` custom event ONLY for tier === "qualified" — that custom
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
