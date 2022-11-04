function setup() {
  createCanvas(280, 255);
}

function draw() {
  background(127);

  let palette = createPalette("fff708");
  palette.draw({ x: 10, y: 10, width: 33 });
  let complementaryPalette = palette.getComplementary();
  complementaryPalette.draw({ x: 10, y: 70, width: 33 });

  palette = createPalette("fff275-ff8c42-ff3c38-a23e48-6c8ead");
  palette.draw({ x: 10, y: 130 });
  complementaryPalette = palette.getComplementary();
  complementaryPalette.draw({ x: 10, y: 190 });
  noLoop();
}
