import React, { useEffect } from 'react';
import { HomeGrid } from './components/HomeGrid';
import { ContactMe } from './components/ContactMe';
import { Works } from './components/Works';
import { Footer } from './components/Footer';
import { useRouter } from 'next/router';

export const HomeView = () => {
  const router = useRouter();
  const [isVisibleWorks, setIsVisibleWorks] = React.useState(false);
  const [isVisibleContactMe, setIsVisibleContactMe] = React.useState(false);
  useEffect(() => {
    if (router.query["initial-is-visible-works"] === 'true') setIsVisibleWorks(true);
  }, [router.query]);
  React.useEffect(() => {
    // Add classes, CSS need this
    document.querySelector('#__next')?.classList.add('home');
  }, []);

  return (
    <>
      <HomeGrid
        onWorksClick={() => setIsVisibleWorks(true)}
        onContactMeClick={() => setIsVisibleContactMe(true)}
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
    </>
  );
};