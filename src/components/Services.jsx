const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
       className="w-5 h-5">{d}</svg>
);

const services = [
  {
    num: '01',
    title: 'REO & BPO Properties',
    body: "Steven's REO track record opens doors to bank-owned deals most agents never see. Hundreds closed — fast, clean, no drama.",
    featured: true,
    icon: <Icon d={<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
  },
  {
    num: '02',
    title: 'Investor Services',
    body: 'Flipping, wholesaling, portfolio acquisition. We think like investors because, frankly, we are investors.',
    icon: <Icon d={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />,
  },
  {
    num: '03',
    title: 'Luxury Properties',
    body: 'High-value DFW homes need a different playbook. We know the market, the buyers, and how to handle the deal with discretion.',
    icon: <Icon d={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} />,
  },
  {
    num: '04',
    title: 'Off-Market Deals',
    body: 'We hear about deals before the MLS does. If something is moving fast in DFW, chances are we already know about it.',
    icon: <Icon d={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />,
  },
  {
    num: '05',
    title: 'Residential Sales',
    body: "Selling? We know what your home is actually worth in today's market — and we'll fight to get every dollar of it.",
    icon: <Icon d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
  },
  {
    num: '06',
    title: 'Land Acquisition',
    body: "Land deals have their own rules — zoning, timelines, build potential. We know how to read them and close them right.",
    icon: <Icon d={<><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>} />,
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-cream py-24 px-5 md:px-[6%]">
      <div className="reveal mb-12 max-w-3xl">
        <span className="section-tag">What We Do</span>
        <h2 className="section-title">
          Real Estate Services,<br/>
          <span className="italic text-goldDk">Done Properly.</span>
        </h2>
        <p className="section-sub mt-4">
          Whether you're buying your first home or assembling a portfolio,
          you get the same thing from us — real experience, plain English,
          and someone who actually sweats the details.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => {
          const featured = s.featured;
          return (
            <article
              key={s.num}
              className={`reveal d${(i % 3) + 1}
                          relative overflow-hidden rounded-2xl p-7 sm:p-8
                          border transition-all duration-300
                          hover:-translate-y-1.5 hover:shadow-soft
                          ${featured
                            ? 'bg-navy border-navy2'
                            : 'bg-white border-black/[0.07]'}`}
            >
              <div className={`font-serif font-bold text-5xl leading-none mb-3
                               ${featured ? 'text-goldLt' : 'text-goldDk'}`}>
                {s.num}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5
                               ${featured ? 'bg-gold/15 text-gold' : 'bg-gold/10 text-gold'}`}>
                {s.icon}
              </div>
              <h3 className={`font-serif font-semibold text-[1.3rem] mb-2
                              ${featured ? 'text-white' : 'text-navy'}`}>
                {s.title}
              </h3>
              <p className={`text-[0.92rem] leading-[1.7]
                             ${featured ? 'text-white/60' : 'text-slate'}`}>
                {s.body}
              </p>
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r
                               from-gold to-goldLt scale-x-0 origin-left
                               transition-transform duration-500
                               group-hover:scale-x-100" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
