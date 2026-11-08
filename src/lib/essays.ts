import { getCollection } from 'astro:content';
export async function getEssays() {
  const all = await getCollection('essays', (e) => !e.data.draft);
  return all.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
}
export const fmt = (d: Date) => d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
