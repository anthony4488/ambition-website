// Client-side form telemetry. Fires a Telegram alert when a user starts a form
// (so Anthony can see drop-offs vs completions). Completion alerts already fire
// via /api/notify-lead and /api/speed-audit — this fills the "they started but
// never finished" gap.
//
// Each event is de-duped per browser session per form so a single visitor never
// fires "started" twice for the same form.

const fired = new Set<string>();

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const existing = localStorage.getItem("asp_form_session_id");
  if (existing) return existing;
  const fresh = (crypto?.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  localStorage.setItem("asp_form_session_id", fresh);
  return fresh;
}

async function send(form_id: string, event: "started" | "step" | "completed", meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // Skip Vercel preview deploy UI / programmatic visitors
  if (navigator.webdriver) return;
  try {
    await fetch("/api/form-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: getSessionId(),
        form_id,
        event,
        meta: meta ?? {},
        page: window.location.pathname,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    });
  } catch {
    /* non-fatal */
  }
}

export function trackFormStart(form_id: string, meta?: Record<string, unknown>) {
  const key = `started:${form_id}`;
  if (fired.has(key)) return;
  fired.add(key);
  void send(form_id, "started", meta);
}

export function trackFormStep(form_id: string, step: number | string, meta?: Record<string, unknown>) {
  // Optional — for forms where Anthony wants drop-off granularity.
  const key = `step:${form_id}:${step}`;
  if (fired.has(key)) return;
  fired.add(key);
  void send(form_id, "step", { step, ...(meta ?? {}) });
}

export function trackFormComplete(form_id: string, meta?: Record<string, unknown>) {
  const key = `completed:${form_id}`;
  if (fired.has(key)) return;
  fired.add(key);
  void send(form_id, "completed", meta);
}
