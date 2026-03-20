"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/speed-school", label: "Speed School" },
  { href: "/football-school", label: "Football School" },
  { href: "/online-coaching", label: "Online Coaching" },
  { href: "/success-stories", label: "Results" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] sm:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Ambition Sports Performance"
              width={160}
              height={40}
              className={`h-9 sm:h-10 w-auto transition-all duration-300 ${
                scrolled ? "" : "brightness-0 invert"
              }`}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-[13px] uppercase tracking-[0.1em] transition-colors ${
                  pathname === link.href
                    ? "text-accent"
                    : scrolled
                    ? "text-gray-500 hover:text-gray-900"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 px-6 py-2.5 bg-accent text-white text-[13px] font-bold uppercase tracking-[0.1em] rounded-full hover:bg-orange-500 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
            >
              Apply
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? "text-gray-600" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-1">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3.5 text-sm uppercase tracking-[0.1em] transition-all rounded-lg ${
                  pathname === link.href
                    ? "text-accent bg-orange-50 font-semibold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block mt-4 px-4 py-3.5 bg-accent text-white text-sm font-bold uppercase tracking-[0.1em] rounded-full text-center hover:bg-orange-500 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
