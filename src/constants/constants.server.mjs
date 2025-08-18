import { serverEnvVars } from "./env-var.schema.server.mjs";

export const {
  DEBUG_CONSTANTS,
  GMAIL_USER_ADDRESS,
  GMAIL_USER_APP_PASSWORD,
} = {
  ...serverEnvVars,
  DEBUG_CONSTANTS: serverEnvVars.DEBUG_CONSTANTS === 'true',
};