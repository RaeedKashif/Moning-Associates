# Photos for listings that have none

All 13 published off-market listings are vacant land parcels, and every one of
them has `images: []`. The cards fall back to a branded "photo coming soon"
panel.

| # | Address | Slug |
| --- | --- | --- |
| 1 | 6614 S Lancaster Rd, Dallas, TX 75241 | `6614-s-lancaster-rd-dallas-7341a3` |
| 2 | 6616 S Lancaster Rd, Dallas, TX 75241 | `6616-s-lancaster-rd-dallas-7341a3` |
| 3 | 3809 Laurens Place Road, Denton, TX 76210 | `3809-laurens-place-road-denton-5467b1` |
| 4 | 3415 Crossman Avenue, Dallas, TX 75212 | `3415-crossman-avenue-dallas-12059e` |
| 5 | 6506 S Lancaster Road, Dallas, TX 75241 | `6506-s-lancaster-road-dallas-ea0598` |
| 6 | 3219 Reed Lane, Dallas, TX 75215 | `3219-reed-lane-dallas-b4f5c9` |
| 7 | 2901 Foreman Street, Dallas, TX 75210 | `2901-foreman-street-dallas-94716d` |
| 8 | 215 Sailview Court, Honey Grove, TX 75446 | `215-sailview-court-honey-grove-0d0b8c` |
| 9 | 5712 Houghton Avenue, Fort Worth, TX | `5712-houghton-avenue-fort-worth-4ff508` |
| 10 | 5609 Lake Granbury Trail, Granbury, TX 76048 | `5609-lake-granbury-trail-granbury-2d4a6f` |
| 11 | 4930 Peachtree Circle, Granbury, TX 76048 | `4930-peachtree-circle-granbury-7feca8` |
| 12 | 824 W Walker Street, Denison, TX 75020 | `824-w-walker-street-denison-f06f63` |
| 13 | 3739 Myrtle Street, Dallas, TX 75215 | `3739-myrtle-street-dallas-86459e` |

## Why the photos are not downloaded

Pulling Street View tiles or user-contributed photos off Google Maps and
serving them from our own bucket is not something we can do. The Maps Platform
terms prohibit scraping, caching and re-hosting their content, and the
user-submitted photos belong to whoever took them. For a brokerage site that is
a real liability, not a technicality.

So the imagery is fetched live from Google at render time instead. That is the
supported path, it keeps the Google attribution that is baked into the image,
and nothing of theirs is stored on our side.

## How it works

`src/lib/streetView.js` builds a Street View Static API URL from a listing's
own address columns. `Properties.jsx` uses it **only** when a listing has no
photograph of its own, and labels it "Street view — not a listing photo" with a
link through to Google Maps. A real photo, once uploaded, always wins.

Two details worth knowing:

- The free, unmetered `/streetview/metadata` endpoint is checked first. Google
  returns a grey "no imagery" tile for places it has never driven, and this
  keeps both that tile off the page and the billable request unmade.
- Addresses without a street number resolve to `null` rather than a photo of
  the middle of the city. A wrong photo is worse than none.

**With no API key configured the whole thing is inert** — every card keeps the
placeholder it has today. Nothing changes until the key below exists.

## Switching it on

1. In Google Cloud Console, create a project and enable **Street View Static
   API**.
2. Create an API key. This key ships in the public JS bundle — that is normal
   for browser Maps use, but it must be restricted or anyone can spend your
   quota:
   - **Application restriction:** HTTP referrers →
     `https://stevenmoning.vercel.app/*` and your custom domain.
   - **API restriction:** Street View Static API only.
   - Set a **daily quota cap** on the API so a bad month cannot run away.
3. Add it to Vercel: Project → Settings → Environment Variables →
   `VITE_GOOGLE_MAPS_API_KEY`, Production scope.
4. Add the same line to `.env.local` for local work.
5. Redeploy. Vite inlines env vars at build time, so a redeploy is required —
   setting the variable alone does nothing.

Street View Static is billed per image request. The metadata pre-check is free,
and a real uploaded photo skips the API entirely, so the bill shrinks as Steven
adds actual photographs.

## The better long-term answer

Street View is a stopgap. It shows the road frontage on whatever day Google
last drove past, which for a vacant lot is often a verge and a fence. Real
photos of the parcels are worth more to a buyer and cost nothing to serve:
upload them in the admin against each listing and they take priority
automatically.
