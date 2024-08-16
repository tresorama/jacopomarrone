import * as fs from 'fs';
import path from 'path';
import { z } from "zod";
import { createCollection } from "@/lib/markdown-data-layer/create-collection";
import { createDb_Flatfile } from "@/lib/markdown-data-layer/create-db.flat-file";
import { sortByDateDescending } from "@/lib/markdown-data-layer/utils.sort";

// utils
const getFilePathFromHere = (relativePath: string) => path.resolve(__dirname, relativePath);

// collections
const authorCollection = createCollection({
  slug: 'author',
  db: createDb_Flatfile({
    dirPath: getFilePathFromHere('./author'),
  }),
  schema: (baseSchema) => baseSchema,
});

type Author = z.infer<typeof authorCollection.fullSchema>;

const blogCollection = createCollection({
  slug: 'blog',
  db: createDb_Flatfile({
    dirPath: getFilePathFromHere('./blog'),
  }),
  schema: (baseSchema) => baseSchema.extend({
    /* Add here your front-matter markdown custom fields */
    status: z.enum(["published", "draft"]),
    description: z.string(),
    published_date: z.date().optional(),
    author: z.string(),
    crossposted_url: z.string().nullable().optional(),
  }).transform((data) => ({
    ...data,
    published_date: data.published_date ? String(data.published_date) : data.published_date,
  })
  ),
});

type BlogPost_Base = z.infer<typeof blogCollection.fullSchema>;
export type BlogPost = Awaited<ReturnType<typeof getAllBlogPosts>>[number];



// =====================================================
// Public API
// Use this in Next.js Pages on Server Side
// =====================================================

export const getAllBlogPostSlugs = async () => {
  const blogPosts = await blogCollection.getAll();
  return blogPosts
    .filter(b => b.status === 'published' && b.published_date)
    .sort((a, b) => sortByDateDescending(a.published_date!, b.published_date!))
    .map(b => b.slug);

};

export const getAllBlogPosts = async () => {
  const blogPosts = await blogCollection.getAll();
  const authors = await authorCollection.getAll();
  return blogPosts
    .filter(b => b.status === 'published' && b.published_date)
    .sort((a, b) => sortByDateDescending(a.published_date!, b.published_date!))
    .map(p => {
      const author = authors.find(a => a.slug === p.author);
      return {
        ...p,
        author: author?.title ?? null,
        url: `/blog/${p.slug}`,
      };
    });
};

export const getBlogPostBySlug = async (slug: BlogPost_Base['slug']) => {
  const blogPost = await blogCollection.getOneBySlug(slug);
  if (!blogPost) return null;
  const author = await authorCollection.getOneBySlug(blogPost.author);
  return {
    ...blogPost,
    author: author?.title ?? null,
    url: `/blog/${blogPost.slug}`,
  };
};

/** Return blogpost published immediatly before the blogpost with slug provided. Null if not found. */
export const getPrevBlogPostBySlug = async (slug: BlogPost_Base['slug']) => {
  const slugs = await getAllBlogPostSlugs();
  const index = slugs.findIndex(s => s === slug);
  const isNotFound = index === -1;
  const isFirst = index === 0;
  if (isNotFound || isFirst) return null;
  const prevSlug = slugs[index - 1];
  return getBlogPostBySlug(prevSlug);
};

/** Return blogpost published immediatly after the blogpost with slug provided. Null if not found. */
export const getNextBlogPostBySlug = async (slug: BlogPost_Base['slug']) => {
  const slugs = await getAllBlogPostSlugs();
  const index = slugs.findIndex(s => s === slug);
  const isNotFound = index === -1;
  const isLast = index === slugs.length - 1;
  if (isNotFound || isLast) return null;
  const nextSlug = slugs[index + 1];
  return getBlogPostBySlug(nextSlug);
};


