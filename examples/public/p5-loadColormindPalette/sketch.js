let paletteAsync, paletteSync;

function preload() {
  // Load palette synchronously
  paletteSync = loadColormindPalette();
}

function setup() {
  createCanvas(500, 500);
  background(0, 25);

  // Load palette asynchronously (using callback function)
  loadColormindPalette(paletteLoaded);
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
