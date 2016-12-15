var D = require('../');
var path = require('path');
var findNodesOfType = require('../../nodes').findNodesOfType;
var walk = require('../../directories').walk;
var expect = require('chai').expect;

describe('declarations', function () {
  it('has a module', function () {
    expect(D).to.be.ok;
  });

  describe('countUsages', function () {
    it('returns 1 if a variable is declared once', function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = findNodesOfType('declaration', data);
      expect(D.countUsages('foo', nodes)).to.equal(1);
    });

    it('returns 2 if a variable is declared once and is references once', function () {
      var data = walk(path.join(__dirname, 'testing_dir2'));
      var nodes = findNodesOfType('declaration', data);
      expect(D.countUsages('foo', nodes)).to.equal(2);
    });
  });
});