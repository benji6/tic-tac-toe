const jsmlParse = require('jsml-parse');

const createJsml = (text = '') => {
  return {
    tag: "div",
    className: "center",
    children: {
      tag: "output",
      text
    }
  };
};

const renderMesssage = (message) =>
  jsmlParse(createJsml(message), document.getElementById('message_container'));

const renderVictoryMessage = (winner) =>
  renderMesssage(`Victory for ${winner}!`);

const renderDrawMessage = () => renderMesssage(`Draw`);

module.exports = {
  renderVictoryMessage,
  renderDrawMessage
};
