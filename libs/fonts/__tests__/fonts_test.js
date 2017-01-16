var F = require('../');
var expect = require('chai').expect;
var path = require('path');
var walk = require('../../directories').walk;

describe('fonts', function() {
  it('has a module', function() {
    expect(F).to.be.ok;
  });

  describe('nodesToFontUsages', function() {
    it('returns font count', function() {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var stats = F.nodesToFontUsages(data);
      expect(stats.helvetica).to.equal(1);
      expect(stats.serif).to.equal(1);
    });

    it('should not have any other keys apart from the names of the fonts found', function() {
      var data = walk(path.join(__dirname, 'testing_dir'));
      var stats = F.nodesToFontUsages(data);
      expect(stats.helvetica).to.equal(1);
      expect(stats.serif).to.equal(1);
      expect(Object.keys(stats).length).to.equal(2);
    });

    it('counts font usages over multiple files', function() {
      var data = walk(path.join(__dirname, 'testing_dir2'));
      var stats = F.nodesToFontUsages(data);
      expect(stats.helvetica).to.equal(2);
    });
    

    it('returns spaced font names as slugs', function() {
      var data = walk(path.join(__dirname, 'testing_dir3'));
      var stats = F.nodesToFontUsages(data);
      expect(stats.Times_New_Roman).to.equal(1);
      expect(stats.sans_serif).to.equal(1);
      expect(Object.keys(stats).length).to.equal(2);
    });

    it('counts both font-family and font refs', function() {
      var data = walk(path.join(__dirname, 'testing_dir4'));
      var stats = F.nodesToFontUsages(data);
      expect(stats.helvetica).to.equal(2);
    });
  });
});