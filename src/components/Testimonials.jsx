import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// "James & Rachel" -> "JR". Only used when the admin leaves initials blank.
function deriveInitials(name) {
  const words = (name || '')
    .replace(/&/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function Testimonials() {
  const [items, setItems] = useState(null); // null = still loading

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // RLS exposes only published rows to the anon key, so no status filter
      // is strictly needed — it is here so the intent is obvious.
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, quote, name, role, initials, rating, featured')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (cancelled) return;
      setItems(error ? [] : (data ?? []));
    })();
    return () => { cancelled = true; };
  }, []);

  // Nothing to show, or the fetch failed: drop the section entirely rather than
  // falling back to a hardcoded list. A testimonial Steven deleted must not
  // reappear on the live site.
  if (items !== null && items.length === 0) return null;

  return (
    <section className="bg-cream py-24 px-5 md:px-[6%]">
      <div className="reveal max-w-3xl mb-12">
        <span className="section-tag">Client Stories</span>
        <h2 className="section-title">
          What our clients<br/>
          <span className="italic text-goldDk">actually say</span> about us.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items === null
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i}
                   className="animate-pulse rounded-2xl p-7 sm:p-8 border border-black/[0.07] bg-white">
                <div className="h-4 w-24 bg-black/10 rounded mb-5" />
                <div className="space-y-2.5">
                  <div className="h-3 bg-black/[0.07] rounded" />
                  <div className="h-3 bg-black/[0.07] rounded w-11/12" />
                  <div className="h-3 bg-black/[0.07] rounded w-4/5" />
                </div>
                <div className="mt-7 pt-5 border-t border-black/[0.06] flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-black/10" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-black/10 rounded w-1/3" />
                    <div className="h-2.5 bg-black/[0.07] rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          : items.map((t, i) => (
              <article
                key={t.id}
                className={`reveal d${i + 1} rounded-2xl p-7 sm:p-8 border flex flex-col
                            transition-all duration-300 hover:-translate-y-1 hover:shadow-soft
                            ${t.featured ? 'bg-navy border-navy2' : 'bg-white border-black/[0.07]'}`}
              >
                <div className={`font-serif text-5xl leading-none mb-2
                                 ${t.featured ? 'text-gold/25' : 'text-gold/30'}`}>"</div>
                <div className="text-gold tracking-[0.2em] text-sm mb-3">
                  {'★'.repeat(t.rating ?? 5)}
                </div>
                <blockquote className={`flex-1 italic text-[0.94rem] leading-[1.75]
                                        ${t.featured ? 'text-white/80' : 'text-slate'}`}>
                  {t.quote}
                </blockquote>
                <div className={`mt-7 pt-5 flex items-center gap-3 border-t
                                 ${t.featured ? 'border-white/10' : 'border-black/[0.06]'}`}>
                  <div className="w-11 h-11 rounded-full grid place-items-center
                                  font-serif font-bold text-navy bg-gold">
                    {t.initials?.trim() || deriveInitials(t.name)}
                  </div>
                  <div>
                    <div className={`text-[0.9rem] font-semibold
                                     ${t.featured ? 'text-white' : 'text-navy'}`}>{t.name}</div>
                    <div className={`text-[0.76rem] mt-0.5
                                     ${t.featured ? 'text-white/45' : 'text-muted'}`}>{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
