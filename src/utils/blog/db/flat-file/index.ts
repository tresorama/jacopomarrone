import { readdirSync, readFileSync } from "fs";
import path from "path";
import matter from 'gray-matter';
import { BlogPost, validateBlogPostOrThrow } from "@/utils/blog/blog.schema";
import { compileMarkdownToHTMLString } from "@/utils/blog/utils/utils.markdown";
import { capitalize } from "@/utils/blog/utils/utils.string";
import { sortByDateDescending } from "@/utils/blog/utils/utils.sort";

export { type BlogPost };

// Utils for working with disk
const getBlogDirPath = () => path.resolve(process.cwd(), "./src/blog-contents");
const getAllBlogPostFileNames = () => readdirSync(getBlogDirPath()).map(filename => filename.replace('.md', ''));
const getBlogPostFileBySlug = (slug: string) => readFileSync(`${getBlogDirPath()}/${slug}.md`);

// Utils that should not be exposed as API
const getAllBlogPostSlugs = () => getAllBlogPostFileNames();

// Public API for this datasource
export const flatFileDB = {
  getAllBlogPost: async () => {
    const slugs = getAllBlogPostSlugs();
    const blogPosts: BlogPost[] = [];
    for (const slug of slugs) {
      const blogPost = await flatFileDB.getBlogPostBySlug(slug);
      if (!blogPost) continue;
      blogPosts.push(blogPost);
    }
    return blogPosts.sort((a, b) => sortByDateDescending(a.date, b.date));
  },
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const file = getBlogPostFileBySlug(slug);
    const metadata = matter(file.toString());
    const markdownAsString = metadata.content;
    const contentAsHTMLString = compileMarkdownToHTMLString(markdownAsString);
    const blogPost: BlogPost = {
      // required fields
      slug,
      title: metadata.data.title ?? capitalize(slug.replaceAll('-', ' ')),
      contentAsHTMLString,
      // custom fields
      date: metadata.data.date,
      author: {
        name: metadata.data.author.name
      },
      crossposted_url: metadata.data.crossposted_url ?? null,
    };
    validateBlogPostOrThrow(blogPost);
    return blogPost;
  }
};