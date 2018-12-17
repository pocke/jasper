export class Color {
  /**
   * calc suite text color with background color.
   * this logic is guessed from github.
   * @param {string} backgroundColor - target background color.
   * @returns {string} text color
   */
  suitTextColor(backgroundColor) {
    const r = parseInt(backgroundColor.substr(0, 2), 16);
    const g = parseInt(backgroundColor.substr(2, 2), 16);
    const b = parseInt(backgroundColor.substr(4, 2), 16);
    if (g >= 240) return '1c2733';

    const colorNum = r * (g - parseInt('66', 16)) * b;
    const mediumColorNum = 1728000; // 0x88 * 0x88 * 0x88
    return colorNum > mediumColorNum ? '1c2733' : 'fff';
  }
}

export default new Color();
