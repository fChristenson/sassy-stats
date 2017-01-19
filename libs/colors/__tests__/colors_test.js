var F = require('../');
var expect = require('chai').expect;
var path = require('path');
var walk = require('../../directories').walk;

describe('colors', function() {
  it('has a module', function() {
    expect(F).to.be.ok;
  });

  describe('nodesToColorUsages', function() {
    it('returns color count', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = F.nodesToColorUsages(files.data);
      expect(stats['fff']).to.equal(1);
      expect(stats['ffffff']).to.equal(1);
      expect(stats['white']).to.equal(1);
      expect(stats['rgba(255, 255, 255, 1)']).to.equal(1);
      expect(stats['rgb(255, 255, 255)']).to.equal(1);
      expect(stats['rgb(0, 0, 0)']).to.equal(1);
      expect(stats['eee']).to.equal(1);
      expect(stats['orange']).to.equal(1);
    });

    it('should not have any other keys apart from the names of the colors found', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = F.nodesToColorUsages(files.data);
      expect(stats['fff']).to.equal(1);
      expect(stats['ffffff']).to.equal(1);
      expect(stats['white']).to.equal(1);
      expect(stats['rgba(255, 255, 255, 1)']).to.equal(1);
      expect(stats['rgb(255, 255, 255)']).to.equal(1);
      expect(stats['rgb(0, 0, 0)']).to.equal(1);
      expect(stats['eee']).to.equal(1);
      expect(stats['orange']).to.equal(1);
      expect(Object.keys(stats).length).to.equal(8);
    });

    it('counts color usages over multiple files', function() {
      var files = walk(path.join(__dirname, 'testing_dir2'));
      var stats = F.nodesToColorUsages(files.data);
      expect(stats['000']).to.equal(2);
      expect(Object.keys(stats).length).to.equal(1);
    });

    it('returns empty array if no colors are in the files', function() {
      var files = walk(path.join(__dirname, 'testing_dir3'));
      var stats = F.nodesToColorUsages(files.data);
      expect(Object.keys(stats).length).to.equal(0);
    });
  });
});