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
