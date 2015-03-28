const R = require('ramda');
const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

const draw = () =>
  document.getElementById('message_container').appendChild(createElement(h('div.center', [
    h('output', 'Draw')
  ])));

const victory = (winner) =>
  document.getElementById('message_container').appendChild(createElement(h('div.center', [
    h('output', `Victory for ${winner}!`)
  ])));

module.exports = {
  draw,
  victory
};
