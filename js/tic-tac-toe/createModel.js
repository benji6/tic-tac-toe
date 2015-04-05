const m = require('mori');
const R = require('ramda');

const equalsZero = R.eq(0);
const equalsOne = R.eq(1);
const equalsTwo = R.eq(2);


// const getDiagonalsIndices = (boardModel) => R.concat(
//   [R.map((index) =>
//     R.multiply(index, R.add(computeRowAndColumnCount(boardModel), 1)), R.range(0, computeRowAndColumnCount(boardModel)))],
//   [R.map((index) =>
//     R.multiply(R.inc(index), R.subtract(computeRowAndColumnCount(boardModel), 1)), R.range(0, computeRowAndColumnCount(boardModel)))]
// );
// const getDiagonals = (boardModel) =>
//   R.map((diagonals) =>
//   R.map((value) =>
//   boardModel[value], diagonals), getDiagonalsIndices(boardModel));
// const isGameOver = (boardModel) => R.or(isVictory(boardModel), boardIsFull(boardModel));

// const isValidMove = R.curry((boardModel, index) =>
//   R.and(equalsZero(boardModel[index]), R.not(isGameOver(boardModel))));



module.exports = (model) => {
  const countOfCellsWhere = m.comp(m.count, R.curry(R.flip(R.binary(m.filter)))(m.flatten(model)));
  const computePlayerTurn = () => R.ifElse(m.curry(R.eq, countOfCellsWhere(equalsOne)), R.always(1), R.always(2))(countOfCellsWhere(equalsTwo));
  const computeLastPlayerTurn = R.ifElse(m.comp(equalsOne, computePlayerTurn), R.always(2), R.always(1));
console.log(computeLastPlayerTurn()()()()()());
  const boardIsFull = () => equalsZero(filteredLength(equalsZero));
  const getRows = () => m.intoArray(m.map(m.intoArray, model));

  const getColumnFromIndex = (index) => R.modulo(index, m.count(model));
  const getRowFromIndex = (index) => Math.floor(R.divide(index, m.count(model)));
  const isThreeInARow = (line) => R.or(m.every(equalsOne, line), m.every(equalsTwo, line));
  const isValidMove = (index) => equalsZero(m.nth(m.nth(model, getRowFromIndex(index)), getColumnFromIndex(index)));

  const isVictory = () => m.some(isThreeInARow, model);
  // R.any(isThreeInARow, R.concat(R.concat(getRows(boardModel),
  //   getColumns(boardModel)),
  //   getDiagonals(boardModel)));

  const computeNewModel = (index, value) =>
   m.updateIn(model, [getRowFromIndex(index)], R.always(m.updateIn(m.nth(model, getRowFromIndex(index)), [getColumnFromIndex(index)], R.always(value))));

  return {
    boardIsFull,
    computeNewModel,
    computePlayerTurn,
    computeLastPlayerTurn,
    getRows,
    isValidMove,
    isVictory
  };

};
