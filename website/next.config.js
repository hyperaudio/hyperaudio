/* eslint-disable no-param-reassign */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx'],
  webpack: (config, { isServer, webpack }) => {
    // Fixes npm packages (mdx) that depend on `fs` module
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.node = {
        fs: 'empty',
      };
    }

    config.plugins.push(new webpack.IgnorePlugin(/^hiredis$/));

    return config;
  },
});
