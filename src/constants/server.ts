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

// Gmail
export const GMAIL_USER_ADDRESS = getFromEnv('GMAIL_USER_ADDRESS');
export const GMAIL_USER_APP_PASSWORD = getFromEnv('GMAIL_USER_APP_PASSWORD');
