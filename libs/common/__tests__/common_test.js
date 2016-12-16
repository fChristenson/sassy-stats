var C = require('../');
var expect = require('chai').expect;

describe('common', function () {
  it('has a module', function () {
    expect(C).to.be.ok;
  });

  describe('astDataToContent', function () {
    it('returns an empty array if object has node content', function () {
      var result = C.astDataToContent({});
      expect(Array.isArray(result)).to.equal(true);
      expect(result.length).to.equal(0);
    });

    it('returns the content array of a node', function () {
      var result = C.astDataToContent({content: [{}]});
      expect(Array.isArray(result)).to.equal(true);
      expect(result.length).to.equal(1);
    });
  });
});