const items = [
  {
    quote:
      "Steven made the whole homebuying process feel easy — which, honestly, we didn't think was possible. He knew the DFW market cold and figured out what we needed before we even could. We genuinely couldn't have done this without him.",
    name: 'James & Rachel',
    role: 'First-Time Buyers · Frisco, TX',
    initials: 'JR',
    dark: true,
  },
  {
    quote:
      "As an investor, speed and accuracy are everything to me. Steven's REO expertise has helped me close over a dozen deals without a single hiccup. He thinks like an investor, not just a broker — and that makes all the difference.",
    name: 'Marcus T.',
    role: 'Real Estate Investor · Dallas, TX',
    initials: 'MT',
  },
  {
    quote:
      "The transparency was honestly refreshing. Steven kept us in the loop at every single step, and his negotiation saved us thousands on our luxury listing. I'd recommend him without a moment's hesitation.",
    name: 'David & Karen L.',
    role: 'Home Sellers · Plano, TX',
    initials: 'DL',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-cream py-24 px-5 md:px-[6%]">
      <div className="reveal max-w-3xl mb-12">
        <span className="section-tag">Client Stories</span>
        <h2 className="section-title">
          What our clients<br/>
          <span className="italic text-goldDk">actually say</span> about us.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <article
            key={t.name}
            className={`reveal d${i + 1} rounded-2xl p-7 sm:p-8 border flex flex-col
                        transition-all duration-300 hover:-translate-y-1 hover:shadow-soft
                        ${t.dark ? 'bg-navy border-navy2' : 'bg-white border-black/[0.07]'}`}
          >
            <div className={`font-serif text-5xl leading-none mb-2
                             ${t.dark ? 'text-gold/25' : 'text-gold/30'}`}>"</div>
            <div className="text-gold tracking-[0.2em] text-sm mb-3">★★★★★</div>
            <blockquote className={`flex-1 italic text-[0.94rem] leading-[1.75]
                                    ${t.dark ? 'text-white/80' : 'text-slate'}`}>
              {t.quote}
            </blockquote>
            <div className={`mt-7 pt-5 flex items-center gap-3 border-t
                             ${t.dark ? 'border-white/10' : 'border-black/[0.06]'}`}>
              <div className="w-11 h-11 rounded-full grid place-items-center
                              font-serif font-bold text-navy bg-gold">
                {t.initials}
              </div>
              <div>
                <div className={`text-[0.9rem] font-semibold
                                 ${t.dark ? 'text-white' : 'text-navy'}`}>{t.name}</div>
                <div className={`text-[0.76rem] mt-0.5
                                 ${t.dark ? 'text-white/45' : 'text-muted'}`}>{t.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
