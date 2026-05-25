"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// If someone lands on /speed-school#apply (e.g. an existing ad link), send them
// straight to the strict /apply questionnaire.
export function ApplyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#apply") {
      router.replace("/apply");
    }
  }, [router]);
  return null;
}
