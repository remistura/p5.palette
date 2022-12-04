/*
Use this code to save a single palette as a PNG image.
Configure colors, run page and hit [ENTER] to save image.
*/

// Put palette colors here
const COLORS = "264653-2a9d8f-e9c46a-f4a261-e76f51";

// Size of each color
const HEIGHT = 50;
const WIDTH = 50;

let palette;

function setup() {
  palette = createPalette(COLORS);
  const total = palette.size();
  pixelDensity(1);
  createCanvas(WIDTH * total, HEIGHT);
}

function draw() {
  background(255);
  palette.draw();
  noLoop();
}

function keyPressed() {
  if (keyCode === ENTER) {
    save(`${COLORS}.png`);
  } 
}