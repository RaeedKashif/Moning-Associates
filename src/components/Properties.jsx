import { useState, useEffect, useRef } from 'react';
import {
  PROPERTY_TYPES, SALES_CHANNELS, CHANNEL_BY_KEY,
  listingHref, listingChannel, listingType,
} from '../lib/propertyCategories.js';
import { listingAddress, useStreetView, mapsLink } from '../lib/streetView.js';

// Admin API that fronts the MongoDB listings (Redis-cached). Override in prod
// with VITE_LISTINGS_API_URL if the admin app ever moves.
const API_BASE = import.meta.env.VITE_LISTINGS_API_URL || 'https://stevenmoning-admin.vercel.app';

const PAGE_SIZE = 9;

// The two axes the listings hang off. `property_type` says what a property is,
// `sales_channel` says how it sells, and every type carries every channel — so
// a parcel can be Land AND Wholesale and counts under both.
const typeFilters = PROPERTY_TYPES.map(({ key, label }) => ({ key, label }));
const channelFilters = SALES_CHANNELS.map(({ key, pillLabel }) => ({ key, label: pillLabel }));

// The badge says what the property is. Singular, because it sits on one card.
const TYPE_BADGE = { luxury: 'Luxury Estate', land: 'Land', dorms: 'Dorm' };

const matchesType = (p, key) => key === 'all' || p.type === key;
const matchesChannel = (p, key) => key === 'all' || p.channel === key;
const matches = (p, type, channel) => matchesType(p, type) && matchesChannel(p, channel);

// Never invent a figure. A listing with no price in the source data says so.
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
function toCard(l) {
  const type = listingType(l);
  const channel = listingChannel(l);
  // Land parcels have no beds/baths/interior sqft — show lot facts instead.
  const stats = type === 'land'
    ? [
        { l: 'Lot size', v: lotDisplay(l) },
        { l: 'Zip', v: l.zip_code || '—' },
      ]
    : [
        { l: 'Beds', v: l.bedrooms ?? '—' },
        { l: 'Baths', v: l.bathrooms ?? '—' },
        { l: 'Sq ft', v: l.square_footage ? Number(l.square_footage).toLocaleString('en-US') : '—' },
      ];
  return {
    id: l.id,
    type,
    channel,
    badge: TYPE_BADGE[type] || 'Property',
    // Only an on-market listing has an MLS number; the other two channels wear
    // their channel instead, so the corner chip never sits empty.
    channelBadge: channel === 'on_market' ? null : CHANNEL_BY_KEY[channel].badge,
    title: l.title || l.address || 'Untitled listing',
    location: [l.city, l.state].filter(Boolean).join(', ') || l.address || 'Texas',
    price: formatPrice(l.price),
    mls: l.mls_number || null,
    stats,
    // Only ever a real photo of the parcel. No stock stand-ins.
    image: (l.images && l.images[0]) || null,
    // Used only when there is no photo: a street-level view of this exact
    // address, labelled as such so it never reads as a listing photograph.
    address: listingAddress(l),
  };
}

// Shown when a listing has no photograph of its own. Deliberately a branded
// panel, not a stock photo: we never imply an image is of the actual parcel.
const NoPhoto = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center gap-2
                  bg-navy text-gold/35">
    <div className="pointer-events-none absolute inset-0 pattern-crown opacity-60" />
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1"
         className="relative w-8 h-8">
      <path d="M3 20h18" />
      <path d="M5 20V10l7-4 7 4v10" />
      <path d="M10 20v-5h4v5" />
    </svg>
    <span className="relative text-[0.6rem] tracking-[0.24em] uppercase text-white/30">
      Photo coming soon
    </span>
  </div>
);

// A street-level photo of the address, from Google. Not a photo of the parcel
// itself, so it says what it is rather than passing for a listing shot.
function StreetView({ url, address, title }) {
  return (
    <>
      <img src={url} alt={`Street view of ${title}`} loading="lazy"
           className="w-full h-full object-cover" />
      <a href={mapsLink(address)} target="_blank" rel="noopener noreferrer"
         className="absolute bottom-0 inset-x-0 flex items-center justify-between gap-2
                    bg-navy/85 px-3 py-1.5 text-[0.6rem] tracking-[0.14em] uppercase
                    text-white/60 hover:text-gold transition-colors">
        <span>Street view — not a listing photo</span>
        <span aria-hidden="true">Map ↗</span>
      </a>
    </>
  );
}

function PropertyCard({ p }) {
  // Only asked for when the listing has no photograph of its own.
  const streetView = useStreetView(p.image ? null : p.address);

  return (
    <article className="flex flex-col bg-navy2 border border-gold/20 rounded-lg overflow-hidden
                        transition-colors duration-200 hover:border-gold/60">
      <div className="relative aspect-[4/3] border-b border-gold/15">
        {p.image
          ? <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
          : streetView
            ? <StreetView url={streetView} address={p.address} title={p.title} />
            : <NoPhoto />}

        <span className="absolute top-3 left-3 bg-gold text-navy rounded
                         text-[0.62rem] font-semibold tracking-[0.14em] uppercase px-2.5 py-1">
          {p.badge}
        </span>

        {/* What it is on the left, how it sells on the right. An off-market or
            wholesale deal is never on the MLS, so these never collide. */}
        {p.channelBadge ? (
          <span className="absolute top-3 right-3 bg-navy/90 border border-gold/40 text-gold
                           rounded text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-2 py-1">
            {p.channelBadge}
          </span>
        ) : p.mls ? (
          <span className="absolute top-3 right-3 bg-navy/90 border border-gold/25 text-white/70
                           rounded text-[0.6rem] tracking-[0.1em] px-2 py-1">
            MLS {p.mls}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="font-serif text-gold text-[1.6rem] font-semibold leading-none">
          {p.price}
        </div>

        <h3 className="text-white text-[1.02rem] font-semibold leading-snug mt-2.5">
          {p.title}
        </h3>
        <div className="text-white/55 text-[0.82rem] mt-1">{p.location}</div>

        <dl className="mt-4 pt-4 border-t border-gold/15 space-y-1.5 text-[0.82rem]">
          {p.stats.map((s) => (
            <div key={s.l} className="flex items-baseline justify-between gap-3">
              <dt className="text-white/45">{s.l}</dt>
              <dd className="text-white font-medium">{s.v}</dd>
            </div>
          ))}
        </dl>

        <a href="#inquire"
           className="mt-auto pt-4 flex items-center justify-between
                      text-gold hover:text-goldLt text-[0.76rem] font-semibold
                      tracking-[0.14em] uppercase transition-colors">
          <span>Request details</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </article>
  );
}

// One row of filter pills. Both levels use the same pills; the caption sits in
// a fixed column so both rows of pills share one left edge — stacked rows that
// start at different x read as a mistake rather than as a hierarchy.
function FilterRow({ caption, options, active, countFor, onSelect }) {
  return (
    <div className="grid gap-x-6 gap-y-3 px-4 py-4 md:px-6 md:py-5
                    sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center">
      <span className="text-[0.62rem] font-semibold tracking-[0.22em]
                       uppercase text-white/40 leading-snug">
        {caption}
      </span>
      <div className="flex flex-wrap gap-2 md:gap-2.5">
        {options.map(o => {
          const on = active === o.key;
          const count = countFor(o.key);
          return (
            <button
              key={o.key}
              onClick={() => onSelect(o.key)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5
                          rounded-full text-[0.72rem] md:text-[0.78rem] font-semibold
                          tracking-[0.12em] uppercase border transition-colors whitespace-nowrap
                          ${on
                            ? 'bg-gold text-navy border-gold'
                            : 'bg-navy2 text-white border-gold/40 hover:border-gold'}
                          ${!on && count === 0 ? 'opacity-55 hover:opacity-100' : ''}`}
            >
              {o.label}
              <span className={`text-[0.65rem] font-bold rounded-full px-1.5 py-0.5 leading-none
                                ${on ? 'bg-navy/15 text-navy' : 'bg-gold/20 text-gold'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  // Compact window of page numbers around the current page.
  const pages = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  const btn = 'min-w-9 h-9 px-3 grid place-items-center rounded border text-[0.8rem] font-semibold transition-colors';

  return (
    <nav aria-label="Pagination" className="relative mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btn} bg-navy2 text-white border-gold/30 hover:border-gold
                    disabled:opacity-35 disabled:hover:border-gold/30`}
      >
        Prev
      </button>

      {pages.map((n, i) =>
        n === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-white/35 text-sm">…</span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`${btn} ${n === page
              ? 'bg-gold text-navy border-gold'
              : 'bg-navy2 text-white border-gold/30 hover:border-gold'}`}
          >
            {n}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        className={`${btn} bg-navy2 text-white border-gold/30 hover:border-gold
                    disabled:opacity-35 disabled:hover:border-gold/30`}
      >
        Next
      </button>
    </nav>
  );
}

export default function Properties({
  initialType = 'all',
  initialChannel = 'all',
  limit = null,
  showHeader = true,
}) {
  const [type, setType] = useState(initialType);
  const [channel, setChannel] = useState(initialChannel);
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [page, setPage] = useState(1);
  const gridTop = useRef(null);

  useEffect(() => {
    setType(initialType);
    setChannel(initialChannel);
    setPage(1);
  }, [initialType, initialChannel]);

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

  const matching = properties.filter(p => matches(p, type, channel));

  // `limit` (the homepage teaser) shows a fixed slice and never paginates.
  const paginated = !limit;
  const pageCount = paginated ? Math.ceil(matching.length / PAGE_SIZE) : 1;
  const safePage = Math.min(page, Math.max(pageCount, 1));
  const visible = paginated
    ? matching.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    : matching.slice(0, limit);

  const goToPage = (n) => {
    setPage(n);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Each point in the hierarchy is its own route, so a pill is real navigation —
  // that keeps the page heading, the URL, and the grid describing the same
  // thing, and leaves a history entry so Back works.
  const goTo = (nextType, nextChannel) => {
    const href = listingHref(nextType, nextChannel);
    if (window.location.hash !== href) {
      window.location.hash = href;
    } else {
      setType(nextType);
      setChannel(nextChannel);
      setPage(1);
    }
  };

  // A pill count is what you would get if you clicked it: the other axis stays
  // where it is, so the numbers always add up to what the grid then shows.
  const countByType = (key) => properties.filter(p => matches(p, key, channel)).length;
  const countByChannel = (key) => properties.filter(p => matches(p, type, key)).length;

  // Without its own header this sits directly under the page hero, which has
  // already paid for the space above — so only the bottom padding is full.
  return (
    <section id="properties"
             className={`relative bg-navy px-5 md:px-[6%] overflow-hidden
                         ${showHeader ? 'py-16 md:py-24' : 'pt-8 md:pt-10 pb-16 md:pb-24'}`}>
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

      {/* Two levels: what the property is, then how it sells. One panel with a
          rule between them, so they read as a single control rather than two
          loose rows of pills floating on the page. */}
      <div ref={gridTop}
           className="relative reveal mb-6 scroll-mt-28 rounded-xl
                      border border-gold/20 divide-y divide-gold/15">
        <FilterRow
          caption="Property type"
          options={typeFilters}
          active={type}
          countFor={countByType}
          onSelect={(key) => goTo(key, channel)}
        />
        <FilterRow
          caption="How it sells"
          options={channelFilters}
          active={channel}
          countFor={countByChannel}
          onSelect={(key) => goTo(type, key)}
        />
      </div>

      <div className="relative text-white/55 text-[0.78rem] mb-6">
        {status === 'loading'
          ? 'Loading listings…'
          : status === 'error'
          ? 'Unable to load listings right now.'
          : matching.length === 0
          ? null
          : <>Showing <span className="text-gold font-semibold">{visible.length}</span> of{' '}
             <span className="text-gold font-semibold">{matching.length}</span>
             {' '}{matching.length === 1 ? 'property' : 'properties'}
             {paginated && pageCount > 1 && <> · page {safePage} of {pageCount}</>}</>}
      </div>

      {status === 'loading' && (
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-navy2 border border-gold/15 rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-white/10 rounded w-1/2" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="h-px bg-gold/10 my-4" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="relative text-center py-16 border border-gold/20 rounded-lg bg-navy2">
          <div className="font-serif text-gold text-xl mb-2">Couldn't load listings</div>
          <div className="text-white/55 text-sm">Please refresh, or reach out and we'll send the full list.</div>
        </div>
      )}

      {status === 'ready' && matching.length === 0 && (
        <div className="relative text-center py-16 border border-gold/20 rounded-lg bg-navy2">
          <div className="font-serif text-gold text-xl mb-2">No properties in this category</div>
          <div className="text-white/55 text-sm">Check back soon or browse all listings.</div>
        </div>
      )}

      {status === 'ready' && visible.length > 0 && (
        <>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {visible.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>

          {paginated && (
            <Pagination page={safePage} pageCount={pageCount} onChange={goToPage} />
          )}
        </>
      )}
    </section>
  );
}
