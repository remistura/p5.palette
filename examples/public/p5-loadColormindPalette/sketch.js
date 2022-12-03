let paletteAsync, paletteSync;

function preload() {
  // Load palette synchronously
  paletteSync = loadColormindPalette();
}

function setup() {
  createCanvas(250, 210);
  background(0, 25);
  textAlign(CENTER);

  // Load palette asynchronously (using callback function)
  loadColormindPalette(paletteLoaded);
  noLoop();
}

function draw() {
  if (!isLooping()) return;

  text('Palette loaded synchronously', 125, 30);
  paletteSync.draw({ y: 35 });

  text('Palette loaded asynchronously', 125, 125);
  paletteAsync.draw({ y: 130 });
  noLoop();
}

function paletteLoaded(pal) {
  paletteAsync = pal.clone();
  loop();
}
