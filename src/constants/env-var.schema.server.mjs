import { z } from 'zod';

export const serverEnvVars = z.object({
  DEBUG_CONSTANTS: z.enum(['true', 'false']).optional().default('false'),
  GMAIL_USER_ADDRESS: z.string(),
  GMAIL_USER_APP_PASSWORD: z.string(),
}).parse(
  process.env,
);

