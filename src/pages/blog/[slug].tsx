import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { type BlogPost, getAllBlogPostSlugs, getBlogPostBySlug, getNextBlogPostBySlug, getPrevBlogPostBySlug } from "@/data/blog";
import { BlogPostView } from "@/views/Blog/BlogPostView";
import { Seo } from "@/utils/seo";

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

export type PageProps = {
  blogPost: BlogPost;
  prevBlogPost: BlogPost | null,
  nextBlogPost: BlogPost | null,
};

export const getStaticProps: GetStaticProps<PageProps, PathParams> = async ({ params }) => {
  // handle case when params are not available
  if (!params) return { notFound: true };

  // params are available
  const { slug } = params;
  const blogPost = await getBlogPostBySlug(slug);
  if (!blogPost) return { notFound: true };

  const prevBlogPost = await getPrevBlogPostBySlug(slug);
  const nextBlogPost = await getNextBlogPostBySlug(slug);

  return {
    props: { blogPost, prevBlogPost, nextBlogPost },
  };
};


const Page: NextPage<PageProps> = (pageProps) => (
  <>
    <Seo
      path={`/blog/${pageProps.blogPost.slug}`}
      title={`${pageProps.blogPost.title} | Blog`}
      description={pageProps.blogPost.description}
    />
    <BlogPostView {...pageProps} />
  </>
);

export default Page;  