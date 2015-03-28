const R = require('ramda');
const h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');

const createRow = R.curry(h)('tr', R.__, undefined);
const createCell = R.curry(h)('td', R.__, R.__);

const getCharacterFromModelCode = (code) => R.cond(
  [R.eq(0), R.always('')],
  [R.eq(1), R.always('O')],
  [R.eq(2), R.always('X')]
)(code);

module.exports = (rows, onclick) => {
  document.getElementById('board_container').appendChild(createElement(h('div.center', [
    h('table', R.mapIndexed((row, rowIndex) => createRow(R.mapIndexed((cell, cellIndex) => createCell({
      onclick: () => onclick(R.add(R.multiply(rowIndex, R.length(row)), cellIndex))
    }, getCharacterFromModelCode(cell)), row)), rows))
  ])));
};
