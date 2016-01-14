# [![Web Starter Kit](https://cloud.githubusercontent.com/assets/110953/11445049/f05512ba-9520-11e5-8fdb-8c8eb5f690d0.jpg)](https://github.com/google/web-starter-kit/releases/latest)

## Overview

[Web Starter Kit](https://developers.google.com/web/starter-kit) is an opinionated boilerplate for web development. Tools for building a great experience across many devices and [performance oriented](#web-performance). Helping you to stay productive following the best practices outlined in Google's [Web Fundamentals](https://developers.google.com/web/fundamentals). A solid starting point for both professionals and newcomers to the industry.

### Features

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Responsive boilerplate | A responsive boilerplate optimized for the multi-screen web. Powered by [Material Design Lite](http://getmdl.io).  You're free to use either this or a completely clean-slate  via [basic.html](https://github.com/google/web-starter-kit/blob/master/app/basic.html).                          |
| Sass support                           | Compile [Sass](http://sass-lang.com/) into CSS with ease, bringing support for variables, mixins and more. (Run `gulp serve` or `gulp` for production)                                                                                                      |
| Performance optimization               | Minify and concatenate JavaScript, CSS, HTML and images to help keep your pages lean. (Run `gulp` to create an optimised version of your project to `/dist`)                                                                                                |
| Code Linting               | JavaScript code linting is done using [ESLint](http://eslint.org) - a pluggable linter tool for identifying and reporting on patterns in JavaScript. Web Starter Kit uses ESLint with [eslint-config-google](https://github.com/google/eslint-config-google), which tries to follow the Google JavaScript style guide.                                                                                                |
| ES2015 via Babel 6.0                   | Optional ES2015 support using [Babel](https://babeljs.io/). To enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the [.babelrc](.babelrc) file. ES2015 source code will be automatically transpiled to ES5 for wide browser support.  |
| Built-in HTTP Server                   | A built-in server for previewing your site locally while you develop and iterate                                                                                                                                                                            |
| Live Browser Reloading                 | Reload the browser in real-time anytime an edit is made without the need for an extension. (Run `gulp serve` and edit your files)                                                                                                                           |
| Cross-device Synchronization           | Synchronize clicks, scrolls, forms and live-reload across multiple devices as you edit your project. Powered by [BrowserSync](http://browsersync.io). (Run `gulp serve` and open up the IP provided on other devices on your network)                       |
| Offline support                     | Thanks to our baked in [Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) [pre-caching](https://github.com/google/web-starter-kit/blob/master/gulpfile.babel.js#L226), sites deploying `dist` to a HTTPS domain will enjoy offline support. This is made possible by [sw-precache](https://github.com/GoogleChrome/sw-precache/).                                                                                                                                              |
| PageSpeed Insights                     | Web performance metrics showing how well your site performs on mobile and desktop (Run `gulp pagespeed`)                                                                                                                                                    |

## Quickstart

[Download](https://github.com/google/web-starter-kit/releases/latest) the kit or clone this repository and build on what is included in the `app` directory.

There are two HTML starting points, from which you can choose:

- `index.html` - the default starting point, containing Material Design layout.
- `basic.html` - no layout, but still includes our minimal mobile best-practices

Be sure to look over the [installation docs](docs/install.md) to verify your environment is prepared to run WSK.
Once you have verified that your system can run WSK, check out the [commands](docs/commands.md) available to get started.

## Web Performance

Web Starter Kit strives to give you a high performance starting point out of the box. Our median Web Page Test [scores](http://www.webpagetest.org/result/151201_VW_XYC/) for the default template have a [Speed Index](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index) of ~1100 (1000 is ideal) and a repeat-visit Speed Index of ~550 thanks to Service Worker precaching. 

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

* Chrome
* Edge
* Firefox
* Safari
* Opera
* Internet Explorer 9+

This is not to say that Web Starter Kit cannot be used in browsers older than those reflected, but merely that our focus will be on ensuring our layouts work great in the above.

## Troubleshooting

If you find yourself running into issues during installation or running the tools, please check our [Troubleshooting](https://github.com/google/web-starter-kit/wiki/Troubleshooting) guide and then open an [issue](https://github.com/google/web-starter-kit/issues). We would be happy to discuss how they can be solved.

## A Boilerplate-only Option

If you would prefer not to use any of our tooling, delete the following files from the project: `package.json`, `gulpfile.babel.js`, `.jshintrc` and `.travis.yml`. You can now safely use the boilerplate with an alternative build-system or no build-system at all if you choose.

## Docs and Recipes

* [File Appendix](https://github.com/google/web-starter-kit/blob/master/docs/file-appendix.md) - What do the different files here do?
* [Using Material Design Lite's Sass](https://github.com/google/web-starter-kit/blob/master/docs/mdl-sass.md) - how to get MDL's Sass working with WSK
* [Deployment guides](https://github.com/google/web-starter-kit/blob/master/docs/deploy.md) - available for Firebase, Google App Engine and other services.
* [Gulp recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes) - the official Gulp recipes directory includes a comprehensive list of guides for different workflows you can add to your project.

## Inspiration

Web Starter Kit is inspired by [Mobile HTML5 Boilerplate](http://html5boilerplate.com/mobile/) and Yeoman's [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp), having taken input from contributors to both projects during development. Our [FAQs](https://github.com/google/web-starter-kit/wiki/FAQ) attempt to answer commonly asked questions about the project.

## Contributing

Contributions, questions and comments are all welcome and encouraged. For code contributions to Web Starter Kit, please see our [Contribution guide](CONTRIBUTING.md) before submitting a pull request. [Website](https://developers.google.com/web/starter-kit/) related issues should be filed on the [Web Fundamentals](https://github.com/google/WebFundamentals/issues/new) issue tracker.

## License

Apache 2.0  
Copyright 2015 Google Inc
