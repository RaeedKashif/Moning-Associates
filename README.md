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
│   │   ├── Blogs.jsx         (fetches posts from Supabase, category pills)
│   │   ├── BlogsPage.jsx     (/blogs index route)
│   │   ├── BlogPostPage.jsx  (/blog/:slug per-post detail page)
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

## Routing

The app uses a lightweight hash router (no react-router):

| Route                  | Component         | Purpose                              |
|------------------------|-------------------|--------------------------------------|
| `#/`                   | `Home`            | Landing page (Hero, Services, etc.)  |
| `#/properties`         | `PropertiesPage`  | Property listings + category filter  |
| `#/properties?cat=...` | `PropertiesPage`  | Filtered by `offmkt` / `land` / etc. |
| `#/blogs`              | `BlogsPage`       | Blog index with category pills       |
| `#/blog/<slug>`        | `BlogPostPage`    | Individual blog post (full reader)   |

---

## Supabase — Blog Posts Table

```sql
create table public.blog_posts (
  id            bigint generated always as identity primary key,
  slug          text        not null unique,
  title         text        not null,
  excerpt       text,
  cat           text        not null check (cat in (
                  'Alumni', 'Baby Boomers', 'Dallas Cowboy''s',
                  'Health & Fitness', 'Lands', 'Local Events', 'News',
                  'Off Market', 'Property', 'Sports', 'Uncategorized'
                )),
  image         text,
  author        text        not null default 'Moning & Associates',
  content       text,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create unique index blog_posts_slug_key       on public.blog_posts (slug);
create        index blog_posts_published_at_idx on public.blog_posts (published_at desc);
create        index blog_posts_cat_idx        on public.blog_posts (cat);

alter table public.blog_posts enable row level security;
create policy "Public read blog_posts" on public.blog_posts for select using (true);
```

### Content format

The `content` column accepts a tiny markdown subset, parsed line-by-line:

| Syntax           | Renders as          |
|------------------|---------------------|
| `## Heading`     | H2                  |
| `### Heading`    | H3                  |
| `> Quote text`   | Gold-bordered pull quote |
| `- item`         | Bulleted list (gold diamond markers) |
| `**bold**`       | Inline bold         |
| Blank line       | Paragraph break     |

A heading immediately followed by a list (no blank line) renders correctly as separate elements. When seeding via SQL, use dollar-quoted strings (`$$...$$`) so newlines and quotes inside content are preserved cleanly.

---

## Contact

**Client:** Steven Moning — Moning & Associates  
**Phone:** 469-580-9228  
**Email:** steven.moning@exprealty.com

---

## License

Proprietary — Moning & Associates Real Estate Group, 2026. All rights reserved.
