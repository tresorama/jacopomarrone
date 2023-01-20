import "@/styles/global.tailwind.css";
import "@/styles/fonts/stylesheet.css";
import "@/styles/scss/style.scss";
import "@/views/shared/components/icons/global.icons.styles.css";
import "@/styles/global.css";
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
