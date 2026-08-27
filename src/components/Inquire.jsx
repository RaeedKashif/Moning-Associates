import { useState } from 'react';
import InquiryToggle from './InquiryToggle.jsx';
import { BUYER } from '../lib/inquiryForms.js';

const I = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
       className="w-5 h-5">{p}</svg>
);

const info = [
  { label: 'General Inquiries (Call or Text)', value: '469-580-9228', href: 'tel:+14695809228',
    icon: I(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75A16 16 0 0 0 16 16.84l.95-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>) },
  { label: 'Property Deals & Acquisitions (Text)', value: '469-672-9892', href: 'sms:+14696729892',
    icon: I(<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>) },
  { label: 'Email', value: 'steven.moning@exprealty.com', href: 'mailto:steven.moning@exprealty.com',
    icon: I(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>) },
  { label: 'Office Hours', value: 'Mon – Fri, 9:00 AM – 5:00 PM', href: null,
    icon: I(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>) },
];

export default function Inquire() {
  const [form, setForm] = useState(BUYER);

  return (
    <section
      id="inquire"
      className="relative bg-navy py-24 px-5 md:px-[6%]
                 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start overflow-hidden
                 scroll-mt-20"
    >
      <div className="pointer-events-none absolute inset-0 pattern-crown opacity-30" />

      {/* Left */}
      <div className="relative reveal">
        <span className="text-[0.7rem] font-semibold tracking-[0.28em]
                         uppercase text-gold flex items-center gap-3 mb-5">
          <span className="w-7 h-px bg-gold" /> Start Here
        </span>
        <h2 className="font-serif text-white font-semibold leading-[1.08]
                       text-[clamp(2rem,4vw,3.4rem)] mb-5">
          Buying or selling?<br/>
          <em className="not-italic text-gold">Tell us which.</em>
        </h2>
        <p className="text-white/55 text-[0.96rem] leading-[1.8] max-w-md mb-8">
          Pick the side you are on and answer the intake. It takes about five
          minutes, and it is what lets Steven come back to you within one business
          day with something useful instead of a discovery call.
        </p>

        <ul className="flex flex-col gap-4 mb-10">
          {info.map(it => (
            <li key={it.label} className="flex items-center gap-4">
              <div className="w-11 h-11 flex-shrink-0 bg-gold/10 border border-gold/25
                              rounded-xl grid place-items-center text-gold">
                {it.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[0.7rem] text-white/35 tracking-[0.18em] uppercase">
                  {it.label}
                </div>
                {it.href ? (
                  <a href={it.href}
                     className="block text-white text-[0.95rem] font-medium mt-0.5
                                hover:text-gold transition-colors break-all">
                    {it.value}
                  </a>
                ) : (
                  <div className="text-white text-[0.95rem] font-medium mt-0.5">
                    {it.value}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

      </div>

      {/* Right: choose a side, then go to the form on its own page. The intake
          runs to thirty questions — long enough that it earns its own URL
          rather than burying the rest of the homepage underneath it. */}
      <div className="relative reveal d2">
        <InquiryToggle value={form.key} onSelect={setForm} className="mb-5" />

        <div className="glass-card p-7 sm:p-9">
          <p className="text-white/60 text-[0.95rem] leading-[1.8]">
            {form.homeBlurb}
          </p>

          <ul className="flex flex-col gap-3 my-7">
            {form.reassurance.points.slice(0, 3).map(p => (
              <li key={p} className="flex gap-3.5">
                <span className="mt-2 w-1.5 h-1.5 rotate-45 bg-gold shrink-0" aria-hidden="true" />
                <span className="text-white/55 text-[0.9rem] leading-[1.7]">{p}</span>
              </li>
            ))}
          </ul>

          <a href={`#/${form.slug}`} className="btn-gold w-full justify-center">
            {form.homeCta}
            <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center text-xs">
              &rarr;
            </span>
          </a>

          <p className="text-white/35 text-xs text-center mt-4 leading-relaxed">
            About five minutes. Nothing is shared, and nothing goes on a list.
          </p>
        </div>
      </div>
    </section>
  );
}
