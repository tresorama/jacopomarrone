// import type { Metadata } from "next";

// These CSS is used on all pages
import "@/styles/fonts/stylesheet.css";
import "@/views/_components/icons/global.icons.styles.css";
import "@/styles/global.css";
// Tailwind is used in /blog pages
import "@/styles/global.tailwind.css";
// SASS is used in / (home) page
import "@/styles/scss/style.scss";
import { GoogleTagManagerBody, GoogleTagManagerHead } from "@/integrations/GTM/client";

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