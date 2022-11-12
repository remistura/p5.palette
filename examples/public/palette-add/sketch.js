function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {
  
  const palette = createPalette("8e44ad-3498db-2ecc71");
  palette.add(color("#f1c40f"));
  palette.draw({ x: 10, y: 10 });

  const otherPalette = createRandomPalette();
  otherPalette.draw({ x: 10, y: 70 });

  otherPalette.add(palette);
  otherPalette.draw({ x: 10, y: 130 });

  noLoop();
}
