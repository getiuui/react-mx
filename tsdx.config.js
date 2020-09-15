const images = require('@rollup/plugin-image')
const less = require('rollup-plugin-less')
const antVars = require('./src/ds/theme/and-vars')

module.exports = {
  rollup(config, options) {
    config.plugins = [
      images({ include: ['**/*.png', '**/*.jpg', '**/*.svg'] }),
      less({
        insert: true,
        include: ['**/*.less', '**/*.css'],
        output: 'dist/react-mx.build.css',
        option: {
          javascriptEnabled: true,
          modifyVars: antVars.default
        }
      }),
      ...config.plugins
    ]

    return config
  }
}
