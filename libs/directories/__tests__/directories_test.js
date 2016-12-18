var D = require('../');
var expect = require('chai').expect;
var path = require('path');

describe('directories', function () {
  it('has a module', function () {
    expect(D).to.be.ok;
  });
  
  describe('walk', function () {
    it('parses a scss file into a ast node', function () {
      var files = D.walk(path.join(__dirname, 'testing_dir'));
      expect(files.length).to.equal(1);
      expect(files[0].type).to.equal('stylesheet');
    });

    it('parses scss files while it walks directories', function () {
      var files = D.walk(path.join(__dirname, 'testing_dir2'));
      expect(files.length).to.equal(2);
      expect(files[0].type).to.equal('stylesheet');
      expect(files[1].type).to.equal('stylesheet');
    });

    it('ignores anything that is not a .scss file', function () {
      var files = D.walk(path.join(__dirname, 'testing_dir3'));
      expect(files.length).to.equal(2);
      expect(files[0].type).to.equal('stylesheet');
      expect(files[1].type).to.equal('stylesheet');
    });
  });

  describe('dirExists', function () {
    it('returns true if the dir exists', function () {
      expect(D.dirExists(path.join(__dirname, 'testing_dir'))).to.equal(true);
    });

    it('returns false if the dir does not exists', function () {
      expect(D.dirExists(path.join(__dirname, 'fail'))).to.equal(false);
    });
  });
});