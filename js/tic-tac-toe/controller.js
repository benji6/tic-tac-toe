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

const computeRowAndColumnCount = (list) => Math.pow(R.length(list), 0.5);

const getRows = (boardModel) => R.map((index) => R.rejectIndexed((cell, cellIndex) =>
  Math.floor(R.subtract(R.divide(cellIndex, computeRowAndColumnCount(boardModel)), index)))(boardModel), R.range(0, computeRowAndColumnCount(boardModel)));

const getColumns = (boardModel) => R.map((index) => R.rejectIndexed((cell, cellIndex) =>
  R.mathMod(R.subtract(cellIndex, index), computeRowAndColumnCount(boardModel)))(boardModel), R.range(0, computeRowAndColumnCount(boardModel)));

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

const isValidMove = R.curry((boardModel, index) =>
  R.and(equalsZero(boardModel[index]), R.not(isGameOver(boardModel))));

const isVictory = (boardModel) => R.any(isThreeInARow, R.concat(R.concat(getRows(boardModel),
  getColumns(boardModel)),
  getDiagonalsFromBoardModel(boardModel)));

module.exports = Y((recurse) => (boardModel) => {
  const onClick = (index) => R.ifElse(
    isValidMove(boardModel),
    (index) => recurse(R.mapIndexed((element, idx) =>
      R.eq(index, idx) ?
      computePlayerTurn(boardModel) :
      boardModel[idx], R.range(0, R.length(boardModel)))),
    R.F
  )(index);

  renderBoardView(boardModel, onClick);

  R.cond(
    [isVictory, (boardModel) => messageView.renderVictoryMessage(equalsOne(computeLastPlayerTurn(boardModel)) ? "noughts" : "crosses")],
    [boardIsFull, messageView.renderDrawMessage]
  )(boardModel);
});
