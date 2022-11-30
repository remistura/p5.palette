/**
 * This class represents a color palette, which is a container for p5.Color
 * objects that has a cursor that points to one currently selected color.
 *
 * @class Palette
 */
class Palette {
  constructor(P, colors) {
    this.P = P;
    this.colors = colors || [];
    this.index = this.colors.length ? 0 : -1;
    this.weighted = [];
    this.weights = [];
  }

  /**
   * Add one color or all colors from an existing palette to this palette.
   *
   * @param {p5.Color|Palette} arg A Color object or a Palette object
   * @return {Palette} Reference to this palette.
   * @memberof Palette
   */
  add(arg) {
    if (arg instanceof Palette) {
      for (let i = 0; i < arg.size(); i++) {
        this.colors.push(arg.get(i));
      }
    } else {
      this.colors.push(arg);
    }
    return this;
  }

  /**
   * Adds two analogous colors for each color of this palette, inserting them
   * before and after the corresponding color index.
   *
   * @return {Palette} Reference to this palette.
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
   * @return {Palette} Reference to this palette.
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
    this.colors = [];
    this.index = -1;
    this.weighted = [];
    this.weights = [];
  }

  /**
   * Return a Palette object containing the same colors as this palette.
   *
   * @return {Palette} A cloned palette.
   * @memberof Palette
   */
  clone() {
    return this.P.createPalette(this.colors);
  }

  /**
   * Returns the current color selected by the cursor index.
   *
   * @return {p5.Color} A p5.Color object.
   * @memberof Palette
   */
  current() {
    return this.colors[this.index];
  }

  /**
   * Darkens all colors of this palette.
   *
   * @return {Palette} The palette with darkened colors.
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
   * @return {Palette} The palette with darkened colors.
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
      vertical = false,
      width = 50,
      x = 0,
      y = 0,
    } = props;
    this.P.push();
    this.P.noStroke();
    let xx = x;
    let yy = y;
    let total = this.colors.length;

    for (let i = 0; i < total; i++) {
      const col = this.colors[i];

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
   * @return {p5.Color} A p5.Color object.
   * @memberof Palette
   */
  get(ix) {
    if (ix) return this.colors[ix];
    return this.colors[this.index];
  }

  /**
   * Return an array containing all colors of this palette.
   *
   * @return {Array} Array of p5.Color objects.
   * @memberof Palette
   */
  getColors() {
    return this.colors;
  }

  getAnalogous() {
    const newColors = [];
    this.colors.forEach((col) => {
      const [a1, a2] = this.#getAnalogous(col);
      newColors.push(a1);
      newColors.push(a2);
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
    let i = Math.floor(percent * (this.colors.length - 1));
    if (i < 0) return this.colors[0];
    if (i >= this.colors.length - 1) return this.colors[this.colors.length - 1];

    percent = (percent - i / (this.colors.length - 1)) * (this.colors.length - 1);
    return color(
      this.colors[i]._getRed() + percent * (this.colors[i + 1]._getRed() - this.colors[i]._getRed()),
      this.colors[i]._getGreen() + percent * (this.colors[i + 1]._getGreen() - this.colors[i]._getGreen()),
      this.colors[i]._getBlue() + percent * (this.colors[i + 1]._getBlue() - this.colors[i]._getBlue())
    );
  }

  lighten() {
    this.P.push();
    this.P.colorMode(HSB);
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      const col = this.get(i);
      newColors.push(this.P.color(this.P.hue(col), this.P.saturation(col) * 0.9, this.P.brightness(col) * 1.1));
    }
    this.colors = Array.from(newColors);
    this.P.pop();
    return this;
  }

  log(horizontal = true) {
    horizontal ? this.#logHorizontal() : this.#logVertical();
  }

  /**
   * Moves the cursor index to the next position, or zero if the next position
   * is greater than the size of the color palette.
   *
   * @return {p5.Color} The color at the next cursor index.
   * @memberof Palette
   */
  next() {
    if (++this.index === this.colors.length) {
      this.index = 0;
    }
    return this.colors[this.index];
  }

  /**
   * Moves the cursor index to the previous position, or to the last one if the 
   * previous position is less than zero.
   *
   * @return {p5.Color} The color at the next cursor index.
   * @memberof Palette
   */
  previous() {
    if (--this.index < 0) {
      this.index = this.colors.length - 1;
    }
    return this.colors[this.index];
  }

  random(fn) {
    if (this.colors.length < 1) return undefined;
    const rnd = fn || this.P.random;
    if (this.weights.length === 0) {
      this.setWeights(new Array(this.colors.length).fill(1));
    }
    return this.weighted[Math.floor(rnd() * this.weighted.length)];
  }

  remove(ix) {
    this.colors.splice(ix, 1);
    if (this.index >= this.colors.length) {
      this.index = this.colors.length - 1;
    }
    return this;
  }

  /**
   * Sets the cursor index to zero, a.k.a. the first color in palette.
   *
   * @return {Palette} The color palette with cursor index set to zero.
   * @memberof Palette
   */
  reset() {
    this.index = 0;
    return this;
  }

  /**
   * Reverses the palette's array of colors.
   *
   * @return {Palette} The reversed palette.
   * @memberof Palette
   */
  reverse() {
    this.colors.reverse();
    return this;
  }

  set(ix) {
    if (ix < 0 || ix >= this.colors.length) return;
    this.index = ix;
    return this;
  }

  setWeights(weights) {
    this.weights = weights;
    this.weighted = this.#weight(this.colors);
  }

  /**
   * Return the number of colors the palette has.
   *
   * @return {number} Number of colors.
   * @memberof Palette
   */
  size() {
    return this.colors.length;
  }

  /**
   * Shuffle the colors in the palette in a random order.
   *
   * @param {*} fn A random function that can be used instead of Math.random().
   * @return {Palette} The shuffled color palette.
   * @memberof Palette
   */
  shuffle(fn) {
    const rnd = fn || this.P.random;
    this.colors = this.colors.sort(() => rnd() - 0.5);
    return this;
  }

  /**
   * Sort the palette's colors by brightness.
   *
   * @return {Palette} The ordered color palette.
   * @memberof Palette
   */
  sortByBrightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.brightness(a) === this.P.brightness(b) ? 0 : this.P.brightness(a) > this.P.brightness(b) ? 1 : -1;
    });
    return this;
  }

  /**
   * Sort the palette's colors by lightness.
   *
   * @return {Palette} The ordered color palette.
   * @memberof Palette
   */
  sortByLightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.lightness(a) === this.P.lightness(b) ? 0 : this.P.lightness(a) > this.P.lightness(b) ? 1 : -1;
    });
    return this;
  }

  /**
   * Sort the palette's colors by saturation.
   *
   * @return {Palette} The ordered color palette.
   * @memberof Palette
   */
  sortBySaturation() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.saturation(a) === this.P.saturation(b) ? 0 : this.P.saturation(a) > this.P.saturation(b) ? 1 : -1;
    });
    return this;
  }

  /**
   * Return an hexadecimal string representation of palette's colors.
   *
   * @return {string} Hexadecimal string representation.
   * @memberof Palette
   */
  toHexString() {
    return this.toString().replaceAll("#", "");
  }

  toString(args) {
    const separator = (args && args.separator) || "-";
    const format = (args && args.format) || "#rrggbb";
    let str = "";
    this.colors.forEach((color) => {
      str += color.toString(format);
      str += separator;
    });
    str = str.slice(0, -1);
    return str;
  }

  #getAnalogous(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const a1 = this.P.color((this.P.hue(col) + 330) % 360, this.P.saturation(col), this.P.brightness(col));
    const a2 = this.P.color((this.P.hue(col) + 30) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [a1, a2];
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
    const s1 = this.P.color((this.P.hue(col) + 150) % 360, this.P.saturation(col), this.P.brightness(col));
    const s2 = this.P.color((this.P.hue(col) + 210) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [s1, s2];
  }

  #getTetradic(col) {}

  #getTriadic(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const t1 = this.P.color((this.P.hue(col) + 120) % 360, this.P.saturation(col), this.P.brightness(col));
    const t2 = this.P.color((this.P.hue(col) + 240) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [t1, t2];
  }

  #logHorizontal() {
    let str = "";
    let values = "";
    let args = [];
    for (let i = 0; i < this.size(); i++) {
      str = str + "%c%s";
      let col = this.colors[i];
      const value = col.toString("#rrggbb");
      const style = `color: ${value}`;
      args.push(style);
      args.push("■■■■■■■■■");
      values += ` ${value} `;
    }
    console.log(str, ...args);
    console.log(`%c%s`, "color:gray", values);
  }

  #logVertical() {
    this.colors.forEach((col) => {
      const value = col.toString("#rrggbb");
      const style = `background: #222; color: ${value}`;
      console.log(`%c%s%c %s`, style, "■■■■■■■■■■■■■■■■■■■■", "color:gray", `${value}`);
    });
  }

  #weight(arr) {
    return [].concat(...arr.map((col, index) => Array(Math.ceil(this.weights[index] * 100)).fill(col)));
  }
}
