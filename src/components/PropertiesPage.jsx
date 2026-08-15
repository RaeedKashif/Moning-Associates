import Properties from './Properties.jsx';
import { pageCopy } from '../lib/propertyCategories.js';

export default function PropertiesPage({ type = 'all', channel = 'all' }) {
  const { hero, cta } = pageCopy(type, channel);

  return (
    <main className="pt-[76px]">
      {/* Page hero */}
      <section className="relative bg-navy overflow-hidden px-5 md:px-[6%] py-14 md:py-28">
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
                         text-[clamp(2.4rem,5vw,4.4rem)] text-white animate-fadeUp [animation-delay:0.1s]">
            {hero.titleLead}
            {hero.titleAccent && <> <span className="italic gold-foil">{hero.titleAccent}</span></>}
          </h1>
          <p className="text-white/70 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.85] max-w-2xl mx-auto mt-6
                        animate-fadeUp [animation-delay:0.2s]">
            {hero.blurb}
          </p>

          <div className="royal-divider mt-8 animate-fadeUp [animation-delay:0.3s]">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="inline-block w-2 h-2 rotate-45 bg-gold" />
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          {/* Brokered-by eXp mark — blends with dark theme */}
          <div className="mt-8 inline-flex items-center gap-3
                          animate-fadeUp [animation-delay:0.4s]">
            <span className="text-[0.62rem] tracking-[0.26em] uppercase text-gold/80">
              Brokered by
            </span>
            <img
              src="/assets/exp3.png"
              alt="eXp Realty"
              className="h-11 w-11 object-contain rounded-md
                         ring-1 ring-gold/40 hover:ring-gold/70 transition-all"
            />
          </div>
        </div>
      </section>

      <Properties initialType={type} initialChannel={channel} showHeader={false} />

      {/* CTA strip */}
      <section className="bg-navy2 px-5 md:px-[6%] py-16 border-t border-gold/15">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-serif text-white text-[clamp(1.5rem,3vw,2.4rem)] font-semibold mb-4">
            {cta.headingLead} <span className="italic gold-foil">{cta.headingAccent}</span>
          </h3>
          <p className="text-white/65 leading-[1.8] mb-8 max-w-2xl mx-auto">
            {cta.blurb}
          </p>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = ''; setTimeout(() => document.getElementById('inquire')?.scrollIntoView({behavior: 'smooth'}), 80); }}
             className="btn-gold inline-flex">
            {cta.button}
            <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center text-xs">&rarr;</span>
          </a>
        </div>
      </section>
    </main>
  );
}
