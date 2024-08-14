// Learn more:
// https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager
import Script from "next/script";
import { IS_DEVELOPMENT, NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID } from "@/constants/client";

const GTM_ID = NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || "GTM-XXXXXXX";

export const GoogleTagManagerHead = () => {
  if (IS_DEVELOPMENT) return null; // only in production
  return (
    <>
      {/* Google Tag Manager - Head - Start */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
    `}
      </Script>
      {/* Google Tag Manager - Head - End */}
    </>
  );
};
export const GoogleTagManagerBody = () => {
  if (IS_DEVELOPMENT) return null; // only in production
  return (
    <>
      {/* Google Tag Manager - Body - Start */}
      <noscript dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
      }} />
      {/* Google Tag Manager - Body - End */}
    </>
  );
};