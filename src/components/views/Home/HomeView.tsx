'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { HomeGrid } from './components/HomeGrid';
import { ContactMe } from './components/ContactMe';
import { Works } from './components/Works';
import { Footer } from './components/Footer';
import { usePageExitAnimation } from './hooks/use-page-exit-animation';

export const HomeView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisibleWorks, setIsVisibleWorks] = useState(false);
  const [isVisibleContactMe, setIsVisibleContactMe] = useState(false);
  const BlogPageExitAnimation = usePageExitAnimation({
    onAnimationEnd: () => router.push('/blog')
  });
  useEffect(() => {
    if (searchParams?.get("initial-is-visible-works") === 'true') setIsVisibleWorks(true);
    if (searchParams?.get("initial-is-visible-contact-me") === 'true') setIsVisibleContactMe(true);
  }, [searchParams]);
  useEffect(() => {
    // Add classes, CSS need this
    document.querySelector('#__next')?.classList.add('home');
  }, []);

  return (
    <>
      <div className="sr-only">
        <h1>Jacopo Marrone</h1>
        <p>Web Developer and Digital Consultant in Italy, Reggio Emilia. Websites, Webapps, Software, Spreadsheets and Tailor-made digital solution. Enhance your business today!</p>
      </div>
      <HomeGrid
        onWorksClick={() => setIsVisibleWorks(true)}
        onContactMeClick={() => setIsVisibleContactMe(true)}
        onBlogClick={() => BlogPageExitAnimation.startAnimation()}
      />
      <Works
        isVisible={isVisibleWorks}
        onCloseClick={() => setIsVisibleWorks(false)}
      />
      <ContactMe
        isVisible={isVisibleContactMe}
        onCloseClick={() => setIsVisibleContactMe(false)}
      />
      <Footer />
      <BlogPageExitAnimation.Component />
    </>
  );
};