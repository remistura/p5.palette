let palettes;

function setup() {
  createCanvas(500, 500);
  background(0, 25);

  // Load palettes from browser's local storage
  palettes = loadStoredPalettes();
}

function draw() {
  
  palettes.forEach((palette, index) => {
    palette.draw({ y: index * 50 });
  });

  noLoop();
}