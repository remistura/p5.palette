let counter = 0;
let palette, grid;

const TOTAL_X = 20;
const TOTAL_Y = 20;

const TOTAL = TOTAL_X * TOTAL_Y;

function preload() {
}

function setup() {
  palette = loadColormindPalette();
  palette.log(false);

  createCanvas(500, 500);

  // Color at index zero will be used to paint background
  background(palette.get(0));

  // Skip 3 of 5 colors, start using only 2
  palette.skip(0);
  palette.skip(2);
  palette.skip(4);

  grid = new Grid(this, 50, 105, 400, 350, TOTAL_X, TOTAL_Y);

  noStroke();
}

function draw() {
  palette.draw({ x: 127, y: 25, drawBorder: true, showIndex: true, showCursor: true, showSkipped: true });

  const col = palette.next();
  fill(col);

  counter++;

  if (counter === Math.floor(TOTAL / 4)) {
    // Use 3 colors for 2nd quarter
    palette.unskip(2);
  }

  if (counter === Math.floor(2 * TOTAL / 4)) {
    // Use 4 colors for 3rd quarter
    palette.unskip(4);
  }

  if (counter === Math.floor(3 * TOTAL / 4)) {
    // Use all colors for last quarter
    palette.unskip(0);
  }

  if (!grid.draw(true)) noLoop();
}
