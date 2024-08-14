import type { NextPage } from 'next';
import { Seo } from '@/utils/seo';
import { HomeView } from '@/views/Home/HomeView';

const Home: NextPage = () => (
  <>
    <Seo path='/' />
    <HomeView />
  </>
);

export default Home;


