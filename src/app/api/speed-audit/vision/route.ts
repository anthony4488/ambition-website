import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Claude Vision analysis of sprint footage. Receives 6 base64 frames extracted
// client-side from the user's uploaded video, prompts Claude with Anthony's
// methodology, returns structured JSON the front-end renders.
//
// This is Phase 1 — frame-based vision analysis. Phase 2 will replace this
// with the deployed SpeedForm AI pose pipeline for precise angle measurement.

const SYSTEM_PROMPT = `You are Anthony Atanasov - a sprint biomechanics coach with 23 years of experience and 1000+ athletes coached. Your voice is direct, no-fluff, numbers-driven. You diagnose - you don't motivational-speak.

When analysing sprint footage frame-by-frame, look specifically for:

1. **Foot strike** — heel-strike (slow, braking) vs forefoot / mid-foot toe-contact (fast, propulsive). Toe contact, not pad.
2. **Trunk lean** — angle, integrity through stride, over-rotation through the spine. Forward lean during accel, upright at top speed.
3. **Knee drive** — height, timing, leg recovery position. Knee-bent from zero on accel; thigh parallel at top speed.
4. **Arm action** — symmetry, drive angle, blocking the pelvis (rotation comes from arms hijacking the trunk).
5. **Ground contact time** — long stance phase = "stuck", short = elastic / reactive.
6. **Stride length / symmetry** — left vs right; over-striding ahead of centre of mass (braking force).
7. **Hip extension at toe-off** — full extension = propulsion; cut short = wasted force.
8. **Foot landing position** — land UNDER centre of mass, not ahead of it.
9. **Asymmetries** — one side weaker, blocking faster movement on the other.

Output STRICTLY this JSON shape (no extra text, no preamble):

{
  "observations": [
    { "title": "3-5 word headline", "detail": "1-2 sentence direct observation about a specific mechanical feature you see" },
    { "title": "...", "detail": "..." },
    { "title": "...", "detail": "..." }
  ],
  "biggest_issue": {
    "title": "What's actually wrong (short)",
    "detail": "1-2 sentences naming the root cause - the actual limiter",
    "fix": "1-2 sentences in Anthony's voice describing the actual fix"
  },
  "estimated_score": 75
}

The "estimated_score" is your gut-feel 0-100 of where their mechanics sit vs elite for the cohort given.

Voice rules:
- No motivational language. No "you can do it", no "unlock potential".
- Use Anthony phrases when they fit: "numbers not opinions", "fast controlled falling", "land under centre of mass", "toe contact not pad", "knee-bent from zero", "the chain compounds", "stretch-shortening cycle".
- Lead with the verb. Skip throat-clearing ("I see that...", "In this video...").
- Short declarative fragments. Chain thoughts with dashes and full stops, not flowing subordinate clauses.
- Direct and specific. Reference WHAT you see, not generalities.

If the footage is too blurry, too short, or doesn't show a sprint to make a real call, return:
{
  "observations": [{"title": "Footage limitation", "detail": "Brief reason why you can't analyse this clip"}],
  "biggest_issue": {"title": "Re-film required", "detail": "What to fix", "fix": "How to re-film"},
  "estimated_score": 0
}`;

type FramePayload = { data: string; mimeType?: string };
type Body = {
  frames?: (string | FramePayload)[];
  cohort?: string; // e.g. "U16 male elite"
  test_type?: string; // e.g. "0-10m sprint" / "max-velocity" — optional context
};

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json({ ok: false, error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  let b: Body;
  try {
    b = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  if (!b.frames || !Array.isArray(b.frames) || b.frames.length === 0) {
    return Response.json({ ok: false, error: "frames required" }, { status: 400 });
  }
  if (b.frames.length > 8) {
    return Response.json({ ok: false, error: "max 8 frames" }, { status: 400 });
  }

  // Build content array: alternating image blocks then a text instruction
  const imageBlocks = b.frames.map((f) => {
    const raw = typeof f === "string" ? f : f.data;
    const mimeType = typeof f === "string" ? "image/jpeg" : (f.mimeType || "image/jpeg");
    // Strip data URI prefix if present
    const base64 = raw.includes(",") ? raw.split(",")[1] : raw;
    return {
      type: "image",
      source: { type: "base64", media_type: mimeType, data: base64 },
    };
  });

  const cohort = b.cohort || "an unspecified athlete";
  const testHint = b.test_type ? ` This is a ${b.test_type} clip.` : "";
  const userText = `The athlete is ${cohort}.${testHint} Analyse these ${imageBlocks.length} sequential frames from their sprint. Return JSON only - no preamble, no explanation, just the JSON object specified in the system prompt.`;

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [...imageBlocks, { type: "text", text: userText }],
          },
        ],
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text().catch(() => "");
      return Response.json(
        { ok: false, error: `Anthropic API ${apiRes.status}: ${errText.slice(0, 300)}` },
        { status: 502 },
      );
    }

    const j = (await apiRes.json()) as {
      content?: Array<{ type: string; text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    const text = (j.content?.find((c) => c.type === "text")?.text || "").trim();

    // Extract JSON (Claude usually returns clean JSON but might wrap in markdown)
    let parsed: unknown = null;
    try {
      const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to find a JSON object inside the text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch { /* still failed */ }
      }
    }

    if (!parsed) {
      return Response.json(
        { ok: false, error: "Could not parse Claude response", raw: text.slice(0, 500) },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, analysis: parsed, usage: j.usage ?? null });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "vision call failed" },
      { status: 500 },
    );
  }
}
