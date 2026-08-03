// One definition per property category, shared by the router, the navbar
// dropdown, the filter pills, and the page copy. The `slug` values match the
// old standalone .html pages so existing links and bookmarks keep working.
export const CATEGORIES = [
  {
    key: 'all',
    slug: 'properties',
    label: 'All Properties',
    navLabel: 'View All',
    title: 'All Properties | Moning & Associates',
    description:
      'Every listing we are currently working across Dallas–Fort Worth — luxury estates, land, active MLS listings, and off-market deals.',
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
    key: 'active',
    slug: 'active-listing',
    label: 'Active Listing',
    navLabel: 'Active Listing',
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
    key: 'offmkt',
    slug: 'off-market-properties',
    label: 'Off Market',
    navLabel: 'Off Market Properties',
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
];

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));
export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map(c => [c.slug, c]));

// The hash route for a category. 'all' keeps the generic /properties path so the
// existing #/properties?cat=… links stay meaningful.
export function categoryHref(key) {
  const cat = CATEGORY_BY_KEY[key];
  return cat ? `#/${cat.slug}` : '#/properties';
}
