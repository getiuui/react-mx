import React from 'react'
import App from 'next/app'

import '@react-mx/preview/dist/react-mx-preview.build.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return <Component {...pageProps} />
  }
}

export default MyApp
