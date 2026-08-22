import InquiryForm from './InquiryForm.jsx';
import InquiryToggle from './InquiryToggle.jsx';

export default function InquiryPage({ config }) {
  const { hero, reassurance } = config;

  // Each form has its own URL, so switching is real navigation — the heading,
  // the page title, and the form all change together.
  const goTo = (form) => {
    if (form.key !== config.key) window.location.hash = `/${form.slug}`;
  };

  return (
    <main className="pt-[76px]">
      <section className="relative bg-navy overflow-hidden px-5 md:px-[6%] py-14 md:py-24">
        <div className="pointer-events-none absolute inset-0 pattern-crown opacity-40" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5 animate-fadeUp">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-gold" />
            <span className="text-[0.72rem] font-semibold tracking-[0.32em] uppercase text-gold">
              {hero.tag}
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-gold via-gold to-transparent" />
          </div>
          <h1 className="font-serif font-semibold leading-[1.05]
                         text-[clamp(2.4rem,5vw,4.4rem)] text-white
                         animate-fadeUp [animation-delay:0.1s]">
            {hero.titleLead} <span className="italic gold-foil">{hero.titleAccent}</span>
          </h1>
          <p className="text-white/70 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.85]
                        max-w-2xl mx-auto mt-6 animate-fadeUp [animation-delay:0.2s]">
            {hero.blurb}
          </p>

          <InquiryToggle
            value={config.key}
            onSelect={goTo}
            className="mt-9 max-w-md mx-auto animate-fadeUp [animation-delay:0.3s]"
          />
        </div>
      </section>

      <section className="relative bg-navy2 px-5 md:px-[6%] pb-20 pt-14
                          border-t border-gold/15
                          grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]
                          gap-10 lg:gap-16 items-start">
        {/* Left: what to expect. Sticky, because the intake is long enough that
            you would otherwise scroll past this in the first second. */}
        <div className="reveal lg:sticky lg:top-24">
          <h2 className="font-serif text-white text-[clamp(1.4rem,2.6vw,2rem)]
                         font-semibold mb-6">
            {reassurance.heading}
          </h2>
          <ul className="flex flex-col gap-4 mb-10">
            {reassurance.points.map(p => (
              <li key={p} className="flex gap-3.5">
                <span className="mt-2 w-1.5 h-1.5 rotate-45 bg-gold shrink-0" aria-hidden="true" />
                <span className="text-white/65 text-[0.95rem] leading-[1.75]">{p}</span>
              </li>
            ))}
          </ul>

          <div className="pt-7 border-t border-gold/15">
            <p className="text-[0.68rem] tracking-[0.22em] uppercase text-gold/80 mb-3">
              Or reach Steven directly
            </p>
            <a href="tel:+14695809228"
               className="block text-white text-lg font-medium hover:text-gold transition-colors">
              469-580-9228
            </a>
            <a href="mailto:steven.moning@exprealty.com"
               className="block text-white/70 text-sm mt-1 hover:text-gold transition-colors break-all">
              steven.moning@exprealty.com
            </a>
          </div>
        </div>

        {/* Right: the form */}
        <div className="reveal d2">
          <InquiryForm config={config} />
        </div>
      </section>
    </main>
  );
}
