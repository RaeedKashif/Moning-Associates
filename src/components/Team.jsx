const members = [
  { name: 'Glenda', role: 'Executive Assistant', initials: 'G' },
  { name: 'Sonya',  role: 'Sales Assistant',     initials: 'S' },
  { name: 'Clyde',  role: 'Data & Acquisition',  initials: 'C' },
  { name: 'CJ',     role: 'Social & Comms',      initials: 'CJ' },
  { name: 'Zahra',  role: 'Web & WordPress',     initials: 'Z' },
];

export default function Team() {
  return (
    <section id="team" className="py-24 px-5 md:px-[6%]">
      <div className="reveal max-w-3xl mb-10">
        <span className="section-tag">The Team</span>
        <h2 className="section-title">
          The people behind<br/>
          <span className="italic text-goldDk">every closed deal.</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-stretch">
        {/* Leader card */}
        <article className="reveal bg-navy rounded-2xl overflow-hidden border
                            border-black/[0.06] flex flex-col h-full
                            transition-all hover:-translate-y-1 hover:shadow-soft">
          <div className="flex-1 min-h-[280px] overflow-hidden">
            <img
              src="/assets/Salmon Hi-Res.jpg"
              alt="Steven Moning"
              loading="lazy"
              className="w-full h-full object-cover object-[center_top]
                         transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-7">
            <h3 className="font-serif text-white text-[1.45rem] font-semibold">
              Steven Moning
            </h3>
            <div className="text-gold text-[0.78rem] font-medium mt-0.5">
              CEO · eXp Realtor · Licensed Since 2006
            </div>
            <p className="text-white/55 text-[0.86rem] leading-[1.7] mt-3">
              18+ years in DFW real estate, a Master's in Information Systems,
              and hundreds of deals under his belt. Steven doesn't just lead the
              team — he's in the field with you.
            </p>
          </div>
        </article>

        {/* Members */}
        <div className="flex flex-wrap gap-4 justify-start content-stretch">
          {members.map((m, i) => (
            <article
              key={m.name}
              className={`reveal d${i + 1} flex-[1_1_calc(33.333%-0.75rem)]
                          min-w-[160px]
                          bg-white rounded-2xl border border-black/[0.06]
                          p-7 text-center flex flex-col items-center
                          justify-center gap-1 group
                          transition-all hover:-translate-y-1 hover:shadow-soft`}
            >
              <div className="w-16 h-16 mb-3 rounded-full bg-cream2
                              border-2 border-gold/25 grid place-items-center
                              font-serif font-bold text-[1.25rem] text-goldDk
                              transition-all
                              group-hover:bg-navy group-hover:text-gold
                              group-hover:border-gold group-hover:scale-110">
                {m.initials}
              </div>
              <h4 className="font-semibold text-navy text-[0.95rem]">{m.name}</h4>
              <div className="text-muted text-[0.78rem]">{m.role}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
