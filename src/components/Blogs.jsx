import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Blogs({ limit = null, showHeader = true }) {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [active, setActive] = useState('All');
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('id, slug, title, excerpt, cover_image, author, tags, published_at')
        .order('published_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setPosts(data ?? []);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  // Mouse wheel: map vertical wheel to horizontal scroll on the pill bar
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: 'auto' });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Click + drag to scroll (desktop trackpad/mouse users)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false, startX = 0, startScroll = 0, moved = false;

    const onDown = (e) => {
      if (e.target.closest('button')) return; // let pill clicks work normally
      isDown = true; moved = false;
      startX = e.pageX - el.offsetLeft;
      startScroll = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 4) moved = true;
      el.scrollLeft = startScroll - walk;
    };
    const onUp = () => {
      isDown = false;
      el.style.cursor = '';
      if (moved) {
        // swallow the click that follows the drag
        const swallow = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
        el.addEventListener('click', swallow, { capture: true, once: true });
      }
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateScrollState); ro.disconnect(); };
  }, [posts]);

  // Auto-scroll the active pill into view when category changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector('[data-active="true"]');
    activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(200, el.clientWidth * 0.7);
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const allCategories = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags ?? []))).sort()];

  let visible = active === 'All' ? posts : posts.filter(p => (p.tags ?? []).includes(active));
  if (limit) visible = visible.slice(0, limit);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

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
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 z-20
                        w-9 h-9 rounded-full bg-navy hover:bg-gold
                        text-gold hover:text-navy border border-gold/60 shadow-lg
                        flex items-center justify-center transition-all duration-200
                        hover:scale-110
                        ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Scrollable pill row */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar
                       px-3 py-2.5 md:px-6 md:py-4 scroll-smooth cursor-grab select-none"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="items-center gap-2 pr-3 mr-2 border-r border-gold/30
                            shrink-0 hidden md:flex">
              <span className="inline-block w-1.5 h-1.5 rotate-45 bg-gold" />
              <span className="text-gold text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
                Categories
              </span>
            </div>
            {allCategories.map(c => {
              const count = c === 'All' ? posts.length : posts.filter(p => (p.tags ?? []).includes(c)).length;
              return (
                <button
                  key={c}
                  data-active={active === c}
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
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 z-20
                        w-9 h-9 rounded-full bg-navy hover:bg-gold
                        text-gold hover:text-navy border border-gold/60 shadow-lg
                        flex items-center justify-center transition-all duration-200
                        hover:scale-110
                        ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Status line */}
      {!loading && !error && (
        <div className="relative text-slate text-[0.78rem] mb-6">
          Showing <span className="text-goldDk font-semibold">{visible.length}</span> of{' '}
          <span className="text-goldDk font-semibold">{posts.length}</span> articles
          {active !== 'All' && (
            <span> in <span className="text-goldDk font-semibold">{active}</span></span>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-slate/20" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-24 bg-slate/20 rounded" />
                <div className="h-5 w-full bg-slate/20 rounded" />
                <div className="h-5 w-3/4 bg-slate/20 rounded" />
                <div className="h-3 w-full bg-slate/10 rounded mt-2" />
                <div className="h-3 w-5/6 bg-slate/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-16 text-white/60">
          <p className="text-lg mb-2">Could not load posts.</p>
          <p className="text-sm text-white/40">{error}</p>
        </div>
      )}

      {/* Posts grid */}
      {!loading && !error && (
        <div key={active} className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {visible.length === 0 && (
            <p className="col-span-3 text-center text-slate py-12">No posts in this category yet.</p>
          )}
          {visible.map((p, i) => (
            <a
              key={p.id}
              href={`#/blog/${p.slug}`}
              style={{ animationDelay: `${(i % 3) * 0.08}s` }}
              className="animate-fadeUp group block
                         bg-white rounded-2xl border border-black/[0.06] overflow-hidden
                         transition-all duration-500
                         hover:-translate-y-2 hover:shadow-royal hover:border-gold/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden kenburns-on-hover">
                {p.cover_image && (
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                {p.tags?.[0] && (
                  <span className="absolute top-4 left-4 bg-gold text-navy text-[0.7rem]
                                   font-semibold tracking-[0.16em] uppercase
                                   px-3 py-1.5 rounded-md shadow-gold">
                    {p.tags[0]}
                  </span>
                )}
              </div>
              <div className="p-6 md:p-7">
                <div className="text-muted text-[0.72rem] tracking-[0.12em] uppercase mb-3">
                  {p.published_at ? formatDate(p.published_at) : ''}
                </div>
                <h3 className="font-serif text-navy text-[1.25rem] font-semibold leading-tight
                               group-hover:text-goldDk transition-colors">
                  {p.title}
                </h3>
                <p className="text-slate text-[0.9rem] leading-[1.75] mt-3 line-clamp-3">
                  {p.excerpt}
                </p>
                {p.tags?.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.slice(1).map(t => (
                      <span key={t} className="text-[0.62rem] font-semibold tracking-[0.1em]
                                               uppercase text-goldDk bg-gold/10
                                               px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-5 pt-5 border-t border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gold
                                    grid place-items-center text-navy font-bold text-[0.7rem]">
                      {(p.author ?? 'MA').split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-muted text-[0.78rem]">{p.author}</span>
                  </div>
                  <span className="text-goldDk text-[0.78rem] font-semibold tracking-wider uppercase
                                   group-hover:translate-x-1 transition-transform">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
