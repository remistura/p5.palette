/*
Use this code to save a single palette as a PNG image.
Configure colors, run page and hit [ENTER] to save image.
*/

// Put palette colors here
const COLORS = "e3e7af-a2a77f-eff1c5-035e7b-002e2c";

// Size of each color
const HEIGHT = 50;
const WIDTH = 50;

let palette;

function setup() {
  palette = createPalette(COLORS);
  const total = palette.size();
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