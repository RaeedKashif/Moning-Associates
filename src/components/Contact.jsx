import { useState } from 'react';

const I = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
       className="w-5 h-5">{p}</svg>
);

const info = [
  { label: 'Phone', value: '+1 469-580-9228',
    icon: I(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75A16 16 0 0 0 16 16.84l.95-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>) },
  { label: 'Email', value: 'steven.moning@exprealty.com',
    icon: I(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>) },
  { label: 'Office Hours', value: 'Mon – Fri, 9:00 AM – 5:00 PM',
    icon: I(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>) },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      className="relative bg-navy py-24 px-5 md:px-[6%]
                 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start overflow-hidden"
    >
      {/* Left */}
      <div className="relative reveal">
        <span className="text-[0.7rem] font-semibold tracking-[0.28em]
                         uppercase text-gold flex items-center gap-3 mb-5">
          <span className="w-7 h-px bg-gold" /> Get In Touch
        </span>
        <h2 className="font-serif text-white font-semibold leading-[1.08]
                       text-[clamp(2rem,4vw,3.4rem)] mb-5">
          Let's start your<br/>
          <em className="italic text-gold not-italic">real estate journey</em><br/>
          today.
        </h2>
        <p className="text-white/55 text-[0.96rem] leading-[1.8] max-w-md mb-8">
          Buying, selling, or investing — let's just have a real conversation
          about what you're trying to do. No pressure, no scripted pitch. Just
          honest, useful answers.
        </p>

        <ul className="flex flex-col gap-4">
          {info.map(it => (
            <li key={it.label} className="flex items-center gap-4">
              <div className="w-11 h-11 flex-shrink-0 bg-gold/10 border border-gold/25
                              rounded-xl grid place-items-center text-gold">
                {it.icon}
              </div>
              <div>
                <div className="text-[0.7rem] text-white/35 tracking-[0.18em] uppercase">
                  {it.label}
                </div>
                <div className="text-white text-[0.95rem] font-medium mt-0.5">
                  {it.value}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Form */}
      <div className="relative reveal d2">
        <form
          onSubmit={e => { e.preventDefault(); setSent(true); }}
          className="glass-card p-6 sm:p-9"
        >
          {sent ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-full bg-gold grid place-items-center text-navy
                              text-2xl font-bold mb-4">✓</div>
              <h3 className="font-serif text-white text-2xl mb-2">Thanks — we got it.</h3>
              <p className="text-white/55">Steven will be in touch within one business day.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="First Name"  type="text"  placeholder="John"  autoComplete="given-name" />
                <Field label="Last Name"   type="text"  placeholder="Smith" autoComplete="family-name" />
              </div>
              <Field label="Email Address" type="email" placeholder="john@email.com" autoComplete="email" />
              <Field label="Phone Number"  type="tel"   placeholder="(xxx) xxx-xxxx" autoComplete="tel" />

              <div className="mb-4">
                <label className="block text-[0.72rem] tracking-wide uppercase
                                  text-white/45 mb-2">I'm interested in</label>
                <select className="w-full bg-white/[0.06] border border-white/10
                                   rounded-lg px-4 py-3 text-white text-[0.92rem]
                                   focus:border-gold focus:outline-none transition">
                  <option className="bg-navy2">Buying a home</option>
                  <option className="bg-navy2">Selling a home</option>
                  <option className="bg-navy2">Investment property</option>
                  <option className="bg-navy2">REO / Off-market</option>
                  <option className="bg-navy2">Luxury property</option>
                  <option className="bg-navy2">Land acquisition</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-[0.72rem] tracking-wide uppercase
                                  text-white/45 mb-2">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us a bit about what you're hoping to do..."
                  className="w-full bg-white/[0.06] border border-white/10 rounded-lg
                             px-4 py-3 text-white text-[0.92rem] resize-none
                             focus:border-gold focus:outline-none transition
                             placeholder:text-white/25"
                />
              </div>

              <button type="submit" className="btn-gold w-full justify-center">
                Send Message
                <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center text-xs">&rarr;</span>
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-[0.72rem] tracking-wide uppercase text-white/45 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-white/[0.06] border border-white/10 rounded-lg
                   px-4 py-3 text-white text-[max(0.92rem,16px)]
                   focus:border-gold focus:outline-none transition
                   placeholder:text-white/25"
      />
    </div>
  );
}
