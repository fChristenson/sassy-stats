var get = require('lodash').get;
var isNotEmptyString = require('../common').isNotEmptyString;
var isSelectorNode = require('../nodes').isSelectorNode;

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

module.exports = rulesetNodeToSelectorArray;