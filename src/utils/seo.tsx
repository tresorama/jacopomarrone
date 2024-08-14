import Head from 'next/head';
import { BASE_URL } from '@/constants/shared';

type SeoProps = {
  /** The url segments of the current page, without the host url.  
   * Home => `/`   
   * Blog => `/blog` 
   * 
   * NOTE: the intial slash is required.
   * */
  path: string;
  /** Will be used in the <title> , <meta name="title"> and <meta property="og:title"> */
  title?: string;
  /** Will be used in the <meta name="description"> and <meta property="og:description"> */
  description?: string;
};

export const Seo = ({ path, title, description }: SeoProps) => {

  const finalData = {
    url: path ? `${BASE_URL}${path}` : BASE_URL,
    title: title ? `${title} | Jacopo Marrone - Web Developer, Italy` : 'Jacopo Marrone - Web Developer, Italy',
    description: description ? description : 'Give your business a boost with a new Website or a Tailor Made sodtaware or app that reduce your errors and time consumed on repeating tasks. Contact me and talk about your project!'
  };

  return (
    <Head>
      {/* <!-- Primary Meta Tags --> */}
      <title>{finalData.title}</title>
      <meta name="title" content={finalData.title} />
      <meta name="description" content={finalData.description} />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalData.url} />
      <meta property="og:title" content={finalData.title} />
      <meta property="og:description" content={finalData.description} />
      <meta property="og:image" content={`${BASE_URL}/images/seo/seo-jacopo-marrone.png`} />
      <meta property="og:image:width" content="1048" />
      <meta property="og:image:height" content="526" />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalData.url} />
      <meta property="twitter:title" content={finalData.title} />
      <meta property="twitter:description" content={finalData.description} />
      <meta property="twitter:image" content={`${BASE_URL}/images/seo/seo-jacopo-marrone.png`} />
    </Head>
  );
};