var isVariableNode = require('../nodes').isVariableNode;
var get = require('lodash').get;
var findDeclarationNodes = require('../nodes').findDeclarationNodes;
var findBlockNodes = require('../nodes').findBlockNodes;
var findArgumentsNodes = require('../nodes').findArgumentsNodes;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var concat = require('../common').concat;
var countProps = require('../common').countProps;
var util = require('util');

// astData->[string]
function argNodeToParamNames(node) {
  return get(node, 'content', [])
    .filter(isVariableNode)
    .map(variableNodeToName)
    .filter(isNotEmptyString);
}

// a->bool
function isNotEmptyString(val) {
  return val !== '';
}

// astData->string
function variableNodeToName(node) {
  return get(node, 'content[0].content', '');
}

// [astData]->[string]
function nodesToArgumentVariableNames(nodes) {
  return findArgumentsNodes(nodes)
    .map(argNodeToParamNames)
    .reduce(concat, []);
}

// [astData]->{}
function nodesToVariableUsages(nodes) {
  //TODO: var blockNodes = findBlockNodes(nodes);

  var stats = findDeclarationNodes(nodes)
    .reduce(collectAstDataValueNodes, [])
    .map(astDataToContent)
    .reduce(concat, [])
    .filter(isVariableNode)
    .map(astDataToContent)
    .reduce(concat, [])
    .map(astDataToContent)
    .reduce(countProps, {});

  return nodesToArgumentVariableNames(nodes)
    .reduce(removeProp, stats);
}

// {}->string->{}
function removeProp(obj, prop) {
  delete obj[prop];
  return obj;
}

module.exports = {
  nodesToVariableUsages: nodesToVariableUsages
};