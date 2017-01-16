var isIdentNode = require('../nodes').isIdentNode;
var isStringNode = require('../nodes').isStringNode;
var isFontDeclaration = require('../nodes').isFontDeclaration;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var findDeclarationNodes = require('../nodes').findDeclarationNodes;
var astDataToContent = require('../common').astDataToContent;
var countProps = require('../common').countProps;
var concat = require('../common').concat;

// [astData]->{}
function nodesToFontUsages(nodes) {
  return findDeclarationNodes(nodes)
  .filter(isFontDeclaration)
  .reduce(collectAstDataValueNodes, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isFontNode)
  .map(astDataToContent)
  .map(toLowerCase)
  .map(stripQuotes)
  .reduce(countProps, {});
}

// String->String
function toLowerCase(str) {
  return str.toLowerCase();
}

// astData->bool
function isFontNode(node) {
  return isIdentNode(node) || isStringNode(node);
}

// String->String
function stripQuotes(str) {
  return str.replace(/["']/g, ''); // strip "" and '' from names
}

module.exports = {
  nodesToFontUsages: nodesToFontUsages
};