// @ts-check
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const { cspHeader } = require('./lib/content-security-policy');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@icons-pack/react-simple-icons'],
  },
  typescript: {
    ignoreBuildErrors: !!process.env.CI,
  },
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
    dirs: ['app', 'client', 'components', 'lib', 'middlewares'],
  },
  webpack: (config) => {
    if (process.env.NODE_V8_COVERAGE) {
      Object.defineProperty(config, 'devtool', {
        get() {
          return 'source-map';
        },
        set() {},
      });
    }

    return config;
  },
  // default URL generation in BigCommerce uses trailing slash
  trailingSlash: process.env.TRAILING_SLASH !== 'false',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  }
};

module.exports = withNextIntl(nextConfig);
