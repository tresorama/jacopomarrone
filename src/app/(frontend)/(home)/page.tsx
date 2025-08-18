import type { Metadata } from 'next';

import { seoAppRouter } from '@/utils/seo';
import { HomeView } from '@/views/Home/HomeView';

export const metadata: Metadata = seoAppRouter({
  path: '/',
});

export default function Home() {
  return (
    <HomeView />
  );
}

