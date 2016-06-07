'use strict';

// load files
require('../humans.txt');
require('../manifest.json');
require('../manifest.webapp');
require('../robots.txt');

// load images
require('../i/logo.png');
require('../i/favicon.png');
require('../i/touch/apple-touch-icon.png');
require('../i/touch/chrome-touch-icon-192x192.png');
require('../i/touch/icon-128x128.png');
require('../i/touch/ms-touch-icon-144x144-precomposed.png');

// load less
require('../less/app.less');

var $ = require('jquery');
var AMUI = require('amazeui');

// 使用 NPM 中的模块
var hljs = require('highlight.js');

var $modal = $('<div class="am-modal am-modal-no-btn" id="my-modal">\n  ' +
  '<div class="am-modal-dialog">\n    ' +
  '<div class="am-modal-hd">Amaze UI' +
  '<a href="javascript: void(0)" class="am-close am-close-spin" ' +
  'data-am-modal-close>&times;</a>\n    </div>\n    ' +
  '<div class="am-modal-bd">\n      你好，世界！<br />你正在使用的 Amaze UI ' +
  AMUI.VERSION + '.\n    </div>\n  </div>\n</div>');

$(function() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  
  $(document.body).append($modal);
  
  $modal.modal('open');

  console.info('Hello World. This is Amaze UI Starter Kit.');
});
