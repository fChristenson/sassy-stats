var get = require('lodash').get;
var head = require('lodash').head;
var curry = require('lodash').curry;

// String->AstData->Boolean
function nodeHasArrayContent (node) {
  return Array.isArray(astDataToContent(node));
}

// AstData->[AstData]
function astDataToContent (node) {
  return get(node, 'content', []);
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
var findNodesOfType = findNodes('type');

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

module.exports = {
  findNodesOfType: findNodesOfType,
  findNodesWithContent: findNodesWithContent
};