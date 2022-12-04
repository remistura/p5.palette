function setup() {
  createCanvas(320, 495);
  background(0);
}

function draw() {
  // Create palette from hex colors string
  const palette = createPalette("8e44ad-3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 10, y: 10 });

  let y = 63;

  for (let i = 0; i < 8; i++) {
    palette.shuffle();
    palette.draw({ x: 10, y });
    y += 53;
  }
  noLoop();
}
