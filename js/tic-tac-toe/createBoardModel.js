const R = require('ramda');

module.exports = () => R.map(R.multiply(0), R.range(0, 9));
