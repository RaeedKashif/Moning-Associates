# Phase 1 PRD — Website & Admin Systems

**Scope:** Part 1 of the AutoM8X *Complete Growth & Automation Package* proposal (July 26, 2026).
One-time build. Part 2 (AI automations) is explicitly out of scope here.

**Repos in play**

| Repo | Path | Stack | Deployed |
|---|---|---|---|
| Public site | `steven_moning` | Vite 5 + React 18 + Tailwind 3, hash router | stevenmoning.vercel.app |
| Admin panel | `steven_moning_admin` | Next.js 16 + React 19 + Tailwind 4, TypeScript | stevenmoning-admin.vercel.app |

**Data stores today:** Supabase Postgres (auth + `blogs`) · MongoDB Atlas M0 (`listings`) · Upstash Redis (listings cache) · Supabase Storage (`blog-images` bucket).

---

## 0. Current-state audit

Read the code before planning. Seven findings that change the shape of the work:

| # | Finding | Impact |
|---|---|---|
| 1 | **The contact form does not submit anywhere.** `src/components/Contact.jsx:68` is `onSubmit={e => { e.preventDefault(); setSent(true); }}` — no controlled inputs, no POST. It shows "Thanks — we got it." and discards the lead. | F4 is not "add two forms," it is building the entire lead intake path. Also a live bug: leads are being lost today. |
| 2 | **Listings have no image input.** `ListingForm.tsx` carries `images` in state (line 52) but renders no control for it. Images only ever arrived via the `scripts/import-listings-*.mjs` batch importers. | F7 is real work, not a checkbox. It also gates the "photo management" half of F5. |
| 3 | **Listing add / edit / delete / status already ship.** `/listings/new`, `/listings/[id]/edit`, `ListingsTable` delete with confirm, status badges, and `PUT`/`DELETE` API routes all exist and work. | F5 is ~80% built. Remaining gap is photos (= F7) and bulk status. Re-scope rather than rebuild. |
| 4 | **`video_url` and `virtual_tour_url` already exist** on the `Listing` type (`lib/types.ts:68-69`) and in `withDefaults()`, but no form field writes them and no public UI reads them. | F3 is mostly UI. The column work is done. |
| 5 | **No analytics data exists anywhere.** No events table, no view tracking, no referrer capture. The admin dashboard renders five `countDocuments` tiles. | F1 cannot be built as a reporting layer over existing data. It needs an ingest pipeline first, and it depends on F4. |
| 6 | **No public listing detail page exists.** The grid's "Request details" is an anchor to `#contact`. | "Which listings get the most views" has nothing to count. See F1 §Metric definition — this needs a decision from Steven. |
| 7 | **Testimonials are a hardcoded array** in `src/components/Testimonials.jsx:1-24`. Blog cover uploads already demonstrate the exact Supabase Storage pattern to copy (`BlogForm.tsx:64-84`). | F6 and F7 both have a proven in-repo pattern to mirror. Low risk. |

---

## 1. Architecture decisions

**D1 — New relational data goes in Supabase Postgres, not MongoDB.**
Inquiries, contacts, testimonials, and analytics events are all read as aggregates ("count by week", "group by source"). Postgres does that in SQL; Mongo M0 is a shared 512 MB tier already holding listings. Supabase also gives RLS, so the public site can `INSERT` an inquiry with the anon key without any write endpoint being exposed.

Consequence: "views per listing" joins across two stores. Accept it — resolve `listing_id → title` in application code on the dashboard only. Never join per-request on the public path.

**D2 — Listings stay in MongoDB, and every read/write keeps going through `lib/listings.ts`.**
That module owns the Redis cache-aside layer, the version-counter invalidation, and the pre-write snapshots that substitute for M0's missing point-in-time restore. A write that bypasses it silently serves stale data for up to 5 minutes and loses the snapshot. No new module may talk to the `listings` collection directly.

**D3 — The public site never gets a service-role key.**
Inquiry writes go to a new `POST /api/inquiries` route in the admin app (CORS-guarded, validated, rate-limited), or direct to Supabase under an insert-only RLS policy. Prefer the API route: it lets us attach server-side data (IP-derived rate limit, timestamp) the browser must not control.

**D4 — Analytics ingest is fire-and-forget.**
A tracking call must never block or break a page render. Use `navigator.sendBeacon` with a `fetch(..., {keepalive:true})` fallback, ignore all failures, and never `await` it in a render path.

---

## 2. Build order

Dependencies are real here — F1 cannot start before F4 has been collecting data.

```
Day 0   ── F2 credential request to Steven/BoldTrail (blocking, external, start immediately)
  │
  ├─ 1. F7  Listing image uploads      (unblocks F5 photos; small, visible win)
  ├─ 2. F4  Buyer & seller inquiries   (unblocks F1; fixes the live lead-loss bug)
  ├─ 3. F6  Editable testimonials      (small, self-contained)
  ├─ 4. F5  Listings gap-fill          (small — most of it already ships)
  ├─ 5. F3  Campaign video showcase
  ├─ 6. F1  BI dashboard               (needs F4 data flowing to be worth looking at)
  └─ 7. F2  BoldTrail sync             (build once credentials land; fallback in §F2)
```

Sizes below are relative (S / M / L), not hours.

---

## F1 — Business Intelligence Dashboard

> *"A private dashboard showing new inquiries by week, buyer vs. seller split, which listings get the most views, and where your leads come from."*

**Depends on:** F4 (inquiries) for three of the four metrics.

### Metric definition — needs a decision

"Which listings get the most views" has no data source, because the public site has no listing detail page (audit #6). Three options, cheapest first:

| Option | What gets counted | Cost | Honesty of the number |
|---|---|---|---|
| **A** | Card impressions in the grid (IntersectionObserver) | S | Weak — measures scroll position, not interest |
| **B** *(recommended)* | "Request details" clicks + category-page visits | S | Honest — a deliberate act of interest |
| **C** | Real detail pages at `#/listing/<slug>`, count page views | L — **out of Part 1 scope** | Strongest, and worth doing eventually |

Recommend **B** now, label the dashboard tile "Listing interest" rather than "views", and note C as a Phase 2 candidate. Do not ship a "views" number that is really a scroll count.

### Data model

```sql
-- supabase/migrations/xxxx_analytics.sql
create table public.site_events (
  id          bigint generated always as identity primary key,
  event_type  text not null check (event_type in
                ('listing_interest','category_view','page_view','form_start')),
  listing_id  text,                       -- Mongo ObjectId as string; no FK across stores
  path        text,
  referrer    text,
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  session_id  text,                       -- random per browser session, not a user id
  created_at  timestamptz not null default now()
);
create index site_events_created_idx on public.site_events (created_at desc);
create index site_events_type_idx    on public.site_events (event_type, created_at desc);
create index site_events_listing_idx on public.site_events (listing_id)
  where listing_id is not null;

alter table public.site_events enable row level security;
-- No public select. Insert only via the service role in the API route.
```

### Tasks

**T1.1 — Analytics schema (S)**
- Write the migration above into `steven_moning_admin/supabase/`, following the existing `schema.sql` conventions.
- Apply via the Supabase SQL editor or CLI. Verify RLS blocks anon `select` — test with the anon key before moving on.
- No PII in this table. No IP addresses, no emails. Session id is a random string in `sessionStorage`, regenerated per session.

**T1.2 — Event ingest endpoint (S)**
- New `app/api/events/route.ts` in the admin app.
- `POST` accepts `{event_type, listing_id?, path?, referrer?, utm_*?, session_id}`.
- Wrap responses in `withCors(res, req, "POST, OPTIONS")` and add the `OPTIONS` handler — copy the shape of `app/api/listings/route.ts:16-18`.
- Validate `event_type` against the allowlist; reject anything else with 400. Never insert an unvalidated `event_type` — the CHECK constraint is the backstop, not the filter.
- Rate-limit per session id via the existing Upstash Redis client (`lib/redis.ts`): `INCR` a key like `ev:<session>:<minute>` with a 60s TTL, drop above ~60/min. Redis being down must not block ingest (mirror the best-effort `try/catch` style already used in `lib/listings.ts`).
- Insert with `createServiceClient()` from `lib/supabase/server.ts`.

**T1.3 — Public site tracking (S)**
- New `src/lib/track.js` exporting `track(eventType, payload)`.
- Implementation: read UTM params from `window.location.search` once on load and stash in `sessionStorage`; attach to every event. Send with `navigator.sendBeacon(url, blob)`, falling back to `fetch(url, {method:'POST', keepalive:true})`. Swallow every error.
- Call sites: the "Request details" link in `src/components/Properties.jsx:140` (`listing_interest` with the listing id), and a `category_view` in `PropertiesPage.jsx` on mount.
- Respect `navigator.doNotTrack` — skip sending when it is `"1"`.

**T1.4 — Aggregation queries (M)**
- Add `steven_moning_admin/lib/analytics.ts` with one exported function per dashboard panel, each taking `{from, to}`:
  - `inquiriesByWeek()` — `date_trunc('week', created_at)` over `inquiries`, returns `[{week, count}]`.
  - `buyerSellerSplit()` — `count(*) group by intent`.
  - `topListings()` — count `site_events` where `event_type='listing_interest'` group by `listing_id`, order desc limit 10; then resolve titles via `getListingById()` from `lib/listings.ts` (batch the ids, do not loop one query per row).
  - `leadSources()` — group by `coalesce(utm_source, referrer_host, 'direct')`.
- Prefer a Postgres view or RPC for the `date_trunc` grouping rather than pulling rows into JS and bucketing there.

**T1.5 — Dashboard UI (M)**
- Extend `app/(dashboard)/dashboard/page.tsx`. Keep the existing five count tiles — they are useful and already work.
- Add below them: a weekly inquiries bar chart, a buyer/seller split, a top-10 listing interest table, and a lead-source breakdown.
- **No chart library.** Tailwind-styled divs with percentage widths render bars fine, keep the bundle small, and match the existing flat visual language (`bg-white border border-gold/25 rounded-xl`, serif numerals, gold hairline). A dependency is not justified for four panels.
- Every panel needs an explicit empty state: "No inquiries yet this period." A zero must never look like a loading failure.

**T1.6 — Date-range filter (S)**
- Presets: last 7 / 30 / 90 days, all time. Persist in the URL as a search param so a range can be linked and survives refresh.
- Server component reads `searchParams` and passes `{from, to}` into the `lib/analytics.ts` functions.

### Acceptance criteria
- [ ] A submitted inquiry appears in the weekly chart within one refresh.
- [ ] Clicking "Request details" on the live site increments that listing's interest count.
- [ ] Lead source correctly attributes a visit tagged `?utm_source=facebook`.
- [ ] Changing the date range changes every panel, and the URL.
- [ ] Anon key cannot read `site_events` (verify directly).
- [ ] Tracking failure (endpoint 500) leaves the public site fully functional.

---

## F2 — BoldTrail Data Sync (Personal CRM)

> *"Your contacts and lead records pulled out of BoldTrail into your own personal CRM inside the admin panel."*

### ⚠ Blocking external dependency — action required on day 0

BoldTrail (formerly kvCORE, Inside Real Estate) does **not** offer open self-serve API access. Access typically requires a broker/enterprise-level plan and written approval, and is often gated per-brokerage — here, eXp Realty. Nothing in this repo has BoldTrail credentials today.

**This is the single largest schedule risk in Phase 1 and it is entirely outside our control.**

Do this before writing any code:
1. Ask Steven to confirm his BoldTrail plan tier and whether API access is enabled on his account.
2. Have him open a BoldTrail support request for API credentials, naming the use case (exporting his own contacts to his own system).
3. Timebox a 1-day spike once credentials arrive: confirm the endpoints, auth scheme, rate limits, and pagination before committing to the sync design.

**Fallback if API access is refused or delayed** — build the CRM around a **CSV import** instead. BoldTrail supports contact export from the UI. Steven exports, drags the file into the admin panel, and we upsert on email. Same contacts table, same CRM UI, same value; only the sync is manual. Ship this either way — it is also the disaster-recovery path if the API changes.

### Data model

```sql
create table public.contacts (
  id             bigint generated always as identity primary key,
  external_id    text unique,             -- BoldTrail id; null for CSV/manual rows
  source         text not null default 'boldtrail'
                 check (source in ('boldtrail','csv','inquiry','manual')),
  first_name     text,
  last_name      text,
  email          text,
  phone          text,
  stage          text,                    -- BoldTrail lead status, mapped
  tags           text[] not null default '{}',
  last_activity  timestamptz,
  raw            jsonb not null default '{}',  -- untouched source payload
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index contacts_email_idx   on public.contacts (lower(email));
create index contacts_updated_idx on public.contacts (updated_at desc);

create table public.sync_runs (
  id          bigint generated always as identity primary key,
  source      text not null,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  status      text not null default 'running'
              check (status in ('running','ok','error')),
  records_in  int  not null default 0,
  records_upserted int not null default 0,
  error       text
);
```

Keep the full source payload in `raw`. When a mapping turns out wrong three weeks in, re-deriving from `raw` beats re-syncing.

### Tasks

**T2.1 — Access spike (S, blocked)** — credentials, endpoint inventory, auth scheme, rate limits, pagination model, incremental-fetch capability (`updated_since`?). Write findings into this doc before building.

**T2.2 — Schema + migration (S)** — as above. Unblocked; do it now regardless of API status, since the CSV path needs it too.

**T2.3 — BoldTrail client (M, blocked)**
- `lib/boldtrail.ts`: typed fetch wrapper, key from `BOLDTRAIL_API_KEY` (server-only, never `NEXT_PUBLIC_`).
- Handle pagination, retry `429`/`5xx` with exponential backoff and a cap, and time out individual requests.

**T2.4 — Field mapping (S)** — one pure, unit-testable `mapContact(raw)` function. Normalize phones to E.164, lowercase emails, map BoldTrail stage vocabulary to ours. Unknown stage → store verbatim, never drop.

**T2.5 — Sync job (M)**
- `app/api/sync/boldtrail/route.ts`, `POST`, protected by the existing `x-api-key`/`ADMIN_API_KEY` check (copy `isAuthorized` from `app/api/listings/route.ts:61-63`).
- Incremental: cursor from the last successful `sync_runs.finished_at`; full resync when passed `?full=true`.
- **Upsert on `external_id`, never insert blindly** — re-running must not duplicate contacts. Make the job idempotent and safe to retry.
- Write a `sync_runs` row at start and update it at the end, including on failure.
- Schedule via Vercel Cron (`vercel.json` in the admin repo), e.g. every 6 hours. Vercel Hobby caps cron frequency and function duration — check the plan before choosing an interval, and chunk the work if a full sync risks the timeout.

**T2.6 — CSV import fallback (S)** — upload → parse → column-mapping preview → upsert on lowercased email. Show a dry-run count ("142 rows: 30 new, 112 updates") and require confirmation before writing.

**T2.7 — CRM UI (M)**
- New `app/(dashboard)/contacts/page.tsx` + a `Contacts` entry in `components/layout/Sidebar.tsx` (the nav array at line 20).
- List with search (name/email/phone), filters (source, stage, tag), sorted by `last_activity`.
- Server-side pagination — this table will outgrow client-side filtering.
- Detail drawer: full contact, raw payload viewer, related inquiries (join on lowercased email).

**T2.8 — Sync status surfacing (S)** — last run, status, counts, and last error on the Settings page, which already renders a config table (`app/(dashboard)/settings/page.tsx`). A silently failing sync is worse than no sync.

### Acceptance criteria
- [ ] Running the sync twice in a row produces zero duplicates.
- [ ] A contact edited in BoldTrail shows updated values after the next run.
- [ ] A failed run is visible in Settings with its error text.
- [ ] API keys appear in no client bundle (`grep` the built output).
- [ ] CSV import produces the same row shape as API sync.

---

## F3 — Campaign Video Showcase

> *"A dedicated section for your property tour and marketing videos, organized by listing."*

**Current state:** `video_url` and `virtual_tour_url` exist on the `Listing` type and in `withDefaults()`, but nothing writes or reads them (audit #4).

### Data model

One video per listing is too tight for "marketing videos" plural. Add a `videos` array to the listing document:

```ts
// lib/types.ts
export interface ListingVideo {
  url: string;
  title?: string;
  kind: "tour" | "campaign" | "walkthrough";
}
// on Listing:  videos: ListingVideo[];
// on ListingInsert:  videos?: ListingVideo[];
```

Update `withDefaults()` in `lib/listings.ts` to default `videos: []` — Mongo has no column defaults, and that function is the only thing standing in for them. Existing documents lack the field, so **all read paths must tolerate `undefined`** (`listing.videos ?? []`). Keep `video_url` as-is for backward compatibility; do not migrate or drop it in this phase.

### Tasks

**T3.1 — Type + defaults (S)** — as above. Touch `lib/types.ts` and `withDefaults()` only; the API route needs no change since it spreads the whole document.

**T3.2 — URL parsing helper (S)**
- `lib/video.ts`: `parseVideoUrl(url)` → `{provider: 'youtube'|'vimeo', id, thumbnailUrl, embedUrl}`.
- Accept the formats Steven will actually paste: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, `vimeo.com/<id>`.
- Return `null` for unrecognized input rather than throwing, and surface that as a validation error in the form.

**T3.3 — Admin form field (S)**
- Repeatable video rows in `ListingForm.tsx`: URL + optional title + kind, with add/remove.
- Validate on blur via `parseVideoUrl`; show the resolved thumbnail as instant confirmation the link is right.

**T3.4 — Public per-listing embed (M)**
- On the property card in `src/components/Properties.jsx`, show a play badge when the listing has videos.
- **Use a click-to-play facade**, not a bare iframe: render the thumbnail, swap in the `youtube-nocookie.com` iframe on click. Embedding N iframes in a 9-card grid would cost megabytes and tank the page.

**T3.5 — Video gallery section (M)**
- New route `#/videos` → `src/components/VideosPage.jsx`, registered in `App.jsx`'s `parseRoute`, and added to the navbar (`src/components/Navbar.jsx`).
- Group by listing, reuse the existing page-hero pattern from `PropertiesPage.jsx`, and add a title/description in `src/lib/propertyCategories.js` style.
- Source data from the same `/api/listings` call; filter to listings with a non-empty `videos` array. No new endpoint.
- Empty state matching the site's voice if no videos exist yet.

### Acceptance criteria
- [ ] A pasted YouTube URL saves, and appears on the site without a redeploy.
- [ ] Listings created before this feature still render (no `videos` field) — verify explicitly.
- [ ] The gallery page loads no video iframes until a thumbnail is clicked.
- [ ] An invalid URL is rejected in the admin form with a clear message.

---

## F4 — Buyer & Seller Inquiry Forms

> *"Two purpose-built forms, one for buyers and one for sellers, with every submission landing in your personal CRM already tagged."*

**This is the highest-value item in Phase 1 and it fixes a live bug.** The current contact form tells visitors "Thanks — we got it" and then throws the lead away (audit #1). Every day this ships earlier is leads recovered.

### Data model

```sql
create table public.inquiries (
  id           bigint generated always as identity primary key,
  intent       text not null check (intent in ('buyer','seller','general')),
  first_name   text not null,
  last_name    text,
  email        text not null,
  phone        text,
  message      text,
  interest     text,                      -- the "I'm interested in" dropdown
  listing_id   text,                      -- if raised from a specific listing
  -- Attribution, captured server-side where possible
  source       text,                      -- utm_source or referrer host
  utm_medium   text,
  utm_campaign text,
  page_path    text,
  -- Workflow
  status       text not null default 'new'
               check (status in ('new','contacted','qualified','closed','spam')),
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index inquiries_created_idx on public.inquiries (created_at desc);
create index inquiries_status_idx  on public.inquiries (status, created_at desc);

alter table public.inquiries enable row level security;
-- No anon policies at all: writes arrive via the service role in the API route (D3).
```

### Tasks

**T4.1 — Schema + migration (S)** — as above.

**T4.2 — Inquiry endpoint (M)**
- `app/api/inquiries/route.ts` in the admin app: `POST` + `OPTIONS`, wrapped in `withCors(res, req, "POST, OPTIONS")`.
- Validate server-side: required fields present, email shape, lengths capped (message ≤ 5000 chars). Never trust the client.
- **Spam defenses, in this order:** a honeypot field hidden with CSS that must stay empty; a minimum time-on-form (reject submissions under ~3 seconds); Redis rate-limit per IP (5/hour). Add a CAPTCHA only if spam actually materializes — do not tax real leads pre-emptively.
- Derive `source` from the `Referer` header when the client sends no UTM.
- Return `{ok:true}` on success and a field-level error map on validation failure.
- Insert via `createServiceClient()`.

**T4.3 — Shared form component (M)**
- `src/components/InquiryForm.jsx` on the public site, taking an `intent` prop.
- **Controlled inputs with real state** — this is what `Contact.jsx` is missing today.
- Three states: idle, submitting (disable the button, prevent double-submit), and either success or error. The success state must only render after a `2xx`.
- Inline per-field validation on blur. Keep the existing visual language: `Field` helper, `glass-card`, `btn-gold`.
- Accessibility: real `<label htmlFor>` (the current `Field` has an unassociated label), `aria-invalid` on errors, and an `aria-live` region for the result.

**T4.4 — Fix `Contact.jsx` (S)** — replace the fake submit with `InquiryForm intent="general"`, mapping the existing "I'm interested in" dropdown to `interest`. Keep the layout and copy exactly as-is.

**T4.5 — Dedicated buyer & seller pages (M)**
- Routes `#/buyers` and `#/sellers` in `App.jsx`, linked from the navbar.
- Buyer fields: budget range, areas, timeline, financing (pre-approved / cash / not yet).
- Seller fields: property address, approximate value, reason for selling, timeline.
- Both submit to the same endpoint with `intent` set. Extra fields go into `message` as structured text, or add typed columns if Steven wants to filter on them — **ask before adding columns**.

**T4.6 — Attribution capture (S)** — reuse the UTM capture from T1.3 so the source is stamped on the inquiry at submit time.

**T4.7 — Admin inquiries inbox (M)**
- `app/(dashboard)/inquiries/page.tsx` + sidebar entry.
- Table: date, name, intent badge, interest, source, status. Filter by status/intent, search by name/email.
- Row detail: full message, editable status dropdown, notes field.
- Unread count badge in the sidebar — this is the screen Steven opens every morning.

**T4.8 — New-inquiry notification (S — confirm scope)**
Not named in the proposal, but an inbox nobody checks is worth little. Email Steven on each new inquiry via Resend (~10 lines in the API route). Flag to the client as a small addition rather than assuming it is included.

### Acceptance criteria
- [ ] A submission from the live site appears in the admin inbox within seconds.
- [ ] Double-clicking submit creates exactly one inquiry.
- [ ] A failed request shows an error and does **not** show the success state.
- [ ] Honeypot submissions are rejected and never stored.
- [ ] `intent` is correctly set from all three entry points.
- [ ] Keyboard-only submission works; labels are screen-reader associated.

---

## F5 — Editable Listings (Admin Upgrade)

> *"Add, edit, or remove listings yourself anytime, photos, price, status, and description included."*

**Mostly already built** (audit #3): `/listings/new`, `/listings/[id]/edit`, delete with confirmation, status badges, and the `PUT`/`DELETE` routes all exist and work. Scope this as verification plus gap-fill, not a rebuild.

### Tasks

**T5.1 — Verification pass (S)** — walk create → edit → publish → delete against production data. Log defects rather than assuming the paths are sound.

**T5.2 — Photo management (S)** — delivered by F7. No separate work.

**T5.3 — Bulk status controls (S)** — multi-select checkboxes in `ListingsTable.tsx` with bulk publish / draft / archive. Confirm destructive bulk actions with a count ("Archive 12 listings?").

**T5.4 — Unsaved-changes guard (S)** — warn before navigating away from a dirty `ListingForm`. Losing a half-written listing is the most annoying possible bug in this panel.

**T5.5 — Validation tightening (S)** — required title; price non-negative; year_built sane; **warn (do not block) when publishing a listing with no photos**.

### Acceptance criteria
- [ ] A field edited in the admin appears on the public site within the 5-minute cache TTL, or immediately (the version counter should invalidate on write — verify it actually does).
- [ ] Deleting a listing removes it from the public grid.
- [ ] Navigating away from unsaved edits prompts first.

---

## F6 — Editable Testimonials

> *"Client testimonials move into the admin panel so you can add or update a review in under a minute."*

**Current state:** hardcoded `items` array, `src/components/Testimonials.jsx:1-24`.

### Data model

```sql
create table public.testimonials (
  id          bigint generated always as identity primary key,
  quote       text not null,
  name        text not null,
  role        text,                       -- "First-Time Buyers · Frisco, TX"
  initials    text,                       -- derived from name if blank
  rating      int  not null default 5 check (rating between 1 and 5),
  featured    boolean not null default false,  -- drives the dark card treatment
  sort_order  int  not null default 0,
  status      text not null default 'published'
              check (status in ('draft','published')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.testimonials enable row level security;
create policy "Public read published testimonials"
  on public.testimonials for select using (status = 'published');
```

Public read via RLS + anon key means the public site queries Supabase directly, exactly as it already does for blogs. No API route needed.

### Tasks

**T6.1 — Schema + seed (S)** — migration plus an INSERT of the three existing testimonials verbatim, preserving the current order and the `dark: true` flag on the first as `featured`. Copy the quotes exactly; they are real client words.

**T6.2 — Admin CRUD (M)** — `app/(dashboard)/testimonials/` (list + new + edit) and a sidebar entry. Mirror the blog pages' structure and server actions rather than inventing a new pattern. Reordering can be a simple numeric `sort_order` input; drag-and-drop is not worth the complexity here.

**T6.3 — Public component rewrite (S)**
- Fetch in `Testimonials.jsx` via the existing `src/lib/supabase.js` client, ordered by `sort_order, created_at desc`.
- Keep the markup and Tailwind classes byte-identical — this is a data-source change, not a redesign.
- Derive `initials` from `name` when the column is empty.
- Render a skeleton while loading and nothing at all if the query fails. **Do not leave the hardcoded array as a fallback** — a deleted testimonial reappearing on the live site would be worse than an empty section.

### Acceptance criteria
- [ ] The three current testimonials render identically to today after the switch.
- [ ] Adding one in the admin makes it appear on the site without a redeploy.
- [ ] Setting one to `draft` removes it from the public site.
- [ ] Anon key cannot read draft rows.

---

## F7 — Listing Image Uploads *(free in the proposal)*

> *"Upload and manage your own listing photos directly from the admin panel."*

**Current state:** no image control exists in the listing form (audit #2). The pattern to copy is `BlogForm.tsx:64-84`.

### Tasks

**T7.1 — Storage bucket (S)**
- Create a public `listing-images` bucket in Supabase Storage, matching the existing `blog-images` setup.
- Policies: public read; insert/update/delete for authenticated users only.
- Path convention `listings/<listing-id-or-temp>/<timestamp>-<random>.<ext>`, mirroring the blog code's collision-resistant naming.

**T7.2 — Uploader component (M)**
- `components/listings/ImageUploader.tsx`, props `{value: string[], onChange}`.
- Drag-and-drop plus a file picker; multi-file; per-file progress; remove; reorder.
- **The first image is the cover** — the public grid renders `images[0]` (`Properties.jsx:71`). Label it explicitly in the UI so the ordering is not a hidden rule.
- Reject non-images and files over ~10 MB client-side with a clear message.

**T7.3 — Client-side compression (S)**
- Before upload, downscale to max 2000px on the long edge and re-encode as JPEG ~0.82 via a canvas. Phone photos are 5–10 MB; the grid renders them at 400px wide.
- This is the difference between a fast site and a slow one, and it costs ~30 lines with no dependency.

**T7.4 — Wire into `ListingForm` (S)** — bind to the existing `form.images`. No API or type change; `images: string[]` already flows end to end.

**T7.5 — Orphan cleanup (S)** — removing an image from the form should delete the storage object. If the listing is never saved, uploads are orphaned; keep it simple and accept a small amount of orphaning rather than building a GC job, but do delete on explicit removal.

### Acceptance criteria
- [ ] Dragging 5 photos onto the form uploads all of them with visible progress.
- [ ] Reordering changes which photo is the public card image.
- [ ] A 9 MB phone photo lands in storage under ~1 MB.
- [ ] Uploads work on mobile Safari (Steven will do this from a phone at a property).
- [ ] An upload failure shows an error and leaves the other images intact.

---

## 3. Cross-cutting work

**T0.1 — CORS allowlist (S).** `lib/cors.ts:6-10` lists only `stevenmoning.vercel.app` and two localhost ports. The proposal names **moningassociates.com** as the site. Every new endpoint (events, inquiries) is CORS-guarded, so the real production domain — plus the Hostinger host if it stays live — must be added via `CORS_ALLOWED_ORIGINS` before launch, or every form silently fails in production.

**T0.2 — Environment variables (S).**

| Var | Repo | Notes |
|---|---|---|
| `BOLDTRAIL_API_KEY` | admin | Server-only. Never `NEXT_PUBLIC_`. |
| `RESEND_API_KEY` | admin | Only if T4.8 is in scope |
| `CORS_ALLOWED_ORIGINS` | admin | Comma-separated production domains |
| `VITE_ADMIN_API_URL` | public | Already effectively exists as `VITE_LISTINGS_API_URL` — reuse it rather than adding a second base URL |

**T0.3 — Fix the stale README (XS).** `steven_moning/README.md` documents a `blog_posts` table with a `cat` column. The code actually reads `blogs` with a `tags` array (`BlogPostPage.jsx:37`, `lib/types.ts:14`). Anyone onboarding will trust the README and be wrong.

**T0.4 — Security review before launch (S).**
- Service-role key never reaches a client bundle — grep the built output, do not assume.
- `meta` stays stripped from public listing responses (`toPublic()` in `app/api/listings/route.ts:12`) — it holds owner names and parcel IDs.
- RLS verified on every new table with the anon key, not just read in the migration file.
- Rate limits confirmed working on both public endpoints.

**T0.5 — QA pass (M).** Mobile Safari and Chrome Android for both forms and the uploader. Keyboard-only navigation through each form. Every new panel's empty state. Every new endpoint's failure state.

---

## 4. Decisions needed from Steven

Do not start the dependent tasks until these are answered:

1. **BoldTrail API access** — is it enabled on his plan? (Blocks F2 entirely; start the request now.)
2. **Listing views** — accept "listing interest" (option B), or fund detail pages in a later phase? (Blocks T1.5.)
3. **Production domain** — is moningassociates.com live, and does it point at Vercel or Hostinger? (Blocks T0.1 and therefore every form in production.)
4. **Buyer/seller extra fields** — should budget, timeline, and financing be filterable columns, or free text in the message? (Blocks T4.5.)
5. **New-inquiry email alerts** — in scope (T4.8) or not?

## 5. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| BoldTrail API access refused or slow | **High** | Blocks F2 ($109 of Part 1) | Request on day 0; build the CSV fallback regardless |
| Mongo M0 limits (512 MB, shared) reached | Low | Listings degrade | Analytics goes to Postgres (D1); watch with `scripts/check-mongo-health.mjs` |
| Supabase free-tier storage exceeded by photos | Medium | Uploads fail | Client-side compression (T7.3) is the primary control |
| Form spam once a real endpoint exists | Medium | Noise in the CRM | Layered defenses (T4.2); CAPTCHA only if needed |
| Two data stores drift | Medium | Wrong dashboard numbers | Listings stay behind `lib/listings.ts` (D2); join only in the dashboard |
| Cache invalidation not firing on write | Low | Stale public site | Explicitly verified in F5 acceptance criteria |

## 6. Definition of done — Phase 1

- [ ] All seven features meet their acceptance criteria.
- [ ] Both apps build clean (`npm run build`) with no new TypeScript or lint errors.
- [ ] Every new table has RLS verified against the anon key.
- [ ] No secret appears in any client bundle.
- [ ] Steven can, unaided: add a listing with photos, edit a testimonial, see a real inquiry arrive, and read the dashboard.
- [ ] READMEs in both repos reflect the built system.
- [ ] Production CORS covers the real domain and both forms are confirmed working there.
