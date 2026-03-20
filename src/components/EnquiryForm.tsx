"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle } from "lucide-react";

interface EnquiryFormProps {
  source?: string;
}

const inputClass =
  "w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none transition-all text-sm";

export function EnquiryForm({ source = "website-contact" }: EnquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    sport: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      if (supabase) {
        const { error } = await supabase.from("assessment_leads").insert({
          name: form.name,
          phone: form.phone,
          source,
          notes: `Age: ${form.age} | Sport: ${form.sport} | Message: ${form.message}`,
        });
        if (error) throw error;
      }

      fetch("/api/whatsapp-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          age: form.age,
          sport: form.sport,
        }),
      }).catch(() => {});

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (typeof window !== "undefined" && typeof w.fbq === "function") {
        w.fbq("track", "Lead", {
          content_name: "Website Enquiry",
          content_category: form.sport,
        });
      }

      setStatus("success");
      setForm({ name: "", phone: "", age: "", sport: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-12 text-center">
        <CheckCircle size={40} className="text-green-500 mx-auto mb-4" strokeWidth={1.5} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Application received!</h3>
        <p className="text-gray-500 text-sm">
          We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} className={inputClass} />
      </div>
      <textarea
        placeholder="Tell us about your goals..."
        rows={4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="group w-full flex items-center justify-center gap-3 py-4 bg-accent text-white font-bold rounded-full hover:bg-orange-500 transition-all disabled:opacity-50 text-sm uppercase tracking-wider"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
      {status === "error" && (
        <p className="text-red-500 text-xs text-center">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}
    </form>
  );
}
