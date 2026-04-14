/*******************************
 * Функции для работы с цветом *
 *******************************/

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export const rgbToHex = (r: number, g: number, b: number) =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

/**
 * Функция для получения инвертированного цвета, приятного человеческому глазу.
 *
 * https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
 * @param hex hexadecimal color (строка, содержащая цвет в шестнадцатеричном формате)
 * @param bw (необязательный параметр) инвертировать только в белый или чёрный — так получится больше контраста, что
 * обычно лучше для человеческого глаза.
 */
export function invertHexColor(hex, bw: boolean = false) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  let r: string = String(parseInt(hex.slice(0, 2), 16));
  let g: string = String(parseInt(hex.slice(2, 4), 16));
  let b: string = String(parseInt(hex.slice(4, 6), 16));

  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return Number(r) * 0.299 + Number(g) * 0.587 + Number(b) * 0.114 > 186
      ? '#000000'
      : '#FFFFFF';
  }

  // invert color components
  r = (255 - Number(r)).toString(16);
  g = (255 - Number(g)).toString(16);
  b = (255 - Number(b)).toString(16);

  // pad each with zeros and return
  const padZero = (str, len: number = 2) => {
    const zeros: string = new Array(len).join('0');
    return (zeros + str).slice(-len);
  };
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

// [ChatGPT]:

// Function to convert a color to the RGB format
export function convertToRGB(color: string): string {
  // If color is in hexadecimal format
  if (/^#[0-9A-F]{6}$/i.test(color)) {
    // Convert hex to RGB
    const hex = color.substring(1); // Remove '#' from the beginning
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  // If color is a color keyword
  else {
    // Create a dummy element to apply the color and retrieve the computed RGB value
    const dummyElement = document.createElement('div');
    dummyElement.style.color = color;
    document.body.appendChild(dummyElement); // Append to the document to ensure styles are applied
    const rgbColor = getComputedStyle(dummyElement).color;
    document.body.removeChild(dummyElement); // Clean up the dummy element
    return rgbColor;
  }
}

export function rgb2components(rgbColor: string): number[] {
  const [r, g, b] = rgbColor
    .substring(4, rgbColor.length - 1)
    .split(', ')
    .map(Number);
  return [r, g, b];
}

// Function to invert a color represented as 'rgb(r, g, b)'
export function invertRGB(rgbColor: string): string {
  // Extract RGB values
  const rgbValues = rgbColor.match(/\d+/g).map(Number);
  // Calculate inverted RGB values
  const invertedRgbValues = rgbValues.map((value) => 255 - value);
  // Format the inverted color as 'rgb(r, g, b)'
  return `rgb(${invertedRgbValues.join(', ')})`;
}

// белый/черный в зависимости от яркости цвета
export function getContrastColor(
  hexColor: string,
  colorBlack: string = '#000000',
  colorWhite: string = '#FFFFFF',
): string {
  // Удаляем # если присутствует
  const hex = hexColor.replace('#', '');

  // Конвертируем в RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Вычисляем относительную яркость (формула WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Возвращаем белый текст для темного фона, черный для светлого
  return luminance > 0.5 ? colorBlack : colorWhite;
}
