function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {

  let palette = createGradientPalette();
  palette.draw({ x: 10, y: 10 });

  palette = createGradientPalette({ start: color(255, 0, 0)});
  palette.draw({ x: 10, y: 70 });

  palette = createGradientPalette({ end: color(255, 0, 0)});
  palette.draw({ x: 10, y: 130 });

  palette = createGradientPalette({ amount: 25, start: color(240, 240, 0), end: color(0, 0, 255)});
  palette.draw({ x: 10, y: 190, width: 15 });

  noLoop();
}
