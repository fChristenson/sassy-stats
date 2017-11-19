var D = require('../');
var path = require('path');
var walk = require('../../directories').walk;
var expect = require('chai').expect;

describe('declarations', function() {
  it('has a module', function() {
    expect(D).to.be.ok;
  });

  describe('findDeclarations', function() {
    it('walks the ast node tree and finds all declarations', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = D.findDeclarations(files.data);
      expect(stats.length).to.equal(3);
      expect(stats).to.deep.include({ type: 'variable', name: 'foo' });
      expect(stats).to.deep.include({ type: 'function', name: 'bar' });
      expect(stats).to.deep.include({ type: 'mixin', name: 'baz' });
    });

    it('only picks up declaration', function() {
      var files = walk(path.join(__dirname, 'testing_dir2'));
      var stats = D.findDeclarations(files.data);
      expect(stats.length).to.equal(3);
      expect(stats).to.include({ type: 'variable', name: 'foo' });
      expect(stats).to.include({ type: 'function', name: 'bar' });
      expect(stats).to.include({ type: 'mixin', name: 'baz' });
    });
  });

  describe('findUnusedDeclaration', function() {
    it('returns a list of unused declarations', function() {
      var files = walk(path.join(__dirname, 'testing_dir3'));
      var stats = D.findUnusedDeclaration(files.data);
      expect(stats.length).to.equal(1);
      expect(stats[0]).to.deep.equal({ type: 'variable', name: 'foo' });
    });
  });
});
