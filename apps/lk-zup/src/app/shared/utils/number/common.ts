/********************************
 * Функции для работы с числами *
 ********************************/

/**
 * Форматируем число в виде строки (number -> string with formatted number) согласно переданному языку.
 *
 * @param n число (например, 1000000)
 * @param locales например, массив языковых тегов (BCP-47 language tags) или один языковой тег в виде строки
 * (см. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#locales)
 * @param options NumberFormatOptions
 * (см. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options)
 * @returns {string} отформатированная строка с числом (например, '1 000 000' для случая с языковым тегом 'ru-RU' и числом 1000000)
 */
export function formatNumber(
  n: number,
  locales: Intl.LocalesArgument = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locales, options).format(n);
}
