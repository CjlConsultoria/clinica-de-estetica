const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: process.env.NODE_ENV === 'development',
      pure: true,
    },
  },
  webpack(config) {
    // styled-components v6 has a bug where it references `React` as a global
    // without importing it. ProvidePlugin injects it automatically.
    config.plugins.push(
      new webpack.ProvidePlugin({ React: 'react' })
    );
    return config;
  },
};

module.exports = nextConfig;