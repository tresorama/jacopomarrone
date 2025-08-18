import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
// NOTE: remember to include the highlight.js css theme, 
// In Next.js you should include it in "_app.tsx" or in the component file

// TODO: optimize highlight js by use a white list of allowed languages
// and ignore others, so no need to import extra stuff
// @see https://highlightjs.org/usage/ "ES6 Modules / import"


// const parseDemoMarkdown = () => {
//   const demo = `React + marked + highlight.js

//   **Code Sample:**
//   \`\`\`ts
//   import marked from "marked";

//   marked.setOptions({
//     langPrefix: "hljs language-",
//     highlight: function(code) {
//       return require("highlight.js").highlightAuto(code, ["html", "javascript"])
//         .value;
//     }
//   });
//   \`\`\`
//   `;
//   marked.setOptions({
//     langPrefix: "hljs language-",
//     highlight: (code, lang) => {
//       try {
//         // return hljsCommon.highlight(lang, code).value;
//         return hljs.highlight(code, { language: lang }).value;
//       } catch (error) {
//         return code;
//       }
//     }
//   });
//   const markdownAsHTMLString = marked(demo);
//   return markdownAsHTMLString;
// };

export const compileMarkdownToHTMLString = async (markdown: string) => {
  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight: (code, lang) => {
        // ensure a language is present
        if (lang === "") lang = "plaintext";
        // parse
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (error) {
          console.log(`============== Error - parseMarkdownIntoHTMLString - START =================`);
          console.log("input\n");
          console.log(JSON.stringify({ lang, code }, null, 2));
          console.log("\nerror\n");
          console.error(error);
          console.log(`============== Error - parseMarkdownIntoHTMLString  - END =================`);
          return code;
        }
      }
    })
  );
  const markdownAsHTMLString = marked.parse(markdown);
  if (typeof markdownAsHTMLString === 'string') {
    return markdownAsHTMLString;
  }
  return await markdownAsHTMLString;
};