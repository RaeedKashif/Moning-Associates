import { useState, useEffect } from 'react';

const filters = [
  { key: 'all',    label: 'All Properties' },
  { key: 'luxury', label: 'Luxury' },
  { key: 'active', label: 'Active Listing' },
  { key: 'land',   label: 'Lands' },
  { key: 'offmkt', label: 'Off Market' },
];

// Admin API that fronts the MongoDB listings (Redis-cached). Override in prod
// with VITE_LISTINGS_API_URL if the admin app ever moves.
const API_BASE = import.meta.env.VITE_LISTINGS_API_URL || 'https://stevenmoning-admin.vercel.app';

// Fallback imagery for land parcels (imported listings ship no photos).
const LAND_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
];

// property_type (Mongo) -> filter key used by the pills above.
const TYPE_TO_CAT = { luxury: 'luxury', land: 'land', off_market: 'offmkt' };

function formatPrice(n) {
  if (n == null) return 'Price on request';
  return '$' + Number(n).toLocaleString('en-US');
}

function lotDisplay(l) {
  if (l.lot_size_acres) return `${l.lot_size_acres} acres`;
  if (l.lot_size_sqft) return `${Number(l.lot_size_sqft).toLocaleString('en-US')} sq ft`;
  return '—';
}

// Map a public API listing (meta already stripped server-side) to a card.
function toCard(l, i) {
  const cat = TYPE_TO_CAT[l.property_type] || 'active';
  const acres = l.lot_size_acres ? ` · ${l.lot_size_acres} ac` : '';
  const badge = cat === 'land' ? `Land${acres}`
    : cat === 'offmkt' ? 'Off Market'
    : cat === 'luxury' ? 'Luxury Estate' : 'Active';
  return {
    cat,
    badge,
    title: l.title || l.address || 'Untitled listing',
    location: [l.city, l.state].filter(Boolean).join(', ') || l.address || 'Texas',
    price: formatPrice(l.price),
    beds: cat === 'land' ? '—' : (l.bedrooms ?? '—'),
    baths: cat === 'land' ? '—' : (l.bathrooms ?? '—'),
    sqft: cat === 'land' ? lotDisplay(l) : (l.square_footage ? Number(l.square_footage).toLocaleString('en-US') : '—'),
    image: (l.images && l.images[0]) || LAND_IMAGES[i % LAND_IMAGES.length],
  };
}

const Stat = ({ v, l }) => (
  <div className="text-center">
    <div className="font-serif text-white text-lg font-semibold leading-none">{v}</div>
    <div className="text-[0.65rem] text-white/45 uppercase tracking-[0.18em] mt-1">{l}</div>
  </div>
);

export default function Properties({ initialFilter = 'all', limit = null, showHeader = true }) {
  const [active, setActive] = useState(initialFilter);
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => { setActive(initialFilter); }, [initialFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listings?status=published&limit=200`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data } = await res.json();
        if (cancelled) return;
        setProperties((data || []).map(toCard));
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  let visible = active === 'all' ? properties : properties.filter(p => p.cat === active);
  if (limit) visible = visible.slice(0, limit);

  return (
    <section id="properties" className="relative bg-navy
                                         py-16 md:py-24 px-5 md:px-[6%] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pattern-crown opacity-40" />

      {showHeader && (
        <div className="relative reveal max-w-3xl mb-10">
          <span className="text-[0.72rem] font-semibold tracking-[0.32em]
                           uppercase text-gold flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-gold" /> The Portfolio
          </span>
          <h2 className="font-serif font-semibold leading-[1.08]
                         text-[clamp(1.9rem,4vw,3.4rem)] text-white">
            Hand-picked properties,<br/>
            <span className="italic gold-foil">curated for discerning buyers.</span>
          </h2>
          <p className="text-white/65 text-[clamp(0.9rem,1.5vw,1.02rem)] leading-[1.8] max-w-xl mt-4">
            A glimpse at the DFW homes, estates, and off-market opportunities we're
            currently representing. Reach out for the full list — many never see the MLS.
          </p>
        </div>
      )}

      {/* Filter pills - more opaque now */}
      <div className="relative reveal mb-6 flex flex-wrap gap-2 md:gap-3">
        {filters.map(f => {
          const count = f.key === 'all'
            ? properties.length
            : properties.filter(p => p.cat === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => {
                setActive(f.key);
                const newHash = f.key === 'all' ? '#/properties' : `#/properties?cat=${f.key}`;
                if (window.location.hash !== newHash) {
                  window.history.replaceState(null, '', newHash);
                }
              }}
              className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5
                          rounded-full text-[0.72rem] md:text-[0.78rem] font-semibold
                          tracking-[0.12em] uppercase border transition-all whitespace-nowrap
                          ${active === f.key
                            ? 'bg-gold text-navy border-gold shadow-gold'
                            : 'bg-navy2 text-white border-gold/40 hover:border-gold hover:bg-gold hover:text-navy'}`}
            >
              {f.label}
              <span className={`text-[0.65rem] font-bold rounded-full px-1.5 py-0.5 leading-none
                                ${active === f.key ? 'bg-navy/15 text-navy' : 'bg-gold/20 text-gold'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative text-white/55 text-[0.78rem] mb-6">
        {status === 'loading'
          ? 'Loading listings…'
          : status === 'error'
          ? 'Unable to load listings right now.'
          : <>Showing <span className="text-gold font-semibold">{visible.length}</span> of{' '}
             <span className="text-gold font-semibold">{properties.length}</span> properties</>}
      </div>

      {status === 'loading' && (
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-navy2 border border-gold/15 rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-white/5" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-white/10 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="h-px bg-gold/10 my-4" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="relative text-center py-16 border border-gold/20 rounded-2xl bg-navy2/60">
          <div className="font-serif text-gold text-xl mb-2">Couldn't load listings</div>
          <div className="text-white/55 text-sm">Please refresh, or reach out and we'll send the full list.</div>
        </div>
      )}

      {status === 'ready' && visible.length === 0 && (
        <div className="relative text-center py-16 border border-gold/20 rounded-2xl bg-navy2/60">
          <div className="font-serif text-gold text-xl mb-2">No properties in this category</div>
          <div className="text-white/55 text-sm">Check back soon or browse all listings.</div>
        </div>
      )}

      <div key={active}
           className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {visible.map((p, i) => (
          <article
            key={`${p.title}-${i}`}
            style={{ animationDelay: `${(i % 3) * 0.08}s` }}
            className={`animate-fadeUp group royal-card
                        bg-navy2 border border-gold/20 rounded-2xl overflow-hidden
                        transition-all duration-500
                        hover:-translate-y-2 hover:border-gold/55 hover:shadow-royal`}
          >
            <div className="relative aspect-[4/3] overflow-hidden kenburns-on-hover">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute top-4 left-4 price-ribbon
                              text-navy font-semibold text-[0.78rem] tracking-wider
                              px-3.5 py-1.5 rounded-md uppercase">
                {p.badge}
              </div>
              <div className="absolute bottom-4 right-4 font-serif text-gold
                              text-[1.4rem] font-semibold drop-shadow-lg">
                {p.price}
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-white text-[1.3rem] font-semibold leading-tight
                             group-hover:text-gold transition-colors">
                {p.title}
              </h3>
              <div className="flex items-center gap-1.5 text-white/65 text-[0.85rem] mt-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="1.6" className="w-3.5 h-3.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {p.location}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-gold/20">
                <Stat v={p.beds}  l="Beds" />
                <Stat v={p.baths} l="Baths" />
                <Stat v={p.sqft}  l="Sq Ft" />
              </div>

              <a href="#contact"
                 className="mt-5 flex items-center justify-between
                            text-gold text-[0.85rem] font-semibold tracking-wider uppercase
                            group/cta">
                <span>Request Details</span>
                <span className="w-7 h-7 rounded-full bg-gold/20 grid place-items-center
                                 group-hover/cta:bg-gold group-hover/cta:text-navy
                                 group-hover/cta:translate-x-1 transition-all">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
