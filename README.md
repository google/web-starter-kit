# [![Web Starter Kit](https://cloud.githubusercontent.com/assets/170270/3343034/ceef6e92-f899-11e3-96b9-5d9d69d97a00.png)](https://github.com/google/web-starter-kit/releases/latest)

## Overview

[Web Starter Kit](https://developers.google.com/web/starter-kit) is an opinionated boilerplate for web development. Tools for building a great experience [across many devices](https://google.github.io/web-starter-kit/hello-world/) and [performance oriented](#web-performance). Helping you to stay productive following the best practices outlined in Google's [Web Fundamentals](https://developers.google.com/web/fundamentals). A solid starting point for both professionals and newcomers to the industry.

### Features

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Responsive boilerplate | A responsive boilerplate optimized for the multi-screen web with a high [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) performance score. Powered by [Material Design Lite](http://getmdl.io).                               |
| Sass support                           | Compile [Sass](http://sass-lang.com/) into CSS with ease, bringing support for variables, mixins and more. (Run `gulp serve` or `gulp` for production)                                                                                                      |
| Performance optimization               | Minify and concatenate JavaScript, CSS, HTML and images to help keep your pages lean. (Run `gulp` to create an optimised version of your project to `/dist`)                                                                                                |
| ES2015 via Babel 6.0                   | Optional ES2015 support using [Babel](https://babeljs.io/). To enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the [.babelrc](.babelrc) file. ES2015 source code will be automatically transpiled to ES5 for wide browser support.  |
| Built in HTTP Server                   | A built-in server for previewing your site locally while you develop and iterate                                                                                                                                                                            |
| Live Browser Reloading                 | Reload the browser in real-time anytime an edit is made without the need for an extension. (Run `gulp serve` and edit your files)                                                                                                                           |
| Cross-device Synchronization           | Synchronize clicks, scrolls, forms and live-reload across multiple devices as you edit your project. Powered by [BrowserSync](http://browsersync.io). (Run `gulp serve` and open up the IP provided on other devices on your network)                       |
| PageSpeed Insights                     | Web performance metrics showing how well your site performs on mobile and desktop (Run `gulp pagespeed`)                                                                                                                                                    |

## Quickstart

[Download](https://github.com/google/web-starter-kit/releases/latest) the kit or clone this repository and build on what is included in the `app` directory.

There are two HTML starting points, from which you can choose:

- `index.html` - (IE10+) the default starting point, containing Material Design layout.
- `basic.html` - (IE8+) no layout, but still includes our minimal mobile best-practices

Be sure to look over the [installation docs](docs/install.md) to verify your environment is prepared to run WSK.
Once you have verified that your system can run WSK, check out the [commands](docs/commands.md) available to get started.

## Web Performance

Web Starter Kit strives to give you a high performance starting point out of the box and we actively work on delivering the best [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) score and frame-rate possible.

## Browser Support

At present, we officially aim to support the following browsers:

* IE9, IE10, IE11, IE Mobile 10
* FF 30, 31
* Chrome 34, 35
* Safari 7, 8
* Opera 23, 24
* iOS Safari 7, 8
* Opera Coast
* Android / Chrome 4.4, 4.4.3
* BlackBerry 10

This is not to say that Web Starter Kit cannot be used in browsers older than those reflected, but merely that our focus will be on ensuring our layouts work great in the above.

## Web Starter Kit and [Bootstrap](http://getbootstrap.com) or other CSS libraries?

Web Starter Kit doesn't aim to compete with CSS libraries like Bootstrap, Foundation and Pure. These libraries provide an excellent solution for prototyping your initial project. The biggest challenge they present is it’s almost too easy to get stuck using their look and feel for the lifetime of your site. We think this leads to a poorer experience on the multi-screen web.

Web Starter Kit provides boilerplate styles & a visual style guide for projects, but encourages customising these to fit your own site. This may need a little more work, but the reality is that any serious project is going to have its own look and feel. We want you to feel comfortable changing the kit to suit your own needs.

If you wish to use Bootstrap or other CSS libraries in your Web Starter Kit project, you have the flexibility to do so.

## Troubleshooting

If you find yourself running into issues during installation or running the tools, please check our [Troubleshooting](https://github.com/google/web-starter-kit/wiki/Troubleshooting) guide and then open an [issue](https://github.com/google/web-starter-kit/issues). We would be happy to discuss how they can be solved.

## A Boilerplate-only Option

If you would prefer not to use any of our tooling, delete the following files from the project: `package.json`, `gulpfile.babel.js`, `.jshintrc` and `.travis.yml`. You can now safely use the boilerplate with an alternative build-system or no build-system at all if you choose.

## Recipes

If you are interested in adding in different tooling workflows to your gulpfile.js, we recommend looking at the official Gulp [recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes) directory which includes a comprehensive list of guides.

## Extras

Optional additions, such as web server configurations, can be found at [WSK Extras
repository](https://github.com/google/web-starter-kit-extras).

## Inspiration

Web Starter Kit is inspired by [Mobile HTML5 Boilerplate](http://html5boilerplate.com/mobile/) and Yeoman's [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp), having taken input from contributors to both projects during development. Our [FAQs](https://github.com/google/web-starter-kit/wiki/FAQ) attempt to answer commonly asked questions about the project.

## Contributing

Contributions, questions and comments are all welcome and encouraged. For code contributions to Web Starter Kit, please see our [Contribution guide](CONTRIBUTING.md) before submitting a pull request. [Website](https://developers.google.com/web/starter-kit/) related issues should be filed on the [Web Fundamentals](https://github.com/google/WebFundamentals/issues/new) issue tracker.

## License

Apache 2.0  
Copyright 2014 - 2015 Google Inc
