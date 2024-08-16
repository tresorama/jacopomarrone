import { readdirSync, readFileSync } from "fs";
import matter from 'gray-matter';
import type { CollectionDB } from "./create-collection";
import { compileMarkdownToHTMLString } from "./utils.markdown";
import { capitalize } from "./utils.string";

export const createDb_Flatfile = ({
  dirPath,
}: {
  /** Absolute path of the directory containing the markdown files.  
   * @example `path.resolve(__dirname,"./src/contents/posts")` */
  dirPath: string,
}) => {

  // Utils for working with disk

  const getAllFileNames = () => readdirSync(dirPath).map(filename => filename.replace('.md', ''));
  const getFileByFileName = (slug: string) => readFileSync(`${dirPath}/${slug}.md`);

  // Private API
  const convertFileToItem = async (file: Buffer) => {
    const metadata = matter(file.toString());
    const markdownAsString = metadata.content;
    const contentAsHTMLString = await compileMarkdownToHTMLString(markdownAsString);
    const item = {
      // custom fields
      ...metadata.data,
      // required fields
      slug: (metadata.data.slug) as string,
      title: (metadata.data.title) as string,
      contentAsHTMLString,
    };
    return item;
  };

  type Item = Awaited<ReturnType<typeof convertFileToItem>>;

  // Public api

  const flatFileDB: CollectionDB = {
    getAll: async () => {
      const filenames = getAllFileNames();
      const items: Item[] = [];
      for (const filename of filenames) {
        const file = getFileByFileName(filename);
        const item = await convertFileToItem(file);
        items.push(item);
      }
      return items;
    },
    getOneBySlug: async (slug) => {
      const items = await flatFileDB.getAll();
      const item = items.find(i => i.slug === slug);
      if (!item) return null;
      return item;
    }
  };

  return flatFileDB;
};