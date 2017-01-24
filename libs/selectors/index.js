var get = require('lodash').get;
var head = require('lodash').head;
var tail = require('lodash').tail;
var flattenDeep = require('lodash').flattenDeep;
var makeValueType = require('../common').makeValueType;
var concat = require('../common').concat;
var isNotEmptyString = require('../common').isNotEmptyString;
var util = require('util');
var isSelectorNode = require('../nodes').isSelectorNode;
var rulesetNodeToSelectorArray = require('./rulesetNodeToSelectorArray');

function trim(val) {
  var tmp = typeof val === 'string' ? val : '';
  return tmp.trim();
}

function findSelectors(nodes) {
  return nodes
  .reduce(nodeToContent, [])
  .filter(isRuleSetNode)
  .map(ruleSetToType)
  .reduce(concat, [])
  .map(selectorTypeToSelector)
  .reduce(concat, [])
  .map(trim)
  .filter(isNotEmptyString);
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
  var selectors = ruleSetNodeToType(node).reduce(concat, []);
  var block = getBlockNode(node);

  var childRules = block
  .filter(isRuleSetNode)
  .map(ruleSetToType)
  .reduce(concat, []);

  return selectors
    .map(function(selector) {
      selector.children = childRules;
      return selector;
    });
}

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

function ruleSetNodeToType(node) {
  return get(node, 'content', [])
    .filter(isSelectorNode)
    .map(nodeToType)
    .concat([nodeToType(node)]);
}

function nodeToType(node) {
  var type = getType(node);
  var val = getVal(node);

  if(type === 'id') return makeValueType('id', val);
  if(type === 'class') return makeValueType('class', val);
  if(type === 'typeSelector') return makeValueType('tag', val);

  return makeValueType();
}

function getType(node) {
  if(isCombinatorNode(node)) return getCombinatorType(node);
  if(isChainedSelectorNode(node)) return getChainedSelectorType(node);
  if(isSelectorNode(node)) return get(node, 'content[0].type'); 

  return '';
}

function isChainedSelectorNode(node) {
  if(!isRuleSetNode(node)) return false;

  var selectors = rulesetNodeToSelectorArray(node);
  var tmp = chainedSelectorArrayToStrings(selectors);
  tmp = tmp.map(filterSubArray);
  
  return tmp.every(hasMoreThanOneElement);
}

function hasMoreThanOneElement(array) {
  return Array.isArray(array) && array.length > 1;
}

function filterSubArray(subArray) {
  return subArray
  .filter(isNotSpace)
  .filter(isNotColon)
  .filter(isNotCombinator);
}

function isNotCombinator(val) {
  var combinators = ['>', '+'];
  return combinators.indexOf(val) === -1;
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

function getChainedSelectorType(node) {
  var selectors = rulesetNodeToSelectorArray(node);
  var tmp = chainedSelectorArrayToStrings(selectors);
  tmp = tmp.map(filterSubArray);
  var selector = get(tmp, '[0]', []).pop();

  return selectorToSelectorType(selector);
}

function selectorToSelectorType(val) {
  if(typeof val !== 'string' || val === '') return '';

  if(/^\./.test(val)) return 'class';
  if(/^#/.test(val)) return 'id';
  
  return 'tag';
}

function isAttributeNode(node) {
  return get(node, 'content[1].type') === 'attributeSelector';
}

function isCombinatorNode(node) {
  if(!isSelectorNode(node)) return false;

  var type = get(node, 'content[2].type');
  var content = get(node, 'content[2].content');

  return type === 'combinator' && isCombinator(content);
}

function isCombinator(val) {
  var combinators = ['+', '>', '~'];
  return combinators.indexOf(val) !== -1;
}

function getCombinatorType(node) {
  return get(node, 'content[4].type');
}

function getCombinatorVal(node) {
  return get(node, 'content[4].content[0].content');
}

function getAttributeVal(node) {
  var selector = get(node, 'content[0].content[0].content');
  var attributeName = get(node, 'content[1].content[0].content', '');
  var attributeMatch = get(node, 'content[1].content[1].content', '');
  var attributeValue = get(node, 'content[1].content[2].content', '');

  return selector + '[' + attributeName + attributeMatch + attributeValue + ']';
}

function getVal(node) {
  if(isCombinatorNode(node)) return getCombinatorVal(node);
  if(isAttributeNode(node)) return getAttributeVal(node);
  if(isChainedSelectorNode(node)) return getChainedSelectorVal(node);
  
  return get(node, 'content[0].content[0].content', '') + getPseudoSelector(node);
}

function getChainedSelectorVal(node) {
  var selectors = rulesetNodeToSelectorArray(node);
  var tmp = chainedSelectorArrayToStrings(selectors);
  var cleanArray = get(tmp.map(filterSubArray), '[0]', []);

  return cleanArray.join(' ');
}

function getPseudoSelector(node) {
  var type = get(node, 'content[1].type', '');

  if(type !== 'pseudoClass') return '';

  return ':' + get(node, 'content[1].content[0].content', '');
}

function isRuleSetNode(node) {
  return get(node, 'type') === 'ruleset';
}

module.exports = {
  rulesetNodeToSelectorArray: rulesetNodeToSelectorArray,
  findSelectors: findSelectors
};
