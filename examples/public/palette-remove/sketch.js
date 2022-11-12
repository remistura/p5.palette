function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {
  
  const palette = createPalette("8e44ad-3498db-2ecc71-f1c40f");
  palette.set(2).draw({ x: 10, y: 10, showIndex: true, showCursor: true});

  palette.remove(2).draw({ x: 10, y: 70, showIndex: true, showCursor: true});

  palette.remove(2).draw({ x: 10, y: 130, showIndex: true, showCursor: true});

  palette.remove(0).draw({ x: 10, y: 190, showIndex: true, showCursor: true});

  noLoop();
}
