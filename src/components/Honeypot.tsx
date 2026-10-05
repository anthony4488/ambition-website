// Honeypot (security check 2026-10-03): a field people never see. Bots fill in every input; anything typed here
// makes /api/notify-lead quietly drop the submission (src/lib/guard.ts isBot). Off-screen, not display:none,
// because some bots skip hidden inputs.
export const HONEYPOT_ID = "hp-company-website";

export function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor={HONEYPOT_ID}>Company website</label>
      <input id={HONEYPOT_ID} name="company_website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

export const honeypotValue = () =>
  typeof document === "undefined" ? "" : ((document.getElementById(HONEYPOT_ID) as HTMLInputElement | null)?.value ?? "");
