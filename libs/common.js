var get = require('lodash').get;

// AstData->[AstData]
function astDataToContent (node) {
  return get(node, 'content', []);
}

module.exports = {
  astDataToContent: astDataToContent
};