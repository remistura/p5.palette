function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {
  let palette = createPalette("fff708");
  palette.draw({ x: 10, y: 10, width: 33 });
  palette.addAnalogousColors();
  palette.draw({ x: 10, y: 70 });

  palette = createPalette("fff275-ff3c38-a23e48-6c8ead");
  palette.draw({ x: 10, y: 130 });
  palette.addAnalogousColors();
  palette.draw({ x: 10, y: 190 });
  noLoop();
}
