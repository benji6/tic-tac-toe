var BoardView = require('./BoardView.js');
var MessageView = require('./MessageView.js');
var BoardModel = require('./BoardModel.js');
var R = require('ramda');

var boardIsFull = function (boardModel) {
  return !boardModel.filter(function (cell) {
    return cell === 0;
  }).length;
};

var computePlayerTurn = function (boardModel) {
  var numberOfNoughts = boardModel.filter(R.eq(1)).length;
  var numberOfCrosses = boardModel.filter(R.eq(2)).length;

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

  return diagonalsIndices.map(function (diagonals) {
    return diagonals.map(function (value) {
      return boardModel[value];
    });
  });
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
    updateBoardModel(boardModel.set, index, computePlayerTurn(boardModel.get()));
    renderBoardView(boardModel.get());
    if (isVictory(boardModel.get())) {
      renderMessageView(`Victory for ${computePlayerTurn(boardModel.get()) === 1 ? "noughts" : "crosses"}!`);
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
