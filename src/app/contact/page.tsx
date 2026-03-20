import { Metadata } from "next";
import { Section } from "@/components/Section";
import { EnquiryForm } from "@/components/EnquiryForm";
import { FadeIn } from "@/components/FadeIn";
import { MapPin, Clock, Mail, Phone, Instagram, Youtube } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Ambition Sports Performance",
  description: "Apply for a speed assessment. Sydney locations with online coaching worldwide.",
};

const locations = [
  { name: "Georges Hall", address: "Crest Soccer Fields, Georges Hall NSW 2198", sessions: "Mon-Fri: 3:30-8:45 PM — Sat-Sun: 10:20 AM-3:35 PM" },
  { name: "Eastern Suburbs (Bondi)", address: "Reg Bartley Oval, Rushcutters Bay NSW 2011", sessions: "Mon-Fri: 3:30-8:45 PM — Sat-Sun: 10:20 AM-3:35 PM" },
  { name: "Strathfield Park", address: "Strathfield Park, Inner West Sydney", sessions: "Mon-Fri: 3:30-8:45 PM — Sat-Sun: 10:20 AM-3:35 PM" },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "info@ambitionsportsperformance.com", href: "mailto:info@ambitionsportsperformance.com" },
  { icon: Phone, label: "Phone", value: "+61 450 205 033", href: "tel:+61450205033" },
  { icon: Instagram, label: "Instagram", value: "@ambitionsportsperformance", href: "https://www.instagram.com/ambitionsportsperformance" },
  { icon: Youtube, label: "YouTube", value: "Ambition Sports Performance", href: "https://www.youtube.com/@AmbitionSportsPerformance" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn><div className="accent-line mb-6" /></FadeIn>
          <FadeIn delay={100}><h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">Get in touch.</h1></FadeIn>
          <FadeIn delay={200}><p className="text-lg text-gray-300 max-w-lg leading-relaxed">Every week you train without knowing your limiters is a week of wasted potential. Fill out the form and we&apos;ll be in touch within 24 hours.</p></FadeIn>
        </div>
      </section>

      {/* Form + Info (white) */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-8">Apply for Training</h2>
                <EnquiryForm source="website-contact" />
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <FadeIn delay={100}>
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-5">Contact</h3>
                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <a key={info.label} href={info.href} target={info.href.startsWith("http") ? "_blank" : undefined} rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-start gap-3 group">
                      <info.icon size={16} className="text-gray-300 group-hover:text-accent transition-colors mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">{info.label}</p>
                        <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-5">Locations</h3>
                <div className="space-y-4">
                  {locations.map((loc) => (
                    <div key={loc.name} className="light-card rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-accent" strokeWidth={1.5} />
                        <h4 className="text-sm font-bold text-gray-900">{loc.name}</h4>
                      </div>
                      <p className="text-xs text-gray-400 mb-2 ml-5">{loc.address}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 ml-5">
                        <Clock size={11} className="text-gray-400" />
                        {loc.sessions}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>
    </>
  );
}
