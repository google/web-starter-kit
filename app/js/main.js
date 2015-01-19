'use strict';

var $ = require('jquery');
var detector = require('detector');

$(function() {
  $('#browser-info').append('浏览器信息：<pre>' +
    JSON.stringify(detector.browser) +
    '</pre>'
  );
  console.log('Hello World. This is Amaze UI Starter Kit.');
});
