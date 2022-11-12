let palette;

function preload() {
  palette = loadColormindPalette();
}

function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {
  palette.draw();

  // Store palette in browser's local storage
  storePalette(palette);
  
  noLoop();
}