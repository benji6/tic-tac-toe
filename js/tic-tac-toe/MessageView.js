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
