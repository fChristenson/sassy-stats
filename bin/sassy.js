var util = require('util');
var dirExists = require('../libs/directories').dirExists;
var walk = require('../libs/directories').walk;
var astDataToVariableStats = require('../libs/variable_stats').astDataToVariableStats;

var rootDir = process.argv[2];

if (dirExists(rootDir)) {
  var astData = walk(rootDir);
  //console.log(util.inspect(astData[0], false, 2));

  var variableStats = astDataToVariableStats(astData);
  console.log('----------------------');
  console.log(util.inspect(variableStats, false, 4));
}
else {
  console.log(rootDir + ' is not a valid directory!');
}
