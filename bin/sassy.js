#!/usr/bin/env node

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

  var modules = Object.keys(data);

  modules
  .forEach(function (key) {
    // print header
    console.log(key.toUpperCase().green);
    console.log('----------------------------'.green);
    
    printCounts(countsToArray(data[key]));

    console.log('');
  });

  console.log('');
}
else {
  console.log(rootDir + ' is not a valid directory!');
}

function printCounts (counts) {
  counts.forEach(function (count) {
    // we split so slugs get a space
    console.log(count.key.split('_').join(' ').yellow + ': ' + count.val.toString().red);
  });
}

// {}->[{}]
function countsToArray (obj) {
  return Object.keys(obj)
  .reduce(function (acc, key) {
    acc.push({key: key, val: obj[key]});
    return acc;
  }, [])
  .sort(function (a, b) {
    return b.val - a.val;
  });
}

function printName () {
  console.log(' ____   __   ____  ____  _  _ '.magenta);
  console.log('/ ___) / _\\ / ___)/ ___)( \\/ )'.magenta);
  console.log('\\___ \\/    \\\\___ \\\\___ \\ )  / '.magenta);
  console.log('(____/\\_/\\_/(____/(____/(__/  '.magenta);
}