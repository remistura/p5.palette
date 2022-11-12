let palette;

function preload() { console.log('--- preload ----')
  palette = loadRandomColormindPalette();
  console.log({palette})
}

function setup() { console.log('--- setup ---')
  createCanvas(500, 500);
  background(0, 25);
  
}

function draw() {
  console.log('--- draw ---')
  palette.draw();
  storePalette(palette);
  noLoop();
}