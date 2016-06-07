# Amaze UI 入门套件

[![Dependency Status](https://img.shields.io/david/amazeui/starter-kit.svg?style=flat-square)](https://david-dm.org/amazeui/starter-kit)
[![devDependency Status](https://img.shields.io/david/dev/amazeui/starter-kit.svg?style=flat-square)](https://david-dm.org/amazeui/starter-kit#info=devDependencies)

Amaze UI Starter Kit 是一个使用 Webpack、NPM 构建的前端开发工作流。通过该工作流，用户可以很方便地使用 Amaze UI 进行开发。

[**使用 Gulp + Browserify 版本见 `browserify` 分支**](https://github.com/amazeui/starter-kit/tree/browserify)。

## 环境配置

- **安装 Node.js**：从[官网选择](http://nodejs.org/download/)相应的链接下载安装，建议使用 **LTS 最新版**。
- **安装 Git**：[官网下载页面](http://git-scm.com/downloads)（不是必须）。

安装完 Node.js 以后，打开命令行窗口：

- 输入 `node -v`，应该显示类似 `v4.4.5` 的 Node.js 版本号；
- 输入 `npm -v`，应该显示类似 `2.15.5` 的 NPM CLI 版本号。

如果以上信息没有正常显示，说明 Node.js 安装过程中遇到问题了。至于是要设置环境变量还是怎么的，请自行问度娘或股哥。

## 开始开发

#### 获取 Amaze UI Starter Kit

可以通过两种方式:

- **使用 Git**：`git clone https://github.com/amazeui/starter-kit.git`
- **直接下载压缩包**：[点击下载](https://github.com/amazeui/starter-kit/archive/master.zip)

Clone 完成（或者下载解压后）得到以下目录结构：

```
├── README.md
├── app           // 项目源文件目录
│   ├── humans.txt
│   ├── i         // 图片
│   ├── index.html
│   ├── js        // JS
│   ├── less      // Less
│   ├── manifest.json
│   ├── manifest.webapp
│   └── robots.txt
├── dist               // 构建目录
├── serve.js           // 开发服务器
├── webpack.config.js  // Webpack 配置
└── package.json       // 项目依赖等信息
```

#### 安装依赖进行开发

在项目目录下执行 `npm install`，安装开发依赖。

任务说明：

- `npm start` 启动开发、预览服务
- `npm run build` 构建生产环境版本
- `npm run start-prod` 构建生产环境版本并预览

### 使用问题请[反馈至 issue](https://github.com/amazeui/starter-kit/issues)。
