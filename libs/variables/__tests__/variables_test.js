var expect = require('chai').expect;
var V = require('../');
var path = require('path');
var walk = require('../../directories').walk;

describe('variables', function() {
  it('has a module', function() {
    expect(V).to.be.ok;
  });

  describe('nodesToVariableUsages', function() {
    it('returns an object where each key is the var name and the value is the number of references',
      function() {
        var files = walk(path.join(__dirname, 'testing_dir'));
        var stats = V.nodesToVariableUsages(files.data);
        expect(stats.bar).to.equal(1);
        expect(stats.baz).to.equal(2);
      });

    it('should not have any other keys apart from the names of the variables found', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = V.nodesToVariableUsages(files.data);
      expect(stats.bar).to.equal(1);
      expect(stats.baz).to.equal(2);
      expect(Object.keys(stats).length).to.equal(2);
    });

    it('counts var usages over multiple files', function() {
      var files = walk(path.join(__dirname, 'testing_dir2'));
      var stats = V.nodesToVariableUsages(files.data);
      expect(stats.bar).to.equal(4);
    });

    it('handles a case such as testing_dir3', function() {
      var files = walk(path.join(__dirname, 'testing_dir3'));
      var stats = V.nodesToVariableUsages(files.data);
      expect(Object.keys(stats).length).to.equal(3);

      expect(Object.keys(stats)).to.include('checkbox-tick');
      expect(stats['checkbox-tick']).to.equal(3);

      expect(Object.keys(stats)).to.include('checkbox-color');
      expect(stats['checkbox-color']).to.equal(2);

      expect(Object.keys(stats)).to.include('checkbox-color--selected');
      expect(stats['checkbox-color--selected']).to.equal(2);
    });

    it('does not count params', function() {
      var files = walk(path.join(__dirname, 'testing_dir4'));
      var stats = V.nodesToVariableUsages(files.data);
      expect(Object.keys(stats).length).to.equal(1);
      expect(Object.keys(stats)).to.include('bar');
    });

    it('reports variables inside functions', function() {
      var files = walk(path.join(__dirname, 'testing_dir5'));
      var stats = V.nodesToVariableUsages(files.data);

      expect(Object.keys(stats).length).to.equal(2);
      expect(Object.keys(stats)).to.include('foo');
      expect(Object.keys(stats)).to.include('bar');
      expect(stats.foo).to.equal(1);
      expect(stats.bar).to.equal(1);
    });

    it('reports variables inside string interpolations', function() {
      var files = walk(path.join(__dirname, 'testing_dir6'));
      var stats = V.nodesToVariableUsages(files.data);
      expect(Object.keys(stats).length).to.equal(1);
      expect(Object.keys(stats)).to.include('sidebar-width');
      expect(stats['sidebar-width']).to.equal(1);
    });
  });
});