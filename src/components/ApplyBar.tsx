"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";

/**
 * Sticky "applications are open" bar shown site-wide.
 *
 * Ads currently land on the homepage, so most visitors never reach a page that
 * has an application form on it. This bar keeps the fast path one tap away on
 * every page and spells out what happens after they apply, so an urgent parent
 * or athlete doesn't have to go hunting for the entry point.
 *
 * Hidden on legal/admin/post-application pages and on the pages that *are* the
 * application (/contact picks the program, /apply is the form itself).
 */
const HIDDEN_EXACT = ["/contact", "/apply", "/welcome", "/agreement", "/privacy", "/terms",
  // Falcon is a paid checkout funnel — a $199 assessment bar competing with a
  // $175 buy button costs more than it earns.
  "/falcon", "/falcon/sent"];
const HIDDEN_PREFIX = ["/admin"];

const DISMISS_KEY = "asp_apply_bar_dismissed";

/** Ad params we must not clobber; if any are present we forward the whole query
 *  string to /apply untouched so Meta attribution survives the extra hop. */
const AD_PARAMS = ["utm_source", "fbclid", "gclid", "ad_id", "campaign_id"];

export function ApplyBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until storage is read (no SSR flash)
  const [href, setHref] = useState("/apply");
  const barRef = useRef<HTMLDivElement | null>(null);

  const hidden =
    HIDDEN_EXACT.includes(pathname) || HIDDEN_PREFIX.some((p) => pathname.startsWith(p));

  // Read the dismissal once per tab.
  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false); // private mode / storage blocked, still show the bar
    }
  }, []);

  // Build the apply link, preserving ad attribution when it exists.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (!AD_PARAMS.some((k) => sp.has(k))) {
      sp.set("utm_source", "site");
      sp.set("utm_medium", "apply_bar");
      sp.set("utm_content", pathname);
    }
    setHref(`/apply?${sp.toString()}`);
  }, [pathname]);

  // Reveal on first scroll, or after a beat if they never scroll.
  useEffect(() => {
    if (hidden || dismissed) return;
    const show = () => setVisible(true);
    const timer = setTimeout(show, 1400);
    window.addEventListener("scroll", show, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", show);
    };
  }, [hidden, dismissed]);

  // Keep the footer clear of the bar. The height is measured rather than
  // assumed: a fixed 104px was right on a wide screen but ~50px short on a
  // phone, where the CTA wraps onto its own line and the headline runs to two,
  // leaving the bar sitting over the end of the footer.
  useEffect(() => {
    if (!visible) return;
    const el = barRef.current;
    if (!el) return;

    const apply = () => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`;
    };
    apply();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
    ro?.observe(el);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  const close = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage blocked, bar returns next page view */
    }
  };

  if (hidden || dismissed) return null;

  return (
    <div
      ref={barRef}
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      role="region"
      aria-label="Applications open for speed training"
    >
      <div className="border-t border-white/10 bg-gray-950/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.35)]">
        {/* On phones the CTA wraps onto its own full-width line (order-3) so the
            copy never gets squeezed into a three-line column. */}
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-3.5 sm:flex-nowrap sm:px-6 sm:py-4 lg:px-8">
          <div className="order-1 min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Intake Open
            </p>
            <p className="mt-1 text-sm font-extrabold leading-snug text-white sm:text-base">
              Applications are open for speed training.
            </p>
            {/* The three-step line only fits on one row from lg up. Between
                640px and 1024px it wrapped and pushed the bar taller, so the
                short version covers tablets as well as phones. */}
            <p className="mt-0.5 hidden text-xs text-gray-400 lg:block">
              <span className="font-semibold text-gray-300">1.</span> Apply in 2 minutes
              <span className="mx-2 text-gray-600">→</span>
              <span className="font-semibold text-gray-300">2.</span> We review and call you within 24 hours
              <span className="mx-2 text-gray-600">→</span>
              <span className="font-semibold text-gray-300">3.</span> Book your assessment
            </p>
            <p className="mt-0.5 text-xs text-gray-400 lg:hidden">
              2-minute form · we call within 24 hours
            </p>
          </div>

          <Link
            href={href}
            className="group order-3 flex w-full shrink-0 basis-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-accent/25 sm:order-2 sm:w-auto sm:basis-auto sm:px-7 sm:text-[13px]"
          >
            Apply Now
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>

          <button
            onClick={close}
            aria-label="Dismiss"
            className="order-2 shrink-0 self-start rounded-full p-1.5 text-gray-500 transition-colors hover:bg-white/5 hover:text-white sm:order-3 sm:self-center"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
