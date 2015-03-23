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
