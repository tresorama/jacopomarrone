import Head from "next/head";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { BlogPost, getAllBlogPostSlugs, getBlogPostBySlug, getNextBlogPostBySlug, getPrevBlogPostBySlug } from "@/utils/blog";
import { BlogPostView } from "@/views/Blog/views/BlogPostView/BlogPostView";

type PathParams = {
  slug: BlogPost['slug'];
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const slugs = await getAllBlogPostSlugs();
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

type BlogPostWithLink = BlogPost & { url: string; };
export type PageProps = {
  blogPost: BlogPost;
  prevBlogPostWithLink: BlogPostWithLink | null,
  nextBlogPostWithLink: BlogPostWithLink | null,
};

export const getStaticProps: GetStaticProps<PageProps, PathParams> = async ({ params }) => {
  const { slug } = params!;
  const blogPost = await getBlogPostBySlug(slug);
  if (!blogPost) return { notFound: true };

  const prevBlogPost = await getPrevBlogPostBySlug(slug);
  const prevBlogPostWithLink: null | BlogPostWithLink = prevBlogPost
    ? { ...prevBlogPost, url: `/blog/${prevBlogPost.slug}` }
    : null;
  const nextBlogPost = await getNextBlogPostBySlug(slug);
  const nextBlogPostWithLink: null | BlogPostWithLink = nextBlogPost
    ? { ...nextBlogPost, url: `/blog/${nextBlogPost.slug}` }
    : null;

  return {
    props: { blogPost, prevBlogPostWithLink, nextBlogPostWithLink },
  };
};


const Page: NextPage<PageProps> = (pageProps) => (
  <>
    <Head>
      <title>{`${pageProps.blogPost.title} - Blog`}</title>
    </Head>
    <BlogPostView {...pageProps} />
  </>
);

export default Page;  