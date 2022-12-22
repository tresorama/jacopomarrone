# How to use constants

From a react-view-components, like:

- `pages/index.tsx`
- `pages/about.tsx`
- `views/NavBottomBar/NavBottomBar.tsx`

```tsx
import { IS_DEVELOPMENT, IS_PRODUCTION, IS_STAGING } from 'constants/client';
```

From a api-route-controller, like:

- `pages/api/hello.tsx`
- `pages/api/hello.tsx`
- `backend/paypal/server/authenticated-http-client.tsx`

```tsx
import { PAYPAL_API_SECRET, IS_DEVELOPMENT, IS_PRODUCTION } from 'constants/sever';
```

## Why client and server ?

Constant are consumed by :

- `client` code, react components in `src/views` and default export of `src/pages/**.tsx`
- `server` code, api routes controllers in `src/pages/api` and any additinal code you will put in a `src/backed` dir.

To avoid bugs and error , `constants/server.ts` can be imported only from not client code.
In case you import `constants/server.ts` from client code an error will thrown.  
Sometimes happen that you don't think to have imported `constant/server.ts` in your client code,  
but the error shows anyway.  
This means that one of your import internally imports `constants/server.ts`, so follow the import tree and fix it.  

## Common scenario that trigger error difficult to grasp

Problem:

```bash
# tree
lib/paypal
|_ index.ts
|_ client
   |_ react-comp-one.tsx
   |_ react-comp-two.tsx
|_ server
   |_ paypal-client-with-secret.tsx

# lib/paypal/index.ts
export * from './server/';
export * from './client/';
```

You create a `lib/paypal` to condense here all code related to you paypal integrations.  
You put here code consumed by api-route-controllers and some react-views-components.
Inside your code consumed by api-route-controllers you import `constants/server.ts`, maybe for using secrets.  
Then (**CRUCIAL PART**), in the root of `lib/paypal` you create an `index.ts` to export everything.  
This is **WRONG**, because when you import that `lib/paypal/index.ts` from a react-views-components,  
even if you don't use it directly, an import to `constants/server.ts` is made, with error threw as consequence.  

Solution:
Remove `lib/paypal/index.ts`, and import directly from sub-dir :

```tsx
// from react-views-components (pages/index.tsx)
import {PayPalComp_One} from '.../lib/paypal/client';

// from api-route-controllers (pages/api/...)
import {PayPal_ClientWithSecret} from '.../lib/paypal/server';
```
