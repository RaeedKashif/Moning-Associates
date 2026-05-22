const links = [
  { href: '#services',   label: 'Services' },
  { href: '#about',      label: 'About' },
  { href: '#team',       label: 'Team' },
  { href: '#contact',    label: 'Contact' },
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
            alt="Moning & Associates Realty Group"
            className="w-20 h-20 object-contain rounded-xl"
          />
          <div>
            <div className="font-serif text-gold text-[1.3rem] font-semibold">
              Moning &amp; Associates
            </div>
            <div className="text-white/35 text-[0.72rem] tracking-[0.18em]
                            uppercase mt-1">
              eXp Realty · DFW Premier Real Estate
            </div>
            <p className="text-white/45 text-[0.85rem] leading-[1.65] mt-3 max-w-sm">
              Helping families and investors close on the right property in
              Dallas–Fort Worth since 2006.
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap gap-5 md:gap-7 md:justify-center pt-2">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}
                 className="text-white/45 hover:text-gold text-[0.86rem] transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

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

      <div className="flex flex-col md:flex-row justify-between items-start
                      md:items-center gap-2">
        <span className="text-white/25 text-[0.78rem]">
          © {new Date().getFullYear()} Moning &amp; Associates. All Rights Reserved.
        </span>
        <span className="text-white/25 text-[0.78rem]">
          Steven Moning · eXp Realty · 469-580-9228
        </span>
      </div>
    </footer>
  );
}
