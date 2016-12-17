var isVariableNode = require('../nodes').isVariableNode;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var concat = require('../common').concat;
var countProps = require('../common').countProps;

// [astData]->{}
function nodesToVariableUsages (nodes) {
  return nodes
  .reduce(collectAstDataValueNodes, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isVariableNode)
  .map(astDataToContent)
  .reduce(concat, [])
  .map(astDataToContent)
  .reduce(countProps, {});
}

module.exports = {
  nodesToVariableUsages: nodesToVariableUsages
};