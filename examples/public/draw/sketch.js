function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(127);

  let y = 10;

  let palette = createPalette("8e44ad-3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 10, y, drawBorder: true, borderWeight: 2 });

  noLoop();
}
