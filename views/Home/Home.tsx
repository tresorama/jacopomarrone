import React from 'react'
import { HomeGrid } from './components/HomeGrid';
import { ContactMe } from './components/ContactMe';
import { Works } from './components/Works';
import { Footer } from './components/Footer';


export default function Home() {
  const [isVisibleWorks, setIsVisibleWorks] = React.useState(false);
  const [isVisibleContactMe, setIsVisibleContactMe] = React.useState(false);
  React.useEffect(() => { document.querySelector('#__next')?.classList.add('home') }, []);

  return (
    <>
      <HomeGrid
        onWorksClick={() => setIsVisibleWorks(true)}
        onContactMeClick={() => setIsVisibleContactMe(true)}
      />
      <Works
        isVisible={isVisibleWorks}
        setIsVisible={setIsVisibleWorks}
      />
      <ContactMe
        isVisible={isVisibleContactMe}
        setIsVisible={setIsVisibleContactMe}
      />
      <Footer />
    </>
  );
}