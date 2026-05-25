"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle, Clock, Shield, Zap } from "lucide-react";

type Program = "speed" | "football" | "online" | "waitlist";

interface EnquiryFormProps {
  source?: string;
  program?: Program;
}

const fieldLabel = "block text-xs uppercase tracking-[0.18em] font-bold text-gray-700 mb-2";
const inputClass =
  "w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none transition-all text-sm";
const selectClass = `${inputClass} appearance-none cursor-pointer`;

type RadioOption = { value: string; label: string };

function RadioGroup({
  name,
  options,
  value,
  onChange,
  required = false,
}: {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex items-start gap-3 px-4 py-3.5 rounded-lg border cursor-pointer transition-all ${
              checked
                ? "border-accent bg-accent/[0.04] ring-2 ring-accent/20"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/60"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              required={required}
              className="sr-only"
            />
            <span
              className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                checked ? "border-accent" : "border-gray-300"
              }`}
            >
              {checked && <span className="w-2 h-2 rounded-full bg-accent" />}
            </span>
            <span className={`text-sm leading-snug ${checked ? "text-gray-900 font-semibold" : "text-gray-700"}`}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

const programCopy: Record<
  Program,
  { eyebrow: string; title: string; sub: string; successHeading: string; successBody: string; nextLine: string }
> = {
  speed: {
    eyebrow: "Apply For Speed School",
    title: "Limited intake. Apply now.",
    sub: "Capped groups. Specific feedback. We only take athletes ready to put the work in.",
    successHeading: "Application Received.",
    successBody:
      "We'll review your application within 24 hours. If you're the right fit, Anthony will be in touch to lock in your assessment date.",
    nextLine: "Keep your phone close — calls come from a Sydney number.",
  },
  football: {
    eyebrow: "Apply For Football School",
    title: "Capped at 12 per group. Apply now.",
    sub: "World-class benchmarked footballing program. Mornings, Mon–Thu, U11–U15 currently.",
    successHeading: "Application Received.",
    successBody:
      "We'll review your application within 24 hours. If your child is the right fit, Anthony will be in touch to lock in a trial session.",
    nextLine: "Keep your phone close — calls come from a Sydney number.",
  },
  online: {
    eyebrow: "Apply For Your Online Assessment",
    title: "Limited intake. Apply now.",
    sub: "We only take athletes we're confident we can move.",
    successHeading: "Application Received.",
    successBody:
      "We'll review your application within 24 hours. If you're the right fit, Anthony will be in touch to set up a quick call and lock in your $200 assessment.",
    nextLine: "Keep your phone close — calls come from a Sydney number.",
  },
  waitlist: {
    eyebrow: "Football School — Waitlist",
    title: "Join the waitlist.",
    sub: "Football School isn't open for full intake yet. Drop your details and you'll be first to hear when it opens.",
    successHeading: "You're On The List.",
    successBody:
      "We'll be in touch the moment Football School opens for its next intake. Until then — Speed School and Online Coaching are both open if you don't want to wait.",
    nextLine: "Watch your inbox.",
  },
};

export function EnquiryForm({ source = "website-contact", program = "online" }: EnquiryFormProps) {
  const copy = programCopy[program];
  const [opened, setOpened] = useState(false);

  const [form, setForm] = useState({
    // Shared
    name: "",
    email: "",
    phone: "",
    ageRange: "",

    // Speed + Football + Online
    state: "",

    // Speed-specific
    sportPosition: "",
    currentSpeed: "",
    speedGoal: "",
    sessionsPerWeek: "",

    // Football-specific
    currentClub: "",
    fbPosition: "",
    dominantFoot: "",
    fbLevel: "",
    fbGoal: "",
    fbSessions: "",

    // Online-specific
    onlineGoal: "",
    commitmentLevel: "",
    commitLength: "",
    athleteLevel: "",
    twelveMonthOutcome: "",

    // Shared catch-all
    notes: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  const validate = (): string => {
    if (!form.name.trim()) return "Please enter the athlete's full name.";
    if (!form.email.trim()) return "Please enter an email.";
    if (!form.phone.trim()) return "Please enter a phone number.";
    if (!form.ageRange) return "Please select an age range.";

    if (program === "speed") {
      if (!form.sportPosition.trim()) return "Please tell us the sport and position.";
      if (!form.speedGoal) return "Please select a goal.";
      if (!form.sessionsPerWeek) return "Please pick how many sessions per week you can commit to.";
      if (!form.state) return "Please select your state or country.";
    }
    if (program === "football") {
      if (!form.currentClub.trim()) return "Please enter the current club or team.";
      if (!form.fbPosition) return "Please select a position.";
      if (!form.dominantFoot) return "Please select dominant foot.";
      if (!form.fbLevel) return "Please select the athlete's current level.";
      if (!form.fbGoal) return "Please select a goal.";
      if (!form.fbSessions) return "Please pick a session commitment.";
    }
    if (program === "online") {
      if (!form.onlineGoal) return "Please select a goal.";
      if (!form.commitmentLevel) return "Please select a commitment level.";
      if (!form.commitLength) return "Please select a commitment length.";
      if (!form.state) return "Please select your state or country.";
      if (!form.athleteLevel.trim()) return "Please enter the athlete's current level.";
    }
    if (program === "waitlist") {
      // Waitlist only requires the basics — name/email/phone/age (already validated above)
    }
    return "";
  };

  const buildNotes = (): string => {
    const lines: string[] = [
      `Program: ${program.toUpperCase()}`,
      `Email: ${form.email}`,
      `Age range: ${form.ageRange}`,
    ];
    if (program === "speed") {
      lines.push(
        `Sport & position: ${form.sportPosition}`,
        `Current top speed: ${form.currentSpeed || "—"}`,
        `Goal: ${form.speedGoal}`,
        `Sessions per week: ${form.sessionsPerWeek}`,
        `State/Country: ${form.state}`,
      );
    }
    if (program === "football") {
      lines.push(
        `Current club: ${form.currentClub}`,
        `Position: ${form.fbPosition}`,
        `Dominant foot: ${form.dominantFoot}`,
        `Current level: ${form.fbLevel}`,
        `Goal: ${form.fbGoal}`,
        `Session commitment: ${form.fbSessions}`,
      );
    }
    if (program === "online") {
      lines.push(
        `Goal: ${form.onlineGoal}`,
        `Commitment level: ${form.commitmentLevel}`,
        `Commit length: ${form.commitLength}`,
        `State/Country: ${form.state}`,
        `Current speed: ${form.currentSpeed || "—"}`,
        `Athlete level: ${form.athleteLevel}`,
        `12-month outcome: ${form.twelveMonthOutcome || "—"}`,
      );
    }
    if (program === "waitlist") {
      lines.push(
        `Current club: ${form.currentClub || "—"}`,
        `Position: ${form.fbPosition || "—"}`,
      );
    }
    if (form.notes.trim()) lines.push(`Additional notes: ${form.notes}`);
    return lines.join(" | ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setStatus("submitting");

    try {
      if (supabase) {
        const { error: dbErr } = await supabase.from("assessment_leads").insert({
          name: form.name,
          phone: form.phone,
          source,
          notes: buildNotes(),
        });
        if (dbErr) throw dbErr;
      }

      fetch("/api/notify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          suburb: form.state || "",
          sport: program === "football" ? `Football · ${form.fbPosition}` : program === "speed" ? form.sportPosition : form.athleteLevel,
          age: form.ageRange,
          goal: program === "online" ? form.onlineGoal : program === "speed" ? form.speedGoal : form.fbGoal,
          budget: form.commitmentLevel || "",
          commit: form.commitLength || form.sessionsPerWeek || "",
          source,
          qualified: true,
        }),
      }).catch(() => {});

      router.push("/welcome?name=" + encodeURIComponent(form.name || "") + "&email=" + encodeURIComponent(form.email || "")); // nurture/booking page fires the Meta Pixel Lead
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-5">
          <CheckCircle size={32} className="text-green-500" strokeWidth={1.75} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {copy.successHeading}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-5">
          {copy.successBody}
        </p>
        <p className="text-xs text-gray-400 italic max-w-sm mx-auto">{copy.nextLine}</p>
      </div>
    );
  }

  if (!opened) {
    const isWaitlist = program === "waitlist";
    return (
      <div className="py-2">
        <button
          type="button"
          onClick={() => setOpened(true)}
          className="group w-full flex items-center justify-center gap-3 py-5 bg-accent text-white font-extrabold rounded-full hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30 transition-all text-sm uppercase tracking-[0.15em]"
        >
          {isWaitlist ? "Join The Waitlist" : "Start Application"}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-gray-500">
          {isWaitlist ? (
            <>
              <span className="flex items-center gap-1.5"><Clock size={13} className="text-accent" strokeWidth={2} /> 60 seconds</span>
              <span className="flex items-center gap-1.5"><Zap size={13} className="text-accent" strokeWidth={2} /> First-in-line on next intake</span>
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-accent" strokeWidth={2} /> No spam</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5"><Clock size={13} className="text-accent" strokeWidth={2} /> 3 minutes</span>
              <span className="flex items-center gap-1.5"><Zap size={13} className="text-accent" strokeWidth={2} /> Reviewed in 24h</span>
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-accent" strokeWidth={2} /> Free to apply</span>
            </>
          )}
        </div>
        <p className="text-center text-[11px] text-gray-400 italic mt-4">
          {isWaitlist
            ? "You'll hear directly when Football School opens for full intake."
            : "We only take athletes we're confident we can move. Limited intake."}
        </p>
      </div>
    );
  }

  // Age options vary slightly by program
  const ageOptions: RadioOption[] =
    program === "football" || program === "waitlist"
      ? [
          { value: "U11", label: "U11" },
          { value: "U12-U13", label: "U12–U13" },
          { value: "U14-U15", label: "U14–U15" },
          { value: "U16+", label: "U16+ / older" },
        ]
      : [
          { value: "Under 13", label: "Under 13" },
          { value: "13-15", label: "13–15" },
          { value: "15-17", label: "15–17" },
          { value: "17+", label: "17+" },
        ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* SHARED — Identity */}
      <div>
        <label className={fieldLabel} htmlFor="apply-name">
          {program === "football" ? "Athlete's Full Name" : "Full Name"} <span className="text-accent">*</span>
        </label>
        <input
          id="apply-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={fieldLabel} htmlFor="apply-email">
          Email <span className="text-accent">*</span>
        </label>
        <input
          id="apply-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={fieldLabel} htmlFor="apply-phone">
          Phone Number <span className="text-accent">*</span>
        </label>
        <input
          id="apply-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+61 4XX XXX XXX"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Age range */}
      <div>
        <label className={fieldLabel}>
          {program === "football" ? "Age group" : "How old is the athlete?"} <span className="text-accent">*</span>
        </label>
        <RadioGroup
          name="age_range"
          value={form.ageRange}
          onChange={(v) => setForm({ ...form, ageRange: v })}
          options={ageOptions}
        />
      </div>

      {/* SPEED-SPECIFIC */}
      {program === "speed" && (
        <>
          <div>
            <label className={fieldLabel} htmlFor="apply-sport">
              Sport & Position <span className="text-accent">*</span>
            </label>
            <input
              id="apply-sport"
              type="text"
              placeholder="e.g. Football · Winger, Rugby · Outside Back, Track · 100m"
              value={form.sportPosition}
              onChange={(e) => setForm({ ...form, sportPosition: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={fieldLabel} htmlFor="apply-speed-now">
              Current top speed or best time
              <span className="text-gray-400 font-normal normal-case ml-2 tracking-normal">(if known)</span>
            </label>
            <input
              id="apply-speed-now"
              type="text"
              placeholder="e.g. 28 km/h, 13.2s in 100m, or 'not tested yet'"
              value={form.currentSpeed}
              onChange={(e) => setForm({ ...form, currentSpeed: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              What&apos;s the result you want? <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="speed_goal"
              value={form.speedGoal}
              onChange={(v) => setForm({ ...form, speedGoal: v })}
              options={[
                { value: "Add 5+ km/h to top speed", label: "Add 5+ km/h to my top speed" },
                { value: "Win the first 5 metres", label: "Win the first 5 metres on the field" },
                { value: "Rebuild running mechanics", label: "Fix my running mechanics from the ground up" },
                { value: "Trial-ready", label: "Trial-ready for academy / state / national selection" },
                { value: "Pro prep", label: "Pro signing / transfer prep" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              Sessions per week you can commit to <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="sessions_per_week"
              value={form.sessionsPerWeek}
              onChange={(v) => setForm({ ...form, sessionsPerWeek: v })}
              options={[
                { value: "2 sessions/week", label: "2 sessions/week (minimum to see results)" },
                { value: "3-4 sessions/week", label: "3–4 sessions/week" },
                { value: "5+ sessions/week", label: "5+ sessions/week — full commitment" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel} htmlFor="apply-state">
              State or Country <span className="text-accent">*</span>
            </label>
            <select
              id="apply-state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className={selectClass}
            >
              <option value="">Select your state or country…</option>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="SA">SA</option>
              <option value="TAS">TAS</option>
              <option value="ACT">ACT</option>
              <option value="NT">NT</option>
              <option value="International (other)">International (other)</option>
            </select>
          </div>
        </>
      )}

      {/* FOOTBALL-SPECIFIC */}
      {program === "football" && (
        <>
          <div>
            <label className={fieldLabel} htmlFor="apply-club">
              Current club or team <span className="text-accent">*</span>
            </label>
            <input
              id="apply-club"
              type="text"
              placeholder="e.g. Sydney FC Academy U13, Bankstown City NPL, school team"
              value={form.currentClub}
              onChange={(e) => setForm({ ...form, currentClub: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              Position <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="fb_position"
              value={form.fbPosition}
              onChange={(v) => setForm({ ...form, fbPosition: v })}
              options={[
                { value: "Goalkeeper", label: "Goalkeeper" },
                { value: "Defender", label: "Defender (CB / Fullback / Wingback)" },
                { value: "Midfielder", label: "Midfielder (CDM / CM / CAM)" },
                { value: "Winger", label: "Winger" },
                { value: "Striker", label: "Striker / Forward" },
                { value: "Multiple positions", label: "Multiple positions" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              Dominant foot <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="dominant_foot"
              value={form.dominantFoot}
              onChange={(v) => setForm({ ...form, dominantFoot: v })}
              options={[
                { value: "Right", label: "Right" },
                { value: "Left", label: "Left" },
                { value: "Both (ambipedal)", label: "Both — comfortable on either foot" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              Current playing level <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="fb_level"
              value={form.fbLevel}
              onChange={(v) => setForm({ ...form, fbLevel: v })}
              options={[
                { value: "School football only", label: "School football only" },
                { value: "Local club", label: "Local club (district / division)" },
                { value: "Club representative", label: "Club representative team" },
                { value: "NPL / state league", label: "NPL / state league" },
                { value: "Academy / pathway", label: "Academy / pathway program" },
                { value: "International / professional", label: "International or professional" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              What&apos;s the goal? <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="fb_goal"
              value={form.fbGoal}
              onChange={(v) => setForm({ ...form, fbGoal: v })}
              options={[
                { value: "Make an academy / rep team", label: "Make an academy / rep team" },
                { value: "Get scouted / pathway", label: "Get scouted / play at the highest level" },
                { value: "Improve technical execution", label: "Improve technical execution & decision-making" },
                { value: "Speed, power & athleticism", label: "Get faster, stronger, more athletic" },
                { value: "All of the above — Total Footballer", label: "All of the above — Total Footballer" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              Session commitment <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="fb_sessions"
              value={form.fbSessions}
              onChange={(v) => setForm({ ...form, fbSessions: v })}
              options={[
                { value: "2x / week (minimum)", label: "2x / week (minimum for development)" },
                { value: "3-4x / week", label: "3–4x / week" },
                { value: "5-6x / week", label: "5–6x / week — full immersion" },
              ]}
            />
          </div>
        </>
      )}

      {/* WAITLIST-SPECIFIC (minimal — just enough to remember them) */}
      {program === "waitlist" && (
        <>
          <div>
            <label className={fieldLabel} htmlFor="apply-club">
              Current club or team
              <span className="text-gray-400 font-normal normal-case ml-2 tracking-normal">(optional)</span>
            </label>
            <input
              id="apply-club"
              type="text"
              placeholder="e.g. Sydney FC Academy U13, school team"
              value={form.currentClub}
              onChange={(e) => setForm({ ...form, currentClub: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              Position
              <span className="text-gray-400 font-normal normal-case ml-2 tracking-normal">(optional)</span>
            </label>
            <RadioGroup
              name="fb_position"
              value={form.fbPosition}
              onChange={(v) => setForm({ ...form, fbPosition: v })}
              options={[
                { value: "Goalkeeper", label: "Goalkeeper" },
                { value: "Defender", label: "Defender" },
                { value: "Midfielder", label: "Midfielder" },
                { value: "Winger", label: "Winger" },
                { value: "Striker", label: "Striker / Forward" },
                { value: "Multiple positions", label: "Multiple positions" },
              ]}
            />
          </div>
        </>
      )}

      {/* ONLINE-SPECIFIC */}
      {program === "online" && (
        <>
          <div>
            <label className={fieldLabel}>
              What&apos;s the goal? <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="online_goal"
              value={form.onlineGoal}
              onChange={(v) => setForm({ ...form, onlineGoal: v })}
              options={[
                { value: "Get scouted / play at the highest level", label: "Get scouted / play at the highest level" },
                { value: "Make a representative or academy team", label: "Make a representative or academy team" },
                { value: "Win at club / school level", label: "Win at club / school level" },
                { value: "Compete in track / sprinting", label: "Compete in track / sprinting" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              What level of commitment is right for the athlete? <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="commitment_level"
              value={form.commitmentLevel}
              onChange={(v) => setForm({ ...form, commitmentLevel: v })}
              options={[
                { value: "$130-150/week, 6+ months", label: "I'm ready to invest $130–150/week and commit 6+ months" },
                { value: "$150-180/week, 12+ months", label: "I'm ready to invest $150–180/week and commit 12+ months" },
                { value: "$180+/week, whatever it takes", label: "I'll invest whatever it takes — $180+/week is fine" },
                { value: "Not ready to invest at this level", label: "I'm not ready to invest at this level" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel}>
              How long are you willing to commit? <span className="text-accent">*</span>
            </label>
            <RadioGroup
              name="commit_length"
              value={form.commitLength}
              onChange={(v) => setForm({ ...form, commitLength: v })}
              options={[
                { value: "6-12 months minimum", label: "6–12 months minimum" },
                { value: "12+ months — whatever it takes", label: "12+ months — whatever it takes" },
              ]}
            />
          </div>

          <div>
            <label className={fieldLabel} htmlFor="apply-state">
              State or Country <span className="text-accent">*</span>
            </label>
            <select
              id="apply-state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className={selectClass}
            >
              <option value="">Select your state or country…</option>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="SA">SA</option>
              <option value="TAS">TAS</option>
              <option value="ACT">ACT</option>
              <option value="NT">NT</option>
              <option value="International (other)">International (other)</option>
            </select>
          </div>

          <div>
            <label className={fieldLabel} htmlFor="apply-speed-online">
              Current top speed or best time
              <span className="text-gray-400 font-normal normal-case ml-2 tracking-normal">(optional)</span>
            </label>
            <input
              id="apply-speed-online"
              type="text"
              placeholder="e.g. 28 km/h, 13.2s in 100m, or 'not sure'"
              value={form.currentSpeed}
              onChange={(e) => setForm({ ...form, currentSpeed: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={fieldLabel} htmlFor="apply-level">
              Current playing level <span className="text-accent">*</span>
            </label>
            <input
              id="apply-level"
              type="text"
              placeholder="e.g. NPL 1, U16 academy, state league, club rep"
              value={form.athleteLevel}
              onChange={(e) => setForm({ ...form, athleteLevel: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={fieldLabel} htmlFor="apply-outcome">
              In 12 months, what does success look like?
              <span className="text-gray-400 font-normal normal-case ml-2 tracking-normal">(optional)</span>
            </label>
            <textarea
              id="apply-outcome"
              rows={4}
              maxLength={500}
              placeholder="Optional — up to 500 characters."
              value={form.twelveMonthOutcome}
              onChange={(e) => setForm({ ...form, twelveMonthOutcome: e.target.value })}
              className={`${inputClass} resize-none`}
            />
            <p className="text-[11px] text-gray-400 mt-1.5 text-right">
              {form.twelveMonthOutcome.length} / 500
            </p>
          </div>
        </>
      )}

      {/* SHARED — Open notes (kept short, optional) */}
      <div>
        <label className={fieldLabel} htmlFor="apply-notes">
          Anything else we should know?
          <span className="text-gray-400 font-normal normal-case ml-2 tracking-normal">(optional)</span>
        </label>
        <textarea
          id="apply-notes"
          rows={3}
          placeholder="Injuries, school timetable, what you've tried that didn't work…"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group w-full flex items-center justify-center gap-3 py-5 bg-accent text-white font-extrabold rounded-full hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30 transition-all disabled:opacity-50 text-sm uppercase tracking-[0.15em]"
      >
        {status === "submitting"
          ? "Submitting…"
          : program === "waitlist"
          ? "Join Waitlist"
          : "Submit Application"}
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
      </button>

      {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
      {status === "error" && (
        <p className="text-red-500 text-xs text-center">
          Something went wrong. Please try again or email{" "}
          <a href="mailto:info@ambitionsportsperformance.com" className="underline">
            info@ambitionsportsperformance.com
          </a>{" "}
          directly.
        </p>
      )}

      <p className="text-[11px] text-gray-400 italic text-center pt-2 leading-relaxed">
        {copy.sub}
      </p>
    </form>
  );
}
