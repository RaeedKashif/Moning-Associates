const I = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
       className="w-5 h-5">{p}</svg>
);

const items = [
  { t: 'Clarity', d: 'No jargon. No confusion. Every step explained plainly.',
    icon: I(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>) },
  { t: 'Ethics', d: "We do the right thing — even when nobody's watching.",
    icon: I(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>) },
  { t: 'Order', d: 'Every detail tracked. Every deadline met. Nothing left to chance.',
    icon: I(<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></>) },
  { t: 'Transparency', d: 'We keep you in the loop. No radio silence, no surprises.',
    icon: I(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>) },
];

export default function Values() {
  return (
    <div className="bg-gold py-14 px-5 md:px-[6%] grid grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((v, i) => (
        <div key={v.t} className={`reveal d${i + 1} text-center group`}>
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl
                          bg-navy/10 grid place-items-center text-navy
                          transition-all group-hover:-translate-y-1
                          group-hover:bg-navy/20">
            {v.icon}
          </div>
          <h4 className="font-serif text-navy font-semibold text-[clamp(1.1rem,2vw,1.35rem)]">
            {v.t}
          </h4>
          <p className="text-navy/65 text-[0.8rem] leading-[1.55] mt-1
                        max-w-[16rem] mx-auto">
            {v.d}
          </p>
        </div>
      ))}
    </div>
  );
}
