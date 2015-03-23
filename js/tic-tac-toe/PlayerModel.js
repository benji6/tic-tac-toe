module.exports = function () {
  var currentPlayer = 1;

  var get = function () {
    return currentPlayer;
  };

  var set = function (val) {
    if (!(val === 1 || val === 2)) {
      return;
    }
    currentPlayer = val;
  };

  return {
    get: get,
    set: set
  };
};
