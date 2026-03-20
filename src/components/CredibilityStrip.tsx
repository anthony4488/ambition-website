export function CredibilityStrip() {
  const orgs = [
    "Bundesliga",
    "Paralympic Games",
    "La Liga",
    "Suriname NT",
    "A-League",
    "NPL",
    "NRL Development",
    "AFL Academy",
    "National Track & Field",
    "State Championships",
    "FIFA Pathway",
    "Olympic Trials",
  ];

  // Double the array for seamless infinite loop
  const doubled = [...orgs, ...orgs];

  return (
    <section className="relative bg-gray-900 border-t border-white/5 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-[11px] text-gray-500 uppercase tracking-[0.25em] text-center sm:text-left">
          Athletes in the system have competed at
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {doubled.map((org, i) => (
            <span
              key={`${org}-${i}`}
              className="flex-none mx-3 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold bg-white/[0.04] border border-white/[0.08] rounded-full whitespace-nowrap hover:border-accent/30 hover:text-accent/80 transition-colors"
            >
              {org}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
