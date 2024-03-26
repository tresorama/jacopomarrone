import Link from "next/link";
import { PageProps } from "@/pages/blog/[slug]";
import 'highlight.js/styles/github-dark-dimmed.css'; //This is the theme your code is going to be displayed with.
import { ArrowLeft } from "@/views/shared/components/icons";
import { AppShell } from "../shared/components/AppShell";

const formatDate = (date: Date | string) => new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: '2-digit' });

export const BlogPostView = ({ blogPost, prevBlogPostWithLink, nextBlogPostWithLink }: PageProps) => (
  <AppShell>

    <nav className="pointer-events-none absolute left-0 top-0 z-10 py-8 px-6 lg:px-16 w-full flex items-center justify-between text-zinc-700">
      <Link href="/blog" passHref>
        <a className="text-preset-h3 pointer-events-auto inline-flex items-center">
          <ArrowLeft />
          <span className="text-[0.5em] mt-[0.15em] ml-[-0.15em]">All Posts</span>
        </a>
      </Link>
    </nav>

    <main className='min-h-full grid grid-rows-[minmax(0,1fr)_auto_auto] bg-gradient-base'>
      <article className="pt-24 pb-10 px-8 w-full max-w-3xl mx-auto md:pt-32">
        <header className="space-y-4">
          <h1 className="text-preset-huge tracking-normal">{blogPost.title}</h1>
          <div>
            <address className="opacity-80 text-xs">{blogPost.author}</address>
            <time className="opacity-60 text-xs" dateTime={blogPost.published_date}>{formatDate(blogPost.published_date)}</time>
          </div>
        </header>
        <div
          className="mt-12 md:mt-24 blogpost-prose"
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
        {nextBlogPostWithLink && (
          <div className="max-w-[18ch] text-3xl text-left">
            <span className="block text-sm font-light">Older Post</span>
            <Link href={nextBlogPostWithLink.url} passHref>
              <a>{nextBlogPostWithLink.title}</a>
            </Link>
          </div>
        )}
        {prevBlogPostWithLink && (
          <div className="ml-auto max-w-[18ch] text-3xl text-right">
            <span className="block text-sm font-light">Newer Post</span>
            <Link href={prevBlogPostWithLink.url} passHref>
              <a>{prevBlogPostWithLink.title}</a>
            </Link>
          </div>
        )}
      </nav>
    </main>

  </AppShell>
);