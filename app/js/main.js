'use strict';

var $ = require('jquery');

// 使用 Amaze UI 源码中的模块
var addToHome = require('amazeui/js/ui.add2home');

// 使用 NPM 中的模块
var detector = require('detector');

$(function() {
  $('#browser-info').append('浏览器信息：<pre>' +
    JSON.stringify(detector.browser) +
    '</pre>'
  );

  addToHome();

  console.log('Hello World. This is Amaze UI Starter Kit.');
});
