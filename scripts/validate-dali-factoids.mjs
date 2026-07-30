import { readFile } from "node:fs/promises";

const expected = {
  science_history_geography: 1500,
  world_mythology: 500,
  computer_science_ai: 1000,
  wildlife: 750,
  cinema: 500,
  travel: 500,
  sarcastic_jokes: 250,
};
const path = new URL("../public/assets/data/dali-factoids.json", import.meta.url);
const entries = JSON.parse(await readFile(path, "utf8"));

if (!Array.isArray(entries) || entries.length !== 5000) {
  throw new Error(`Dali corpus must contain exactly 5000 entries; found ${entries.length}.`);
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
  if (entry.text.length < 20) throw new Error(`Fact is too short: ${entry.id}`);
  texts.add(normalized);
  counts[entry.category] += 1;

  if (!entry.subcategory) throw new Error(`Missing subcategory: ${entry.id}`);
  if (!entry.source_title) throw new Error(`Missing source title: ${entry.id}`);
  try {
    const url = new URL(entry.source_url);
    if (url.protocol !== "https:") throw new Error();
  } catch {
    throw new Error(`Invalid HTTPS source: ${entry.id}`);
  }
}

for (const [category, count] of Object.entries(expected)) {
  if (counts[category] !== count) {
    throw new Error(`${category}: expected ${count}, found ${counts[category]}`);
  }
}

console.log(`Validated ${entries.length} Dali factoids.`);
