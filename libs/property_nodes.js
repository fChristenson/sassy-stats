var get = require('lodash').get;
var flatten = require('lodash').flatten;
var astDataToContent = require('./common').astDataToContent;

// [AstData]->[AstData]
function declarationsToProps (declarations) {
  var result = declarations
  .map(astDataToProperties);

  return flatten(result);
}

// [AstData]->[{}]
function astDataToProperties (data) {
  return astDataToContent(data)
  .filter(isProperty);
}

// {}->Bool
function isProperty (obj) {
  return get(obj, 'type') === 'property';
}

module.exports = {
  declarationsToProps: declarationsToProps,
  astDataToProperties: astDataToProperties
};