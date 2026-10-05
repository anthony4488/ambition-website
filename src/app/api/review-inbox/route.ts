import { NextRequest } from "next/server";
import { listReviewNotes } from "@/lib/reviewInbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Claude's machine reads Anthony's Telegram review notes here (lib/reviewInbox.ts). Shared secret
// REVIEW_INBOX_SECRET; fails closed. ?since=<iso> lists notes; ?file=<telegram file_id> streams the audio.
export async function GET(req: NextRequest) {
  const secret = process.env.REVIEW_INBOX_SECRET;
  if (!secret || req.headers.get("x-inbox-secret") !== secret) return Response.json({ error: "forbidden" }, { status: 403 });
  const file = req.nextUrl.searchParams.get("file");
  if (file) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const f = (await (await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(file)}`)).json()) as { result?: { file_path?: string } };
    if (!f.result?.file_path) return Response.json({ error: "file not found" }, { status: 404 });
    const audio = await fetch(`https://api.telegram.org/file/bot${token}/${f.result.file_path}`);
    return new Response(audio.body, { headers: { "content-type": audio.headers.get("content-type") || "audio/ogg" } });
  }
  return Response.json({ notes: await listReviewNotes(req.nextUrl.searchParams.get("since") || undefined) });
}
