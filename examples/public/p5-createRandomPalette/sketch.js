let palette, grid;

function setup() {
  createCanvas(500, 500);
  background(0, 25);

  palette = loadColormindPalette();
  palette.log(false);

  grid = new Grid(this, 50, 105, 400, 350, 11, 13);

  strokeWeight(5);
}

function draw() {
  palette.draw({ x: 127, y: 25, drawBorder: true, showIndex: true, showCursor: true });

  fill(palette.next());
  stroke(palette.next()); 
  
  if (!grid.draw()) noLoop();
}

function keyPressed() {
  
  loop();
}

class Grid {
  constructor(P, x, y, w, h, totalX, totalY) {
    this.P = P;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.totalX = totalX;
    this.totalY = totalY;

    this.ix = 0;
    this.iy = 0;

    this.dw = w / this.totalX;
    this.dh = h / this.totalY;
  }

  draw() {
    const xx = this.x + this.ix * this.dw;
    const yy = this.y + this.iy * this.dh;
    this.P.rect(xx, yy, this.dw, this.dh);
    this.ix++;
    if (this.ix === this.totalX) {
      this.ix = 0;
      this.iy++;
      if (this.iy === this.totalY) {
        this.iy = 0;
        this.ix = 0;
        return false;
      }
    }
    return true;
  }
}
