var get = require('lodash').get;
var util = require('util');

// AstData->[AstData]
function astDataToContent(node) {
  return get(node, 'content', []);
}

// a->a
function inspect(val) {
  console.log(util.inspect(val, false, Infinity));
  console.log('----------------------------------');
  return val;
}

// string->string->{}
function makeValueType(type, str) {
  return {type: type, name: str};
}

// []->[]->[]
function concat(array1, array2) {
  return array1.concat(array2);
}

// {}->String->{}
function countProps(acc, prop) {
  if (acc[prop] === undefined) {
    acc[prop] = 1;
  }
  else {
    acc[prop] += 1;
  }
  return acc;
}

// a->bool
function isNotEmptyString(val) {
  return val !== '';
}

module.exports = {
  isNotEmptyString: isNotEmptyString,
  countProps: countProps,
  concat: concat,
  astDataToContent: astDataToContent,
  inspect: inspect,
  makeValueType: makeValueType
};