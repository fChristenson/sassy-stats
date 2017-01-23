var S = require('../');
var path = require('path');
var walk = require('../../directories').walk;
var expect = require('chai').expect;

describe('selectors', function() {
  it('has a module', function() {
    expect(S).to.be.ok;
  });

  describe('rulesetNodeToSelectorArray', function() {
    it('turns a selector node into an array of strings', function() {
      var files = walk(path.join(__dirname, 'testing_dir14'));

      var selectorNode = files.data[0].content[0];
      var array = S.rulesetNodeToSelectorArray(selectorNode);
      expect(array.length).to.equal(5);

      var expected = [
        [
          'a', ':visited', ' ', '.foo', ' ', 'input', '[name=foo]', 
          ' ',
          'button', ' ', '+', ' ', '#bar', ' ', '~', ' ', '.baz',
          ' ',
          '>', ' ', '.bax', ':first-child'
        ],
        ',',
        ' ',
        ['#omg'],
        ' '
      ];
      expect(array).to.deep.equal(expected);
    });
  });

  describe('findSelectors', function() {
    it('finds all selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(3);
      expect(stats).to.include('#foo');
      expect(stats).to.include('.bar');
      expect(stats).to.include('a');
    });

    it('finds all nested selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir2'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(5);
      expect(stats).to.include('#foo .bar');
      expect(stats).to.include('#foo .foo');
      expect(stats).to.include('#foo .baz');
      expect(stats).to.include('.bar .foo');
      expect(stats).to.include('.baz');
    });

    it('finds deeply nested selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir3'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(1);
      expect(stats).to.include('a .foo #bar .baz');
    });

    it('finds deeply nested selectors with varying children', function() {
      var files = walk(path.join(__dirname, 'testing_dir4'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(3);
      expect(stats).to.include('a button');
      expect(stats).to.include('a .foo #bar .baz');
      expect(stats).to.include('a .foo #bar .omg input');
    });
    
    it('finds chained selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir13'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(1);
      expect(stats).to.include('a .foo .bar #baz');
    });

    it('finds comma seperated selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir5'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(3);
      expect(stats).to.include('a .foo');
      expect(stats).to.include('button .foo');
      expect(stats).to.include('input .foo');
    });

    it('finds comma seperated selectors with deep nesting', function() {
      var files = walk(path.join(__dirname, 'testing_dir6'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(9);
      expect(stats).to.include('a button');
      expect(stats).to.include('a .foo #bar .baz');
      expect(stats).to.include('a .foo #bar .omg input');

      expect(stats).to.include('body button');
      expect(stats).to.include('body .foo #bar .baz');
      expect(stats).to.include('body .foo #bar .omg input');

      expect(stats).to.include('form button');
      expect(stats).to.include('form .foo #bar .baz');
      expect(stats).to.include('form .foo #bar .omg input');
    });

    it('handles pseudo selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir7'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(1);
      expect(stats).to.include('a:visited');
    });

    it('handles pseudo selectors with nesting', function() {
      var files = walk(path.join(__dirname, 'testing_dir8'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(2);
      expect(stats).to.include('a:visited .foo');
      expect(stats).to.include('a:focus .foo');
    });

    it('handles sibling selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir9'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(1);
      expect(stats).to.include('.bar .foo');
    });

    it('handles direct child selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir10'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(1);
      expect(stats).to.include('.bar .foo');
    });

    it('handles adjacent selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir11'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(1);
      expect(stats).to.include('.bar .foo');
    });

    it('handles attribute selectors', function() {
      var files = walk(path.join(__dirname, 'testing_dir12'));
      var stats = S.findSelectors(files.data);
      expect(stats.length).to.equal(6);
      expect(stats).to.include('input[name=foo] .foo');
      expect(stats).to.include('input[name^=foo] .foo');
      expect(stats).to.include('input[name*=foo] .foo');
      
      expect(stats).to.include('input[name|=foo] .foo');
      expect(stats).to.include('input[name$~=foo] .foo');
      expect(stats).to.include('input[name=foo] .foo');
    });
  });
});