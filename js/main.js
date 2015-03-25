const TicTacToe = require('./tic-tac-toe/controller.js');
const createBoardModel = require('./tic-tac-toe/createBoardModel.js');

TicTacToe(createBoardModel());
