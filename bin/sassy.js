var dirExists = require('../libs/directories').dirExists;
var walk = require('../libs/directories').walk;
var lib = require('../libs');
var util = require('util');

var rootDir = process.argv[2];

if (dirExists(rootDir)) {
  var astData = walk(rootDir);
  var data = lib(astData);

  Object.keys(data)
  .forEach(function (key) {
    console.log(key + ': ' + util.inspect(data[key], false, Infinity));
  });

}
else {
  console.log(rootDir + ' is not a valid directory!');
}
