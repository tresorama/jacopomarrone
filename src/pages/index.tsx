import type { NextPage } from 'next';
import { Seo } from '@/utils/seo';
import { HomeView } from '@/views/home/HomeView';

const Home: NextPage = () => (
  <>
    <Seo path='/' />
    <HomeView />
  </>
);

export default Home;


