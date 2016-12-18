var walk = require('../../libs/directories').walk;
var lib = require('../../libs');
var expect = require('chai').expect;
var path = require('path');

module.exports = function () {
  this.Given('I have a Sass file', function (callback) {
    callback();
  });

  this.When('I run the program', function (callback) {
    expect(this.sassFilesDirectory).to.be.ok;
    var data = walk(this.sassFilesDirectory);
    this.output = lib(data);
    callback();
  });

  this.Given('the file has {arg1:stringInDoubleQuotes}', function (arg1, callback) {
    switch (arg1) {
    case 'mixins':
      this.sassFilesDirectory = path.join(__dirname, 'test_files', 'mixins_test_files');
      break;

    case 'fonts':
      this.sassFilesDirectory = path.join(__dirname, 'test_files', 'fonts_test_files');
      break;

    case 'colors':
      this.sassFilesDirectory = path.join(__dirname, 'test_files', 'colors_test_files');
      break;

    case 'variables':
      this.sassFilesDirectory = path.join(__dirname, 'test_files', 'variables_test_files');
      break;

    case 'functions':
      this.sassFilesDirectory = path.join(__dirname, 'test_files', 'functions_test_files');
      break;

    default:
      return callback(Error(arg1 + ' has no matching module'));
    }

    callback();
  });

  this.Then('I should see how many times the {arg1:stringInDoubleQuotes} are used', 
  function (arg1, callback) {
    switch (arg1) {
    case 'colors':
      verifyColors(this.output);
      break;

    case 'fonts':
      verifyFonts(this.output);
      break;

    case 'mixins':
      verifyMixins(this.output);
      break;

    case 'functions':
      verifyFunctions(this.output);
      break;

    case 'variables':
      verifyVariables(this.output);
      break;

    default:
      return callback(new Error(arg1 + ' has no matching module!'));
    }

    callback();
  });
};

function verifyFunctions (output) {
  expect(typeof output).to.equal('object');
  expect(typeof output.functions).to.equal('object');
 
  expect(output.functions.foo).to.equal(1);
}

function verifyVariables (output) {
  expect(typeof output).to.equal('object');
  expect(typeof output.variables).to.equal('object');
 
  expect(output.variables.bar).to.equal(1);
  expect(output.variables.baz).to.equal(2);
}

function verifyMixins (output) {
  expect(typeof output).to.equal('object');
  expect(typeof output.mixins).to.equal('object');
 
  expect(output.mixins.foo).to.equal(2);
}

function verifyFonts (output) {
  expect(typeof output).to.equal('object');
  expect(typeof output.fonts).to.equal('object');
 
  expect(output.fonts.helvetica).to.equal(1);
  expect(output.fonts.serif).to.equal(1);
}

function verifyColors (output) {
  expect(typeof output).to.equal('object');
  expect(typeof output.colors).to.equal('object');
 
  expect(output.colors['#ffffff']).to.equal(3);
  expect(output.colors['white']).to.equal(1);
  expect(output.colors['#fff']).to.equal(1);
  expect(output.colors['#eee']).to.equal(1);
  expect(output.colors['orange']).to.equal(1);
  expect(output.colors['#000000']).to.equal(1);
}