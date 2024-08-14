// These CSS is used on all pages
import "@/styles/fonts/stylesheet.css";
import "@/views/_components/icons/global.icons.styles.css";
import "@/styles/global.css";
// Tailwind is used in /blog pages
import "@/styles/global.tailwind.css";
// SASS is used in / (home) page
import "@/styles/scss/style.scss";
import type { AppProps } from 'next/app';
import { GoogleTagManagerHead } from "@/integrations/GTM/client";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleTagManagerHead />
      <Component {...pageProps} />
    </>
  );
}
