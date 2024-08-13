import Head from "next/head";
import { GetStaticProps, NextPage } from "next";
import { type BlogPost, getAllBlogPosts } from "@/data/blog";
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
    <Head>
      <title>Blog</title>
    </Head>
    <BlogView {...pageProps} />
  </>
);


export default Page;  