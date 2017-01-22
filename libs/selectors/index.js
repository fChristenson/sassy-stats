var get = require('lodash').get;
var head = require('lodash').head;
var tail = require('lodash').tail;
var makeValueType = require('../common').makeValueType;
var concat = require('../common').concat;
var util = require('util');

function trim(val) {
  var tmp = typeof val === 'string' ? val : '';
  return tmp.trim();
}

function findSelectors(nodes) {
  return nodes
  .reduce(nodeToContent, [])
  .filter(isRuleSetNode)
  .map(ruleSetToType)
  .map(selectorTypeToSelector)
  .map(function(e) {
    console.log(util.inspect(e, false, Infinity));
    console.log('------------------------------------');
  return e;
  })
  .reduce(concat, [])
  .map(trim);
}

function selectorTypeToSelector(selectorType) {
  var selectorStr = typeToSelector(selectorType);
  var children = get(selectorType, 'children', []);

  if(children.length <= 0) {
    return [selectorStr];
  }

  var selectorAccumulator = {selector: selectorStr, selectors: []};
  return childrenToSelector(selectorAccumulator, children);
}

function childrenToSelector(parentSelector, types) {
  if(get(types, 'length', 0) <= 0) return parentSelector.selectors;

  var first = head(types);
  var children = get(first, 'children', []);
  var selector = parentSelector.selector + typeToSelector(first);
  
  if(children.length <= 0) parentSelector.selectors.push(selector);

  if(children.length > 0) {
    var tmp = Object.assign({}, parentSelector);
    tmp.selector = selector;
    tmp.selectors = tmp.selectors.concat(childrenToSelector(tmp, children));
  }

  return childrenToSelector(parentSelector, tail(types));
}

function typeToSelector(type) {
  switch(type.type) {
  case 'id': 
    return ' #' + type.name;
  
  case 'class': 
    return ' .' + type.name;
  
  default: 
    return ' ' + type.name;
  }
}

function ruleSetToType(node) {
  var selectorNode = get(node, 'content[0]', []);
  var selector = selectorNodeToType(selectorNode);
  var block = get(node, 'content[2].content', []);
  var childRules = block
  .filter(isRuleSetNode)
  .map(ruleSetToType);

  selector.children = childRules;
  return selector;
}

function nodeToContent(acc, node) {
  return acc.concat(get(node, 'content', []));
}

function selectorNodeToType(node) {
  var type = get(node, 'content[0].type');
  var val = get(node, 'content[0].content[0].content', '');
  
  if(type === 'id') return makeValueType('id', val);
  if(type === 'class') return makeValueType('class', val);
  if(type === 'typeSelector') return makeValueType('tag', val);

  return makeValueType();
}

function isRuleSetNode(node) {
  return get(node, 'type') === 'ruleset';
}

module.exports = {
  findSelectors: findSelectors
};
