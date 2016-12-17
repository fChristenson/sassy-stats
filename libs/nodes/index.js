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
var isVariableNode = isNodeType('variable');

// AstData->Boolean
var isSimpleSelectorNode = isNodeType('simpleSelector');

// AstData->Boolean
var isFunctionNode = isNodeType('function');

// []->AstData->[AstData]
function collectAstDataValueNodes (acc, node) {
  return acc.concat(findValueNodes(astDataToContent(node)));
}

// _->Number->Boolean
var isIdentNode = isNodeType('ident');

module.exports = {
  findIncludeNodes: findIncludeNodes,
  isIdentNode: isIdentNode,
  isSimpleSelectorNode: isSimpleSelectorNode,
  collectAstDataValueNodes: collectAstDataValueNodes,
  isFunctionNode: isFunctionNode,
  isVariableNode: isVariableNode,
  findNodesWithContent: findNodesWithContent,
  findValueNodes: findValueNodes,
  findDeclarationNodes: findDeclarationNodes
};