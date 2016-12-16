var get = require('lodash').get;
var util = require('util');

// AstData->[AstData]
function astDataToContent (node) {
  return get(node, 'content', []);
}

// a->a
function inspect (val) {
  console.log(util.inspect(val, false, Infinity));
  return val;
}

// []->[]->[]
function concat (array1, array2) {
  return array1.concat(array2);
}

module.exports = {
  concat: concat,
  astDataToContent: astDataToContent,
  inspect: inspect
};