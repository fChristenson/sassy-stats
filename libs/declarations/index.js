// String->[AstData]->Number
function countUsages (name, nodes) {
  return findNodesWithContent(name, nodes).length;
}

module.exports = {
  countUsages: countUsages
};