# Moning & Associates — Steven Moning Real Estate Website

A modern, responsive landing page for Steven Moning and Moning & Associates, a premier Dallas–Fort Worth real estate agency specializing in luxury homes, REO properties, investor portfolios, and residential sales.

**Live Site:** https://stevenmoning.vercel.app

---

## Session Summary

### Session 3: Multi-Page Routing, Filtering Bugfix, Mobile Responsiveness

**Date:** May 22, 2026

**Objective:** Move Properties and Blogs into dedicated pages (not just home
sections), fix several filtering bugs, fix dropdown transparency, and overhaul
mobile responsiveness — especially the hero portrait which was cropping
Steven's face on mobile.

#### What Was Accomplished:

1. **Hash-based Routing** (no external router added)
   - New `parseRoute()` in `App.jsx` handles `#/properties`, `#/properties?cat=luxury`,
     `#/blogs`, and home anchors (`#services`, `#team`, `#contact`).
   - `window.addEventListener('hashchange', …)` to react to navigation.
   - When entering a sub-page, page scrolls to top automatically.
   - When clicking an anchor link from a sub-page, navigates back home and
     then scrolls smoothly to the target section.

2. **New Page Wrappers**
   - `PropertiesPage.jsx` — full-screen page with its own royal hero
     (gold-foil title, royal divider), the `<Properties />` grid, and a CTA
     strip at the bottom that routes back to home/contact.
   - `BlogsPage.jsx` — same pattern with "The Journal" hero.
   - Both pages accept `initialFilter` from URL (`?cat=luxury`).

3. **Properties / Blogs split from home page**
   - Home no longer renders Properties or Blogs sections directly.
   - All home navigation now goes through the navbar dropdown for properties
     and the "All Blogs" link for the journal.

4. **CRITICAL Filtering Bug Fix**
   - **Root cause:** Filter card grids used `.reveal-scale` (starts at
     `opacity: 0`, requires the JS IntersectionObserver to add `.visible`).
     The observer only ran on **route** change in `App.jsx`, not on filter
     change. New cards mounted on filter switch stayed at `opacity: 0` and
     looked like the filter was broken.
   - **Fix:** Replaced `.reveal-scale` on filter cards with CSS-driven
     `animate-fadeUp` keyframe + staggered `animationDelay` inline style.
     Cards now animate in on every mount, including filter changes.
   - Added `key={active}` on the grid container so React fully unmounts
     and remounts on filter change, retriggering the animation.

5. **Filter UX Improvements (Properties + Blogs)**
   - Each pill now shows a live count badge: `Luxury (4)`, `Off Market (2)`, etc.
   - Status line above grid: "Showing X of Y properties / articles".
   - Empty state card when a category has no items.
   - Property filter pills also update the URL hash via
     `window.history.replaceState` (bookmarkable, no re-render loop).

6. **Dropdown / Filter Pill Transparency Fix**
   - **Navbar dropdown** — bumped from `bg-navy/98` to solid `bg-navy`,
     border to `border-gold/40`, items use solid white text, hover goes to
     solid gold background. Top gold hairline divider.
   - **Property filter pills** — switched from `bg-white/[0.04]` (effectively
     invisible) to solid `bg-navy2` with `border-gold/40` and solid white text.
   - **Blog category bar** — solid white text on all categories, more opaque
     gold borders, larger count chips.

7. **Mobile Responsiveness Overhaul**
   - **Hero portrait** — was cropping Steven's face on mobile because
     `object-[center_top]` anchored the image to the very top of the head.
     Fixed by:
     - Switched portrait container from fixed `h-[65vw]` to responsive
       `aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto` so it scales properly
       to viewport.
     - `object-position` ramps from `center_18%` (mobile, shows face) to
       `center_22%` (sm) to `center_top` (desktop).
     - Floating name card scaled down on mobile (`px-4 py-3` vs `p-7` desktop),
       shorter byline (no "Moning & Associates" on mobile to fit one line).
   - **Hero stats** — switched from `flex` (which was squashing numbers and
     wrapping awkwardly) to `grid-cols-3 sm:flex` so number/label pairs
     stack cleanly in 3 columns on mobile.
   - **Hero left panel** — tighter `pt-24 sm:pt-28 lg:pt-32` padding.
   - **Navbar brand** — logo shrinks to `w-10 h-10` on mobile, brand text
     drops to `0.95rem`, `truncate` prevents overflow on narrow devices.
   - **Filter pills** — smaller padding and font on mobile across Properties
     and Blogs.
   - **Page heroes** (`/properties`, `/blogs`) — `py-14 md:py-28`.
   - **Section padding** — `py-16 md:py-24` throughout.

8. **Files Touched in Session 3**

| File | Change |
|------|--------|
| `src/App.jsx` | Hash routing + page switcher; IntersectionObserver re-arms on route change |
| `src/components/Navbar.jsx` | Routes to `#/properties` / `#/blogs`; cross-page anchor handler; solid dropdown; mobile sizing |
| `src/components/Hero.jsx` | Responsive aspect-ratio portrait; mobile-friendly stats grid; smaller floating card on mobile |
| `src/components/Properties.jsx` | Filter bug fix (animate-fadeUp); count badges; status line; empty state; URL hash sync |
| `src/components/Blogs.jsx` | Filter bug fix; count badges; status line; mobile-tighter category bar |
| `src/components/PropertiesPage.jsx` | **New** — page wrapper with hero + grid + CTA |
| `src/components/BlogsPage.jsx` | **New** — page wrapper with hero + grid + CTA |

#### Where Things Stand

- ✅ Properties on `#/properties` (filter by `?cat=luxury|active|land|offmkt`)
- ✅ Blogs on `#/blogs`
- ✅ Filter pills work (animation bug fixed)
- ✅ Filter pills show count badges + status line
- ✅ Property URL hash bookmarkable
- ✅ Dropdown menu solid and visible
- ✅ Hero portrait shows Steven's face on mobile
- ✅ Hero stats stack cleanly on mobile
- ✅ Navbar brand truncates instead of overflowing
- ✅ Deployed to https://stevenmoning.vercel.app

#### Suggested Next Session

- Replace Unsplash placeholder property images with real DFW listings
- Replace blog post placeholder content with actual articles
- Add individual property detail pages (`#/properties/highland-estate`)
- Add individual blog post pages (`#/blogs/2026-dfw-market`)
- SEO meta tags per page (title, OG image)
- Add a search bar to properties and blogs
- Consider adding a real router (react-router-dom) if depth grows beyond 2 levels

---

### Session 2: Royal Refresh — Dark Theme, Properties, Blogs, New Navigation

**Date:** May 22, 2026

**Objective:** Elevate the home page with a darker, royal-toned aesthetic, more
animations, a completely redesigned navigation matching the legacy site
(`moningassociates.com`), a property showcase, and a blog section with category
title bar.

#### What Was Accomplished:

1. **Royal Color System (`tailwind.config.js`)**
   - Deepened navy palette: `#06101C` (navy), `#0E1B30` (navy2), `#1A2C4A` (navy3),
     plus `royal: #16243F`
   - Added burgundy/wine accents (`#6B1F2E`, `#4A1424`) for royal undertone
   - Extended gold palette with champagne (`#F0DDB0`) and deep bronze (`#7C5A20`)
   - Warmer cream/ivory neutrals (`#FAF4E8`, `#FBF6EC`)
   - New `bg-royal-radial`, `bg-royal-deep`, `bg-gold-shimmer`, `bg-crown-pattern`
     backgrounds for richer surfaces

2. **New Animations & Effects**
   - Added `kenburns`, `shimmer`, `slowSpin`, `glow`, `pulseGold`, `floatYLg`,
     `slideDown`, `sweep` keyframes
   - Tailwind animations registered for utility use
   - Custom `royal`, `crest`, `goldLg` box shadows
   - Gold-foil text utility (`.gold-foil`) with animated gradient shimmer
   - Royal divider pattern (`.royal-divider`) with center gold diamond
   - Ken-burns image hover (`.kenburns-on-hover`)
   - Animated `.nav-link` underline with center-out gold gradient

3. **Completely Rewritten Navbar (`Navbar.jsx`)**
   - **New categories:** Services · All off Properties (▼) · All Blogs · Team · Contact Us
   - "All off Properties" dropdown with 4 items: Off Market Properties, Lands,
     Luxury Properties, Active Listing
   - Click-outside-to-close behavior, mobile collapsible sub-menu
   - Birdhouse mark retained in navbar (with gold ring + shimmer)
   - Gold-foil animated brand text
   - Gradient gold "Contact Us" CTA with sweep-on-hover
   - Top-edge gold hairline + scroll-aware solid background

4. **New Properties Section (`Properties.jsx`)**
   - 6 hand-picked DFW property cards with Unsplash imagery
   - Filter pills: All Properties · Luxury · Active Listing · Lands · Off Market
   - Each card: ken-burns hero image, gradient vignette, price ribbon,
     gold price overlay, bed/bath/sqft stats, "Request Details" CTA
   - Dark royal radial background with crown pattern overlay
   - Hover lift, gold border glow, scale-reveal animation

5. **New Blog Section (`Blogs.jsx`) — Matching Legacy Site Pattern**
   - **Blog category title bar** (same exact pattern as `moningassociates.com`):
     navy rounded pill bar with horizontally scrollable category pills
   - 8 categories: All · Market Insights · Buyer Guide · Seller Tips ·
     Investment · Luxury Living · DFW Lifestyle · REO & Off-Market
   - 6 article cards with cover image, category tag, date, read time, author,
     excerpt with line-clamp
   - Scale-reveal on enter, royal shadow on hover
   - "View All Articles" CTA

6. **Hero Enhancements (`Hero.jsx`)**
   - Switched left panel to `bg-royal-deep` (multi-radial dark gradient)
   - Added animated slowly-rotating gold compass ornament
   - Crown pattern overlay across left panel
   - Gold-foil text on accent line ("Dreams into")
   - Royal divider beneath the headline
   - Ken-burns animation on portrait
   - Larger float animation on name card with inner gold gradient overlay
   - Corner gold ornament on portrait
   - Trust metrics now scale on hover

7. **Favicon Updated**
   - Was: `birdhouse.jpeg`
   - Now: `brandlogo2.png` (Moning & Associates house+key brand mark)
   - Navbar still uses birdhouse as requested
   - `theme-color` meta updated to deeper navy `#06101C`

8. **Global CSS (`index.css`)**
   - Custom gold-gradient scrollbar
   - Three reveal variants: `.reveal`, `.reveal-left`, `.reveal-scale`
   - All with cubic-bezier easing for smoother motion
   - Crown SVG background pattern utility
   - Price ribbon gradient utility
   - Dropdown slide-down animation

9. **App.jsx Updates**
   - Imported and mounted `<Properties />` (between Services & About)
   - Imported and mounted `<Blogs />` (between Testimonials & Team)
   - Intersection observer extended to track all three reveal variants

#### Key New Sections / Features

- ✅ Royal-toned color palette with deeper navy + champagne gold + wine accents
- ✅ Dropdown navigation matching legacy site exactly
- ✅ Properties showcase with filter pills (Luxury / Active / Lands / Off Market)
- ✅ Blog section with horizontally-scrolling category title bar
- ✅ Updated favicon (brand logo, not birdhouse)
- ✅ Ken-burns hero portrait + animated gold ornament
- ✅ Gold-foil shimmer text effect on brand name + headlines
- ✅ Crown pattern decorative overlays
- ✅ Larger float animation on hero name card
- ✅ Royal box shadows + hover lift on all cards
- ✅ Animated nav underlines
- ✅ Mobile dropdown for property categories

#### Files Touched in Session 2

| File | Change |
|------|--------|
| `tailwind.config.js` | Rewrote color palette + added keyframes/animations/shadows/backgrounds |
| `src/index.css` | Added gold-foil, royal divider, reveal variants, crown pattern, price ribbon, scrollbar |
| `src/components/Navbar.jsx` | Rewrote with new categories + dropdown + dark royal theme |
| `src/components/Hero.jsx` | Royal background, more animations, ornaments, ken-burns portrait |
| `src/components/Properties.jsx` | **New** — property showcase with filter pills |
| `src/components/Blogs.jsx` | **New** — blog grid with category title bar |
| `src/App.jsx` | Mounted Properties + Blogs, extended reveal observer |
| `index.html` | Switched favicon to brandlogo2.png, updated theme-color |

---

### Session 1: Full Website Redesign with React + Vite + Tailwind CSS

**Date:** May 22, 2026

**Objective:** Redesign the existing HTML-based landing page into a modern React application using Vite and Tailwind CSS, incorporating all provided brand assets and creating a responsive, non-robotic user experience.

#### What Was Accomplished:

1. **Project Setup & Configuration**
   - Initialized Vite + React + Tailwind CSS project structure
   - Configured `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
   - Set up custom color palette matching brand identity (navy, gold, cream)
   - Integrated Google Fonts (Cormorant Garamond serif + DM Sans sans-serif)

2. **Asset Organization**
   - Copied all provided assets to `public/assets/` for optimal serving
   - **Brand Assets Used:**
     - `birdhouse.jpeg` → Favicon (appears in browser tab)
     - `Black Hi-Res.jpg` → Hero section portrait
     - `Tan Hi-Res.jpg` → About section portrait
     - `Salmon Hi-Res.jpg` → Team leader portrait
     - `brandlogo1.png`, `brandlogo2.png`, `brandlogo3.png` → Footer branding

3. **Component Architecture** (11 React Components)
   - **Navbar.jsx** — Fixed header with birdhouse logo, mobile hamburger menu, scroll-aware background
   - **Hero.jsx** — Full-screen hero section with portrait, floating name card, trust metrics (18+, 500+, 4.9)
   - **Ticker.jsx** — Animated horizontal ticker of services (REO, Luxury, Investors, etc.)
   - **Services.jsx** — 6-card grid showcasing core services with featured card
   - **About.jsx** — Steven's bio, credentials grid, call-to-action
   - **Philosophy.jsx** — Brand philosophy with 3 core pillars (Honor, Conviction, Legacy)
   - **Values.jsx** — 4-column value strip (Clarity, Ethics, Order, Transparency)
   - **Testimonials.jsx** — 3-card testimonial grid with 5-star ratings
   - **Team.jsx** — Leader card (Steven) + 5-member grid (Glenda, Sonya, Clyde, CJ, Zahra)
   - **Contact.jsx** — Contact form with info cards + success state
   - **Footer.jsx** — Branding, links, social icons, copyright

4. **Design & UX Features**
   - **Responsive Grid System** — Mobile (1 col) → Tablet (2 cols) → Desktop (3+ cols)
   - **Scroll-Triggered Animations** — Elements fade in as they enter viewport
   - **Smooth Transitions** — Hover states, button animations, icon pulses
   - **Glass-morphism Effects** — Frosted glass backgrounds on dark sections
   - **Floating Animation** — Hero name card floats gently on load
   - **Mobile Menu** — Hamburger drawer with smooth slide/fade
   - **Form Interactivity** — Contact form with success message state

5. **Color Scheme Implementation**
   - **Primary:** Navy (#0B1829) + Navy-2 (#142236)
   - **Accent:** Gold (#D4A84B) + Gold Light (#E8C879) + Gold Dark (#A07830)
   - **Neutral:** Cream (#FAF6EF) + Cream-2 (#F3EDE3)
   - **Text:** Slate (#4A5568) + Muted (#8A94A6)
   - Proper contrast ratios throughout for accessibility

6. **Responsive Design**
   - Mobile-first approach with `clamp()` for fluid typography
   - Hamburger menu on screens ≤ 768px
   - Adaptive grid layouts (1 → 2 → 3+ columns)
   - Touch-friendly tap targets (44px+ minimum)
   - Images optimized with object-fit and lazy-loading

7. **Browser & Performance**
   - Vite build optimization → 1.16 kB HTML, 33.55 kB CSS, 178.10 kB JS (gzipped)
   - Fast dev server with HMR (Hot Module Replacement)
   - Production build with automatic code splitting
   - Favicon implementation across browsers (favicon + apple-touch-icon)

8. **Deployment**
   - Deployed to Vercel production
   - Automatic builds on git push
   - Domain aliased: https://stevenmoning.vercel.app
   - Zero-downtime deployments

#### Key Features Implemented:

- ✅ Birdhouse in header/favicon
- ✅ All brand logos and portraits integrated
- ✅ Proper color scheme (navy, gold, cream)
- ✅ Responsive across all devices
- ✅ Non-robotic, conversational copy
- ✅ Smooth scroll animations
- ✅ Fully functional contact form
- ✅ Mobile hamburger menu
- ✅ Team member showcase
- ✅ Client testimonials with ratings
- ✅ Service cards with hover effects
- ✅ Philosophy/values sections
- ✅ Social media footer links

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18.3.1 |
| **Build Tool** | Vite 5.4.11 |
| **Styling** | Tailwind CSS 3.4.17 |
| **CSS Processing** | PostCSS 8.4.49 + Autoprefixer |
| **Fonts** | Google Fonts (Cormorant Garamond, DM Sans) |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## Project Structure

```
steven_moning/
├── public/
│   └── assets/
│       ├── Black Hi-Res.jpg        (Steven's portrait - Black background)
│       ├── Salmon Hi-Res.jpg       (Steven's portrait - Salmon background)
│       ├── Tan Hi-Res.jpg          (Steven's portrait - Tan background)
│       ├── birdhouse.jpeg          (Logo + favicon)
│       ├── brandlogo1.png          (Multi-building logo)
│       ├── brandlogo2.png          (House + key logo)
│       └── brandlogo3.png          (House outline + key)
├── src/
│   ├── components/
│   │   ├── About.jsx               (Steven's bio & credentials)
│   │   ├── Contact.jsx             (Contact form + info)
│   │   ├── Footer.jsx              (Footer with branding)
│   │   ├── Hero.jsx                (Hero section with portrait)
│   │   ├── Navbar.jsx              (Header with mobile menu)
│   │   ├── Philosophy.jsx          (Brand values & pillars)
│   │   ├── Services.jsx            (6 service cards)
│   │   ├── Team.jsx                (Team members grid)
│   │   ├── Testimonials.jsx        (Client testimonials)
│   │   ├── Ticker.jsx              (Animated services ticker)
│   │   └── Values.jsx              (4-column values strip)
│   ├── App.jsx                     (Main app component)
│   ├── index.css                   (Global styles + animations)
│   └── main.jsx                    (React entry point)
├── index.html                      (HTML root with favicon)
├── package.json                    (Dependencies & scripts)
├── vite.config.js                  (Vite configuration)
├── tailwind.config.js              (Tailwind theme config)
├── postcss.config.js               (PostCSS plugins)
├── vercel.json                     (Vercel deployment config)
├── .gitignore                      (Git ignore rules)
└── README.md                       (This file)
```

---

## Getting Started Locally

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/EmanMurtaza/moning-associates.git
cd steven_moning

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will open at `http://localhost:5173` with hot reload enabled.

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

---

## Features Overview

### 1. **Navbar** (Sticky)
- Birdhouse logo with text branding
- Desktop navigation menu (Services, About, Philosophy, Team)
- Mobile hamburger menu (slides in from top)
- Scroll-aware background opacity
- CTA button "Get a Quote"

### 2. **Hero Section**
- Full-viewport height
- Steven's portrait on the right
- Eye-catching tagline: "Turning Your Dreams into Addresses"
- Trust metrics (18+ years, 500+ deals, 4.9 rating)
- Floating name card with subtle animation
- Dual CTAs (Get Started + View Services)

### 3. **Ticker**
- Auto-scrolling services list
- Repeating items for seamless loop
- Pauses on hover
- Items: REO Properties, Luxury Homes, Investor Portfolios, Off-Market Deals, etc.

### 4. **Services**
- 6-card grid layout
- Featured card (dark navy background)
- Service icons with hover effects
- Numbered cards (01-06)
- Responsive: 3 cols desktop → 2 cols tablet → 1 col mobile

### 5. **About Steven**
- Portrait with gold frame border
- "Licensed Since 2006" badge
- Bio paragraphs (education, experience, leadership)
- 4-item credentials grid (Master's, eXp Agent, REO Certified, DFW Expert)
- Call button: "469-580-9228"

### 6. **Philosophy**
- Brand quote: "We don't just close deals..."
- 3 pillars displayed as cards:
  - 01: Honor Over Ego
  - 02: Conviction Over Convenience
  - 03: Legacy Over Limelight
- Animated left accent bar on hover

### 7. **Values Strip**
- Gold background section
- 4 values: Clarity, Ethics, Order, Transparency
- Icons + descriptions
- 2x2 grid on mobile, 4x1 on desktop

### 8. **Testimonials**
- 3-card layout with 5-star ratings
- Quote marks and attribution
- First card (dark navy) stands out
- Client names, roles, locations

### 9. **Team**
- Steven as featured leader card (left)
- 5 team members in flex grid (right)
- Avatar circles with initials
- Hover animations (scale, color change)

### 10. **Contact Section**
- Contact info on left (Phone, Email, Hours)
- Contact form on right with:
  - First Name / Last Name (side-by-side)
  - Email Address
  - Phone Number
  - Interest dropdown (Buying, Selling, Investment, REO, Luxury, Land)
  - Message textarea
  - Submit button with success state

### 11. **Footer**
- Brand logo + tagline
- Navigation links
- Social media icons (Facebook, Instagram, LinkedIn)
- Copyright + contact info

---

## Customization Guide

### Change Colors

Edit `tailwind.config.js` theme.extend.colors:
```js
colors: {
  gold:    '#D4A84B',      // Primary accent
  navy:    '#0B1829',      // Primary dark
  cream:   '#FAF6EF',      // Light background
  // ... etc
}
```

### Add New Sections

1. Create new component in `src/components/NewSection.jsx`
2. Import in `src/App.jsx`
3. Add `<NewSection />` to the component tree
4. Use `.reveal` class on elements for scroll animations

### Update Team Members

Edit `src/components/Team.jsx` members array:
```js
const members = [
  { name: 'John', role: 'Sales Agent', initials: 'J' },
  // Add more...
];
```

### Modify Testimonials

Edit `src/components/Testimonials.jsx` items array with quote, name, role.

---

## Deployment

The site is deployed on **Vercel** and auto-updates when changes are pushed to GitHub.

### Deploy to Vercel (if needed)

```bash
npm install -g vercel
vercel --prod
```

### Current Deployment
- **URL:** https://stevenmoning.vercel.app
- **Status:** ✅ Live & Ready
- **Build Time:** ~18 seconds
- **Last Deployed:** May 22, 2026

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| **HTML Size** | 1.16 kB |
| **CSS Size** | 33.55 kB (6.58 kB gzipped) |
| **JS Size** | 178.10 kB (55.52 kB gzipped) |
| **Build Time** | 1.64 seconds |
| **Module Count** | 42 modules |
| **Deployment Time** | ~18 seconds |

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile 90+

---

## Future Enhancements (Optional)

- [ ] Blog section with client stories
- [ ] Property listing integration
- [ ] Image gallery with lightbox
- [ ] Newsletter signup
- [ ] SEO optimization (meta tags, structured data)
- [ ] Analytics integration (Google Analytics, Hotjar)
- [ ] CMS integration (Contentful, Sanity)
- [ ] Multi-language support
- [ ] Live chat widget
- [ ] Video testimonials

---

## Contact & Support

**Project Owner:** Raeed Kashif (@raeedkashif)  
**Client:** Steven Moning, CEO — Moning & Associates  
**Phone:** 469-580-9228  
**Email:** steven.moning@exprealty.com

---

## License

Proprietary — Moning & Associates Real Estate Group, 2026. All rights reserved.

---

**Last Updated:** May 22, 2026  
**Version:** 1.0.0
