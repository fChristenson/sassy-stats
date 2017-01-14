var get = require('lodash').get;
var head = require('lodash').head;
var curry = require('lodash').curry;
var astDataToContent = require('../common').astDataToContent;

// String->AstData->Boolean
function nodeHasArrayContent (node) {
  return Array.isArray(astDataToContent(node));
}

// []->Number
function len (array) {
  return get(array, 'length', 0);
}

// String->String->[AstData]->[]
var findNodes = curry(function (prop, id, nodes) {
  if (len(nodes) <= 0) return [];

  if (len(nodes) === 1 && !nodeHasArrayContent(head(nodes))) {
    return get(head(nodes), prop) === id ? nodes : [];
  }

  return nodes.reduce(addNodes(prop, id), []);
});

// String->[AstData]->[]
var findValueNodes = findNodes('type', 'value');

// String->[AstData]->[]
var findIncludeNodes = findNodes('type', 'include');

// String->[AstData]->[]
var findDeclarationNodes = findNodes('type', 'declaration');

// String->[AstData]->[]
var findNodesWithContent = findNodes('content');

// String->[]->AstData
var addNodes = curry(function (prop, id, acc, node) {
  if (get(node, prop) === id) acc.push(node);

  if (nodeHasArrayContent(node)) {
    acc = acc.concat(findNodes(prop, id, astDataToContent(node)));
  }

  return acc;
});

// AstData->Boolean
var isNodeType = curry(function (id, node) {
  return get(node, 'type') === id;
});

// AstData->Boolean
var isNumberNode = isNodeType('number');

// AstData->Boolean
var isVariableNode = isNodeType('variable');

// AstData->Boolean
function isFontNode (node) {
  return astDataToContent(node) === 'font';
}

// AstData->Boolean
function isFontDeclaration (node) {
  var firstContentNode = head(astDataToContent(node));
  var firstOfContentNode = head(astDataToContent(firstContentNode));

  return isPropertyNode(firstContentNode)
  && isFontNode(firstOfContentNode);
}

// AstData->Boolean
var isPropertyNode = isNodeType('property');

// AstData->Boolean
var isFunctionNode = isNodeType('function');

// AstData->Boolean
var isStringNode = isNodeType('string');

// []->AstData->[AstData]
function collectAstDataValueNodes(acc, node) {
  return acc.concat(findValueNodes(astDataToContent(node)));
}

// _->Number->Boolean
var isIdentNode = isNodeType('ident');

module.exports = {
  isNumberNode: isNumberNode,
  isStringNode: isStringNode,
  isFontDeclaration: isFontDeclaration,
  findIncludeNodes: findIncludeNodes,
  isIdentNode: isIdentNode,
  collectAstDataValueNodes: collectAstDataValueNodes,
  isFunctionNode: isFunctionNode,
  isVariableNode: isVariableNode,
  findNodesWithContent: findNodesWithContent,
  findValueNodes: findValueNodes,
  findDeclarationNodes: findDeclarationNodes
};