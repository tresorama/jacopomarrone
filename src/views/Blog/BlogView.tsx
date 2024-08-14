import { PageProps } from "@/pages/blog/index";
import Link from "next/link";
import { AppShell } from "./shared/components/AppShell";
import { IS_DEVELOPMENT } from "@/constants/shared";
import { HeaderBar } from "./shared/components/HeaderBar";

const formatDate = (date: Date | string) => {
  const locale = IS_DEVELOPMENT ? 'en-US' : undefined;// prevent mismatch server/client
  return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: '2-digit' });
};

export const BlogView = ({ blogPosts }: PageProps) => {

  // in "production" and "staging" shows only "published" posts
  // in "dev" shows all posts
  const posts = IS_DEVELOPMENT ? blogPosts : blogPosts.filter(p => p.status === 'published');

  return (
    <AppShell>

      <HeaderBar>
        <HeaderBar.BackButton href={"/?skip-intro-animation=true"}>Home</HeaderBar.BackButton>
        <HeaderBar.Title as="h1">Blog</HeaderBar.Title>
      </HeaderBar>

      <div className='w-full min-h-full grid grid-rows-[minmax(0,1fr)_auto] bg-gradient-base'>
        <main className="pt-28 pb-12 px-8 lg:pt-40 lg:px-16">
          <ul className='space-y-8'>
            {posts.map(({ url, title, published_date }) => (
              <li key={url}>
                <article className="relative flex flex-col">
                  {published_date && (
                    <time className='text-sm font-medium text-gray-500' dateTime={published_date}>{formatDate(published_date)}</time>
                  )}
                  <h2 className='text-3xl md:text-4xl underline'>{title}</h2>
                  <Link href={url} className="absolute inset-0" aria-label={title} />
                </article>
              </li>
            ))}
          </ul>
        </main>
      </div>

    </AppShell>
  );
};