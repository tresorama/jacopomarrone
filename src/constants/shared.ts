// Build Mode
if (!process.env.NEXT_PUBLIC_BUILD_MODE) throw new Error('Missing env var => NEXT_PUBLIC_BUILD_MODE');

export const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_BUILD_MODE === 'development';
export const IS_STAGING = process.env.NEXT_PUBLIC_BUILD_MODE === 'staging';
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_BUILD_MODE === 'production';


// base url

export const BASE_URL = IS_DEVELOPMENT ? 'http://localhost:3000' : 'https://www.jacopomarrone.com';