/*******************************************************************************************************
 * Функции для работы с интернационализацией (i18n), помогающие с переводом системы на различные языки *
 *******************************************************************************************************/

/**
 * Получаем языковой тег (например: 'ru-RU' или 'en-EN') — строку с тегом по стандарту IETF BCP 47 (IETF BCP +84
 * language tag) желаемого языка.
 *
 * https://en.wikipedia.org/wiki/IETF_language_tag
 *
 * @param language короткий двухбуквенный код языка вида 'en' или 'ru' по стандарту ISO 639-1
 * (https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)
 * @param defaultLocale языковой тег, возвращаемый по умолчанию
 */
export function getBCP47Tag(
  language: string,
  defaultLocale: string = 'en-US'
): string {
  if (typeof language !== 'string') return defaultLocale;

  const localesMap: { [key: string]: string } = {
    en: 'en-US',
    ru: 'ru-RU',
  };

  return localesMap[language] || defaultLocale;
}
