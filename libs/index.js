var Fonts = require('./fonts');
var Variables = require('./variables');
var Mixins = require('./mixins');
var Functions = require('./functions');
var Colors = require('./colors');
var D = require('./declarations');
var get = require('lodash').get;

function isDeclaration(type) {
  return function(obj) {
    return get(obj, 'type') === type;  
  };
}

var isVarDeclaration = isDeclaration('variable');
var isMixinDeclaration = isDeclaration('mixin');
var isFunctionDeclaration = isDeclaration('function');

function unusedRefsToStats(acc, nextVar) {
  acc[get(nextVar, 'name', '')] = 0;
  return acc; 
}

function getVariableStats(astData) {
  var varStats = Variables.nodesToVariableUsages(astData);
  var unusedVars = D.findUnusedDeclaration(astData)
    .filter(isVarDeclaration)
    .reduce(unusedRefsToStats, {});

  return Object.assign({}, varStats, unusedVars);
}

function getMixinStats(astData) {
  var mixinStats = Mixins.nodesToMixinUsages(astData);
  var unusedMixins = D.findUnusedDeclaration(astData)
    .filter(isMixinDeclaration)
    .reduce(unusedRefsToStats, {});

  return Object.assign({}, mixinStats, unusedMixins);
}

function getFunctionStats(astData) {
  var functionStats = Functions.nodesToFunctionUsages(astData);
  var unusedfunctions = D.findUnusedDeclaration(astData)
    .filter(isFunctionDeclaration)
    .reduce(unusedRefsToStats, {});

  return Object.assign({}, functionStats, unusedfunctions);
}

module.exports = function(astData) {
  return {
    variables: getVariableStats(astData),
    mixins: getMixinStats(astData),
    functions: getFunctionStats(astData),
    colors: Colors.nodesToColorUsages(astData),
    fonts: Fonts.nodesToFontUsages(astData)
  };
};
