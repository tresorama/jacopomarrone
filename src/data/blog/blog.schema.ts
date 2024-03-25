import { z } from "zod";
import { Logger } from "./utils/utils.logger";

const blogPostSchema = z.object({
  /** Thrse fields are required! Don't edit unless you know what you are doing */
  slug: z.string(),
  title: z.string(),
  contentAsHTMLString: z.string(),
}).extend({
  /* Add here your front-matter markdown custom fields */
  status: z.enum(["published", "draft"]),
  published_date: z.string().datetime(),
  author: z.string(),
  crossposted_url: z.string().optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

// Validation
export const validateBlogPostOrThrow = (blogPostToValidate: unknown) => {
  // parse and if no error return the parsed data
  const parsed = blogPostSchema.safeParse(blogPostToValidate);
  if (parsed.success) return parsed.data;

  // build a human readable error and throw
  const parsedSlug = z.object({ slug: z.string() }).safeParse(blogPostToValidate);
  const slug = parsedSlug.success ? parsedSlug.data.slug : 'No Slug';

  const logger = new Logger("BlogPost Not Valid");
  const errorMessage = logger.error(
    "BlogPost slug: " + slug,
    "Some attributes of the blogpost are not valid, usually means that blogpost frontmatter has something wrong.",
    parsed.error,
  );
  throw new Error(errorMessage);
};