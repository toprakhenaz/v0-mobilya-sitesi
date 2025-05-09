/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'v0.blob.com', 'placeholder.com'],
    unoptimized: true,
  },
  // Prisma'yı tamamen devre dışı bırak
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tarayıcı tarafında Prisma ve SQLite kullanımını engelle
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/client': false,
        'prisma': false,
        'sqlite3': false,
        'better-sqlite3': false,
      };
    }
    return config;
  },
}

export default nextConfig
