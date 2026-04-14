/**********************************
 * Функции для работы со строками *
 **********************************/

/**
 * Делаем первую букву строки заглавной (переводим первую букву строки в верхний регистр [UPPERCASE]).
 * @param str Строка, первую букву которой хотим сделать заглавной (большой).
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Делаем первую букву строки строчной (переводим первую букву строки в нижний регистр [lowercase]).
 * @param str Строка, первую букву которой хотим сделать строчной (маленькой).
 */
export function uncapitalizeFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * CamelCase -> kebab-case
 *
 * https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
 * @param str
 */
export function camelToKebab(str: string): string {
  return str
    .replace(/\B(?:([A-Z])(?=[a-z]))|(?:(?<=[a-z0-9])([A-Z]))/g, '-$1$2')
    .toLowerCase();
}
