# Moning & Associates — Steven Moning Real Estate Website

A modern, responsive website for Steven Moning and Moning & Associates, a premier Dallas–Fort Worth real estate agency specializing in luxury homes, REO properties, investor portfolios, and residential sales.

**Live Site:** https://stevenmoning.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Database | Supabase (blog posts) |
| Deployment | Vercel |

---

## Project Structure

```
steven_moning/
├── public/assets/          (brand images, portraits, logos)
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Blogs.jsx       (fetches posts from Supabase)
│   │   ├── BlogsPage.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Philosophy.jsx
│   │   ├── Properties.jsx
│   │   ├── PropertiesPage.jsx
│   │   ├── Services.jsx
│   │   ├── Team.jsx
│   │   ├── Testimonials.jsx
│   │   └── Ticker.jsx
│   ├── lib/
│   │   └── supabase.js     (Supabase client)
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.local              (gitignored — add your keys here)
├── vercel.json
└── package.json
```

---

## Local Setup

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone https://github.com/EmanMurtaza/moning-associates.git
cd steven_moning
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Run

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build locally
```

---

## Deployment

Deployed on Vercel. To redeploy manually:

```bash
vercel --prod
```

To add or update environment variables via CLI:

```bash
echo "value" | vercel env add VAR_NAME production
vercel --prod   # redeploy to pick up the change
```

---

## Supabase — Blog Posts Table

```sql
create table public.blog_posts (
  id            bigint generated always as identity primary key,
  title         text        not null,
  excerpt       text,
  cat           text        not null check (cat in (
                  'Market Insights', 'Buyer Guide', 'Seller Tips',
                  'Investment', 'Luxury Living', 'DFW Lifestyle', 'REO & Off-Market'
                )),
  image         text,
  author        text        default 'Moning & Associates',
  read          text,
  published_at  timestamptz default now(),
  created_at    timestamptz default now()
);

alter table public.blog_posts enable row level security;
create policy "Public read" on public.blog_posts for select using (true);
```

---

## Contact

**Client:** Steven Moning — Moning & Associates  
**Phone:** 469-580-9228  
**Email:** steven.moning@exprealty.com

---

## License

Proprietary — Moning & Associates Real Estate Group, 2026. All rights reserved.
