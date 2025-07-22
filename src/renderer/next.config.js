/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '../../dist/renderer',
  trailingSlash: true,
  assetPrefix: '.',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
