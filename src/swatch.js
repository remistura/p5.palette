/**
 * Represents a single color swatch within a palette.
 * Each swatch has a color and additional properties that
 * determine its weighting for random selection and whether
 * it should be skipped in certain operations.
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
}
