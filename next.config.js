/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.module.rules.push({ test: /\.txt$/, use: 'raw-loader' })

    return config
  },
}

module.exports = nextConfig
