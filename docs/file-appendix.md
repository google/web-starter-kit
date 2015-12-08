
## .babelrc

[.babelrc](https://babeljs.io/docs/usage/babelrc/) is a configuration file for passing options to [Babel](https://babeljs.io) - the ES2015 transpiler recommended for writing next-generation JavaScript in Web Starter Kit. 

## .editorconfig

[EditorConfig](http://editorconfig.org/) is a file format and collection of text editor plugins for maintaining consistent coding styles between different editors and IDEs.

## gulpfile.babel.js

[Gulp](http://gulpjs.com) is a streaming build system that allows you to automate tedious development tasks. Compared with other build systems, such as Grunt, gulp uses Node.js streams as a means to automate tasks, thereby removing the need to create intermediate files when transforming source files. 

In gulp, you would install plugins, that do one thing and do it well, and construct a 'pipeline' by connecting them to each other. A `gulpfile` allows you to put together tasks that use plugins to accomplish a task like minification. 

`gulpfile.babel.js` is a gulpfile written in ES2015. The `babel` portion of the name refers to its use of the [Babel](https://babeljs.io) transpiler for enabling ES2015 code to run there.

## app/scripts/main.js

This is a file where your custom JavaScript can go. 

## app/styles/main.css

This is a file where your custom CSS can go. You can place any Sass you wish to have compiled into the `styles` directory and renaming `main.css` to `main.scss` will cause Web Starter Kit to treat the file as Sass instead.

## app/manifest.json

`manifest.json` contains a [Web Application Manifest](https://w3c.github.io/manifest/) - a simple JSON file that gives you the ability to control how your app appears to the user in the areas that they would expect to see apps (for example the mobile home screen). In here you can control what the user can launch and more importantly how they can launch it. 

For more information on the manifest, see [Web Fundamentals](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android).

## app/manifest.webapp

`manifest.webapp` refers to the proprietary [Firefox OS manifest format](https://developer.mozilla.org/en-US/Apps/Build/Manifest), and not the W3C [manifest spec](https://w3c.github.io/manifest/), designed for cross-browser open web applications. 

The Firefox OS app manifest provides information about an app (such as name, author, icon, and description) and a list of Web APIs that your app needs.

This manifest included in Web Starter Kit until Firefox OS switches to using the manifest spec instead.

## package.json

A [package.json](https://docs.npmjs.com/files/package.json) file is used to specify project tooling dependencies from [npm](http://npmjs.org) - the Node package manager. When you run `npm install`, `package.json` is read to discover what packages need to be installed. 

`package.json` can also contain other metadata such as a project description, version, license and configuration information.

## app/service-worker.js

A [service worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) is a script that is run by your browser in the background, separate from a web page, opening the door to features such as offline support. In Web Starter Kit, the `app/service-worker.js` script is automatically generated for you by our build process via [sw-precache](https://github.com/GoogleChrome/sw-precache/).
