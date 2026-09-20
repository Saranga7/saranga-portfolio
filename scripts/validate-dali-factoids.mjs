import { readFile } from "node:fs/promises";

// Categories remain available for future reviewed additions; no volume quotas.
const categories = [
  "science_history_geography", "world_mythology", "computer_science_ai",
  "wildlife", "cinema", "travel", "sarcastic_jokes",
];
const path = new URL("../public/assets/data/dali-factoids.json", import.meta.url);
const entries = JSON.parse(await readFile(path, "utf8"));

if (!Array.isArray(entries) || entries.length < 1000) {
  throw new Error("Dali corpus must contain at least 1,000 curated facts.");
}

const ids = new Set();
const texts = new Set();
const counts = Object.fromEntries(categories.map((category) => [category, 0]));

for (const entry of entries) {
  if (!categories.includes(entry.category)) throw new Error(`Unknown category: ${entry.category}`);
  if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate or missing ID: ${entry.id}`);
  ids.add(entry.id);

  const normalized = entry.text?.toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized || texts.has(normalized)) throw new Error(`Duplicate or missing text: ${entry.id}`);
  if (entry.text.length < 20 || entry.text.length > 280) throw new Error(`Fact must be 20–280 characters: ${entry.id}`);
  if (!/[.!?]$/.test(entry.text.trim())) throw new Error(`Missing sentence ending: ${entry.id}`);
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

console.log(`Validated ${entries.length} curated Dali factoids.`, counts);
