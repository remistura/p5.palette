let palettes;

const hexPalettes = [
  "251d2d-57485c-a39bab-dec7d9-dfad9c",
  "2c1129-334d4d-759484-cbcab6-a99a71",
  "20434d-7bd153-f2c330-f5a818-e33e34",
  "5f513a-aa976a-fdfcf7-819989-2e2f34",
  "e17045-fcdf8a-fefcfa-55bab3-5a8174",
  "074049-1c8c6c-c2d981-edd694-d62c30",
];

function setup() {
  createCanvas(500, 500);
  background(0, 25);

  // Load palettes from array of hex strings
  palettes = loadPalettes(hexPalettes);
}

function draw() {
  palettes.forEach((palette, index) => {
    palette.draw({ y: index * 50 });
  });

  noLoop();
}
