const COLORS = "e3e7af-a2a77f-eff1c5-035e7b-002e2c";

function setup() {
  createCanvas(500, 750);
}

function draw() {
  background(127);

  let palette = createPalette(COLORS);
  palette.draw();

  let x = 25;
  let y = 75;
  palette.draw({ x, y });

  y += 75;
  palette.draw({ x, y, width: 25 });

  y += 75;
  palette.draw({ x, y, height: 25 });

  y += 50;
  palette.draw({ x, y, width: 50, height: 50, drawBorder: true });

  y += 75;
  palette.draw({ x, y, width: 50, height: 50, drawBorder: true, borderWeight: 5 });

  y += 75;
  palette.draw({ x, y, width: 50, height: 50, drawBorder: true, borderColor: color(0, 255, 0), borderWeight: 5 });

  y += 75;
  palette.draw({ x, y, width: 50, height: 50, offset: 20 });

  y += 75;
  palette.draw({ x, y, width: 50, height: 50, offset: 20, drawBorder: true, borderWeight: 10, showCursor: false, showIndex: true });

  y += 75;
  palette.draw({ x, y, width: 50, height: 50, showIndex: true });

  y = 25;
  palette.draw({ x: 300, y, width: 50, height: 50, vertical: true});

  palette.draw({ x: 370, y, width: 50, height: 50, offset: 10, vertical: true});

  palette.draw({ x: 440, y, width: 50, height: 50, showCursor: true, showIndex: true, vertical: true});

  noLoop();
}
