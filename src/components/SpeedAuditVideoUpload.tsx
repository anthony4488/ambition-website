"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, Sparkles, X, AlertTriangle, Camera, Play } from "lucide-react";

// ─── Client-side video → frame extraction → Claude Vision pipeline ─────
//
// User flow:
//   1. Drop / pick a sprint video (any phone-shot will do)
//   2. Pick their cohort (so the analysis benchmarks against the right tier)
//   3. Hit "Analyse" → client extracts 6 evenly-spaced frames via Canvas
//   4. POST frames to /api/speed-audit/vision → Anthropic returns JSON
//   5. Show 3 observations + biggest issue + fix in Anthony's voice
//   6. Email capture to save the report
//
// Vision call is ~$0.02-0.05 per analysis. Frames stay on device unless they
// hit "Email me my report" - at which point we save the analysis JSON to
// Supabase (the actual video bytes don't leave the user's browser).

type CohortKey =
  | "u14_male" | "u16_male" | "u18_male" | "senior_male"
  | "u14_female" | "u16_female" | "u18_female" | "senior_female";

const COHORT_LABEL: Record<CohortKey, string> = {
  u14_male: "U14 male (top academy benchmark)",
  u16_male: "U16 male (top academy benchmark)",
  u18_male: "U18 male (top academy benchmark)",
  senior_male: "Senior male (pro / international benchmark)",
  u14_female: "U14 female",
  u16_female: "U16 female",
  u18_female: "U18 female",
  senior_female: "Senior female (pro / international benchmark)",
};

type Observation = { title: string; detail: string };
type Analysis = {
  observations: Observation[];
  biggest_issue: { title: string; detail: string; fix: string };
  estimated_score: number;
};

type Status = "idle" | "extracting" | "analysing" | "done" | "error";

const FRAME_COUNT = 6;

async function extractFrames(
  file: File,
  count: number,
  onProgress?: (pct: number) => void,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    const url = URL.createObjectURL(file);
    video.src = url;

    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      URL.revokeObjectURL(url);
      reject(new Error("Video took too long to load - try a smaller file"));
    }, 60_000);

    video.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that video file"));
    };

    video.onloadedmetadata = async () => {
      if (timedOut) return;
      const duration = video.duration;
      if (!isFinite(duration) || duration < 0.4) {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        reject(new Error("Video too short - needs at least 0.5 seconds of footage"));
        return;
      }

      const seekTo = (t: number) =>
        new Promise<void>((res) => {
          const handler = () => {
            video.removeEventListener("seeked", handler);
            res();
          };
          video.addEventListener("seeked", handler);
          video.currentTime = Math.min(t, Math.max(0, duration - 0.05));
        });

      try {
        // Warm up first frame so dimensions are reliable
        await seekTo(0.1);

        // Cap width to 960px to keep payload small + analysis fast
        const sourceW = video.videoWidth;
        const sourceH = video.videoHeight;
        if (!sourceW || !sourceH) {
          throw new Error("Couldn't read video dimensions");
        }
        const targetW = Math.min(sourceW, 960);
        const targetH = Math.round((sourceH / sourceW) * targetW);

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported in this browser");

        const frames: string[] = [];
        const startT = duration * 0.1;
        const endT = duration * 0.9;
        const step = (endT - startT) / Math.max(count - 1, 1);

        for (let i = 0; i < count; i++) {
          await seekTo(startT + step * i);
          ctx.drawImage(video, 0, 0, targetW, targetH);
          frames.push(canvas.toDataURL("image/jpeg", 0.82));
          onProgress?.(Math.round(((i + 1) / count) * 100));
        }

        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        resolve(frames);
      } catch (err) {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        reject(err instanceof Error ? err : new Error("Frame extraction failed"));
      }
    };
  });
}

export function SpeedAuditVideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [duration, setDuration] = useState<number | null>(null);
  const [cohort, setCohort] = useState<CohortKey>("u16_male");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setError("");
    setAnalysis(null);
    setStatus("idle");
    setSaved(false);
    if (!f.type.startsWith("video/")) {
      setError("Please upload a video file (MP4, MOV, etc.)");
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setError("Video too large - max 100MB. Trim to just the sprint and try again.");
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    // Probe duration
    const probe = document.createElement("video");
    probe.src = url;
    probe.onloadedmetadata = () => setDuration(probe.duration);
  };

  const onAnalyse = async () => {
    if (!file) return;
    setError("");
    setStatus("extracting");
    setProgress(0);
    try {
      const frames = await extractFrames(file, FRAME_COUNT, (p) => setProgress(p));
      setStatus("analysing");

      const res = await fetch("/api/speed-audit/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frames,
          cohort: COHORT_LABEL[cohort],
        }),
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error(j?.error || "Analysis failed");
      setAnalysis(j.analysis as Analysis);
      setStatus("done");
      setTimeout(() => {
        document.getElementById("vision-result")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
    }
  };

  const onSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !analysis) return;
    setSaveError("");
    setSaving(true);
    try {
      const res = await fetch("/api/speed-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          age_bucket: cohort.split("_")[0],
          gender: cohort.split("_")[1],
          overall_score: analysis.estimated_score,
          biggest_gap: analysis.biggest_issue.title,
          scores: analysis,
          source: "speed-audit-video",
        }),
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error(j?.error || "Save failed");
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl("");
    setDuration(null);
    setStatus("idle");
    setAnalysis(null);
    setError("");
    setSaved(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10">
            <Sparkles size={22} className="text-accent" strokeWidth={2} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Instant AI breakdown</p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Drop your sprint video.{" "}
              <span className="text-accent">Get it analysed in 30 seconds.</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Phone-shot sprint footage. Side angle works best. We extract key frames + Anthony&apos;s
              system analyses your mechanics frame-by-frame. Free.
            </p>
          </div>
        </div>

        {/* Cohort */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-gray-700">
            Benchmarking against
          </label>
          <select
            value={cohort}
            onChange={(e) => setCohort(e.target.value as CohortKey)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
          >
            {Object.entries(COHORT_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Drop zone */}
        {!file && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all ${
              dragging
                ? "border-accent bg-accent/5"
                : "border-gray-300 bg-gray-50 hover:border-accent/40 hover:bg-accent/[0.02]"
            }`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/10">
              <Upload size={24} className="text-accent" strokeWidth={2} />
            </span>
            <span className="text-base font-bold text-gray-900">Drop video here or click to upload</span>
            <span className="text-xs text-gray-500">MP4 / MOV up to 100MB · phone footage is fine</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />

        {/* Preview */}
        {file && previewUrl && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-black ring-1 ring-gray-200">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={previewUrl}
                controls
                playsInline
                preload="metadata"
                className="block max-h-[480px] w-full"
              />
              <button
                type="button"
                onClick={clearFile}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="Remove video"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Play size={12} className="text-accent" /> {file.name}
              </span>
              {duration !== null && (
                <span>{duration.toFixed(1)}s · {(file.size / 1024 / 1024).toFixed(1)} MB</span>
              )}
            </div>

            {status === "idle" && (
              <button
                type="button"
                onClick={onAnalyse}
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lg shadow-accent/20 transition hover:bg-orange-500"
              >
                <Sparkles size={16} strokeWidth={2.5} />
                Analyse my sprint
              </button>
            )}
            {status === "extracting" && (
              <div className="rounded-xl bg-gray-50 p-5 ring-1 ring-gray-200">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Camera size={16} className="text-accent" /> Extracting frames…
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-gray-500">{progress}% · pulling {FRAME_COUNT} key moments from your clip</p>
              </div>
            )}
            {status === "analysing" && (
              <div className="rounded-xl bg-gray-900 p-5 text-white ring-1 ring-gray-800">
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-accent" />
                  <div>
                    <p className="font-bold">Analysing your mechanics…</p>
                    <p className="mt-1 text-xs text-gray-400">Frame-by-frame review against elite benchmarks. ~20-30s.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result */}
      {status === "done" && analysis && (
        <div id="vision-result" className="mt-8 rounded-2xl bg-gray-900 p-6 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">AI Analysis</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Anthony&apos;s read on your sprint.
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Benchmarked against: <span className="font-semibold text-white">{COHORT_LABEL[cohort]}</span>
          </p>

          {/* Score */}
          <div className="mt-8 rounded-xl bg-white/[0.06] p-6 ring-1 ring-white/10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Estimated mechanics score</p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-5xl font-black tracking-tight text-accent sm:text-6xl">
                {analysis.estimated_score}%
              </span>
              <span className="text-sm text-gray-400">of elite for your cohort</span>
            </div>
          </div>

          {/* Observations */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {analysis.observations.map((o, i) => (
              <div key={i} className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Observation {i + 1}</p>
                <h4 className="mt-2 text-base font-bold tracking-tight text-white">{o.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{o.detail}</p>
              </div>
            ))}
          </div>

          {/* Biggest issue */}
          <div className="mt-6 rounded-xl bg-accent/10 p-6 ring-1 ring-accent/30 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-accent">Your biggest gap</p>
            <h4 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {analysis.biggest_issue.title}
            </h4>
            <p className="mt-3 leading-relaxed text-gray-200">{analysis.biggest_issue.detail}</p>
            <div className="mt-5 rounded-lg bg-black/30 p-4 ring-1 ring-white/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent">The fix</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white">{analysis.biggest_issue.fix}</p>
            </div>
          </div>

          {/* $299 paid review CTA */}
          <div className="mt-8 rounded-xl border-2 border-accent/60 bg-black/40 p-6 sm:p-8">
            <h4 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
              Want Anthony&apos;s real frame-by-frame review?
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              The breakdown above is AI-led - useful, but Anthony watches at 240fps, runs the full
              5-test diagnostic against you, and writes the personalised report + 15-min voice
              walkthrough back to you within 3-6 days.
            </p>
            <a
              href="/apply?track=online"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500"
            >
              Book your $299 assessment
            </a>
          </div>

          {/* Email capture */}
          {!saved && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <h4 className="text-lg font-bold tracking-tight text-white">
                Save your AI breakdown + get Anthony&apos;s 5-day speed series
              </h4>
              <p className="mt-1 text-sm text-gray-400">
                Free. Clean copy of your analysis to your inbox + 5 daily breakdowns on how to fix the gap above.
              </p>
              <form onSubmit={onSaveResults} className="mt-4 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
                />
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-gray-900 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : "Email me my report"}
                </button>
                {saveError && <p className="text-sm text-red-400">{saveError}</p>}
              </form>
            </div>
          )}
          {saved && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-400">✓ Saved to your inbox</p>
              <p className="mt-2 text-sm text-gray-400">Your breakdown is on its way to {email}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
