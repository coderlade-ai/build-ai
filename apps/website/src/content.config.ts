import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Blog articles live at src/content/blog/<translationId>/<locale>.md.
 * A published article needs all eight editions; see src/blog/validate.ts.
 */
const blog = defineCollection({
  loader: glob({
    pattern: "*/*.md",
    base: "./src/content/blog",
    // Keep "<translationId>/<locale>" as the id; the default would use the slug field.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(200),
    slug: z.string().min(1),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
