/* eslint-disable no-param-reassign */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

const { default: nextSafe } = require('next-safe');

const isDev = process.env.NODE_ENV !== 'production';

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

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains', // TBD '; preload'
          },
          ...nextSafe({
            // contentTypeOptions,
            contentSecurityPolicy: {
              'default-src': ["'self'"],
              'base-uri': ["'self'"],
              'prefetch-src': ["'self'"],
              'script-src': ["'self'", "'unsafe-inline'", '*'],
              'style-src': ["'self'", "'unsafe-inline'", '*'],
              'object-src': ["'none'"],
              'connect-src': ["'self'", '*'],
              'font-src': ["'self'", '*'],
              'frame-src': ["'self'", '*'],
              'img-src': ["'self'", 'data:', '*'],
              'manifest-src': ["'self'"],
              'media-src': ["'self'", '*'],
              'worker-src': ['blob:'],
              // "upgrade-insecure-requests": [],
            },
            // frameOptions,
            // permissionsPolicy,
            permissionsPolicyDirectiveSupport: ['proposed', 'standard'],
            isDev,
            // referrerPolicy,
            // xssProtection,
          }),
        ],
      },
    ];
  },
});
