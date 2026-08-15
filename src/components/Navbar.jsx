import { useEffect, useRef, useState } from 'react';
import { TYPE_BY_KEY, CHANNEL_BY_KEY, listingHref } from '../lib/propertyCategories.js';
import { INQUIRY_FORMS } from '../lib/inquiryForms.js';

// The menu mirrors how listings are actually filed: what a property is on the
// top line, how it sells underneath it. Order is its own thing — the specific
// types first, "View All" last.
const CHANNEL_KEYS = ['on_market', 'off_market', 'wholesale'];

const propertyCats = ['land', 'luxury', 'dorms', 'all'].map(key => ({
  key,
  href: listingHref(key),
  label: TYPE_BY_KEY[key].navLabel,
  // Every type carries every channel, so each one can be narrowed in place.
  channels: CHANNEL_KEYS.map(c => ({
    key: c,
    href: listingHref(key, c),
    label: CHANNEL_BY_KEY[c].pillLabel,
  })),
}));

// The same three channels across every type — the pages the site has always
// published at their own URLs.
const propertyChannels = CHANNEL_KEYS.map(key => ({
  key,
  href: listingHref('all', key),
  label: CHANNEL_BY_KEY[key].navLabel,
}));

const links = [
  { href: '#/',          label: 'Home',         home: true    },
  { href: '#services',   label: 'Services',     anchor: true  },
  { type: 'dropdown',    label: 'All off Properties',
    items: propertyCats, channels: propertyChannels },
  { href: '#/blogs',     label: 'All Blogs',    anchor: false },
];

// Back to the top of the landing page, from wherever you are.
function goHome(e) {
  e.preventDefault();
  if (window.location.hash) window.location.hash = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

export default function Navbar({ currentRoute = 'home', activeHref = null }) {
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
                      : 'bg-navy'}`}
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
                    <div className="absolute top-full right-0 mt-2 w-[300px] dropdown-enter">
                      <div className="bg-navy rounded-xl border border-gold/40
                                      shadow-royal overflow-hidden">
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                        {l.items.map(i => (
                          <div key={i.key} className="border-b border-gold/15 last:border-b-0">
                            <a href={i.href}
                               onClick={close}
                               className="flex items-center justify-between gap-3
                                          px-5 pt-3.5 pb-2 text-white text-[0.86rem]
                                          hover:text-gold transition-colors group">
                              <span>{i.label}</span>
                              <span className="text-gold/60 group-hover:text-gold
                                               group-hover:translate-x-1 transition-all">→</span>
                            </a>
                            {/* How each type sells — the second level, in place. */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 px-5 pb-3">
                              {i.channels.map(c => (
                                <a key={c.key} href={c.href} onClick={close}
                                   className="text-white/45 hover:text-gold text-[0.74rem]
                                              transition-colors">
                                  {c.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="bg-navy2 px-5 py-3.5 border-t border-gold/25">
                          <span className="block text-[0.6rem] font-semibold tracking-[0.2em]
                                           uppercase text-gold/70 mb-2">
                            Across every type
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {l.channels.map(c => (
                              <a key={c.key} href={c.href} onClick={close}
                                 className="text-white/70 hover:text-gold text-[0.8rem]
                                            transition-colors">
                                {c.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            }
            const active = l.href === activeHref;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={
                    l.home   ? (e) => { goHome(e); close(); }
                  : l.anchor ? (e) => goToAnchor(e, l.href)
                  : undefined
                  }
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
          {/* The two calls to action that replaced "Contact Us" — both in gold,
              so the choice itself is the most prominent thing in the bar. */}
          {INQUIRY_FORMS.map((f, i) => (
            <li key={f.key}>
              <a
                href={`#/${f.slug}`}
                onClick={close}
                aria-current={activeHref === `#/${f.slug}` ? 'page' : undefined}
                className={`inline-flex items-center gap-2 font-semibold text-[0.86rem]
                            px-5 py-2.5 rounded-md transition-all duration-300
                            border-2 border-gold hover:-translate-y-0.5 hover:shadow-gold
                            ${i === 0 ? 'ml-3' : 'ml-2'}
                            ${activeHref === `#/${f.slug}`
                              ? 'bg-goldLt border-goldLt text-navy'
                              : 'bg-gold text-navy hover:bg-goldLt hover:border-goldLt'}`}
              >
                {f.navLabel}
              </a>
            </li>
          ))}
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
                    <div className="pl-4 pb-4 flex flex-col gap-3">
                      {l.items.map(i => (
                        <div key={i.key}>
                          <a href={i.href}
                             onClick={close}
                             className="block text-white/85 hover:text-gold text-base
                                        py-1.5 transition-colors">
                            · {i.label}
                          </a>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 pl-4">
                            {i.channels.map(c => (
                              <a key={c.key} href={c.href} onClick={close}
                                 className="text-white/45 hover:text-gold text-sm py-1
                                            transition-colors">
                                {c.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="pt-3 mt-1 border-t border-white/[0.08]">
                        <span className="block text-[0.6rem] font-semibold tracking-[0.2em]
                                         uppercase text-gold/70 mb-2">
                          Across every type
                        </span>
                        {l.channels.map(c => (
                          <a key={c.key} href={c.href} onClick={close}
                             className="block text-white/70 hover:text-gold text-[0.95rem]
                                        py-1.5 transition-colors">
                            {c.label}
                          </a>
                        ))}
                      </div>
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
                  if (l.home) goHome(e);
                  else if (l.anchor) goToAnchor(e, l.href);
                  close();
                }}
                className="block text-white hover:text-gold text-xl font-medium
                           py-4 border-b border-white/[0.08] transition-colors"
              >
                {l.label}
              </a>
            );
          })}
          <div className="mt-6 grid gap-3">
            {INQUIRY_FORMS.map(f => (
              <a
                key={f.key}
                href={`#/${f.slug}`}
                onClick={close}
                className="bg-gold hover:bg-goldLt text-navy font-semibold text-center
                           px-6 py-4 rounded-xl text-base hover:shadow-gold transition"
              >
                {f.toggleLabel} &rarr;
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gold/20">
            <p className="text-gold/80 text-xs tracking-[0.18em] uppercase mb-2">
              Reach Steven Directly
            </p>
            <a href="tel:+14695809228" className="block text-white py-1.5">
              +1 469-580-9228
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
