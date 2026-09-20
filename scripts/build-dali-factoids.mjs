import { readFile, readdir, writeFile } from "node:fs/promises";

// Editorial input is handwritten, grouped by source for review. Never scrape
// sentences or manufacture variants to reach a count.
const directory = new URL("../src/data/dali/", import.meta.url);
const seed = JSON.parse(await readFile(new URL("seed.json", directory), "utf8"));
const entries = [...seed];
for (const file of (await readdir(directory)).sort()) {
  if (!file.endsWith(".json") || file === "seed.json") continue;
  const groups = JSON.parse(await readFile(new URL(file, directory), "utf8"));
  for (const { id, facts, ...source } of groups) {
    facts.forEach((text, index) => entries.push({
      id: `reviewed-${id}-${index + 1}`, ...source, text,
    }));
  }
}
await writeFile(new URL("../public/assets/data/dali-factoids.json", import.meta.url), JSON.stringify(entries, null, 2) + "\n");
console.log(`Built ${entries.length} editorial factoids.`);
