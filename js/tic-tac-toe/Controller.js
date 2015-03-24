var BoardView = require('./BoardView.js');
var MessageView = require('./MessageView.js');
var BoardModel = require('./BoardModel.js');
var R = require('ramda');

var boardIsFull = function (boardModel) {
  return !R.filter(R.eq(0), boardModel).length;
};

var computePlayerTurn = function (boardModel) {
  var numberOfNoughts = R.filter(R.eq(1), boardModel).length;
  var numberOfCrosses = R.filter(R.eq(2), boardModel).length;

  return numberOfNoughts === numberOfCrosses ? 1 : 2;
};

var getRowsFromBoardModel = function (boardModel) {
  const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);

  return boardModel.reduce(function (acc, cell, index) {
    var val = acc[Math.floor(index / ROW_AND_COLUMN_COUNT)];
    if (Array.isArray(val)) {
      val.push(cell);
    } else {
      acc[Math.floor(index / ROW_AND_COLUMN_COUNT)] = [cell];
    }
    return acc;
  }, []);
};

var getColumnsFromBoardModel = function (boardModel) {
  const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);

  return boardModel.reduce(function (acc, cell, index) {
    var val = acc[index % ROW_AND_COLUMN_COUNT];
    if (Array.isArray(val)) {
      val.push(cell);
    } else {
      acc[index % ROW_AND_COLUMN_COUNT] = [cell];
    }
    return acc;
  }, []);
};

var getDiagonalsFromBoardModel = function (boardModel) {
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
  return isVictory(boardModel) || boardIsFull(boardModel);
};

var isThreeInARow = function (line) {
  return line.every(R.eq(1)) || line.every(R.eq(2));
};

var isValidMove = function (boardModel, index) {
  return boardModel[index] !== 1 && !isGameOver(boardModel);
};

var isVictory = function (boardModel) {
  return getRowsFromBoardModel(boardModel).some(isThreeInARow) ||
  getColumnsFromBoardModel(boardModel).some(isThreeInARow) ||
  getDiagonalsFromBoardModel(boardModel).some(isThreeInARow);
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
      renderMessageView(`Victory for ${currentPlayerTurn === 1 ? "noughts" : "crosses"}!`);
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
