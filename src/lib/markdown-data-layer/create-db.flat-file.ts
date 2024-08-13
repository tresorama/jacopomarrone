import { readdirSync, readFileSync } from "fs";
import path from "path";
import matter from 'gray-matter';
import type { CollectionDB } from "./create-collection";
import { compileMarkdownToHTMLString } from "./utils.markdown";
import { capitalize } from "./utils.string";

export const createDb_Flatfile = ({
  dirPath,
}: {
  dirPath: string,
}) => {

  // Utils for working with disk
  const getDirPath = () => path.resolve(process.cwd(), dirPath);
  const getAllItemsFileNames = () => readdirSync(getDirPath()).map(filename => filename.replace('.md', ''));
  const getItemFileBySlug = (slug: string) => readFileSync(`${getDirPath()}/${slug}.md`);

  // Utils that should not be exposed as API
  const getAllBlogPostSlugs = () => getAllItemsFileNames();

  // api

  const flatFileDB: CollectionDB = {
    getAll: async () => {
      const slugs = getAllBlogPostSlugs();
      const items = [];
      for (const slug of slugs) {
        const item = await flatFileDB.getOneBySlug(slug);
        if (!item) continue;
        items.push(item);
      }
      return items;
    },
    getOneBySlug: async (slug) => {
      const file = getItemFileBySlug(slug);
      const metadata = matter(file.toString());
      const markdownAsString = metadata.content;
      const contentAsHTMLString = compileMarkdownToHTMLString(markdownAsString);
      const item = {
        // custom fields
        ...metadata.data,
        // required fields
        slug,
        title: metadata.data.title ?? capitalize(slug.replaceAll('-', ' ')),
        contentAsHTMLString,
      };
      return item;
    }
  };

  return flatFileDB;
};