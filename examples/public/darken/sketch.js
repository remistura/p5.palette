function setup() {
  createCanvas(245, 970);
}

function draw() {
  background(127);

  let y = 10;

  let palette = createPalette("8e44ad-3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 10, y, drawBorder: true, borderWeight: 2 });

  const total = 15;

  for (let i = 0; i < total; i++) {
    y += 60;
    palette.darken();
    palette.draw({ x: 10, y, drawBorder: true, borderWeight: 2 });
  }

  y = 10;
  palette = createPalette("8e44ad-3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 130, y, drawBorder: true, borderWeight: 2 });

  for (let i = 0; i < total; i++) {
    y += 60;
    palette.lighten();
    palette.draw({ x: 130, y, drawBorder: true, borderWeight: 2 });
  }

  noLoop();
}
