var Fonts = require('./fonts');
var Variables = require('./variables');
var Mixins = require('./mixins');
var Functions = require('./functions');
var Colors = require('./colors');
var Nodes = require('./nodes');

module.exports = function (astData) {
  var declarationNodes = Nodes.findDeclarationNodes(astData);
  var includeNodes = Nodes.findIncludeNodes(astData);

  return {
    vars: Variables.nodesToVariableUsages(declarationNodes),
    mixins: Mixins.nodesToMixinUsages(includeNodes),
    funcs: Functions.nodesToFunctionUsages(declarationNodes),
    colors: Colors.nodesToColorUsages(astData),
    fonts: Fonts.nodesToFontUsages(declarationNodes)
  };

};