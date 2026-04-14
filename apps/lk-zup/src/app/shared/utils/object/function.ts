/**************************************
 * Функции для работы с функциями ^_^ *
 **************************************/

/**
 * Аналог JavaScript-метода bind для привязки контекста (this) и аргументов к функциям (Function.prototype.bind), только
 * аргументы добавляются в конец, а не в начало.
 *
 * @param fn функция
 * @param context контекст (this)
 * @param boundArgs привязываемые аргументы
 */
export function bindAppend(
  fn: (...args: any[]) => any,
  context: any,
  ...boundArgs: any[]
) {
  return function (...args: any[]) {
    return fn.apply(context, [...args, ...boundArgs]);
  };
}
