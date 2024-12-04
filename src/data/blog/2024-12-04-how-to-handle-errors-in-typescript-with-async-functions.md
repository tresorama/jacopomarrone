---
status: published
title: How to handle errors in Typescript with async functions
slug: how-to-handle-errors-in-typescript-with-async-functions
description: How to handle errors in Typescript using a custom utility function that force you to handle error
featured_image: ""
published_date: 2024-12-04T15:51:52.414Z
author: jacopo-marrone
crossposted_url: ""
fmContentType: blog
---

<!-- # Raw

- try catch async function def
- parseerror def
- example -->


## Introduction

<!-- Apart from some exceptions, like `tanstack-query`, in Typescript land, error handling is not something that we, as ecosystem, treat as a thing we should care about from the beginning of a project.  
It's common, unfortunately, for npm library, to have little to non existent documentation on how to handle errors.  
Often, as a consumer of the library, we don't even know if a function can throw or not.

We should definitely do better. -->

In the TypeScript ecosystem, unfortunately, error handling is often overlooked.

It's common to find npm libraries with little to no guidance on handling errors. As consumers, often, we don't even know if a function can throw or not.

The reason is that, as we know, it's hard, tedious and unreadable handling errors in Typescript.

This is far from ideal, and we can—and should—do better.

Of course, there are some notable exceptions, like `tanstack-query`.


## Future is bright

In recent times, famous influencer in the TS world started speaking about this problem.  
I have a presentiment that, in the near future, we begin to see that every major npm library will start to document how to handle errors.  
And, after an initial period, also small library maintainers will start to document it as well.


## How do we usually handle errors?

We use try catch.

```ts

async function doSomething() {
  // this code can have errors throwed
}

async function main() {
  
  try {
    // call our function
    await doSomething(); 
  } catch (error) {
      // handle error
  }

}
```

This is ok, but it's tedious for several reasons:
- in a short time we pollute our codebase with a lot of these try catch blocks
- inside catch block, `error` is always `unknown`
- the type signature of `doSomething` does not explicitly state that it can throw an error

## What to do right now?

Now the better thing you can do is to handle it manually.  
Let's begin.

We start by creating an utility function that we use every time we need to call an async function.

```ts
// define utility function

type TryCatchAsyncFunction = <SuccessValue>(fn: () => Promise<SuccessValue>) => Promise<
 | { ok: true, data: SuccessValue }
 | { ok: false, error: unknown }
>

const tryCatchAsync: TryCatchAsyncFunction = async (fn) => {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error };
  }
}

// example of usage

async function fetchSomething() {
  type Todo = {
    id: number,
    title: string,
    completed: boolean,
  }

  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  if (!res.ok) {
    throw new Error('Todo has a problem');
  }
  const todo = await res.json() as Todo;
  return todo;
}

async function main() {
  const response = await tryCatchAsync(fetchSomething);
  if (response.ok) {
    const todo = response.data;
    console.log(todo);
  }
  else {
    const error = response.error;
    console.error(error);
  }
}
```

With this code, the fetch can fail for whatever reason and we always catch the error.
The big benefit of `tryCatchAsync` is that, because of how it's implemented, to be able to access the success value we must write an if statement.

```ts
const response = await tryCatchAsync(fetchSomething);

// here `response.data` is `SuccessValue | undefined`

if (response.ok) {
  // here `response.data` is `SuccessValue`
}
else {
  // here `response.data` is `undefined`
}

```
This obligate us to be aware that an error can happen, and force us to check for it.
The key part of the implementation is the discriminated union on `ok` property.
Typescript narrows the `data` type only if `ok` is true.

## But we don't know anything about the error

You are right.
Error can be optimized.

You can be creative with you version of `tryCatchAsync`, based on your needs.  
Here is what you can do in a simple codebase:

```ts

// assuming you have an API for creating a logger
import { type Logger } from '@/utils/logger';

/** 
 * Parse information from Error, or SubType of Error.  
 * If the error is not an instance of Error, it returns a default error */
const parseError = (error: unknown) => {
  if (error instanceof Error) {
    const name = error.name;
    const message = error.message;
    const cause = error.cause;
    const stack = error.stack;
    return { name, message, cause, stack };
  }
   return {
    name: 'UnknownError',
    message: 'Unknown error',
    cause: 'Unknown error',
    stack: null
   }
}

/**
 * Print always the same structure of an error
 * */
const printError = (error: unknown, logger: Logger) => {
  const parsedError = parseError(error);
  logger.error('Error Name:', error.name);
  logger.error('Error Message:', error.message);
  logger.error('Error Cause:', error.cause);
  if (process.env.NODE_ENV === 'development') {
    logger.error('Error Stack:', error.stack);
  }
}


// here we edit the signature of the bad path
type TryCatchAsyncFunction = <SuccessValue>(fn: () => Promise<SuccessValue>) => Promise<
 | { 
      ok: true, 
      data: SuccessValue 
   }
 | { 
      ok: false, 
      error: {
        original: unknown,
        parse: () => ReturnType<typeof parseError>,
        print: (logger: Logger) => ReturnType<typeof printError>,
      }
    }
>

// here we edit the implementation of the bad path
const tryCatchAsync: TryCatchAsyncFunction = async (fn) => {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: {
        original: error,
        parse: () => parseError(error),
        print: (logger:Logger) => printError(error, logger)
      }
    }
  }
  
}

// consumer

// example of subtype of Error

class TodoProblem extends Error { name='DuplicateDbItemError' }


async function fetchSomething() {
  type Todo = {
    id: number,
    title: string,
    completed: boolean,
  }
  
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  if (!res.ok) {
    throw new TodoProblem('Todo has a problem');
  }
  const todo = await res.json() as Todo;
  return todo;
}

async function main() {
  
  // create a logger
  const logger = // ...

  // run the code
  const response = await tryCatchAsync(fetchSomething);

  // happy path
  if (response.ok) {
    const todo = response.data;
    logger.info('Success');
  }
  // bad path
  else {
    const error = response.error;
    
    // print error
    error.print(logger);

    // or throw it
    throw error.original;

    // or parse it
    const parsedError = error.parse();
    logger.error(parsedError.name);

  }
}
```

## Conclusion

This is not a silver bullet, but only a simple way to handle errors in async functions.

There are some npm library that solve this exact problem.
An example is `ts-result`, that states that their inspiration is Rust.

I never used Rust or Go, but I read that the way these languages handle error is very convenient, compared to Typescript.  
I think that we, Typescript developers, should take a look at them and try to learn from it.

Thanks for reading till the end!  
See you next time!
