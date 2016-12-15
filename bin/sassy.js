var util = require('util');
var dirExists = require('../libs/directories').dirExists;
var walk = require('../libs/directories').walk;
var findNodesOfType = require('../libs/nodes').findNodesOfType;

var rootDir = process.argv[2] || 'test';

if (dirExists(rootDir)) {
  var astData = walk(rootDir);
  var nodes = findNodesOfType('declaration', astData);

  console.log(util.inspect(nodes, false, 5));
}
else {
  console.log(rootDir + ' is not a valid directory!');
}
