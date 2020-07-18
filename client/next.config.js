const path = require('path');

module.exports = {
  webpack(config, _) {
    config.resolve = {
      alias: {
        '@src': path.join(__dirname, 'src')
      },
      ...config.resolve
    };
     
    return config;
  }
};
