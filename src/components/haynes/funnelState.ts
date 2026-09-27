// Carries the opt-in (name, email, ad attribution) from the landing page to the
// application page. sessionStorage, so it survives the navigation but never
// outlives the tab. Every access is guarded: private windows can throw.

export const TRACKED = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "fbclid", "gclid", "ad_id", "adset_id", "campaign_id",
] as const;

export type FunnelState = { name: string; email: string; utm: Record<string, string> };

const KEY = "asp_apply_v2";

export function saveFunnel(s: FunnelState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private window: the application just asks again */
  }
}

export function loadFunnel(): FunnelState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FunnelState) : null;
  } catch {
    return null;
  }
}
