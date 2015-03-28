const jsmlParse = require('jsml-parse');
const R = require('ramda');

const getCharacterFromModelCode = (code) => {
  return R.cond(
    [R.eq(0), R.always('')],
    [R.eq(1), R.always('O')],
    [R.eq(2), R.always('X')]
  )(code);
};

const createJsml = (boardModel, userClick) => {
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
      children: (trCount) => {
        return {
          tag: "td",
          count: ROW_AND_COLUMN_COUNT,
          text: (tdCount) =>
            getCharacterFromModelCode(boardModel[R.add(R.multiply(trCount, ROW_AND_COLUMN_COUNT), tdCount)]),
          callback: (element, parentEl, tdCount) =>
            element.onclick = () => userClick(R.add(R.multiply(trCount, ROW_AND_COLUMN_COUNT), tdCount))
        };
      }
    }
  };

  return center;
};

module.exports = function (boardModel, userClick) {
  const parentDomEl = document.getElementById('board_container');
  const domStructure = jsmlParse(createJsml(boardModel, userClick));

  R.forEach((child) => parentDomEl.removeChild(child), parentDomEl.children);

  parentDomEl.appendChild(domStructure);
};
