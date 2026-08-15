// Listings sit on two independent axes, and the admin app is the source of
// truth for both (steven_moning_admin/lib/types.ts):
//
//   property_type   what the property IS     luxury | land | dorms
//   sales_channel   how it SELLS             on_market | off_market | wholesale
//
// "Off market" used to live in the type list, which was a category error — it
// describes how a property sells, not what it is. Every type now carries every
// channel (Land + Wholesale, Luxury + Off-market), so the site filters on two
// levels instead of one flat row of pills.
//
// The `slug` values match the old standalone .html pages, so existing links and
// bookmarks keep working: `active-listing` and `off-market-properties` are now
// channel pages across all types rather than types of their own.

export const PROPERTY_TYPES = [
  {
    key: 'all',
    slug: 'properties',
    label: 'All Properties',
    navLabel: 'View All',
    title: 'All Properties | Moning & Associates',
    description:
      'Every listing we are currently working across Dallas–Fort Worth — luxury estates, land, student housing, MLS listings, off-market deals and wholesale contracts.',
    hero: {
      tag: 'The Portfolio',
      titleLead: 'All',
      titleAccent: 'Properties',
      blurb:
        'Everything we are currently working across DFW — homes on the MLS, land, ' +
        'luxury estates, and the private deals you will not find anywhere else.',
    },
    cta: {
      headingLead: 'Hunting for something',
      headingAccent: 'specific?',
      blurb:
        'A lot of our best deals never make it to the MLS. Tell us what you are ' +
        'looking for and we will quietly put together a private shortlist for you.',
      button: 'Request a Private List',
    },
  },
  {
    key: 'luxury',
    slug: 'luxury-properties',
    label: 'Luxury',
    navLabel: 'Luxury Properties',
    title: 'Luxury Properties | Moning & Associates',
    description:
      'Estates, designer homes, and premium residences across the most sought-after neighbourhoods in Dallas–Fort Worth.',
    hero: {
      tag: 'Premier Estates',
      titleLead: 'Luxury',
      titleAccent: 'Properties',
      blurb:
        'Estates, designer homes, and premium residences in the DFW neighbourhoods ' +
        'people actually want to live in.',
    },
    cta: {
      headingLead: 'Want to see',
      headingAccent: "DFW's finest?",
      blurb:
        'Steven works the top of this market every week and knows which homes are ' +
        'genuinely worth the asking price and which ones are not.',
      button: 'Schedule a Private Showing',
    },
  },
  {
    key: 'land',
    slug: 'lands',
    label: 'Lands',
    navLabel: 'Lands',
    title: 'Lands | Moning & Associates',
    description:
      'Land and lot listings across DFW — development parcels, investment acreage, and residential lots.',
    hero: {
      tag: 'Land Acquisition',
      titleLead: 'Lands',
      titleAccent: '',
      blurb:
        'Raw acreage, development lots, and investment land across North Texas — ' +
        'from small residential parcels to large rural tracts.',
    },
    cta: {
      headingLead: 'Looking for the',
      headingAccent: 'right parcel?',
      blurb:
        'Whether you are building a custom home or developing commercially, Steven ' +
        'can help you find land that fits your plans and your budget.',
      button: 'Talk to Steven',
    },
  },
  {
    key: 'dorms',
    slug: 'dorms',
    label: 'Dorms',
    navLabel: 'Dorms',
    title: 'Dorms | Moning & Associates',
    description:
      'Student housing across DFW — purpose-built blocks, converted homes, and by-the-bed rentals within walking distance of the campuses.',
    hero: {
      tag: 'Student Housing',
      titleLead: 'Dorms',
      titleAccent: '',
      blurb:
        'Student housing around the DFW campuses — purpose-built blocks, converted ' +
        'homes, and by-the-bed rentals that stay full through the school year.',
    },
    cta: {
      headingLead: 'Buying near a',
      headingAccent: 'campus?',
      blurb:
        'Student housing lives or dies on the walk to class and how August turnover ' +
        'goes. Steven knows which blocks fill every year and which ones sit empty.',
      button: 'Talk to Steven',
    },
  },
];

// The sub-category under every property type. `slug` is the second path
// segment (#/lands/wholesale); `standaloneSlug` is the page you get when no
// type is chosen, and keeps the two URLs the site already published.
export const SALES_CHANNELS = [
  {
    key: 'all',
    slug: null,
    standaloneSlug: null,
    label: 'Every Channel',
    pillLabel: 'All',
    navLabel: 'Everything',
  },
  {
    key: 'on_market',
    slug: 'active-listing',
    standaloneSlug: 'active-listing',
    label: 'Active Listing',
    pillLabel: 'On Market',
    navLabel: 'Active Listing',
    badge: 'Active',
    heroTag: 'MLS Active',
    // Used when a type and a channel are both chosen.
    comboBlurb:
      'Listed on the MLS and open to any buyer — priced, photographed and ready ' +
      'to show.',
    // The standalone page, across every property type.
    title: 'Active Listing | Moning & Associates',
    description:
      'Properties currently listed and available on the market across Dallas–Fort Worth.',
    hero: {
      tag: 'MLS Active',
      titleLead: 'Active',
      titleAccent: 'Listing',
      blurb:
        'Homes currently on the market — priced right, presented well, and ready ' +
        'for buyers who are serious.',
    },
    cta: {
      headingLead: 'Ready to make',
      headingAccent: 'an offer?',
      blurb:
        'Steven walks you through the offer, negotiates on your behalf, and makes ' +
        'sure you get to closing without surprises.',
      button: 'Contact Steven',
    },
  },
  {
    key: 'off_market',
    slug: 'off-market',
    standaloneSlug: 'off-market-properties',
    label: 'Off Market',
    pillLabel: 'Off Market',
    navLabel: 'Off Market Properties',
    badge: 'Off Market',
    heroTag: 'Exclusive Access',
    comboBlurb:
      'Never listed on the MLS. These move quietly through Steven’s network of ' +
      'owners, investors and agents across DFW.',
    title: 'Off Market Properties | Moning & Associates',
    description:
      'Private DFW listings that never reach the MLS — available through Steven Moning’s investor and agent network.',
    hero: {
      tag: 'Exclusive Access',
      titleLead: 'Off Market',
      titleAccent: 'Properties',
      blurb:
        'Private listings that never reach the general public. These come through ' +
        "Steven's network of investors and agents across DFW.",
    },
    cta: {
      headingLead: 'Want more',
      headingAccent: 'off-market deals?',
      blurb:
        "Steven's network gives you a first look at properties before they ever hit " +
        'the MLS. Reach out and we will put you on the list.',
      button: 'Get In Touch',
    },
  },
  {
    key: 'wholesale',
    slug: 'wholesale',
    standaloneSlug: 'wholesale-properties',
    label: 'Wholesale',
    pillLabel: 'Wholesale',
    navLabel: 'Wholesale Properties',
    badge: 'Wholesale',
    heroTag: 'Private Deals',
    comboBlurb:
      'Contracts we control and assign on — priced for buyers who can close ' +
      'quickly and without a financing contingency.',
    title: 'Wholesale Properties | Moning & Associates',
    description:
      'Private acquisition and assignment deals across DFW — contracted properties available to buyers who can close fast.',
    hero: {
      tag: 'Private Deals',
      titleLead: 'Wholesale',
      titleAccent: 'Properties',
      blurb:
        'Deals we have under contract and pass straight on. No MLS, no listing ' +
        'agent, no bidding war — just a number and a closing date.',
    },
    cta: {
      headingLead: 'Want first look at',
      headingAccent: 'the next one?',
      blurb:
        'Wholesale deals go to whoever can close, and they go quickly. Tell us what ' +
        'you buy and we will send them to you before they go anywhere else.',
      button: 'Join the Buyers List',
    },
  },
];

export const TYPE_BY_KEY = Object.fromEntries(PROPERTY_TYPES.map(t => [t.key, t]));
export const TYPE_BY_SLUG = Object.fromEntries(PROPERTY_TYPES.map(t => [t.slug, t]));
export const CHANNEL_BY_KEY = Object.fromEntries(SALES_CHANNELS.map(c => [c.key, c]));

// Channel pages that live at the top level, for when no type is chosen.
const CHANNEL_BY_STANDALONE = Object.fromEntries(
  SALES_CHANNELS.filter(c => c.standaloneSlug).map(c => [c.standaloneSlug, c])
);
// Either spelling works as the second segment, so #/lands/off-market and
// #/lands/off-market-properties both land in the same place.
const CHANNEL_BY_SEGMENT = Object.fromEntries(
  SALES_CHANNELS.filter(c => c.slug)
    .flatMap(c => [[c.slug, c], [c.standaloneSlug, c]])
);

/** Every path this router owns — used by the legacy .html redirect. */
export const LISTING_SLUGS = new Set([
  ...PROPERTY_TYPES.map(t => t.slug),
  ...Object.keys(CHANNEL_BY_STANDALONE),
]);

/** The hash route for a point in the hierarchy. */
export function listingHref(typeKey = 'all', channelKey = 'all') {
  const type = TYPE_BY_KEY[typeKey] || TYPE_BY_KEY.all;
  const channel = CHANNEL_BY_KEY[channelKey] || CHANNEL_BY_KEY.all;

  if (channel.key === 'all') return `#/${type.slug}`;
  if (type.key === 'all') return `#/${channel.standaloneSlug}`;
  return `#/${type.slug}/${channel.slug}`;
}

/** A path from the hash, back to a type/channel pair. Null if we don't own it. */
export function resolveListingPath(path) {
  const [first, second] = path.split('/');

  if (TYPE_BY_SLUG[first]) {
    const channel = second ? CHANNEL_BY_SEGMENT[second] : null;
    if (second && !channel) return null;
    return { type: TYPE_BY_SLUG[first].key, channel: channel ? channel.key : 'all' };
  }
  if (CHANNEL_BY_STANDALONE[first] && !second) {
    return { type: 'all', channel: CHANNEL_BY_STANDALONE[first].key };
  }
  return null;
}

/**
 * Page copy for a point in the hierarchy. A single axis keeps the copy that was
 * written for it; a combination borrows the channel's framing and the type's
 * closing pitch, so "Wholesale Lands" reads as one page rather than two.
 */
export function pageCopy(typeKey = 'all', channelKey = 'all') {
  const type = TYPE_BY_KEY[typeKey] || TYPE_BY_KEY.all;
  const channel = CHANNEL_BY_KEY[channelKey] || CHANNEL_BY_KEY.all;

  if (channel.key === 'all') return type;
  if (type.key === 'all') return channel;

  return {
    title: `${channel.label} ${type.label} | Moning & Associates`,
    description: `${channel.label} ${type.label.toLowerCase()} across Dallas–Fort Worth.`,
    hero: {
      tag: channel.heroTag,
      titleLead: channel.label,
      titleAccent: type.label,
      blurb: channel.comboBlurb,
    },
    cta: type.cta,
  };
}

/**
 * The channel a listing sells through. `sales_channel` is the real field;
 * `is_off_market` is the older boolean the API still writes, and it cannot tell
 * a wholesale deal from a quiet listing — so it is only a fallback.
 */
export function listingChannel(listing) {
  if (CHANNEL_BY_KEY[listing.sales_channel] && listing.sales_channel !== 'all') {
    return listing.sales_channel;
  }
  return listing.is_off_market === true ? 'off_market' : 'on_market';
}

/** The type a listing is. Anything unrecognised falls back to the widest bucket. */
export function listingType(listing) {
  const key = listing.property_type;
  return key && TYPE_BY_KEY[key] && key !== 'all' ? key : null;
}
