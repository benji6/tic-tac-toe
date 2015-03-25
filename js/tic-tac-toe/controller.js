var renderBoardView = require('./renderBoardView.js');
var renderMessageView = require('./renderMessageView.js');
var R = require('ramda');

const Y = (f) => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));

var filteredLength = R.compose(R.length, R.filter);
var equalsZero = R.eq(0);
var equalsOne = R.eq(1);
var equalsTwo = R.eq(2);

var boardIsFull = (boardModel) => R.not(filteredLength(equalsZero, boardModel));

var computePlayerTurn = (boardModel) => R.eq(filteredLength(equalsTwo, boardModel),
  filteredLength(equalsOne, boardModel)) ? 1 : 2;

var computeLastPlayerTurn = (boardModel) => equalsOne(computePlayerTurn(boardModel)) ? 2 : 1;

var getRowsFromBoardModel = (boardModel) => R.reduceIndexed(function (acc, cell, index) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);
  var val = acc[Math.floor(R.divide(index, ROW_AND_COLUMN_COUNT))];
  if (R.isArrayLike(val)) {
    val.push(cell);
  } else {
    acc[Math.floor(R.divide(index, ROW_AND_COLUMN_COUNT))] = [cell];
  }
  return acc;
}, [], boardModel);

var getColumnsFromBoardModel = (boardModel) => R.reduceIndexed(function (acc, cell, index) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);
  var val = acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)];
  if (R.isArrayLike(val)) {
    val.push(cell);
  } else {
    acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)] = [cell];
  }
  return acc;
}, [], boardModel);

//cheating! should be computing these!
var getDiagonalsIndices = () => [
  [0, 4, 8],
  [2, 4, 6]
];

var getDiagonalsFromBoardModel = (boardModel) =>
  R.map((diagonals) =>
  R.map((value) =>
  boardModel[value], diagonals), getDiagonalsIndices());

var isGameOver = (boardModel) => R.or(isVictory(boardModel), boardIsFull(boardModel));

var isThreeInARow = (line) => R.or(line.every(equalsOne), line.every(equalsTwo));

var isValidMove = function (boardModel, index) {
  return R.and(equalsZero(boardModel[index]), R.not(isGameOver(boardModel)));
};

var isVictory = (boardModel) => R.concat(R.concat(getRowsFromBoardModel(boardModel),
  getColumnsFromBoardModel(boardModel)),
  getDiagonalsFromBoardModel(boardModel)).some(isThreeInARow);

module.exports = (recurse) => (boardModel) => {
  var onClick = (index) => {
    if (!isValidMove(boardModel, index)) {
      return;
    }

    var newModel = R.slice(0, R.length(boardModel))(boardModel);
    newModel[index] = computePlayerTurn(boardModel);
    recurse(newModel);
  };

  renderBoardView(boardModel, onClick);

  if (isVictory(boardModel)) {
    renderMessageView(`Victory for ${equalsOne(computeLastPlayerTurn(boardModel)) ? "noughts" : "crosses"}!`);
    return;
  }

  if (boardIsFull(boardModel)) {
    renderMessageView(`Draw!`);
    return;
  }
};
