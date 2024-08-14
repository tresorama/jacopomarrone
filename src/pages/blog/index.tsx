import { GetStaticProps, NextPage } from "next";
import { type BlogPost, getAllBlogPosts } from "@/data/blog";
import { Seo } from "@/utils/seo";
import { BlogView } from "@/views/Blog/BlogView";

export type PageProps = {
  blogPosts: BlogPost[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const blogPosts = await getAllBlogPosts();
  return {
    props: { blogPosts }
  };
};


const Page: NextPage<PageProps> = (pageProps) => (
  <>
    <Seo
      path="/blog"
      title="Blog"
      description="A Blog about coding and web development, with articles about React, Next.js, Wordpress and more"
    />
    <BlogView {...pageProps} />
  </>
);


export default Page;  