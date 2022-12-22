import React from 'react';
import { HomeGrid } from './components/HomeGrid';
import { ContactMe } from './components/ContactMe';
import { Works } from './components/Works';
import { Footer } from './components/Footer';


export const HomeView = () => {
  const [isVisibleWorks, setIsVisibleWorks] = React.useState(false);
  const [isVisibleContactMe, setIsVisibleContactMe] = React.useState(false);
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