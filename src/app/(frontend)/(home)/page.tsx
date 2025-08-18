import type { Metadata } from 'next';

import { seoAppRouter } from '@/lib/utils/seo';
import { HomeView } from '@/components/views/Home/HomeView';
import { Suspense } from 'react';

export const metadata: Metadata = seoAppRouter({
  path: '/',
});

export default function Home() {
  return (
    <Suspense>
      <HomeView />
    </Suspense>
  );
}

