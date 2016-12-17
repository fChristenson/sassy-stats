var F = require('../');
var expect = require('chai').expect;
var path = require('path');
var findDeclarationNodes = require('../../nodes').findDeclarationNodes;
var walk = require('../../directories').walk;

describe('functions', function () {
  it('has a module', function () {
    expect(F).to.be.ok;
  });

  describe('nodesToFunctionUsages', function () {
    it('returns an object where each key is the func name and the value is the number of references', 
    function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = findDeclarationNodes(data);
      var stats = F.nodesToFunctionUsages(nodes);
      expect(stats.foo).to.equal(1);
    });

    it('should not have any other keys apart from the names of the funcs found', 
    function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = findDeclarationNodes(data);
      var stats = F.nodesToFunctionUsages(nodes);
      expect(stats.foo).to.equal(1);
      expect(Object.keys(stats).length).to.equal(1);
    });

    it('counts func usages over multiple files', 
    function () {
      var data = walk(path.join(__dirname, 'testing_dir2'));
      var nodes = findDeclarationNodes(data);
      var stats = F.nodesToFunctionUsages(nodes);
      expect(stats.foo).to.equal(3);
    });
  });
});