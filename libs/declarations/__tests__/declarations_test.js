var D = require('../');
var path = require('path');
var walk = require('../../directories').walk;
var expect = require('chai').expect;

describe('declarations', function () {
  it('has a module', function () {
    expect(D).to.be.ok;
  });


});