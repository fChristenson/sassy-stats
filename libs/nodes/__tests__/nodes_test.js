var walk = require('../../directories').walk;
var path = require('path');
var N = require('../');
var expect = require('chai').expect;
var util = require('util');

describe('nodes', function () {
  it('has a module', function () {
    expect(N).to.be.ok;
  });

  describe('findNodesWithContent', function () {
    it('find a node', function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = N.findNodesWithContent('color', data);
      expect(nodes.length).to.equal(1);
      expect(nodes[0].content).to.equal('color');
    });

    it('return empty array if no match is found', function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = N.findNodesWithContent('fail', data);
      expect(nodes.length).to.equal(0);
    });
  });

  describe('findNodesOfType', function () {
    it('finds a node', function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = N.findNodesOfType('declaration', data);
      expect(nodes.length).to.equal(1);
      expect(nodes[0].type).to.equal('declaration');
    });

    it('returns an emtpy array if no match is found', function () {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var nodes = N.findNodesOfType('fail', data);
      expect(nodes.length).to.equal(0);
    });
  });
});