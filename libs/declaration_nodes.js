var get = require('lodash').get;

// AstData->[AstData]
function rootNodeToDeclarations (data) {
  return data[0].content // TODO: make this iter over all root nodes
  .filter(isDeclaration);
}

// {}->Bool
function isDeclaration (obj) {
  return get(obj, 'type') === 'declaration';
}

module.exports = {
  rootNodeToDeclarations: rootNodeToDeclarations
};