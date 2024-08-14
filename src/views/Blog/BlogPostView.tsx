import Link from "next/link";
import { PageProps } from "@/pages/blog/[slug]";
import 'highlight.js/styles/github-dark-dimmed.css'; //This is the theme your code is going to be displayed with.
import { AppShell } from "./components/AppShell";
import { HeaderBar } from "./components/HeaderBar";
import { IS_DEVELOPMENT } from "@/constants/shared";

const formatDate = (date: Date | string) => {
  const locale = IS_DEVELOPMENT ? 'en-US' : undefined;// prevent mismatch server/client
  return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: '2-digit' });
};

export const BlogPostView = ({ blogPost, prevBlogPost, nextBlogPost }: PageProps) => (
  <AppShell>

    <HeaderBar>
      <HeaderBar.BackButton href={"/blog"}>All Posts</HeaderBar.BackButton>
    </HeaderBar>

    <main className='min-h-full grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] bg-gradient-base'>
      <article className="pt-24 pb-10 px-8 w-full max-w-3xl mx-auto md:pt-32">
        <header className="space-y-4">
          <h1 className="text-preset-huge">{blogPost.title}</h1>
          <div>
            <address className="opacity-80 text-xs">{blogPost.author}</address>
            {blogPost.published_date && (
              <time className="opacity-60 text-xs" dateTime={blogPost.published_date}>{formatDate(blogPost.published_date)}</time>
            )}
          </div>
        </header>
        <div
          className="mt-12 lg:mt-16 blogpost-prose"
          dangerouslySetInnerHTML={{ __html: blogPost.contentAsHTMLString }}
        />
        {blogPost.crossposted_url && (
          <section className="blogpost-prose py-4 px-4 bg-zinc-200">
            Looking for comments?
            <br />
            This post is cross-posted <a href={blogPost.crossposted_url}>here</a>, where you will find comments.
          </section>
        )}
      </article>
      <nav className="pt-48 pb-12 px-8 w-full max-w-3xl mx-auto flex flex-wrap gap-12">
        {nextBlogPost && (
          <div className="max-w-[18ch] text-3xl leading-none text-left">
            <span className="mb-2 block text-sm font-light">Older Post</span>
            <Link href={nextBlogPost.url}>{nextBlogPost.title}</Link>
          </div>
        )}
        {prevBlogPost && (
          <div className="ml-auto max-w-[18ch] text-3xl leading-none text-right">
            <span className="mb-2 block text-sm font-light">Newer Post</span>
            <Link href={prevBlogPost.url}>{prevBlogPost.title}</Link>
          </div>
        )}
      </nav>
    </main>

  </AppShell>
);