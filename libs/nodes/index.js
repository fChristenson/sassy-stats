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

// String->AstData->Boolean
function nodeIsFound (type, node) {
  return get(node, 'type') === type;
}

// []->Number
function len (array) {
  return get(array, 'length', 0);
}

// String->[AstData]->[]
function findNodesOfType (type, nodes) {

  if (len(nodes) <= 0) return [];

  if (len(nodes) === 1 && !nodeHasArrayContent(head(nodes))) {
    return nodeIsFound(type, head(nodes)) ? nodes : [];
  }

  return nodes
  .reduce(addNodes(type), []);
}

// String->[]->AstData
var addNodes = curry(function (type, acc, node) {
  if (nodeIsFound(type, node)) acc.push(node);

  if (nodeHasArrayContent(node)) {
    acc = acc.concat(findNodesOfType(type, astDataToContent(node)));
  }

  return acc;
});

module.exports = {
  findNodesOfType: findNodesOfType
};