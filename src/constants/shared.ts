// Build Mode
export const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_BUILD_MODE === 'development';
export const IS_STAGING = process.env.NEXT_PUBLIC_BUILD_MODE === 'staging';
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_BUILD_MODE === 'production';
