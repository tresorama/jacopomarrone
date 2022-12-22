/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Define in which directory of the project eslint runs
  // (eslint runs internally by next lint)
  eslint: {
    dirs: ["src"]
  }
};

module.exports = nextConfig;
