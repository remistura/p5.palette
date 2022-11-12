let palette;
let palettes;
let xmlPalleton;

function preload() {
  xmlPalleton = loadXML("assets/paletton.xml");
}

function setup() {
  createCanvas(280, 255);
  background(127);

  palettes = processXML(xmlPalleton);
}

function draw() {
  palettes.forEach((palette, index) => {
    const y = index * 50;
    palette.draw({y});
  });

  noLoop();
}

function processXML(xmlPalette) {
  console.log("--- processXML ---");
  const palettes = [];

  if (xmlPalette.hasChildren()) {
    console.log("- has children");

    xmlPalette.getChildren().forEach((child) => {
      if (child.getName() === "colorset") {
        let xmlColorset = child;
        let colorsetChildren = xmlColorset.getChildren();
        let palette = createPalette();
        colorsetChildren.forEach((col) => {
          let hex = col.getString('rgb');
          palette.add(this.color(`#${hex}`));
        });
        palettes.push(palette);
      }
    });
  }

  return palettes;
}
