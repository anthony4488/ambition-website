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

// Greater Sydney — the real serviceable area, deliberately WIDER than the ad
// campaign's 25km radius. Campbelltown, Penrith, Blacktown and Liverpool all
// sit outside 25km from the CBD but are athletes Anthony does take, so the form
// must not discard them just because the ad targeting is tighter.
const SYDNEY_MARKERS = [
  // Core / inner
  "sydney", "cbd", "surry hills", "redfern", "newtown", "glebe", "pyrmont", "ultimo",
  "alexandria", "waterloo", "zetland", "erskineville", "marrickville", "dulwich hill",
  // Inner west
  "leichhardt", "balmain", "rozelle", "annandale", "ashfield", "burwood", "strathfield",
  "concord", "five dock", "drummoyne", "croydon", "summer hill", "canada bay",
  // East
  "bondi", "coogee", "randwick", "maroubra", "kensington", "clovelly", "bronte",
  "waverley", "vaucluse", "double bay", "paddington", "woollahra", "rose bay", "botany",
  "mascot", "eastgardens", "kingsford", "matraville", "malabar",
  // North shore / northern
  "north sydney", "chatswood", "willoughby", "lane cove", "crows nest", "st leonards",
  "artarmon", "gordon", "killara", "lindfield", "roseville", "pymble", "turramurra",
  "wahroonga", "hornsby", "epping", "eastwood", "ryde", "macquarie park", "north ryde",
  "meadowbank", "gladesville", "hunters hill", "mosman", "neutral bay", "cremorne",
  "kirribilli", "castle hill", "baulkham hills", "kellyville", "rouse hill", "the hills",
  // Northern beaches
  "manly", "dee why", "brookvale", "narrabeen", "mona vale", "avalon", "freshwater",
  "curl curl", "collaroy", "warriewood", "newport", "palm beach", "balgowlah", "seaforth",
  "northern beaches",
  // West / greater west
  "parramatta", "harris park", "westmead", "granville", "auburn", "lidcombe", "homebush",
  "olympic park", "rydalmere", "dundas", "carlingford", "merrylands", "guildford",
  "blacktown", "seven hills", "toongabbie", "wentworthville", "pendle hill", "prospect",
  "penrith", "st marys", "kingswood", "emu plains", "glenmore park", "mount druitt",
  "rooty hill", "quakers hill", "schofields", "marsden park", "riverstone",
  // South west
  "bankstown", "punchbowl", "greenacre", "chester hill", "yagoona", "condell park",
  "liverpool", "casula", "moorebank", "prestons", "hoxton park", "west hoxton",
  "campbelltown", "macarthur", "camden", "narellan", "oran park", "gregory hills",
  "leppington", "austral", "bringelly", "ingleburn", "minto", "leumeah", "glenfield",
  "fairfield", "cabramatta", "canley", "smithfield", "wetherill park", "bonnyrigg",
  // South
  "hurstville", "kogarah", "rockdale", "brighton le sands", "sans souci", "carlton",
  "beverly hills", "peakhurst", "mortdale", "oatley", "penshurst", "arncliffe",
  "sutherland", "cronulla", "miranda", "caringbah", "engadine", "menai", "gymea",
  "sylvania", "kirrawee", "jannali", "como", "bangor", "illawong", "sans souci",
  "revesby", "padstow", "panania", "east hills", "milperra",
  // Region words people actually type
  "greater western sydney", "western sydney", "south west sydney", "sw sydney",
  "sutherland shire", "the shire", "inner west", "eastern suburbs", "north shore",
  "hills district", "macarthur region", "nsw",
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

// Sports where Anthony has direct, demonstrable results. Anything outside this
// is REVIEW, never rejected — this list is a starting point, not a policy.
// TODO(Anthony): confirm which sports you actually want excluded.
const CORE_SPORTS = [
  "football", "soccer", "futsal",
  "rugby", "league", "union", "nrl",
  "afl", "aussie rules", "australian rules",
  "athletics", "track", "sprint", "sprinting", "sprinter", "running",
  "basketball", "netball",
  "touch", "oztag",
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
  const out = matches(s, OUT_OF_AREA_MARKERS);
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

  if (investReady === false) {
    tier = "unqualified";
    reasons.push("Not ready to invest");
  } else if (investReady === null && tier === "qualified") {
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

  if (tier === "qualified") reasons.push("In area, core sport, ready to invest");

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
