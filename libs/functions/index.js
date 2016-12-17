var isFunctionNode = require('../nodes').isFunctionNode;
var isIdentNode = require('../nodes').isIdentNode;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var countProps = require('../common').countProps;
var concat = require('../common').concat;

// [astData]->{}
function nodesToFunctionUsages (nodes) {
  return nodes.reduce(collectAstDataValueNodes, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isFunctionNode)
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isIdentNode) // this collects the function name nodes
  .map(astDataToContent)
  .reduce(countProps, {});
}

module.exports = {
  nodesToFunctionUsages: nodesToFunctionUsages
};