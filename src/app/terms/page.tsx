import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Session Policy, Ambition Sports Performance",
  description: "The session, cancellation, and payment policies that apply to every athlete in the Ambition Sports Performance program.",
};

const sections = [
  {
    n: "01",
    title: "Application & Acceptance",
    body: [
      "All new athletes must apply through one of our published application forms, Speed School, Football School waitlist, or Online Coaching. We review every application within 24 hours.",
      "Acceptance into a programme is at our discretion. Where the fit isn't right, we'll say so honestly and decline the application, no chasing, no waitlists invented to make a sale.",
    ],
  },
  {
    n: "02",
    title: "Cancellation Policy",
    body: [
      "A minimum of 24 hours' notice is required for any change or cancellation to a scheduled session. This lets us keep session slots available for other athletes.",
      "If less than 24 hours' notice is provided and the cancellation does not fall under an approved exemption (see below), a $55 late-cancellation surcharge will be applied.",
    ],
    callout: true,
  },
  {
    n: "03",
    title: "Sickness & Approved Exemptions",
    body: [
      "We understand illness and genuine emergencies happen. If your child or athlete is unwell and cannot attend, the late-cancellation surcharge is waived provided a medical certificate or doctor's note is supplied within 48 hours of the missed session.",
      "Approved exemptions include: illness or injury with medical certificate; medical or emergency appointments (with proof); genuine family emergencies (assessed case by case).",
    ],
  },
  {
    n: "04",
    title: "No-Show Policy",
    body: [
      "If an athlete does not attend a scheduled session and no prior notice has been given, this is treated as a no-show. No-shows are charged in full and the session will not be credited or rescheduled.",
      "Repeated no-shows may result in the athlete's session slot being released to the waitlist.",
    ],
  },
  {
    n: "05",
    title: "Session Credits",
    body: [
      "If a session is cancelled with more than 24 hours' notice, or falls under an approved exemption with valid documentation, a credit is applied to your account. Credits can be used toward any future session and do not expire during an active training block.",
      "Credits are non-refundable and non-transferable.",
    ],
  },
  {
    n: "06",
    title: "Payment Terms",
    body: [
      "Programme pricing is reviewed and confirmed on a qualification call once we've confirmed the athlete is the right fit. We do not publish full programme pricing publicly.",
      "Multi-block programmes (such as the 30-week online programme) are paid in two blocks, one to begin, one at the halfway point.",
      "Payment is processed via secure third-party payment processors. We do not store full card details on our servers.",
    ],
  },
  {
    n: "07",
    title: "Refund Policy",
    body: [
      "$200 Online Assessment: full refund available within 14 days of purchase if no assessment data or report has been delivered. Once the report is delivered, the assessment is non-refundable.",
      "In-person assessments and sessions: bookings are non-refundable for change of mind or scheduling conflicts. Bookings can be rescheduled with a minimum of 24 hours notice. Missed sessions without notice forfeit the booking fee. Nothing in this policy limits your rights under Australian Consumer Law.",
      "In-person programmes (Speed School, Football School): all package sales are final. In the case of long-term injury or genuine relocation, unused weeks may be refunded at our discretion, less an administration fee.",
      "Refund requests should be sent to info@ambitionsportsperformance.com with the relevant documentation.",
    ],
  },
  {
    n: "08",
    title: "Media & Content Use",
    body: [
      "We routinely film and photograph training sessions for athlete review, coaching analysis, and marketing. By participating, you consent to the use of footage and stills for these purposes.",
      "If you do not consent to your image being used in marketing material, you must notify us in writing before your first session, we will respect the request and only use the footage internally for coaching.",
    ],
  },
  {
    n: "09",
    title: "Conduct & Safety",
    body: [
      "Athletes (and parents/guardians of minors) are expected to follow safety instructions, training protocols, and conduct standards at all times.",
      "We reserve the right to remove an athlete from a programme for behaviour that compromises the safety, focus, or wellbeing of other athletes or coaches. Where this occurs, no refund is owed for the remaining sessions.",
    ],
  },
  {
    n: "10",
    title: "Liability",
    body: [
      "Athletic training carries inherent risk of injury. By participating, you acknowledge this risk and accept responsibility for any injury sustained during a session, except where caused by our negligence.",
      "Athletes are required to disclose any pre-existing medical conditions before commencing the programme.",
    ],
  },
  {
    n: "11",
    title: "Acknowledgement",
    body: [
      "By booking and attending sessions with Ambition Sports Performance, or by purchasing any service offered by us, you acknowledge that you have read, understood, and agree to these terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Legal · Session Policy</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">Terms &amp; Session Policy</h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Structure. Accountability. Results. The session, cancellation, and payment policies that apply to every athlete in the programme.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Body */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-6 font-semibold">
              Effective Date: 20 May 2026
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="mb-12 p-5 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-sm text-gray-600 leading-relaxed">
                These terms exist to ensure consistency, fairness, and accountability across the programme, so every athlete gets the most out of their development. By applying, paying for, or attending any session with Ambition Sports Performance, you accept these terms.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-12">
            {sections.map((s) => (
              <FadeIn key={s.n}>
                <div>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-3xl font-black text-accent leading-none">{s.n}</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      {s.title}
                    </h2>
                  </div>
                  <div className="space-y-3 text-gray-600 leading-relaxed text-base pl-0 sm:pl-12">
                    {s.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    {s.callout && (
                      <div className="mt-4 p-4 bg-accent/5 border-l-4 border-accent rounded-r-lg flex items-start gap-3">
                        <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">
                          A $55 late-cancellation surcharge applies to any non-exempt cancellation made with less than 24 hours&apos; notice.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-16 pt-10 border-t border-gray-200 space-y-4">
              <p className="text-sm text-gray-500">
                See also our{" "}
                <Link href="/privacy" className="text-accent font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="text-sm text-gray-500">
                Questions about a specific clause? Email{" "}
                <a href="mailto:info@ambitionsportsperformance.com" className="text-accent font-semibold hover:underline">
                  info@ambitionsportsperformance.com
                </a>
                .
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
