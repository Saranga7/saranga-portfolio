# Dali's curiosity library

This directory is the authoring source for the local, lazy-loaded library.
`seed.json` preserves the original 40 curated entries. Other JSON files group
independently worded facts by source, with shared category and citation details.

Run `npm run validate:factoids` after editing. It rebuilds
`public/assets/data/dali-factoids.json` and checks the minimum 1,000-entry count,
unique IDs and normalized text, categories, 20–280 character length, sentence
endings and HTTPS citations. Production builds run the same checks.

Keep facts self-contained and easy to understand. Avoid filler templates,
unsupported records, medical advice and claims that require specialist context.
Describe mythology as mythology. Keep source-group IDs and existing fact order
stable because IDs are generated from their position. Link to the relevant
article rather than a homepage or search result. Automated checks validate
structure, not factual truth; read the source when changing a claim.

The corpus is fetched only on the first curiosity-button click. The browser's
versioned session queue avoids repeats until every entry has been shown.
