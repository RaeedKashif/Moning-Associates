import { INQUIRY_FORMS } from '../lib/inquiryForms.js';

// Gold segmented control for switching between the buyer and seller forms.
// The homepage swaps the form in place; the standalone pages navigate — both
// pass their own `onSelect`.
export default function InquiryToggle({ value, onSelect, className = '' }) {
  return (
    <div
      role="group"
      aria-label="Are you buying or selling?"
      className={`grid grid-cols-2 gap-1.5 p-1.5 rounded-xl
                  border border-gold/40 bg-navy ${className}`}
    >
      {INQUIRY_FORMS.map(f => {
        const active = f.key === value;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onSelect(f)}
            aria-pressed={active}
            className={`px-4 py-3 rounded-lg text-[0.82rem] font-semibold
                        tracking-[0.12em] uppercase transition-colors duration-200
                        ${active
                          ? 'bg-gold text-navy'
                          : 'text-gold/75 hover:text-gold hover:bg-gold/10'}`}
          >
            {f.toggleLabel}
          </button>
        );
      })}
    </div>
  );
}
