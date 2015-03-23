var BoardView = require('./BoardView.js');
var MessageView = require('./MessageView.js');
var Model = require('./Model.js');
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

var updateBoardModel = function (model, index) {
  model.board[index] = model.player;
};

var updatePlayerModel = function (model) {
  model.player = model.player === 1 ? 2 : 1;
};

module.exports = function (parentDomEl) {
  var model = Model();
  var boardModel = model.board;
  var renderBoardView = function () {};
  var renderMessageView = function () {};

  var userClick = function (index) {
    if (!isValidMove(boardModel, index)) {
      return;
    }
    updateBoardModel(model, index);
    renderBoardView(boardModel);
    if (isVictory(boardModel)) {
      renderMessageView(`Victory for ${model.player === 1 ? "noughts" : "crosses"}!`);
      return;
    }
    if (boardIsFull(boardModel)) {
      renderMessageView(`Draw!`);
      return;
    }
    updatePlayerModel(model);
  };

  renderBoardView = BoardView(boardModel, userClick, parentDomEl);
  renderMessageView = MessageView();
};
