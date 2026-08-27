import { useEffect, useRef, useState } from 'react';
import Navbar       from './components/Navbar.jsx';
import Hero         from './components/Hero.jsx';
import Ticker       from './components/Ticker.jsx';
import Services     from './components/Services.jsx';
import About        from './components/About.jsx';
import Philosophy   from './components/Philosophy.jsx';
import Values       from './components/Values.jsx';
import Testimonials from './components/Testimonials.jsx';
import Team         from './components/Team.jsx';
import Inquire      from './components/Inquire.jsx';
import Footer       from './components/Footer.jsx';
import PropertiesPage from './components/PropertiesPage.jsx';
import BlogsPage      from './components/BlogsPage.jsx';
import BlogPostPage   from './components/BlogPostPage.jsx';
import InquiryPage    from './components/InquiryPage.jsx';
import { TYPE_BY_KEY, CHANNEL_BY_KEY, resolveListingPath, pageCopy } from './lib/propertyCategories.js';
import { FORM_BY_SLUG } from './lib/inquiryForms.js';

const HOME_TITLE = 'Moning & Associates · Steven Moning — DFW Real Estate';
const BLOGS_TITLE = 'All Blogs | Moning & Associates';

// `?cat=` predates the split into type and channel, so two of its values named
// a sales channel rather than a property type. Translate rather than drop them.
const LEGACY_CAT = {
  active: { channel: 'on_market' },
  offmkt: { channel: 'off_market' },
};

function catParam(cat) {
  if (!cat) return {};
  if (LEGACY_CAT[cat]) return LEGACY_CAT[cat];
  return TYPE_BY_KEY[cat] ? { type: cat } : {};
}

function parseRoute(hash) {
  const h = (hash || '').replace(/^#/, '');
  // Tolerate the .html suffix the site used before these pages moved to React.
  const [rawPath, query] = h.replace(/\.html$/, '').split('?');
  const path = rawPath.replace(/^\//, '');

  // Listings hang off two axes — property type and sales channel — so a route
  // is `#/<type>` , `#/<channel>` , or `#/<type>/<channel>`. The `?cat=` and
  // `?channel=` query form still works for links already out in the world.
  const listing = resolveListingPath(path);
  if (listing) {
    const params = new URLSearchParams(query || '');
    return {
      name: 'properties',
      ...listing,
      ...catParam(params.get('cat')),
      ...(CHANNEL_BY_KEY[params.get('channel')] ? { channel: params.get('channel') } : {}),
    };
  }
  if (FORM_BY_SLUG[path]) {
    return { name: 'inquiry', form: path };
  }
  if (path.startsWith('blog/')) {
    const slug = decodeURIComponent(path.slice('blog/'.length));
    return { name: 'blog', slug };
  }
  if (path === 'blogs' || path === 'all-blogs') return { name: 'blogs' };
  // The contact section became the buyer/seller chooser. Old #contact links —
  // bookmarks, anything already printed — still land in the right place.
  return { name: 'home', anchor: h === 'contact' ? 'inquire' : h };
}

// The old standalone pages each had their own <title>; keep that now that one
// document serves them all. A single post titles itself once it has loaded.
function titleFor(route) {
  if (route.name === 'properties') {
    return pageCopy(route.type, route.channel).title;
  }
  if (route.name === 'inquiry') return FORM_BY_SLUG[route.form].title;
  if (route.name === 'blogs') return BLOGS_TITLE;
  if (route.name === 'blog')  return null;
  return HOME_TITLE;
}

// Which top-level nav link should read as current.
function activeHref(route) {
  if (route.name === 'inquiry') return `#/${route.form}`;
  if (route.name === 'blogs')   return '#/blogs';
  if (route.name === 'home')    return '#/';
  return null;
}

function Home() {
  return (
    <main>
      <Hero />
      <Ticker />
      <Services />
      <About />
      <Philosophy />
      <Values />
      <Testimonials />
      <Team />
      <Inquire />
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const prevRoute = useRef(route);

  useEffect(() => {
    const onHash = () => {
      const r = parseRoute(window.location.hash);
      const prev = prevRoute.current;
      prevRoute.current = r;
      setRoute(r);
      // Scroll to top when navigating to a different page. Switching between
      // property categories keeps your place — you're still reading the grid.
      const sameGrid = r.name === 'properties' && prev.name === 'properties';
      if (r.name !== 'home') {
        if (!sameGrid) window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (r.anchor) {
        // delay so route render happens first
        setTimeout(() => {
          const el = document.getElementById(r.anchor);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const title = titleFor(route);
    if (title) document.title = title;
  }, [route.name, route.type, route.channel]);

  // Scroll reveal observer — re-arm whenever route changes
  useEffect(() => {
    const SELECTOR = '.reveal, .reveal-left, .reveal-scale';
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }),
      // Reveal as soon as the top edge is properly into the viewport, rather
      // than on a fraction of the element. A fraction cannot work for anything
      // taller than the screen — the buyer intake runs to 3600px, so 12% of it
      // never fits, and the whole form sat at opacity 0 until you scrolled.
      { threshold: 0, rootMargin: '0px 0px -80px 0px' }
    );

    // Observing the same element twice is a no-op, so re-walking a subtree is safe.
    const observe = node => {
      if (node.nodeType !== 1) return;
      if (node.matches(SELECTOR)) io.observe(node);
      node.querySelectorAll(SELECTOR).forEach(el => io.observe(el));
    };

    observe(document.body);

    // Cards that arrive with their data — testimonials, listings, blog posts —
    // mount after this effect has already run. A one-shot query would never see
    // them, and they would sit at opacity 0 for good, so watch for them instead.
    const mo = new MutationObserver(records =>
      records.forEach(r => r.addedNodes.forEach(observe))
    );
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, [route.name]);

  return (
    <>
      <Navbar currentRoute={route.name} activeHref={activeHref(route)} />
      {route.name === 'properties' && <PropertiesPage type={route.type} channel={route.channel} />}
      {route.name === 'inquiry'    && <InquiryPage config={FORM_BY_SLUG[route.form]} />}
      {route.name === 'blogs'      && <BlogsPage />}
      {route.name === 'blog'       && <BlogPostPage slug={route.slug} />}
      {route.name === 'home'       && <Home />}
      <Footer />
    </>
  );
}
