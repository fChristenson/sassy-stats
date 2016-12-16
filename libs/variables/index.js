var findValueNodes = require('../nodes').findValueNodes;
var isVariableNode = require('../nodes').isVariableNode;
var astDataToContent = require('../common').astDataToContent;
var concat = require('../common').concat;

// [astData]->{}
function nodesToVariableUsages (nodes) {
  return nodes.reduce(function (acc, node) {
    return acc.concat(findValueNodes(astDataToContent(node)));
  }, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isVariableNode)
  .map(astDataToContent)
  .reduce(concat, [])
  .map(astDataToContent)
  .reduce(function (acc, prop) {
    if (acc[prop] === undefined) {
      acc[prop] = 1;
    }
    else {
      acc[prop] += 1;
    }

    return acc;
  }, {});
}

module.exports = {
  nodesToVariableUsages: nodesToVariableUsages
};