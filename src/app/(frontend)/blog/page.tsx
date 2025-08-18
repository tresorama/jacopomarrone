import type { Metadata } from "next";

import { seoAppRouter } from "@/utils/seo";
import { getAllBlogPosts } from "@/data/blog";
import { BlogView } from "@/views/Blog/BlogView";

export const metadata: Metadata = seoAppRouter({
  path: '/blog',
  title: 'Blog',
  description: 'A Blog about coding and web development, with articles about React, Next.js, Wordpress and more'
});

const getData = async () => {
  const blogPosts = await getAllBlogPosts();
  return { blogPosts };
};

export type PageData = Awaited<ReturnType<typeof getData>>;

export default async function Page() {
  const pageData = await getData();

  return (
    <BlogView {...pageData} />
  );
}
