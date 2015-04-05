const m = require('mori');
const R = require('ramda');

const equalsZero = R.eq(0);
const equalsOne = R.eq(1);
const equalsTwo = R.eq(2);

module.exports = (model) => {
  const countOfCellsWhere = m.comp(m.count, R.curry(R.flip(R.binary(m.filter)))(m.flatten(model)));
  const computePlayerTurn = () => R.ifElse(m.curry(R.eq, countOfCellsWhere(equalsOne)), R.always(1), R.always(2))(countOfCellsWhere(equalsTwo));
  const computeLastPlayerTurn = () => R.ifElse(m.compose(equalsOne(computePlayerTurn)), R.always(2), R.always(1))();

  const boardIsFull = () => equalsZero(filteredLength(equalsZero));
  const getRows = () => m.intoArray(m.map(m.intoArray, model));

  const getColumnFromIndex = (index) => R.modulo(index, m.count(model));
  const getRowFromIndex = (index) => Math.floor(R.divide(index, m.count(model)));

  const isValidMove = (index) => equalsZero(m.nth(m.nth(model, getRowFromIndex(index)), getColumnFromIndex(index)));

  const computeNewModel = (index, value) =>
   m.updateIn(model, [getRowFromIndex(index)], R.always(m.updateIn(m.nth(model, getRowFromIndex(index)), [getColumnFromIndex(index)], R.always(value))));

  return {
    boardIsFull,
    computeNewModel,
    computePlayerTurn,
    getRows,
    isValidMove
  };

};
