import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Ambition Sports Performance",
  description: "Speed science, biomechanics insights, and training philosophy from the Ambition coaching team.",
};

const posts = [
  {
    slug: "genetics-myth",
    title: "It's Not a Genetic Deficit. It's a Knowledge Deficit.",
    excerpt: "Everyone wants to blame genetics. We've taken athletes from 17 km/h to 38 km/h. Here's how.",
    category: "Philosophy",
    date: "March 2026",
  },
  {
    slug: "biomechanical-assessment",
    title: "Why Most Athletes Train Hard But Never Get Faster",
    excerpt: "No assessment. No baseline. No limiting factor profile. Just guessing — and wondering why they plateau.",
    category: "Assessment",
    date: "March 2026",
  },
  {
    slug: "dribbling-speed",
    title: "Stop Slowing Yourself Down When You Dribble",
    excerpt: "Most players lose their speed at the moment of contact. The fix is continuous acceleration.",
    category: "Football",
    date: "March 2026",
  },
  {
    slug: "youth-speed-development",
    title: "From 23 km/h to 32 km/h at Age 12: What Systematic Programming Looks Like",
    excerpt: "A 12-year-old now faster than senior professional footballers. Here's the 14-month breakdown.",
    category: "Youth Development",
    date: "February 2026",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn><p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Insights</p></FadeIn>
          <FadeIn delay={100}><h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">Blog</h1></FadeIn>
          <FadeIn delay={200}><p className="text-lg text-gray-300 max-w-lg leading-relaxed">Speed science, biomechanics, and training philosophy from the coaching team.</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={(i % 2) * 120}>
              <Link href={`/blog/${post.slug}`} className="group block light-card rounded-xl p-8 h-full border-l-2 border-l-accent/60 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-orange-50 border border-orange-100 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-gray-400">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                  Read <ArrowRight size={14} />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CTASection title="Ready to get faster?" description="Apply for a biomechanical assessment and find out what's actually holding your speed back." />
    </>
  );
}
