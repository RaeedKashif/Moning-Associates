# Lead documents bucket

The buyer and seller intake forms let people attach documents — rent roll, T-12,
proof of funds, an underwriting model. These land in a Supabase Storage bucket
called `lead-documents`.

**The bucket does not exist yet.** Until it does, the forms still submit: the
lead is written to `contact_submissions`, the message body records which
documents were attached with `UPLOAD FAILED` next to each, and the success
screen asks the person to email them to Steven instead. Nothing is lost, but
nobody's rent roll actually arrives.

## Create it

Paste this into the Supabase SQL editor (Project → SQL Editor → New query), or
run it against the database with `psql`:

```sql
-- Private bucket. A rent roll or a proof of funds letter must never sit behind
-- a guessable public URL, so this is not `public = true`.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lead-documents',
  'lead-documents',
  false,
  10485760, -- 10 MB, matching the client-side check in InquiryForm.jsx
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do nothing;

-- The website runs on the anon key, so anon may write and nothing else.
-- No select, no update, no delete: a visitor can hand a document in, and can
-- never read one back out — not theirs, not anybody else's.
create policy "anon can attach lead documents"
  on storage.objects for insert to anon
  with check (bucket_id = 'lead-documents');
```

That is the whole setup. Do not add a select policy for `anon`.

## Reading the documents

The message body on each submission records the object path, e.g.
`seller/2026-08-09-k3f9dq21/rent_roll-Q3_rent_roll.xlsx`. One folder per
submission, so everything a person sent stays together.

To open one, use the service-role key from a trusted context — the admin panel's
server side, or the Supabase dashboard's storage browser. From the admin app:

```js
const { data } = await supabaseAdmin
  .storage.from('lead-documents')
  .createSignedUrl(path, 60 * 10); // ten minutes
```

## Housekeeping

Nothing expires these objects. At free-tier volumes that is fine for a long
while; if it ever matters, delete the folders for leads that have closed —
the path prefix is the submission.
