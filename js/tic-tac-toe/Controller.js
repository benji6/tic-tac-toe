var BoardView = require('./BoardView.js');
var MessageView = require('./MessageView.js');
var BoardModel = require('./BoardModel.js');
var R = require('ramda');

var filteredLength = R.compose(R.length, R.filter);
var equalsZero = R.eq(0);
var equalsOne = R.eq(1);
var equalsTwo = R.eq(2);

var boardIsFull = function (boardModel) {
  return R.not(filteredLength(equalsZero, boardModel));
};

var computePlayerTurn = function (boardModel) {
  return R.eq(filteredLength(equalsTwo, boardModel), filteredLength(equalsOne, boardModel)) ? 1 : 2;
};

var getRowsFromBoardModel = function (boardModel) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);

  return R.reduceIndexed(function (acc, cell, index) {
    var val = acc[Math.floor(R.divide(index, ROW_AND_COLUMN_COUNT))];
    if (R.isArrayLike(val)) {
      val.push(cell);
    } else {
      acc[Math.floor(R.divide(index, ROW_AND_COLUMN_COUNT))] = [cell];
    }
    return acc;
  }, [], boardModel);
};

var getColumnsFromBoardModel = function (boardModel) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);

  return R.reduceIndexed(function (acc, cell, index) {
    var val = acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)];
    if (Array.isArray(val)) {
      val.push(cell);
    } else {
      acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)] = [cell];
    }
    return acc;
  }, [], boardModel);
};

var getDiagonalsFromBoardModel = function (boardModel) {
  //cheating! should be computing these!
  var diagonalsIndices = [
    [0, 4, 8],
    [2, 4, 6]
  ];

  return R.map(function (diagonals) {
    return R.map(function (value) {
      return boardModel[value];
    }, diagonals);
  }, diagonalsIndices);
};

var isGameOver = function (boardModel) {
  return R.or(isVictory(boardModel), boardIsFull(boardModel));
};

var isThreeInARow = function (line) {
  return R.or(line.every(equalsOne), line.every(equalsTwo));
};

var isValidMove = function (boardModel, index) {
  return R.and(R.eq(boardModel[index], 0), R.not(isGameOver(boardModel)));
};

var isVictory = function (boardModel) {
  return R.or(getRowsFromBoardModel(boardModel).some(isThreeInARow),
    R.or(getColumnsFromBoardModel(boardModel).some(isThreeInARow),
    getDiagonalsFromBoardModel(boardModel).some(isThreeInARow)));
};

var updateBoardModel = function (set, index, player) {
  set(index, player);
};

module.exports = function (parentDomEl) {
  var boardModel = BoardModel();

  var renderBoardView = function () {};
  var renderMessageView = function () {};

  var userClick = function (index) {
    if (!isValidMove(boardModel.get(), index)) {
      return;
    }
    var currentPlayerTurn = computePlayerTurn(boardModel.get());
    updateBoardModel(boardModel.set, index, currentPlayerTurn);
    renderBoardView(boardModel.get());
    if (isVictory(boardModel.get())) {
      renderMessageView(`Victory for ${R.eq(currentPlayerTurn, 1) ? "noughts" : "crosses"}!`);
      return;
    }
    if (boardIsFull(boardModel.get())) {
      renderMessageView(`Draw!`);
      return;
    }
  };

  renderBoardView = BoardView(boardModel.get(), userClick, parentDomEl);
  renderMessageView = MessageView();
};
