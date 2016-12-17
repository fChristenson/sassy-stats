var isIdentNode = require('../nodes').isIdentNode;
var isFunctionNode = require('../nodes').isFunctionNode;
var isNumberNode = require('../nodes').isNumberNode;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var concat = require('../common').concat;
var head = require('lodash').head;
var get = require('lodash').get;
var rgbHex = require('rgb-hex');

// [astData]->{}
function nodesToColorUsages (nodes) {
  return nodes
  .reduce(collectAstDataValueNodes, [])
  .map(astDataToContent)
  .reduce(concat, [])
  .map(rgbNodeToRgbObject)
  .reduce(uniqColors, []);
}

// []->AstData->[]
function uniqColors (acc, node) {
  var color = astDataToContent(node);

  if (color && acc.indexOf(color) === -1) {
    acc.push(color);
  }

  return acc;
}

// astData->{}
function rgbNodeToRgbObject (node) {
  var firstChild = head(astDataToContent(node));

  // when using rgb functions we need to perform some extra transformations
  // since the values are on the child nodes
  if (isFunctionNode(node) && isIdentNode(firstChild) && isColorFunc(firstChild)) {
    return astDataToRgbObject(node);
  }

  return node; // if the node is not pointing to a rgb call we just move on
}

// astData->{}
function astDataToRgbObject (node) {
  // functions nodes has a the id of the function as first child
  // the second child are the args to the function
  var argNode = get(node, 'content[1]', {});
  var args = astDataToContent(argNode)
  .filter(isNumberNode)
  .map(astDataToContent)
  .map(function (val) {
    return parseInt(val);
  });

  return {content: rgbHex(args[0], args[1], args[2])};
}

// astData->Boolean
function isColorFunc (node) {
  return astDataToContent(node) === 'rgb' || astDataToContent(node) === 'rgba';
}

module.exports = {
  nodesToColorUsages: nodesToColorUsages
};