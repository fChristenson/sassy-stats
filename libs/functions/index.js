var isFunctionNode = require('../nodes').isFunctionNode;
var isIdentNode = require('../nodes').isIdentNode;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var findDeclarationNodes = require('../nodes').findDeclarationNodes;
var astDataToContent = require('../common').astDataToContent;
var countProps = require('../common').countProps;
var concat = require('../common').concat;
var nativeFuncNames = require('./native_function_names');
var sassNativeFuncNames = require('./sass_native_function_names');

// [astData]->{}
function nodesToFunctionUsages(nodes) {
  return findDeclarationNodes(nodes)
  .reduce(collectAstDataValueNodes, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isFunctionNode)
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isIdentNode) // this collects the function name nodes
  .map(astDataToContent)
  .filter(removeNativeFunctions)
  .reduce(countProps, {});
}

function removeNativeFunctions(str) {
  return nativeFuncNames.indexOf(str) === -1 && sassNativeFuncNames.indexOf(str) === -1;
}

module.exports = {
  nodesToFunctionUsages: nodesToFunctionUsages
};