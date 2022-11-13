/**
 * Color palette
 */
class Palette {
  constructor(P, colors) {
    this.P = P;
    this.colors = colors || [];
    this.index = this.colors.length ? 0 : -1;
    this.weighted = [];
    this.weights = [];
  }

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

  clear() {
    this.colors = [];
    this.index = -1;
    this.weighted = [];
    this.weights = [];
  }

  clone() {
    return this.P.createPalette(this.colors);
  }

  current() {
    return this.colors[this.index];
  }

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

  get(ix) {
    if (ix) return this.colors[ix];
    return this.colors[this.index];
  }

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

  next() {
    if (++this.index === this.colors.length) {
      this.index = 0;
    }
    return this.colors[this.index];
  }

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

  reset() {
    this.index = 0;
    return this;
  }

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

  size() {
    return this.colors.length;
  }

  shuffle(fn) {
    const rnd = fn || this.P.random;
    this.colors = this.colors.sort(() => rnd() - 0.5);
    return this;
  }

  sortByBrightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.brightness(a) === this.P.brightness(b) ? 0 : this.P.brightness(a) > this.P.brightness(b) ? 1 : -1;
    });
    return this;
  }

  sortByLightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.lightness(a) === this.P.lightness(b) ? 0 : this.P.lightness(a) > this.P.lightness(b) ? 1 : -1;
    });
    return this;
  }

  sortBySaturation() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.saturation(a) === this.P.saturation(b) ? 0 : this.P.saturation(a) > this.P.saturation(b) ? 1 : -1;
    });
    return this;
  }

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


const COLORMIND_API_URL = "http://colormind.io/api/";
const COLOURLOVERS_API_URL = "http://www.colourlovers.com/api/palettes/top?format=json&numResults=1&resultOffset=";
const STORAGE_KEY = "palettes";

function invalidValue(name, value) {
  throw new Error(`Invalid ${name} value: ${value}`);
}

p5.prototype.clearStoredPalettes = () => {
  return this.removeItem(STORAGE_KEY);
};

p5.prototype.createGradientPalette = ({ amount = 5, end = this.color(0), start = this.color(255) } = {}) => {
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

p5.prototype.createGrayscalePalette = ({ amount = 5, end = 255, start = 0 } = {}) => {
  if (amount < 2 || amount > 255) invalidValue("amount", amount);
  const from = this.color(start);
  const to = this.color(end);
  return this.createGradientPalette({ amount, end: to, start: from });
};

p5.prototype.createPalette = (args) => {
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

p5.prototype.createRandomPalette = (num, fn) => {
  // TODO: Improve arguments validation
  const total = num || 5;
  const rnd = fn || this.random;
  const colors = [];
  for (let i = 0; i < total; i++) {
    colors.push(this.color(rnd() * 255, rnd() * 255, rnd() * 255));
  }
  return createPalette(colors);
};

p5.prototype.exportStoredPalettes = () => {
  let contents = "const hexPalettes = [";
  const hexStringsArray = loadStoredHexStrings();
  hexStringsArray.forEach((value) => {
    contents += `'${value}',`;
  });
  contents = contents.slice(0, -1);
  contents += "];";
  this.saveStrings([contents], "palettes-exported", "js");
};

p5.prototype.loadColormindPalette = function (successCallback, failureCallback) {
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
p5.prototype.registerPreloadMethod("loadColormindPalette", p5.prototype);

p5.prototype.loadColourLoversPalette = (callback) => {
  const retPalette = createPalette();
  createPaletteFromColourLoversJsonp(COLOURLOVERS_API_URL + this.random(50)).then((palette) => {
    for (let i = 0; i < palette.size(); i++) {
      retPalette.add(palette.get(i));
    }
    if (typeof callback === "function") {
      callback(palette);
    }
    if (typeof self._decrementPreload === "function") {
      self._decrementPreload();
    }
  });
  return retPalette;
};
p5.prototype.registerPreloadMethod("loadColourLoversPalette", p5.prototype);

p5.prototype.loadPalettes = (hexStringArray) => {
  if (hexStringArray) {
    const palettes = [];
    hexStringArray.forEach((value) => {
      palettes.push(this.createPalette(value));
    });
    return palettes;
  }
  return null;
};

p5.prototype.loadStoredPalettes = () => {
  const hexStringsArray = loadStoredHexStrings();
  if (hexStringsArray) return this.loadPalettes(hexStringsArray);
  return null;
};

p5.prototype.storePalette = (palette) => {
  if (!palette || palette.size() < 1) return;
  const str = palette.toHexString();
  let hexStringsArray = loadStoredHexStrings();
  if (!hexStringsArray) {
    hexStringsArray = [];
  }
  hexStringsArray.push(str);
  this.storeItem(STORAGE_KEY, JSON.stringify(hexStringsArray));
};

const createPaletteFromColourLoversJsonp = (url) => {
  return new Promise(function (resolve, reject) {
    httpDo(url, "jsonp", { jsonpCallback: "jsonCallback" }).then((data) => {
      const palette = new Palette(this);
      console.log(data);
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
