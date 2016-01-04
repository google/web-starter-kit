# Amaze UI 入门套件

[![Dependency Status](https://img.shields.io/david/amazeui/starter-kit.svg?style=flat-square)](https://david-dm.org/amazeui/starter-kit)
[![devDependency Status](https://img.shields.io/david/dev/amazeui/starter-kit.svg?style=flat-square)](https://david-dm.org/amazeui/starter-kit#info=devDependencies)

Amaze UI Starter Kit 是一个使用 Gulp、NPM 构建的前端开发工作流。通过该工作流，用户可以很方便地使用 Amaze UI 进行开发。

## 使用 Gulp、NPM 构建前端开发工作流

2014 年，Javascript 领域[风起云涌](http://www.infoq.com/news/2014/12/javascript-review-2014)，这里我们主要提两件事。

其一，**Gulp 取代 Grunt，基于 Node.js 的前端构建工具发生更迭**。2014 年中 Amaze UI 发布 1.0 测试版时就采用了 Gulp 作为构建工具。彼时，前端构建的天下还是 Grunt 的，有江湖郎中还说 Amaze UI “应该”使用 Grunt，他们可曾想到今日会是如此翻天覆地的变化。

其二，**[Common JS 规范](http://wiki.commonjs.org/wiki/CommonJS)向前端延伸**。具体表现为：

- [NPM](https://www.npmjs.com) 新版官网上线，重新定位为：`npm is the package manager for javascript`,不再是单纯的后端（Node.js、io.js）包管理工具；
- jQuery 官网不再接受新插件提交，建议用户提交到 NPM，庞大的 jQuery 生态圈转向 NPM；
- Browserify、Webpack 等前端 Common JS 实现工具流行，并得到 Facebook 等公司认可；
- ……

Common JS 在前端模块化开发中蔓延的表现远不止这些，相信越来越多的前端开发者会转到 Common JS 规范中来，通过前后端统一模块化规范，实现更多的代码重用，提高开发效率。

Amaze UI 从 2.0 开始按照 Common JS 规范开发 JavaScript，而本项目的目的，就是让开发者快捷地搭建基于 Gulp、NPM 的开发工作流，更方便地使用 Amaze UI。

### 准备工作

#### 环境配置

- **安装 Node.js**：从[官网选择](http://nodejs.org/download/)相应的链接下载安装。
- **安装 Git**：[官网下载页面](http://git-scm.com/downloads)（不是必须，但如果想靠写代码谋生，还是应该学习一下）。

安装完 Node.js 以后，打开命令行窗口：

- 输入 `node -v`，应该显示类似 `v0.10.35` 的 Node.js 版本号；
- 输入 `npm -v`，应该显示类似 `1.4.28` 的 NPM CLI 版本号。

如果以上信息没有正常显示，说明 Node.js 安装过程中遇到问题了。至于是要设置环境变量还是怎么的，请自行问度娘或股哥。

#### 全局安装 Gulp

在使用 NPM 之前，有必要了解一下 NPM CLI 命令，[完整列表参见官网](https://docs.npmjs.com/cli/install)。

打开命令行窗口，输入 `npm install -h`，会列出使用说明列表。

下面开始全局安装 Gulp：

```
npm install gulp -g
```

关于 NPM 安装模块时**全局**和**本地**相关概念，请通过官方文档或者相关中文社区了解。

---

### 开始开发

#### 获取 Amaze UI Starter Kit

可以通过两种方式获取 Amaze UI Starter Kit:

- **使用 Git**：`git clone https://github.com/amazeui/starter-kit.git`
- **直接下载压缩包**：[点击下载](https://github.com/amazeui/starter-kit/archive/master.zip)

Clone 完成（或者下载解压后）得到以下目录结构：

```
├── README.md
├── app           // 项目源文件目录
│   ├── humans.txt
│   ├── i         // 图片
│   ├── index.html
│   ├── js        // JS
│   ├── less      // Less
│   ├── manifest.json
│   ├── manifest.webapp
│   └── robots.txt
├── dist         // 构建目录
├── gulpfile.js  // Gulp 任务配置
└── package.json // 项目依赖等信息
```

#### 安装依赖进行开发

在项目目录下执行 `npm install`，安装 Gulp 插件、jQuery、Amaze UI 等依赖。

安装完成以后，执行 `gulp serve`，Gulp 会编译相关文件并打开系统默认浏览器进行预览。

你可以修改 `app/index.html` 或者 Less 或者 JS 文件，Gulp 会自动编译并刷新浏览器。

至此，我们实现使用 jQuery 及 Amaze UI 打包好的文件进行开发并实时预览了。

---

### 进阶开发

#### 直接使用 Amaze UI 源码开发

如果觉得引入完整的 Amaze UI 样式和 JS 太大，可以直接使用源码进行更精细化的开发。

##### 使用 Less

以 `app/less/main.less` 为例，首先引入**必需**的变量和 mixins 文件

```css
@import "../../node_modules/amazeui/less/variables";
@import "../../node_modules/amazeui/less/mixins";
```

然后可以根据需要引入其他文件。

##### 使用 JS

以 `app/js/main.js` 为例：

```js
var $ = require('jquery');
var addToHome = require('../../node_modules/amazeui/js/ui.add2home');

$(function() {
  addToHome();
});
```

#### 使用非 Common JS 规范编写的 jQuery 插件

目前很多 jQuery 插件都没有按照 Common JS 规范编写，但是我们仍然可以使用 `require`:

```js
var $ = require('jquery');

// require xxx 插件
require('jquery.xxx.js');

$(function() {
  // 使用 jQuery 的方式调用 xxx 插件
  $().xxx();
});
```

需要注意的是 **jQuery 应该使用 `shim` 单独引入**，而不是打包到一个文件中。

将以下代码添加到 `package.json` 中：

```js
"browserify": {
  "transform": [
    "browserify-shim"
  ]
},

"browserify-shim": {
  "jquery": "global:jQuery"
}
```

#### 使用 NPM 中的其他模块

以使用 [highlight.js](https://www.npmjs.com/package/highlight.js) 为例：

首先，安装 highlight.js 并加入依赖列表：

```
npm install highlight.js --save-dev
```

然后，`require` highlight.js：

```js
var hljs = require('highlight.js');
```

接下，使用 `highlight.js` 高亮页面中的代码：

```js
$(document).ready(function() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});
```

### 结语

Gulp 及其丰富的插件、易懂的配置帮助开发者快速地搭建项目构建平台；NPM 结合 Browserify 等工具则解决了模块化、依赖管理等问题；再配合 Browser Sync、Live Reload 等实时预览工具，一个便捷、高效的前端开发工作流并呈现在眼前。

然而，还需要考虑一个问题：样式依赖问题。虽然 WebPack 等支持 Less、CSS 等依赖提取，但社区也有[不同声音](http://mattdesl.svbtle.com/browserify-vs-webpack)，认为 WepPack **滥用 `require`**；Sprockets 的 Node 移植版 [Mincer](https://github.com/nodeca/mincer) 看上去也不是那么优雅……我们也在探索样式依赖管理的方案，欢迎有经验的分享、交流。
