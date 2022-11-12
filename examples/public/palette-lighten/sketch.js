function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {
  let y = 10;

  let palette = createPalette("8e44ad-3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 10, y, height: 25, drawBorder: true, borderWeight: 2 });

  const total = 15;

  for (let i = 0; i < total; i++) {
    y += 30;
    palette.lighten();
    palette.draw({ x: 10, y, height: 25, drawBorder: true, borderWeight: 2 });
  }

  noLoop();
}
