import { clientEnvVars } from "./env-var.schema.client.mjs";

export const {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  IS_STAGING,
  NEXT_PUBLIC_BUILD_MODE,
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
} = {
  ...clientEnvVars,
  IS_DEVELOPMENT: clientEnvVars.NEXT_PUBLIC_BUILD_MODE === 'development',
  IS_PRODUCTION: clientEnvVars.NEXT_PUBLIC_BUILD_MODE === 'production',
  IS_STAGING: clientEnvVars.NEXT_PUBLIC_BUILD_MODE === 'staging',
};