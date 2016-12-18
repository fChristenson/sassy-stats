var fs = require('fs');
var path = require('path');
var flattenDeep = require('lodash').flattenDeep;
var thematic = require('sass-thematic');


// Path->[{}]
function walk (dir) {
  var result = [];
  var files = fs.readdirSync(dir);

  files.forEach(function (file) {
    var filePath = path.resolve(process.cwd(), dir, file);

    if (isDir(filePath)) {
      result.push(walk(filePath));
    }
    else if (/\.scss$/.test(filePath)) {
      result.push(thematic.parseASTSync({file: filePath}));
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
  return dir && fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

module.exports = {
  walk: walk,
  dirExists: dirExists
};