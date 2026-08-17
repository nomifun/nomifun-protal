import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Docs content collection.
 *
 * Files live under `src/content/docs/<lang>/*.md` where `<lang>` is `zh` or
 * `en`. The glob id therefore carries the language prefix (e.g.
 * `zh/introduction`); routing strips that prefix so en lives at `/docs/<topic>`
 * and zh lives at `/zh/docs/<topic>`.
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

/**
 * Blog posts live under `src/content/blog/<lang>`.
 * Matching translations use the same filename so each localized route keeps
 * the same slug while the indexes only load content for their active locale.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string(),
    contact: z.string().optional(),
    lang: z.enum(['zh-CN', 'en-US']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, blog };
