let paletteAsync, paletteSync;

function preload() { console.log('preload')
  // Load palette synchronously
  paletteSync = loadRandomColormindPalette();
}

function setup() { console.log('setup')
  createCanvas(250, 255);
  // Load palette asynchronously (using callback function)
  loadRandomColormindPalette(paletteLoaded);
  noLoop();
}

function draw() { console.log('draw')
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
