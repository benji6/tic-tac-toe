const m = require('mori');
const R = require('ramda');
const createModel = require('./createModel.js');
const renderBoard = require('./renderBoard');
const renderMessage = require('./renderMessage.js');
const Y = require('./Y.js');

module.exports = Y((recurse) => (boardData) => {
  const model = createModel(boardData);

  renderBoard(model.getRows(), (index) => R.both(
    model.isValidMove,
    (index) => recurse(model.computeNewModel(index, model.computePlayerTurn()))
  )(index));

  R.cond(
    [model.isVictory, () => renderMessage.victory(R.eq(1, model.computeLastPlayerTurn()) ? "noughts" : "crosses")]
    // [boardIsFull, renderMessage.draw]
  )();
});
