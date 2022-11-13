function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {

  // Create an empty palette
  const emptyPalette = createPalette();
  emptyPalette.draw({ x: 10, y: 10, drawBorder: true, borderWeight: 2 });

  // Create palette and add colors individually
  const palette = createPalette();
  palette.add(color("#c0392b"));
  palette.add(color(255, 204, 0));
  palette.add(color("magenta"));
  palette.add(color("#0f0"));
  palette.add(color("rgb(0,0,255)"));
  palette.add(color("hsl(160, 100%, 50%)"));
  palette.add(color("hsb(160, 100%, 50%)"));
  palette.draw({ x: 10, y: 70, drawBorder: true, borderWeight: 2 });

  // Create palette from color array
  const arr = [color("#c0392b"), color("#e67e22"), color("#f1c40f"), color("#2ecc71"), color("#3498db"), color("#8e44ad")];
  const paletteFromArray = createPalette(arr);
  paletteFromArray.draw({ x: 10, y: 130, drawBorder: true, borderWeight: 2 });

  // Create palette from hex colors string
  createPalette("8e44ad-3498db-2ecc71-f1c40f-e67e22-c0392b").draw({ x: 10, y: 190, drawBorder: true, borderWeight: 2 });

  noLoop();
}
