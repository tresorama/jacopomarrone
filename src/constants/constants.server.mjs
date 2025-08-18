import { serverEnvVars } from "./env-var.schema.server.mjs";
import { getInferredBaseUrl } from "./utils/get-inferred-server-url.mjs";

export const {
  DEBUG_CONSTANTS,
  BASE_URL,
  GMAIL_USER_ADDRESS,
  GMAIL_USER_APP_PASSWORD,
} = {
  ...serverEnvVars,
  DEBUG_CONSTANTS: serverEnvVars.DEBUG_CONSTANTS === 'true',
  BASE_URL: getInferredBaseUrl(),
};