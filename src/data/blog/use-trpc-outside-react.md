---
type: blog
status: published
title: Use tRPC outside React
published_date: 2022-10-10T20:35:07.322Z
author: jacopo-marrone
crossposted_url: https://dev.to/tresorama/use-trpc-outside-react-d1o
---

> “[...] The code easiest to maintain is the code that was never written.”
>
> -- <cite>Benjamin Franklin</cite>

If you agree, you should try tRPC.

## tRPC

[tRPC](https://trpc.io/) is a library that drastically reduce amount of code you need to write to have a fully typed API Layer.

tRPC can be used with many framework, but a common duo is tRPC and Next.js.

If you write backend code in Next.js projects and use Typescript, give a try to **tRPC**, because it **will make you fly**.

## Typcal tRPC usage pattern with Next.js

**Server side**, you create a tRPC router and expose it in a Next.js API route.  

**Client side**, you create a React Hooks that can invoke tRPC router procedures.
Then consume the hook in your React Components, in a React Query similar fashion.

## But, i need to call tRPC outside React

Many reasons can dictates this:  

- You want to call the procedure NOT from a React Component
- Your views implement a cache layer (stored in client), so only if cache is empty you submit the HTTP request
- You use Axios and React Query but you are not ready to replace all React Query hooks with tRPC.useQuery, but you want to replace Axios
- You know ...

In my case i've a cache layer on localStorage and i want only to replace my Axios invocations.

**tRPC vanilla client** comes into play.

## tRPC Vanilla Client

Like Axios is a HTTP client, tRPC Vanilla Client is  client used to communicate to tRPC procedures from Vanilla js.

tRPC Vanilla Client let you call your `tRPC procedures` in the same way as `trpc.<procedure-name>.useQuery` does.  
But unlike `trpc.<procedure-name>.useQuery` does, you are not limited to use inside React Components/Hooks.
You can call it whenever you can call a function that returns a Promise.

Here is how you can replace Axios with it.

```tsx

// Before
import axios from 'axios';

async function submitFormToServer(formValues: FormValues) {
  console.log('submittin form to server ...');
   try {
    // compose the request DTO
    const dto = {
      title: formValues.title,
      content: formValues.content,
    };
    // submit HTTP request to API Layer
    const response = await axios.post('api/post', dto);

    // parse request result
    if (response.status === 200) {
      console.log('success');
      return { success: true };
    }
    
    throw new Error(); // falltrough catch
  
  } catch (error) {
    console.error('error:', error);
    return { success: false }
  }
}


const Page = () => {
  const handleSubmit = async () => {
    const formValues = ....;
    const {success} = await submitFormToServer(formValues);
    ...
  }
  return <form onSubmit={handleSubmit}>...</form> 
}
```

```tsx

// After
import {trpcVanilla} from '../utils/trpc';

async function submitFormToServer(formValues: FormValues) {
  console.log('submittin form to server ...');
   try {
    // submit HTTP request to tRPC API Layer
     await trpcVanilla.createPost.mutate({
      title: formValues.title,
      content: formValues.content,
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}




const Page = () => {
  const handleSubmit = async () => {
    const formValues = ....;
    const {success} = await submitFormToServer(formValues);
    ...
  }
  return <form onSubmit={handleSubmit}>...</form> 
}
```

## How to create tRPC Vanilla Client

[View Documentation](https://trpc.io/docs/v10/vanilla)

Example  

```ts
// in /utils/trpc.ts

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '...path to your tRPC router';

export const trpcVanilla = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:3000/api/trpc`,
    }),
  ],
});
```

## Conclusion

I write articles mainly to help future myself or to help the growth of tools I use in my work.

If this article was helpful to you leave a like.

Would you like me to talk about a particular topic ?  
Tell me in the comments !
