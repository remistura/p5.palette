function setup() {
  createCanvas(280, 375);
}

function draw() {
  background(239, 238, 187);

  let palette = createGrayscalePalette();
  palette.draw({ x: 10, y: 10 });

  palette = createGrayscalePalette({ amount: 2});
  palette.draw({ x: 10, y: 70 });

  palette = createGrayscalePalette({ end: 127, amount: 5});
  palette.draw({ x: 10, y: 130 });

  palette = createGrayscalePalette({ start: 127, amount: 5});
  palette.draw({ x: 10, y: 190 });

  palette = createGrayscalePalette({ start: 64, end: 192, amount: 5});
  palette.draw({ x: 10, y: 250 });

  palette = createGrayscalePalette({ amount: 255});
  palette.draw({ x: 10, y: 310, width: 256 });

  noLoop();
}
