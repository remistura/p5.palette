# p5.palette

A JavaScript library for color palette management in [p5.js](https://p5js.org/).

![Color palette](doc/img/palette.png)

## Introduction

This library helps fast prototyping creative visual applications by providing functions to generate and manage color palettes.

It is strongly inspired by [colorLib](https://github.com/vormplus/colorLib) library for [Processing](https://processing.org/). 

p5.js missed something similar, so while converting some sketches from Processing (Java) to p5.js (JavaScript), I could neatly extract and migrate features from some hacks I had done in colorLib for personal usage, all joined in **p5.palette**.

The library allows you to create and manipulate color palettes in a very dynamic way, helping develop creative coding applications with color harmony and aesthetic appeal in a very fast pace.

## Installation

Please download the latest `p5.palette.min.js` release from the [lib](https://github.com/remistura/p5.palette/tree/main/lib) directory.

```html
<script type="text/javascript" src="path-to/p5.min.js"></script>
<script type="text/javascript" src="path-to/p5.palette.min.js"></script>
```

## Palette class

The library provides a `Palette` class that represents a finite collection of colors.

![Color palette](doc/img/palette-class.png)

Internally, each color has an index number, starting from zero:

![Color palette](doc/img/palette-class-index.png)

It is possible to use colors through their index with the `get()` function:

```javascript
const col = palette.get(2);
fill(col);
```

One important aspect of the Palette class is that there is a cursor that points to one color, with will be the "selected" one. The cursor always starts at the first color (index zero):

![Color palette](doc/img/palette-class-index-cursor.png)

The Palette class has some methods to get the current selected color.

One of the most commonly used is the `next()` function:

```javascript
const col1 = palette.next();
fill(col1);
```

It will return the current selected color and move the cursor to the next one.

![Color palette](doc/img/palette-class-index-cursor-next1.png)

Calling `next()` once again will return the color at index 1 and step the cursor to index 2.

```javascript
const col2 = palette.next();
stroke(col2);
```

![Color palette](doc/img/palette-class-index-cursor-next2.png)

When `next()` is invoked more times and the cursor gets to the index of the last color, it will be set back to zero when `next()` is called again.

There's a `previous()` method as well, with similar behavior, providing the current selected color and moving down the cursor to the color at previous index value.

When the cursor is at the first color, calling `previous()` will move it up to the last color (the one with the highest index).

If you want to get the current selected color without affecting the cursor position, simply call `get()` without arguments:

```javascript
const bkgColor = palette.get();
background(bkgColor);
```

Using `get()` will return always the single selected color at the time.

## Create palette

The most basic way to create a Palette is:

```javascript
let palette;

function setup() {
    createCanvas(500, 500);
    palette = createPalette();
}

function draw() {
    ...use palette here
}
```

The palette object created is empty, it has no colors at the moment.
It is possible to add some colors to the palette:

```javascript
let palette;

function setup() {
    createCanvas(500, 500);
    palette = createPalette();
    palette
        .add(color("#c0392b"))
        .add(color(255, 204, 0))
        .add(color("magenta"))
        .add(color("#0f0"))
        .add(color("rgb(0,0,255)"))
        .add(color("hsl(160, 100%, 50%)"))
        .add(color("hsb(160, 100%, 50%)"));  
}

function draw() {
    ...use palette here
}
```

The `add()` function takes a p5.js [Color](https://p5js.org/reference/#/p5.Color) object and stores it into an internal array structure.

Each color added will have a numeric index, starting from zero.

Every Palette will have one of the colors selected at a time, and only one color can be selected. That color will be returned by the functions that deliver colors to be used by the application.

It is possible to easily visualize the colors in the palette using the `draw()` function:

```javascript
let palette;

function setup() {
  pixelDensity(1);
  createCanvas(400, 200);
  palette = createPalette();
  palette
    .add(color("#c0392b"))
    .add(color(255, 204, 0))
    .add(color("magenta"))
    .add(color("#0f0"))
    .add(color("rgb(0,0,255)"))
    .add(color("hsl(160, 100%, 50%)"))
    .add(color("hsb(160, 100%, 50%)"));  
}

function draw() {
  background(255);
  palette.draw();
  noLoop();
}
```

It will plot a rectangle for each color:

![Color palette](doc/img/palette-add.png)

That is useful for inpecting the palette, but you might not want plotted in your sketch.

Yet another way to visualize the palette is through the `log()` function:

```javascript
let palette;

function setup() {
  pixelDensity(1);
  createCanvas(400, 200);
  palette = createPalette();
  palette
    .add(color("#c0392b"))
    .add(color(255, 204, 0))
    .add(color("magenta"))
    .add(color("#0f0"))
    .add(color("rgb(0,0,255)"))
    .add(color("hsl(160, 100%, 50%)"))
    .add(color("hsb(160, 100%, 50%)"));  
  palette.log(); // Log colors to console
}
```

The colors will be output on the browser console:

![Log](doc/img/log.png)

## Loading palettes

Besides creating your own color palette manually, it is possible to load existing palettes from third party sources.

One way is to pass a string containg **color hexadecimals** to the constructor:

```javascript
let palette = createPalette('264653-2a9d8f-e9c46a-f4a261-e76f51');
palette.draw();
```

![Color palette](doc/img/palette-hex-string.png)

That is very useful for loading palettes chosen in sites like [Coolors](https://coolors.co/) and [poolors](https://poolors.com/), where you can copy the hexadecimals string from the palette URL.

There are two other ways to load palettes from the API's of some specialized color sites, such as [COLOURlovers](http://www.colourlovers.com) and [Colormind](http://colormind.io).


# Contributing

You can fork the project and submit your pull-request.

This project uses the task manager [Grunt](https://gruntjs.com/).

On the terminal, in the project folder directory:
1. Install `grunt-cli`: ```npm install -g grunt-cli```
2. Install packages: ```npm install```

## Build

Run `grunt` on the terminal to compile the library, it will also export to examples folder.

## Developing

Run `grunt watch` to update changes in real time.