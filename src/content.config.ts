import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    featured: z.boolean(),
    order: z.number(),
    domain: z.string(),
    summary: z.string(),
    technologies: z.array(z.string()),
    role: z.string(),
    coverVariant: z.enum(["seals", "malaria", "deeplense", "music"]),
    projectUrl: z.url().optional(),
    paperUrl: z.url().optional(),
    codeUrl: z.url().optional(),
    articles: z.array(z.object({
      title: z.string(),
      url: z.url(),
    })).optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    year: z.number(),
    title: z.string(),
    authors: z.string(),
    venueOrStatus: z.string(),
    domains: z.array(z.string()),
    paperUrl: z.url().optional(),
    codeUrl: z.url().optional(),
    bibtex: z.string().optional(),
  }),
});

export const collections = { projects, publications };
