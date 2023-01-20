import { type BlogPost } from "./blog.schema";
import { db } from './blog.datasource';
import { sortByDateDescending } from "./utils/utils.sort";

export { type BlogPost };

// Public API for fetching data
export const getAllBlogPostSlugs = async (): Promise<BlogPost['slug'][]> => {
  const blogPosts = await db.getAllBlogPost();
  return blogPosts
    .sort((a, b) => sortByDateDescending(a.date, b.date))
    .map(b => b.slug);
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const blogPosts = await db.getAllBlogPost();
  return blogPosts.sort((a, b) => sortByDateDescending(a.date, b.date));
};

export const getBlogPostBySlug = async (slug: BlogPost['slug']) => {
  return db.getBlogPostBySlug(slug);
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