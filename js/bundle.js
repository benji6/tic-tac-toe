(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TicTacToe = require('./tic-tac-toe/Controller.js');

TicTacToe(document.body);

},{"./tic-tac-toe/Controller.js":3}],2:[function(require,module,exports){
var jsmlParse = require('jsml-parse');

var center = {
  tag: "div",
  className: "center"
};

module.exports = function (boardModel, userClick, parentDomEl) {
  const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);

  center.children = {
    tag: "table",
    children: {
      tag: "tr",
      count: ROW_AND_COLUMN_COUNT,
      children: function (trCount) {
        return {
          tag: "td",
          count: ROW_AND_COLUMN_COUNT,
          text: "test",
          callback: function (element, parentEl, tdCount) {
            element.onclick = function () {
              userClick(trCount * ROW_AND_COLUMN_COUNT + tdCount);
            };
          }
        };
      }
    }
  };

  return jsmlParse(center, parentDomEl);
};

},{"jsml-parse":9}],3:[function(require,module,exports){
var BoardView = require('./BoardView.js');
var Model = require('./Model.js');
var equals = require('../utils/equals.js');
//NB! all data should be immutable - it isn't right now!

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
  // const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);
  // const centerIndex = Math.floor(boardModel.length / 2);
  //
  // var diagonals = [];
  //
  // for (var i = 0; i < ROW_AND_COLUMN_COUNT; i++) {
  //   diagonals[i] = centerIndex
  // }

  //cheating with magic numbers!
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

var isValidMove = function (boardModel, index) {
  return boardModel[index] !== 1;
};

var updateBoardModel = function (model, index) {
  model.board[index] = model.player;
};

var updatePlayerModel = function (model) {
  model.player = model.player === 1 ? 2 : 1;
};

isThreeInARow = function (line) {
  return line.every(equals(1)) || line.every(equals(2));
};

var isVictory = function (boardModel) {
  return getRowsFromBoardModel(boardModel).some(isThreeInARow) ||
    getColumnsFromBoardModel(boardModel).some(isThreeInARow) ||
    getDiagonalsFromBoardModel(boardModel).some(isThreeInARow);
};

var boardIsFull = function (boardModel) {
  return !boardModel.filter(function (cell) {
    return cell === 0;
  }).length;
};

module.exports = function (parentDomEl) {
  var model = Model();
  var boardModel = model.board;

  var userClick = function (index) {
    if (!isValidMove(boardModel, index)) {
      return;
    }
    updateBoardModel(model, index);
    if (isVictory(boardModel)) {
      console.log(`victory for player ${model.player}`);
      return;
    }
    if (boardIsFull(boardModel)) {
      console.log(`draw`);
      return;
    }
    updatePlayerModel(model);
    console.log(boardModel);
    // console.log(model);
  };

  BoardView(boardModel, userClick, parentDomEl);
};

},{"../utils/equals.js":5,"./BoardView.js":2,"./Model.js":4}],4:[function(require,module,exports){
module.exports = function () {
  //empty = 0, noughts = 1, crosses = 2
  var board = [];

  for (var i = 0; i < 9; i++) {
    board[i] = 0;
  }

  return {
    board,
    player: 1
  };
};

},{}],5:[function(require,module,exports){
module.exports = function (x) {
  return function (y) {
    return x === y;
  };
};

},{}],6:[function(require,module,exports){
module.exports = function (text, domEl, count) {
  if (typeof text === 'function') {
    domEl.appendChild(document.createTextNode(text(count)));
    return;
  }
  domEl.appendChild(document.createTextNode(text));
};

},{}],7:[function(require,module,exports){
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

},{"./appendTextNode.js":6}],8:[function(require,module,exports){
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

},{"./createDomElementFromJsml.js":7}],9:[function(require,module,exports){
module.exports = require('./jsmlWalker.js');

},{"./jsmlWalker.js":8}]},{},[1]);
