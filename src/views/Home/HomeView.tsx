import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { HomeGrid } from './components/HomeGrid';
import { ContactMe } from './components/ContactMe';
import { Works } from './components/Works';
import { Footer } from './components/Footer';
import { usePageExitAnimation } from './hooks/use-page-exit-animation';

export const HomeView = () => {
  const router = useRouter();
  const [isVisibleWorks, setIsVisibleWorks] = useState(false);
  const [isVisibleContactMe, setIsVisibleContactMe] = useState(false);
  const BlogPageExitAnimation = usePageExitAnimation({
    onAnimationEnd: () => router.push('/blog')
  });
  useEffect(() => {
    if (router.query["initial-is-visible-works"] === 'true') setIsVisibleWorks(true);
  }, [router.query]);
  useEffect(() => {
    // Add classes, CSS need this
    document.querySelector('#__next')?.classList.add('home');
  }, []);

  return (
    <>
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