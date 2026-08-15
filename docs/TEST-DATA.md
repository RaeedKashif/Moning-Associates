# Test data for the lead paths

Leads reach the CRM three ways. Each one is worth testing on its own, because
they land in different tables and only two of them dedupe.

| Path | Writes to | Where it shows up |
| --- | --- | --- |
| Website buyer/seller form | `contact_submissions` | Admin → **Inquiries → Buyers / Sellers**, straight away |
| Admin → Contacts → **Pull in website enquiries** | `contacts` | Admin → **Contacts** |
| Admin → Contacts → **Import CSV** | `contacts` | Admin → **Contacts** |
| Admin → Contacts → **Add Contact** | `contacts` | Admin → **Contacts** |

**Read this before you start.** A website enquiry that is pulled into Contacts
is matched on both `submission_id` *and* email. A CSV row is matched on email
too. So if two paths use the same email address, the second one looks like it
silently did nothing — it was deduped, not dropped. Every address below is
deliberately different for that reason. If you run the same test twice, change
the email the second time (`marcus.reyes+2@example.com` works) or you will see
the same non-effect.

Also worth knowing: **file uploads will fail** until the SQL in
[SUPABASE-LEAD-DOCUMENTS.md](SUPABASE-LEAD-DOCUMENTS.md) has been run. That is
expected, not a bug in the form. The lead still saves, the message body marks
each document `UPLOAD FAILED`, and the success screen asks the person to email
them. Attach a file anyway — seeing that path work is part of the test.

---

## 1. Website buyer form

<https://stevenmoning.vercel.app/#/buyers>

| Question | Value |
| --- | --- |
| Full name | Marcus Reyes |
| Company name | Reyes Bridge Capital |
| Email | marcus.reyes@example.com |
| Phone | (469) 555-0142 |
| How did you hear about us | Referral from a lender at Comerica |
| I am a | Buyer *(already selected)* |
| Buyer or entity name | Reyes Bridge Capital LLC |
| Track record / years active | 9 years, 11 deals |
| Entity type | LLC or fund |
| Current portfolio size | 320 |
| Target unit count range | 60 – 180 |
| Asset class | Class B/C multifamily |
| Target markets | Dallas, Garland, Mesquite, Arlington |
| Vintage preference | 1990s – 2010s |
| Strategy | Value-add |
| Available equity | 4,500,000 |
| Maximum purchase price | 18,000,000 |
| Typical check size range | $1.5M – $5M |
| Debt relationships in place | Yes |
| Open to seller financing | Yes |
| Open to a JV or partnership | Maybe |
| Open to loan assumption deals | Yes |
| Interested in portfolio deals | Maybe |
| Readiness | Ready now |
| Typical diligence period | 30 |
| Typical closing timeline | 45 |
| Target cash-on-cash return | 7.5 |
| Target IRR | 16 |
| Target cap rate | 6.25 |
| Renovation budget range | $9k – $14k per unit |
| Management style | Third-party |
| Target hold period | 5 |
| Repositioning plans | Interior renovations, covered parking, rebrand |
| Proof of funds | any small PDF |
| Underwriting model | any small spreadsheet |
| References | Dana Whitfield at Comerica, 469-555-0177 |

Worth trying deliberately:

- Type `$4,500,000` into **Available equity** with the dollar sign and commas.
  A plain number input would throw that away; this one keeps it and does not
  double the `$` in the saved message.
- Submit with **Full name** empty first. You should get "12 questions need
  another look" and be scrolled to the first one.
- Click **Maybe** twice on *Open to a JV or partnership* — an optional answer
  clears on a second click. A required one will not.

## 2. Website seller form

<https://stevenmoning.vercel.app/#/sellers>

| Question | Value |
| --- | --- |
| Full name | Alicia Bardem |
| Company name | Bardem Family Holdings |
| Email | alicia.bardem@example.com |
| Phone | (972) 555-0188 |
| How did you hear about us | Google search for a DFW multifamily broker |
| I am a | Seller *(already selected)* |
| Legal owner name(s) | Bardem Family Holdings LLC |
| Decision makers | Alicia Bardem and her brother Tomas, co-manager |
| Entity type | LLC |
| Years owned | 12 |
| Management structure | Third-party managed |
| Property address | 3105 Cedar Ridge Dr, Garland, TX 75041 |
| Currently listed on the MLS | Off-market |
| Unit count | 72 |
| Year built | 1979 |
| Current occupancy | 88 |
| Average rent | 1,145 |
| Deferred maintenance | Three roofs due within two years, boiler at end of life |
| Recent capex | 24 interiors renovated in 2024, parking lot resurfaced |
| Reason for selling | Partnership dissolution — my brother wants out |
| Additional context | Two of the three partners want out. The third would roll his share into the next deal if the timing works. |
| Ideal sale timeframe | 3 – 6 months |
| Hard deadline, if there is one | Loan matures March 2027 |
| Open to an off-market sale | Yes |
| Current loan balance | 4,150,000 |
| Interest rate | 4.35 |
| Trailing 12-month NOI | 585,000 |
| Willing to offer seller financing | Maybe — depends on terms |
| Desired price | 9,400,000 |
| Basis for that price | Market comps |
| Open to market feedback on pricing | Yes |
| Open to creative terms | Would consider a short master lease during the transition |
| Selling as-is or willing to make improvements | Open to discuss |
| Part of a portfolio sale | Could be |
| Rent roll | any small spreadsheet |
| T-12 financials | any small PDF |
| Other reports | leave blank |

Worth trying deliberately:

- Put `140` in **Current occupancy** — it should refuse anything over 100.
- Put `1650` in **Year built** — nothing before 1700.
- Type `about four hundred thousand` into **Trailing 12-month NOI** — numbers only.
- Leave **Other reports** empty. Blank optional questions should not appear in
  the saved message at all.

### What to check after each submission

1. Admin → **Inquiries → Buyers** (or Sellers). The row appears immediately,
   tagged with the right source. Open it: the message body is grouped under the
   same headings as the form, with a `— came from:` line at the bottom.
2. Admin → **Contacts** → **Pull in website enquiries**. Marcus and Alicia
   arrive as contacts with lead type Buyer / Seller, stage New, source
   `website`.
3. Press **Pull in website enquiries** a second time. Nothing should be added —
   that is the `submission_id` check doing its job, not a failure.

---

## 3. CSV import

Admin → **Contacts → Import CSV**, then upload
[`sample-leads.csv`](sample-leads.csv) from this folder.

The headers are deliberately BoldTrail-shaped rather than tidy — `Name`,
`Primary Email Address`, `Cell Phone`, `Contact Type`, `Lead Status`,
`Referral Source`, `Labels`, `Comments` — so the automatic column matching has
something real to chew on. Check the mapping row on screen picks all eight
without help.

Eight rows in. Expect the preview to say:

| Number | Expected | Why |
| --- | --- | --- |
| Total | 8 | |
| Importable | 5 | |
| Skipped | 2 | Pat Nolan has no email and no phone; Chris Vance's email is `chris.vance@` |
| Duplicates in file | 1 | Priya Raman appears twice — the later row, stage Qualified, wins |

The five that land should show:

- **Priya Raman** — buyer, stage Qualified, tags `multifamily`, `value-add`, `priority`
- **Grant Whitfield** — seller, stage Contacted, tags `garland`, `off-market`
- **Raymond Okafor** — investor, stage Qualified. Note the CSV has this as
  `"Okafor, Raymond"`; surname-first exports get split the right way round.
- **Dana Cole** — buyer & seller, stage Active, no email, phone only
- **Lena Ortiz** — buyer, stage New, with a note that runs over two lines

Then check **Recent imports** at the bottom of that page shows the run with
5 added, 0 updated, 2 skipped.

**Import the same file a second time** to see the other half of the logic:
0 added, and updates only where a field was empty. An import fills gaps in
name and phone — it never touches stage, notes, tags or follow-up dates on a
contact you have already worked.

---

## 4. Answering "Both"

Either form asks **I am a: Buyer / Seller / Both**, pre-set to whichever page
you opened. Choosing **Both** appends the other side's questions to the page,
so a client selling one asset and buying the next answers all 67 Tally
questions in one sitting instead of half of them.

Open <https://stevenmoning.vercel.app/#/sellers> and change **I am a** to
**Both**. You should see:

- the field count go from 37 to **67** — the contact block is not repeated
- a gold "Now the buying side" panel where the second half starts
- **Entity type** asked twice, once per side, with different options
  (seller: Individual / LLC / Trust / Partnership / Corporation / Other;
  buyer: Individual / LLC or fund / Partnership / REIT / Other). Answering one
  must not move the other.
- two document blocks — **Property documents** and **Your documents**
- the required count rise: the far side's required questions now apply too

Fill it with Alicia Bardem's seller values from section 2, plus the buyer half
from section 1 (change the email to `alicia.bardem+both@example.com` so it does
not collide with your earlier seller test). Then check:

1. Admin → **Inquiries → Sellers**. It appears there, not in a third list —
   `source` deliberately stays `seller` so it lists under the page they used.
   The `I am a: Both` line is in the message body.
2. Admin → **Contacts → Pull in website enquiries**. The contact arrives with
   lead type **Buyer & Seller**, read off that line rather than off `source`.

## 5. Add Contact by hand

Admin → **Contacts → Add Contact**.

| Field | Value |
| --- | --- |
| First name | Tomas |
| Last name | Bardem |
| Email | tomas.bardem@example.com |
| Phone | (972) 555-0190 |
| Lead type | Buyer & Seller |
| Stage | Contacted |
| Source | referral — sister Alicia |
| Notes | Co-manager on the Garland property. Wants to 1031 his share into something smaller and newer. |

Worth trying deliberately: clear both **Email** and **Phone** and submit. It
should stop you with "Add an email or phone number" — a lead with no way to
reach them is not a lead.

---

## Cleaning up

All of this is real data in the real tables. When you are done, delete the test
contacts from Admin → Contacts, and the two enquiries from Inquiries. The
`import_batches` rows stay as an audit trail; that is by design and harmless.
