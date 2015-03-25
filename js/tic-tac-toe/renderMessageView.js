const jsmlParse = require('jsml-parse');

const createJsml = function (text = '') {
  return {
    tag: "div",
    className: "center",
    children: {
      tag: "output",
      text
    }
  };
};

module.exports = (message) =>
  jsmlParse(createJsml(message), document.getElementById('message_container'));
