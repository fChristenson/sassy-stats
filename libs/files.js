var cssom = require('cssom');
var fs = require('fs');

// Path->{}
function fileToCssRule (filePath) {
  var cssRules = cssom.parse(fs.readFileSync(filePath, 'utf8'));
  cssRules.filePath = filePath;
  return cssRules;
}

module.exports = {
  fileToCssRule: fileToCssRule
};