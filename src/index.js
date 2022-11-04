  
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
  