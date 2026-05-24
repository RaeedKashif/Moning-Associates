import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Lightweight markdown-ish renderer — line-based so a heading followed
// directly by a list (no blank line between) still renders correctly.
// Supports: ## H2, ### H3, > blockquote, - / * list, **bold**, paragraphs.
function renderContent(text) {
  if (!text) return null;

  const inline = (s) => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="text-navy font-semibold">{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    );
  };

  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let para = [];
  let list = [];
  let isFirst = true;

  const flushPara = () => {
    if (!para.length) return;
    out.push(
      <p key={`p-${out.length}`}
         className="text-slate leading-[1.95] mb-6 text-[1.02rem] md:text-[1.06rem]">
        {inline(para.join(' '))}
      </p>
    );
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    const items = list.slice();
    out.push(
      <ul key={`ul-${out.length}`} className="my-6 space-y-3">
        {items.map((it, j) => (
          <li key={j} className="flex gap-3 text-slate leading-[1.9] text-[1.02rem]">
            <span className="mt-[0.65rem] inline-block w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
            <span>{inline(it)}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };
  const flushAll = () => { flushPara(); flushList(); };

  for (const raw of lines) {
    const t = raw.trim();

    if (!t) { flushAll(); continue; }

    if (t.startsWith('## ')) {
      flushAll();
      out.push(
        <h2 key={`h2-${out.length}`}
            className={`font-serif text-navy text-2xl md:text-[1.85rem] font-semibold
                        mb-4 leading-tight ${isFirst ? 'mt-0' : 'mt-12'}`}>
          {inline(t.slice(3))}
        </h2>
      );
      isFirst = false;
      continue;
    }
    if (t.startsWith('### ')) {
      flushAll();
      out.push(
        <h3 key={`h3-${out.length}`}
            className={`font-serif text-navy text-xl md:text-[1.4rem] font-semibold
                        mb-3 leading-tight ${isFirst ? 'mt-0' : 'mt-9'}`}>
          {inline(t.slice(4))}
        </h3>
      );
      isFirst = false;
      continue;
    }
    if (t.startsWith('> ')) {
      flushAll();
      out.push(
        <blockquote key={`bq-${out.length}`}
                    className="my-8 pl-6 pr-5 py-5 border-l-4 border-gold
                               bg-gold/[0.07] rounded-r-xl">
          <p className="font-serif italic text-navy text-[1.1rem] md:text-[1.2rem] leading-[1.85]">
            {inline(t.slice(2))}
          </p>
        </blockquote>
      );
      isFirst = false;
      continue;
    }
    if (t.startsWith('- ') || t.startsWith('* ')) {
      flushPara();
      list.push(t.slice(2));
      isFirst = false;
      continue;
    }
    flushList();
    para.push(t);
    isFirst = false;
  }
  flushAll();

  return out;
}

export default function BlogPostPage({ slug }) {
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      const isNumeric = /^\d+$/.test(slug);
      const q = supabase.from('blog_posts').select('*');
      const { data, error } = isNumeric
        ? await q.eq('id', Number(slug)).maybeSingle()
        : await q.eq('slug', slug).maybeSingle();

      if (cancelled) return;
      if (error) { setError(error.message); setLoading(false); return; }
      if (!data)  { setError('Post not found.'); setLoading(false); return; }

      setPost(data);

      const { data: rel } = await supabase
        .from('blog_posts')
        .select('id, slug, title, image, cat, published_at, excerpt')
        .eq('cat', data.cat)
        .neq('id', data.id)
        .order('published_at', { ascending: false })
        .limit(3);
      if (!cancelled) setRelated(rel ?? []);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-[76px] min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-5 py-20 animate-pulse">
          <div className="h-4 w-32 bg-slate/20 rounded mb-6" />
          <div className="h-10 w-3/4 bg-slate/20 rounded mb-4" />
          <div className="h-4 w-1/2 bg-slate/20 rounded mb-10" />
          <div className="aspect-[16/9] bg-slate/20 rounded-2xl mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-slate/15 rounded" />
            <div className="h-4 bg-slate/15 rounded w-11/12" />
            <div className="h-4 bg-slate/15 rounded w-5/6" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="pt-[76px] min-h-[70vh] bg-cream grid place-items-center">
        <div className="text-center px-5">
          <p className="text-goldDk font-semibold tracking-[0.28em] uppercase text-xs mb-2">
            Not Found
          </p>
          <h1 className="font-serif text-navy text-3xl font-semibold mb-4">
            This article is missing
          </h1>
          <p className="text-slate mb-8 max-w-md mx-auto">
            {error || "We couldn't find the article you're looking for."}
          </p>
          <a href="#/blogs" className="btn-gold inline-flex">
            <span>&larr;</span> Back to the Journal
          </a>
        </div>
      </main>
    );
  }

  const initials = (post.author ?? 'MA').split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <main className="pt-[76px] bg-cream">
      {/* Hero */}
      <section className="relative bg-royal-deep overflow-hidden px-5 md:px-[6%] py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 pattern-crown opacity-30" />
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px]
                        rounded-full bg-gold/10 blur-3xl animate-pulseGold" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[460px] h-[460px]
                        rounded-full bg-wine/15 blur-3xl" />

        <div className="relative max-w-3xl mx-auto">
          <a href="#/blogs"
             className="inline-flex items-center gap-2 text-gold/80 hover:text-gold
                        text-[0.7rem] font-semibold tracking-[0.26em] uppercase mb-7 transition">
            <span aria-hidden>&larr;</span> Back to Journal
          </a>

          <div className="flex flex-wrap items-center gap-3 mb-5 animate-fadeUp">
            <span className="bg-gold text-navy text-[0.7rem]
                             font-semibold tracking-[0.16em] uppercase
                             px-3 py-1.5 rounded-md shadow-gold">
              {post.cat}
            </span>
            {post.published_at && (
              <span className="text-white/55 text-[0.78rem] tracking-[0.12em] uppercase">
                {formatDate(post.published_at)}
              </span>
            )}
          </div>

          <h1 className="font-serif font-semibold text-white leading-[1.08]
                         text-[clamp(2rem,5vw,3.6rem)] animate-fadeUp [animation-delay:0.1s]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-white/70 text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.85] mt-6
                          max-w-2xl animate-fadeUp [animation-delay:0.2s]">
              {post.excerpt}
            </p>
          )}

          <div className="mt-9 flex items-center gap-3 animate-fadeUp [animation-delay:0.3s]">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-goldDk
                            grid place-items-center text-navy font-bold text-sm
                            ring-2 ring-gold/30">
              {initials}
            </div>
            <div className="leading-tight">
              <div className="text-white text-sm font-semibold">{post.author}</div>
              <div className="text-white/50 text-[0.7rem] tracking-[0.2em] uppercase">
                eXp Realty &middot; DFW Premier
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image — sits cleanly on cream, no overlap weirdness */}
      {post.image && (
        <div className="bg-cream px-5 md:px-[6%] pt-10 md:pt-14">
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden
                          border border-gold/25 shadow-royal">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto block max-h-[560px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <article className="px-5 md:px-[6%] pt-10 md:pt-14 pb-16 md:pb-20 relative">
        <div className="pointer-events-none absolute inset-0 pattern-crown opacity-20" />
        <div className="relative max-w-3xl mx-auto">
          {renderContent(post.content) || (
            <p className="text-slate leading-[1.95] text-[1.02rem]">
              {post.excerpt}
            </p>
          )}

          <div className="royal-divider mt-12 mb-10">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="inline-block w-2 h-2 rotate-45 bg-gold" />
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          {/* Author / CTA card */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-7 md:p-9
                          hairline-gold shadow-[0_8px_30px_rgba(6,16,28,0.06)]">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-goldDk
                              grid place-items-center text-navy font-bold text-base
                              ring-2 ring-gold/40 shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-goldDk font-semibold tracking-[0.24em]
                              uppercase text-[0.65rem] mb-1">
                  Written by
                </p>
                <h4 className="font-serif text-navy text-xl font-semibold">
                  {post.author}
                </h4>
                <p className="text-muted text-sm">eXp Realty &middot; DFW Premier</p>
              </div>
            </div>
            <p className="text-slate leading-[1.85] mb-6">
              Thinking about a move, an investment, or just want a straight read on
              the DFW market? Let&apos;s talk — no pressure, no scripts.
            </p>
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
                setTimeout(() => document.getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' }), 80);
              }}
              className="btn-gold inline-flex"
            >
              Get in Touch
              <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center text-xs">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-navy2 px-5 md:px-[6%] py-16 border-t border-gold/15">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
              <div>
                <span className="text-gold text-[0.7rem] font-semibold tracking-[0.28em]
                                 uppercase mb-2 block">
                  Keep Reading
                </span>
                <h3 className="font-serif text-white text-2xl md:text-3xl font-semibold">
                  More in <span className="italic gold-foil">{post.cat}</span>
                </h3>
              </div>
              <a href="#/blogs"
                 className="text-gold hover:text-goldLt text-[0.78rem] font-semibold
                            tracking-[0.18em] uppercase transition">
                All Articles &rarr;
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {related.map(r => {
                const href = r.slug ? `#/blog/${r.slug}` : `#/blog/${r.id}`;
                return (
                  <a key={r.id} href={href}
                     className="block bg-white/[0.04] hover:bg-white/[0.08]
                                rounded-2xl border border-white/10 hover:border-gold/40
                                overflow-hidden transition group">
                    {r.image && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={r.image} alt={r.title}
                             className="w-full h-full object-cover
                                        group-hover:scale-105 transition duration-700" />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="text-gold text-[0.62rem] tracking-[0.24em]
                                       uppercase font-semibold">
                        {r.published_at ? formatDate(r.published_at) : ''}
                      </span>
                      <h4 className="font-serif text-white text-[1.1rem] mt-2
                                     leading-tight group-hover:text-gold transition">
                        {r.title}
                      </h4>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
