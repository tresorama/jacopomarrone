/* 
Because Google Tag MAnager is injected by another script, 
and the script will attach 'dataLayer' to the window object,
we need to use 'window.dataLayer' to access the dataLayer.

But typescript doesn't support 'window.dataLayer' yet,
so we declare that dataLayer exists in the window object.

CONSIDER IMPLEMENT THIS FOR MORE BIGGER PROJECTS:
https://github.com/sahava/datalayer-typescript

*/

interface Window {
  dataLayer?: object[];
}