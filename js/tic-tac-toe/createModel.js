const m = require('mori');
const R = require('ramda');

const equalsZero = m.curry(m.equals, 0);
const equalsOne = m.curry(m.equals, 1);
const equalsTwo = m.curry(m.equals, 2);

module.exports = () => {
  const e = 0;
  const sideLength = 3;
  const model = m.vector(
    m.vector(e, e, e),
    m.vector(e, e, e),
    m.vector(e, e, e)
  );

  const boardIsFull = () => equalsZero(m.count(m.filter(equalsZero, model)));
  const getRows = () => m.intoArray(m.map(m.intoArray, model));

  const getColumnFromIndex = (index) => R.modulo(index, sideLength);
  const getRowFromIndex = (index) => Math.floor(R.divide(index, sideLength));

  isValidMove = (index) => equalsZero(m.nth(m.nth(model, getRowFromIndex(index)), getColumnFromIndex(index)));





  return {
    boardIsFull,
    getRows,
    isValidMove
  };
};
