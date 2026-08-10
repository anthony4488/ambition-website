"use client";

import { useState } from "react";
import Image from "next/image";

// Read-only Terms & Conditions reference page. Payment = acceptance, no form,
// no e-signature. Content stored as HTML strings so <strong> emphasis is preserved.
type Block = { k: "p" | "clause" | "sub" | "highlight"; html: string };
type Section = { n: number; name: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    n: 1,
    name: "Program Structure",
    blocks: [
      { k: "p", html: "Ambition Sports Performance offers two program formats, <strong>in-person coaching</strong> and <strong>online programming</strong> (Section 2), and these terms cover both. Our in-person program includes:" },
      { k: "clause", html: "• One face-to-face session per week in a small group of 4 to 7 athletes, following a specific merit and progressive model designed to produce measurable results" },
      { k: "clause", html: "• Full online programming, mentoring, and ongoing monitoring delivered through a dedicated WhatsApp chat" },
      { k: "clause", html: "• Weekly video feedback: athlete sends through videos of programmed work for review of technique and execution" },
      { k: "highlight", html: "<strong>The client acknowledges that the program is a complete system. The online programming and WhatsApp engagement are integral components, not optional extras.</strong>" },
    ],
  },
  {
    n: 2,
    name: "Online Programming",
    blocks: [
      { k: "p", html: "For athletes coached remotely, the online program is a complete coaching system delivered to your phone:" },
      { k: "clause", html: "2.1 The online program delivers individualised remote programming, mentoring, and ongoing monitoring through a dedicated WhatsApp chat, built on the same merit-based, progressive model as our in-person coaching." },
      { k: "clause", html: "2.2 Programming is tailored to the athlete's assessment, goals, and available equipment and environment. The athlete is responsible for executing the programmed work and sending weekly videos of key sessions for technique review and adjustment." },
      { k: "clause", html: "2.3 Online programs run in agreed blocks (for example, a 30-week program) and are paid in full prior to commencement, in line with the Payment Terms below." },
      { k: "clause", html: "2.4 Coaching feedback and programming updates are provided within a reasonable turnaround on business days. The online program is ongoing structured support, not a 24/7 on-call service." },
      { k: "clause", html: "2.5 Results depend on consistent adherence to the program and engagement with feedback. No specific outcome is guaranteed." },
      { k: "clause", html: "2.6 If the athlete cannot train due to illness or injury, programming is adjusted to accommodate recovery and continues at no additional cost (see Illness & Injury)." },
    ],
  },
  {
    n: 3,
    name: "Payment Terms",
    blocks: [
      { k: "clause", html: "3.1 In-person training is delivered in block periods, and online programs in agreed blocks, both paid in full prior to commencement. Coaching will not commence until payment is completed." },
      { k: "clause", html: "3.2 Payment covers the agreed number of sessions or the agreed program at the agreed rate. Payment structure and amount will be confirmed in writing prior to commencement." },
      { k: "clause", html: "3.3 <strong>No refunds will be issued on block or program payments under any circumstances.</strong> All payments are final." },
      { k: "clause", html: "3.4 If sessions within a block are delivered as group sessions instead of individual sessions (where applicable), the price difference will be credited forward to the next block." },
      { k: "clause", html: "3.5 Assessment fee ($199) is payable prior to the assessment session. Assessment will not proceed without payment." },
      { k: "clause", html: "3.6 Pricing may be adjusted between block periods. The new rate will be confirmed in writing before the next block commences." },
      { k: "clause", html: "3.7 Where multiple athletes are covered under a single payment, illness or injury policies apply per athlete, not per block." },
    ],
  },
  {
    n: 4,
    name: "Cancellation & Rescheduling",
    blocks: [
      { k: "clause", html: "4.1 A minimum of <strong>24 hours notice</strong> is required to cancel or reschedule any session." },
      { k: "clause", html: "4.2 If 24 hours notice is provided, the session will be credited and rolled over to the following week." },
      { k: "clause", html: "4.3 If 24 hours notice is <strong>not</strong> provided, a <strong>$55 surcharge</strong> applies. The session is forfeited and will not be credited." },
      { k: "clause", html: "4.4 No-shows (no notice provided): the session is charged in full with no credit, no reschedule, and no refund." },
      { k: "clause", html: "4.5 We operate out of public facilities and require adequate notice to adjust session rosters and accommodate other athletes." },
      { k: "clause", html: "4.6 Credited sessions must be used within 4 weeks of the original session date. A maximum of 2 credited sessions can be held at any time. Unused credits beyond this will expire." },
      { k: "clause", html: "4.7 Sessions start and finish at the scheduled time. Late arrivals will not receive extended session time." },
    ],
  },
  {
    n: 5,
    name: "Illness & Injury",
    blocks: [
      { k: "clause", html: "5.1 If an athlete is unable to attend due to illness, a medical certificate or doctor's note must be provided within 48 hours. The late cancellation surcharge will be waived and the session credited forward." },
      { k: "clause", html: "5.2 In the event of injury requiring extended absence:" },
      { k: "sub", html: "a) A medical certificate must be provided" },
      { k: "sub", html: "b) Remaining face-to-face sessions will be <strong>frozen and credited forward</strong> for up to 12 weeks from the date of the last completed session" },
      { k: "sub", html: "c) Online programming will be adjusted to accommodate the injury and continues during recovery at no additional cost" },
      { k: "sub", html: "d) No refunds will be issued. Credits expire after 12 weeks if not utilised" },
      { k: "clause", html: "5.3 Without a medical certificate, standard cancellation terms (Section 4) apply." },
    ],
  },
  {
    n: 6,
    name: "Session Conduct",
    blocks: [
      { k: "clause", html: "6.1 Athletes must bring appropriate footwear (running shoes and football boots) and water to every session." },
      { k: "clause", html: "6.2 The designated coach is the sole coaching voice during face-to-face sessions. Parent/guardian input from the sideline is not permitted during training." },
      { k: "clause", html: "6.3 Parents/guardians are welcome to observe from a minimum distance of 20 metres from the training area." },
    ],
  },
  {
    n: 7,
    name: "Communication & Feedback",
    blocks: [
      { k: "clause", html: "7.1 A dedicated WhatsApp chat is set up for ongoing programming, mentoring, and feedback." },
      { k: "clause", html: "7.2 Athletes are expected to send weekly training videos through the WhatsApp chat for technique review." },
      { k: "clause", html: "7.3 Training reminders will be sent the day prior to each session." },
    ],
  },
  {
    n: 8,
    name: "Privacy & Media",
    blocks: [
      { k: "clause", html: "8.1 All assessment videos and reports are stored privately and will not be shared publicly without written consent." },
      { k: "clause", html: "8.2 Training footage may be recorded for coaching and analysis purposes only." },
    ],
  },
  {
    n: 9,
    name: "Termination",
    blocks: [
      { k: "clause", html: "9.1 Either party may terminate this agreement at the end of a completed block or program period." },
      { k: "clause", html: "9.2 Early termination by the client does not entitle a refund of any remaining sessions or programming in the current block." },
      { k: "clause", html: "9.3 Ambition Sports Performance reserves the right to terminate this agreement if the client repeatedly fails to adhere to these terms." },
      { k: "clause", html: "9.4 Any disputes regarding charges or policy application should be raised in writing within 7 days of the charge or incident in question." },
    ],
  },
  {
    n: 10,
    name: "Wet Weather Policy",
    blocks: [
      { k: "clause", html: "10.1 In the event of wet weather, sessions may be relocated to an alternative indoor or covered venue." },
      { k: "clause", html: "10.2 Location changes will be communicated as early as possible, with confirmation by 2:45 PM on the day of training." },
      { k: "clause", html: "10.3 If an alternative venue requires a facility entry fee, this is payable by the client on arrival and is separate from the session fee." },
      { k: "clause", html: "10.4 If a session is cancelled due to weather with no alternative venue available, the session will be credited and rolled over." },
    ],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
.terms-page { --black:#0a0a0a; --dark:#1a1a1a; --orange:#d4892b; --orange-light:#e9a84c; --white:#fff; --gray-300:#ccc; --gray-500:#888; --gray-700:#444; }
.terms-page * { margin:0; padding:0; box-sizing:border-box; }
.terms-page { font-family:'DM Sans',-apple-system,'Segoe UI',Roboto,sans-serif; background:var(--black); color:var(--white); min-height:100vh; -webkit-font-smoothing:antialiased; }
.t-header { background:var(--dark); border-bottom:3px solid var(--orange); padding:28px 20px 26px; text-align:center; }
.t-logo-badge { display:inline-block; background:#fff; padding:10px 16px; border-radius:16px; box-shadow:0 4px 16px rgba(0,0,0,.35); margin-bottom:18px; }
.t-logo { height:54px; width:auto; display:block; }
.t-header h1 { font-family:'Bebas Neue',sans-serif; font-size:34px; letter-spacing:3px; color:var(--white); line-height:1; }
.t-abn { font-size:11px; color:var(--orange); letter-spacing:1.5px; text-transform:uppercase; margin-top:8px; }
.t-intro { max-width:560px; margin:18px auto 0; font-size:13.5px; line-height:1.6; color:var(--gray-300); }
.t-container { max-width:720px; margin:0 auto; padding:24px 16px 56px; }
.t-expand { font-size:12px; color:var(--orange); cursor:pointer; text-align:right; margin-bottom:12px; text-decoration:underline; user-select:none; }
.t-card { background:var(--dark); border:1px solid var(--gray-700); border-radius:10px; padding:18px 20px; margin-bottom:12px; transition:border-color .2s; }
.t-card:hover { border-color:var(--gray-500); }
.t-card-head { display:flex; align-items:center; gap:12px; cursor:pointer; user-select:none; }
.t-num { width:28px; height:28px; background:var(--orange); color:var(--black); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; flex-shrink:0; }
.t-name { font-weight:700; font-size:14.5px; color:var(--white); letter-spacing:.3px; }
.t-chev { margin-left:auto; color:var(--gray-500); transition:transform .2s; font-size:16px; }
.t-card.open .t-chev { transform:rotate(180deg); }
.t-content { font-size:13.5px; line-height:1.75; color:var(--gray-300); margin-top:14px; }
.t-content p { margin-bottom:9px; }
.t-clause { padding-left:4px; }
.t-sub { padding-left:22px; margin-bottom:5px; }
.t-content strong { color:var(--white); }
.t-highlight { background:rgba(212,137,43,0.1); border-left:3px solid var(--orange); padding:13px 15px; margin-top:6px; border-radius:0 6px 6px 0; font-size:12.5px; line-height:1.6; color:var(--white); }
.t-footer { margin-top:32px; padding-top:24px; border-top:1px solid var(--gray-700); text-align:center; }
.t-footer-accept { font-size:13px; line-height:1.6; color:var(--white); max-width:520px; margin:0 auto 14px; }
.t-updated { font-size:11px; color:var(--gray-500); letter-spacing:1px; text-transform:uppercase; margin-bottom:14px; }
.t-links { font-size:13px; color:var(--gray-300); }
.t-links a { color:var(--orange); text-decoration:none; }
.t-links a:hover { text-decoration:underline; }
.t-dot { color:var(--gray-700); margin:0 8px; }
@media (max-width:480px) { .t-header h1 { font-size:28px; } .t-container { padding:20px 14px 44px; } }
`;

export function TermsAgreement() {
  const [open, setOpen] = useState<number[]>([]);
  const allOpen = open.length === SECTIONS.length;

  const toggle = (n: number) =>
    setOpen((o) => (o.includes(n) ? o.filter((x) => x !== n) : [...o, n]));

  return (
    <div className="terms-page">
      <style>{CSS}</style>

      <div className="t-header">
        <span className="t-logo-badge">
          <Image src="/logo.png" alt="Ambition Sports Performance" width={248} height={155} className="t-logo" priority />
        </span>
        <h1>Terms &amp; Conditions</h1>
        <p className="t-abn">Ambition Sports Performance · ABN 93 770 726 815</p>
        <p className="t-intro">
          By completing payment for any Ambition Sports Performance service, you agree to the following terms and
          conditions. They&apos;re here so we&apos;re all on the same page about how we operate.
        </p>
      </div>

      <div className="t-container">
        <div className="t-expand" onClick={() => setOpen(allOpen ? [] : SECTIONS.map((s) => s.n))}>
          {allOpen ? "Collapse all" : "Expand all"}
        </div>

        {SECTIONS.map((sec) => {
          const isOpen = open.includes(sec.n);
          return (
            <div key={sec.n} className={"t-card" + (isOpen ? " open" : "")}>
              <div className="t-card-head" onClick={() => toggle(sec.n)}>
                <div className="t-num">{sec.n}</div>
                <div className="t-name">{sec.name}</div>
                <div className="t-chev">▼</div>
              </div>
              {isOpen && (
                <div className="t-content">
                  {sec.blocks.map((blk, i) =>
                    blk.k === "highlight" ? (
                      <div key={i} className="t-highlight" dangerouslySetInnerHTML={{ __html: blk.html }} />
                    ) : (
                      <p
                        key={i}
                        className={blk.k === "clause" ? "t-clause" : blk.k === "sub" ? "t-sub" : ""}
                        dangerouslySetInnerHTML={{ __html: blk.html }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="t-footer">
          <p className="t-footer-accept">
            By completing payment for any Ambition Sports Performance service, you acknowledge and agree to the terms above.
          </p>
          <p className="t-updated">Last updated: May 2026</p>
          <p className="t-links">
            <a href="https://instagram.com/ambitionsportsperformance" target="_blank" rel="noopener noreferrer">
              @ambitionsportsperformance
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
