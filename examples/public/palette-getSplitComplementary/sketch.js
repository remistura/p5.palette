function setup() {
  createCanvas(520, 250);
  background(0);
}

function draw() {
  const palette1 = createPalette("fff708");
  palette1.draw({ x: 10, y: 10 });

  const splitComplementaryPalette1 = palette1.getSplitComplementary();
  splitComplementaryPalette1.draw({ x: 10, y: 70 });

  const palette2 = createPalette("fff275-ff8c42-ff3c38-a23e48-6c8ead");
  palette2.draw({ x: 10, y: 130 });

  const splitComplementaryPalette2 = palette2.getSplitComplementary();
  splitComplementaryPalette2.draw({ x: 10, y: 190 });
  
  noLoop();
}
