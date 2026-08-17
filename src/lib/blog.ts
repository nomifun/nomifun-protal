import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n';

export type BlogEntry = CollectionEntry<'blog'>;

export function blogSlug(id: string): string {
  return id
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')
    .replace(/^(?:en|zh)\//, '');
}

export async function getPublishedBlogPosts(locale: Locale): Promise<BlogEntry[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => !data.draft && data.lang === locale
  );
  return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
