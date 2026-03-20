import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTASection({
  title = "Ready to get faster?",
  description = "Apply for a free assessment and discover what's holding your speed back.",
  buttonText = "Apply Now",
  buttonHref = "/contact",
}: CTASectionProps) {
  return (
    <section className="relative py-28 sm:py-36 bg-gradient-to-br from-gray-900 via-gray-900 to-dark-200 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 animate-gradient-shift" style={{ backgroundSize: "200% 200%" }} />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-float" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="accent-line mx-auto mb-8" />
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-gray-400 mb-12 text-lg sm:text-xl max-w-xl mx-auto">{description}</p>
        <Link
          href={buttonHref}
          className="group inline-flex items-center gap-3 px-10 py-5 bg-accent text-white font-bold rounded-full hover:bg-orange-500 transition-all text-base uppercase tracking-wider animate-pulse-glow hover:scale-105"
        >
          {buttonText}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
