import type { NextPage } from 'next';
import { HomeView } from '@/views/Home';
import { Seo } from '@/utils/seo';

const Home: NextPage = () => (
  <>
    <Seo path='/' />
    <HomeView />
  </>
);

export default Home;


