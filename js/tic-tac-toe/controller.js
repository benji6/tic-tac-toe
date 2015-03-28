const renderBoardView = require('./renderBoardView.js');
const messageView = require('./messageView.js');
const R = require('ramda');

const Y = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));

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
  R.ifElse(
    R.isArrayLike,
    (val) => val.push(cell),
    (val) => acc[Math.floor(R.divide(index, ROW_AND_COLUMN_COUNT))] = [cell]
  )(val);
  return acc;
}, [], boardModel);

const getColumnsFromBoardModel = (boardModel) => R.reduceIndexed(function (acc, cell, index) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);
  const val = acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)];
  R.ifElse(
    R.isArrayLike,
    (val) => val.push(cell),
    (val) => acc[R.mathMod(index, ROW_AND_COLUMN_COUNT)] = [cell]
  )(val);
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

const isThreeInARow = (line) => R.or(R.all(equalsOne, line), R.all(equalsTwo, line));

const isValidMove = R.curry(function (boardModel, index) {
  return R.and(equalsZero(boardModel[index]), R.not(isGameOver(boardModel)));
});

const isVictory = (boardModel) => R.any(isThreeInARow, R.concat(R.concat(getRowsFromBoardModel(boardModel),
  getColumnsFromBoardModel(boardModel)),
  getDiagonalsFromBoardModel(boardModel)));

module.exports = Y((recurse) => (boardModel) => {
  const onClick = (index) => R.ifElse(
    isValidMove(boardModel),
    (index) => recurse(R.mapIndexed(function (element, idx) {
      return R.eq(index, idx) ? computePlayerTurn(boardModel) : boardModel[idx];
    }, R.range(0, R.length(boardModel)))),
    R.F
  )(index);

  renderBoardView(boardModel, onClick);

  R.cond(
    [isVictory, (boardModel) => messageView.renderVictoryMessage(equalsOne(computeLastPlayerTurn(boardModel)) ? "noughts" : "crosses")],
    [boardIsFull, messageView.renderDrawMessage]
  )(boardModel);
});
