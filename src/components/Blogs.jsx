import { useEffect, useRef, useState } from 'react';

const categories = [
  'All',
  'Market Insights',
  'Buyer Guide',
  'Seller Tips',
  'Investment',
  'Luxury Living',
  'DFW Lifestyle',
  'REO & Off-Market',
];

const posts = [
  {
    cat: 'Market Insights',
    title: 'The 2026 DFW Market: What Buyers Should Expect This Spring',
    excerpt: "Inventory is loosening, rates are stabilizing, and DFW is back to being a buyer's conversation. Here's the reality on the ground.",
    date: 'May 18, 2026',
    read: '6 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    author: 'Steven Moning',
  },
  {
    cat: 'Luxury Living',
    title: 'Inside Highland Park: Why Old Money Still Anchors Dallas Luxury',
    excerpt: "Highland Park's pricing has held through every cycle for a reason. We unpack what makes this enclave bulletproof.",
    date: 'May 11, 2026',
    read: '8 min read',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    author: 'Moning & Associates',
  },
  {
    cat: 'Investment',
    title: 'Cash-Flow vs Appreciation: Picking Your DFW Investment Strategy',
    excerpt: 'Two different paths, two different submarkets, two different exit strategies. Which is right for your portfolio?',
    date: 'May 04, 2026',
    read: '7 min read',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
    author: 'Steven Moning',
  },
  {
    cat: 'Buyer Guide',
    title: 'First-Time Buyer in Dallas? Read This Before You Sign Anything',
    excerpt: "A no-nonsense walk-through of inspection, escrow, and the three negotiation points most agents won't tell you about.",
    date: 'Apr 26, 2026',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    author: 'Moning & Associates',
  },
  {
    cat: 'REO & Off-Market',
    title: 'How We Source Off-Market Deals — and How You Can Get Access',
    excerpt: "The DFW off-market pipeline is real, but it's relationship-driven. Here's how to plug in without burning your reputation.",
    date: 'Apr 19, 2026',
    read: '9 min read',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    author: 'Steven Moning',
  },
  {
    cat: 'Seller Tips',
    title: '7 Pre-Listing Moves That Quietly Add $50K to Your Sale Price',
    excerpt: 'No major renovation needed. These are the small, high-leverage moves that change the perception of your home in 48 hours.',
    date: 'Apr 12, 2026',
    read: '6 min read',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    author: 'Moning & Associates',
  },
  {
    cat: 'DFW Lifestyle',
    title: 'Where to Live in DFW in 2026 — A Neighborhood-by-Neighborhood Take',
    excerpt: "We break down Frisco vs Plano vs Southlake vs Highland Park for what they actually feel like to live in day-to-day.",
    date: 'Apr 05, 2026',
    read: '10 min read',
    image: 'https://images.unsplash.com/photo-1496347315367-04a6ba84b1ba?auto=format&fit=crop&w=1200&q=80',
    author: 'Moning & Associates',
  },
  {
    cat: 'Investment',
    title: 'BRRRR in Dallas: Does the Strategy Still Work in 2026?',
    excerpt: 'Buy-Rehab-Rent-Refi-Repeat had a golden run. Here is what is left of that play and which DFW submarkets still support it.',
    date: 'Mar 28, 2026',
    read: '8 min read',
    image: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=1200&q=80',
    author: 'Steven Moning',
  },
  {
    cat: 'Market Insights',
    title: 'Mortgage Rates Mid-2026: The Outlook From a DFW Lender Roundtable',
    excerpt: "We sat down with three DFW lenders. Here's the consensus on rates, programs, and what's actually getting buyers to close.",
    date: 'Mar 21, 2026',
    read: '7 min read',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    author: 'Steven Moning',
  },
];

export default function Blogs({ limit = null, showHeader = true }) {
  const [active, setActive] = useState('All');
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateScrollState); ro.disconnect(); };
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' });
  };

  let visible = active === 'All' ? posts : posts.filter(p => p.cat === active);
  if (limit) visible = visible.slice(0, limit);

  return (
    <section id="blogs" className="bg-cream py-16 md:py-24 px-5 md:px-[6%] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pattern-crown opacity-30" />

      {showHeader && (
        <div className="relative reveal max-w-3xl mb-8">
          <span className="section-tag">From the Journal</span>
          <h2 className="section-title">
            Real estate notes,<br/>
            <span className="italic text-goldDk">straight from the field.</span>
          </h2>
          <p className="section-sub mt-4">
            Honest takes on the DFW market, buyer/seller strategy, investment moves,
            and what we're seeing on the ground each week.
          </p>
        </div>
      )}

      {/* Blog category title bar */}
      <div className="relative reveal mb-6">
        <div className="relative bg-navy rounded-2xl border border-gold/30 shadow-royal">
          {/* Left fade + arrow */}
          <div className={`pointer-events-none absolute left-0 inset-y-0 w-14 rounded-l-2xl z-10
                           bg-gradient-to-r from-navy via-navy/80 to-transparent
                           transition-opacity duration-200
                           ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll categories left"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20
                        w-7 h-7 rounded-full bg-gold/20 hover:bg-gold
                        text-gold hover:text-navy border border-gold/40
                        flex items-center justify-center transition-all duration-200
                        ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Scrollable pill row */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar
                       px-3 py-2.5 md:px-6 md:py-4 scroll-smooth"
          >
            <div className="items-center gap-2 pr-3 mr-2 border-r border-gold/30
                            shrink-0 hidden md:flex">
              <span className="inline-block w-1.5 h-1.5 rotate-45 bg-gold" />
              <span className="text-gold text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
                Categories
              </span>
            </div>
            {categories.map(c => {
              const count = c === 'All' ? posts.length : posts.filter(p => p.cat === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`shrink-0 inline-flex items-center gap-1.5
                              px-3 md:px-4 py-1.5 md:py-2 rounded-full
                              text-[0.7rem] md:text-[0.78rem] font-semibold
                              tracking-[0.08em] uppercase transition-all whitespace-nowrap
                              ${active === c
                                ? 'bg-gold text-navy shadow-gold'
                                : 'text-white hover:text-gold hover:bg-gold/15'}`}
                >
                  {c}
                  <span className={`text-[0.6rem] font-bold rounded-full px-1.5 py-0.5 leading-none
                                    ${active === c ? 'bg-navy/15 text-navy' : 'bg-gold/20 text-gold'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right fade + arrow */}
          <div className={`pointer-events-none absolute right-0 inset-y-0 w-14 rounded-r-2xl z-10
                           bg-gradient-to-l from-navy via-navy/80 to-transparent
                           transition-opacity duration-200
                           ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll categories right"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20
                        w-7 h-7 rounded-full bg-gold/20 hover:bg-gold
                        text-gold hover:text-navy border border-gold/40
                        flex items-center justify-center transition-all duration-200
                        ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative text-slate text-[0.78rem] mb-6">
        Showing <span className="text-goldDk font-semibold">{visible.length}</span> of{' '}
        <span className="text-goldDk font-semibold">{posts.length}</span> articles
        {active !== 'All' && (
          <span> in <span className="text-goldDk font-semibold">{active}</span></span>
        )}
      </div>

      <div key={active} className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {visible.map((p, i) => (
          <article
            key={p.title}
            style={{ animationDelay: `${(i % 3) * 0.08}s` }}
            className={`animate-fadeUp group
                        bg-white rounded-2xl border border-black/[0.06] overflow-hidden
                        transition-all duration-500
                        hover:-translate-y-2 hover:shadow-royal hover:border-gold/40`}
          >
            <div className="relative aspect-[16/10] overflow-hidden kenburns-on-hover">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-gold text-navy text-[0.7rem]
                               font-semibold tracking-[0.16em] uppercase
                               px-3 py-1.5 rounded-md shadow-gold">
                {p.cat}
              </span>
            </div>
            <div className="p-6 md:p-7">
              <div className="flex items-center gap-2 text-muted text-[0.72rem]
                              tracking-[0.12em] uppercase mb-3">
                <span>{p.date}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-gold" />
                <span>{p.read}</span>
              </div>
              <h3 className="font-serif text-navy text-[1.25rem] font-semibold leading-tight
                             group-hover:text-goldDk transition-colors">
                {p.title}
              </h3>
              <p className="text-slate text-[0.9rem] leading-[1.75] mt-3 line-clamp-3">
                {p.excerpt}
              </p>
              <div className="flex items-center justify-between mt-5 pt-5 border-t border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-goldDk
                                  grid place-items-center text-navy font-bold text-[0.7rem]">
                    {p.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-muted text-[0.78rem]">{p.author}</span>
                </div>
                <span className="text-goldDk text-[0.78rem] font-semibold tracking-wider uppercase
                                 group-hover:translate-x-1 transition-transform">
                  Read &rarr;
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
