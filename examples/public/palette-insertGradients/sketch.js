function setup() {
  createCanvas(500, 500);
  background(0, 25);
}

function draw() {
  
  let palette = createPalette("3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 10, y: 10 });

  palette.insertGradients(10).draw({ x: 10, y: 70, width: 10 });;

  palette = createPalette("3498db-2ecc71-f1c40f-e67e22-c0392b");
  palette.draw({ x: 10, y: 130 });

  palette.insertGradients(10, true).draw({ x: 10, y: 190, width: 10 });;

  noLoop();
}
