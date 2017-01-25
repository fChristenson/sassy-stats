var Fonts = require('./fonts');
var Variables = require('./variables');
var Mixins = require('./mixins');
var Functions = require('./functions');
var Colors = require('./colors');
var Declarations = require('./declarations');
var Selectors = require('./selectors');
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
  var unusedVars = Declarations.findUnusedDeclaration(astData)
    .filter(isVarDeclaration)
    .reduce(unusedRefsToStats, {});

  return Object.assign({}, varStats, unusedVars);
}

function getMixinStats(astData) {
  var mixinStats = Mixins.nodesToMixinUsages(astData);
  var unusedMixins = Declarations.findUnusedDeclaration(astData)
    .filter(isMixinDeclaration)
    .reduce(unusedRefsToStats, {});

  return Object.assign({}, mixinStats, unusedMixins);
}

function getFunctionStats(astData) {
  var functionStats = Functions.nodesToFunctionUsages(astData);
  var unusedfunctions = Declarations.findUnusedDeclaration(astData)
    .filter(isFunctionDeclaration)
    .reduce(unusedRefsToStats, {});

  return Object.assign({}, functionStats, unusedfunctions);
}

function getSelectorStats(astData) {
  return Selectors.findSelectors(astData)
    .reduce(collectSelectorStats, {id: 0, class: 0, tag: 0});
}

function collectSelectorStats(acc, selector) {
  if(/^#/.test(selector)) {
    acc.id++;
    return acc;
  }

  if(/^\./.test(selector)) {
    acc.class++;
    return acc;
  }

  acc.tag++;
  return acc;
}

module.exports = function(astData) {
  return {
    variables: getVariableStats(astData),
    mixins: getMixinStats(astData),
    functions: getFunctionStats(astData),
    colors: Colors.nodesToColorUsages(astData),
    fonts: Fonts.nodesToFontUsages(astData),
    selectors: getSelectorStats(astData)
  };
};
