import Properties from './Properties.jsx';

export default function PropertiesPage({ initialFilter = 'all' }) {
  return (
    <main className="pt-[76px]">
      {/* Page hero */}
      <section className="relative bg-royal-deep overflow-hidden px-5 md:px-[6%] py-14 md:py-28">
        <div className="pointer-events-none absolute inset-0 pattern-crown opacity-40" />
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px]
                        rounded-full bg-gold/10 blur-3xl animate-pulseGold" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[460px] h-[460px]
                        rounded-full bg-wine/15 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5 animate-fadeUp">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-gold" />
            <span className="text-[0.72rem] font-semibold tracking-[0.32em] uppercase text-gold">
              The Portfolio
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-gold via-gold to-transparent" />
          </div>
          <h1 className="font-serif font-semibold leading-[1.05]
                         text-[clamp(2.4rem,5vw,4.4rem)] text-white animate-fadeUp [animation-delay:0.1s]">
            All <span className="italic gold-foil">Properties</span>
          </h1>
          <p className="text-white/70 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.85] max-w-2xl mx-auto mt-6
                        animate-fadeUp [animation-delay:0.2s]">
            From off-market estates to active luxury listings and raw DFW land —
            every property here is one we'd personally take a client to walk.
          </p>

          <div className="royal-divider mt-8 animate-fadeUp [animation-delay:0.3s]">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="inline-block w-2 h-2 rotate-45 bg-gold" />
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </div>
      </section>

      <Properties initialFilter={initialFilter} showHeader={false} />

      {/* CTA strip */}
      <section className="bg-navy2 px-5 md:px-[6%] py-16 border-t border-gold/15">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-serif text-white text-[clamp(1.5rem,3vw,2.4rem)] font-semibold mb-4">
            Looking for something <span className="italic gold-foil">specific?</span>
          </h3>
          <p className="text-white/65 leading-[1.8] mb-8 max-w-2xl mx-auto">
            Many of our best deals never hit the MLS. Tell us what you're hunting
            for and we'll send a private shortlist.
          </p>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = ''; setTimeout(() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}), 80); }}
             className="btn-gold inline-flex">
            Request a Private List
            <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center text-xs">&rarr;</span>
          </a>
        </div>
      </section>
    </main>
  );
}
