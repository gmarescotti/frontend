/* eslint-disable */

const { createSimgaAppConfig } = require("./build-scripts/webpack.js");
const { isProdBuild, isStatsBuild } = require("./build-scripts/env.js");

// This file exists because we haven't migrated the stats script yet

const configs = [
  createSimgaAppConfig({
    isProdBuild: isProdBuild(),
    isStatsBuild: isStatsBuild(),
    latestBuild: true,
  }),
];
// const configs = [createConfig(isProdBuild, /* latestBuild */ true)];
if (isProdBuild && !isStatsBuild) {
  configs.push(
    createSimgaAppConfig({
      isProdBuild: isProdBuild(),
      isStatsBuild: isStatsBuild(),
      latestBuild: false,
    })
  );
}

module.exports = configs;
