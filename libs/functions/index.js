var isFunctionNode = require('../nodes').isFunctionNode;
var isIdentNode = require('../nodes').isIdentNode;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var findDeclarationNodes = require('../nodes').findDeclarationNodes;
var astDataToContent = require('../common').astDataToContent;
var countProps = require('../common').countProps;
var concat = require('../common').concat;

// [astData]->{}
function nodesToFunctionUsages (nodes) {
  return findDeclarationNodes(nodes)
  .reduce(collectAstDataValueNodes, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isFunctionNode)
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isIdentNode) // this collects the function name nodes
  .map(astDataToContent)
  .filter(function (name) {
    // we remove the standard css functions
    return name !== 'rgb' && name !== 'rgba';
  })
  .reduce(countProps, {});
}

module.exports = {
  nodesToFunctionUsages: nodesToFunctionUsages
};