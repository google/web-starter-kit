var square = require('./commonjs-module-square.js');

module.exports = {
  cubed: function(value) {
    return square(value) * value;
  }
};
