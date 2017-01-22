var D = require('../');
var path = require('path');
var walk = require('../../directories').walk;
var expect = require('chai').expect;

describe('selectors', function() {
  it('has a module', function() {
    expect(D).to.be.ok;
  });

  describe('findSelectors', function() {
    it('finds all selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = D.findSelectors(files.data);
      expect(stats.length).to.equal(3);
      expect(stats).to.include('#foo');
      expect(stats).to.include('.bar');
      expect(stats).to.include('a');
    });

    it('finds all nested selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir2'));
      var stats = D.findSelectors(files.data);
      expect(stats.length).to.equal(5);
      expect(stats).to.include('#foo .bar');
      expect(stats).to.include('#foo .foo');
      expect(stats).to.include('#foo .baz');
      expect(stats).to.include('.bar .foo');
      expect(stats).to.include('.baz');
    });

    it('finds deeply nested selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir3'));
      var stats = D.findSelectors(files.data);
      expect(stats.length).to.equal(1);
      expect(stats).to.include('a .foo #bar .baz');
    });

    it('finds deeply nested selectors with varying children', function() {
      var files = walk(path.join(__dirname, 'testing_dir4'));
      var stats = D.findSelectors(files.data);
      expect(stats.length).to.equal(3);
      expect(stats).to.include('a button');
      expect(stats).to.include('a .foo #bar .baz');
      expect(stats).to.include('a .foo #bar .omg input');
    });
  });
});