export const blogCategories = [
  { slug: "poems", label: "Poems", fullLabel: "Poems", description: "Verses on memory, distance, change, and the roads between." },
  { slug: "haiku", label: "Haiku", fullLabel: "Haiku", description: "Small observations, held briefly and precisely." },
  { slug: "write-ups", label: "Write-ups", fullLabel: "Write-ups", description: "Essays, travel, reviews, and longer reflections." },
  { slug: "random-bs", label: "Random BS", fullLabel: "Random Bullshit", description: "Thoughts that refused a more respectable category." },
] as const;

export type BlogCategory = typeof blogCategories[number]["slug"];

export const categoryLabel = (slug: BlogCategory | "travelogues") =>
  slug === "travelogues"
    ? "Travelogues"
    : blogCategories.find((category) => category.slug === slug)?.label ?? slug;

export const blogDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
