import { PageProps } from "@/pages/blog/index";
import Link from "next/link";
import { ArrowLeft } from "../../../shared/components/icons";
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
        <div className="text-preset-h4"><span>Blog</span></div>
      </nav>

      <div className='w-full min-h-full grid grid-rows-[minmax(0,1fr)_auto] bg-gradient-base'>
        <main className="pt-40 pb-12 px-8 lg:px-16">
          {/* <h1 className="pt-6 pb-14 text-4xl font-extralight text-gray-700">Blog with Tailwind</h1> */}
          <ul className='space-y-8'>
            {posts.map(({ url, title, published_date }) => (
              <li key={url}>
                <Link href={url} passHref>
                  <a className="flex flex-col">
                    <span className='text-sm font-normal text-gray-500'>{formatDate(published_date)}</span>
                    <span className='text-4xl font-normal underline'>{title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </div>

    </AppShell>
  );
};