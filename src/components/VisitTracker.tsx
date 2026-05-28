"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Pages worth an immediate "high intent" ping (one per session each).
const HIGH_INTENT = ["/apply"];

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/visit", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* best-effort */
  }
}

function getUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      source: p.get("utm_source") || "",
      medium: p.get("utm_medium") || "",
      campaign: p.get("utm_campaign") || "",
    };
  } catch {
    return {};
  }
}

export function VisitTracker() {
  const pathname = usePathname();

  // New-session ping — fires once per browser session.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("asp_visit")) {
        sessionStorage.setItem("asp_visit", "1");
        send({
          type: "new_session",
          path: window.location.pathname,
          referrer: document.referrer || "",
          utm: getUtm(),
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // High-intent ping — once per high-intent page per session.
  useEffect(() => {
    if (!pathname || !HIGH_INTENT.includes(pathname)) return;
    try {
      const key = `asp_hi_${pathname}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        send({
          type: "high_intent",
          path: pathname,
          referrer: document.referrer || "",
          utm: getUtm(),
        });
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
