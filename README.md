# Starter Kit for Amaze UI

Amaze UI Starter Kit 是一个使用 Gulp、NPM 构建的前端开发工作流。通过该工作流，用户可以很方便地使用 Amaze UI 进行开发。

## 使用 Gulp、NPM 构建前端开发工作流

2014 年，Javascript 领域[风起云涌](http://www.infoq.com/news/2014/12/javascript-review-2014)，这里我们主要提两件事。

其一，**Gulp 取代 Grunt，基于 Node.js 的前端构建工具发生更迭**。2014 年中 Amaze UI 发布 1.0 测试版时就采用了 Gulp 作为构建工具。彼时，前端构建的天下还是 Grunt 的，有江湖郎中也说 Amaze UI “应该”使用 Grunt，他们可曾想到今日会是如此翻天覆地的变化。

其二，**[Common JS 规范](http://wiki.commonjs.org/wiki/CommonJS)向前端延伸。具体表现为：

- [NPM](https://www.npmjs.com) 新版官网上线，重新定位为：`npm is the package manager for javascript`,不再是单纯的后端（Node.js、io.js）包管理工具；
- jQuery 官网停止接受新插件提交，建议用户提交到 NPM，庞大的 jQuery 生态圈转向 NPM；
- Browserify、Webpack 等前端 Common JS 实现工具流行，并得到 Facebook 等巨头认可；
- ……

Common JS 在前端模块化开发中蔓延的表现远不止这些，相信越来越多的前端开发者会转到 Common JS 规范中来，通过前后端统一模块化规范，实现更多的代码重用，提高开发效率。

Amaze UI 从 2.0 开始按照 Common JS 规范开发 JavaScript，而本项目的目的，就是让开发者快捷地搭建基于 Gulp、NPM 的开发工作流，更方便地使用 Amaze UI。

### 准备工作

#### 环境配置

- **安装 Node.js**：从[官网选择](http://nodejs.org/download/)相应的链接下载安装。
- **安装 Git**：[官网下载页面](http://git-scm.com/downloads)（不是必须，但如果想靠写代码的混饭吃，那还是应该学习一下）。

安装完 Node.js 以后，打开命令行窗口：

- 输入 `node -v`，应该显示类似 `v0.10.35` 的 Node.js 版本号；
- 输入 `npm -v`，应该显示类似 `1.4.28` 的 NPM CLI 版本号。

如果以上信息没有正常显示，说明 Node.js 安装过程中遇到问题了，至于是要设置环境变量还是怎么的，请自行问度娘或股哥。

#### 全局安装 Gulp

在使用 NPM 之前，有必要了解一下 NPM 的命令，[完整列表参见官网](https://docs.npmjs.com/cli/install)。

我们现在要了解的是 `npm install` 这个命令。打开命令行窗口，输入 `npm install -h`，会列出使用说明列表。

下面就全局安装 Gulp：

```
npm install gulp -g
```

关于 NPM 安装模块时全局和本地相关概念，请通过官方文档或者相关中文社区了解。

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

在项目目录下执行 `npm install` 安装 Gulp 插件、jQuery、Amaze UI 等依赖。

安装完成以后，执行 `gulp serve`，Gulp 会编译相关文件并打开系统默认浏览器进行预览。

你可以修改 `app/index.html` 或者 Less 或者 JS 文件，Gulp 会自动编译并刷新浏览器。

至此，我们实现使用 jQuery 及 Amaze UI 打包好的文件进行开发并实时预览了。


### 进阶开发

#### 直接使用 Amaze UI 源码开发

__待补充__

#### 使用 NPM 中的其他模块

以使用 [detector](https://github.com/hotoo/detector) 为例：

首先，安装 detector 并加入依赖列表：

```
npm install detector --save-dev
```

然后，`require` detector：

```js
var detector = require('detector');
```

接下来就可以使用 detector 干你想干的事了：

```js
$('#browser-info').append('浏览器信息：<pre>' +
    JSON.stringify(detector.browser) +
    '</pre>'
);
```

## License

Apache 2.0
Copyright 2014 Google Inc
