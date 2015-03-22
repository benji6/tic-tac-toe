var BoardView = require('./BoardView.js');
var Model = require('./Model.js');
var equals = require('../utils/equals.js');
//NB! all data should be immutable - it isn't right now!

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
  // const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);
  // const centerIndex = Math.floor(boardModel.length / 2);
  //
  // var diagonals = [];
  //
  // for (var i = 0; i < ROW_AND_COLUMN_COUNT; i++) {
  //   diagonals[i] = centerIndex
  // }

  //cheating with magic numbers!
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

var isValidMove = function (boardModel, index) {
  return boardModel[index] !== 1;
};

var updateBoardModel = function (model, index) {
  model.board[index] = model.player;
};

var updatePlayerModel = function (model) {
  model.player = model.player === 1 ? 2 : 1;
};

isThreeInARow = function (line) {
  return line.every(equals(1)) || line.every(equals(2));
};

var isVictory = function (boardModel) {
  return getRowsFromBoardModel(boardModel).some(isThreeInARow) ||
    getColumnsFromBoardModel(boardModel).some(isThreeInARow) ||
    getDiagonalsFromBoardModel(boardModel).some(isThreeInARow);
};

var boardIsFull = function (boardModel) {
  return !boardModel.filter(function (cell) {
    return cell === 0;
  }).length;
};

module.exports = function (parentDomEl) {
  var model = Model();
  var boardModel = model.board;

  var userClick = function (index) {
    if (!isValidMove(boardModel, index)) {
      return;
    }
    updateBoardModel(model, index);
    if (isVictory(boardModel)) {
      console.log(`victory for player ${model.player}`);
      return;
    }
    if (boardIsFull(boardModel)) {
      console.log(`draw`);
      return;
    }
    updatePlayerModel(model);
    console.log(boardModel);
    // console.log(model);
  };

  BoardView(boardModel, userClick, parentDomEl);
};
