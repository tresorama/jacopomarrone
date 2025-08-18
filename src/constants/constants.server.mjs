import { serverEnvVars } from "./env-var.schema.server.mjs";

export const {
  GMAIL_USER_ADDRESS,
  GMAIL_USER_APP_PASSWORD,
} = {
  ...serverEnvVars,
};