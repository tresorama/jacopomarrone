import { z } from 'zod';

export const clientEnvVars = z.object({
  NEXT_PUBLIC_BUILD_MODE: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: z.string().optional(),
}).parse(
  {
    NEXT_PUBLIC_BUILD_MODE: process.env.NEXT_PUBLIC_BUILD_MODE,
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
  },
);

