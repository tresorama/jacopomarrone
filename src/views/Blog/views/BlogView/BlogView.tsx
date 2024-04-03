import { PageProps } from "@/pages/blog/index";
import Link from "next/link";
import { ArrowLeft } from "@/views/shared/components/icons";
import { AppShell } from "../shared/components/AppShell";
import { IS_DEVELOPMENT } from "@/constants/shared";

const formatDate = (date: Date | string) => new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: '2-digit' });

export const BlogView = ({ blogPostsWithLink }: PageProps) => {

  // in "production" and "staging" shows only "published" posts
  // in "dev" shows all posts
  const posts = IS_DEVELOPMENT ? blogPostsWithLink : blogPostsWithLink.filter(p => p.status === 'published');

  return (
    <AppShell>

      <nav className="pointer-events-none absolute left-0 top-0 z-10 py-8 px-6 lg:px-16 w-full flex items-center justify-between text-zinc-700">
        <Link href="/?skip-intro-animation=true" passHref>
          <a className="text-preset-h3 pointer-events-auto inline-flex items-center">
            <ArrowLeft />
            <span className="text-[0.5em] mt-[0.15em] ml-[-0.15em]">Home</span>
          </a>
        </Link>
        <h1 className="text-preset-h4">Blog</h1>
      </nav>

      <div className='w-full min-h-full grid grid-rows-[minmax(0,1fr)_auto] bg-gradient-base'>
        <main className="pt-28 pb-12 px-8 lg:pt-40 lg:px-16">
          <ul className='space-y-8'>
            {posts.map(({ url, title, published_date }) => (
              <li key={url}>
                <article className="relative flex flex-col">
                  <time className='text-sm font-normal text-gray-500' dateTime={published_date}>{formatDate(published_date)}</time>
                  <h2 className='text-4xl font-normal underline'>{title}</h2>
                  <Link href={url} passHref>
                    <a className="absolute inset-0" aria-label={title} />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </main>
      </div>

    </AppShell>
  );
};