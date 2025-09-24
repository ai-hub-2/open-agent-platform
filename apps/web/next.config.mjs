/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds (e.g., on Vercel)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
