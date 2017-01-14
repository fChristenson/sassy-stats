var isIdentNode = require('../nodes').isIdentNode;
var isFunctionNode = require('../nodes').isFunctionNode;
var isFontDeclaration = require('../nodes').isFontDeclaration;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var concat = require('../common').concat;
var countProps = require('../common').countProps;
var inspect = require('../common').inspect;
var colorWords = require('./color_words');
var head = require('lodash').head;
var get = require('lodash').get;
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
    .filter(isColor)
    .reduce(countProps, {});
}

// astData->bool
function isColor(str) {
  return /^(rgba?.+|[a-fA-F0-9]{3,6})$/.test(str) || colorWords.indexOf(str.toLowerCase()) !== -1;
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

  return makeColorNode(nodeToColor(node));
}

// a->{}
function makeColorNode(content) {
  return {type: 'color', content: content};
}

// astData->{}
function colorFuncNodeToColor(node) {
  // functions nodes has a the id of the function as first child
  // the second child are the args to the function
  var funcName = get(node, 'content[0].content', ''); 
  var argNode = get(node, 'content[1]', {});
  var args = astDataToContent(argNode)
    .map(astDataToContent)
    .join('');

  return makeColorNode(funcName + '(' + args + ')');
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