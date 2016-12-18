var dirExists = require('../libs/directories').dirExists;
var walk = require('../libs/directories').walk;
var lib = require('../libs');
var util = require('util');

var rootDir = process.argv[2];

if (dirExists(rootDir)) {
  var astData = walk(rootDir);
  var data = lib(astData);

  printName();
  console.log('----------------------------');
  console.log('');

  Object.keys(data)
  .forEach(function (key) {
    console.log(key + ': ' + util.inspect(data[key], false, Infinity));
  });

  console.log('');
}
else {
  console.log(rootDir + ' is not a valid directory!');
}

function printName () {
  console.log(' ____   __   ____  ____  _  _ ');
  console.log('/ ___) / _\\ / ___)/ ___)( \\/ )');
  console.log('\\___ \\/    \\\\___ \\\\___ \\ )  / ');
  console.log('(____/\\_/\\_/(____/(____/(__/  ');
}