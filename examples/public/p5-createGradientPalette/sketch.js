function setup() {
  createCanvas(250, 340);
  background(0, 25);
  textAlign(CENTER);
}

function draw() {
  text("white to black (default)", 125, 30);
  createGradientPalette().draw({ y: 35 });

  text("red to black", 125, 105);
  createGradientPalette({ start: color(255, 0, 0) }).draw({ y: 110 });

  text("white to red", 125, 180);
  createGradientPalette({ end: color(255, 0, 0) }).draw({ y: 185 });

  text("yellow to blue", 125, 255);
  createGradientPalette({ amount: 50, start: color(240, 240, 0), end: color(0, 0, 255) }).draw({ y: 260, width: 5 });

  noLoop();
}
