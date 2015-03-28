const R = require('ramda');

module.exports = () => R.map(R.always(0), R.range(0, 9));
