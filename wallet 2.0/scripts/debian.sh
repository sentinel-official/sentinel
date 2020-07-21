#!/bin/sh

rm -rf node_modules build release-builds && \
yarn && \
sed -i '/libgconf2-4/d' node_modules/electron-installer-debian/src/dependencies.js && \
yarn build && \
yarn package-linux && \
cp -r public/ release-builds/sentinel-linux-x64/ && \
yarn create-debian-installer
