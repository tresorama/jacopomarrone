
[Visit the Website](https://jacopomarrone.netlify.app/)

## Structure / Stack

- Language: Typescript
- CSS: 
  - SASS + BEM (In / page)
  - Tailwind (in /blog pages)
  - Why 2? The project started with SASS and without a blog section. Then i added the blog and Tailwind was my go to at that point. One day (I hope) I will remove SASS and use Tailwind exclusively.
- UI: Next.js (Pages Router) + React
- Animation: GSAP
- Form :
  - State: react-hook-form
  - Validation: yup
  - Mail Service: Gmail
- Analytics: Google Tag Manager
- Test: Vitest
- Data:
  - CMS: Frontmatter CMS (VS Code extension) 
  - Data: Flatfile (JSON + Markdown)
  - Data Reader: Custom "Collection" API that reads Markdown files
- SEO: 
  - Metadata: Custom React Component
  - Open Graph Images: Custom script that generates images based on frontmatter
  - Sitemap: Next.js Sitemap (App Router)
- Deploy: Netlify

## Resources

- [Online grammar checkers](https://quillbot.com/grammar-check)

## Important Choiches

- **2024-08-14**: The generation of OpenGraph images uses `puppeteer` under the hood. This means that during `npm install` a browser of 170MB+ will be downloaded. In the deploy server - that do not need to generate images becasue are already generated - the build will not complete because of this. I fixed the "build" by creating a separate node package in `root-dir/scripts` and moving code here. In this way the build will not need to download the browser.

## Key Parts

- Intro animation is a [GSAP Flip](https://greensock.com/docs/v3/Plugins/Flip/) animation with CSS Grid.[code](https://github.com/tresorama/jacopomarrone/blob/main/views/Home/animations/HomeGridAnimation.ts)
- Form submit result (success or failure) events trigger Google Tag Manager custom events.[code](https://github.com/tresorama/jacopomarrone/blob/f7feb0b1ac283effeb87f2338d94d7a158abfdaa/views/Home/components/ContactMe.tsx#L112)

## Next.js README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
