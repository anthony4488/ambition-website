"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Youtube, Mail } from "lucide-react";

const navLinks = [
  { href: "/speed-school", label: "Speed School" },
  { href: "/football-school", label: "Football School" },
  { href: "/online-coaching", label: "Online Coaching" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const pathname = usePathname();
  if (["/apply", "/welcome"].includes(pathname)) return null;
  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="inline-block rounded-2xl bg-white p-4 mb-5 shadow-md">
              <Image
                src="/logo.png"
                alt="Ambition Sports Performance"
                width={248}
                height={155}
                className="h-16 w-auto"
              />
            </div>
            <p className="mt-2 text-sm text-gray-400 max-w-sm leading-relaxed">
              World-class speed development for athletes at every level.
              Sydney-based, globally recognised.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/ambitionsportsperformance"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/30 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.youtube.com/@AmbitionSportsPerformance"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/30 transition-all"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-5">Programs</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-5">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:info@ambitionsportsperformance.com" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail size={14} /> info@ambitionsportsperformance.com
              </a>
            </div>

            {/* Follow us callout */}
            <div className="mt-8 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] mb-2 font-semibold">Follow the journey</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Training content, athlete transformations, and behind-the-scenes on our socials.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] text-gray-600 uppercase tracking-[0.15em]">
            &copy; {new Date().getFullYear()} Ambition Sports Performance
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.15em]">
            <Link href="/privacy" className="text-gray-600 hover:text-accent transition-colors">
              Privacy
            </Link>
            <span className="text-gray-800">·</span>
            <Link href="/terms" className="text-gray-600 hover:text-accent transition-colors">
              Terms &amp; Session Policy
            </Link>
            <span className="text-gray-800">·</span>
            <span className="text-gray-700">Sydney, Australia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
