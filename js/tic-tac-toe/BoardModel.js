module.exports = function () {
  var board = [];

  for (var i = 0; i < 9; i++) {
    board[i] = 0;
  }

  var get = function () {
    return Object.freeze(board);
  };

  var set = function (index, val) {
    if (index > 8 || !(val === 1 || val === 2)) {
      return;
    }
    var newModel = board.slice();
    newModel[index] = val;
    board = newModel;
    return Object.freeze(board);
  };

  return {
    get: get,
    set: set
  };
};
