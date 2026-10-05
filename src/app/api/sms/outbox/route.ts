import { NextRequest } from "next/server";
import { pendingTexts, markTextSent } from "@/lib/smsOutbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// Read by Anthony's iPhone Shortcut (lib/smsOutbox.ts). GET only, so the Shortcut needs nothing but "Get Contents
// of URL":
//   /api/sms/outbox?key=K                 -> { messages: [{ id, to, body }] }
//   /api/sms/outbox?key=K&done=<id>       -> ticks one off after the phone sent it
// K = SMS_OUTBOX_KEY. Fails closed without it.
export async function GET(req: NextRequest) {
  const key = process.env.SMS_OUTBOX_KEY;
  const q = req.nextUrl.searchParams;
  if (!key || q.get("key") !== key) return Response.json({ error: "forbidden" }, { status: 403 });
  const done = q.get("done");
  if (done) {
    await markTextSent(done);
    return Response.json({ ok: true });
  }
  try {
    return Response.json({ messages: await pendingTexts() }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    return Response.json({ messages: [], error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
