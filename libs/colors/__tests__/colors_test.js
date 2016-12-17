var F = require('../');
var expect = require('chai').expect;
var path = require('path');
var findDeclarationNodes = require('../../nodes').findDeclarationNodes;
var walk = require('../../directories').walk;

describe('colors', function () {
  it('has a module', function () {
    expect(F).to.be.ok;
  });

  describe('nodesToColorUsages', function () {
    it('returns font count', function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = findDeclarationNodes(data);
      var stats = F.nodesToColorUsages(nodes);
      expect(stats).to.include('fff');
      expect(stats).to.include('white');
      expect(stats).to.include('ffffff');
      expect(stats).to.include('eee');
      expect(stats).to.include('000000');
      expect(stats).to.include('orange');
    });

    it('should not have any other keys apart from the names of the colors found', function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = findDeclarationNodes(data);
      var stats = F.nodesToColorUsages(nodes);
      expect(stats).to.include('fff');
      expect(stats).to.include('white');
      expect(stats).to.include('ffffff');
      expect(stats).to.include('eee');
      expect(stats).to.include('000000');
      expect(stats).to.include('orange');
      expect(stats.length).to.equal(6);
    });

    it('counts color usages over multiple files', function () {
      var data = walk(path.join(__dirname, 'testing_dir2'));
      var nodes = findDeclarationNodes(data);
      var stats = F.nodesToColorUsages(nodes);
      expect(stats).to.include('000');
      expect(stats.length).to.equal(1);
    });
  });
});