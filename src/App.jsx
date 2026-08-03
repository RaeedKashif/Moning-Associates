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
import { CATEGORY_BY_KEY, CATEGORY_BY_SLUG } from './lib/propertyCategories.js';
import { FORM_BY_SLUG } from './lib/inquiryForms.js';

const HOME_TITLE = 'Moning & Associates · Steven Moning — DFW Real Estate';
const BLOGS_TITLE = 'All Blogs | Moning & Associates';

function parseRoute(hash) {
  const h = (hash || '').replace(/^#/, '');
  // Tolerate the .html suffix the site used before these pages moved to React.
  const [rawPath, query] = h.replace(/\.html$/, '').split('?');
  const path = rawPath.replace(/^\//, '');

  if (path === 'properties') {
    const cat = new URLSearchParams(query || '').get('cat');
    const filter = CATEGORY_BY_KEY[cat] ? cat : 'all';
    return { name: 'properties', filter };
  }
  if (CATEGORY_BY_SLUG[path]) {
    return { name: 'properties', filter: CATEGORY_BY_SLUG[path].key };
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
    return (CATEGORY_BY_KEY[route.filter] || CATEGORY_BY_KEY.all).title;
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
  }, [route.name, route.filter]);

  // Scroll reveal observer — re-arm whenever route changes
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [route.name]);

  return (
    <>
      <Navbar currentRoute={route.name} activeHref={activeHref(route)} />
      {route.name === 'properties' && <PropertiesPage initialFilter={route.filter} />}
      {route.name === 'inquiry'    && <InquiryPage config={FORM_BY_SLUG[route.form]} />}
      {route.name === 'blogs'      && <BlogsPage />}
      {route.name === 'blog'       && <BlogPostPage slug={route.slug} />}
      {route.name === 'home'       && <Home />}
      <Footer />
    </>
  );
}
