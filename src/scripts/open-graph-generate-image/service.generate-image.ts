import * as fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import nodeHtmlToImage from 'node-html-to-image';

const getFilePathFromHere = (relativePath: string) => path.resolve(__dirname, relativePath);
const getHandlebarsTemplate = (template: 1 | 2) => fs.readFileSync(getFilePathFromHere(`./image-template.${template}.hbs`), 'utf-8');

type HandlebarTemplateProps = {
  bgColor: string,
  textColor: string,
  title: string,
  accentHeading?: string,
  brandTitle?: string,
  excerpt?: string;
};

export const generateOpenGraphImage = async ({ title, excerpt }: {
  title: HandlebarTemplateProps['title'],
  excerpt: HandlebarTemplateProps['excerpt'],
}) => {

  const handlebarsTemplate = getHandlebarsTemplate(2);
  const html = handlebars.compile(handlebarsTemplate)({
    bgColor: "#999",
    textColor: "black",
    title,
    brandTitle: "jacopomarrone.com",
    excerpt,
  } satisfies HandlebarTemplateProps);


  const aspectRatio = 16 / 9;
  const image = await nodeHtmlToImage({
    html: `<html><body>${html}</body></html>`,
    puppeteerArgs: {
      defaultViewport: {
        width: 1600,
        height: (1 / aspectRatio) * 1600
      }
    }
  });

  return Buffer.from(image);

};

