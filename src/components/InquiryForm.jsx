import { useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { flatten, initialValues, visibleSections, crossSideNote } from '../lib/inquiryForms.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact details live in their own columns; everything else is a qualifying
// answer that gets written into the message body.
const CORE = new Set(['full_name', 'email', 'phone']);

// Documents go to a private bucket — rent rolls and proof of funds are not
// things to leave on a public URL. See docs/SUPABASE-LEAD-DOCUMENTS.md.
const BUCKET = 'lead-documents';
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB, same ceiling as the Tally form
const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg';

// Money and percentages get typed with commas, dollar signs and stray spaces.
// A real <input type="number"> throws all of that away, so these are text
// inputs and the parsing happens here.
const toNumber = (value) => Number(String(value).replace(/[,$%\s]/g, ''));

function validate(fields, values) {
  const errors = {};
  for (const f of fields) {
    const raw = values[f.name];

    if (f.type === 'file') {
      if (raw && raw.size > MAX_FILE_BYTES) {
        errors[f.name] = 'That file is over 10 MB — email it to us instead';
      }
      continue;
    }

    const value = (raw ?? '').toString().trim();
    if (f.required && !value) {
      errors[f.name] = `${f.label} is required`;
    } else if (!value) {
      continue;
    } else if (f.type === 'email' && !EMAIL_RE.test(value)) {
      errors[f.name] = 'That email does not look right';
    } else if (f.type === 'tel' && value.replace(/\D/g, '').length < 10) {
      errors[f.name] = 'That phone number looks too short';
    } else if (f.type === 'number') {
      const n = toNumber(value);
      if (!Number.isFinite(n) || value.replace(/[,$%\s]/g, '') === '') {
        errors[f.name] = 'Numbers only, please';
      } else if (f.min != null && n < f.min) {
        errors[f.name] = `That should be ${f.min} or more`;
      } else if (f.max != null && n > f.max) {
        errors[f.name] = `That should be ${f.max} or less`;
      }
    }
  }
  return errors;
}

// The answers are folded into `message` as a readable block, grouped under the
// same headings the person filled in. The table has no columns for thirty
// qualifying answers, and a parallel table to hold them is not worth the drift
// risk — Steven reads these as text.
// The field carries its own unit, but people type it too. Only add what is
// missing, so "$3,400,000" does not come out as "$$3,400,000".
function withUnits(field, value) {
  const lower = value.toLowerCase();
  const prefix = field.prefix && !value.startsWith(field.prefix) ? field.prefix : '';
  const gap = field.suffix === '%' ? '' : ' '; // "92%", but "30 days"
  const suffix = field.suffix && !lower.endsWith(field.suffix.toLowerCase())
    ? `${gap}${field.suffix}` : '';
  return `${prefix}${value}${suffix}`;
}

function composeMessage(sections, values, uploads) {
  const out = [];

  for (const section of sections) {
    const lines = [];
    for (const f of section.fields) {
      if (CORE.has(f.name)) continue;

      if (f.type === 'file') {
        const file = values[f.name];
        if (!file) continue;
        lines.push(uploads[f.name]
          ? `${f.label}: ${uploads[f.name]}`
          : `${f.label}: ${file.name} — UPLOAD FAILED, ask them to email it`);
        continue;
      }

      // Always recorded, both ways round. A declined opt-in is the half that
      // actually matters later — it is the evidence that no consent was given,
      // so it cannot be the case that silence just drops out of the record.
      if (f.type === 'consent') {
        lines.push(`SMS consent: ${values[f.name] === true ? 'YES — opted in' : 'NO — not given'}`);
        continue;
      }

      const value = (values[f.name] ?? '').toString().trim();
      if (!value) continue;

      if (f.type === 'textarea') {
        lines.push(`${f.label}:`, value);
      } else {
        lines.push(`${f.label}: ${withUnits(f, value)}`);
      }
    }
    if (lines.length) out.push(section.heading.toUpperCase(), ...lines, '');
  }

  // `source` carries the buyer/seller tag, so where the lead actually came from
  // rides along in the body until it gets a column of its own.
  out.push(`— came from: ${attribution()}`);
  return out.join('\n');
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

// Everything a person attached, dropped in one folder per submission so the
// paths in the message read as a set rather than five unrelated objects.
async function uploadDocuments(config, fields, values) {
  const attached = fields.filter(f => f.type === 'file' && values[f.name]);
  if (!attached.length) return { uploads: {}, failed: false };

  const stamp = new Date().toISOString().slice(0, 10);
  const folder = `${config.key}/${stamp}-${Math.random().toString(36).slice(2, 10)}`;
  const uploads = {};
  let failed = false;

  for (const f of attached) {
    const file = values[f.name];
    const safe = file.name.replace(/[^\w.-]+/g, '_').slice(-80);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(`${folder}/${f.name}-${safe}`, file, { upsert: false });

    // A dead bucket must not cost Steven the lead. Note it and keep going —
    // the message says which documents to chase and the success screen asks
    // the person to email them.
    if (error || !data) failed = true;
    else uploads[f.name] = data.path;
  }

  return { uploads, failed };
}

export default function InquiryForm({ config }) {
  const [values, setValues] = useState(() => initialValues(config));
  // "Both" pulls in the other side's questions, so what counts as a field on
  // this form depends on an answer given inside it.
  const sections = useMemo(
    () => visibleSections(config, values.i_am_a),
    [config, values.i_am_a]
  );
  const fields = useMemo(() => flatten(sections), [sections]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [failure, setFailure] = useState(null);
  const [docsFailed, setDocsFailed] = useState(false);
  const mountedAt = useRef(Date.now());
  const honeypot = useRef(null);

  const set = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear an error as soon as the field is being corrected.
    setErrors(prev => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const errorCount = useMemo(
    () => fields.filter(f => errors[f.name]).length,
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
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('sending');
    setFailure(null);

    const { uploads, failed } = await uploadDocuments(config, fields, values);
    setDocsFailed(failed);

    const { error } = await supabase.from('contact_submissions').insert({
      name: (values.full_name ?? '').trim(),
      email: (values.email ?? '').trim(),
      phone: (values.phone ?? '').trim() || null,
      message: composeMessage(sections, values, uploads),
      // Stays 'buyer' | 'seller' even when they answered Both: the admin's
      // enquiry lists filter on exactly these two, and a third value would
      // land the lead in neither. "I am a: Both" is in the message body.
      source: config.key,
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
                        text-navy text-2xl font-bold mb-6">✓</div>
        <h3 className="font-serif text-white text-2xl mb-3">{config.successHeading}</h3>
        <p className="text-white/60 leading-[1.8] max-w-sm mx-auto">{config.successBody}</p>

        {docsFailed && (
          <p className="text-white/60 text-sm leading-[1.8] max-w-sm mx-auto mt-5
                        border-t border-gold/15 pt-5">
            Your documents did not attach. Please email them to{' '}
            <a href="mailto:steven.moning@exprealty.com" className="text-gold hover:text-goldLt break-all">
              steven.moning@exprealty.com
            </a>{' '}
            and we will match them to your enquiry.
          </p>
        )}

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
    <form onSubmit={handleSubmit} noValidate className="glass-card p-6 sm:p-8 lg:p-10">
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input ref={honeypot} id="company_website" name="company_website"
               type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* The section count is the honest measure of how long this is, and it
          moves when answering "Both" pulls in the other side's questions. */}
      <div className="flex items-baseline justify-between gap-4 pb-4 mb-6
                      border-b border-gold/15">
        <span className="text-[0.68rem] font-semibold tracking-[0.24em] uppercase text-gold">
          {config.key === 'buyer' ? 'Buyer intake' : 'Seller intake'}
        </span>
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-white/35 tabular-nums">
          {sections.length} sections
        </span>
      </div>

      {config.formNote && (
        <p className="text-white/50 text-[0.88rem] leading-[1.75] mb-9">
          {config.formNote}
        </p>
      )}

      {sections.map((section, i) => (
        <fieldset key={section.heading} className={`min-w-0 ${i ? 'mt-10' : ''}`}>
          {/* Where the other side's questions start, so the form does not just
              silently double in length under you. */}
          {section.side && !sections[i - 1]?.side && (
            <div className="mb-8 rounded-lg border-l-2 border-gold bg-gold/[0.05]
                            px-5 py-4">
              <p className="text-gold text-[0.68rem] font-semibold tracking-[0.24em] uppercase mb-1.5">
                Now the {section.side === 'buyer' ? 'buying' : 'selling'} side
              </p>
              <p className="text-white/60 text-[0.88rem] leading-[1.7]">
                {crossSideNote[section.side]}
              </p>
            </div>
          )}

          <legend className="w-full">
            <span className="flex items-center gap-3 mb-5">
              <span className="font-serif text-gold/60 text-[0.95rem] tabular-nums leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.7rem] font-semibold tracking-[0.24em]
                               uppercase text-gold min-w-0">
                {section.heading}
              </span>
              <span className="h-px flex-1 bg-gold/20" />
            </span>
          </legend>

          {section.note && (
            <p className="text-white/40 text-[0.82rem] leading-[1.7] -mt-2 mb-6">
              {section.note}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
            {section.fields.map(f => (
              <Field
                key={f.name}
                field={f}
                value={values[f.name] ?? (f.type === 'file' ? null : '')}
                error={errors[f.name]}
                onChange={v => set(f.name, v)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <div className="mt-10 pt-7 border-t border-gold/15">
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

        {errorCount > 0 && (
          <p className="mb-5 text-sm text-red-300 leading-relaxed" role="alert">
            {errorCount === 1
              ? 'One question needs another look — it is highlighted above.'
              : `${errorCount} questions need another look — they are highlighted above.`}
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
          {' '}By sending this you agree to our{' '}
          <a href="/privacy" className="text-white/55 hover:text-gold underline underline-offset-2 transition-colors">
            Privacy Policy
          </a>
          {' '}and{' '}
          <a href="/terms" className="text-white/55 hover:text-gold underline underline-offset-2 transition-colors">
            Terms and Conditions
          </a>.
        </p>

        {/* Second half of the carrier requirement: the checkbox above is the
            opt-in, this states the terms in the page itself so they are visible
            without ticking anything. */}
        <p className="text-white/30 text-[0.7rem] text-center mt-3
                      leading-[1.75] max-w-2xl mx-auto">
          By providing a telephone number and submitting this form, you consent to
          receive SMS text messages from Moning &amp; Associates and agree to our{' '}
          <a href="/privacy" className="text-white/45 hover:text-gold underline underline-offset-2 transition-colors">
            Privacy Policy
          </a>. Message frequency may vary. Message and data rates may apply.
          Reply STOP to opt out of further messaging. Reply HELP for more
          information.
        </p>
      </div>
    </form>
  );
}

// The link pair that appears in both consent notices.
const PolicyLinks = ({ className = 'text-white/70 hover:text-gold underline underline-offset-2 transition-colors' }) => (
  <>
    <a href="/privacy" className={className}>Privacy Policy</a>
    {' '}and{' '}
    <a href="/terms" className={className}>Terms and Conditions</a>
  </>
);

// Carrier-registered opt-in wording. Rendered rather than stored with the field
// data so the text cannot drift out of sync with what was registered, and so
// the policy links stay real links rather than escaped markup.
function ConsentCheckbox({ field, value, onChange }) {
  const id = `f-${field.name}`;
  return (
    <label htmlFor={id} className="flex gap-3 items-start cursor-pointer
                                   rounded-xl border border-gold/20 bg-white/[0.02]
                                   px-4 py-3.5">
      <input
        id={id}
        name={field.name}
        type="checkbox"
        // Defaults to false on every render — this must never arrive pre-ticked.
        checked={value === true}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 shrink-0 accent-gold cursor-pointer"
      />
      <span className="text-white/55 text-[0.78rem] leading-[1.75]">
        I agree to receive SMS text messages from Moning &amp; Associates regarding
        my inquiry, submitted properties, available properties, appointments, and
        related real estate services. Message frequency may vary. Message and data
        rates may apply. Reply STOP to opt out or HELP for assistance. Consent is
        not a condition of purchasing any property or service. See our{' '}
        <PolicyLinks />.
      </span>
    </label>
  );
}

function Field({ field, value, error, onChange }) {
  const id = `f-${field.name}`;
  const errorId = `${id}-error`;
  // Documents and anything marked `half` share a row; everything else runs the
  // full width so a long answer never gets squeezed into half a column.
  const half = field.half || field.type === 'file';

  const label = (
    <>
      {field.label}
      {field.required && <span className="text-gold ml-1" aria-hidden="true">*</span>}
    </>
  );
  // Two fields sharing a row rarely have labels of the same length, and a label
  // that wraps would otherwise drop its input half a line below its neighbour.
  // The label box grows to fill the row and sits its text at the bottom, so a
  // label always hugs its own input and the slack from a taller neighbour falls
  // above it rather than between the two.
  const labelBase = 'text-[0.82rem] font-medium text-white/70 leading-snug mb-2';

  if (field.type === 'consent') {
    return (
      <div className="flex flex-col min-w-0 sm:col-span-2">
        <ConsentCheckbox field={field} value={value} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-w-0 ${half ? '' : 'sm:col-span-2'}`}>
      {field.type === 'radio' ? (
        <RadioGroup field={field} value={value} error={error} errorId={errorId}
                    onChange={onChange} labelClass={`block ${labelBase}`} label={label} />
      ) : (
        <>
          <label htmlFor={id} className={`flex flex-1 items-end ${labelBase}`}>
            <span>{label}</span>
          </label>
          {field.type === 'file' ? (
            <FileInput field={field} id={id} value={value} error={error}
                       errorId={errorId} onChange={onChange} />
          ) : (
            <TextInput field={field} id={id} value={value} error={error}
                       errorId={errorId} onChange={onChange} />
          )}
        </>
      )}

      {error && (
        <p id={errorId} className="text-red-300 text-[0.78rem] leading-snug mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

// One height for every control on the page — inputs, radio pills and the file
// drop target — so nothing sits a few pixels off its neighbour.
const CONTROL_HEIGHT = 'min-h-[3rem]';

const inputClass = (error) => `w-full ${CONTROL_HEIGHT} bg-white/[0.04] border rounded-lg
  px-4 py-3 text-white text-[max(0.92rem,16px)] leading-normal
  transition-colors focus:outline-none placeholder:text-white/30
  ${error ? 'border-red-400/70 focus:border-red-400' : 'border-white/15 focus:border-gold'}`;

function TextInput({ field, id, value, error, errorId, onChange }) {
  const shared = {
    id,
    value,
    onChange: e => onChange(e.target.value),
    placeholder: field.placeholder,
    'aria-invalid': !!error,
    'aria-describedby': error ? errorId : undefined,
  };

  if (field.type === 'textarea') {
    return <textarea {...shared} rows={4} maxLength={5000}
                     className={`${inputClass(error)} resize-y leading-[1.7]`} />;
  }

  // Numbers ride in a text input so commas and dollar signs survive typing;
  // inputMode still brings up the number pad on a phone.
  const numeric = field.type === 'number';
  const affix = field.prefix ?? field.suffix;

  const input = (
    <input {...shared}
           type={numeric ? 'text' : field.type}
           inputMode={numeric ? 'decimal' : undefined}
           autoComplete={field.autoComplete}
           maxLength={numeric ? 20 : 200}
           className={`${inputClass(error)} ${
             field.prefix ? 'pl-8' : ''} ${field.suffix ? 'pr-16' : ''}`} />
  );

  if (!affix) return input;

  return (
    <div className="relative">
      {input}
      <span aria-hidden="true"
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2
                        text-white/40 text-[0.9rem]
                        ${field.prefix ? 'left-3.5' : 'right-4'}`}>
        {affix}
      </span>
    </div>
  );
}

// Tally shows these as radio buttons; here they are pills, which fit the
// two-column layout without eight rows of stacked circles.
function RadioGroup({ field, value, error, errorId, onChange, labelClass, label }) {
  return (
    <fieldset className="min-w-0" aria-describedby={error ? errorId : undefined}>
      <legend className={labelClass}>{label}</legend>
      <div className="flex flex-wrap gap-2.5" id={`f-${field.name}`} tabIndex={-1}>
        {field.options.map(o => {
          const active = value === o;
          return (
            <label key={o} className="cursor-pointer">
              <input
                type="radio"
                name={field.name}
                value={o}
                checked={active}
                onChange={() => onChange(o)}
                // Clicking the chosen answer again clears it — otherwise an
                // optional question can never be un-answered.
                onClick={() => { if (!field.required && active) onChange(''); }}
                className="sr-only peer"
              />
              <span className={`flex items-center ${CONTROL_HEIGHT} rounded-lg border
                                px-4 text-[0.86rem] transition-colors
                                peer-focus-visible:ring-2 peer-focus-visible:ring-gold/70
                                ${active
                                  ? 'bg-gold text-navy border-gold font-semibold'
                                  : `text-white/65 hover:text-white hover:border-gold/45
                                     ${error ? 'border-red-400/50' : 'border-white/15'}`}`}>
                {o}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function FileInput({ field, id, value, error, errorId, onChange }) {
  const ref = useRef(null);

  const clear = () => {
    // The input keeps its file after React forgets it, so picking the same
    // document twice in a row would otherwise fire no change event.
    if (ref.current) ref.current.value = '';
    onChange(null);
  };

  return (
    <>
      <input ref={ref} id={id} type="file" accept={ACCEPT} className="sr-only"
             aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
             onChange={e => onChange(e.target.files?.[0] ?? null)} />

      {value ? (
        <div className={`flex items-center justify-between gap-3 ${CONTROL_HEIGHT}
                         rounded-lg border px-4 ${error ? 'border-red-400/70 bg-red-400/5'
                                           : 'border-gold/30 bg-gold/[0.05]'}`}>
          <span className="min-w-0 text-white/80 text-sm truncate">
            {value.name}
            <span className="text-white/35 ml-2 whitespace-nowrap">
              {(value.size / 1024 / 1024).toFixed(1)} MB
            </span>
          </span>
          <button type="button" onClick={clear}
                  className="text-white/45 hover:text-gold text-sm shrink-0 transition-colors">
            Remove
          </button>
        </div>
      ) : (
        <label htmlFor={id}
               className={`flex items-center justify-center gap-2 cursor-pointer
                          ${CONTROL_HEIGHT} rounded-lg border border-dashed
                          border-white/20 px-4 text-white/45 text-sm transition-colors
                          hover:border-gold/45 hover:text-white/70`}>
          <span aria-hidden="true" className="text-base leading-none">＋</span>
          Attach a file
        </label>
      )}
    </>
  );
}
