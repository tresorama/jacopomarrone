import * as fs from 'fs';
import path from 'path';
import { BlogPost, getAllBlogPosts } from "../../data/blog";
import { generateOpenGraphImage } from './service.generate-image';

// Utility - Disk
const getFilePathFromHere = (relativePath: string) => path.resolve(__dirname, relativePath);

// Class
class BlogPostImageGenerator {
  blogPost: BlogPost;
  constructor(blogPost: BlogPost) {
    this.blogPost = blogPost;
  }

  async generateAndSave() {
    // generate image
    const image = await generateOpenGraphImage({
      title: this.blogPost.title,
      excerpt: this.blogPost.description,
    });
    // write to disk
    this.saveToDisk(image);
  }

  hasExistingImage() {
    try {
      const slug = this.blogPost.slug;
      const image = fs.readFileSync(getFilePathFromHere(`../../public/blog/${slug}/opengraph.jpg`));
      if (image) return true;
      return false;
    } catch (error) {
      return false;
    }
  }

  saveToDisk(image: Buffer) {
    const { slug } = this.blogPost;
    // ensure the dir exist
    fs.mkdirSync(getFilePathFromHere(`../../../public/blog/${slug}`), { recursive: true });
    // write to disk
    fs.writeFileSync(getFilePathFromHere(`../../../public/blog/${slug}/opengraph.jpg`), image);
  }
}

// Main
async function run() {
  for (const blogPost of await getAllBlogPosts()) {
    const blogPostImageGenerator = new BlogPostImageGenerator(blogPost);
    // if (blogPostImageGenerator.hasExistingImage()) continue;
    await blogPostImageGenerator.generateAndSave();
  }
}



(async () => {
  try {
    console.log('Initializing ...!');
    // Code here 
    await run();
    console.log('Success!');
    process.exit(0);
  } catch (error) {
    console.log('Error!');
    console.error(error);
    process.exit(1);
  }
})();