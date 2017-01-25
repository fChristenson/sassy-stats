var get = require('lodash').get;
var head = require('lodash').head;
var tail = require('lodash').tail;
var makeValueType = require('../common').makeValueType;
var concat = require('../common').concat;
var isNotEmptyString = require('../common').isNotEmptyString;
var rulesetNodeToSelectorArray = require('./rulesetNodeToSelectorArray');

function findSelectors(nodes) {
  return nodes
  .reduce(nodeToContent, [])
  .filter(isRuleSetNode)
  .map(ruleSetToTypes)
  .reduce(concat, [])
  .map(selectorTypeToSelector)
  .reduce(concat, [])
  .map(trim)
  .filter(isNotEmptyString);
}

function trim(val) {
  var tmp = typeof val === 'string' ? val : '';
  return tmp.trim();
}

function selectorTypeToSelector(selectorType) {
  var children = get(selectorType, 'children', []);

  if(children.length <= 0) {
    return [selectorType.name];
  }

  var selectorAccumulator = {selector: selectorType.name, selectors: []};
  return childrenToSelector(selectorAccumulator, children);
}

function childrenToSelector(parentSelector, types) {
  if(get(types, 'length', 0) <= 0) return parentSelector.selectors;

  var first = head(types);
  var children = get(first, 'children', []);
  var selector = parentSelector.selector + ' ' + first.name;
  
  if(children.length <= 0) parentSelector.selectors.push(selector);

  if(children.length > 0) {
    var tmp = Object.assign({}, parentSelector);
    tmp.selector = selector;
    tmp.selectors = tmp.selectors.concat(childrenToSelector(tmp, children));
  }

  return childrenToSelector(parentSelector, tail(types));
}

function ruleSetToTypes(node) {
  var selectors = [getTypes(node)].reduce(concat, []);
  var block = getBlockNode(node);

  var childRules = block
  .filter(isRuleSetNode)
  .map(ruleSetToTypes)
  .reduce(concat, []);

  return selectors.map(addChildRules(childRules));
}

var addChildRules = function(childRules) {
  return function(selector) {
    selector.children = childRules;
    return selector;
  };
};

function getBlockNode(node) {
  var content = get(node, 'content', []);
  return get(content.filter(isBlockNode), '[0].content');
}

function isBlockNode(node) {
  return get(node, 'type') === 'block';
}

function nodeToContent(acc, node) {
  return acc.concat(get(node, 'content', []));
}

function getTypes(node) { 
  var selectors = rulesetNodeToSelectorArray(node);

  return chainedSelectorArrayToStrings(selectors)
    .map(joinArray)
    .map(splitOnSpace)
    .filter(isNotEmptyString)
    .map(selectorToType);
}

function selectorToType(array) {
  var last = array[array.length - 1];
  var type = selectorToSelectorType(last);

  return makeValueType(type, array.join(' '));
}

function splitOnSpace(str) {
  return str.split(' ');
}

function joinArray(array) {
  return array.join('');
}

function chainedSelectorArrayToStrings(selectors) {
  return selectors.filter(isNotSpace).filter(isNotColon);
}

function isNotSpace(val) {
  if(typeof val !== 'string') return true;
  return val.trim() !== '';
}

function isNotColon(val) {
  if(typeof val !== 'string') return true;
  return val.trim() !== ',';
}

function selectorToSelectorType(val) {
  if(typeof val !== 'string' || val === '') return '';

  if(/^\./.test(val)) return 'class';
  if(/^#/.test(val)) return 'id';
  
  return 'typeSelector';
}

function isRuleSetNode(node) {
  return get(node, 'type') === 'ruleset';
}

module.exports = {
  rulesetNodeToSelectorArray: rulesetNodeToSelectorArray,
  findSelectors: findSelectors
};
