import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    summary: z.string(),
    cover: image().optional(),      // 예: ../../assets/my-cover.png
    coverAlt: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});
export const collections = { essays };
