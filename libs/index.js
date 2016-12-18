var Fonts = require('./fonts');
var Variables = require('./variables');
var Mixins = require('./mixins');
var Functions = require('./functions');
var Colors = require('./colors');

module.exports = function (astData) {

  return {
    vars: Variables.nodesToVariableUsages(astData),
    mixins: Mixins.nodesToMixinUsages(astData),
    funcs: Functions.nodesToFunctionUsages(astData),
    colors: Colors.nodesToColorUsages(astData),
    fonts: Fonts.nodesToFontUsages(astData)
  };

};