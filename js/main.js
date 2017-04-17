const R = require('ramda')

const TicTacToe = require('./tic-tac-toe/controller.js')

TicTacToe(R.repeat(0, 9))
