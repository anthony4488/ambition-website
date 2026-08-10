import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Privacy Policy, Ambition Sports Performance",
  description: "How Ambition Sports Performance collects, uses, and protects your personal information.",
};

const sections = [
  {
    n: "01",
    title: "Who We Are",
    body: [
      "Ambition Sports Performance (\"we\", \"us\", \"our\") operates this website and the Speed School, Football School, and Online Coaching programs. We are based in Sydney, Australia.",
      "This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or apply for one of our programs.",
    ],
  },
  {
    n: "02",
    title: "Information We Collect",
    body: [
      "When you submit an application form, we collect: your full name, email address, phone number, age range, current playing level or sport, current club or team, training goals, and any additional notes you provide.",
      "We also automatically collect non-identifying technical data through analytics tools, browser type, device type, pages viewed, time on page, and approximate location based on IP address.",
    ],
  },
  {
    n: "03",
    title: "How We Use Your Information",
    body: [
      "We use your information to: (a) review your application and respond to your enquiry, (b) deliver assessments, reports, and coaching where you become a client, (c) send programme updates, training content, and offers, and (d) measure marketing performance so we keep improving the experience.",
      "We will never sell your personal information. We will never share it with third parties for their own marketing.",
    ],
  },
  {
    n: "04",
    title: "Service Providers We Use",
    body: [
      "We use trusted third-party services to operate this site and the programmes:",
      "• Supabase (database), stores your application data securely on AWS infrastructure.",
      "• Resend (email), sends transactional and marketing emails on our behalf.",
      "• Meta Pixel and Google Analytics, measure how the site performs and how ads reach the right people. These tools may set cookies on your device.",
      "• Bunny.net and YouTube, host the videos you watch on the site.",
      "Each provider has its own privacy policy and data-handling practices.",
    ],
  },
  {
    n: "05",
    title: "Cookies & Tracking",
    body: [
      "The site uses cookies and similar tracking technologies for analytics and advertising performance. You can disable cookies in your browser settings, though some features may stop working correctly.",
      "If you arrive via a paid advertisement (Meta, Google, TikTok), we may track that visit to measure ad performance.",
    ],
  },
  {
    n: "06",
    title: "Data Storage & Security",
    body: [
      "Your data is stored on secure servers operated by Supabase (AWS, US/EU regions). We use industry-standard encryption in transit (HTTPS) and at rest.",
      "We restrict access to your data to authorised personnel only, Anthony and any directly retained coaches or admin staff.",
    ],
  },
  {
    n: "07",
    title: "Your Rights",
    body: [
      "You can request a copy of the personal data we hold on you, ask us to correct it, or ask us to delete it. Email info@ambitionsportsperformance.com to make any of these requests and we'll action within 30 days.",
      "If you want to unsubscribe from marketing emails, use the unsubscribe link in any email or email us directly.",
    ],
  },
  {
    n: "08",
    title: "Children's Information",
    body: [
      "Many of our athletes are under 18. Where the athlete is a minor, the application must be submitted by a parent or legal guardian. The data we collect on the minor is limited to what's required to assess and coach the athlete.",
      "Parents/guardians can request to view or delete their child's data at any time.",
    ],
  },
  {
    n: "09",
    title: "Changes To This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The most current version will always be available at this URL. We'll note the effective date below.",
    ],
  },
  {
    n: "10",
    title: "Contact",
    body: [
      "Questions about this policy or how we handle your data? Email info@ambitionsportsperformance.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Legal</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">Privacy Policy</h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              How we collect, use, and protect your personal information.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Body */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-12 font-semibold">
              Effective Date: 20 May 2026
            </p>
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
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-16 pt-10 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                See also our{" "}
                <Link href="/terms" className="text-accent font-semibold hover:underline">
                  Terms &amp; Session Policy
                </Link>
                .
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
