import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/data/blog';
import { BASE_URL } from '@/constants/shared';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const posts = await getAllBlogPosts();

  const allPages: MetadataRoute.Sitemap = [
    `/`,
    `/blog`,
    ...posts.filter(p => p.status === 'published').map(p => `/blog/${p.slug}`),
  ].map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));
  return allPages;

  // return [
  //   {
  //     url: 'https://acme.com',
  //     lastModified: new Date(),
  //     changeFrequency: 'yearly',
  //     priority: 1,
  //   },
  //   {
  //     url: 'https://acme.com/about',
  //     lastModified: new Date(),
  //     changeFrequency: 'monthly',
  //     priority: 0.8,
  //   },
  //   {
  //     url: 'https://acme.com/blog',
  //     lastModified: new Date(),
  //     changeFrequency: 'weekly',
  //     priority: 0.5,
  //   },
  // ]
}