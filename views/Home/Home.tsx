import React from 'react'
import { HomeGrid } from './components/HomeGrid';
import { ContactMe } from './components/ContactMe';
import { Works } from './components/Works';
import { Footer } from './components/Footer';
import { Work } from '@/contents/works.types';

type Props = {
  works: Work[]
}
export default function Home({ works = [] }: Props) {
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
        works={works}
      />
      <ContactMe
        isVisible={isVisibleContactMe}
        setIsVisible={setIsVisibleContactMe}
      />
      <Footer />
    </>
  );
}