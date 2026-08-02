# itsmejunaid.github.io — redirect only

This repository no longer hosts a portfolio. It serves a single redirect page
pointing at **[junaidai.com](https://junaidai.com/)**, which is now the one and
only home for Muhammad Junaid's portfolio.

## Why

Two live copies of the same portfolio were competing for the same search
queries. `itsmejunaid.github.io` was outranking `junaidai.com` for brand
searches like *"Muhammad Junaid AI Engineer"* — and the old page made it worse
by declaring its own `Person` structured data with a different email, phone
number, Medium handle and a stale employer. Search engines read that as a
second, separate person, so authority was split across two domains instead of
building up on one.

`index.html` now sends every visitor and crawler to junaidai.com and carries
`noindex, follow`, so this page drops out of the index while still passing link
authority to the new domain.

## Please don't restore the old page here

If you want the previous portfolio back, it lives in git history — see commit
`4193b4f` and its parents. Restoring it to this domain would re-create the exact
ranking problem this change was made to fix. Update
[junaidai.com](https://junaidai.com/) instead.

The `css/`, `js/`, `assets/` and `resume.pdf` files are intentionally left in
place so any existing deep links to them keep working.
