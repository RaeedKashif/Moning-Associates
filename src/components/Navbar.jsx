import { useEffect, useRef, useState } from 'react';

const propertyCats = [
  { href: '#/properties?cat=offmkt', label: 'Off Market Properties' },
  { href: '#/properties?cat=land',   label: 'Lands' },
  { href: '#/properties?cat=luxury', label: 'Luxury Properties' },
  { href: '#/properties?cat=active', label: 'Active Listing' },
  { href: '#/properties',            label: 'View All' },
];

const links = [
  { href: '#services',   label: 'Services',     anchor: true  },
  { type: 'dropdown',    label: 'All off Properties', items: propertyCats },
  { href: '#/blogs',     label: 'All Blogs',    anchor: false },
  { href: '#team',       label: 'Team',         anchor: true  },
];

// Navigate to an in-page anchor. If we're on a separate route, go home first then scroll.
function goToAnchor(e, href) {
  e.preventDefault();
  const id = href.replace('#', '');
  const onHomePage = !window.location.hash.startsWith('#/');
  if (onHomePage) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.hash = '';
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }
}

export default function Navbar({ currentRoute = 'home' }) {
  const [open, setOpen]         = useState(false);
  const [solid, setSolid]       = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileDrop, setMobileDrop] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
  }, [open]);

  useEffect(() => {
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setOpen(false);
    setDropOpen(false);
    setMobileDrop(false);
  }, [currentRoute]);

  const close = () => { setOpen(false); setDropOpen(false); };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[60] h-[76px] flex items-center justify-between
                    px-5 md:px-[6%] transition-all duration-500
                    ${solid
                      ? 'bg-navy shadow-[0_1px_0_rgba(212,168,75,0.18),0_8px_24px_rgba(0,0,0,0.4)]'
                      : 'bg-navy/95 backdrop-blur-xl'}`}
      >
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
                         from-transparent via-gold/60 to-transparent" />

        <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = ''; close(); }}
           className="flex items-center gap-2.5 sm:gap-3 group relative z-10 min-w-0">
          <span className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl overflow-hidden
                           ring-1 ring-gold/45 bg-[#2a1f12] flex items-center justify-center
                           group-hover:ring-gold transition-all duration-300
                           group-hover:shadow-gold">
            <img
              src="/assets/birdhouse.jpeg"
              alt="Moning & Associates birdhouse mark"
              className="w-full h-full object-cover scale-110
                         transition-transform duration-700 group-hover:scale-125"
            />
            <span className="absolute inset-0 bg-gradient-to-tr from-gold/0 to-gold/15
                             pointer-events-none" />
          </span>
          <div className="leading-tight min-w-0">
            <div className="font-serif text-[0.95rem] sm:text-[1.15rem] md:text-[1.35rem]
                            font-semibold gold-foil truncate">
              Moning &amp; Associates
            </div>
            <div className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.65rem]
                            tracking-[0.22em] sm:tracking-[0.28em]
                            uppercase text-white/50 font-medium truncate">
              eXp Realty · DFW Premier
            </div>
          </div>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map(l => {
            if (l.type === 'dropdown') {
              return (
                <li key={l.label} className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(o => !o)}
                    className={`nav-link text-white/85 hover:text-gold text-[0.86rem] font-medium
                                px-3.5 py-2 rounded-md transition-colors
                                inline-flex items-center gap-1.5
                                ${dropOpen || currentRoute === 'properties' ? 'text-gold active' : ''}`}
                  >
                    {l.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                         className={`w-3.5 h-3.5 transition-transform duration-300
                                     ${dropOpen ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {dropOpen && (
                    <div className="absolute top-full right-0 mt-2 w-[260px] dropdown-enter">
                      <div className="bg-navy rounded-xl border border-gold/40
                                      shadow-royal overflow-hidden">
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                        {l.items.map(i => (
                          <a key={i.label}
                             href={i.href}
                             onClick={close}
                             className="flex items-center justify-between gap-3
                                        px-5 py-3.5 text-white text-[0.86rem]
                                        hover:bg-gold hover:text-navy transition-all
                                        border-b border-gold/15 last:border-b-0
                                        group">
                            <span>{i.label}</span>
                            <span className="text-gold/60 group-hover:text-navy
                                             group-hover:translate-x-1 transition-all">→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            }
            const active =
              (l.href === '#/blogs' && currentRoute === 'blogs');
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={l.anchor ? (e) => goToAnchor(e, l.href) : undefined}
                  className={`nav-link text-white/85 hover:text-gold text-[0.86rem] font-medium
                              px-3.5 py-2 rounded-md transition-colors
                              ${active ? 'text-gold active' : ''}`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
          <li className="ml-2 pl-3 border-l border-gold/25">
            <div className="inline-flex items-center gap-2"
                 title="Brokered by eXp Realty">
              <span className="text-[0.55rem] tracking-[0.22em] uppercase
                               text-gold/60 leading-tight text-right">
                Brokered<br/>by
              </span>
              <img
                src="/assets/exp3.png"
                alt="eXp Realty"
                className="h-9 w-9 object-contain rounded-md
                           ring-1 ring-gold/30 hover:ring-gold/60
                           transition-all"
              />
            </div>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => goToAnchor(e, '#contact')}
              className="ml-3 relative inline-flex items-center gap-2
                         bg-gradient-to-r from-gold to-goldLt text-navy font-semibold text-[0.86rem]
                         px-6 py-2.5 rounded-md transition-all duration-300
                         hover:shadow-gold hover:-translate-y-0.5 overflow-hidden group"
            >
              <span className="relative z-10">Contact Us</span>
              <span className="absolute inset-0 -translate-x-full
                               bg-gradient-to-r from-transparent via-white/40 to-transparent
                               group-hover:translate-x-full transition-transform duration-700" />
            </a>
          </li>
        </ul>

        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 relative z-10"
        >
          <span className={`block w-6 h-[2px] bg-gold rounded transition-all
                            ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-6 h-[2px] bg-gold rounded transition-all
                            ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-gold rounded transition-all
                            ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[76px] bottom-0 z-50 bg-navy
                    transition-all duration-300 ease-out overflow-y-auto
                    ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        <div className="px-5 py-8 flex flex-col">
          {links.map(l => {
            if (l.type === 'dropdown') {
              return (
                <div key={l.label} className="border-b border-white/[0.08]">
                  <button
                    onClick={() => setMobileDrop(o => !o)}
                    className="w-full flex items-center justify-between text-white
                               hover:text-gold text-xl font-medium py-4 transition-colors"
                  >
                    {l.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                         className={`w-4 h-4 transition-transform duration-300
                                     ${mobileDrop ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {mobileDrop && (
                    <div className="pl-4 pb-3 flex flex-col gap-1">
                      {l.items.map(i => (
                        <a key={i.label}
                           href={i.href}
                           onClick={close}
                           className="text-white/80 hover:text-gold text-base py-2 transition-colors">
                          · {i.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  if (l.anchor) goToAnchor(e, l.href);
                  close();
                }}
                className="block text-white hover:text-gold text-xl font-medium
                           py-4 border-b border-white/[0.08] transition-colors"
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={(e) => { goToAnchor(e, '#contact'); close(); }}
            className="mt-6 bg-gradient-to-r from-gold to-goldLt text-navy font-semibold text-center
                       px-6 py-4 rounded-xl text-base hover:shadow-gold transition"
          >
            Contact Us &rarr;
          </a>

          <div className="mt-8 pt-6 border-t border-gold/20">
            <p className="text-gold/80 text-xs tracking-[0.18em] uppercase mb-2">
              Reach Steven Directly
            </p>
            <a href="tel:4695809228" className="block text-white py-1.5">
              469-580-9228
            </a>
            <a href="mailto:steven.moning@exprealty.com"
               className="block text-white py-1.5 text-sm">
              steven.moning@exprealty.com
            </a>
          </div>

          {/* Mobile eXp Realty partnership badge */}
          <div className="mt-6 pt-6 border-t border-gold/20 flex items-center gap-4">
            <span className="text-gold/80 text-[0.65rem] tracking-[0.22em] uppercase">
              Brokered by
            </span>
            <img
              src="/assets/exp3.png"
              alt="eXp Realty"
              className="h-12 w-12 object-contain rounded-md
                         ring-1 ring-gold/40"
            />
          </div>
        </div>
      </div>
    </>
  );
}
