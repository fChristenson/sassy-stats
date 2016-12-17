var isIdentNode = require('../nodes').isIdentNode;
var isStringNode = require('../nodes').isStringNode;
var isFontDeclaration = require('../nodes').isFontDeclaration;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var countProps = require('../common').countProps;
var concat = require('../common').concat;

// [astData]->{}
function nodesToFontUsages (nodes) {
  return nodes
  .filter(isFontDeclaration)
  .reduce(collectAstDataValueNodes, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(function (node) {
    // this collects the font name nodes
    return isIdentNode(node) || isStringNode(node);
  })
  .map(astDataToContent)
  .map(function (str) {
    return str
           .replace(/[\s-]/g, '_') // slug font names
           .replace(/["]/g, ''); // strip "" from names
  })
  .reduce(countProps, {});
}

module.exports = {
  nodesToFontUsages: nodesToFontUsages
};