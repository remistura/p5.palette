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
    if (palette) return palette;
    // EXCEPTION
  } else {
    // EXCEPTION
  }
};

/**
 * loadRandomColourLoversPalette CLASSIC
 * @param {*} callback
 */
p5.prototype.loadRandomColourLoversPaletteClassic = function (callback) {
  const jsonCallbackName = "callback_" + Date.now();
  const offset = this.ceil(this.random(50));
  const colourPaletteUrl = `${COLOURLOVERS_API_URL}${offset}&jsonCallback=${jsonCallbackName}`;
  const timeout = 5;
  jsonp(colourPaletteUrl, {
    jsonCallbackName,
    timeout,
    onSuccess: function (data) {
      if (data) {
        const elem = document.getElementById("colourLoversJSONP");
        elem.parentNode.removeChild(elem);
        const palette = new Palette(this);
        data[0].colors.forEach((hex) => {
          palette.add(this.color(`#${hex}`));
        });
        callback(palette);
      }
    },
    onTimeout: function () {
      console.info(`Timeout: failed to retrieve data from API after ${timeout} seconds.`);
    },
  });
};

function jsonp(src, options) {
  const callbackName = options.jsonCallbackName || "callback";
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

p5.prototype.loadRandomColourLoversPalette = (callback) => {
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
p5.prototype.registerPreloadMethod("loadRandomColourLoversPalette", p5.prototype);
