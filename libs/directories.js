var fs = require('fs');
var path = require('path');
var flattenDeep = require('lodash').flattenDeep;
var fileToCssRule = require('./files').fileToCssRule;

// Path->[{}]
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

  return flattenDeep(result);
}

// Path->Bool
function isDir (file) {
  var stat = fs.statSync(file);
  return stat.isDirectory() ? true : false;
}

// Path->Bool
function dirExists (dir) {
  return dir && fs.existsSync(dir);
}

module.exports = {
  walk: walk,
  isDir: isDir,
  dirExists: dirExists
};