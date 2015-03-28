const R = require('ramda');
const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

const renderMessage = (message) =>
  document.getElementById('message_container').appendChild(createElement(h('div.center', [
    h('output', message)
  ])));

const draw = () => renderMessage(`Draw`);
const victory = (winner) => renderMessage(`Victory for ${winner}!`);

module.exports = {
  draw,
  victory
};
