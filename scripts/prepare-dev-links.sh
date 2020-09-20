#!/bin/sh

cd packages/react-mx/node_modules/react
npm unlink
npm link
cd ../react-dom
npm unlink
npm link
cd ../../../../packages/react-mx
npm unlink
npm link
cd ../../packages/react-mx-parser
npm unlink
npm link
cd ../../packages/react-mx-webpack-plugin
npm unlink
npm link
cd ../../
cd examples/playground
npm link react
npm link react-dom
npm link react-mx
npm link @react-mx/parser
npm link @react-mx/webpack-plugin