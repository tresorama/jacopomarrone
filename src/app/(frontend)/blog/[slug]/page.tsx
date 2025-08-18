import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { seoAppRouter } from "@/lib/utils/seo";
import { type BlogPost, getAllBlogPostSlugs, getBlogPostBySlug, getNextBlogPostBySlug, getPrevBlogPostBySlug } from "@/data/blog";
import { BlogPostView } from "@/components/views/Blog/BlogPostView";

// 1. generate static params for all items

type RawPageProps = {
  params: Promise<{
    slug: BlogPost['slug'];
  }>;
};

export const generateStaticParams = async (): Promise<Awaited<RawPageProps['params']>[]> => {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map(slug => ({ slug }));
};


// 2. for each item -> get data

const validatePageProps = async (props: RawPageProps) => {
  return z.object({
    params: z.object({
      slug: z.string(),
    }),
  }).parse({
    params: await props.params
  });
};

const getPageData = async (rawPageProps: RawPageProps) => {

  // validate page props
  const { params } = await validatePageProps(rawPageProps);

  // get data
  const blogPost = await getBlogPostBySlug(params.slug);
  if (!blogPost) {
    return {
      code: 'ITEM_NOT_FOUND',
    } as const;
  }
  const prevBlogPost = await getPrevBlogPostBySlug(params.slug);
  const nextBlogPost = await getNextBlogPostBySlug(params.slug);
  return {
    code: 'ITEM_FOUND',
    data: {
      blogPost,
      prevBlogPost,
      nextBlogPost
    }
  } as const;

};

export type PageData = Awaited<ReturnType<typeof getPageData>>;


// 3. for each item -> render seo metadata

export const generateMetadata = async (rawPageProps: RawPageProps): Promise<Metadata> => {

  const pageData = await getPageData(rawPageProps);

  if (pageData.code === 'ITEM_NOT_FOUND') {
    notFound();
  }

  return seoAppRouter({
    path: `/blog/${pageData.data.blogPost.slug}`,
    title: `${pageData.data.blogPost.title} | Blog`,
    description: pageData.data.blogPost.description,
    image: `/blog/${pageData.data.blogPost.slug}/opengraph.jpg`,
  });

};


// 3. for each item -> render page

export default async function Page(rawPageProps: RawPageProps) {

  const pageData = await getPageData(rawPageProps);

  if (pageData.code === 'ITEM_NOT_FOUND') {
    notFound();
  }

  return (
    <BlogPostView {...pageData.data} />
  );
}