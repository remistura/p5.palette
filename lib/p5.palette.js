/**
 * Color palette
 */
class Palette {
  constructor(P, colors) {
    this.P = P;
    this.colors = colors || [];
    this.index = 0;
  }

  add(color) {
    this.colors.push(color);
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
  }

  addComplementaryColors() {
    const complementary = this.getComplementary();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(this.get(i));
      newColors.push(complementary.get(i));
    }
    this.colors = Array.from(newColors);
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

  clone() {
    const newPalette = this.P.createPalette(this.colors);
    return newPalette;
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
  }

  get(ix) {
    if (ix) return this.colors[ix];
    return this.colors[this.index];
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
  }

  log() {
    this.colors.forEach((col) => {
      const value = col.toString("#rrggbb");
      const style = `background: #222; color: ${value}`;
      console.log(`%c%s%c %s`, style, "■■■■■■■■■■■■■■■■■■■■", "color:gray", `${value}`);
    });
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

  reset() {
    this.index = 0;
  }

  reverse() {
    this.colors.reverse();
  }

  size() {
    return this.colors.length;
  }

  shuffle(func) {
    const rnd = func || Math.random;
    this.colors = this.colors.sort(() => rnd() - 0.5);
  }

  sortByBrightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.brightness(a) === this.P.brightness(b) ? 0 : this.P.brightness(a) > this.P.brightness(b) ? 1 : -1;
    });
  }

  sortByLightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.lightness(a) === this.P.lightness(b) ? 0 : this.P.lightness(a) > this.P.lightness(b) ? 1 : -1;
    });
  }

  sortBySaturation() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.saturation(a) === this.P.saturation(b) ? 0 : this.P.saturation(a) > this.P.saturation(b) ? 1 : -1;
    });
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
}


const COLORMIND_API_URL = "http://colormind.io/api/";
const COLOURLOVERS_API_URL = "http://www.colourlovers.com/api/palettes/random?format=json&numResults=1&resultOffset=";
const STORAGE_KEY = "palettes";

  
  function invalidValue(name, value) {
    throw new Error(`Invalid ${name} value: ${value}`);
  }
  
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
  
  /**
   * Creates a new color palette object
   * @param {*} args
   * @returns Palette
   */
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
  
  /**
   * Load color palette from Colormind API
   *
   * @param {*} successCallback
   * @param {*} failureCallback
   * @returns
   */
  p5.prototype.loadRandomColormindPalette = function (successCallback, failureCallback) {
    const self = this;
    p5.prototype.registerPreloadMethod("loadRandomColormindPaletteSync", p5.prototype);
  
    const data = {
      model: "default",
    };
    const request = new XMLHttpRequest();
  
    const _paletteFromRequest = (request) => {
      const json = JSON.parse(request.response);
      if (json.result) {
        const palette = self.createPalette();
        json.result.forEach((rgb) => {
          palette.add(self.color(rgb));
        });
        return palette;
      }
      return null;
    };
  
    let asynchronous = false;
    if (typeof successCallback === "function") {
      console.log("successCallback is a function!");
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
    console.log(request.status);
    if (request.readyState === 4 && request.status === 200) {
      const palette = _paletteFromRequest(request);
      if (palette) return palette;
      // EXCEPTION
    } else {
      // EXCEPTION
    }
  };
  
  //------------------------------------------------------------------------------
  p5.prototype.loadRandomColourLoversPaletteNew2 = async function (successCallback, failureCallback) {
    p5.prototype.registerPreloadMethod("loadRandomColourLoversPaletteNew2", p5.prototype);
    const self = this;
    let colourPaletteUrl = "http://www.colourlovers.com/api/palettes/random";
    console.log(colourPaletteUrl);
  
    let a = await self.httpDo(colourPaletteUrl, "GET", "jsonp", { jsonpCallback: "jsonCallback" });
    // const request = new XMLHttpRequest();
    // request.open("GET", colourPaletteUrl, false); // `false` makes the request synchronous
    // request.setRequestHeader('Access-Control-Allow-Origin', '*')
    // request.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    // request.send({});
    console.log(a);
    return a[0];
  };
  p5.prototype.loadRandomColourLoversPaletteNew = function (successCallback, failureCallback) {
    p5.prototype.registerPreloadMethod("loadRandomColourLoversPaletteNew", p5.prototype);
  
    const self = this;
    let colourPaletteUrl = "http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=callback";
    console.log(colourPaletteUrl);
  
    let asynchronous = false;
    if (typeof successCallback === "function") {
      console.log("successCallback is a function!");
      asynchronous = true;
    }
  
    let interval;
    let palette;
    let done = false;
    window["callback"] = function (data) {
      if (data) {
        const colors = data[0].colors;
        palette = self.createPalette();
        colors.forEach((hex) => {
          palette.add(self.color(`#${hex}`));
        });
        done = true;
        console.log("Done is true");
      }
    };
  
    interval = window.setInterval(function () {
      console.log("interval");
      console.log(palette);
      if (done) {
        window.clearInterval(interval);
        console.log("Interval cleared");
        if (asynchronous) {
          successCallback(palette);
        } else {
          return palette;
        }
      }
    }, 500);
  
    const script = document.createElement("script");
    script.id = "colourLoversJSONP";
    script.type = "text/javascript";
    script.async = true;
    script.src = colourPaletteUrl;
    document.getElementsByTagName("head")[0].appendChild(script);
  
    let counter = 0;
    while (!done) {
      if (counter++ > 10000) {
        console.log("BREAK");
        break;
      }
      console.log(counter + " waiting");
    }
  };
  //------------------------------------------------------------------------------
  
  p5.prototype.loadRandomColourLoversPalette = function (callback) {
    const P = this;
    let colourPaletteUrl = COLOURLOVERS_API_URL + P.ceil(P.random(50));
    const callbackName = "callback";
    colourPaletteUrl += "&jsonCallback=" + callbackName;
  
    console.log(colourPaletteUrl);
  
    const timeout = 5;
    jsonp(colourPaletteUrl, {
      callbackName,
      timeout,
      onSuccess: function (data) {
        if (data) {
          const elem = document.getElementById("colourLoversJSONP");
          elem.parentNode.removeChild(elem);
          console.log(data[0]);
          const colors = data[0].colors;
          let palette = P.createPalette();
          colors.forEach((hex) => {
            palette.add(P.color(`#${hex}`));
          });
          callback(palette);
        }
      },
      onTimeout: function () {
        console.info(`Timeout: failed to retrieve data from API after ${timeout} seconds. Using local colour palette`);
      },
    });
  };
  
  function jsonp(src, options) {
    const callbackName = options.callbackName || "callback";
    const onSuccess = options.onSuccess || function () {};
    const onTimeout = options.onTimeout || function () {};
    const timeout = options.timeout || 10;
    const timeout_trigger = window.setTimeout(function () {
      window[callbackName] = function () {};
      onTimeout();
    }, timeout * 1000);
  
    window[callbackName] = function (data) {
      window.clearTimeout(timeout_trigger);
      onSuccess(data);
    };
  
    const script = document.createElement("script");
    script.id = "colourLoversJSONP";
    script.type = "text/javascript";
    script.async = true;
    script.src = src;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  
  //------------------------------------------------------------------------------
  
  p5.prototype.storePalette = (palette) => {
    const self = this;
    const str = palette.toHexString();
    let palettesArray = self.loadStoredStrings();
    if (!palettesArray) {
      palettesArray = [];
    }
    palettesArray.push(str);
    self.storeItem(STORAGE_KEY, JSON.stringify(palettesArray));
  };
  
  p5.prototype.loadStoredPalettes = () => {
    const strs = this.loadStoredStrings();
    if (strs) {
      const palettes = [];
      strs.forEach((value) => {
        palettes.push(this.createPalette(value));
      });
      return palettes;
    }
    return null;
  };
  
  p5.prototype.loadStoredStrings = () => {
    let item = getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  };
  
  p5.prototype.clearStoredPalettes = () => {
    this.removeItem(STORAGE_KEY);
  };
  
  p5.prototype.exportStoredPalettes = () => {
    let contents = "const palettes = [";
    const strs = self.loadStoredStrings();
    strs.forEach((value) => {
      contents += `'${value}',`;
    });
    contents = contents.slice(0, -1);
    contents += "];";
    this.saveStrings([contents], "exported-palettes", "js");
  };
  