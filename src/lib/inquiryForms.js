// The buyer and seller intake forms. Both are the same component driven by
// this config — page copy, the questions, and the reassurance list.
//
// The questions mirror the Tally intake form (tally.so/r/WOkjka): a shared
// contact block, then the seller half or the buyer half of that form. Section
// order and answer options are kept as they are there; only the wording is
// plainer.
//
// `name` doubles as the field id, the storage key, and the label used when the
// answers are written into the submitted message.

const YES_NO_MAYBE = ['Yes', 'No', 'Maybe'];

// Every form opens with the same contact block. `role` pre-selects the "I am a"
// answer to match whichever form you landed on — someone doing both sides of a
// trade can still change it.
function contactSection(role) {
  return {
    heading: 'Your details',
    fields: [
      { name: 'full_name', label: 'Full name', type: 'text', required: true,
        placeholder: 'John Smith', autoComplete: 'name', half: true },
      { name: 'company', label: 'Company name', type: 'text',
        placeholder: 'Optional', autoComplete: 'organization', half: true },
      { name: 'email', label: 'Email', type: 'email', required: true,
        placeholder: 'john@email.com', autoComplete: 'email', half: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true,
        placeholder: '(469) 555-0123', autoComplete: 'tel', half: true },
      { name: 'heard_about', label: 'How did you hear about us', type: 'text',
        placeholder: 'Referral, LinkedIn, a past deal…' },
      { name: 'i_am_a', label: 'I am a', type: 'radio', required: true,
        options: ['Buyer', 'Seller', 'Both'], default: role },
    ],
  };
}

const DOCUMENT_NOTE =
  'Optional, but the more you send now the sooner you get a real number back. ' +
  '10 MB per file. PDF, Excel, Word or an image.';

export const BUYER = {
  key: 'buyer',
  slug: 'buyers',
  navLabel: 'Buyers',
  toggleLabel: "I'm Buying",
  title: 'For Buyers | Moning & Associates',
  hero: {
    tag: 'For Buyers',
    titleLead: 'Tell us what you',
    titleAccent: 'want to buy.',
    blurb:
      'Your criteria, your capital, your timeline. Once Steven has those three ' +
      'things he can send you deals that actually fit — including the ones that ' +
      'never reach the market.',
  },
  reassurance: {
    heading: 'What happens next',
    points: [
      'Steven reads every enquiry himself — this does not go to a call centre.',
      'You get a reply within one business day, usually much sooner.',
      'Deals that match your box come to you first, off-market ones included.',
      'If nothing fits right now, we tell you that instead of wasting your time.',
    ],
  },
  formNote:
    'Five minutes or so. Only the starred questions are required — skip anything ' +
    'you do not have to hand and we will pick it up on the call.',
  homeBlurb:
    'The buyer form asks about your criteria, your capital and how fast you can ' +
    'close, so the first deal you see is one you would actually buy.',
  homeCta: 'Start the buyer form',
  submitLabel: 'Send my criteria',
  successHeading: 'Got it — thanks.',
  successBody:
    "Steven will go through what you've sent and get back to you within one " +
    'business day with anything that fits.',
  sections: [
    contactSection('Buyer'),
    {
      heading: 'Buyer profile',
      fields: [
        { name: 'buyer_entity_name', label: 'Buyer or entity name', type: 'text',
          required: true, placeholder: 'Smith Capital Partners LLC', half: true },
        { name: 'track_record', label: 'Track record / years active', type: 'text',
          placeholder: '8 years, 14 deals', half: true },
        // Named per side: someone answering "Both" gets this question twice,
        // with different options, and the two must not share state.
        { name: 'buyer_entity_type', label: 'Entity type', type: 'radio', required: true,
          options: ['Individual', 'LLC or fund', 'Partnership', 'REIT', 'Other'] },
        { name: 'portfolio_size', label: 'Current portfolio size', type: 'number',
          placeholder: '0', suffix: 'units', min: 0, max: 1000000, half: true },
      ],
    },
    {
      heading: 'What you are looking for',
      fields: [
        { name: 'target_unit_count', label: 'Target unit count range', type: 'text',
          placeholder: '50 – 150', half: true },
        { name: 'asset_class', label: 'Asset class', type: 'text',
          placeholder: 'Class B multifamily', half: true },
        { name: 'target_markets', label: 'Target markets', type: 'text',
          placeholder: 'DFW, Fort Worth, Denton County…' },
        { name: 'vintage', label: 'Vintage preference', type: 'radio',
          options: ['New construction', '1990s – 2010s', 'Pre-1990', 'No preference'] },
        { name: 'strategy', label: 'Strategy', type: 'radio',
          options: ['Value-add', 'Core / stabilised', 'Opportunistic / distressed', 'Development'] },
      ],
    },
    {
      heading: 'What you can put behind it',
      fields: [
        { name: 'available_equity', label: 'Available equity', type: 'number',
          prefix: '$', placeholder: '2,500,000', min: 0, half: true },
        { name: 'max_purchase_price', label: 'Maximum purchase price', type: 'number',
          prefix: '$', placeholder: '12,000,000', min: 0, half: true },
        { name: 'check_size', label: 'Typical check size range', type: 'text',
          placeholder: '$1M – $3M', half: true },
        { name: 'debt_relationships', label: 'Debt relationships in place', type: 'radio',
          options: ['Yes', 'No', 'Working on it'] },
      ],
    },
    {
      heading: 'How you like deals structured',
      fields: [
        { name: 'open_to_seller_financing', label: 'Open to seller financing',
          type: 'radio', options: YES_NO_MAYBE },
        { name: 'open_to_jv', label: 'Open to a JV or partnership',
          type: 'radio', options: YES_NO_MAYBE },
        { name: 'open_to_loan_assumption', label: 'Open to loan assumption deals',
          type: 'radio', options: YES_NO_MAYBE },
        { name: 'open_to_portfolio', label: 'Interested in portfolio deals',
          type: 'radio', options: YES_NO_MAYBE },
      ],
    },
    {
      heading: 'Timeline and the numbers you underwrite to',
      fields: [
        { name: 'readiness', label: 'Readiness', type: 'radio',
          options: ['Ready now', 'Actively looking', 'Building a pipeline for later'] },
        { name: 'diligence_days', label: 'Typical diligence period', type: 'number',
          suffix: 'days', placeholder: '30', min: 0, max: 365, half: true },
        { name: 'closing_days', label: 'Typical closing timeline', type: 'number',
          suffix: 'days', placeholder: '45', min: 0, max: 365, half: true },
        { name: 'target_coc', label: 'Target cash-on-cash return', type: 'number',
          suffix: '%', placeholder: '8', min: 0, max: 100, step: '0.1', half: true },
        { name: 'target_irr', label: 'Target IRR', type: 'number',
          suffix: '%', placeholder: '15', min: 0, max: 100, step: '0.1', half: true },
        { name: 'target_cap_rate', label: 'Target cap rate', type: 'number',
          suffix: '%', placeholder: '6', min: 0, max: 100, step: '0.01', half: true },
        { name: 'renovation_budget', label: 'Renovation budget range', type: 'text',
          placeholder: '$8k – $15k per unit', half: true },
      ],
    },
    {
      heading: 'How you would run it',
      fields: [
        { name: 'management_style', label: 'Management style', type: 'radio',
          options: ['Self-manage', 'Third-party', 'Hybrid'] },
        { name: 'hold_period', label: 'Target hold period', type: 'number',
          suffix: 'years', placeholder: '5', min: 0, max: 100, half: true },
        { name: 'repositioning_plans', label: 'Repositioning plans', type: 'text',
          placeholder: 'Interiors, amenities, rebrand…', half: true },
      ],
    },
    {
      // Headings have to stay unique across both forms — on a "Both" answer
      // the two sets of sections end up on one page.
      heading: 'Your documents',
      note: DOCUMENT_NOTE,
      fields: [
        { name: 'proof_of_funds', label: 'Proof of funds', type: 'file' },
        { name: 'underwriting_model', label: 'Underwriting model', type: 'file' },
        { name: 'references', label: 'References', type: 'text',
          placeholder: 'Broker, lender or partner we can call' },
      ],
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
      'it should trade for and how long that would take. No obligation to list with us.',
  },
  reassurance: {
    heading: 'What happens next',
    points: [
      'Steven prices it off real trades in your submarket, not a website estimate.',
      'You get an honest range within one business day.',
      'We walk you through what it would take to reach the top of that range.',
      'If now is the wrong time to sell, we will say so.',
    ],
  },
  formNote:
    'Five minutes or so. Only the starred questions are required — skip anything ' +
    'you do not have to hand and we will pick it up on the call.',
  homeBlurb:
    'The seller form asks about the property, your timeline and the numbers behind ' +
    'it, so the first thing you hear back is a price range and not a questionnaire.',
  homeCta: 'Start the seller form',
  submitLabel: 'Request my valuation',
  successHeading: 'Got it — thanks.',
  successBody:
    'Steven will pull the comparable trades for your submarket and come back to you ' +
    'within one business day.',
  sections: [
    contactSection('Seller'),
    {
      heading: 'Ownership',
      fields: [
        { name: 'legal_owner_names', label: 'Legal owner name(s)', type: 'text',
          required: true, placeholder: 'As it reads on title', half: true },
        { name: 'decision_makers', label: 'Decision makers', type: 'text',
          placeholder: 'Anyone else who has to sign off', half: true },
        { name: 'seller_entity_type', label: 'Entity type', type: 'radio', required: true,
          options: ['Individual', 'LLC', 'Trust', 'Partnership', 'Corporation', 'Other'] },
        { name: 'years_owned', label: 'Years owned', type: 'number',
          placeholder: '7', min: 0, max: 150, half: true },
        { name: 'management_structure', label: 'Management structure', type: 'radio',
          options: ['Self-managed', 'Third-party managed', 'Mixed'] },
      ],
    },
    {
      heading: 'The property',
      fields: [
        { name: 'address', label: 'Property address', type: 'text', required: true,
          placeholder: '1420 Pecan Valley Dr, Allen, TX 75002',
          autoComplete: 'street-address' },
        { name: 'on_market', label: 'Currently listed on the MLS', type: 'radio',
          required: true, options: ['On-market', 'Off-market'] },
        { name: 'unit_count', label: 'Unit count', type: 'number',
          placeholder: '48', min: 0, max: 100000, half: true },
        { name: 'year_built', label: 'Year built', type: 'number',
          placeholder: '1984', min: 1700, max: new Date().getFullYear() + 5, half: true },
        { name: 'occupancy', label: 'Current occupancy', type: 'number',
          suffix: '%', placeholder: '92', min: 0, max: 100, step: '0.1', half: true },
        { name: 'average_rent', label: 'Average rent', type: 'number',
          prefix: '$', placeholder: '1,250', min: 0, half: true },
        { name: 'deferred_maintenance', label: 'Deferred maintenance', type: 'text',
          placeholder: 'Roofs, plumbing, anything you know is coming', half: true },
        { name: 'recent_capex', label: 'Recent capex', type: 'text',
          placeholder: 'What you have already put in', half: true },
      ],
    },
    {
      heading: 'Why you are selling',
      fields: [
        { name: 'reason_for_selling', label: 'Reason for selling', type: 'text',
          required: true, placeholder: 'Partnership exit, 1031, retirement…' },
        { name: 'additional_context', label: 'Additional context', type: 'textarea',
          placeholder: 'Anything about the deal, the partners or the property that ' +
                       'would change how we price it.' },
      ],
    },
    {
      heading: 'Timeline',
      fields: [
        { name: 'ideal_timeframe', label: 'Ideal sale timeframe', type: 'radio',
          required: true,
          options: ['ASAP (0 – 30 days)', '1 – 3 months', '3 – 6 months',
                    '6 – 12 months', 'No firm timeline'] },
        { name: 'hard_deadline', label: 'Hard deadline, if there is one', type: 'text',
          placeholder: 'Loan maturity, tax date, court date…' },
        { name: 'open_to_off_market', label: 'Open to an off-market sale', type: 'radio',
          required: true, options: YES_NO_MAYBE },
      ],
    },
    {
      heading: 'Where the debt sits',
      fields: [
        { name: 'loan_balance', label: 'Current loan balance', type: 'number',
          prefix: '$', placeholder: '3,400,000', min: 0, half: true },
        { name: 'interest_rate', label: 'Interest rate', type: 'number',
          suffix: '%', placeholder: '4.75', min: 0, max: 100, step: '0.01', half: true },
        { name: 't12_noi', label: 'Trailing 12-month NOI', type: 'number', required: true,
          prefix: '$', placeholder: '410,000', half: true },
        { name: 'seller_financing', label: 'Willing to offer seller financing',
          type: 'radio', required: true,
          options: ['Yes', 'No', 'Maybe — depends on terms'] },
      ],
    },
    {
      heading: 'Price',
      fields: [
        { name: 'desired_price', label: 'Desired price', type: 'number',
          prefix: '$', placeholder: '6,200,000', min: 0, half: true },
        { name: 'price_basis', label: 'Basis for that price', type: 'radio',
          options: ['Appraisal', 'Market comps', 'None'] },
        { name: 'open_to_price_feedback', label: 'Open to market feedback on pricing',
          type: 'radio', options: ['Yes', 'No'] },
      ],
    },
    {
      heading: 'How flexible the deal can be',
      fields: [
        { name: 'creative_terms', label: 'Open to creative terms', type: 'text',
          placeholder: 'Master lease, wrap, staged closing…' },
        { name: 'as_is', label: 'Selling as-is or willing to make improvements',
          type: 'radio',
          options: ['As-is', 'Will improve for the right price', 'Open to discuss'] },
        { name: 'portfolio_sale', label: 'Part of a portfolio sale', type: 'radio',
          options: ['Yes', 'No', 'Could be'] },
      ],
    },
    {
      heading: 'Property documents',
      note: DOCUMENT_NOTE,
      fields: [
        { name: 'rent_roll', label: 'Rent roll', type: 'file' },
        { name: 't12_financials', label: 'T-12 financials', type: 'file' },
        { name: 'other_reports', label: 'Other reports', type: 'file' },
      ],
    },
  ],
};

export const INQUIRY_FORMS = [BUYER, SELLER];
export const FORM_BY_SLUG = Object.fromEntries(INQUIRY_FORMS.map(f => [f.slug, f]));

// What the person is actually looking at. Answering "Both" — selling one asset
// and buying the next — adds the other side's questions to the page, because
// otherwise half of what Steven needs never gets asked.
export function visibleSections(config, role) {
  if (role !== 'Both') return config.sections;
  const other = config.key === 'buyer' ? SELLER : BUYER;
  // slice(1) drops the other form's contact block — they already gave us that.
  return [
    ...config.sections,
    ...other.sections.slice(1).map(s => ({ ...s, side: other.key })),
  ];
}

export const crossSideNote = {
  buyer:
    'You said you are buying as well. These are the buy-side questions — same ' +
    'deal, the other half of it.',
  seller:
    'You said you are selling as well. These are the questions about the ' +
    'property you are letting go.',
};

// The sections are for the eye; validation and submission want one flat list.
export const flatten = (sections) => sections.flatMap(s => s.fields);
export const allFields = (config) => flatten(config.sections);

export const initialValues = (config) =>
  Object.fromEntries(
    allFields(config).filter(f => f.default).map(f => [f.name, f.default])
  );
