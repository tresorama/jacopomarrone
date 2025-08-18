export * from './constants.client.mjs';
export * from './constants.server.mjs';

import { isBrowser } from './utils/is-server.mjs';

// Ensure this file is not imported in client/browser code
if (isBrowser()) {
  throw new Error(`
  Code meant to be executed in the browser is importing "constant/server.ts".
  This must not happens.
  Check all import of your code.  Follow the import tree if necessary.
  `);
}