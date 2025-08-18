import * as clientConstants from './constants.client.mjs';
import * as serverConstants from './constants.server.mjs';

import { isServer } from './utils/is-server.mjs';

if (!isServer()) {
  throw new Error('This file should only be used on the server');
}


if (serverConstants.DEBUG_CONSTANTS) {
  console.log("BUILD CONSTANTS:");
  console.log({
    clientConstants,
    serverConstants,
  });
}
else {
  console.log("BUILD CONSTANTS: DEBUG_CONSTANTS not enabled");
}