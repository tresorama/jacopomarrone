import { BlogPost } from "./blog.schema";

/**
 * A BlogPost Datasource is an already configured client 
 * that fetch `BlogPost` from a datasource.
 */
export type BlogPostDatasource = {
  getAllBlogPost: () => Promise<BlogPost[]>,
  getBlogPostBySlug: (slug: string) => Promise<BlogPost | null>,
};