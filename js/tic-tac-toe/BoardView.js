var jsmlParse = require('jsml-parse');

var center = {
  tag: "div",
  className: "center"
};

module.exports = function (boardModel, userClick, parentDomEl) {
  const ROW_AND_COLUMN_COUNT = Math.pow(boardModel.length, 0.5);

  center.children = {
    tag: "table",
    children: {
      tag: "tr",
      count: ROW_AND_COLUMN_COUNT,
      children: function (trCount) {
        return {
          tag: "td",
          count: ROW_AND_COLUMN_COUNT,
          text: "test",
          callback: function (element, parentEl, tdCount) {
            element.onclick = function () {
              userClick(trCount * ROW_AND_COLUMN_COUNT + tdCount);
            };
          }
        };
      }
    }
  };

  return jsmlParse(center, parentDomEl);
};
