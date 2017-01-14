var isIdentNode = require('../nodes').isIdentNode;
var findIncludeNodes = require('../nodes').findIncludeNodes;
var astDataToContent = require('../common').astDataToContent;
var countProps = require('../common').countProps;
var concat = require('../common').concat;

// [astData]->{}
function nodesToMixinUsages(nodes) {
  return findIncludeNodes(nodes)
  .map(astDataToContent)
  .reduce(concat, [])
  .filter(isIdentNode)
  .map(astDataToContent)
  .reduce(concat, [])
  .reduce(countProps, {});
}

module.exports = {
  nodesToMixinUsages: nodesToMixinUsages
};