var get = require('lodash').get;
var head = require('lodash').head;
var tail = require('lodash').tail;
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
  .map(ruleSetToTypes)
  .reduce(concat, [])
  .map(selectorTypeToSelector)
  .reduce(concat, [])
  .map(trim)
  .filter(isNotEmptyString);
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

function ruleSetToTypes(node) {
  var selectors = [nodeToTypes(node)].reduce(concat, []);
  var block = getBlockNode(node);

  var childRules = block
  .filter(isRuleSetNode)
  .map(ruleSetToTypes)
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

function nodeToTypes(node) {
  var types = getTypes(node);
  var vals = getVals(node);

  return types
    .map(function(selectorType) {
      if(selectorType.type === 'id') return makeValueType('id', selectorType.val);
      if(selectorType.type === 'class') return makeValueType('class', selectorType.val);
      if(selectorType.type === 'typeSelector') return makeValueType('tag', selectorType.val);

      return makeValueType();
    });
}

function getTypes(node) {
  if(isMultiSelectorNode(node)) return multiSelectorNodeToTypes(node);
  
  return (isChainedSelectorNode(node) || isSimpleSelectorNode(node)) ? [getChainedSelectorType(node)] : [];
}

function multiSelectorNodeToTypes(node) {
  return [];
}

function isMultiSelectorNode(node) {
  return rulesetNodeToSelectorArray(node).filter(isArray).length > 1;
}

function isArray(val) {
  return Array.isArray(val);
}

function isSimpleSelectorNode(node) {
  if(!isRuleSetNode(node)) return false;

  var selectors = rulesetNodeToSelectorArray(node);
  var tmp = chainedSelectorArrayToStrings(selectors);
  tmp = tmp.map(filterSubArray);
  
  return get(tmp, '[0]', []).length === 1;
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
  .filter(isNotColon);
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
  var filteredTmp = tmp.map(filterSubArray);
  var selector = get(filteredTmp, '[0]', []).pop();

  return selectorToSelectorType(selector);
}

function selectorToSelectorType(val) {
  if(typeof val !== 'string' || val === '') return '';

  if(/^\./.test(val)) return 'class';
  if(/^#/.test(val)) return 'id';
  
  return 'typeSelector';
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

function getVals(node) {
  if(isCombinatorNode(node)) return getCombinatorVal(node);
  if(isAttributeNode(node)) return getAttributeVal(node);
  if(isChainedSelectorNode(node)) return getChainedSelectorVal(node);
  
  return get(node, 'content[0].content[0].content', '') + getPseudoSelector(node);
}

function getChainedSelectorVal(node) {
  var selectors = rulesetNodeToSelectorArray(node);
  var tmp = chainedSelectorArrayToStrings(selectors);
  var cleanArray = get(tmp.map(filterSubArray), '[0]', []);

  return isConcatedSelector(cleanArray) ? cleanArray.join('') : cleanArray.join(' ');
}

function isConcatedSelector(array) {
  if(!Array.isArray(array) || array.length !== 2) return false;

  return /^\[.+\]$/.test(array[1]) || /^:.+$/.test(array[1]);
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
