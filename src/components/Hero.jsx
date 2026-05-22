export default function Hero() {
  return (
    <section id="top" className="relative grid lg:grid-cols-2 lg:min-h-screen overflow-hidden">
      {/* Left: copy */}
      <div className="relative z-10 bg-royal-deep flex flex-col justify-start lg:justify-center
                      px-5 sm:px-6 md:px-[6%] pt-24 sm:pt-28 lg:pt-28 xl:pt-32
                      pb-10 sm:pb-14 lg:pb-20 xl:pb-28 overflow-hidden">
        {/* Royal radial accents */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px]
                        rounded-full bg-gold/[0.10] blur-3xl animate-pulseGold" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 w-[360px] h-[360px]
                        rounded-full bg-wine/20 blur-3xl" />

        {/* Crown pattern decorative */}
        <div className="pointer-events-none absolute inset-0 pattern-crown opacity-50" />

        {/* Floating ornament */}
        <div className="pointer-events-none absolute top-24 right-10 hidden lg:block
                        animate-slowSpin opacity-30">
          <svg viewBox="0 0 100 100" className="w-32 h-32 text-gold">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="0.3"/>
            <path d="M50 4 L52 50 L50 96 L48 50 Z" fill="currentColor" opacity="0.5"/>
            <path d="M4 50 L50 52 L96 50 L50 48 Z" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>

        <div className="relative flex items-center gap-3 mb-6 animate-fadeUp">
          <span className="w-10 h-px bg-gradient-to-r from-gold to-transparent" />
          <span className="text-[0.7rem] font-semibold tracking-[0.32em]
                           uppercase text-gold">
            Dallas–Fort Worth · Luxury Realty
          </span>
        </div>

        <h1 className="relative font-serif text-white font-semibold leading-[1.02]
                       text-[clamp(2.2rem,4.6vw,4.6rem)] animate-fadeUp [animation-delay:0.1s]">
          Turning Your
          <span className="block italic gold-foil">Dreams into</span>
          Addresses.
        </h1>

        <div className="relative royal-divider mt-6 mb-2 animate-fadeUp [animation-delay:0.15s] justify-start">
          <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <span className="inline-block w-2 h-2 rotate-45 bg-gold" />
          <span className="h-px w-16 bg-gradient-to-r from-gold via-gold to-transparent" />
        </div>

        <p className="relative mt-2 text-white/70 max-w-xl text-[clamp(0.95rem,1.4vw,1.05rem)]
                      leading-[1.85] animate-fadeUp [animation-delay:0.2s]">
          Steven Moning has spent nearly two decades walking families, first-time buyers,
          and seasoned investors through the DFW market — through good markets and bad.
          You'll get straight answers, the right comps, and an agent who actually
          picks up the phone.
        </p>

        <div className="relative mt-10 flex flex-wrap items-center gap-4
                        animate-fadeUp [animation-delay:0.3s]">
          <a href="#contact" className="btn-gold">
            Let's Get Started
            <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center
                             text-xs">&rarr;</span>
          </a>
          <a href="#services" className="btn-ghost">View Services</a>
        </div>

        <div className="relative mt-10 sm:mt-14 grid grid-cols-3 sm:flex sm:flex-wrap sm:items-center
                        gap-4 sm:gap-8 animate-fadeUp [animation-delay:0.4s]">
          {[
            { n: '18+', l: 'Years Active' },
            { n: '500+', l: 'Deals Closed' },
            { n: '4.9',  l: 'Client Rating' },
          ].map((s, i, arr) => (
            <div
              key={s.l}
              className={`relative group cursor-default ${i < arr.length - 1
                ? 'sm:after:absolute sm:after:right-[-1rem] sm:after:top-[15%] sm:after:h-[70%] sm:after:w-px sm:after:bg-gold/20'
                : ''}`}
            >
              <div className="font-serif text-gold font-semibold leading-none
                              text-[clamp(1.5rem,5vw,2.2rem)]
                              transition-transform duration-300 group-hover:scale-110 origin-left">
                {s.n}
              </div>
              <div className="text-[0.65rem] sm:text-[0.72rem] text-white/55 mt-1 tracking-wider uppercase">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: portrait */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[16/11] lg:aspect-auto
                      lg:h-auto lg:max-h-none lg:min-h-[640px] overflow-hidden bg-navy">
        <div className="absolute inset-0 animate-kenburns">
          <img
            src="/assets/Black Hi-Res.jpg"
            alt="Steven Moning — Realtor, Moning & Associates"
            loading="eager"
            className="w-full h-full object-cover
                       object-[center_top] sm:object-[center_top] md:object-[center_15%] lg:object-[center_18%]"
          />
        </div>
        {/* Royal vignette - darker */}
        <div className="absolute inset-0 pointer-events-none
                        bg-[linear-gradient(to_right,rgba(6,16,28,0.55)_0%,transparent_30%),linear-gradient(to_top,rgba(6,16,28,0.85)_0%,transparent_55%),linear-gradient(to_bottom,rgba(6,16,28,0.4)_0%,transparent_25%)]" />

        {/* Gold corner ornament */}
        <div className="absolute top-6 right-6 hidden md:block animate-fadeIn [animation-delay:0.6s]">
          <div className="relative w-16 h-16">
            <span className="absolute top-0 right-0 w-full h-px bg-gold/60" />
            <span className="absolute top-0 right-0 h-full w-px bg-gold/60" />
            <span className="absolute top-2 right-2 w-2 h-2 rotate-45 bg-gold" />
          </div>
        </div>

        {/* Floating name card with royal frame */}
        <div className="absolute bottom-4 right-4 left-4
                        md:bottom-10 md:right-10 md:left-auto
                        max-w-[calc(100%-2rem)] md:max-w-none
                        animate-floatYLg">
          <div className="relative bg-navy/95 backdrop-blur-lg border border-gold/35
                          rounded-xl md:rounded-2xl
                          px-4 py-3 md:p-7 text-right shadow-royal
                          before:absolute before:inset-0 before:rounded-xl md:before:rounded-2xl
                          before:bg-gradient-to-br before:from-gold/10 before:to-transparent
                          before:pointer-events-none">
            <div className="relative">
              <div className="flex items-center justify-end gap-2 mb-1 md:mb-2">
                <span className="w-5 md:w-6 h-px bg-gold" />
                <span className="inline-block w-1.5 h-1.5 rotate-45 bg-gold" />
              </div>
              <h3 className="font-serif text-white font-semibold
                             text-[1rem] md:text-[clamp(1.1rem,2.4vw,1.65rem)] leading-tight">
                Steven Moning
              </h3>
              <p className="text-gold text-[0.7rem] md:text-sm mt-0.5 font-medium tracking-wider">
                CEO · eXp Realtor
                <span className="hidden md:inline"> · Moning &amp; Associates</span>
              </p>
              <div className="text-white/40 text-[0.65rem] tracking-[0.22em]
                              uppercase mt-3 hidden md:block">
                Licensed Since 2006
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
