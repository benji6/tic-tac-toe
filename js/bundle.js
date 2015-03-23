(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TicTacToe = require('./tic-tac-toe/Controller.js');

TicTacToe(document.body);

},{"./tic-tac-toe/Controller.js":4}],2:[function(require,module,exports){
module.exports = function () {
  var board = [];

  for (var i = 0; i < 9; i++) {
    board[i] = 0;
  }

  var get = function () {
    return Object.freeze(board);
  };

  var set = function (index, val) {
    if (index > 8 || !(val === 1 || val === 2)) {
      return;
    }
    var newModel = board.slice();
    newModel[index] = val;
    board = newModel;
    return Object.freeze(board);
  };

  return {
    get: get,
    set: set
  };
};

},{}],3:[function(require,module,exports){
var jsmlParse = require('jsml-parse');

var getCharacterFromModelCode = (code) => {
  switch (code) {
    case 0:
      return '';
    case 1:
      return 'O';
    case 2:
      return 'X';
  }
};

var createJsml = function (boardModel, userClick) {
  const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);

  var center = {
    tag: "div",
    className: "center"
  };

  center.children = {
    tag: "table",
    children: {
      tag: "tr",
      count: ROW_AND_COLUMN_COUNT,
      children: function (trCount) {
        return {
          tag: "td",
          count: ROW_AND_COLUMN_COUNT,
          text: (tdCount) => getCharacterFromModelCode(boardModel[trCount * ROW_AND_COLUMN_COUNT + tdCount]),
          callback: function (element, parentEl, tdCount) {
            element.onclick = function () {
              userClick(trCount * ROW_AND_COLUMN_COUNT + tdCount);
            };
          }
        };
      }
    }
  };

  return center;
};

module.exports = function (boardModel, userClick, parentDomEl) {
  var domStructure = jsmlParse(createJsml(boardModel, userClick));

  document.body.appendChild(domStructure);

  return function (boardModel) {
    domStructure.parentNode.removeChild(domStructure);
    domStructure = jsmlParse(createJsml(boardModel, userClick));
    document.body.appendChild(domStructure);
  };
};

},{"jsml-parse":11}],4:[function(require,module,exports){
var BoardView = require('./BoardView.js');
var MessageView = require('./MessageView.js');
var BoardModel = require('./BoardModel.js');
var PlayerModel = require('./PlayerModel.js');
var equals = require('../utils/equals.js');

var boardIsFull = function (boardModel) {
  return !boardModel.filter(function (cell) {
    return cell === 0;
  }).length;
};

var getRowsFromBoardModel = function (boardModel) {
  const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);

  return boardModel.reduce(function (acc, cell, index) {
    var val = acc[Math.floor(index / ROW_AND_COLUMN_COUNT)];
    if (Array.isArray(val)) {
      val.push(cell);
    } else {
      acc[Math.floor(index / ROW_AND_COLUMN_COUNT)] = [cell];
    }
    return acc;
  }, []);
};

var getColumnsFromBoardModel = function (boardModel) {
  const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);

  return boardModel.reduce(function (acc, cell, index) {
    var val = acc[index % ROW_AND_COLUMN_COUNT];
    if (Array.isArray(val)) {
      val.push(cell);
    } else {
      acc[index % ROW_AND_COLUMN_COUNT] = [cell];
    }
    return acc;
  }, []);
};

var getDiagonalsFromBoardModel = function (boardModel) {
  var diagonalsIndices = [
    [0, 4, 8],
    [2, 4, 6]
  ];

  return diagonalsIndices.map(function (diagonals) {
    return diagonals.map(function (value) {
      return boardModel[value];
    });
  });
};

var isGameOver = function (boardModel) {
  return isVictory(boardModel) || boardIsFull(boardModel);
};

var isThreeInARow = function (line) {
  return line.every(equals(1)) || line.every(equals(2));
};

var isValidMove = function (boardModel, index) {
  return boardModel[index] !== 1 && !isGameOver(boardModel);
};

var isVictory = function (boardModel) {
  return getRowsFromBoardModel(boardModel).some(isThreeInARow) ||
  getColumnsFromBoardModel(boardModel).some(isThreeInARow) ||
  getDiagonalsFromBoardModel(boardModel).some(isThreeInARow);
};

var updateBoardModel = function (set, index, player) {
  set(index, player);
};

var updatePlayerModel = function (set, currentPlayer) {
  set(currentPlayer === 1 ? 2 : 1);
};

module.exports = function (parentDomEl) {
  var boardModel = BoardModel();
  var playerModel = PlayerModel();
  var renderBoardView = function () {};
  var renderMessageView = function () {};

  var userClick = function (index) {
    if (!isValidMove(boardModel.get(), index)) {
      return;
    }
    updateBoardModel(boardModel.set, index, playerModel.get());
    renderBoardView(boardModel.get());
    if (isVictory(boardModel.get())) {
      renderMessageView(`Victory for ${playerModel.get() === 1 ? "noughts" : "crosses"}!`);
      return;
    }
    if (boardIsFull(boardModel.get())) {
      renderMessageView(`Draw!`);
      return;
    }
    updatePlayerModel(playerModel.set, playerModel.get());
  };

  renderBoardView = BoardView(boardModel.get(), userClick, parentDomEl);
  renderMessageView = MessageView();
};

},{"../utils/equals.js":7,"./BoardModel.js":2,"./BoardView.js":3,"./MessageView.js":5,"./PlayerModel.js":6}],5:[function(require,module,exports){
var jsmlParse = require('jsml-parse');

var createJsml = function (text = '') {
  return {
    tag: "div",
    className: "center",
    children: {
      tag: "output",
      text
    }
  };
};

module.exports = function (parentDomEl) {
  var domStructure = jsmlParse(createJsml());

  document.body.appendChild(domStructure);

  return function (message) {
    domStructure.parentNode.removeChild(domStructure);
    domStructure = jsmlParse(createJsml(message));
    document.body.appendChild(domStructure);
  };
};

},{"jsml-parse":11}],6:[function(require,module,exports){
module.exports = function () {
  var currentPlayer = 1;

  var get = function () {
    return currentPlayer;
  };

  var set = function (val) {
    if (!(val === 1 || val === 2)) {
      return;
    }
    currentPlayer = val;
  };

  return {
    get: get,
    set: set
  };
};

},{}],7:[function(require,module,exports){
module.exports = function (x) {
  return function (y) {
    return x === y;
  };
};

},{}],8:[function(require,module,exports){
module.exports = function (text, domEl, count) {
  if (typeof text === 'function') {
    domEl.appendChild(document.createTextNode(text(count)));
    return;
  }
  domEl.appendChild(document.createTextNode(text));
};

},{}],9:[function(require,module,exports){
var appendTextNode = require('./appendTextNode.js');

module.exports = function (jsmlElement, count, parentDomElement) {
  if (!count) {
    count = 0;
  }

  var domElement = document.createElement(jsmlElement.tag);

  for (var property in jsmlElement) {
    if (jsmlElement.hasOwnProperty(property)) {
      switch (property) {
        case "tag":
        case "count":
        case "children":
          break;

        case "variable":
          this[jsmlElement.variable] = domElement;
          break;
        case "text":
          appendTextNode(jsmlElement.text, domElement, count);
          break;
        case "callback":
          jsmlElement.callback(domElement, parentDomElement, count);
          break;
        default:
          if (domElement[property] !== undefined) {
            if (typeof jsmlElement[property] === "function") {
              domElement[property] = jsmlElement[property](count);
            } else {
              domElement[property] = jsmlElement[property];
            }
          }
      }
    }
  }

  return domElement;
};

},{"./appendTextNode.js":8}],10:[function(require,module,exports){
var createDomElementFromJsml = require('./createDomElementFromJsml.js');

module.exports = function recurse (jsml, parentDomElement) {
  var ret;
  var i;
  var j;
  var k;
  var domEl;
  var count;

  if (Object.prototype.toString.call(jsml) === '[object Array]') {
    ret = [];
    for (i = 0; i < jsml.length; i++) {
      count = jsml[i].count;
      if (!count || count <= 1) {
        domEl = createDomElementFromJsml(jsml[i], count, parentDomElement);

        if (jsml[i].children) {
          if (typeof jsml[i].children === "function") {
            recurse(jsml[i].children(count), domEl);
          } else {
            recurse(jsml[i].children, domEl);
          }
        }

        if (parentDomElement) {
          parentDomElement.appendChild(domEl);
        }

        ret.push(domEl);
      } else {
        for (j = 0; j < count; j++) {
          domEl = createDomElementFromJsml(jsml[i], j, parentDomElement);

          if (jsml[i].children) {
            if (typeof jsml[i].children === "function") {
              recurse(jsml[i].children(j), domEl);
            } else {
              recurse(jsml[i].children, domEl);
            }
          }

          if (parentDomElement) {
            parentDomElement.appendChild(domEl);
          }

          ret.push(domEl);
        }
      }
    }
  } else {
    count = jsml.count;
    if (!count || count <= 1) {
      ret = domEl = createDomElementFromJsml(jsml, count, parentDomElement);

      if (parentDomElement) {
        parentDomElement.appendChild(ret);
      }

      if (jsml.children) {
        if (typeof jsml.children === "function") {
          recurse(jsml.children(count), domEl);
        } else {
          recurse(jsml.children, domEl);
        }
      }
    } else {
      ret = [];
      for (i = 0; i < count; i++) {
        domEl = createDomElementFromJsml(jsml, i, parentDomElement);

        if (parentDomElement) {
          parentDomElement.appendChild(domEl);
        }

        ret.push(domEl);

        if (jsml.children) {
          if (typeof jsml.children === "function") {
            recurse(jsml.children(i), domEl);
          } else {
            recurse(jsml.children, domEl);
          }
        }
      }
    }
  }

  return ret;
};

},{"./createDomElementFromJsml.js":9}],11:[function(require,module,exports){
module.exports = require('./jsmlWalker.js');

},{"./jsmlWalker.js":10}]},{},[1]);
