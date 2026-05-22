import Blogs from './Blogs.jsx';

export default function BlogsPage() {
  return (
    <main className="pt-[76px]">
      {/* Page hero */}
      <section className="relative bg-royal-deep overflow-hidden px-5 md:px-[6%] py-14 md:py-28">
        <div className="pointer-events-none absolute inset-0 pattern-crown opacity-40" />
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px]
                        rounded-full bg-gold/10 blur-3xl animate-pulseGold" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[460px] h-[460px]
                        rounded-full bg-wine/15 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5 animate-fadeUp">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-gold" />
            <span className="text-[0.72rem] font-semibold tracking-[0.32em] uppercase text-gold">
              The Journal
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-gold via-gold to-transparent" />
          </div>
          <h1 className="font-serif font-semibold leading-[1.05]
                         text-[clamp(2.4rem,5vw,4.4rem)] text-white animate-fadeUp [animation-delay:0.1s]">
            All <span className="italic gold-foil">Blogs</span>
          </h1>
          <p className="text-white/70 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.85] max-w-2xl mx-auto mt-6
                        animate-fadeUp [animation-delay:0.2s]">
            DFW market notes, buyer & seller playbooks, investor strategy, and
            luxury-living deep dives — written by the team actually closing the deals.
          </p>

          <div className="royal-divider mt-8 animate-fadeUp [animation-delay:0.3s]">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="inline-block w-2 h-2 rotate-45 bg-gold" />
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </div>
      </section>

      <Blogs showHeader={false} />

      <section className="bg-navy2 px-5 md:px-[6%] py-16 border-t border-gold/15">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-serif text-white text-[clamp(1.5rem,3vw,2.4rem)] font-semibold mb-4">
            Want these <span className="italic gold-foil">in your inbox?</span>
          </h3>
          <p className="text-white/65 leading-[1.8] mb-8 max-w-2xl mx-auto">
            One short market note a month. No fluff, no spam — just the things we
            think DFW buyers, sellers, and investors should actually know.
          </p>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = ''; setTimeout(() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}), 80); }}
             className="btn-gold inline-flex">
            Subscribe to Updates
            <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center text-xs">&rarr;</span>
          </a>
        </div>
      </section>
    </main>
  );
}
