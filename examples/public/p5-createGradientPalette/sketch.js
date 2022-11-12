function setup() {
  createCanvas(280, 255);
}

function draw() {
  background(127);

  let palette = createGradientPalette();
  palette.draw({ x: 10, y: 10 });

  palette = createGradientPalette({ start: color(255, 0, 0)});
  palette.draw({ x: 10, y: 70 });

  palette = createGradientPalette({ end: color(255, 0, 0)});
  palette.draw({ x: 10, y: 130 });

  palette = createGradientPalette({ amount: 25, start: color(240, 240, 0), end: color(0, 0, 255)});
  palette.draw({ x: 10, y: 190, width: 250 });

  noLoop();
}
