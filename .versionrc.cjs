const defaultStandardVersion = require("@davidsneighbour/release-config");
const localStandardVersion = {
};

const standardVersion = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};
module.exports = standardVersion;
