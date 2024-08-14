---
fmContentType: blog
status: published
title: Disable Wordpress Rest API Users route for better security
description: Reduce risk of bruteforce attack by hiding Users information that Wordpress expose publicly by default via Rest API
featured_image: ""
published_date: 2024-08-14T00:31:51.017Z
author: jacopo-marrone
crossposted_url: ""
---
WordPress is a popular content management system - CMS - that provides a user-friendly interface for managing websites. However, by default, **WordPress exposes sensitive user information** publicly via its REST API.

For instance, the `wp/v2/users` endpoint exposes the `username` field of every user.

## What can an attacker do by knowing the username?

This can increase the risk of bruteforce attacks, where attackers try to guess user credentials by repeatedly attempting different combinations.

Usually, the attacker tries randomly and repeatedly different combinations of username and password.

But if the attacker knows the usernames of your users, he can improve his attack by reducing the number of combinations and keeping the username stable - because he knows that an existing user with that username exists—and then try to guess the password.

## When do you need wp/v2/users to be publicly available? And when you don't?

If your website is deployed with a headless approach using frameworks like Next.js, Nuxt, SvelteKit or Astro, you probably need this Rest API publicly available to let your framework get data during build.

But if your website uses the traditional WP monolith approach - like the majority of Wordpress websites out there - you probably don't need it. In this case, you can disable the REST API for user endpoints and improve security.

## Disable the REST API user endpoints

This can be done by adding the following code to your website:

```php
add_filter('rest_endpoints', function ($endpoints) {

  // Remove `/wp/v2/users` endpoints
  // Common endpoints are :
  //   - `/wp/v2/users`
  //   - `/wp/v2/users/{id}`
  //   - `/wp/v2/users/{id}/{meta_key}`
  //   - `/wp/v2/users/me`

  $disallowed = [
    '/wp/v2/users',
    '/wp/v2/users/(?P<id>[\d]+)',
    '/wp/v2/users/(?P<id>[\d]+)/(?P<meta_key>[\w-]+)',
    '/wp/v2/users/me',
  ];

  foreach ($disallowed as $name) {
    if (isset($endpoints[$name])) {
      unset($endpoints[$name]);
    }
  }

  return $endpoints;
});
```

This code removes some `/wp/v2/users` endpoints from the list of allowed REST API endpoints. Other endpoints are still allowed, mainly endpoints for generating application passwords programmatically.

Remember to test your changes thoroughly before deploying them to production.
