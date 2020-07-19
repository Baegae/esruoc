const path = require('path');
const process = require('process');

module.exports = {
  env: {
    GOOGLE_FIREBASE_STORAGE_BUCKET: process.env.GOOGLE_FIREBASE_STORAGE_BUCKET,
    GOOGLE_FIREBASE_API_KEY: process.env.GOOGLE_FIREBASE_API_KEY,
    GOOGLE_FIREBASE_AUTH_DOMAIN: process.env.GOOGLE_FIREBASE_AUTH_DOMAIN,
    GOOGLE_FIREBASE_PROJECT_ID: process.env.GOOGLE_FIREBASE_PROJECT_ID,
    GOOGLE_FIREBASE_APP_ID: process.env.GOOGLE_FIREBASE_APP_ID,
    GOOGLE_FIREBASE_MEASUREMENT_ID: process.env.GOOGLE_FIREBASE_MEASUREMENT_ID,
  },
  webpack(config, _) {
    config.resolve = {
      alias: {
        '@src': path.join(__dirname, 'src')
      },
      ...config.resolve
    };
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: {
                removeViewBox: false
              }
            },
          },
        },
      ],
    });
    return config;
  }
};
