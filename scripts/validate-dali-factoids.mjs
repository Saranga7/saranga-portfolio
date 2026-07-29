import { readFile } from "node:fs/promises";

const expected = {
  "science-history-geography": 500,
  "computer-science-ai": 200,
  "flora-fauna": 150,
  "greek-mythology": 100,
  sarcasm: 50,
};
const path = new URL("../public/assets/data/dali-factoids.json", import.meta.url);
const entries = JSON.parse(await readFile(path, "utf8"));

if (!Array.isArray(entries) || entries.length !== 1000) {
  throw new Error(`Dali corpus must contain exactly 1000 entries; found ${entries.length}.`);
}

const ids = new Set();
const texts = new Set();
const counts = Object.fromEntries(Object.keys(expected).map((category) => [category, 0]));

for (const entry of entries) {
  if (!(entry.category in expected)) throw new Error(`Unknown category: ${entry.category}`);
  if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate or missing ID: ${entry.id}`);
  ids.add(entry.id);

  const normalized = entry.text?.toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized || texts.has(normalized)) throw new Error(`Duplicate or missing text: ${entry.id}`);
  if (/^q\d+\s+—/i.test(normalized)) throw new Error(`Unlabelled source entity: ${entry.id}`);
  if (entry.text.length > 220) throw new Error(`Fact exceeds 220 characters: ${entry.id}`);
  texts.add(normalized);
  counts[entry.category] += 1;

  if (entry.category !== "sarcasm") {
    if (!entry.sourceLabel) throw new Error(`Missing source label: ${entry.id}`);
    try {
      const url = new URL(entry.sourceUrl);
      if (url.protocol !== "https:") throw new Error();
      if (!["www.wikidata.org", "www.inaturalist.org"].includes(url.hostname)) throw new Error();
    } catch {
      throw new Error(`Invalid HTTPS source: ${entry.id}`);
    }
  }
}

for (const [category, count] of Object.entries(expected)) {
  if (counts[category] !== count) {
    throw new Error(`${category}: expected ${count}, found ${counts[category]}`);
  }
}

console.log(`Validated ${entries.length} Dali factoids.`);
