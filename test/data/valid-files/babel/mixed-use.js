import * as otherModule from './es2015-module-multiple-exports';

console.log(otherModule.plusOne(1));
console.log(otherModule.sum(1, 2, 3));

var square = require('./commonjs-module-square.js');
var cubedModule = require('./commonjs-module-cubed.js');

console.log(square(2));
console.log(cubedModule.cubed(2));
