## Using Material Design Lite's Sass in Web Starter Kit

If you would like to swap out the CSS version of [Material Design Lite](http://getmdl.io) for the more customisable [Sass](http://sass-lang.com/) version, there are a few steps you can take to get this setup with Web Starter Kit.

> This guide is intended to be used with Web Starter Kit 0.6.0 and above.

1. Download the [latest release](https://github.com/google/web-starter-kit/releases/latest) of Web Starter Kit. Extract it to a location on your drive.
2. Download the [latest release](https://github.com/google/material-design-lite/releases/latest) build of Material Design Lite (`material-design-lite-<version>.zip` where `version` is the latest version available). This file will include the Sass source files we need to get started.
3. Extract `material-design-lite-<version>.zip` to a local folder on your drive and open it. You should see a file/folder structure similar to the below:

```
├── LICENSE
├── README.md
├── bower.json
├── gulpfile.js
├── material.css
├── material.js
├── material.min.css
├── material.min.css.map
├── material.min.js
├── material.min.js.map
├── package.json
├── src
└── utils
```

The `src` directory above contains MDL's Sass files and the JavaScript sources for all MDL components.

4. Copy the `src` directory from step 3. to Web Starter Kit's `app/styles` directory. Your folder structure for `app/styles` should now resemble:

```
├── main.css
└── src
```

Next we have some changes to make to Web Starter Kit's `app/index.html`. By default it includes the CDN-hosted production builds of Material Design Lite. We will need to swap these out for references to our local files instead. 

5. First, we'll switch the CDN-hosted stylesheets to our local version.

Replace the following line:

```html
<link rel="stylesheet" href="https://code.getmdl.io/1.2.1/material.indigo-pink.min.css">
```

with:

```html
<link rel="stylesheet" href="styles/main.css">
```

If you navigate to "app/styles/main.css" in your Text Editor (e.g Sublime Text), you will notice that it already contains some styles. These are for the default template that ships with Web Starter Kit. 

We're going to rename our `app/styles/main.css` file to `app/styles/main.scss` so that Web Starter Kit treats it as a Sass file. No further changes are required to our `app/index.html`.

One final change for getting Sass working is adding the following line to the very top of `app/styles/main.scss`:

```
@import "src/material-design-lite";
```

This imports in all of MDL's component styles. If you later decide to only use a small set of components, just edit `src/material-design-lite.scss`, commenting out what you don't want.

6. Next, we'll localise our JavaScript files for MDL. Once again, we'll edit `app/index.html`:

Remove:

```html
<script src="https://code.getmdl.io/1.2.1/material.min.js"></script>
```

and find the following block in `app/index.html`:

```html
    <!-- build:js(app/) ../../scripts/main.min.js -->
    <script src="scripts/main.js"></script>
    <!-- endbuild -->
```

Replace the above block with the following code:

```html
    <!-- build:js(app/) ../../scripts/main.min.js -->
    <script src="./styles/src/mdlComponentHandler.js"></script>
    <script src="./styles/src/button/button.js"></script>
    <script src="./styles/src/checkbox/checkbox.js"></script>
    <script src="./styles/src/icon-toggle/icon-toggle.js"></script>
    <script src="./styles/src/menu/menu.js"></script>
    <script src="./styles/src/progress/progress.js"></script>
    <script src="./styles/src/radio/radio.js"></script>
    <script src="./styles/src/slider/slider.js"></script>
    <script src="./styles/src/spinner/spinner.js"></script>
    <script src="./styles/src/switch/switch.js"></script>
    <script src="./styles/src/tabs/tabs.js"></script>
    <script src="./styles/src/textfield/textfield.js"></script>
    <script src="./styles/src/tooltip/tooltip.js"></script>
    <script src="./styles/src/layout/layout.js"></script>
    <script src="./styles/src/data-table/data-table.js"></script>
    <script src="./styles/src/ripple/ripple.js"></script>
    <script src="scripts/main.js"></script>
    <!-- endbuild -->
```

Then, in your `gulpfile.babel.js` (found in the root of Web Starter Kit), edit the `scripts` task. By default it will look something like this:

```js
gulp.task('scripts', () =>
    gulp.src([
      // Note: Since we are not using useref in the scripts build pipeline,
      //       you need to explicitly list your scripts here in the right order
      //       to be correctly concatenated
      './app/scripts/main.js'
    ])
```

We're just going to add in the MDL component scripts so that they're correctly copied over and minified into a build when running `gulp`:

```js
gulp.task('scripts', () =>
    gulp.src([
      // Component handler
      './app/styles/src/mdlComponentHandler.js',
      // Base components
      './app/styles/src/button/button.js',
      './app/styles/src/checkbox/checkbox.js',
      './app/styles/src/icon-toggle/icon-toggle.js',
      './app/styles/src/menu/menu.js',
      './app/styles/src/progress/progress.js',
      './app/styles/src/radio/radio.js',
      './app/styles/src/slider/slider.js',
      './app/styles/src/spinner/spinner.js',
      './app/styles/src/switch/switch.js',
      './app/styles/src/tabs/tabs.js',
      './app/styles/src/textfield/textfield.js',
      './app/styles/src/tooltip/tooltip.js',
      // Complex components (which reuse base components)
      './app/styles/src/layout/layout.js',
      './app/styles/src/data-table/data-table.js',
      // And finally, the ripples
      './app/styles/src/ripple/ripple.js',
      // Other scripts,
      './app/scripts/main.js'
    ])
```


> Note: We are aware that it can feel a little suboptimal to reference the same set of source files twice in the above pipeline. We will be looking at simplifying this workflow in a future release. 

Similar to styles, you can comment out what you don't need here if you decide to only use a smaller set of components. 

7. Finally, we can run `gulp serve` to preview our site or `gulp` to build a production version. Yay!

## Bonus tips

### Configuring colors

You will probably want to configure the color theme used in MDL. 

MDL supports Material Design's [color palette](https://www.google.com/design/spec/style/color.html#color-color-palette) through Sass variables. 

If you find a color in the palette spec you would like to use (e.g., color name `Pink` with fill `500`), MDL exposes this as `$palette-pink-500`. Let's walk through customising the primary and accent colors for your theme.

This can be done using your setup as follows:

1. Run `gulp serve` to preview your site. 
2. Open `app/styles/src/_variables.scss` in your Text Editor.
3. Find `$color-primary`. It should be in the same block as two other color variables we can use for theming - `$color-primary-dark` and `$color-accent`.

```
$color-primary: $palette-indigo-500 !default;
$color-primary-dark: $palette-indigo-700 !default;
$color-accent: $palette-pink-A200 !default;
```

We can change out the default theme for a custom one by consulting `app/styles/src/_color-definitions.scss` for [Material Design color themes](https://www.google.com/design/spec/style/color.html) available. 

For this example, we're going to change out `palette-indigo-500` for `palette-purple-500` and `palette-indigo-700` for `palette-deep-purple-700`.

```
$color-primary: $palette-purple-500 !default;
$color-primary-dark: $palette-deep-purple-700 !default;
$color-accent: $palette-pink-A200 !default;
```

Make the above change and hit save. The page should refresh, now showing you your customised theme in action. 

For complete Material Design theming, you need to set two other colours: `$color-primary-contrast` and `$color-accent-contrast` in the same `app/styles/src/_variables.scss` file. These are the colours for text that is rendered on top of a solid block of primary or accent, respectively. You should set them to `$color-dark-contrast` if you've chosen a dark primary/accent, and `$color-light-contrast` if you've chosen a light primary/accent.




