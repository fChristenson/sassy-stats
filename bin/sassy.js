#!/usr/bin/env node

var dirExists = require('../libs/directories').dirExists;
var walk = require('../libs/directories').walk;
var lib = require('../libs');
var P = require('./print_utils');
var pkg = require('../package');
var util = require('util');
var commander = require('commander');
require('colors');

commander
  .version(pkg.version)
  .option('-j, --json', 'output as json')
  .option('-t, --text', 'output as html')
  .parse(process.argv);

var rootDir = process.argv[2];

if (dirExists(rootDir)) {
  var files = walk(rootDir);
  var data = lib(files.data);

  if (commander.json) {
    data.files = files.count;
    console.log(util.inspect(data, false, Infinity));
  } else {
    print(data);
  }

} else {
  console.log(rootDir + ' is not a valid directory!');
}

function print() {
  P.printName();
  console.log('');

  var modules = Object.keys(data);

  modules.forEach(P.makePrintList(data));

  P.printFiles(files);
}