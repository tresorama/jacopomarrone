import "@/styles/fonts/stylesheet.css";
import "@/views/components/icons/global.icons.styles.css";
import "@/styles/global.css";
import "@/styles/scss/style.scss";
import type { AppProps } from 'next/app';
import { GoogleTagManagerHead } from "@/integrations/GTM";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleTagManagerHead />
      <Component {...pageProps} />
    </>
  );
};
