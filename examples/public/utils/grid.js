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

  draw(useCircles = false) {
    const xx = this.x + this.ix * this.dw;
    const yy = this.y + this.iy * this.dh;
    if (useCircles) {
      const diameter = this.dw > this.dh ? this.dw : this.dh;
      this.P.circle(xx + this.dw / 2, yy + this.dh / 2, diameter * 0.8);
    } else {
      this.P.rect(xx, yy, this.dw, this.dh);
    }
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
