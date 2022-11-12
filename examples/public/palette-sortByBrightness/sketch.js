function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {
  
  const palette = createGradientPalette({ amount: 10, start: color(240, 240, 0), end: color(0, 0, 255)});
  palette.draw({ x: 10, y: 10, width: 40 });

  palette.shuffle();
  palette.draw({ x: 10, y: 70, width: 40 });

  palette.sortByBrightness();
  palette.draw({ x: 10, y: 130, width: 40 });

  noLoop();
}
