const m = require('mori');
const R = require('ramda');
const createModel = require('./createModel.js');
const renderBoard = require('./renderBoard');
const renderMessage = require('./renderMessage.js');
const Y = require('./Y.js');




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
// const isThreeInARow = (line) => R.or(R.all(equalsOne, line), R.all(equalsTwo, line));
// const isValidMove = R.curry((boardModel, index) =>
//   R.and(equalsZero(boardModel[index]), R.not(isGameOver(boardModel))));
// const isVictory = (boardModel) => R.any(isThreeInARow, R.concat(R.concat(getRows(boardModel),
//   getColumns(boardModel)),
//   getDiagonals(boardModel)));

module.exports = Y((recurse) => (boardData) => {
  const model = createModel(boardData);
console.log(model.computePlayerTurn());
  renderBoard(model.getRows(), (index) => R.both(
    model.isValidMove,
    (index) => recurse(model.computeNewModel(index, model.computePlayerTurn()))
  )(index));

  // R.cond(
  //   [isVictory, (boardModel) => renderMessage.victory(equalsOne(computeLastPlayerTurn(boardModel)) ? "noughts" : "crosses")],
  //   [boardIsFull, renderMessage.draw]
  // )(boardModel);
});
