/**********************************
 * Функции для работы с объектами *
 **********************************/

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

/**
 * Проверяем, является ли переданный аргумент объектом.
 */
export function isObject(candidate: any): boolean {
  return (
    typeof candidate == 'object' &&
    candidate instanceof Object &&
    !(candidate instanceof Array) &&
    typeof candidate !== 'function'
  );
}

/**
 * Построитель (конструктор) конфигураций (свойств объектов), предназначенный для заполнения отсутствующих свойств в
 * объекте переданной конфигурации за счёт их подтягивания (копирования) из объекта дефолтной конфигурации.
 *
 * [TL;DR] Внутренние объекты заполняются аналогично через рекурсию ^_^, а массивы просто копируются (по ссылке).
 *
 * Если среди свойств любого уровня вложенности дефолтного объекта конфигурации встречается такое свойство, тип значения
 * которого не является примитивным (например, объект или массив), то конфигурация такого составного свойства (объекта),
 * содержащего внутри себя коллекцию других свойств, заполняется исходя из типа свойства. В случае массива будет
 * происходить простое копирование значения свойства, в то время как для объекта конфигурация будет заполняться
 * аналогичными образом при помощи рекурсивного вызова вспомогательной функции cfgBuilder с передачей этого объекта в
 * качестве аргумента, соответствующего параметру config.
 *
 * TODO: для массивов не всё так однозначно, поэтому можно задать настраиваемое через options поведение (по умолчанию
 *       копировать его целиком только в том случае, если в нём содержатся лишь примитивные значения, а в противном
 *       случае проходить рекурсией по объектам массива)
 *
 * @param config кастомный конфиг
 * @param defaultConfig дефолтный конфиг
 * @param options (необязательный параметр) опции, содержащие примитивные типы и массив ключей, которые нужно пропускать
 * (не нужно обрабатывать)
 */
export function configBuilder(
  config: any,
  defaultConfig: any,
  options: { primitiveTypes?: string[]; skipKeys?: string[] } = {
    primitiveTypes: ['boolean', 'number', 'string', 'null'],
    skipKeys: [],
  },
): void {
  const primitiveTypes: string[] = ['boolean', 'number', 'string', 'null'];
  if (!options) {
    options = { primitiveTypes, skipKeys: [] };
  } else {
    if (!options?.primitiveTypes) {
      options.primitiveTypes = primitiveTypes;
    }

    if (!options?.skipKeys) {
      options.skipKeys = [];
    }
  }

  const isPrimitive = (candidate: any) =>
    options.primitiveTypes.includes(typeof candidate);
  const isArray = (candidate: any) => Array.isArray(candidate);

  /**
   * Вспомогательная функция, заполняющая недостающие параметры переданной конфигурации значениями по умолчанию.
   * @param part текущая часть дефолтного конфига (например: объект, находящийся внутри defaultConfig), из которой
   * берём отсутствующие в соответствующей части переданной конфигурации данные
   * @param prevKeyPath предыдущий полный путь к ключу родительского свойства в объекте defaultConfig дефолтной
   * конфигурации, использующийся в качестве основы при составлении полного пути к текущему ключу
   */
  const cfgBuilder = (
    part: any = defaultConfig,
    prevKeyPath: string = '',
  ): void => {
    for (const [key, defaultValue] of Object.entries(part)) {
      // Если ключ не нужно обрабатывать, то сразу переходим к следующему
      if (options.skipKeys.includes(key)) continue;

      // Текущий полный путь к ключу в объекте defaultConfig.
      const keyPath: string =
        prevKeyPath === '' ? key : `${prevKeyPath}.${key}`;

      // если значение в дефолтном конфиге является примитивом или массивом
      if (isPrimitive(defaultValue) || isArray(defaultValue)) {
        // если значение, являющееся примитивом или массивом в дефолтном конфиге, задано в переданном конфиге — используем его
        const matchedValue = get(config, keyPath);
        if (typeof matchedValue !== 'undefined') continue;

        // если значение, являющееся примитивом или массивом в дефолтном конфиге, не задано в переданном конфиге — берём его из дефолтного
        set(config, keyPath, defaultValue);
        continue;
      }

      // если значение не задано в переданном конфиге, но в дефолтном конфиге оно является объектом
      if (isObject(defaultValue)) {
        // если в дефолтном конфиге объект пуст, то сразу используем это значение ({}) для переданного конфига
        if (isEmpty(defaultValue)) {
          set(config, keyPath, defaultValue);
          continue;
        }

        // иначе проходим рекурсией по ключам этого объекта
        cfgBuilder(defaultValue, keyPath);
      }
    }
  };

  // запускаем построитель опций
  cfgBuilder();
}
