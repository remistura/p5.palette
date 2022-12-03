function setup() {
  createCanvas(250, 485);
  textAlign(CENTER);
}

function draw() {
  background(239, 238, 187);

  text("black to white (default)", 125, 30);
  createGrayscalePalette().draw({ y: 35 });

  text("2 colors", 125, 105);
  createGrayscalePalette({ amount: 2}).draw({ y:110 });

  text("black to middle gray", 125, 180);
  createGrayscalePalette({ end: 127, amount: 5}).draw({ y: 185 });

  text("middle gray to white", 125, 255);
  createGrayscalePalette({ start: 127, amount: 5}).draw({ y: 260 });

  text("gray 64 to gray 192", 125, 330);
  createGrayscalePalette({ start: 64, end: 192, amount: 5}).draw({ y: 335 });

  text("black to white (255 levels)", 125, 405);
  createGrayscalePalette({ amount: 255}).draw({ y: 410, width: 1 });

  noLoop();
}
