export * from './shared';// export all `constants/shared`
import { isBrowser } from './utils/is-server';
import { getFromEnv } from './utils/from-env';

// Ensure this file is not imported in client/browser code
if (isBrowser()) {
  throw new Error(`
  Code meant to be executed in the browser is importing "constant/server.ts".
  This must not happens.
  Check all import of your code.  Follow the import tree if necessary.
  `);
}

// Mailjet
export const MAILJET_API_KEY = getFromEnv('MAILJET_API_KEY');
export const MAILJET_API_SECRET = getFromEnv('MAILJET_API_SECRET');
