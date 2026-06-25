import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Docs content collection.
 *
 * Files live under `src/content/docs/<lang>/*.md` where `<lang>` is `zh` or
 * `en`. The glob id therefore carries the language prefix (e.g.
 * `zh/introduction`); routing strips that prefix so zh lives at `/docs/<topic>`
 * and en at `/en/docs/<topic>`.
 *
 * `category` groups guides in the sidebar; `order` sorts within a category.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string(),
    order: z.number(),
    lang: z.enum(['zh-CN', 'en-US']),
  }),
});

export const collections = { docs };
