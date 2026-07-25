/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL || 'https://vyapaarsaathi-ai-8r9b.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
