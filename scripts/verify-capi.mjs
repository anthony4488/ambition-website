/**
 * Verify the Meta CAPI Purchase event before trusting it with real money.
 *
 *   node scripts/verify-capi.mjs                 # safe: TEST event only
 *   node scripts/verify-capi.mjs --live          # real event, only after testing
 *
 * The default sends with test_event_code so it appears in
 * Events Manager -> your dataset -> Test Events and is EXCLUDED from
 * optimisation. Nothing pollutes your live conversion data.
 *
 * Reads env from .env.vercel (run `vercel env pull .env.vercel --environment=production`).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ENV_FILE = path.resolve(process.cwd(), ".env.vercel");
const env = {};
if (fs.existsSync(ENV_FILE)) {
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i > 0 && !line.startsWith("#")) {
      env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
    }
  }
}
const get = (k) => process.env[k] || env[k];

const LIVE = process.argv.includes("--live");
const V = get("META_GRAPH_VERSION") || "v21.0";
const DATASET = get("META_DATASET_ID") || get("NEXT_PUBLIC_FB_PIXEL_ID");
const TOKEN = get("META_CAPI_TOKEN");
const TEST_CODE = get("META_CAPI_TEST_CODE");

const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");

function fail(msg) {
  console.error("\n  FAIL  " + msg);
  process.exit(1);
}

console.log("\nMeta CAPI verification");
console.log("  dataset :", DATASET || "(missing)");
console.log("  token   :", TOKEN ? `set, ${TOKEN.length} chars` : "(missing)");
console.log("  mode    :", LIVE ? "LIVE — a real Purchase will be recorded" : "TEST");

if (!DATASET) fail("No dataset id. Set META_DATASET_ID or NEXT_PUBLIC_FB_PIXEL_ID.");
if (!TOKEN) {
  fail(
    "META_CAPI_TOKEN is not set.\n" +
      "        Events Manager -> your dataset -> Settings -> Conversions API\n" +
      "        -> Generate access token. Do NOT reuse FB_PAGE_ACCESS_TOKEN:\n" +
      "        it is a page token and /events rejects it with (#200).",
  );
}
if (!LIVE && !TEST_CODE) {
  fail(
    "META_CAPI_TEST_CODE is not set.\n" +
      "        Events Manager -> Test Events -> copy the TEST##### code.\n" +
      "        Without it this would write a REAL Purchase to your dataset.",
  );
}

// A representative payload: exactly what the Stripe webhook sends.
const event = {
  event_name: "Purchase",
  event_time: Math.floor(Date.now() / 1000),
  event_id: `verify_${Date.now()}`,
  action_source: "website",
  user_data: {
    em: [sha256("verify@example.com")],
    ph: [sha256("61400000000")],
    // In production this is the real leadgen_id — the key that attributes the
    // payment back to the lead ad. 0 is a placeholder for the test.
    lead_id: 0,
  },
  custom_data: { currency: "AUD", value: 199 },
};

const payload = { data: [event] };
if (!LIVE) payload.test_event_code = TEST_CODE;

const url = `https://graph.facebook.com/${V}/${DATASET}/events?access_token=${TOKEN}`;
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const body = await res.json();

if (!res.ok || body.error) {
  const e = body.error || {};
  console.error("\n  FAIL  HTTP " + res.status);
  console.error("        code    :", e.code, e.error_subcode ? `/ ${e.error_subcode}` : "");
  console.error("        message :", e.message);
  if (e.code === 200 || e.code === 100) {
    console.error(
      "\n        That is a permissions error. The token needs ads_management\n" +
        "        on this dataset. A page token will always fail here.",
    );
  }
  process.exit(1);
}

console.log("\n  PASS  events_received =", body.events_received);
if (body.messages?.length) console.log("        warnings:", JSON.stringify(body.messages));
console.log("        fbtrace_id:", body.fbtrace_id);
console.log(
  LIVE
    ? "\n  A live Purchase of $199 AUD was recorded.\n"
    : "\n  Open Events Manager -> Test Events. You should see Purchase, $199 AUD.\n" +
        "  When it shows, REMOVE META_CAPI_TEST_CODE from Vercel — test events\n" +
        "  are excluded from optimisation, so leaving it in means the algorithm\n" +
        "  never learns from a single real purchase.\n",
);
