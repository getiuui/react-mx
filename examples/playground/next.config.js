const WebpackReactMXWatchPlugin = require('@react-mx/webpack-plugin')

module.exports = {
  webpack: (config, { dev, isServer, webpack }) => {
    if (dev && isServer) {
      config.plugins.push(new WebpackReactMXWatchPlugin())
    }

    return config
  }
}
