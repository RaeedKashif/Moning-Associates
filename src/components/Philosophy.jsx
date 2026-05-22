const pillars = [
  {
    num: '01',
    title: 'Honor Over Ego',
    body: "Every recommendation is genuinely what's best for you — not what's easiest for us. Your interest comes first, full stop.",
  },
  {
    num: '02',
    title: 'Conviction Over Convenience',
    body: "We'll tell you when a deal isn't right, when the price is too high, or when to walk away. The truth now beats regret later.",
  },
  {
    num: '03',
    title: 'Legacy Over Limelight',
    body: "We're not chasing awards. The only metric that matters is whether our client ended up better off. That's it.",
  },
];

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative bg-navy py-24 px-5 md:px-[6%] overflow-hidden"
    >
      <div className="absolute -top-44 -right-44 w-[480px] h-[480px] rounded-full
                      bg-gold/[0.07] blur-3xl pointer-events-none" />

      <div className="relative grid lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-20 items-center">
        <div className="reveal">
          <span className="text-[0.7rem] font-semibold tracking-[0.28em]
                           uppercase text-gold flex items-center gap-3 mb-5">
            <span className="w-7 h-px bg-gold" /> Our Approach
          </span>
          <blockquote className="font-serif text-white font-semibold leading-[1.2]
                                 text-[clamp(1.7rem,3.2vw,2.7rem)]">
            "We don't just close deals — we help people figure out
            where they actually <em className="italic text-gold">belong</em> in DFW."
          </blockquote>
          <div className="flex items-center gap-4 mt-8">
            <span className="w-7 h-px bg-gold" />
            <span className="text-white/45 text-sm">
              Steven Moning — CEO, Moning &amp; Associates
            </span>
          </div>
        </div>

        <div className="reveal d2 flex flex-col gap-4">
          {pillars.map(p => (
            <div
              key={p.num}
              className="group relative flex gap-5 items-start
                         p-6 md:p-7 bg-white/[0.03] border border-white/10
                         rounded-2xl transition-all
                         hover:bg-gold/[0.05] hover:border-gold/25
                         overflow-hidden"
            >
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold
                               scale-y-0 origin-center transition-transform
                               group-hover:scale-y-100" />
              <div className="font-serif text-gold font-bold text-[1.4rem]
                              w-8 leading-none flex-shrink-0">{p.num}</div>
              <div>
                <h4 className="text-white font-semibold mb-1.5">{p.title}</h4>
                <p className="text-white/55 text-[0.9rem] leading-[1.7]">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
