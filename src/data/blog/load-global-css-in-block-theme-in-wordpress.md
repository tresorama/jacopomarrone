---
fmContentType: blog
status: published
title: Load global CSS in block theme in Wordpress
published_date: 2023-02-26T10:35:07.322Z
author: jacopo-marrone
---

## Update (2023-02-27 - 27 Feb)

There is a better solution, and simpler, to do what this guide does.  

In frontend use `wp_enqueue_style` and add dependency of css generated from `theme.json`, so your will have priority if has same css specificity.
In block editor iframe, use `add_editor_style`.

```css
/* .../wp-content/my-theme/my-custom-css.css */

.text-2xl {
  font-size: 1.5rem !important;
}

@media (max-width: 600px) {
  .mobile\:text-2xl {
    font-size: 1.5rem !important;
  }
}
```

```php
/**
 * Load custom global CSS into both block editor "iframe" and frontend
 *
 * @return void
 */
function my_theme_enqueue_custom_global_css_in_blocks() {
  
  // Add custom CSS to frontend.
  wp_enqueue_style(
    'my-custom-css',
    get_template_directory_uri() . '/my-custom-css.css'
    array( 'global-styles' ),// say to wordpress to inject this file after the css file generated from "theme.json"
  );

  // Add custom CSS to block editor "iframe".
  add_editor_style( 'my-custom-css.css' );

}
add_action( 'after_setup_theme', 'my_theme_enqueue_custom_global_css_in_blocks' );

```

Your css stylesheet does not need special treatments, it works in both contexts(block editor/site editor and  frontend).

In frontend, you just add your stylesheet after the one generated from `theme.json`, to be able to overrides without increasing css specificity.

In the block editor (and site editor) "iframe" you use the function [add_editor_style](https://developer.wordpress.org/reference/functions/add_editor_style), does exactly what this guide does manually, for the iframe part.  
The function `add_editor_style` injects a CSS file in the block editor "iframe" and adds `.editor-styles-wrapper` scoped selector to every css definition, also in media query definitions.
For example, `.text-2xl` become `.editor-styles-wrapper .text-2xl`  

Thanks to [carolinan](https://github.com/carolinan) that suggested this in this [issue](https://github.com/WordPress/gutenberg/issues/48437#issuecomment-1445262652).  

End of update.

## Guide

Goal of this guide:
Load a CSS file insde both editor and frontend.
This CSS contains classes that when applied, they must override an already present class coming from the generated CSS of `theme.json`.

This is really difficult to reason about and also extremely hacky.
Is very difficult for me to write it clearly.

I'll go step by step.

## Theme.json

This is our theme.json

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "typography": {
      "fontSizes": [
        
        {
          "slug": "base",
          "name": "base",
          "size": "1rem"
        },
        {
          "slug": "lg",
          "name": "lg",
          "size": "1.125rem"
        },
        {
          "slug": "xl",
          "name": "xl",
          "size": "1.25rem"
        },
        {
          "slug": "2xl",
          "name": "2xl",
          "size": "1.5rem"
        },
        {
          "slug": "3xl",
          "name": "3xl",
          "size": "1.875rem"
        },
        {
          "slug": "4xl",
          "name": "4xl",
          "size": "2.25rem"
        },
        {
          "slug": "5xl",
          "name": "5xl",
          "size": "3rem"
        },
        {
          "slug": "6xl",
          "name": "6xl",
          "size": "3.75rem"
        },
        {
          "slug": "7xl",
          "name": "7xl",
          "size": "4.5rem"
        }
      ]
}
```

This theme.json will be converted into CSS (by Wordpress), but the CSS for the block editor is different from the frontend one.

```css

/* Theme.json generated CSS - Editor */

.editor-styles-wrapper .has-6-xl-font-size {
    font-size: var(--wp--preset--font-size--6-xl) !important;
}
```

```css

/* Theme.json generated CSS - Frontend */

.has-6-xl-font-size {
    font-size: var(--wp--preset--font-size--6-xl) !important;
}
```

## Environments

Let’s look at `block editor` and `frontend` environments.

### Block Editor

In block editor, the live preview is inside an iframe, the UI of the editor is external to the iframe.

![Schermata 2023-02-25 alle 00.56.56.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-25_alle_00.56.56.png)

![Schermata 2023-02-26 alle 01.35.42.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_01.35.42.png)

### Frontend

In frontend, your content is not wrapped by an iframe.

![Schermata 2023-02-26 alle 01.34.24.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_01.34.24.png)

## Start

Let’s say that we change the text font-size like so

![Schermata 2023-02-26 alle 01.51.13.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_01.51.13.png)

![Schermata 2023-02-26 alle 02.02.43.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_02.02.43.png)

...but on mobile font-size is too big

![Schermata 2023-02-26 alle 01.52.21.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_01.52.21.png)

So what we want is to create a CSS file with some media query and apply them

```css
@media (max-width: 600px) {
  .mobile\:text-2xl {
    font-size: 1.5rem;
  }
}
```

So, even if the CSS is not yet injected we apply a custom CSS class to the paragraph

![Schermata 2023-02-26 alle 01.58.07.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_01.58.07.png)

Now it’s time to inject the CSS.

## Overview

1. create CSS file
2. enqueue CSS in block editor and in frontend
3. ensure that `mobile:text-2xl` overrides style from theme.json

## 1. create CSS file

NOTE: don't forget the `\` char

```css
/* .../wp-content/my-theme/my-theme-custom-css.css */

@media (max-width: 600px) {
  .mobile\:text-2xl {
    font-size: 1.5rem;
  }
}
```

## 2. Enqueue CSS in block editor and frontend

Load the CSS file in both editor and frontend

```php
// in my-theme/functions.php

function my_theme_enqueue_blocks_assets() {
  wp_enqueue_style(
    'my-theme-custom-css',
    THEME_URL . '/my-theme-custom-css.css',
  );
}
add_action('enqueue_block_assets', 'my_theme_enqueue_blocks_assets');
```

Check if dom element read correctly the css class

In Frontend we have the class

![Schermata 2023-02-26 alle 02.26.12.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_02.26.12.png)

In Block Editor we **DON’T** have the class

![Schermata 2023-02-26 alle 02.29.28.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_02.29.28.png)

Remember, the iframe ???  
Our CSS is loaded in the page, but not in the iframe that render the preview.
After 1 hours of research, i found an [issue](https://github.com/WordPress/gutenberg/issues/38673#issuecomment-1036142814) on Github that say that
”if your CSS doesn't contain `.wp-block` and .`.editor-styles-wrapper` it won't be loaded in the iframe".  
Very weird and hard to understand.

So let's edit the CSS file like so

```css
/* .../wp-content/my-theme/my-theme-custom-css.css */

.editor-styles-wrapper .dummy-enable-css-in-iframe ,
.wp-block .dummy-enable-css-in-iframe {
  color: 'red';
}

@media (max-width: 600px) {
  .mobile\:text-2xl {
    font-size: 1.5rem;
  }
}
```

Now the CSS is injected in the iframe

![Schermata 2023-02-26 alle 02.37.22.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_02.37.22.png)

## 3. ensure that `mobile:text-2xl` overrides theme.json style

Frontend

This is the fight

![Schermata 2023-02-26 alle 02.44.00.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_02.44.00.png)

First we put `!important` in our CSS...

```css
/* .../wp-content/my-theme/my-theme-custom-css.css */

.editor-styles-wrapper .dummy-enable-css-in-iframe ,
.wp-block .dummy-enable-css-in-iframe {
  color: 'red';
}

@media (max-width: 600px) {
  .mobile\:text-2xl {
    font-size: 1.5rem !important;
  }
}
```

...but is not enough.  
Maybe our custom CSS is injected before the one we want to override ??

![Schermata 2023-02-26 alle 02.55.02.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_02.55.02.png)

So we tell to Wordpress that our custom css depends on the theme.json one, so that wordpress injects the theme.json one before.

```php
// in my-theme/functions.php

function my_theme_enqueue_blocks_assets() {
  wp_enqueue_style(
    'my-theme-custom-css',
    THEME_URL . '/my-theme-custom-css.css',
    array('global-styles') // 'global-styles' is css generated from theme.json
  );
}
add_action('enqueue_block_assets', 'my_theme_enqueue_blocks_assets');
```

Great! we won the fight

![Schermata 2023-02-26 alle 03.01.36.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.01.36.png)

Let's go in the editor

What ?  
Our CSS is not there anymore!

![Schermata 2023-02-26 alle 03.11.28.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.11.28.png)

Maybe the “dependency” assets we added is not present in the editor?  
Try to remove it

```php
// in my-theme/functions.php

function my_theme_enqueue_blocks_assets() {
  wp_enqueue_style(
    'my-theme-custom-css',
    THEME_URL . '/my-theme-custom-css.css',
    // array('global-styles') // 'global-styles' is css generated from theme.json
  );
}
add_action('enqueue_block_assets', 'my_theme_enqueue_blocks_assets');
```

...we are back in business !

![Schermata 2023-02-26 alle 03.17.57.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.17.57.png)

Let's look how the theme.json css is loaded in page...

![Schermata 2023-02-26 alle 03.21.45.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.21.45.png)

Mmm, it's not a `<link>` like in the  frontend but a `<style>`, and there is no `id` that i can use to search its "handle" name in the codebase.

It's time to fight again with specificity, let's see the fight

![Schermata 2023-02-26 alle 03.25.27.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.25.27.png)

...we can’t inject `my-theme-custom-css` after `theme.json` one, se we need to be more specific in selectors to win, something like...

```css
/* .../wp-content/my-theme/my-theme-custom-css.css */

.editor-styles-wrapper .dummy-enable-css-in-iframe ,
.wp-block .dummy-enable-css-in-iframe {
  color: 'red';
}

@media (max-width: 600px) {
  body.editor-styles-wrapper .mobile\:text-2xl {
    font-size: 1.5rem !important;
  }
}
```

... and we won!!!!

![Schermata 2023-02-26 alle 03.34.30.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.34.30.png)

Let’s check in frontend...

![Schermata 2023-02-26 alle 03.36.12.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.36.12.png)

...and sadly, our classes is not there anymore.

In frontend, `body` doesn’t have `editor-styles-wrapper` class, so we must add a second scoped selector in CSS only for frontend...

```css
/* .../wp-content/my-theme/my-theme-custom-css.css */

.editor-styles-wrapper .dummy-enable-css-in-iframe ,
.wp-block .dummy-enable-css-in-iframe {
  color: 'red';
}

@media (max-width: 600px) {
  body.editor-styles-wrapper .mobile\:text-2xl,/* for editor */
  body .mobile\:text-2xl /* for frontend */ {
    font-size: 1.5rem !important;
  }
}
```

Not so nice! But...

![Schermata 2023-02-26 alle 03.41.53.png](/blog/load-global-css-in-block-theme-in-wordpress/Schermata_2023-02-26_alle_03.41.53.png)

...it worked!

## Considerations

Should be easies to inject a simple CSS.
With Javascript ??

We should know that iframe receive CSS assets only if some CSS selector are present.
This alone is big ALARM that maybe a refactor is necessary.

Inject CSS to the editor iframe should be done with a dedicated hook or similar process, and now is not present.

Core css specificity is high for an extendible system:

- in editor we must fight with a `scoped selector` and `!important`
- in frontend we must fight with `!important`

It difficult to say to wordpress when to inject our custom css relative to the theme.json one.
This lead us to increase even more the specificity of CSS selectors.

It impossible to add a medium amount of CSS without a CSS preprocessor that support nesting.

Imagine a child theme that want to overrides ?!?!?

## Resources

<https://github.com/WordPress/gutenberg/issues/48437>
<https://github.com/WordPress/gutenberg/issues/41821>
<https://github.com/WordPress/gutenberg/issues/38673#issuecomment-1036142814>
