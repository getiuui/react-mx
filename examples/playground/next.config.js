const { WebpackReactMXWatchPlugin } = require('react-mx')

module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.plugins.push(new WebpackReactMXWatchPlugin())
    }

    return config
  }
}
