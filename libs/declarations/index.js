var get = require('lodash').get;
var tail = require('lodash').tail;
var head = require('lodash').head;
var difference = require('lodash').difference;
var nodesToVariableUsages = require('../variables').nodesToVariableUsages;
var nodesToMixinUsages = require('../mixins').nodesToMixinUsages;
var nodesToFunctionUsages = require('../functions').nodesToFunctionUsages;

// [AstData]->[String]
function findDeclarations(nodes) {
  return findDeclarationNodes(nodes)
  .reduce(nodesToNames, [])
  .filter(removeEmptyString);
}

// []->AstData->
function nodesToNames(acc, node) {
  acc.push(varDeclarationNodeToName(node));
  acc.push(funcDeclarationNodeToName(node));
  acc.push(mixinDeclarationNodeToName(node));

  return acc;
}

// String->bool
function removeEmptyString(str) {
  return get(str, 'length', 0) > 0;
}

// AstData->String
function funcDeclarationNodeToName(node) {
  var childNode = get(node, 'content[2]', {});

  if (childNode.type === 'function') {
    return get(childNode, 'content[0].content', '');
  }

  return '';
}

// AstData->String
function mixinDeclarationNodeToName(node) {
  var type = get(node, 'type');

  if(type === 'mixin') {
    return get(node, 'content[2].content');
  }

  return '';
}

// AstData->String
function varDeclarationNodeToName(node) {
  var childNode = get(node, 'content[0].content[0]', {});

  if(childNode.type === 'variable') {
    return get(childNode, 'content[0].content');
  }

  return '';
}

// [AstData]->[AstData]
function findDeclarationNodes(nodes, acc) {
  var result = Array.isArray(acc) ? acc : [];
  
  if(!Array.isArray(nodes)) return result;
  if(nodes.length <= 0) return result;

  var firstNode = head(nodes);
  var content = get(firstNode, 'content', []);
  if(isDeclarationNode(firstNode) || isMixinDeclarationNode(firstNode) || isFunctionDeclarationNode(firstNode)) {
    result.push(firstNode);
  }
    
  if(nodeHasChildren(firstNode)) result = result.concat(findDeclarationNodes(content));

  return findDeclarationNodes(tail(nodes), result);
}

// AstData->bool
function isFunctionDeclarationNode(node) {
  return get(node, 'type') === 'atrule'; 
}

// AstData->bool
function isMixinDeclarationNode(node) {
  return get(node, 'type') === 'mixin'; 
}

// AstData->bool
function nodeHasChildren(node) {
  var content = get(node, 'content');
  return Array.isArray(content) && content.length > 0;
}

// AstData->bool
function isDeclarationNode(node) {
  return get(node, 'type') === 'declaration';
}

// [AstData]->[String]
function findUnusedDeclaration(nodes) {
  var declarations = findDeclarations(nodes);
  var vars = nodesToVariableUsages(nodes);
  var mixins = nodesToMixinUsages(nodes);
  var functions = nodesToFunctionUsages(nodes);

  var refs = Object.keys(vars)
    .concat(Object.keys(mixins))
    .concat(Object.keys(functions));

  return difference(declarations, refs);
}

module.exports = {
  findDeclarations: findDeclarations,
  findUnusedDeclaration: findUnusedDeclaration
};