const credIcon = (paths) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
       className="w-4 h-4">{paths}</svg>
);

const creds = [
  { title: "Master's in Information Systems", sub: 'Data-driven approach',
    icon: credIcon(<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>) },
  { title: 'eXp Realty Agent', sub: 'Global network, DFW roots',
    icon: credIcon(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>) },
  { title: 'REO & BPO Certified', sub: 'Bank-owned specialist',
    icon: credIcon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>) },
  { title: 'DFW Market Expert', sub: 'On the ground since 2006',
    icon: credIcon(<><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/></>) },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-5 md:px-[6%] grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
    >
      {/* Visual */}
      <div className="reveal relative max-w-[480px] mx-auto lg:mx-0 w-full">
        <div className="relative p-4 pb-14">
          <div className="absolute inset-0 border-[1.5px] border-gold/30 rounded-3xl pointer-events-none" />
          <div className="rounded-2xl overflow-hidden aspect-[3/4] relative">
            <img
              src="/assets/Tan Hi-Res.jpg"
              alt="Steven Moning portrait"
              loading="lazy"
              className="w-full h-full object-cover object-[center_top]"
            />
          </div>
          <div className="absolute -bottom-1 right-4 bg-navy border border-gold/30
                          rounded-2xl px-6 py-5 text-center shadow-2xl z-10">
            <div className="font-serif text-gold text-[2.4rem] font-bold leading-none">2006</div>
            <div className="text-white/55 text-[0.65rem] tracking-[0.18em] uppercase mt-1">
              Licensed<br/>Since
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="reveal d2">
        <span className="section-tag">About Steven</span>
        <h2 className="font-serif text-navy font-semibold leading-[1.1]
                       text-[clamp(1.9rem,3.5vw,3rem)] mb-6">
          More than a Realtor.<br/>
          A <em className="text-goldDk not-italic font-semibold italic">trusted advisor.</em>
        </h2>

        <div className="space-y-4 text-slate text-[0.96rem] leading-[1.85]">
          <p>
            Steven has been working Dallas–Fort Worth real estate since 2006. That's
            almost two decades of closings, market shifts, and the kind of street
            knowledge you can't fake. His <strong className="text-navy">Master's in
            Information Systems</strong> gives him an angle most agents simply don't
            have — he reads the data first, then makes the call.
          </p>
          <p>
            REO portfolios. Luxury listings. A first-time buyer's starter home. The
            mix is wide on purpose, but the standard never changes. Clients keep
            coming back, and they bring their friends with them. That's really the
            whole game.
          </p>
          <p>
            As CEO of Moning &amp; Associates, he runs a small, focused team built
            around one rule: every client walks away better off than when they
            started. Every time.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-7">
          {creds.map(c => (
            <div key={c.title}
                 className="flex items-start gap-3 p-4 bg-cream rounded-xl
                            border border-black/[0.05] hover:border-gold/40
                            hover:translate-x-1 transition-all">
              <div className="w-9 h-9 flex-shrink-0 bg-gold/10 rounded-lg
                              grid place-items-center text-goldDk">
                {c.icon}
              </div>
              <div>
                <strong className="block text-[0.85rem] text-navy leading-tight">
                  {c.title}
                </strong>
                <span className="text-[0.76rem] text-muted">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <a href="tel:+14695809228" className="btn-outline-navy mt-8">
          Call +1 469-580-9228
          <span className="w-5 h-5 rounded-full bg-gold/15 grid place-items-center
                           text-xs">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
