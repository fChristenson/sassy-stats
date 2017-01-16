var funcNames = [
  'calc',
  'attr',
  'rgb',
  'rgba',
  'rect',
  'linear-gradient',
  'radial-gradient',
  'repeating-linear-gradient',
  'url',
  'cubic-bezier',
  'matrix',
  'matrix3d',
  'translate',
  'translate3d',
  'translateX',
  'translateY',
  'translateZ',
  'scale',
  'scale3d',
  'scaleX',
  'scaleY',
  'scaleZ',
  'rotate',
  'rotate3d',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skew',
  'skewX',
  'skewY',
  'perspective'
];

function makeVendorPrefix(str) {
  return function(e) {
    return str + e;
  };
}

var webkit = funcNames.map(makeVendorPrefix('-webkit-'));
var moz = funcNames.map(makeVendorPrefix('-moz-'));
var o = funcNames.map(makeVendorPrefix('-o-'));
var ms = funcNames.map(makeVendorPrefix('-ms-'));

module.exports = funcNames.concat(webkit).concat(moz).concat(o).concat(ms);
