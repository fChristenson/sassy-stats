var get = require('lodash').get;
var head = require('lodash').head;
var tail = require('lodash').tail;
var makeValueType = require('../common').makeValueType;
var concat = require('../common').concat;
var isNotEmptyString = require('../common').isNotEmptyString;
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
  var selectors = getSelectorNodes(node).map(selectorNodeToType);
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

function getSelectorNodes(node) {
  return get(node, 'content', []).filter(isSelectorNode);
}

function isSelectorNode(node) {
  return get(node, 'type') === 'selector';
}

function nodeToContent(acc, node) {
  return acc.concat(get(node, 'content', []));
}

function selectorNodeToType(node) {
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

  return get(node, 'content[0].type');
}

function isChainedSelectorNode(node) {
  var selectors = rulesetNodeToSelectorArray(node);
  return false;
}

function rulesetNodeToSelectorArray(node) {
  return get(node, 'content', [])
  .map(getContent)
  .filter(isNotEmptyString);
}

function getContent(node) {
  if(isSelectorNode(node)) {
    return get(node, 'content', []).map(selectorNodeContentToSelectorString);
  }

  if(isSpaceNode(node)) return ' ';
  if(isDelimiterNode(node)) return ',';

  return '';
}

function selectorNodeContentToSelectorString(node) {
  if(isPseudoClass(node)) return pseudoClassNodeToString(node);
  if(isAttribute(node)) return attributeToString(node);
  if(isSelector(node)) return selectorNodeToString(node);

  return get(node, 'content', '');
}

function isSpaceNode(node) {
  return get(node, 'type') === 'space';
}

function isDelimiterNode(node) {
  return get(node, 'type') === 'delimiter';
}

function isAttribute(node) {
  return get(node, 'type') === 'attributeSelector';
}

function attributeToString(node) {
  var attributeName = get(node, 'content[0]content', '');
  var attributeMatch = get(node, 'content[1].content', '');
  var attributeValue = get(node, 'content[2].content', '');

  return '[' + attributeName + attributeMatch + attributeValue + ']';
}

function selectorNodeToString(node) {
  var content = get(node, 'content[0].content');
  var type = get(node, 'type');
  return nodeTypeToSelector(type) + content;
}

function pseudoClassNodeToString(node) {
  return ':' + get(node, 'content[0].content');
}

function isPseudoClass(node) {
  return get(node, 'type') === 'pseudoClass';
}

function nodeTypeToSelector(str) {
  switch(str) {
  case 'id': 
    return '#';
  
  case 'class': 
    return '.';
  
  default: 
    return '';
  }
}

function isSelector(node) {
  var selectors = ['typeSelector', 'class', 'id'];
  var type = get(node, 'type');

  return selectors.indexOf(type) !== -1;
}

function isTypeSelector(node) {
  return get(node, 'type') === 'typeSelector';
}

function getChainedSelectorType(node) {
  return;
}

function isAttributeNode(node) {
  return get(node, 'content[1].type') === 'attributeSelector';
}

function isCombinatorNode(node) {
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
  return;
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
