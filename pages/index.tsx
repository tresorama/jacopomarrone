import type { NextPage } from 'next';
import Head from 'next/head';
import ViewHome from '@/views/Home/Home';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <Seo />
      </Head>
      <ViewHome />
    </>
  )
}

export default Home;


const Seo = () => (
  <>
    {/* <!-- Primary Meta Tags --> */}
    <title>Jacopo Marrone - Web Developer, Italy</title>
    <meta name="title" content="Jacopo Marrone - Web Developer, Italy" />
    <meta name="description" content="Give your business a boost with a custom website or by reaching new customers on Google Search. Let's talk about your project!" />

    {/* <!-- Open Graph / Facebook --> */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://jacopomarrone.netlify.app/" />
    <meta property="og:title" content="Jacopo Marrone - Web Developer, Italy" />
    <meta property="og:description" content="Give your business a boost with a custom website or by reaching new customers on Google Search. Let's talk about your project!" />
    <meta property="og:image" content="https://jacopomarrone.netlify.app/images/seo/seo-jacopo-marrone.png" />
    <meta property="og:image:width" content="1048" />
    <meta property="og:image:height" content="526" />

    {/* <!-- Twitter --> */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://jacopomarrone.netlify.app/" />
    <meta property="twitter:title" content="Jacopo Marrone - Web Developer, Italy" />
    <meta property="twitter:description" content="Give your business a boost with a custom website or by reaching new customers on Google Search. Let's talk about your project!" />
    <meta property="twitter:image" content="https://jacopomarrone.netlify.app/images/seo/seo-jacopo-marrone.png" />
  </>
);
