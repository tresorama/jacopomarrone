import { z } from 'zod';

export const serverEnvVars = z.object({
  GMAIL_USER_ADDRESS: z.string(),
  GMAIL_USER_APP_PASSWORD: z.string(),
}).parse(
  process.env,
);

