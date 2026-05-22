const items = [
  'REO Properties',
  'Luxury Homes',
  'Investor Portfolios',
  'Off-Market Deals',
  'BPO Specialist',
  'Residential Sales',
  'Wholesaling',
  'Property Flipping',
  'DFW Market Expert',
];

export default function Ticker() {
  const loop = [...items, ...items];
  return (
    <div className="bg-gold py-3 overflow-hidden border-y border-goldDk/20">
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {loop.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-8 text-[0.78rem] font-semibold
                       text-navy uppercase tracking-[0.18em] whitespace-nowrap"
          >
            {t}
            <span className="w-1 h-1 rounded-full bg-navy/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
