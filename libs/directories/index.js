var fs = require('fs');
var path = require('path');
var flattenDeep = require('lodash').flattenDeep;
var gonzales = require('gonzales-pe');


// Path->{}
function walk(dir, count) {
  count = (count === undefined) ? 0 : count;

  var result = {count: count, data: [], children: []};
  var files = fs.readdirSync(dir);

  files.forEach(function(file) {
    var filePath = path.resolve(process.cwd(), dir, file);

    if (isDir(filePath)) {
      result.children.push(walk(filePath, count));
    }
    else if (/\.scss$/.test(filePath)) {
      var str = fs.readFileSync(filePath, 'utf8');

      try {
        result.data.push(gonzales.parse(str, {syntax: 'scss'}));
        result.count++;

      } catch(e) {
        console.log('Error found in: ' + filePath);
        console.log(e.message);
      }
    }

  });

  result.count += result.children.reduce(resultsToCount, 0);
  result.data = result.data.concat(flattenDeep(result.children.map(resultToNodes)));
  delete result.children;

  return result;
}

function resultToNodes(node) {
  return node.data;
}

function resultsToCount(acc, obj) {
  return acc + obj.count;
}

// Path->Bool
function isDir(file) {
  var stat = fs.statSync(file);
  return stat.isDirectory() ? true : false;
}

// Path->Bool
function dirExists(dir) {
  return dir && fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

module.exports = {
  walk: walk,
  dirExists: dirExists
};