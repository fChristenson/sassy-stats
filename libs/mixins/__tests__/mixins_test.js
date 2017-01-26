var M = require('../');
var expect = require('chai').expect;
var path = require('path');
var walk = require('../../directories').walk;

describe('mixins', function() {
  it('has a module', function() {
    expect(M).to.be.ok;
  });

  describe('nodesToMixinUsages', function() {
    it('returns an object with mixin usage counts', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = M.nodesToMixinUsages(files.data);
      expect(stats.foo).to.equal(2);
    });

    it('should not have any other keys apart from the names of the mixins found', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = M.nodesToMixinUsages(files.data);
      expect(stats.foo).to.equal(2);
      expect(Object.keys(stats).length).to.equal(1);
    });

    it('counts mixin usages over multiple files', function() {
      var files = walk(path.join(__dirname, 'testing_dir2'));
      var stats = M.nodesToMixinUsages(files.data);
      expect(stats.foo).to.equal(4);
    });

    it('does not count mixin declarations', function() {
      var files = walk(path.join(__dirname, 'testing_dir3'));
      var stats = M.nodesToMixinUsages(files.data);
      expect(Object.keys(stats).length).to.equal(0);
    });
  });
});