// Here we test the API for getting post data
// Using vitest
import { expect, test } from 'vitest';
import { getAllBlogPosts, getAllBlogPostSlugs, getBlogPostBySlug } from './blog';

// demo
const sum = (a: number, b: number) => a + b;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});


// real

test('read all blog posts', async () => {
  const posts = await getAllBlogPosts();
  // console.log({ posts });
  expect(posts.length).toBeGreaterThan(0);
  expect(posts[0]).toHaveProperty('title');
  expect(posts[0]).toHaveProperty('slug');
});

test('read one blog post knowing its slug', async () => {
  const posts = await getAllBlogPosts();
  const postSlug = posts[0].slug;
  const post = await getBlogPostBySlug(postSlug);
  expect(post).toHaveProperty('title');
  expect(post).toHaveProperty('slug');
});
