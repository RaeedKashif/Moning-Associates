import { useEffect, useState } from 'react';
import Navbar       from './components/Navbar.jsx';
import Hero         from './components/Hero.jsx';
import Ticker       from './components/Ticker.jsx';
import Services     from './components/Services.jsx';
import About        from './components/About.jsx';
import Philosophy   from './components/Philosophy.jsx';
import Values       from './components/Values.jsx';
import Testimonials from './components/Testimonials.jsx';
import Team         from './components/Team.jsx';
import Contact      from './components/Contact.jsx';
import Footer       from './components/Footer.jsx';
import PropertiesPage from './components/PropertiesPage.jsx';
import BlogsPage      from './components/BlogsPage.jsx';
import BlogPostPage   from './components/BlogPostPage.jsx';

function parseRoute(hash) {
  const h = (hash || '').replace(/^#/, '');
  if (h.startsWith('/properties')) {
    const q = h.split('?')[1];
    const params = new URLSearchParams(q || '');
    return { name: 'properties', filter: params.get('cat') || 'all' };
  }
  if (h.startsWith('/blog/')) {
    const slug = decodeURIComponent(h.replace('/blog/', '').split('?')[0]);
    return { name: 'blog', slug };
  }
  if (h.startsWith('/blogs')) return { name: 'blogs' };
  return { name: 'home', anchor: h };
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
      <Contact />
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => {
      const r = parseRoute(window.location.hash);
      setRoute(r);
      // Scroll to top when navigating to a different page
      if (r.name !== 'home') {
        window.scrollTo({ top: 0, behavior: 'instant' });
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
      <Navbar currentRoute={route.name} />
      {route.name === 'properties' && <PropertiesPage initialFilter={route.filter} />}
      {route.name === 'blogs'      && <BlogsPage />}
      {route.name === 'blog'       && <BlogPostPage slug={route.slug} />}
      {route.name === 'home'       && <Home />}
      <Footer />
    </>
  );
}
