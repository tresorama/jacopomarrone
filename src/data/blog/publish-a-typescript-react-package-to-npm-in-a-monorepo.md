---
fmContentType: blog
status: published
title: Publish a Typescript React library to NPM in a monorepo
published_date: 2023-01-21T07:35:07.322Z
author: jacopo-marrone
crossposted_url: https://dev.to/tresorama/publish-a-typescript-react-library-to-npm-in-a-monorepo-1ah1
---

In this blog post we create a small React library and publish it to NPM.  
We'll go through all steps required to do that.  
Let's begin.  

## Overview

The library we will publish (`package` from now on) is written in Typescript, bundled with `tsup`, versioned and published with `changeset`.  

To test the package we create one example app with `Next.js` and one with `Vite`.  
To better manage these three apps (our package + Next.js demo + Vite demo) we store everything in a monorepo, using `turborepo`.

### The Package

It will be named `use-last-visit-date` and will contain a React hook used to:
> *Retrieve date of last visit, that was previously saved to localStorage.*

## Tutorial

### 1. Create a monorepo

This guide will not cover how a monorepo works, if this concept is new to you can read a little about it to get the idea.  

If you want to skip that, you should know that for this guide i opted to monorepo only to be able to have the package itself and demo apps in the same codebase.  
Otherwise i should have created 3 separate repo.

Let's go!

#### Setup

Tool used: `turborepo`, `pnpm`  
To create a new monorepo, use `create-turbo` and follow the prompt.

> **NOTE:**  
> If you don'have `pnpm` installed you can install it following [installation guide](https://pnpm.io/installation)  
> You can also use `yarn` or `npm` if you want.

```bash
# create a monorepo
npx create-turbo@latest

# answers
? Where would you like to create your turborepo? ./use-last-visit-date
? Which package manager do you want to use? pnpm
```

Turborepo will init the monorepo and print

```bash
>>> Created a new turborepo with the following:

 - apps/web: Next.js with TypeScript
 - apps/docs: Next.js with TypeScript
 - packages/ui: Shared React component library
 - packages/eslint-config-custom: Shared configuration (ESLint)
 - packages/tsconfig: Shared TypeScript `tsconfig.json`

>>> Success! Created a new Turborepo at "use-last-visit-date".
```

#### Good to know

`turborepo` expose an executable `turbo` that can fire a script in each workspace with a specific name.  
For instance, running `turbo build`  from root of monorepo will execute `build` script in every workspace.  
If a workspace hasn't a `build` script, that workspace will be ignored.  

In which order they are executed ?

`turbo.json` is the file where this configuration takes place.  
Default setting will be enough for this guide, but i encourage you to read [documentation](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks) later on.

#### Clean up

1. Rename root `package.json` `name` to "root-monorepo" to avoid collision with package we are going to create.

2. Delete `apps/docs` directory, we'll not use it

### 2. Create package workspace

To create our package run :

```bash
# go to root of the monorepo
cd ./use-last-visit-date

# create package directory
mkdir packages/use-last-visit-date
cd pacakges/use-last-visit-date

# init the package with pnpm
pnpm init

# install needed dev dependencies
pnpm add -D react react-dom @types/react @types/react-dom
```

#### Add tsconfig

We are using typescript so we need a `tsconfig` file.

Fortunately, `turborepo` already created a shared tsconfig internal package for us.  
Inside there are various configuraion ready to be extended.  
This is one of the beauties of using a tool like `turborepo`.

Add `tsconfig` as a dev dependency

```diff
# in packages/use-last-visit-date/package.json

"devDependencies": {
+  "tsconfig": "workspace:*",
}
```

Reinstall dependencies in whole monorepo

```bash
pnpm install
```

Create a `tsconfig.json` in `packages/use-last-visit-date` with this content

```json
{
  "extends": "tsconfig/base.json",
  "include": ["."],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}

```

#### Write code

Create the file which will contain our code

```bash
# run this from packages/use-last-visit-date
touch ./index.ts
```

and fill with

```ts
import { useEffect, useState } from 'react';

const storage = {
  key: 'last-visit-date',
  save: (value: string) => window.localStorage.setItem(storage.key, value),
  retrieve: () => window.localStorage.getItem(storage.key) ?? null,
}

export const useLastVisitDate = () => {
  const [lastVisitDate, setLastVisitDate] = useState<null | string>(null);

  // On page load retrieve the last visit date if exists
  useEffect(() => {
    const value = storage.retrieve();
    setLastVisitDate(value);
  }, []);

  // On page close save current date
  useEffect(() => {
    const handler = () => {
      const currentDate = new Date().toISOString();
      storage.save(currentDate);
    }
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    }
  }, []);

  return lastVisitDate;
}
```

Then update which file will be exported by opening `packages/use-last-visit-date/package.json` and

```diff
- "main": "index.js",
+ "main": "./index.ts",
```

It's time to test our code in a real react app.

### 3. Create demo app workspace - Next

`turborepo` has already created a Next.js app in `apps/web` so there is no need to do it.

Because later on we will create also a Vite app, let's add a better name to this Next.js app.  
Rename `apps/web` dir to `apps/next` and update `apps/next/package.json` :

```diff
- "name": "web",
+ "name": "next",
```

Then consume the `useLastVisitDate` hook in `pages/index.tsx`

```tsx
const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleString();
};

export default function Page() {
  const lastVisitDate = useLastVisitDate();

  return (
    <div>
      <h1>
        {lastVisitDate === null && "Hello, it's first time you visit us !"}
        {lastVisitDate && `Last Visit: ${formatDate(lastVisitDate)}`}
      </h1>
    </div>
  );
}
```

But this will throw an error because `useLastVisitDate` is not defined, and it's correct because we haven't imported it yet.  

Before we can import it we must add the `use-last-visit-date` to dependencies of `apps/next`.  
So update `apps/next/package.json`:

```diff
"dependencies": {
-  "ui": "workspace:*"
+  "use-last-visit-date": "workspace:*"
}
```

and tell pnpm to "refresh" monorepo dependencies by running

```bash
# is not important from "where" you run this command
pnpm install
```

Now you can import the hook in `pages/index.tsx`

```tsx
// Add at the top
import { useLastVisitDate } from 'use-last-visit-date';
```

and errors should disappears.  
> **NOTE:**  
> If this is not happening, try Restarting TS server in your code editor.  

Now it's time to test if it's working.  

```bash
# run this from apps/next
pnpm dev
```

And open <http://localhost:3000>.

You should see

```
Hello, it's first time you visit us !
```

Then refresh the page and text should be changed to

```
Last Visit: ......
```

### 4. Create demo app workspace - Vite

Move with shell to root of monorepo and

```bash
# go to apps dir
cd apps

# create a vite workspace
pnpm create vite vite-react --template react-ts

# install dependencies
pnpm install

```

Then consume the `useLastVisitDate` hook in `src/App.tsx`

```tsx
const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleString();
};

export default function Page() {
  const lastVisitDate = useLastVisitDate();

  return (
    <div>
      <h1>
        {lastVisitDate === null && "Hello, it's first time you visit us !"}
        {lastVisitDate && `Last Visit: ${formatDate(lastVisitDate)}`}
      </h1>
    </div>
  );
}
```

But this will throw an error because `useLastVisitDate` is not defined, and it's correct because we haven't imported it yet.  

Before we can import it we must add the `use-last-visit-date` to dependencies of `apps/vite-react`.  
So update `apps/vite-react/package.json`:

```diff
"dependencies": {
  ...other-deps,
+  "use-last-visit-date": "workspace:*"
}
```

and tell pnpm to "refresh" monorepo dependencies by running

```bash
# is not important from "where" you run this command
pnpm install
```

Now you can import the hook in `src/App.tsx`

```tsx
// Add at the top
import { useLastVisitDate } from 'use-last-visit-date';
```

and errors should disappears.  
> **NOTE:**  
> If this is not happening, try Restarting TS server in your code editor.  

Now it's time to test if it's working.  

```bash
# run this from apps/vite-react
pnpm dev
```

And open <http://localhost:5173>.

You should see

```
Hello, it's first time you visit us !
```

Then refresh the page and text should be changed to

```
Last Visit: ......
```

### 5. Time to publish

#### Overview

Now, `use-last-visit-date` is an internal packages, it's written in Typescript and it works because Next.js app and Vite app take care of compiling the code to js.  
But our code should run also if these assumptions are not in place.  

We need to compile to js.  
Then we can publish to NPM.  

To recap, publish a package to NPM consists of two steps:

- Bundle and compile source code to `commonjs`, so who install our packge will be able to import it
- Set up a dev script for local development.
- Publish to NPM
  - Control versioning
  - Control publishing

#### Bundle and Compile

Tools used: `tsup`

First, go with shell to `packages/use-last-visit-date` and

```bash
# install tsup as dev dependency
pnpm add -D tsup

# create a src dir
mkdir src

# move index.ts to src dir
mv index.ts src/index.ts
```

Then add a script to `packages.json` in `packages/use-last-visit-date`

```diff
{
  "scripts": {
+   "build": "tsup src/index.ts --format cjs --dts"
  }
}
```

This script,will use `tsup` to bundle and compile our code, and outputs files to the `dist` directory.  
Because of that, you should:

- add `dist` to your `.gitignore` at root of monorepo to avoid push it when `git push`ing.
- update `package.json` `main` property, so who install this packages will use the bundled+compiled version of code.

```diff
# in packages/use-last-visit-date/package.json

- "main": "./index.ts",
+ "main": "./dist/index.js",
+ "types": "./dist/index.d.js",
```

Because this package is a react package, while developing we need `react` and `react-dom` installed as dev dependencies.  
But we don't want to inject the whole `react` code inside our package when it's bundled and compiled.  

What we want is to let consumer of package install it.  
So, add peer dependencies to `package.json` in `packages/use-last-visit-date`

```diff
+  "peerDependencies": {
+      "react": ">=18.2.0",
+      "react-dom": ">=18.2.0"
+  },
```

#### Set up workflow for local development

Before adding `tsup`, apps inside `apps` directory was importing directly the source code file (with .ts extension).  
So, when we updated the source code file, our `apps` received the updates.  

Now we added a compile step in between, so we need to trigger a new `build` every time we update source code.  

To do that, update `package.json` in `packages/use-last-visit-date`

```diff
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs --dts"
+   "dev": "pnpm run build --watch"
  }
}
```

From now on, while developing, we'll use `dev` script.  

Let's test a complete local development workflow.  
Go to root of monorepo with shell and run

```bash
pnpm dev
```

This will trigger `dev` script of every workspace that has a `dev` script, in our case:

- `packages/use-last-visit-date`
- `apps/next`, available at <http://localhost:3000>
- `apps/vite-react`, available at <http://localhost:5173>

Try to change something in `use-last-visit-date` code and watch updates.  

#### Publish to NPM

Every time you update source code, you want that this changes will be published as a new version.  
You want also a place where to condense description of changes linked to every new version.  

You can do it manually, but is very tedious and error prone.
Better to use a tool created for this.

This is when `changeset` enter the pitch.

##### Configure changeset

From root of the monorepo

```bash
# install changeset
pnpm add -w @changesets/cli

# setup
pnpm changeset init
```

##### Create 1.0.0 version

Set `version` to `0.0.1` in `packages/use-last-visit-date/package.json`

```json
"version": "0.0.1"
```

Then use the versionig tool of `changeset`

```bash
# run this from root monorepo
pnpm changeset

# a prompt start

? Which packages would you like to include?
# select "use-last-visit-date" with arrows and space
# then press enter

? Which packages should have a major bump?
# select "use-last-visit-date" with arrows and space
# then press enter

? Are you sure you want to release the first major version of use-last-visit-date?
# confirm it

Please enter a summary for this change (this will be in the changelogs).
# write a description
# like "First release"
# then press enter

?Is this your desired changeset?
# confirm it

# bump version number
# running
pnpm changeset version
```

Now `version` should be `1.0.0`.

##### Publish

Before publish check that every packages in your monorepo that **MUST NOT** be published has

```json
"private": true
```

in its `package.json`.  
This prevent them to be published to NPM.

Then update `./.changeset/config.json`

```diff
- "access": "restricted",
+ "access": "public",
```

And....
Finally...
We can publish our package

```bash
pnpm changeset publish
```

Done!

## Conclusion

I write articles mainly to help future myself or to help the growth of tools I use in my work.

If this article was helpful to you leave a like.

Would you like me to talk about a particular topic ?

Tell me in the comments !
