#!/bin/sh

cd node_modules/react && npm link
cd ../react-dom && npm link
cd ../../
npm link
cd examples/playground && npm link react && npm link react-dom && npm link react-mx