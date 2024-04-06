function invalidValue(name, value) {
  throw new Error(`Invalid ${name} value: ${value}`);
}

/**
 * Clear palettes saved in browser storage.
 *
 * @return {*}
 */
const clearStoredPalettes = () => {
  return this.removeItem(STORAGE_KEY);
};
p5.prototype.clearStoredPalettes = clearStoredPalettes;

/**
 * Create gradient palette
 *
 * @param {*} [{ amount = 5, end = this.color(0), start = this.color(255) }={}]
 * @return {*}
 */
const createGradientPalette = ({ amount = 5, end = this.color(255), start = this.color(0) } = {}) => {
  const colors = [];
  const from = start;
  const to = end;
  let amt = 0;
  for (let i = 0; i < amount - 1; i++) {
    colors.push(this.lerpColor(from, to, amt));
    amt += 1 / amount;
  }
  colors.push(to);
  return this.createPalette(colors);
};
p5.prototype.createGradientPalette = createGradientPalette;

/**
 * Create grayscale palette
 *
 * @param {*} [{ amount = 5, end = 255, start = 0 }={}]
 * @return {*}
 */
const createGrayscalePalette = ({ amount = 5, end = 255, start = 0 } = {}) => {
  if (amount < 2 || amount > 255) invalidValue("amount", amount);
  const from = this.color(start);
  const to = this.color(end);
  return this.createGradientPalette({ amount, end: to, start: from });
};
p5.prototype.createGrayscalePalette = createGrayscalePalette;

/**
 * Create palette
 *
 * @param {*} args
 * @return {*}
 */
const createPalette = (args) => {
  // REFACTORED
  let colors = [];
  if (Array.isArray(args)) {
    colors = args;
  } else if (typeof args === "string" || args instanceof String) {
    args.split("-").forEach((value) => {
      colors.push(this.color(`#${value}`));
    });
  }
  return new Palette(this, colors);
};
p5.prototype.createPalette = createPalette;

/**
 * Create random palette
 *
 * @param {number} num Number of colors in palette
 * @param {function} fn A specific random function
 * @return {Palette} Color palette with random colors
 */
const createRandomPalette = (num, fn) => {
  // TODO: Improve arguments validation
  const total = num || 5;
  const rnd = fn || this.random;
  const colors = [];
  for (let i = 0; i < total; i++) {
    colors.push(this.color(rnd() * 255, rnd() * 255, rnd() * 255));
  }
  return createPalette(colors);
};
p5.prototype.createRandomPalette = createRandomPalette;

/**
 * Export stored palettes
 */
const exportStoredPalettes = () => {
  let contents = "const hexPalettes = [";
  const hexStringsArray = loadStoredHexStrings();
  if (hexStringsArray) {
    hexStringsArray.forEach((value) => {
      contents += `'${value}',`;
    });
    contents = contents.slice(0, -1);
    contents += "];";
    this.saveStrings([contents], "palettes-exported", "js");
  }
};
p5.prototype.exportStoredPalettes = exportStoredPalettes;

/**
 * Load Colormind palette
 *
 * @param {*} successCallback
 * @param {*} failureCallback
 * @return {*}
 */
const _loadColormindPalette = function (successCallback, failureCallback) {
  const data = {
    model: "default",
  };
  const request = new XMLHttpRequest();

  const _paletteFromRequest = (request) => {
    const json = JSON.parse(request.response);
    if (json.result) {
      const palette = this.createPalette();
      json.result.forEach((rgb) => {
        palette.add(this.color(rgb));
      });
      return palette;
    }
    return null;
  };

  let asynchronous = false;
  if (typeof successCallback === "function") {
    asynchronous = true;
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        const palette = _paletteFromRequest(request);
        if (palette) successCallback(palette);
        // EXCEPTION
      } else {
        // EXCEPTION
      }
    };
  }

  request.open("POST", COLORMIND_API_URL, asynchronous); // `false` makes the request synchronous
  request.send(JSON.stringify(data));
  if (request.readyState === 4 && request.status === 200) {
    const palette = _paletteFromRequest(request);
    if (palette) {
      if (typeof this._decrementPreload === "function") {
        this._decrementPreload();
      }
      return palette;
    }
    // EXCEPTION
  } else {
    // EXCEPTION
  }
};
p5.prototype.loadColormindPalette = _loadColormindPalette;
p5.prototype.registerPreloadMethod("loadColormindPalette", p5.prototype);

/**
 * Load ColourLovers palette
 *
 * @param {*} callback
 * @return {*} 
 */
const _loadColourLoversPalette = (callback) => {
  const newPalette = createPalette();
  createPaletteFromColourLoversJsonp(COLOURLOVERS_API_URL + this.random(50)).then((palette) => {
    for (let i = 0; i < palette.size(); i++) {
      const col = palette.get(i);
      newPalette.add(col);
    }
    if (typeof callback === "function") {
      callback(newPalette);
    }
    if (typeof self._decrementPreload === "function") {
      self._decrementPreload();
    }
  });
  return newPalette;
};
p5.prototype.loadColourLoversPalette = _loadColourLoversPalette;
p5.prototype.registerPreloadMethod("loadColourLoversPalette", p5.prototype);

/**
 * Load palettes
 *
 * @param {*} hexStringArray
 * @return {*}
 */
const loadPalettes = (hexStringArray) => {
  if (hexStringArray) {
    const palettes = [];
    hexStringArray.forEach((value) => {
      palettes.push(this.createPalette(value));
    });
    return palettes;
  }
  return null;
};
p5.prototype.loadPalettes = loadPalettes;
/**
 * Load stored palettes.
 *
 * @return {*}
 */
const loadStoredPalettes = () => {
  const hexStringsArray = loadStoredHexStrings();
  if (hexStringsArray) return this.loadPalettes(hexStringsArray);
  return null;
};
p5.prototype.loadStoredPalettes = loadStoredPalettes;

/**
 * Add palette to browser local storage
 *
 * @param {*} palette
 * @return {*}
 */
const storePalette = (palette) => {
  if (!palette || palette.size() < 1) return;
  const str = palette.toHexString();
  let hexStringsArray = loadStoredHexStrings();
  if (!hexStringsArray) {
    hexStringsArray = [];
  }
  hexStringsArray.push(str);
  this.storeItem(STORAGE_KEY, JSON.stringify(hexStringsArray));
};
p5.prototype.storePalette = storePalette;

const createPaletteFromColourLoversJsonp = (url) => {
  return new Promise(function (resolve, reject) {
    httpDo(url, "jsonp", { jsonpCallback: "jsonCallback" }).then((data) => {
      const palette = new Palette(this);
      data[0].colors.forEach((hex) => {
        palette.add(this.color(`#${hex}`));
      });
      resolve(palette);
    });
  });
};

const loadStoredHexStrings = () => {
  const item = getItem(STORAGE_KEY);
  if (item) {
    return JSON.parse(item);
  }
  return null;
};


const COLORMIND_API_URL = "http://colormind.io/api/";
const COLOURLOVERS_API_URL = "http://www.colourlovers.com/api/palettes/top?format=json&numResults=1&resultOffset=";
const STORAGE_KEY = "p5.palette";

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
   * @param {p5.Color|Palette} arg - A Color object or a Palette object
   * @return {Palette} Reference to this palette
   * @memberof Palette
   */
  add(arg) {
    if (!arg) throw new Error("Nothing to add to the palette");

    // If arg is another Palette, iterate through its swatches and add them to this palette
    if (arg instanceof Palette) {
      for (const swatch of arg.swatches) {
        // Clone the swatch to prevent shared references between palettes.
        // Assuming we have a 'clone' method on Swatch to create a deep copy
        this.swatches.push(swatch.clone());
      }
    }
    // If arg is a p5.Color, create a Swatch and add it to the palette
    else if (arg instanceof this.P.Color) {
      this.swatches.push(new Swatch(arg));
    } else {
      throw new Error("The argument must be a p5.Color or a Palette object");
    }

    // Update the index if this is the first swatch being added.
    if (this.swatches.length && this.index < 0) this.index = 0;

    // Return the palette instance to allow method chaining.
    return this;
  }

  /**
   * Enriches each color in the palette by adding two analogous colors,
   * one before and one after, effectively tripling the palette's size.
   *
   * @return {Palette} A reference to this palette, allowing for chained method calls.
   */
  addAnalogousColors() {
    const analogousPalette = this.getAnalogous();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(analogousPalette.get(i * 2));
      newColors.push(this.get(i));
      newColors.push(analogousPalette.get(i * 2 + 1));
    }
    this.swatches = this.#colorsToSwatches(newColors);
    // this.colors = Array.from(newColors); //AQUI
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
    if (this.index < 0 || this.index >= this.swatches.length) return null;
    if (isNaN(ix)) return this.swatches[this.index].color;
    if (ix < 0 || ix >= this.swatches.length) throw new Error(`There's no color with index ${ix} in the palette`);
    return this.swatches[ix].color;
  }

  /**
   * Generates a new Palette instance containing analogous colors for each swatch in the current palette.
   *
   * @return {Palette} A new Palette instance filled with analogous colors for each original swatch.
   */
  getAnalogous() {
    const newColors = [];
    this.swatches.forEach((swatch) => {
      const [analogousColor1, analogousColor2] = this.#getAnalogousColors(swatch.color);
      newColors.push(analogousColor1, analogousColor2);
    });
    return new Palette(this.P, newColors);
  }

  /**
   * Return an array containing all colors of this palette.
   *
   * @return {Array} Array of p5.Color objects
   * @memberof Palette
   */
  getColors() {
    const colors = [];
    this.swatches.forEach((swatch) => {
      colors.push(swatch.color);
    });
    return colors;
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
    if (--this.index < 0) {
      this.index = this.swatches.length - 1;
    }
    return this.swatches[this.index].color;
  }

  random(fn) {
    if (this.swatches.length < 1) return undefined;
    const rnd = fn || this.P.random;
    if (!this.weightedDist.length) this.weightedDist = this.#createWeightedDistribution(this.swatches);
    return this.weightedDist[Math.floor(rnd() * this.weightedDist.length)];
  }

  remove(ix) {
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
    return this.toString().replaceAll("#", "");
  }

  toString(args) {
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

  // PRIVATE METHODS

  #colorsToSwatches(colors) {
    return colors.map((colorValue) => {
      const color = this.P.color(colorValue);
      return new Swatch(color);
    });
  }

  #createWeightedDistribution(swatches) {
    const weights = [];
    swatches.forEach((swatch) => {
      weights.push(swatch.weight);
    });
    return [].concat(...swatches.map((swatch, index) => Array(Math.ceil(weights[index] * 100)).fill(swatch.color)));
  }

  /**
   * Creates and returns an array with two analogous colors of the provided color.
   * Analogous colors are those that are next to each other on the color wheel.
   * This private method is intended to be used internally within the Palette class.
   *
   * @private
   * @param {p5.Color} col - The base color for which to find analogous colors.
   * @return {[p5.Color, p5.Color]} An array containing two p5.Color objects that represent the analogous colors.
   */
  #getAnalogousColors(col) {
    // Save the current drawing state (including the color mode)
    this.P.push();

    // Change the color mode to HSB for easy manipulation of hue
    this.P.colorMode(this.P.HSB);

    // Calculate two analogous colors by adjusting the hue
    // One color is -30 degrees on the color wheel, and the other is +30 degrees
    const baseHue = this.P.hue(col);
    const saturation = this.P.saturation(col);
    const brightness = this.P.brightness(col);
    const c1 = this.P.color((baseHue + 330) % 360, saturation, brightness); // -30 degrees (equivalent to +330 degrees)
    const c2 = this.P.color((baseHue + 30) % 360, saturation, brightness); // +30 degrees

    // Restore the previous drawing state, which restores the previous color mode
    this.P.pop();

    return [c1, c2]; // Return the analogous colors as an array
  }

  /**
   * Calculates and returns the complementary color of the given color.
   * The complementary color is directly across from the base color on the color wheel, which means
   * the hue is adjusted by 180 degrees. This private method is intended to be used internally
   * within the Palette class.
   *
   * @private
   * @param {p5.Color} col - The base color for which to find the complementary color.
   * @return {p5.Color} A p5.Color object that represents the complementary color.
   */
  #getComplementary(col) {
    // Save the current drawing state (including the color mode)
    this.P.push();

    // Change the color mode to HSB for easy manipulation of hue
    this.P.colorMode(this.P.HSB);

    // Calculate the complementary color by adjusting the hue by 180 degrees
    const complementaryHue = (this.P.hue(col) + 180) % 360;
    const complementary = this.P.color(complementaryHue, this.P.saturation(col), this.P.brightness(col));

    // Restore the previous drawing state, which restores the previous color mode
    this.P.pop();

    return complementary; // Return the complementary color
  }

  /**
   * Calculates and returns the two split complementary colors of the given color.
   * A split complementary color scheme consists of the base color, and two colors that are adjacent to its complement.
   * This method is private and intended for internal use within the Palette class.
   *
   * @private
   * @param {p5.Color} col The base color for which to find the split complementary colors.
   * @return {[p5.Color, p5.Color]} An array containing the two p5.Color objects that represent the split complementary colors.
   */
  #getSplitComplementary(col) {
    // Save the current drawing state (including the color mode)
    this.P.push();

    // Change the color mode to HSB to easily adjust the hue value
    this.P.colorMode(this.P.HSB);

    // Calculate two split complementary colors by adjusting the hue by 150 and 210 degrees
    const baseHue = this.P.hue(col);
    const saturation = this.P.saturation(col);
    const brightness = this.P.brightness(col);
    const c1 = this.P.color((baseHue + 150 + 360) % 360, saturation, brightness); // Split complementary color 1
    const c2 = this.P.color((baseHue + 210 + 360) % 360, saturation, brightness); // Split complementary color 2

    // Restore the previous drawing state, which restores the previous color mode
    this.P.pop();

    return [c1, c2]; // Return the split complementary colors in an array
  }

  #getTetradic(col) {}

  /**
   * Calculates and returns the two triadic colors of the provided base color.
   * Triadic colors are evenly spaced around the color wheel, creating a triangle.
   * This method is private and intended for use within the Palette class.
   *
   * @private
   * @param {p5.Color} col - The base color for which to find triadic colors.
   * @return {[p5.Color, p5.Color]} An array containing two p5.Color objects representing the triadic colors.
   */
  #getTriadic(col) {
    // Save the current drawing state (including the color mode)
    this.P.push();

    // Change the color mode to HSB to easily adjust hue
    this.P.colorMode(this.P.HSB);

    // Calculate the triadic colors by rotating the hue by 120 and 240 degrees
    const baseHue = this.P.hue(col);
    const saturation = this.P.saturation(col);
    const brightness = this.P.brightness(col);
    const c1 = this.P.color((baseHue + 120) % 360, saturation, brightness); // Triadic color 1
    const c2 = this.P.color((baseHue + 240) % 360, saturation, brightness); // Triadic color 2

    // Restore the previously saved drawing state to retain color mode
    this.P.pop();

    return [c1, c2]; // Return an array with the calculated triadic colors
  }

  #increaseIndex() {
    if (++this.index === this.swatches.length) {
      this.index = 0;
    }
  }

  /**
   * Outputs a horizontal visual representation of the swatches in the Palette to the browser's console.
   * Each swatch is displayed as a colored block followed by the hex code of the color.
   * This is a private method intended for debugging purposes within the Palette class.
   *
   * @private
   */
  #logHorizontal() {
    let logString = "";
    let colorValues = [];
    let styleArgs = [];

    for (let i = 0; i < this.size(); i++) {
      const colorHex = this.swatches[i].color.toString("#rrggbb");
      const block = "■ ";
      logString += `%c ${block}`;
      styleArgs.push(`color: ${colorHex}`);
      colorValues.push(colorHex);
    }

    // Log the color blocks with the respective styles
    console.log(logString, ...styleArgs);

    // Log the hex values of the colors in gray to differentiate from the colorful blocks
    console.log(`%c${colorValues.join(" ")}`, "color:gray");
  }

  /**
   * Outputs a vertical visual representation of the swatches in the Palette to the browser's console.
   * Each swatch is displayed as a line with a colored block and its hexadecimal code. The block color
   * is set using the background style to clearly represent the color. This method is private and
   * intended for debugging purposes within the Palette class.
   *
   * @private
   */
  #logVertical() {
    this.swatches.forEach((swatch) => {
      const colorHex = swatch.color.toString("#rrggbb");
      // The block's background is colored to represent the swatch color, with text providing the hex code.
      const style = `background: ${colorHex}; color: #222; padding: 0.25em 2em; margin: 2px;`;
      console.log(`%c %s `, style, " "); // Colored block
      console.log(`%c${colorHex}`, "color:gray"); // Hex code in gray
    });
  }

  #validIndex(index) {
    return !(isNaN(index) || index < 0 || index > this.swatches.length);
  }
}


/**
 * Represents a single color swatch within a palette.
 * Each swatch has a color and additional properties that determine its weighting
 * for random selection and whether it should be skipped in certain operations.
 *
 * @class Swatch
 */
class Swatch {
  /**
   * Creates an instance of Swatch.
   *
   * @constructor
   * @param {p5.Color} color - The color associated with this swatch.
   * @param {number} [weight=1] - The weight of the color, used for random selection.
   * @param {boolean} [skip=false] - Whether to skip this color in certain operations.
   * @throws Will throw an error if the `color` parameter is not provided.
   */
  constructor(color, weight = 1, skip = false) {
    if (!color) throw new Error("A swatch needs a color!");
    this.color = color;
    this.weight = weight;
    this.skip = skip;
  }

  /**
   * Creates a deep copy of this swatch.
   *
   * @return {Swatch} A new Swatch instance with the same properties as this swatch.
   */
  clone() {
    const colorCopy = this.color instanceof this.color.constructor ? this.color.toString() : this.color;
    return new Swatch(colorCopy, this.weight, this.skip);
  }
}
