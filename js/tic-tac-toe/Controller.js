var BoardView = require('./BoardView.js');
var MessageView = require('./MessageView.js');
var BoardModel = require('./BoardModel.js');
var PlayerModel = require('./PlayerModel.js');
var equals = require('../utils/equals.js');

var boardIsFull = function (boardModel) {
  return !boardModel.filter(function (cell) {
    return cell === 0;
  }).length;
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
  return line.every(equals(1)) || line.every(equals(2));
};

var isValidMove = function (boardModel, index) {
  return boardModel[index] !== 1 && !isGameOver(boardModel);
};

var isVictory = function (boardModel) {
  return getRowsFromBoardModel(boardModel).some(isThreeInARow) ||
  getColumnsFromBoardModel(boardModel).some(isThreeInARow) ||
  getDiagonalsFromBoardModel(boardModel).some(isThreeInARow);
};

var updateBoardModel = function (boardModel, index, player) {
  boardModel.set(index, player);
};

var updatePlayerModel = function (playerModel) {
  playerModel.set(playerModel.get() === 1 ? 2 : 1);
};

module.exports = function (parentDomEl) {
  var boardModel = BoardModel();
  var playerModel = PlayerModel();
  var renderBoardView = function () {};
  var renderMessageView = function () {};

  var userClick = function (index) {
    if (!isValidMove(boardModel.get(), index)) {
      return;
    }
    updateBoardModel(boardModel, index, playerModel.get());
    renderBoardView(boardModel.get());
    if (isVictory(boardModel.get())) {
      renderMessageView(`Victory for ${playerModel.get() === 1 ? "noughts" : "crosses"}!`);
      return;
    }
    if (boardIsFull(boardModel.get())) {
      renderMessageView(`Draw!`);
      return;
    }
    updatePlayerModel(playerModel);
  };

  renderBoardView = BoardView(boardModel.get(), userClick, parentDomEl);
  renderMessageView = MessageView();
};
