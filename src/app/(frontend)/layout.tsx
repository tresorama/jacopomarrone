// import type { Metadata } from "next";

// These CSS is used on all pages
import "@/components/styles/fonts/stylesheet.css";
import "@/components/views/_components/icons/global.icons.styles.css";
import "@/components/styles/global.css";
// Tailwind is used in /blog pages
import "@/components/styles/global.tailwind.css";
// SASS is used in / (home) page
import "@/components/styles/scss/style.scss";
import { GoogleTagManagerBody, GoogleTagManagerHead } from "@/lib/integrations/GTM/client";

// seo metadata

// export const metadata: Metadata = {
//   title: { default: "Home · tresorama/shadcn-registry", template: "%s · tresorama/shadcn-registry" },
//   description: "Typescript utilities served as a shadcn registry!",
// };

// main comp

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <head>
        <GoogleTagManagerHead />
      </head>
      <body
        className={`antialiased`}
      >
        <GoogleTagManagerBody />
        {children}
      </body>
    </html>
  );
}