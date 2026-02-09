/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  output: 'standalone',
  // Для статического экспорта раскомментируйте:
  // output: 'export',
  // trailingSlash: true,
}

module.exports = nextConfig
