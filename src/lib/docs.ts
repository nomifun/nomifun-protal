import { getCollection, type CollectionEntry } from 'astro:content';
import { localizePath, type Locale } from '@/i18n';

export type DocEntry = CollectionEntry<'docs'>;

/** Strip the leading `zh/` or `en/` language segment from a collection id. */
export function topicSlug(id: string): string {
  return id.replace(/^(zh|en)\//, '');
}

/** Map an app Locale to the content-folder prefix. */
export function langPrefix(locale: Locale): 'zh' | 'en' {
  return locale === 'en-US' ? 'en' : 'zh';
}

/** All docs for a locale, sorted by category-appearance then `order`. */
export async function getDocsForLocale(locale: Locale): Promise<DocEntry[]> {
  const all = await getCollection('docs');
  return all
    .filter((d) => d.data.lang === locale)
    .sort((a, b) => a.data.order - b.data.order);
}

export interface DocGroup {
  category: string;
  items: { slug: string; href: string; title: string; description?: string }[];
}

/**
 * Group a locale's docs by category, preserving first-seen category order and
 * sorting items within each group by `order`. `href` is fully localized
 * (`/docs/<topic>` for en, `/zh/docs/<topic>` for zh).
 */
export function groupDocs(docs: DocEntry[], locale: Locale): DocGroup[] {
  const groups: DocGroup[] = [];
  const byCategory = new Map<string, DocGroup>();
  for (const d of [...docs].sort((a, b) => a.data.order - b.data.order)) {
    const slug = topicSlug(d.id);
    let group = byCategory.get(d.data.category);
    if (!group) {
      group = { category: d.data.category, items: [] };
      byCategory.set(d.data.category, group);
      groups.push(group);
    }
    group.items.push({
      slug,
      href: localizePath(`/docs/${slug}`, locale),
      title: d.data.title,
      description: d.data.description,
    });
  }
  return groups;
}
