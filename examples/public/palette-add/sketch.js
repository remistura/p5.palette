function setup() {
  createCanvas(470, 250);
  background(127);
}

function draw() {
  
  const palette = createPalette("8e44ad-3498db-2ecc71");
  palette.draw({ x: 10, y: 10 });

  palette.add(color("#f1c40f"));
  palette.draw({ x: 10, y: 70 });

  const otherPalette = createRandomPalette();
  otherPalette.draw({ x: 10, y: 130 });

  otherPalette.add(palette);
  otherPalette.draw({ x: 10, y: 190 });

  noLoop();
}
