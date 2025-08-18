# Jacopo Marrone Portfolio Website

[Visit the Website](https://jacopomarrone.netlify.app/)

## Structure / Stack

- *Language*: Typescript
- *CSS*: 
  - SASS + BEM (In / page)
  - Tailwind (in /blog pages)
  - Why 2? The project started with SASS and without a blog section. Then i added the blog and Tailwind was my go to at that point. One day (I hope) I will remove SASS and use Tailwind exclusively.
- *UI*: Next.js (App Router) + React
- *Animation*: GSAP
- *Form*:
  - *State*: react-hook-form
  - *Validation*: zod
  - *Mail Service*: Gmail
- *Analytics*: Google Tag Manager
- *Test*: Vitest
- *Data*:
  - *CMS*: Frontmatter CMS (VS Code extension) 
  - *Data*: Flatfile (JSON + Markdown)
  - *Data Reader*: Custom "Collection" API that reads Markdown files
- *SEO*: 
  - *Metadata*: Next.js Metadata API + custom function
  - *Open Graph Images*: Custom script that generates images based on frontmatter
  - *Sitemap*: Next.js Sitemap
- *Deploy*: Netlify

## Resources

- [Online grammar checkers](https://quillbot.com/grammar-check)

## Important Choiches

- **2024-08-14**: The generation of OpenGraph images uses `puppeteer` under the hood. This means that during `npm install` a browser of 170MB+ will be downloaded. In the deploy server - that do not need to generate images becasue are already generated - the build will not complete because of this. I fixed the "build" by creating a separate node package in `root-dir/scripts` and moving code here. In this way the build will not need to download the browser.

## Key Parts

- Intro animation is a [GSAP Flip](https://greensock.com/docs/v3/Plugins/Flip/) animation with CSS Grid.[code](https://github.com/tresorama/jacopomarrone/blob/main/views/Home/animations/HomeGridAnimation.ts)
- Form submit result (success or failure) events trigger Google Tag Manager custom events.[code](https://github.com/tresorama/jacopomarrone/blob/f7feb0b1ac283effeb87f2338d94d7a158abfdaa/views/Home/components/ContactMe.tsx#L112)

## How to run


### Development

```bash
# do it only once
npm i
cp .env.dev.local.example .env.dev.local

# do it every time
npm run dev

```

### Production Simulated

```bash
# do it only once
npm i
cp .env.prod-simulate.local.example .env.prod-simulate.local

# do it every time
npm run prod-simulate:build
npm run prod-simulate:start
```

## How to deploy

Go to Netlify, and follow the instructions to deploy a next.js app.  
When it's time to customize the deploy, use thees:
- **Build Command**: `npm run prod:build`
- **Start Command**: `npm run prod:start`
- **Env Variables**: look at `.env.prod-simulate.local`