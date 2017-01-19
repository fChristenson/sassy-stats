var D = require('../');
var expect = require('chai').expect;
var path = require('path');

describe('directories', function() {
  it('has a module', function() {
    expect(D).to.be.ok;
  });
  
  describe('walk', function() {
    it('parses a scss file into a ast array', function() {
      var files = D.walk(path.join(__dirname, 'testing_dir'));
      expect(files.data.length).to.equal(1);
      expect(files.data[0].type).to.equal('stylesheet');
    });

    it('returns an object with the number of files walked and an ast array', function() {
      var files = D.walk(path.join(__dirname, 'testing_dir'));
      expect(typeof files).to.equal('object');
      expect(files.count).to.equal(1);
      expect(files.data[0].type).to.equal('stylesheet');
    });

    it('returns an object walked files over multiple dirs', function() {
      var files = D.walk(path.join(__dirname, 'testing_dir4'));
      expect(typeof files).to.equal('object');
      expect(files.count).to.equal(5);
      expect(files.data[0].type).to.equal('stylesheet');
    });

    it('parses scss files while it walks directories', function() {
      var files = D.walk(path.join(__dirname, 'testing_dir2'));
      expect(files.data.length).to.equal(2);
      expect(files.data[0].type).to.equal('stylesheet');
      expect(files.data[1].type).to.equal('stylesheet');
    });

    it('ignores anything that is not a .scss file', function() {
      var files = D.walk(path.join(__dirname, 'testing_dir3'));
      expect(files.data.length).to.equal(2);
      expect(files.data[0].type).to.equal('stylesheet');
      expect(files.data[1].type).to.equal('stylesheet');
    });
  });

  describe('dirExists', function() {
    it('returns true if the dir exists', function() {
      expect(D.dirExists(path.join(__dirname, 'testing_dir'))).to.equal(true);
    });

    it('returns false if the dir does not exists', function() {
      expect(D.dirExists(path.join(__dirname, 'fail'))).to.equal(false);
    });
  });
});