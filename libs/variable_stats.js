var get = require('lodash').get;
var flatten = require('lodash').flatten;
var isString = require('lodash').isString;
var rootNodeToDeclarations = require('./declaration_nodes').rootNodeToDeclarations;
var declarationsToProps = require('./property_nodes').declarationsToProps;
var propsToVariableNodes = require('./variable_nodes').propsToVariableNodes;
var astDataToContent = require('./common').astDataToContent;

// [AstData]->[{}]
function astDataToVariableStats (data) {
  var declarations = rootNodeToDeclarations(data);
  console.log('declarations', declarations);
  
  var props = declarationsToProps(declarations);
  console.log('props', props);

  var varNodes = propsToVariableNodes(props);
  console.log('varNodes', varNodes);
  
  variablesToVariableStats(varNodes);
  return variablesToVariableStats(varNodes);
}

// [AstData]->{}
function variablesToVariableStats (varNodes) {
  var content = varNodes
  .map(astDataToContent);

  var vars = flatten(content);

  return vars.reduce(countVars, {});
}

// {}->AstData->{}
function countVars (acc, node) {
  // content should be a string on a leaf node
  var varName = get(node, 'content');

  if (isString(varName)) {
    acc[varName] = increment(acc[varName]); 
  }

  return acc;
}

// Number->Number
function increment (val) {
  return (val === undefined || val === null) ? 1 : val + 1;
}

module.exports = {
  variablesToVariableStats: variablesToVariableStats,
  astDataToVariableStats: astDataToVariableStats
};