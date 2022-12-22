import { Html, Head, Main, NextScript } from 'next/document';
import { GoogleTagManagerBody } from '@/integrations/GTM/client';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <GoogleTagManagerBody />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}