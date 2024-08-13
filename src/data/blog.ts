import { z } from "zod";
import { createCollection } from "@/lib/markdown-data-layer/create-collection";
import { createDb_Flatfile } from "@/lib/markdown-data-layer/create-db.flat-file";
import { sortByDateDescending } from "@/lib/markdown-data-layer/utils.sort";

const collection = createCollection({
  slug: 'blog',
  db: createDb_Flatfile({
    dirPath: './src/data/blog',
  }),
  schema: {
    /* Add here your front-matter markdown custom fields */
    status: z.enum(["published", "draft"]),
    published_date: z.string().datetime(),
    author: z.string(),
    crossposted_url: z.string().optional(),
  },
});

export type BlogPost = z.infer<typeof collection.fullSchema>;

// =====================================================
// Public API
// Use this in Next.js Pages on Server Side
// =====================================================

export const getAllBlogPostSlugs = async (): Promise<BlogPost['slug'][]> => {
  const blogPosts = await collection.getAll();
  return blogPosts
    .sort((a, b) => sortByDateDescending(a.published_date, b.published_date))
    .map(b => b.slug);
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const blogPosts = await collection.getAll();
  return blogPosts.sort((a, b) => sortByDateDescending(a.published_date, b.published_date));
};

export const getBlogPostBySlug = async (slug: BlogPost['slug']) => {
  return collection.getOneBySlug(slug);
};

/** Return blogpost published immediatly before the blogpost with slug provided. Null if not found. */
export const getPrevBlogPostBySlug = async (slug: BlogPost['slug']) => {
  const slugs = await getAllBlogPostSlugs();
  const index = slugs.findIndex(s => s === slug);
  const isNotFound = index === -1;
  const isFirst = index === 0;
  if (isNotFound || isFirst) return null;
  const prevSlug = slugs[index - 1];
  return getBlogPostBySlug(prevSlug);
};

/** Return blogpost published immediatly after the blogpost with slug provided. Null if not found. */
export const getNextBlogPostBySlug = async (slug: BlogPost['slug']) => {
  const slugs = await getAllBlogPostSlugs();
  const index = slugs.findIndex(s => s === slug);
  const isNotFound = index === -1;
  const isLast = index === slugs.length - 1;
  if (isNotFound || isLast) return null;
  const nextSlug = slugs[index + 1];
  return getBlogPostBySlug(nextSlug);
};