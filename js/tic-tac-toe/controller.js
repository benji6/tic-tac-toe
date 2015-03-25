const renderBoardView = require('./renderBoardView.js');
const renderMessageView = require('./renderMessageView.js');
const R = require('ramda');

const Y = (f) => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));

const filteredLength = R.compose(R.length, R.filter);
const equalsZero = R.eq(0);
const equalsOne = R.eq(1);
const equalsTwo = R.eq(2);

const boardIsFull = (boardModel) => R.not(filteredLength(equalsZero, boardModel));

const computePlayerTurn = (boardModel) => R.eq(filteredLength(equalsTwo, boardModel),
  filteredLength(equalsOne, boardModel)) ? 1 : 2;

const computeLastPlayerTurn = (boardModel) => equalsOne(computePlayerTurn(boardModel)) ? 2 : 1;

const getRowsFromBoardModel = (boardModel) => R.reduceIndexed(function (acc, cell, index) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);
  const val = acc[Math.floor(R.divide(index, ROW_AND_COLUMN_COUNT))];
  if (R.isArrayLike(val)) {
    val.push(cell);
  } else {
    acc[Math.floor(R.divide(index, ROW_AND_COLUMN_COUNT))] = [cell];
  }
  return acc;
}, [], boardModel);

const getColumnsFromBoardModel = (boardModel) => R.reduceIndexed(function (acc, cell, index) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);
  const val = acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)];
  if (R.isArrayLike(val)) {
    val.push(cell);
  } else {
    acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)] = [cell];
  }
  return acc;
}, [], boardModel);

//cheating! should be computing these!
const getDiagonalsIndices = () => [
  [0, 4, 8],
  [2, 4, 6]
];

const getDiagonalsFromBoardModel = (boardModel) =>
  R.map((diagonals) =>
  R.map((value) =>
  boardModel[value], diagonals), getDiagonalsIndices());

const isGameOver = (boardModel) => R.or(isVictory(boardModel), boardIsFull(boardModel));

const isThreeInARow = (line) => R.or(line.every(equalsOne), line.every(equalsTwo));

const isValidMove = function (boardModel, index) {
  return R.and(equalsZero(boardModel[index]), R.not(isGameOver(boardModel)));
};

const isVictory = (boardModel) => R.concat(R.concat(getRowsFromBoardModel(boardModel),
  getColumnsFromBoardModel(boardModel)),
  getDiagonalsFromBoardModel(boardModel)).some(isThreeInARow);

module.exports = Y((recurse) => (boardModel) => {
  const onClick = (index) => {
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
});
