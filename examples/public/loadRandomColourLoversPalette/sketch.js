let paletteAsync, paletteSync;

async function preload() {
  console.log('--- preload ---')
  paletteSync = loadRandomColourLoversPalette();
}

async function setup() {
  console.log('--- setup ---')
  createCanvas(250, 255);
  loadRandomColourLoversPalette(paletteLoaded);
  noLoop();
}

function draw() {
  console.log('--- draw ---')
  if (!isLooping()) return;
  background(127);
  paletteSync.draw();
  paletteAsync.draw({ y: 50 });
  noLoop();
}

function paletteLoaded(pal) {
  paletteAsync = pal.clone();
  loop();
}