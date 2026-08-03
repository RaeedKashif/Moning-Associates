import { useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact details live in their own columns; everything else is a qualifying
// answer that gets written into the message body.
const CORE = new Set(['first_name', 'last_name', 'email', 'phone', 'message']);

function validate(fields, values) {
  const errors = {};
  for (const f of fields) {
    const value = (values[f.name] ?? '').trim();
    if (f.required && !value) {
      errors[f.name] = `${f.label} is required`;
    } else if (f.name === 'email' && value && !EMAIL_RE.test(value)) {
      errors[f.name] = 'That email does not look right';
    } else if (f.name === 'phone' && value && value.replace(/\D/g, '').length < 10) {
      errors[f.name] = 'That phone number looks too short';
    }
  }
  return errors;
}

// The qualifying answers are folded into `message` as a readable block. The
// table has no columns for them, and inventing a parallel table to hold six
// dropdown answers is not worth the drift risk — Steven reads these as text.
function composeMessage(fields, values) {
  const lines = fields
    .filter(f => !CORE.has(f.name))
    .map(f => [f.label, (values[f.name] ?? '').trim()])
    .filter(([, v]) => v)
    .map(([label, v]) => `${label}: ${v}`);

  const note = (values.message ?? '').trim();
  if (note) lines.push('', note);

  // `source` carries the buyer/seller tag, so where the lead actually came from
  // rides along in the body until it gets a column of its own.
  lines.push('', `— came from: ${attribution()}`);
  return lines.join('\n');
}

// Where the lead came from, so Steven can tell a Facebook ad from a referral.
function attribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get('utm_source');
    if (utm) return utm;
    const ref = document.referrer;
    if (!ref) return 'direct';
    const host = new URL(ref).hostname.replace(/^www\./, '');
    return host === window.location.hostname ? 'direct' : host;
  } catch {
    return 'direct';
  }
}

export default function InquiryForm({ config }) {
  const { fields } = config;
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [failure, setFailure] = useState(null);
  const mountedAt = useRef(Date.now());
  const honeypot = useRef(null);

  const set = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear an error as soon as the field is being corrected.
    setErrors(prev => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const firstError = useMemo(
    () => fields.find(f => errors[f.name])?.name ?? null,
    [errors, fields]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return; // never let a double-click send twice

    // Bots fill every field they can see, including the one humans cannot.
    // Show the success state so they do not retry, but write nothing.
    if (honeypot.current?.value) {
      setStatus('sent');
      return;
    }
    // A real person cannot read and complete this form in under three seconds.
    if (Date.now() - mountedAt.current < 3000) {
      setStatus('sent');
      return;
    }

    const found = validate(fields, values);
    if (Object.keys(found).length) {
      setErrors(found);
      const el = document.getElementById(`f-${Object.keys(found)[0]}`);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('sending');
    setFailure(null);

    const name = [values.first_name, values.last_name]
      .map(v => (v ?? '').trim()).filter(Boolean).join(' ');

    const { error } = await supabase.from('contact_submissions').insert({
      name,
      email: (values.email ?? '').trim(),
      phone: (values.phone ?? '').trim() || null,
      message: composeMessage(fields, values),
      source: config.key, // 'buyer' | 'seller' — how the lead arrives tagged
    });

    if (error) {
      setStatus('error');
      setFailure(error.message);
      return;
    }
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="glass-card p-8 sm:p-12 text-center" role="status" aria-live="polite">
        <div className="w-14 h-14 mx-auto rounded-full bg-gold grid place-items-center
                        text-navy text-2xl font-bold mb-5">✓</div>
        <h3 className="font-serif text-white text-2xl mb-3">{config.successHeading}</h3>
        <p className="text-white/60 leading-[1.8] max-w-sm mx-auto">{config.successBody}</p>
        <p className="text-white/40 text-sm mt-6">
          Need it sooner?{' '}
          <a href="tel:+14695809228" className="text-gold hover:text-goldLt">
            Call 469-580-9228
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-card p-6 sm:p-9">
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input ref={honeypot} id="company_website" name="company_website"
               type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-x-4">
        {fields.map(f => (
          <Field
            key={f.name}
            field={f}
            value={values[f.name] ?? ''}
            error={errors[f.name]}
            onChange={v => set(f.name, v)}
          />
        ))}
      </div>

      {status === 'error' && (
        <div role="alert"
             className="mb-5 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3">
          <p className="text-red-200 text-sm">
            That did not send. Please try again, or call{' '}
            <a href="tel:+14695809228" className="underline">469-580-9228</a>.
          </p>
          {failure && <p className="text-red-200/60 text-xs mt-1">{failure}</p>}
        </div>
      )}

      {firstError && (
        <p className="mb-4 text-sm text-red-300" role="alert">
          Please check the highlighted fields.
        </p>
      )}

      <button type="submit" disabled={status === 'sending'}
              className="btn-gold w-full justify-center disabled:opacity-60
                         disabled:cursor-not-allowed disabled:hover:translate-y-0">
        {status === 'sending' ? 'Sending…' : config.submitLabel}
        {status !== 'sending' && (
          <span className="w-5 h-5 rounded-full bg-black/10 grid place-items-center text-xs">
            &rarr;
          </span>
        )}
      </button>

      <p className="text-white/35 text-xs text-center mt-4 leading-relaxed">
        We use this to answer your enquiry, nothing else. No lists, no spam.
      </p>
    </form>
  );
}

function Field({ field, value, error, onChange }) {
  const id = `f-${field.name}`;
  const errorId = `${id}-error`;
  const wide = field.type === 'textarea' || !field.half;

  const base = `w-full bg-white/[0.06] border rounded-lg px-4 py-3 text-white
                text-[max(0.92rem,16px)] transition focus:outline-none
                placeholder:text-white/25
                ${error ? 'border-red-400/70 focus:border-red-400'
                        : 'border-white/10 focus:border-gold'}`;

  return (
    <div className={`mb-4 ${wide ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={id} className="block text-[0.72rem] tracking-wide uppercase text-white/45 mb-2">
        {field.label}
        {field.required && <span className="text-gold ml-1" aria-hidden="true">*</span>}
      </label>

      {field.type === 'select' ? (
        <select id={id} value={value} onChange={e => onChange(e.target.value)}
                aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
                className={base}>
          <option value="" className="bg-navy2">Select one…</option>
          {field.options.map(o => (
            <option key={o} value={o} className="bg-navy2">{o}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea id={id} rows={4} value={value} onChange={e => onChange(e.target.value)}
                  placeholder={field.placeholder} maxLength={5000}
                  aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
                  className={`${base} resize-none`} />
      ) : (
        <input id={id} type={field.type} value={value} onChange={e => onChange(e.target.value)}
               placeholder={field.placeholder} autoComplete={field.autoComplete}
               maxLength={200}
               aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
               className={base} />
      )}

      {error && <p id={errorId} className="text-red-300 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
