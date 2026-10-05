import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { unsubSig } from "@/lib/emailFlows";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams;
  const token = q.get("token");
  // Email-flow links (lib/emailFlows.ts) carry the address plus a signature instead of a row token.
  const e = q.get("e"), sig = q.get("s");
  if (e && sig && sig === unsubSig(e)) {
    try {
      await getSupabaseAdmin().from("nurture_enrollments").update({ status: "unsubscribed" }).eq("email", e.trim().toLowerCase()).eq("status", "active");
    } catch {
      /* ignore */
    }
  }
  if (token) {
    try {
      const sb = getSupabaseAdmin();
      await sb.from("nurture_enrollments").update({ status: "unsubscribed" }).eq("unsubscribe_token", token);
    } catch {
      /* ignore */
    }
  }
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed</title></head>
     <body style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#fff;color:#1a1a1a;display:grid;place-items:center;min-height:100vh;margin:0">
       <div style="text-align:center;max-width:420px;padding:24px">
         <div style="font-size:40px">✅</div>
         <h1 style="font-size:22px;margin:12px 0">You're unsubscribed</h1>
         <p style="color:#666">You won't get any more follow-ups. If your athlete's still serious about getting faster, you can always apply again at
           <a href="https://ambitionsportsperformance.com/apply" style="color:#FF8C42">ambitionsportsperformance.com/apply</a>.</p>
       </div>
     </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
