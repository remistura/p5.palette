let paletteAsync, paletteSync;

async function preload() {
  paletteSync = loadColourLoversPalette();
}

async function setup() {
  createCanvas(500, 500);
  background(0, 25);
  loadColourLoversPalette(paletteLoaded);
  noLoop();
}

function draw() {
  if (!isLooping()) return;
  
  paletteSync.draw();
  paletteAsync.draw({ y: 50 });
  noLoop();
}

function paletteLoaded(pal) {
  paletteAsync = pal.clone();
  loop();
}