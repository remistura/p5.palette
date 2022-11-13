let palette, grid;

function setup() {
  createCanvas(500, 500);
  background(0, 25);

  palette = loadColormindPalette();
  // palette.setWeights([0.1, 1, 0.1, 0.1, 2]);
  palette.log(false);

  grid = new Grid(this, 50, 105, 400, 350, 20, 20);

  strokeWeight(5);
}

function draw() {
  palette.draw({ x: 127, y: 25, drawBorder: true, showIndex: true, showCursor: true });

  const col = palette.random();
  fill(col);
  stroke(col);

  if (!grid.draw()) noLoop();
}