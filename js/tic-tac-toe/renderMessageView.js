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

module.exports = (message) =>
  jsmlParse(createJsml(message), document.getElementById('message_container'));
