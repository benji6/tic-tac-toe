var R = require('ramda');

module.exports = function () {
  "use strict";

  return R.map(R.multiply(0), R.range(0, 9));
};
