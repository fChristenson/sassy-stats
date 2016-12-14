var get = require('lodash').get;
var flatten = require('lodash').flatten;
var astDataToContent = require('./common').astDataToContent;

// [AstData]->[AstData]
function propsToVariableNodes (props) {
  var result = props
  .map(astDataToVariableNodes);

  return flatten(result);
}

// [AstData]->[{}]
function astDataToVariableNodes (data) {
  return astDataToContent(data)
  .filter(isVariable);
}

// {}->Bool
function isVariable (obj) {
  return get(obj, 'type') === 'variable';
}

module.exports = {
  propsToVariableNodes: propsToVariableNodes,
  astDataToVariableNodes: astDataToVariableNodes
};