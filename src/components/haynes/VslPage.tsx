import type { ReactNode } from "react";
import { OptinStrip } from "@/components/haynes/OptinStrip";
import { CurvedArrow, Note } from "@/components/haynes/Scribble";
import { FunnelLogo } from "@/components/haynes/Logo";
import { Card, Cta, Disclaimer, GRID_BG, PointList, type Point } from "@/components/haynes/TyBlocks";
import { WhatsAppWall } from "@/components/haynes/Testimonials";
import { VslVideo } from "@/components/haynes/VslVideo";

// The VSL landing pages, restyled 2026-10-01 to match the thank-you pages (Anthony: "make the vsl page also
// the same vibe clean look"): light grid, bordered cards with a hard shadow, heavy italic headings, a green
// tick list and a red cross list. Structure stays Haynes's: bar, pre-headline, one headline, the VSL, name
// + email, proof for anyone not ready, then the qualifier. His standing rules applied in the copy: no price,
// no free bound test, no "what we don't guarantee" and no averages; sell the level.

export type VslCopy = {
  bar: ReactNode;
  headline: string;
  vsl: string;
  poster: string;
  formId: string;
  next: string;
  optinLine: string;
  resultsHref: string;
  resultsLabel: string;
  reality: string[];
  get: Point[];
  bring: Point[];
  decides: Point[];
  dont: Point[];
  closer: string;
};

export function VslPage({ c }: { c: VslCopy }) {
  return (
    <main className={`min-h-screen overflow-x-hidden text-gray-900 ${GRID_BG}`}>
      <div className="border-b-2 border-black bg-[#171717] px-4 py-3.5 text-center text-[15px] font-bold text-white sm:text-lg">{c.bar}</div>

      <div className="mx-auto max-w-[1000px] px-4 pb-16 pt-6 sm:pt-8">
        <header className="text-center">
          <FunnelLogo />
          <p className="mt-4 text-[14px] font-bold uppercase tracking-[0.18em] text-accent sm:text-lg">Ambition Sports Performance presents...</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-[30px] font-black uppercase leading-[1.04] tracking-tight text-[#1f1f1f] [text-wrap:balance] sm:text-5xl lg:text-[58px]">
            {c.headline}
          </h1>
        </header>

        <div className="mt-6 flex items-end justify-center gap-2 text-accent" aria-hidden>
          <Note className="-rotate-3 text-3xl sm:text-4xl">watch this first</Note>
          <CurvedArrow shape="down" className="h-14 w-9 sm:h-16 sm:w-10" />
        </div>
        <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[6px_6px_0_0_rgba(0,0,0,0.9)]">
          <VslVideo src={c.vsl} poster={c.poster} formId={c.formId} />
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xl font-black leading-snug text-accent sm:text-[27px]">{c.optinLine}</p>
      </div>

      <div className="flex items-end justify-center gap-2 pb-2 text-accent" aria-hidden>
        <CurvedArrow shape="loop" className="h-16 w-10 -scale-x-100 sm:h-20 sm:w-12" />
        <Note className="-rotate-3 text-3xl sm:text-4xl">start here</Note>
      </div>
      <OptinStrip formId={c.formId} next={c.next} />

      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16 pt-12">
        {/* 2026-10-01: lean on purpose (Anthony: "weird to have both our thank you pages and the VSL pages
            similar"). The VSL page's one job is watch + apply, so proof sits behind a button (Haynes); the
            testimonial and WhatsApp rows live on the thank-you pages. */}
        {/* 1 Oct 2026 (Anthony): the newest wins go on the VSL pages too, three cards only, the rest stays behind
            the results button. */}
        <WhatsAppWall count={5} title="This week, from our athletes" />
        <div className="space-y-3 text-center">
          <p className="text-[26px] font-black leading-tight tracking-tight text-black sm:text-3xl">Not ready to apply yet?</p>
          <Cta href={c.resultsHref} lead="See what our athletes have done first">
            {c.resultsLabel}
          </Cta>
        </div>

        <Card tone="dark">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-accent">Read this before you apply</p>
          <p className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">If you&apos;re here to kick tyres, close this page now.</p>
          <p className="mt-3 text-[16px] leading-relaxed text-white/80">
            We don&apos;t do free chats, we don&apos;t compete on price, and we don&apos;t chase anyone. We read every application and we
            turn people away. Everything below is here to save both of us the time.
          </p>
        </Card>

        <Card title="The reality about speed.">
          <div className="space-y-3 text-[16px] leading-relaxed text-gray-700 [&_strong]:font-black [&_strong]:text-black">
            {c.reality.map((p) => (
              <p key={p} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </Card>

        <Card title="What you get.">
          <PointList ok items={c.get} />
        </Card>

        <Card title="What decides the result.">
          <PointList ok items={c.decides} />
        </Card>

        <Card title="What you need to bring.">
          <PointList ok items={c.bring} />
        </Card>

        <Card title="Don't apply if.">
          <PointList ok={false} items={c.dont} />
          <p className="mt-5 text-[17px] font-black leading-snug text-black">{c.closer}</p>
        </Card>

        <Disclaimer />
      </div>
    </main>
  );
}
