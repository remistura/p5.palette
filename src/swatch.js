class Swatch {
  constructor(color, weight, skip) {
    if (!color) throw "A swatch needs a color!";
    this.color = color;
    this.weight = weight || 1;
    this.skip = skip || false;
  }
}
