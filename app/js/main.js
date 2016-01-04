'use strict';

var $ = require('jquery');

// 使用 Amaze UI 源码中的模块
var addToHome = require('amazeui/js/ui.add2home');

// 使用 NPM 中的模块
var hljs = require('highlight.js');

$(function() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  addToHome();

  console.log('Hello World. This is Amaze UI Starter Kit.');
});
