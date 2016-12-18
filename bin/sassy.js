var dirExists = require('../libs/directories').dirExists;
var walk = require('../libs/directories').walk;
var lib = require('../libs');
require('colors');

var rootDir = process.argv[2];

if (dirExists(rootDir)) {
  var astData = walk(rootDir);
  var data = lib(astData);

  printName();
  console.log('');

  Object.keys(data)
  .forEach(function (key) {
    console.log(key.toUpperCase().green);
    console.log('----------------------------'.green);
    
    Object.keys(data[key])
    .forEach(function (countKey) {
      console.log(countKey.yellow + ': ' + data[key][countKey].toString().red);
    });

    console.log('');
  });

  console.log('');
}
else {
  console.log(rootDir + ' is not a valid directory!');
}

function printName () {
  console.log(' ____   __   ____  ____  _  _ '.magenta);
  console.log('/ ___) / _\\ / ___)/ ___)( \\/ )'.magenta);
  console.log('\\___ \\/    \\\\___ \\\\___ \\ )  / '.magenta);
  console.log('(____/\\_/\\_/(____/(____/(__/  '.magenta);
}