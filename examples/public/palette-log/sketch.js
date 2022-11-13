function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {

  const palette = createPalette("8e44ad-3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 10, y: 10, drawBorder: true, borderWeight: 2 });
  palette.log();
  palette.log(false);
  console.log(palette.toHexString());
  console.log(palette.toString());
  console.log(palette.toString({ separator: ',', format:'rgba(r, g, b, a)'}));
  console.log(palette.toString({ separator: ',', format:'hsl'}));
  console.log(palette.toString({ separator: ',', format:'rgb%'}));
  
  // See https://p5js.org/reference/#/p5.Color/toString for more formats
  // to use with 'toString'
  
  noLoop();
}
