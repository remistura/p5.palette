function setup() {
  createCanvas(350, 255);
}

function draw() {
  background(127);

  let palette = createPalette("fff708");
  palette.draw({ x: 10, y: 10, width: 33 });

  let analogousPalette = palette.getAnalogous();
  analogousPalette.draw({ x: 10, y: 70, width: 33 });

  palette = createPalette("fff275-ff8c42-ff3c38-a23e48-6c8ead");
  palette.draw({ x: 10, y: 130, width: 33 });

  analogousPalette = palette.getAnalogous();
  analogousPalette.draw({ x: 10, y: 190, width: 33 });
  
  noLoop();
}
