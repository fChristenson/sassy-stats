var util = require('util');
var dirExists = require('../libs/directories').dirExists;
var walk = require('../libs/directories').walk;

var rootDir = process.argv[2];

if (dirExists(rootDir)) {
  var data = walk(rootDir);
  console.log(util.inspect(data, false, Infinity));
}
else {
  console.log(rootDir + ' is not a valid directory!');
}
