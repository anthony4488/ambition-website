# BNPL provider logos

Drop the three official marks here, exactly these filenames:

- `afterpay.svg`
- `klarna.svg`
- `zip.svg`

They render inside white chips beside every published price on /apply, /falcon
and /online-coaching, but only when NEXT_PUBLIC_BNPL_ENABLED=true.

Use the standard full-colour mark. The chips are white so the colour versions
read correctly on both the light and dark sections of the site. SVG preferred;
PNG works if that is all the provider supplies, just keep the filename.

Sources, as an approved Stripe merchant:
- Afterpay: merchant portal, brand assets
- Klarna: merchant portal, "Klarna branding" / marketing assets
- Zip: merchant hub, brand kit

Do not take these from a web search. Each brand's guidelines govern minimum
size, clear space and which colourway may sit on which background, and the kits
carry the current approved versions.

A missing file hides its own chip rather than showing a broken image, so it is
safe to add them one at a time.
