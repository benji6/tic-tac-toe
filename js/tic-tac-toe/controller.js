const m = require('mori');
const R = require('ramda');
const createModel = require('./createModel.js');
const renderBoard = require('./renderBoard');
const renderMessage = require('./renderMessage.js');
const Y = require('./Y.js');


const model = createModel();


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

const getDiagonalsIndices = (boardModel) => R.concat(
  [R.map((index) =>
    R.multiply(index, R.add(computeRowAndColumnCount(boardModel), 1)), R.range(0, computeRowAndColumnCount(boardModel)))],
  [R.map((index) =>
    R.multiply(R.inc(index), R.subtract(computeRowAndColumnCount(boardModel), 1)), R.range(0, computeRowAndColumnCount(boardModel)))]
);

const getDiagonals = (boardModel) =>
  R.map((diagonals) =>
  R.map((value) =>
  boardModel[value], diagonals), getDiagonalsIndices(boardModel));

const isGameOver = (boardModel) => R.or(isVictory(boardModel), boardIsFull(boardModel));

const isThreeInARow = (line) => R.or(R.all(equalsOne, line), R.all(equalsTwo, line));

const isValidMove = R.curry((boardModel, index) =>
  R.and(equalsZero(boardModel[index]), R.not(isGameOver(boardModel))));

const isVictory = (boardModel) => R.any(isThreeInARow, R.concat(R.concat(getRows(boardModel),
  getColumns(boardModel)),
  getDiagonals(boardModel)));

const onClick = (boardModel, recurse) => (index) => R.ifElse(
  isValidMove(boardModel),
  (index) => recurse(R.mapIndexed((element, idx) =>
    R.eq(index, idx) ?
    computePlayerTurn(boardModel) :
    boardModel[idx], R.range(0, R.length(boardModel)))),
  R.F
)(index);

module.exports = Y((recurse) => (boardModel) => {
  renderBoard(model.getRows(), (index) => console.log(model.isValidMove(index)));

  R.cond(
    [isVictory, (boardModel) => renderMessage.victory(equalsOne(computeLastPlayerTurn(boardModel)) ? "noughts" : "crosses")],
    [boardIsFull, renderMessage.draw]
  )(boardModel);
});
