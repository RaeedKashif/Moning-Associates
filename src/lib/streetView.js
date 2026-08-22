// Street-level photos for listings that have no photograph of their own.
//
// Most of the off-market parcels are vacant land Steven has never had shot, so
// the cards fall back to a "photo coming soon" panel. Street View fills that
// gap with an actual picture of the actual address.
//
// It is deliberately fetched live from Google rather than downloaded into our
// own bucket. The Maps Platform terms do not permit scraping, caching or
// re-hosting their imagery, and user-contributed place photos belong to the
// people who took them. Rendering the API URL in an <img> is the supported
// path, and it keeps the Google attribution that is baked into the image.
//
// Needs VITE_GOOGLE_MAPS_API_KEY. Without one every helper here returns null
// and the cards keep the branded placeholder they have today.

import { useEffect, useState } from 'react';

const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const STATIC = 'https://maps.googleapis.com/maps/api/streetview';

export const hasStreetView = () => Boolean(KEY);

/** "3739 Myrtle Street, Dallas, TX, 75215" from the listing's own columns. */
export function listingAddress(listing) {
  const line = [listing.address, listing.city, listing.state, listing.zip_code]
    .map(v => (v ?? '').toString().trim())
    .filter(Boolean)
    .join(', ');
  // A city alone would return a photo of somewhere else entirely, which is
  // worse than no photo at all.
  return listing.address ? line : null;
}

export function streetViewUrl(address, { width = 640, height = 480 } = {}) {
  if (!KEY || !address) return null;
  const params = new URLSearchParams({
    location: address,
    size: `${width}x${height}`,
    fov: '80',        // a little wider than default; parcels are rarely narrow
    pitch: '0',
    return_error_code: 'true', // 404 rather than the grey "no imagery" tile
    key: KEY,
  });
  return `${STATIC}?${params}`;
}

/** Google's own link for the address, for the "see it on the map" affordance. */
export function mapsLink(address) {
  if (!address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Whether Google actually holds imagery for an address. This endpoint is free
// and unmetered, which is the whole reason to call it: it keeps us from paying
// for a photo that turns out to be the grey "no imagery" placeholder, and it
// keeps that placeholder off the page.
const cache = new Map();

async function lookup(address) {
  if (cache.has(address)) return cache.get(address);
  const params = new URLSearchParams({ location: address, key: KEY });
  const promise = fetch(`${STATIC}/metadata?${params}`)
    .then(r => r.json())
    .then(j => j.status === 'OK')
    .catch(() => false);
  cache.set(address, promise);
  return promise;
}

/**
 * Resolves to a Street View URL for an address, or null when there is no key,
 * no address, or Google has no imagery of the place.
 */
export function useStreetView(address, options) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!KEY || !address) return;
    let alive = true;
    lookup(address).then(ok => {
      if (alive && ok) setUrl(streetViewUrl(address, options));
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return url;
}
