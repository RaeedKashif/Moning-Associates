const links = [
  { href: '#services',   label: 'Services' },
  { href: '#about',      label: 'About' },
  { href: '#team',       label: 'Team' },
  { href: '#/buyers',    label: 'Buyers' },
  { href: '#/sellers',   label: 'Sellers' },
];

// Listed twice on purpose: under the nav column, where someone scanning the
// footer's links will look for them, and again on the bottom bar, where people
// expect legal pages to sit.
const legal = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms and Conditions' },
];

// TREC's own forms page rather than the versioned PDF (CN 1-5_0.pdf): the
// filename changes each time TREC revises the notice, but this page always
// points at the current one. The IABS link joins this once we have Steven's
// actual completed form; a blank template doesn't belong here.
const trecLinks = [
  {
    href: 'https://www.trec.texas.gov/forms/consumer-protection-notice',
    label: 'Texas Real Estate Commission Consumer Protection Notice',
  },
];

const socials = [
  { label: 'f',  title: 'Facebook' },
  { label: 'ig', title: 'Instagram' },
  { label: 'in', title: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-[#070F1A] px-5 md:px-[6%] pt-14 pb-7">
      <div className="grid md:grid-cols-3 gap-10 pb-10 mb-8
                      border-b border-white/[0.06] items-start">
        <div className="flex items-start gap-4">
          <img
            src="/assets/brandlogo2.png"
            alt="Steven Moning, REALTOR®"
            className="w-20 h-20 object-contain rounded-xl"
          />
          <div>
            <div className="font-serif text-gold text-[1.3rem] font-semibold">
              Steven Moning, REALTOR&reg;
            </div>
            {/* Kept at 0.8rem against the 1.3rem name above: TREC wants the
                brokerage at least half the size of the largest agent name. */}
            <div className="text-white/60 text-[0.8rem] tracking-[0.14em]
                            uppercase mt-1">
              Brokered by eXp Realty
            </div>
            <p className="text-white/45 text-[0.85rem] leading-[1.65] mt-3 max-w-sm">
              Helping families and investors find the right address in
              Dallas–Fort Worth since 2006. Real conversations, real results.
            </p>
          </div>
        </div>

        <nav className="pt-2">
          <ul className="flex flex-wrap gap-5 md:gap-7 md:justify-center">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href}
                   className="text-white/45 hover:text-gold text-[0.86rem] transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Same size as the row above so the column stays even, but brighter
              and medium weight so the legal pages read as findable, not buried. */}
          <ul className="flex flex-wrap gap-x-5 gap-y-1 md:gap-x-7
                         md:justify-center mt-4">
            {legal.map(l => (
              <li key={l.href}>
                <a href={l.href}
                   className="text-white/70 hover:text-gold text-[0.86rem]
                              font-medium transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:justify-self-end">
          <div className="text-white/35 text-[0.7rem] tracking-[0.18em]
                          uppercase mb-3">Follow us</div>
          <div className="flex gap-2">
            {socials.map(s => (
              <a
                key={s.title}
                href="#"
                title={s.title}
                className="w-10 h-10 grid place-items-center
                           rounded-lg bg-white/[0.05] border border-white/10
                           text-white/45 text-[0.8rem] font-semibold
                           hover:bg-gold hover:border-gold hover:text-navy transition-all"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Brokered-by eXp Realty band — blends with dark theme */}
      <div className="relative overflow-hidden rounded-2xl mb-8
                      bg-white/[0.03]
                      border border-gold/25 px-5 sm:px-8 py-6
                      flex flex-col md:flex-row items-start md:items-center
                      justify-between gap-5">
        <div className="flex items-center gap-5">
          <a href="https://exprealty.com" target="_blank" rel="noreferrer"
             className="group shrink-0">
            <img
              src="/assets/exp3.png"
              alt="eXp Realty"
              className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-xl
                         ring-1 ring-gold/40 hover:ring-gold transition-all
                         group-hover:-translate-y-0.5"
            />
          </a>
          <div>
            <div className="text-gold text-[0.65rem] tracking-[0.24em] uppercase mb-1">
              Brokered by
            </div>
            <div className="font-serif text-white text-[1.2rem] sm:text-[1.35rem]
                            font-semibold leading-tight">
              eXp Realty
            </div>
            <div className="text-white/55 text-[0.82rem] mt-1 max-w-md">
              All licensed real estate brokerage services are provided through
              eXp Realty.
            </div>
            {/* Verified against Steven's own signature block and eXp's TX
                Broker Team reply (Aug 2026) — brokerage name and both TREC
                license numbers, not invented. eXp's office address/phone were
                not part of that thread, so they stay out until confirmed. */}
            <div className="text-white/40 text-[0.72rem] mt-2 leading-[1.7]">
              eXp Realty LLC &middot; TREC Broker Lic. #603392<br/>
              Steven Moning &middot; TREC Sales Agent Lic. #0530915<br/>
              Managing Broker: Karen Richards
            </div>
          </div>
        </div>
        <div className="text-white/35 text-[0.72rem] italic max-w-sm md:text-right shrink-0">
          Equal Housing Opportunity.
        </div>
      </div>

      {/* Required brokerage and listing disclosure. Body-sized rather than fine
          print — it states who provides brokerage services and who holds the
          listings, which a reader is entitled to find without hunting. */}
      <div className="mb-8 px-5 sm:px-8 py-5 rounded-2xl
                      border border-gold/20 bg-white/[0.02]">
        <p className="text-white/60 text-[0.8rem] leading-[1.9] max-w-4xl">
          Steven Moning is a Texas real estate sales agent sponsored by eXp
          Realty. All licensed real estate brokerage services are provided
          through eXp Realty. Listings displayed on this website may be listed by
          brokers other than eXp Realty. Steven Moning and eXp Realty are not the
          listing agent unless specifically identified as such. Information is
          deemed reliable but is not guaranteed and should be independently
          verified.
        </p>
        {/* Spelled out in full — TREC asks that this not be reduced to an
            acronym, and a consumer should be able to tell what they're
            clicking before they click it. */}
        <div className="mt-4 pt-4 border-t border-gold/15 flex flex-wrap gap-x-6 gap-y-2">
          {trecLinks.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
               className="text-gold/90 hover:text-gold text-[0.8rem] font-medium
                          underline underline-offset-4 transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start
                      md:items-center gap-2">
        <span className="text-white/25 text-[0.78rem]">
          © {new Date().getFullYear()} Steven Moning, REALTOR&reg; &middot; eXp Realty.
          All rights reserved.
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1
                        md:justify-end">
          {legal.map(l => (
            <a key={l.href} href={l.href}
               className="text-white/45 hover:text-gold text-[0.78rem] transition-colors">
              {l.label}
            </a>
          ))}
          {trecLinks.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
               className="text-white/45 hover:text-gold text-[0.78rem] transition-colors">
              {l.label}
            </a>
          ))}
          <span className="hidden md:inline text-white/15">·</span>
          <span className="text-white/25 text-[0.78rem]">
            Steven Moning · eXp Realty · 469-580-9228
          </span>
        </div>
      </div>
    </footer>
  );
}
