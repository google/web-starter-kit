# Learning Web Design and Fundamentals

## TOC

**[Learn CSS Layout](#learn-css-layout)**

### Learn CSS Layout

![learnlayout.com](www.learnlayout.com)

#### display property

block - div is the standard block-level element. A block-level element starts
on a new line and stretches out to the left and right as far as it can. Other
common block-level elements are p and form, and new in HTML5 are header,
footer, section, and more.

inline - span is the standard inline element. An inline element can wrap some
text inside a paragraph <span> like this </span> without disrupting the flow
of that paragraph. The a element is the most common inline element, since you
use them for links

none - different from visibility. Setting display to none will render
the page as though the element does not exist. visibility: hidden; will hide
the element, but the element will still take up the space it would if it was
fully visible.

#### margin: auto;

Setting the width of a block-level element will prevent it from stretching out
to the edges of its container to the left and right. Then, you can set the
left and right margins to auto to horizontally center that element within its
container. The element will take up the width you specify, then the remaining
space will be split evenly between the two margins.

The only problem occurs when the browser window is narrower than the width of
your element. The browser resolves this by creating a horizontal scrollbar on
the page.

```css
  #main {
    width: 600px;
    margin: 0 auto;
  }
```

#### max-width
Using max-width instead of width in this situation will improve the browser's
handling of small windows. This is important when making a site usable on
mobile.

```css
  #main {
    max-width: 600px;
    margin: 0 auto;
  }
```

#### the box model problem
We should talk about width's big caveat: the box model. When you set the width
of an element, the element can actually appear bigger than what you set: the
element's border and padding will stretch out the element beyond the specified
width.

```css
  .simple {
    width: 500px;
    margin: 20px auto;
  }

  .fancy {
    width: 500px;
    margin: 20px auto;
    padding: 50px;
    border-width: 10px;
  }
```

#### box-sizing
 When you set box-sizing: border-box; on an element, the padding and border of
 that element no longer increase its width.

```css
  .simple {
    width: 500px;
    margin: 20px auto;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
  }

  .fancy {
    width: 500px;
    margin: 20px auto;
    padding: 50px;
    border: solid blue 10px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
  }
```

#### position

*static* is the default value. An element with position: static; is not positioned
in any special way. A static element is said to be not positioned and an element
with its position set to anything else is said to be positioned.

```css
  .static {
    position: static;
  }
```

*relative* behaves the same as static unless you add some extra properties.

Setting the top, right, bottom, and left properties of a relatively-positioned
element will cause it to be adjusted away from its normal position. Other
content will not be adjusted to fit into any gap left by the element.

```css
  .relative1 {
    position: relative;

  }
  .relative2 {
    position: relative;
    top: -20px;
    left: 20px;
          background-color: white;
    width: 500px;

  }
```
*fixed* is positioned relative to the viewport, which means it always
stays in the same place even if the page is scrolled. As with relative, the top,
right, bottom, and left properties are used.

```css
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
         background-color: white;
}
```

*absolute* is the trickiest position value. absolute behaves like fixed except
relative to the nearest positioned ancestor instead of relative to the viewport.
If an absolutely-positioned element has no positioned ancestors, it uses the
document body, and still moves along with page scrolling. Remember,
a "positioned" element is one whose position is anything except static.


```css
.relative {
  position: relative;
  width: 600px;
  height: 400px;
}

.absolute {
  position: absolute;
  top: 120px;
  right: 0;
  width: 300px;
  height: 200px;
}
```

#### Position Example

This example works because the container is taller than the nav. If it wasn't,
the nav would overflow outside of its container. In the coming pages we'll
discuss other layout techniques that have different pros and cons.

```css

.container {
  position: relative;
}

nav {
  position: absolute;
  left: 0px;
  width: 200px;
}
section {
  /* position is static by default */
  margin-left: 200px;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 70px;
          background-color: white;
  width: 100%;
}

body {
  margin-bottom: 120px;
}

```
#### Float

*Float* is intended for wrapping text around images.

```css
  img {
    float: right;
    margin: 0 0 1em 1em;
  }
```

#### Clear

*clear*  is important for controlling the behavior of floats

```html
  <div class="box">...</div>
  <section>...</section>
```

```css
  .box {
    float: left;
    width: 200px;
    height: 100px;
    margin: 1em;
  }
```

In this case, the section element is actually after the div. However, since the
div is floated to the left, this is what happens: the text in the section is
floated around the div and the section surrounds the whole thing. What if we
wanted the section to actually appear after the floated element?

```css
.box {
  float: left;
  width: 200px;
  height: 100px;
  margin: 1em;
}

.after-box {
  clear: left;
}
```

Using clear we have now moved this section down below the floated div. You use
the value left to clear elements floated to the left. You can also clear right
and both.

#### ClearFix Hack

```css

img .clearfix {
  float: right;
  overflow: auto;
}

```

#### Float Layout Example

It's common to use float to set layout.

```css
nav {
  float: left;
  width: 200px;
}

section {
  margin-left: 200px;
}
```

#### Percent Width

Percent is a measurement unit relative to the containing block. It's great for
images: here we make an image that is always 50% the width of its container. 

```css
article img {
  float: right;
  width: 50%;
}
```

percent width layout - You can use percent for layout, but this can require more
work.

```css
  nav {
    float: left;
    width: 25%;
  }

  section {
    margin-left: 25%;
  }
```
#### inline-block

inline-block elements are like inline elements but they can have a width and
height.

Creating a grid of boxes using float (hard):

```css
.box {
  float: left;
  width: 200px;
  height: 100px;
  margin: 1em;
}

.after-box {
  clear: left;
}
```

Using inline-block (easy)

```css
.box2 {
  display: inline-block;
  width: 200px;
  height: 100px;
  margin: 1em;
}
```

#### inline-block layout

You can also use inline-block for layouts. There are a few things to keep in
mind:

- inline-block elements are affected by the vertical-align property, which you probably want set to top.
- You need to set the width of each column
- There will be a gap between the columns if there is any whitespace between them
in the HTML

```css
nav {
  display: inline-block;
  vertical-align: top;
  width: 25%;
}

.column {
  display: inline-block;
  vertical-align: top;
  width: 75%;
}
```






