var F = require('../');
var expect = require('chai').expect;
var path = require('path');
var walk = require('../../directories').walk;

describe('functions', function() {
  it('has a module', function() {
    expect(F).to.be.ok;
  });

  describe('nodesToFunctionUsages', function() {
    it('returns an object where each key is the func name and the value is the number of references', 
    function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = F.nodesToFunctionUsages(files.data);
      expect(stats.foo).to.equal(1);
    });

    it('should not have any other keys apart from the names of the funcs found', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = F.nodesToFunctionUsages(files.data);
      expect(stats.foo).to.equal(1);
      expect(Object.keys(stats).length).to.equal(1);
    });

    it('counts func usages over multiple files', function() {
      var files = walk(path.join(__dirname, 'testing_dir2'));
      var stats = F.nodesToFunctionUsages(files.data);
      expect(stats.foo).to.equal(3);
    });

    it('does not count native css functions', function() {
      var files = walk(path.join(__dirname, 'testing_dir3'));
      var stats = F.nodesToFunctionUsages(files.data);
      expect(Object.keys(stats).length).to.equal(1);
      expect(stats.foo).to.equal(2);
    });

    it('does not count native scss functions', function() {
      var files = walk(path.join(__dirname, 'testing_dir4'));
      var stats = F.nodesToFunctionUsages(files.data);
      expect(Object.keys(stats).length).to.equal(1);
      expect(stats.foo).to.equal(2);
    });
  });
});