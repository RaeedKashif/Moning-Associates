// The buyer and seller inquiry forms. Both are the same component driven by
// this config — page copy, the qualifying questions, and the reassurance list.
//
// `name` doubles as the field id and, for the extra questions, as the label
// written into the submitted message.

const CONTACT_FIELDS = [
  { name: 'first_name', label: 'First name', type: 'text',  required: true,  placeholder: 'John',            autoComplete: 'given-name',  half: true },
  { name: 'last_name',  label: 'Last name',  type: 'text',  required: false, placeholder: 'Smith',           autoComplete: 'family-name', half: true },
  { name: 'email',      label: 'Email',      type: 'email', required: true,  placeholder: 'john@email.com',  autoComplete: 'email' },
  { name: 'phone',      label: 'Phone',      type: 'tel',   required: false, placeholder: '(469) 555-0123',  autoComplete: 'tel' },
];

export const BUYER = {
  key: 'buyer',
  slug: 'buyers',
  navLabel: 'Buyers',
  toggleLabel: "I'm Buying",
  title: 'For Buyers | Moning & Associates',
  hero: {
    tag: 'For Buyers',
    titleLead: 'Find the right',
    titleAccent: 'home.',
    blurb:
      "Tell us what you're looking for and we'll send you a shortlist — including " +
      "the off-market places that never make it to the MLS. No pressure, no spam.",
  },
  reassurance: {
    heading: 'What happens next',
    points: [
      'Steven reads every enquiry himself — this does not go to a call centre.',
      'You get a reply within one business day, usually much sooner.',
      'We put together a shortlist that fits your budget and your timeline.',
      'If nothing fits yet, we tell you that instead of wasting your Saturday.',
    ],
  },
  submitLabel: 'Send my requirements',
  successHeading: 'Got it — thanks.',
  successBody:
    "Steven will go through what you've sent and get back to you within one " +
    'business day with anything that fits.',
  fields: [
    ...CONTACT_FIELDS,
    {
      name: 'budget', label: 'Budget range', type: 'select', required: true,
      options: ['Under $300,000', '$300,000 – $500,000', '$500,000 – $750,000',
                '$750,000 – $1M', '$1M – $2M', '$2M+', 'Not sure yet'],
    },
    {
      name: 'property_type', label: 'What are you after', type: 'select', required: true,
      options: ['Single family home', 'Land or a lot', 'Luxury estate',
                'Investment property', 'REO / off-market deal', 'Not sure yet'],
    },
    {
      name: 'areas', label: 'Areas you are looking at', type: 'text', required: false,
      placeholder: 'Frisco, Prosper, McKinney…',
    },
    {
      name: 'timeline', label: 'How soon do you want to move', type: 'select', required: true,
      options: ['Ready now', 'Within 1–3 months', 'Within 3–6 months',
                '6+ months out', 'Just looking for now'],
    },
    {
      name: 'financing', label: 'Financing', type: 'select', required: false,
      options: ['Pre-approved', 'Need help finding a lender', 'Paying cash', 'Not sure yet'],
    },
    {
      name: 'message', label: 'Anything else we should know', type: 'textarea', required: false,
      placeholder: 'Must-haves, school districts, deal-breakers — whatever matters to you.',
    },
  ],
};

export const SELLER = {
  key: 'seller',
  slug: 'sellers',
  navLabel: 'Sellers',
  toggleLabel: "I'm Selling",
  title: 'For Sellers | Moning & Associates',
  hero: {
    tag: 'For Sellers',
    titleLead: 'Find out what',
    titleAccent: "it's worth.",
    blurb:
      'Tell us about the property and Steven will give you a straight read on what ' +
      "it should list for and how long it will take to sell. No obligation to list with us.",
  },
  reassurance: {
    heading: 'What happens next',
    points: [
      'Steven pulls the real comparable sales for your street, not a website estimate.',
      'You get an honest price range within one business day.',
      'We walk you through what it would take to get the top of that range.',
      'If now is the wrong time to sell, we will say so.',
    ],
  },
  submitLabel: 'Request my valuation',
  successHeading: 'Got it — thanks.',
  successBody:
    'Steven will pull the comparable sales for your area and come back to you ' +
    'within one business day.',
  fields: [
    ...CONTACT_FIELDS,
    {
      name: 'address', label: 'Property address', type: 'text', required: true,
      placeholder: '1420 Pecan Valley Dr', autoComplete: 'street-address',
    },
    {
      name: 'city', label: 'City & zip', type: 'text', required: true,
      placeholder: 'Allen, TX 75002',
    },
    {
      name: 'property_type', label: 'Property type', type: 'select', required: true,
      options: ['Single family home', 'Land or a lot', 'Luxury estate',
                'Investment property', 'Other'],
    },
    {
      name: 'estimated_value', label: 'What do you think it is worth', type: 'text', required: false,
      placeholder: 'A rough number is fine — or leave it blank',
    },
    {
      name: 'timeline', label: 'When do you want to sell', type: 'select', required: true,
      options: ['As soon as possible', 'Within 1–3 months', 'Within 3–6 months',
                '6+ months out', 'Just exploring my options'],
    },
    {
      name: 'reason', label: 'Reason for selling', type: 'select', required: false,
      options: ['Upsizing', 'Downsizing', 'Relocating', 'Investment exit',
                'Inherited the property', 'Rather not say'],
    },
    {
      name: 'message', label: 'Anything else we should know', type: 'textarea', required: false,
      placeholder: 'Recent work done, tenants in place, anything unusual about the property.',
    },
  ],
};

export const INQUIRY_FORMS = [BUYER, SELLER];
export const FORM_BY_SLUG = Object.fromEntries(INQUIRY_FORMS.map(f => [f.slug, f]));
