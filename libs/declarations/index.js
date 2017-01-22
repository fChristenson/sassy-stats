var get = require('lodash').get;
var tail = require('lodash').tail;
var head = require('lodash').head;
var N = require('../nodes');
var makeValueType = require('../common').makeValueType;
var nodesToVariableUsages = require('../variables').nodesToVariableUsages;
var nodesToMixinUsages = require('../mixins').nodesToMixinUsages;
var nodesToFunctionUsages = require('../functions').nodesToFunctionUsages;

// []->[]
function findDeclarations(nodes) {
  return findDeclarationNodes(nodes)
  .reduce(nodesToDeclarationTypes, [])
  .filter(objectHasProps);
}

// []->AstData->
function nodesToDeclarationTypes(acc, node) {
  acc.push(varDeclarationNodeToType(node));
  acc.push(funcDeclarationNodeToType(node));
  acc.push(mixinDeclarationNodeToType(node));

  return acc;
}

// {}->bool
function objectHasProps(obj) {
  return Object.keys(obj).length > 0;
}

// AstData->{}
function funcDeclarationNodeToType(node) {
  var childNode = get(node, 'content[2]', {});

  if (childNode.type === 'function') {
    var name = get(childNode, 'content[0].content', '');
    return makeValueType('function', name);
  }

  return {};
}

// AstData->{}
function mixinDeclarationNodeToType(node) {
  var type = get(node, 'type');

  if(type === 'mixin') {
    var name = get(node, 'content[2].content');
    return makeValueType('mixin', name);
  }

  return {};
}

// AstData->{}
function varDeclarationNodeToType(node) {
  var childNode = get(node, 'content[0].content[0]', {});

  if(childNode.type === 'variable') {
    var name = get(childNode, 'content[0].content');
    return makeValueType('variable', name);
  }

  return {};
}

// [AstData]->[AstData]
function findDeclarationNodes(nodes, acc) {
  var result = Array.isArray(acc) ? acc : [];
  
  if(!Array.isArray(nodes)) return result;
  if(nodes.length <= 0) return result;

  var firstNode = head(nodes);
  var content = get(firstNode, 'content', []);
  if(N.isDeclarationNode(firstNode) 
    || isMixinDeclarationNode(firstNode) 
    || isFunctionDeclarationNode(firstNode)) {
    
    result.push(firstNode);
  }
    
  if(N.nodeHasChildren(firstNode)) result = result.concat(findDeclarationNodes(content));

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

// [AstData]->[String]
function findUnusedDeclaration(nodes) {
  var declarations = findDeclarations(nodes);
  var vars = findUnusedVars(declarations, nodes);
  var mixins = findUnusedMixins(declarations, nodes);
  var functions = findUnusedFunctions(declarations, nodes);

  return vars.concat(mixins).concat(functions);
}

// []->[]->[]
function findUnusedMixins(declarations, nodes) {
  var mixins = nodesToMixinUsages(nodes);
  return declarations.filter(filterUnused('mixin', mixins));
}

// string->{}->({}->bool)
function filterUnused(type, usages) {
  return function(e) {
    return Object.keys(usages).indexOf(e.name) === -1 && e.type === type;
  };
}

// []->[]->[]
function findUnusedFunctions(declarations, nodes) {
  var functions = nodesToFunctionUsages(nodes);
  return declarations.filter(filterUnused('function', functions));
}

// []->[]->[]
function findUnusedVars(declarations, nodes) {
  var vars = nodesToVariableUsages(nodes);
  return declarations.filter(filterUnused('variable', vars));
}

module.exports = {
  findDeclarations: findDeclarations,
  findUnusedDeclaration: findUnusedDeclaration,
};
