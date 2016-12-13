var fs = require('fs');
var path = require('path');
var util = require('util');
var cssom = require('cssom');
var flattenDeep = require('lodash').flattenDeep;

var rootDir = process.argv[2];

if (dirExists(rootDir)) {
  var data = flattenDeep(walk(rootDir));
  console.log(util.inspect(data, false, Infinity));
}
else {
  console.log(rootDir + ' is not a valid directory!');
}

function walk (dir) {
  var result = [];
  var files = fs.readdirSync(dir);

  files.forEach(function (file) {
    var filePath = path.resolve(process.cwd(), dir, file);

    if (isDir(filePath)) {
      result.push(walk(filePath));
    }
    else {
      result.push(fileToCssRule(filePath));
    }

  });

  return result;
}

function fileToCssRule (filePath) {
  var cssRules = cssom.parse(fs.readFileSync(filePath, 'utf8'));
  cssRules.filePath = filePath;
  return cssRules;
}

function isDir (file) {
  var stat = fs.statSync(file);
  return stat.isDirectory() ? true : false;
}

function dirExists (dir) {
  return dir && fs.existsSync(dir);
}
