/**
 * This class represents a color palette, which is a container for p5.Color
 * objects that has a cursor that points to one currently selected color.
 *
 * @class Palette
 */
class Palette {
  constructor(P, colors) {
    this.P = P;
    this.swatches = [];
    if (colors && Array.isArray(colors)) {
      this.swatches = this.#colorsToSwatches(colors);
    }
    this.index = this.swatches.length ? 0 : -1;
    this.weightedDist = [];
  }

  /**
   * Add one color or all colors from an existing palette to this palette.
   *
   * @param {p5.Color|Palette} arg A Color object or a Palette object
   * @return {Palette} Reference to this palette
   * @memberof Palette
   */
  add(arg) {
    if (!arg) throw new Error("Nothing to add to palette");
    // REFACTORED
    if (arg instanceof Palette) {
      for (let i = 0; i < arg.size(); i++) {
        this.swatches.push(new Swatch(arg.get(i)));
      }
    } else {
      this.swatches.push(new Swatch(arg));
    }
    if (this.swatches.length && this.index < 0) this.index = 0;
    return this;
  }

  /**
   * Adds two analogous colors for each color of this palette, inserting them
   * before and after the corresponding color index.
   *
   * @return {Palette} Reference to this palette
   * @memberof Palette
   */
  addAnalogousColors() {
    const analogous = this.getAnalogous();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(analogous.get(i * 2));
      newColors.push(this.get(i));
      newColors.push(analogous.get(i * 2 + 1));
    }
    this.colors = Array.from(newColors);
    return this;
  }

  /**
   * Adds one complementary color for each color of this palette, and inserts it
   * after the corresponding color index.
   *
   * @return {Palette} Reference to this palette
   * @memberof Palette
   */
  addComplementaryColors() {
    const complementary = this.getComplementary();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(this.get(i));
      newColors.push(complementary.get(i));
    }
    this.colors = Array.from(newColors);
    return this;
  }

  addSplitComplementaryColors() {
    const complementary = this.getSplitComplementary();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(complementary.get(i * 2));
      newColors.push(this.get(i));
      newColors.push(complementary.get(i * 2 + 1));
    }
    this.colors = Array.from(newColors);
    return this;
  }

  addTriadicColors() {
    const triadic = this.getTriadic();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(triadic.get(i * 2));
      newColors.push(this.get(i));
      newColors.push(triadic.get(i * 2 + 1));
    }
    this.colors = Array.from(newColors);
    return this;
  }

  /**
   * Removes all colors of this palette and resets the cursor index.
   *
   * @memberof Palette
   */
  clear() {
    // REFACTORED
    this.swatches = [];
    this.index = -1;
  }

  /**
   * Return a Palette object containing the same colors as this palette.
   *
   * @return {Palette} A cloned palette
   * @memberof Palette
   */
  clone() {
    return this.P.createPalette(this.getColors());
  }

  /**
   * Returns the current color selected by the cursor index.
   *
   * @return {p5.Color} A p5.Color object
   * @memberof Palette
   */
  current() {
    return this.swatches[this.index].color;
  }

  /**
   * Darkens all colors of this palette.
   *
   * @return {Palette} The palette with darkened colors
   * @memberof Palette
   */
  darken() {
    this.P.push();
    this.P.colorMode(HSB);
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      const col = this.get(i);
      newColors.push(this.P.color(this.P.hue(col), this.P.saturation(col), this.P.brightness(col) * 0.9));
    }
    this.colors = Array.from(newColors);
    this.P.pop();
    return this;
  }

  /**
   * Draw a rectangle for each color of the palette.
   *
   * @param {*} args
   * @return {Palette} The palette with darkened colors
   * @memberof Palette
   */
  draw(args) {
    const props = args || {};
    const {
      borderColor = 0,
      borderWeight = 1,
      drawBorder = false,
      fontSize = 12,
      height = 50,
      offset = 0,
      showCursor = false,
      showIndex = false,
      showSkipped = false,
      vertical = false,
      width = 50,
      x = 0,
      y = 0,
    } = props;
    this.P.push();
    this.P.noStroke();
    let xx = x;
    let yy = y;
    let total = this.swatches.length;

    for (let i = 0; i < total; i++) {
      const col = this.swatches[i].color;

      // Draw border
      if (drawBorder) {
        this.P.noFill();
        this.P.stroke(borderColor);
        this.P.strokeWeight(borderWeight);
        this.P.rect(xx, yy, width, height);
      }

      // Draw color rectangle
      this.P.noStroke();
      this.P.fill(col);
      this.P.rect(xx, yy, width, height);

      // Draw index text
      if (showIndex) {
        this.P.colorMode(HSB);
        const textCol = this.P.brightness(col) > 50 ? 0 : 255;
        this.P.fill(textCol);
        this.P.stroke(textCol);
        this.P.strokeWeight(1);
        this.P.textAlign(this.P.CENTER, this.P.CENTER);
        this.P.textSize(fontSize);
        const cx = xx + width / 2;
        const cy = yy + height / 2;
        const indexStr = `${i}`;
        this.P.text(indexStr, cx, cy);

        if (showCursor && this.index === i) {
          let cWidth = textWidth(indexStr);
          const diameter = cWidth > fontSize ? cWidth : fontSize;
          this.P.noFill();
          this.P.circle(cx, cy, diameter * 1.5);
        }
      }

      if (showSkipped && this.swatches[i].skip) {
        this.P.line(xx, yy, xx + width, yy + height);
        this.P.line(xx + width, yy, xx, yy + height);
      }

      xx += vertical ? 0 : width + offset;
      yy += vertical ? height + offset : 0;
    }

    this.P.pop();
    return this;
  }

  /**
   * Return the color indicated by the index passed or the current selected
   * color if no argument is passed.
   *
   * @param {*} ix Color index.
   * @return {p5.Color} A p5.Color object
   * @memberof Palette
   */
  get(ix) {
    // REFACTORED
    if (this.index < 0 || this.index >= this.swatches.length) return null;
    if (isNaN(ix)) return this.swatches[this.index].color;
    if (ix < 0 || ix >= this.swatches.length) throw `There's no color with index ${ix} in the palette`;
    return this.swatches[ix].color;
  }

  /**
   * Return an array containing all colors of this palette.
   *
   * @return {Array} Array of p5.Color objects
   * @memberof Palette
   */
  getColors() {
    // REFACTORED
    const colors = [];
    this.swatches.forEach((swatch) => {
      colors.push(swatch.color);
    });
    return colors;
  }

  getAnalogous() {
    const newColors = [];
    this.swatches.forEach((swatch) => {
      const [c1, c2] = this.#getAnalogousColor(swatch.color);
      newColors.push(c1);
      newColors.push(c2);
    });
    return new Palette(this.P, newColors);
  }

  getComplementary() {
    const newColors = [];
    this.colors.forEach((col) => {
      newColors.push(this.#getComplementary(col));
    });
    return new Palette(this.P, newColors);
  }

  getSplitComplementary() {
    const newColors = [];
    this.colors.forEach((col) => {
      const [s1, s2] = this.#getSplitComplementary(col);
      newColors.push(s1);
      newColors.push(s2);
    });
    return new Palette(this.P, newColors);
  }

  getTriadic() {
    const newColors = [];
    this.colors.forEach((col) => {
      const [t1, t2] = this.#getTriadic(col);
      newColors.push(t1);
      newColors.push(t2);
    });
    return new Palette(this.P, newColors);
  }

  insertGradients(amount = 5, loop = false) {
    const palettes = [];
    for (let i = 0; i < this.size() - 1; i++) {
      const start = this.get(i);
      const end = this.get(i + 1);
      palettes.push(createGradientPalette({ amount, start, end }));
    }
    if (loop) {
      const start = this.get(this.size() - 1);
      const end = this.get(0);
      palettes.push(createGradientPalette({ amount, start, end }));
    }
    this.clear();
    palettes.forEach((pal) => {
      pal.remove(pal.size() - 1);
      this.colors = this.colors.concat(pal.getColors());
    });
    return this;
  }

  lerp(percent) {
    // REFACTORED
    let i = Math.floor(percent * (this.swatches.length - 1));
    if (i < 0) return this.swatches[0].color;
    if (i >= this.swatches.length - 1) return this.swatches[this.swatches.length - 1].color;

    percent = (percent - i / (this.swatches.length - 1)) * (this.swatches.length - 1);
    return color(
      this.swatches[i].color._getRed() + percent * (this.swatches[i + 1].color._getRed() - this.swatches[i].color._getRed()),
      this.swatches[i].color._getGreen() + percent * (this.swatches[i + 1].color._getGreen() - this.swatches[i].color._getGreen()),
      this.swatches[i].color._getBlue() + percent * (this.swatches[i + 1].color._getBlue() - this.swatches[i].color._getBlue())
    );
  }

  lighten() {
    // REFACTORED
    this.P.push();
    this.P.colorMode(HSB);
    for (let i = 0; i < this.size(); i++) {
      const col = this.get(i);
      const lightened = this.P.color(this.P.hue(col), this.P.saturation(col) * 0.9, this.P.brightness(col) * 1.1);
      this.swatches[i].color = lightened;
    }
    this.P.pop();
    return this;
  }

  log(horizontal = true) {
    horizontal ? this.#logHorizontal() : this.#logVertical();
  }

  /**
   * Returns current selected color and moves the cursor index to next position,
   * or zero if it is greater than the number of colors in palette.
   *
   * @return {p5.Color} The color at current cursor index
   * @memberof Palette
   */
  next() {
    for (let i = 0; i < this.swatches.length; i++) {
      const swatch = this.swatches[this.index];
      this.#increaseIndex();
      if (!swatch.skip) {   
        return swatch.color;
      }
    }
    throw "A palette should not have all colors skipped";
  }

  /**
   * Moves the cursor index to the previous position, or to the last one if the
   * previous position is less than zero.
   *
   * @return {p5.Color} The color at the next cursor index
   * @memberof Palette
   */
  previous() {
    // REFACTORED
    if (--this.index < 0) {
      this.index = this.swatches.length - 1;
    }
    return this.swatches[this.index].color;
  }

  random(fn) {
    // REFACTORED
    if (this.swatches.length < 1) return undefined;
    const rnd = fn || this.P.random;
    if (!this.weightedDist.length) this.weightedDist = this.#createWeightedDistribution(this.swatches);
    return this.weightedDist[Math.floor(rnd() * this.weightedDist.length)];
  }

  remove(ix) {
    // REFACTORED
    this.swatches.splice(ix, 1);
    if (this.index >= this.swatches.length) {
      this.index = this.swatches.length - 1;
    }
    return this;
  }

  /**
   * Sets the cursor index to zero, a.k.a. the first color in palette.
   *
   * @return {Palette} The color palette with cursor index set to zero
   * @memberof Palette
   */
  reset() {
    // REFACTORED
    this.index = 0;
    return this;
  }

  /**
   * Reverses the palette's array of colors.
   *
   * @return {Palette} The reversed palette
   * @memberof Palette
   */
  reverse() {
    // REFACTORED
    this.swatches.reverse();
    return this;
  }

  /**
   * Sets current selected color
   *
   * @param {*} ix
   * @return {*}
   * @memberof Palette
   */
  set(ix) {
    // REFACTORED
    if (ix < 0 || ix >= this.swatches.length) return;
    this.index = ix;
    return this;
  }

  /**
   *
   *
   * @param {*} weights
   * @memberof Palette
   */
  setWeights(weights) {
    // REFACTORED
    if (!weights || weights.length != this.swatches.length) throw "Invalid length for weights array";
    for (let i = 0; i < weights.length; i++) {
      this.swatches[i].weight = weights[i];
    }
    this.weightedDist = this.#createWeightedDistribution(this.swatches);
  }

  /**
   * Return the number of colors the palette has.
   *
   * @return {number} Number of colors
   * @memberof Palette
   */
  size() {
    // REFACTORED
    return this.swatches.length;
  }

  /**
   * Shuffle the colors in the palette in a random order.
   *
   * @param {*} fn A random function that can be used instead of Math.random()
   * @return {Palette} The shuffled color palette
   * @memberof Palette
   */
  shuffle(fn) {
    // REFACTORED
    const rnd = fn || this.P.random;
    this.swatches = this.swatches.sort(() => rnd() - 0.5);
    return this;
  }

  skip(index) {
    if (!this.#validIndex(index)) throw "Invalid color index";
    this.swatches[index].skip = true;
  }

  unskip(index) {
    if (!this.#validIndex(index)) throw "Invalid color index";
    this.swatches[index].skip = false;
  }

  unskipAll() {
    this.swatches.forEach((swatch) => (swatch.skip = false));
  }

  /**
   * Sort the palette's colors by brightness.
   *
   * @return {Palette} The ordered color palette
   * @memberof Palette
   */
  sortByBrightness() {
    // REFACTORED
    this.swatches = this.swatches.sort((a, b) => {
      return this.P.brightness(a.color) === this.P.brightness(b.color) ? 0 : this.P.brightness(a.color) > this.P.brightness(b.color) ? 1 : -1;
    });
    return this;
  }

  /**
   * Sort the palette's colors by lightness.
   *
   * @return {Palette} The ordered color palette
   * @memberof Palette
   */
  sortByLightness() {
    // REFACTORED
    this.swatches = this.swatches.sort((a, b) => {
      return this.P.lightness(a.color) === this.P.lightness(b.color) ? 0 : this.P.lightness(a.color) > this.P.lightness(b.color) ? 1 : -1;
    });
    return this;
  }

  /**
   * Sort the palette's colors by saturation.
   *
   * @return {Palette} The ordered color palette
   * @memberof Palette
   */
  sortBySaturation() {
    // REFACTORED
    this.swatches = this.swatches.sort((a, b) => {
      return this.P.saturation(a.color) === this.P.saturation(b.color) ? 0 : this.P.saturation(a.color) > this.P.saturation(b.color) ? 1 : -1;
    });
    return this;
  }

  /**
   * Return an hexadecimal string representation of palette's colors.
   *
   * @return {string} Hexadecimal string representation
   * @memberof Palette
   */
  toHexString() {
    // REFACTORED
    return this.toString().replaceAll("#", "");
  }

  toString(args) {
    // REFACTORED
    const separator = (args && args.separator) || "-";
    const format = (args && args.format) || "#rrggbb";
    let str = "";
    this.swatches.forEach((swatch) => {
      str += swatch.color.toString(format);
      str += separator;
    });
    str = str.slice(0, -1);
    return str;
  }

  #colorsToSwatches(colors) {
    const swatches = [];
    colors.forEach((col) => {
      const swatch = new Swatch(col);
      swatches.push(swatch);
    });
    return swatches;
  }

  #createWeightedDistribution(swatches) {
    // REFACTORED
    const weights = [];
    swatches.forEach((swatch) => {
      weights.push(swatch.weight);
    });
    return [].concat(...swatches.map((swatch, index) => Array(Math.ceil(weights[index] * 100)).fill(swatch.color)));
  }

  #getAnalogousColor(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const c1 = this.P.color((this.P.hue(col) + 330) % 360, this.P.saturation(col), this.P.brightness(col));
    const c2 = this.P.color((this.P.hue(col) + 30) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [c1, c2];
  }

  #getComplementary(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const complementary = this.P.color((this.P.hue(col) + 180) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return complementary;
  }

  #getSplitComplementary(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const c1 = this.P.color((this.P.hue(col) + 150) % 360, this.P.saturation(col), this.P.brightness(col));
    const c2 = this.P.color((this.P.hue(col) + 210) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [c1, c2];
  }

  #getTetradic(col) {}

  #getTriadic(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const c1 = this.P.color((this.P.hue(col) + 120) % 360, this.P.saturation(col), this.P.brightness(col));
    const c2 = this.P.color((this.P.hue(col) + 240) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [c1, c2];
  }

  #increaseIndex() {
    if (++this.index === this.swatches.length) {
      this.index = 0;
    }
  }

  #logHorizontal() {
    // REFACTORED
    let str = "";
    let values = "";
    let args = [];
    for (let i = 0; i < this.size(); i++) {
      str = str + "%c%s";
      const value = this.swatches[i].color.toString("#rrggbb");
      const style = `color: ${value}`;
      args.push(style);
      args.push("■■■■■■■■■");
      values += ` ${value} `;
    }
    console.log(str, ...args);
    console.log(`%c%s`, "color:gray", values);
  }

  #logVertical() {
    // REFACTORED
    this.swatches.forEach((swatch) => {
      const value = swatch.color.toString("#rrggbb");
      const style = `background: #222; color: ${value}`;
      console.log(`%c%s%c %s`, style, "■■■■■■■■■■■■■■■■■■■■", "color:gray", `${value}`);
    });
  }

  #validIndex(index) {
    return !(isNaN(index) || index < 0 || index > this.swatches.length);
  }
}
