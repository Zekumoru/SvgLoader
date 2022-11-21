# Svg Inline Loader (@zekumoru-dev/svg-loader)

## Introduction

SvgLoader is a utility package to dynamically convert `<img>` elements to their corresponding `<svg>` elements. It does so by looking up the `data-svg-load` attribute in `<img>` elements and using their `src` attribute to fetch and finally replace them with `<svg>`.

SvgLoader also does not ignore any of the other attributes associated to the `<img>` element (e.g. `class`, `style`, etc.) and will be included in the replaced `<svg>`. Meaning, you will be able to control the `<svg>` elements as if you put them directly in the HTML document itself.

### Examples

#### Replacing img elements

HTML:

```html
<img data-svg-load="colorable, wrap" src="images/logo.svg" class="logo" />
```

CSS:

```css
.logo {
  width: 50px;
  height: 50px;
  color: limegreen;
}
```

JavaScript:

```js
import "@zekumoru-dev/svg-loader/SvgLoader";
```

#### Loading svg

```js
const svg = await SvgLoader.load("images/logo.svg", {
  class: "logo",
  colorable: true,
  wrap: "div",
});

someElement.appendChild(svg);
```

<br>

## Installation

Using npm:

```
npm i @zekumoru-dev/svg-loader
```

> **Warning:** SvgLoader requires webpack and the following packages: `axios` and `copy-webpack-plugin`.

<br>

## Configuration

### CopyWebpackPlugin

In your `webpack.config.js` file, make sure that a pattern is set to where your `.svg` files are.

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');
...

module.exports = {
  ...
  plugins: [
    ...
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images'),
          to: 'images',
        },
      ],
    }),
  ],
  ...
};
```

CopyWebpackPlugin will copy all the files in `src/images` and include them to the build directory under the `images` directory.

> Where you put the copied files in the build directory is important! The directory's name should be the same as where you put it in your repository as shown in the example above.

### Webpack DevServer

If you are using `webpack-dev-server` to serve your web application, make sure the directory, where your svg files are stored, is included in the `static` property. This is so axios can fetch the svg files in the server.

```js
module.exports = {
  ...
  devServer: {
    static: [
      ...
      {
        directory: path.resolve(__dirname, 'src/images'),
        publicPath: '/images',
      },
    ],
    ...
  },
};
```

> Same as before, make sure the `publicPath` is the same as the local directory `src/images`.

<br>

## Usage

Simply import SvgLoader and it will automatically find images attributed `data-svg-load` to process and inline replace them with their svg counterparts.

```js
import SvgLoader from "@zekumoru-dev/svg-loader/SvgLoader";
```

Or succintly:

```js
import "@zekumoru-dev/svg-loader/SvgLoader";
```

<br>

# Documentation

## Attributes

### data-svg-load

```html
<img data-svg-load src="images/logo.svg" />
```

Passing in options:

```html
<img data-svg-load="colorable, wrap=span" src="images/logo.svg" />
```

Marks the `<img>` for inline svg processing. If omitted, SvgLoader **will ignore** it.

#### Options

<b>colorable</b>

Makes the svg be able to be coloured using the `color` css property.

<b>wrap</b>

Wraps the svg inside a wrapper element. Default is `div`.

### <s>data-svg-colorable</s> <strong style="color: firebrick;">deprecated</strong>

_This attribute is deprecated as of version 1.1.0 in favor of the new options value for the `data-svg-load` attribute._

```html
<img data-svg-load data-svg-colorable="true" src="images/logo.svg" />
```

If set to `true`, the CSS property `color` will take effect.

SvgLoader finds all `<path>` and `<g>` elements in the svg file and set their `fill` and `stroke` attributes to `currentColor`, ignores if their value is `none`.

> It is highly recommended to only use this attribute to one-coloured svg files.

<br>

## Methods

### SvgLoader.load

```js
async SvgLoader.load(url, attrs?)
```

Loads the svg provided in the url then returns it. If a wrap option is provided, it will return the wrapper instead.

#### attrs?

Pass in attributes as you normally would when in an element like `style`, `class`, etc. This is also where you pass in options:

<b>colorable</b>

Makes the svg be able to be coloured using the `color` css property.

```js
SvgLoader.load(url, {
  ...
  colorable: true,
});
```

<b>wrap</b>

Wraps the svg inside a wrapper element. Default is `div`.

```js
SvgLoader.load(url, {
  ...
  wrap: 'span',
});
```

Passing in an empty string or `true` will still wrap the svg in `div`. Passing in `false` will not wrap the svg. (But why would you do that though?)

## Logs

### Version 1.1.0

- Make colorable even without setting the attribute `data-svg-colorable` to true
- Add options to `data-svg-load`
  - wrap: wraps the svg inside a wrapper element.

### Version 1.0.1 and 1.0.2

Initial release.
