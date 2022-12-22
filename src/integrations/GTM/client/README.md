CONSIDER IMPLEMENT THIS FOR MORE BIGGER PROJECTS:
https://github.com/sahava/datalayer-typescript

Look at index.ts to seee what is exported.

Demo - Nextjs
```tsx
// pages/_documents.tsx
import { Html, Head, Main, NextScript } from 'next/document';
import { GoogleTagManagerBody } from '@/integrations/GTM';

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
  )
}


// pages/_app.tsx
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

```
