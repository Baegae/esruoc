const path = require('path');

module.exports = {
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
