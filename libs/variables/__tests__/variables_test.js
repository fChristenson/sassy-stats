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
        var data = walk(path.join(__dirname, 'testing_dir'));
        var stats = V.nodesToVariableUsages(data);
        expect(stats.bar).to.equal(1);
        expect(stats.baz).to.equal(2);
      });

    it('should not have any other keys apart from the names of the variables found',
      function() {
        var data = walk(path.join(__dirname, 'testing_dir'));
        var stats = V.nodesToVariableUsages(data);
        expect(stats.bar).to.equal(1);
        expect(stats.baz).to.equal(2);
        expect(Object.keys(stats).length).to.equal(2);
      });

    it('counts var usages over multiple files',
      function() {
        var data = walk(path.join(__dirname, 'testing_dir2'));
        var stats = V.nodesToVariableUsages(data);
        expect(stats.bar).to.equal(4);
      });
  });
});