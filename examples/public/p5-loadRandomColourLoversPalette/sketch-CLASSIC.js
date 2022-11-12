let palette;

function setup() {
  createCanvas(250, 255);
  loadRandomColourLoversPalette(paletteLoaded);
  noLoop();
}

function draw() {
  if (!isLooping()) return;
  background(127);
  palette.draw();
  noLoop();
}

function paletteLoaded(pal) {
  palette = pal.clone();
  loop();
}