export interface FileContentInterface {
  /**
   * Содержимое файла в виде строки в кодировке Base64.
   */
  base64?: string;

  /**
   * Содержимое файла в виде массива байтов Uint8Array, где каждый элемент (байт) представлен целым числом от 0 до 255
   * (8-битное целое без знака).
   */
  uint8Array?: Uint8Array;
}
