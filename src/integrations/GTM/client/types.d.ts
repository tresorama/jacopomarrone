/* 

Augment typescrpt definitions by including
Google Tag Manager window object

CONSIDER IMPLEMENT THIS FOR MORE BIGGER PROJECTS:
https://github.com/sahava/datalayer-typescript

*/

interface Window {
  dataLayer?: object[];
}