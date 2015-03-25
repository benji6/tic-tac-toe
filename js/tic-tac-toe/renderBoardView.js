const jsmlParse = require('jsml-parse');
const R = require('ramda');

const getCharacterFromModelCode = (code) => {
  switch (code) {
    case 0:
      return '';
    case 1:
      return 'O';
    case 2:
      return 'X';
  }
};

const createJsml = function (boardModel, userClick) {
  const ROW_AND_COLUMN_COUNT = Math.pow(R.length(boardModel), 0.5);

  const center = {
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
            element.onclick = () => userClick(trCount * ROW_AND_COLUMN_COUNT + tdCount);
          }
        };
      }
    }
  };

  return center;
};

module.exports = function (boardModel, userClick) {
  const parentDomEl = document.getElementById('board_container');
  const domStructure = jsmlParse(createJsml(boardModel, userClick));

  while (parentDomEl.children.length) {
    parentDomEl.removeChild(parentDomEl.children[0]);
  }

  parentDomEl.appendChild(domStructure);
};
