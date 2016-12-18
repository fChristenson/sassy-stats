var fs = require('fs');
var path = require('path');

module.exports = function () {
  this.After(function () {
    var file = path.join(__dirname, 'test.sass');

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};