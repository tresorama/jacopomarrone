import { z } from "zod";
import { Logger } from "./utils.logger";

// schema

const baseSchema = z.object({
  /** Thrse fields are required! Don't edit unless you know what you are doing */
  slug: z.string(),
  title: z.string(),
  contentAsHTMLString: z.string(),
});
type BaseSchema = typeof baseSchema;

const createValidateItemOrThrow = <ItemSchema extends z.ZodTypeAny>(zodSchema: ItemSchema) => {
  return (rawItem: unknown) => {
    // parse and if no error return the parsed data
    const parsed = zodSchema.safeParse(rawItem);
    if (parsed.success) return parsed.data as z.infer<ItemSchema>;

    // build a human readable error and throw
    const parsedSlug = z.object({ slug: z.string() }).safeParse(rawItem);
    const slug = parsedSlug.success ? parsedSlug.data.slug : 'No Slug';

    const logger = new Logger("BlogPost Not Valid");
    const errorMessage = logger.error(
      "slug: " + slug,
      "Some attributes of the blogpost are not valid, usually means that blogpost frontmatter has something wrong.",
      parsed.error,
    );
    throw new Error(errorMessage);
  };
};

// db

export type CollectionDB = {
  getAll: () => Promise<z.infer<BaseSchema>[]>,
  getOneBySlug: (slug: string) => Promise<z.infer<BaseSchema> | null>,
};


// collection

type CollectionInitOptions<ItemSchema extends z.ZodTypeAny> = {
  slug: string,
  db: CollectionDB,
  schema: (_baseSchema: BaseSchema) => ItemSchema,
};

export function createCollection<ItemSchema extends z.ZodTypeAny>(
  options: CollectionInitOptions<ItemSchema>
) {
  const { slug, db, schema } = options;

  // build the final zod schema for the "item"
  // by merging base schema (that has required fields) 
  // with user defined schema
  // NOTE: is the user that need to "extends" the base schema
  // and maybe add "transform" or other "refine"s
  const fullSchema = schema(baseSchema);
  type FullSchema = z.infer<typeof fullSchema>;

  // create validation function that check if zodSchema is respected
  const validateItemOrThrow = createValidateItemOrThrow(fullSchema);

  // return the api
  return {
    fullSchema,
    getAllSlugs: async (): Promise<FullSchema['slug'][]> => {
      const itemsRaw = await db.getAll();
      const items = itemsRaw.map(i => validateItemOrThrow(i));
      return items.map(i => i.slug);
    },
    getAll: async (): Promise<FullSchema[]> => {
      const itemsRaw = await db.getAll();
      const items = itemsRaw.map(i => validateItemOrThrow(i));
      return items;
    },
    getOneBySlug: async (slug: FullSchema['slug']): Promise<FullSchema | null> => {
      const itemRaw = await db.getOneBySlug(slug);
      if (!itemRaw) return null;
      const item = validateItemOrThrow(itemRaw);
      return item;
    },

  };
}
