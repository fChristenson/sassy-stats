var isVariableNode = require('../nodes').isVariableNode;
var get = require('lodash').get;
var uniqBy = require('lodash').uniqBy;
var findArgumentsNodes = require('../nodes').findArgumentsNodes;
var findVariableNodes = require('../nodes').findVariableNodes;
var findBlockNodes = require('../nodes').findBlockNodes;
var collectAstDataValueNodes = require('../nodes').collectAstDataValueNodes;
var astDataToContent = require('../common').astDataToContent;
var concat = require('../common').concat;
var countProps = require('../common').countProps;
var isNotEmptyString = require('../common').isNotEmptyString;
var util = require('util');

// astData->[string]
function argNodeToParamNames(node) {
  return get(node, 'content', [])
    .filter(isVariableNode)
    .map(variableNodeToName)
    .filter(isNotEmptyString);
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
  var blockVars = getBlockNodeVars(nodes);

  var stats = findVariableNodes(nodes)
    .reduce(collectAstDataValueNodes, [])
    .map(astDataToContent)
    .reduce(concat, [])
    .filter(isVariableNode)
    .map(astDataToContent)
    .reduce(concat, [])
    .map(astDataToContent)
    .concat(blockVars)
    .reduce(countProps, {});

  return nodesToArgumentVariableNames(nodes).reduce(removeProp, stats);
}

function getBlockNodeVars(nodes) {
  return findUniqueVarNodes(nodes)
    .map(variableNodeToName);
}

function findUniqueVarNodes(nodes) {
  var result = findBlockNodes(nodes)
    .map(getContent)
    .map(findVariableNodes)
    .reduce(concat, []);

  return uniqBy(result, 'start');
}

function getContent(node) {
  return get(node, 'content', []);
}

// {}->string->{}
function removeProp(obj, prop) {
  delete obj[prop];
  return obj;
}

module.exports = {
  nodesToVariableUsages: nodesToVariableUsages
};