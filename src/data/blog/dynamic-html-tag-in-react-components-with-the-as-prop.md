---
status: draft
title: Dynamic HTML Tag in React Components with the "as" prop
slug: dynamic-html-tag-in-react-components-with-the-as-prop
description: Learn how to add the "as" prop to your React Component, to add dynamic HTML tags decided by the consumer Component
featured_image: ""
published_date: 2024-08-18T13:06:58.168Z
author: jacopo-marrone
crossposted_url: ""
fmContentType: blog
---

Imagine you're building a reusable `<Section>` component with React. The Section component renders an HTML `<div>` tag because you hardcoded it.   However, in some cases, you might want to use an other tag instead, for example a `<section>` HTML tag.

This is a typical scenario when you want your HTML to be more semantic and SEO friendly.

The solution is to let the consumer decide which HTML tag should be used to render the component.  

## The "as" prop

This is nothing new.  
It's an industry standard "approach" that allows you to dynamically decide which HTML tag should be used to render the component. A lot of React Components library use it, like Chakra UI and Material UI.

Without the "as" prop, you'd need to create separate components for each use case, and it makes no sense. Don't do it!

This is how you consume the "as" prop
```tsx
import { Section } from './section';

const App = () => {
  return (
    <div>
      <Section as="section">CTA</Section>
      <Section as="article">My Article</Section>
      <Section>This use the default HTML tag of the component</Section>
    </div>
  );
};
```

And this is the component definition

```tsx
type SectionProps = {
  as?: React.ElementType,
  children: React.ReactNode,
}

export const Section = (props: SectionProps) => {

  const { as: Tag = 'div', children } = props;

  return <Tag>{children}</Tag>;

}
```

## Typescript Support for the "as" prop

React helps us with Typescript types.  
Using the typescript's `React.ElementType` type, provided by React, you will obtain autocomplete for your IDE, like this

![VS Code autocomplete suggestion for the "as" prop](/blog/dynamic-html-tag-in-react-components-with-the-as-prop/as-prop-autocomlete-ide.png)


As an alternative to `React.ElementType` you can use 
```tsx
type SectionProps = {
  as?: keyof JSX.IntrinsicElements,
  children: React.ReactNode,
}
```
or
```tsx
type SectionProps = {
  as?: keyof HTMLElementTagNameMap,
  children: React.ReactNode,
}
```
