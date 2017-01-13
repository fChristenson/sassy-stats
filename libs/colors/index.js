var isIdentNode = require('../nodes').isIdentNode;
var isFunctionNode = require('../nodes').isFunctionNode;
var isFontDeclaration = require('../nodes').isFontDeclaration;
var isNumberNode = require('../nodes').isNumberNode;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var inspect = require('../common').inspect;
var concat = require('../common').concat;
var countProps = require('../common').countProps;
var head = require('lodash').head;
var get = require('lodash').get;
var rgbHex = require('rgb-hex');
var findDeclarationNodes = require('../nodes').findDeclarationNodes;

// [astData]->{}
function nodesToColorUsages(nodes) {
  return findDeclarationNodes(nodes)
    .filter(function(node) {
      return !isFontDeclaration(node);
    })
    .reduce(collectAstDataValueNodes, [])
    .map(astDataToContent)
    .reduce(concat, [])
    .filter(isColorNode)
    .map(rgbNodeToColor)
    .filter(hasColorType)
    .map(nodeToColor)
    .filter(isStringWithLength)
    .reduce(countProps, {});
}

// astData->bool
function hasColorType(node) {
  return get(node, 'type') === 'color';
}

// astData->String
function nodeToColor(node) {
  return get(node, 'content', '');
}

// a->bool
function isStringWithLength(val) {
  return typeof val === 'string' && val.length > 0;
}

// astData->String
function rgbNodeToColor(node) {
  var firstChild = head(astDataToContent(node));

  // when using rgb functions we need to perform some extra transformations
  // since the values are on the child nodes
  if (isFunctionNode(node) && isIdentNode(firstChild) && isColorFunc(firstChild)) {
    return colorFuncNodeToColor(node);
  }

  return node; // if the node is not pointing to a rgb call we just move on
}

// astData->{}
function colorFuncNodeToColor(node) {
  // functions nodes has a the id of the function as first child
  // the second child are the args to the function
  var argNode = get(node, 'content[1]', {});
  var args = astDataToContent(argNode)
    .filter(isNumberNode)
    .map(astDataToContent)
    .map(function(val) {
      return parseInt(val);
    });

  try {
    return {
      type: 'color',
      content: rgbHex(args[0], args[1], args[2])
    };

  } catch (error) {
    console.log('Error for values "' + args[0] + ' ' + args[1] + ' ' + args[2] + '"');
    console.log(error.message);

    return {content: 'fail'};
  }
}

// astData->Boolean
function isColorFunc(node) {
  return astDataToContent(node) === 'rgb' || astDataToContent(node) === 'rgba';
}

// astData->Boolean
function isColorNode(node) {
  var firstChild = head(astDataToContent(node));
  var isColorFuncNode = isFunctionNode(node) &&
    isIdentNode(firstChild) &&
    isColorFunc(firstChild);

  return isColorFuncNode || isColorString(astDataToContent(node));
}

// String->Boolean
function isColorString(str) {
  return typeof str === 'string' &&
    str.trim().length > 0 &&
    /^[#a-zA-Z0-9]{3}/.test(str.trim());
}

module.exports = {
  nodesToColorUsages: nodesToColorUsages
};