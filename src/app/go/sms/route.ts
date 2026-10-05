import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// One tap from a Telegram card to Messages with the text already typed (Telegram buttons can only open http(s)
// links, so this page hands over to sms:). It sends from Anthony's own number and shows in his Messages app.
//   /go/sms?to=+61400000000&body=...
export async function GET(req: NextRequest) {
  const to = (req.nextUrl.searchParams.get("to") || "").replace(/[^\d+]/g, "");
  const body = req.nextUrl.searchParams.get("body") || "";
  // iOS reads "sms:<number>&body=", Android "sms:<number>?body="; the user agent picks
  const ios = /iPhone|iPad|iPod/i.test(req.headers.get("user-agent") || "");
  const href = `sms:${to}${ios ? "&" : "?"}body=${encodeURIComponent(body)}`;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Open Messages</title><meta http-equiv="refresh" content="0;url=${esc(href)}"></head>
<body style="font-family:-apple-system,sans-serif;padding:32px;text-align:center;background:#111;color:#fff">
<p>Opening Messages…</p><p><a href="${esc(href)}" style="display:inline-block;padding:14px 22px;background:#FF8C42;color:#111;border-radius:12px;font-weight:700;text-decoration:none">Tap to open Messages</a></p>
<script>location.href=${JSON.stringify(href)}</script></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );
}
