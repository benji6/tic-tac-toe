const m = require('mori');
const TicTacToe = require('./tic-tac-toe/controller.js');

const e = 0;

TicTacToe(m.vector(
  m.vector(e, e, e),
  m.vector(e, e, e),
  m.vector(e, e, e)
));
