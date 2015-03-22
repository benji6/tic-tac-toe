module.exports = function () {
  //empty = 0, noughts = 1, crosses = 2
  var board = [];

  for (var i = 0; i < 9; i++) {
    board[i] = 0;
  }

  return {
    board,
    player: 1
  };
};
