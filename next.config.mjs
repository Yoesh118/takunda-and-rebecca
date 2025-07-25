/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/takunda-and-rebecca/' : '',
  basePath: isProd ? '/takunda-and-rebecca' : '',
  output: 'export'
}

export default nextConfig
