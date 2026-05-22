import { useState, useEffect } from 'react';

const filters = [
  { key: 'all',    label: 'All Properties' },
  { key: 'luxury', label: 'Luxury' },
  { key: 'active', label: 'Active Listing' },
  { key: 'land',   label: 'Lands' },
  { key: 'offmkt', label: 'Off Market' },
];

const properties = [
  {
    cat: 'luxury',
    badge: 'Luxury Estate',
    title: 'The Highland Estate',
    location: 'Highland Park, Dallas',
    price: '$4,250,000',
    beds: 6, baths: 7, sqft: '8,420',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'active',
    badge: 'New Listing',
    title: 'Modern Frisco Manor',
    location: 'Frisco, TX',
    price: '$1,895,000',
    beds: 5, baths: 5, sqft: '5,210',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'luxury',
    badge: 'Featured',
    title: 'Preston Hollow Residence',
    location: 'Preston Hollow, Dallas',
    price: '$3,675,000',
    beds: 5, baths: 6, sqft: '6,800',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'offmkt',
    badge: 'Off Market',
    title: 'Lakefront Retreat',
    location: 'Southlake, TX',
    price: '$2,950,000',
    beds: 5, baths: 5, sqft: '5,800',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'land',
    badge: 'Land · 12 ac',
    title: 'Westlake Land Parcel',
    location: 'Westlake, TX',
    price: '$1,350,000',
    beds: '—', baths: '—', sqft: '12 acres',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'active',
    badge: 'Active',
    title: 'Plano Heritage Home',
    location: 'West Plano, TX',
    price: '$1,125,000',
    beds: 4, baths: 4, sqft: '4,150',
    image: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'luxury',
    badge: 'Estate',
    title: 'Volunteer Drive Manor',
    location: 'Westlake, TX',
    price: '$5,890,000',
    beds: 7, baths: 8, sqft: '11,200',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'offmkt',
    badge: 'Pocket Listing',
    title: 'Turtle Creek Penthouse',
    location: 'Uptown Dallas, TX',
    price: '$2,180,000',
    beds: 3, baths: 4, sqft: '3,940',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    cat: 'land',
    badge: 'Land · 5 ac',
    title: 'Argyle Rolling Acres',
    location: 'Argyle, TX',
    price: '$685,000',
    beds: '—', baths: '—', sqft: '5 acres',
    image: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=1200&q=80',
  },
];

const Stat = ({ v, l }) => (
  <div className="text-center">
    <div className="font-serif text-white text-lg font-semibold leading-none">{v}</div>
    <div className="text-[0.65rem] text-white/45 uppercase tracking-[0.18em] mt-1">{l}</div>
  </div>
);

export default function Properties({ initialFilter = 'all', limit = null, showHeader = true }) {
  const [active, setActive] = useState(initialFilter);

  useEffect(() => { setActive(initialFilter); }, [initialFilter]);

  let visible = active === 'all' ? properties : properties.filter(p => p.cat === active);
  if (limit) visible = visible.slice(0, limit);

  return (
    <section id="properties" className="relative bg-royal-radial
                                         py-16 md:py-24 px-5 md:px-[6%] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pattern-crown opacity-40" />
      <div className="pointer-events-none absolute top-1/3 -left-40 w-[480px] h-[480px]
                      rounded-full bg-gold/[0.08] blur-3xl" />

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
        Showing <span className="text-gold font-semibold">{visible.length}</span> of{' '}
        <span className="text-gold font-semibold">{properties.length}</span> properties
      </div>

      {visible.length === 0 && (
        <div className="relative text-center py-16 border border-gold/20 rounded-2xl bg-navy2/60">
          <div className="font-serif text-gold text-xl mb-2">No properties in this category</div>
          <div className="text-white/55 text-sm">Check back soon or browse all listings.</div>
        </div>
      )}

      <div key={active}
           className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {visible.map((p, i) => (
          <article
            key={p.title}
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
