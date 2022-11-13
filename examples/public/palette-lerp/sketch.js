function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(127);

  const palette = createPalette();
  palette.add(color("#c0392b"));
  palette.add(color("#e67e22"));
  palette.add(color("#f1c40f"));
  palette.add(color("#2ecc71"));
  palette.add(color("#3498db"));
  palette.add(color("#8e44ad"));
  palette.draw({ x: 0, y: 70, drawBorder: true, borderWeight: 2 });

  const steps = 100;
  const blockSize = width/steps;
  for(var i = 0; i < steps; i++){
    const percent = i/steps;
    noStroke();
    fill(palette.lerp(percent));
    rect(blockSize * i, 180, blockSize, 50);
  }

  noLoop();
}
