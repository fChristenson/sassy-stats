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

  modules.forEach(printList);

  console.log('');
} else {
  console.log(rootDir + ' is not a valid directory!');
}

function printList(key) {
  console.log(key.toUpperCase().green);
  console.log('----------------------------'.green);
  countsToArray(data[key]).forEach(printLine);
  console.log('');
}

function printLine(count) {
  var keyStr = count.key.trim() + ':';
  console.log(keyStr.yellow + getSpaces(keyStr) + count.val.toString().red);
}

function getSpaces(str) {
  var result = '';

  for(var i = 0; i < 40 - str.length; i++) {
    result += ' ';
  }

  return result;
}

// {}->[{}]
function countsToArray(obj) {
  return Object.keys(obj)
    .reduce(countsToObjects(obj), [])
    .sort(sortByVal);
}

function sortByVal(a, b) {
  return b.val - a.val;
}

function countsToObjects(obj) {
  return function(acc, key) {
    acc.push({ key: key, val: obj[key] });
    return acc;
  };
}

function printName() {
  console.log(' ____   __   ____  ____  _  _      ____  ____  __  ____  ____ '.magenta);
  console.log('/ ___) / _\\ / ___)/ ___)( \\/ )___ / ___)(_  _)/ _\\(_  _)/ ___)'.magenta);
  console.log('\\___ \\/    \\\\___ \\\\___ \\ )  /(___)\\___ \\  )( /    \\ )(  \\___ \\'.magenta);
  console.log('(____/\\_/\\_/(____/(____/(__/      (____/ (__)\\_/\\_/(__) (____/'.magenta);
}