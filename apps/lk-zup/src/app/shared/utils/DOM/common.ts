import { GetAncestorsOptionsInterface } from '@shared/utils/DOM/interfaces/common/get-ancestors-options.interface';

/****************************************************
 * Функции для работы с DOM (Document Object Model) *
 ****************************************************/

/**
 * Очищаем (снимаем) выделение текста.
 */
export function clearSelection(): void {
  const selection: Selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
}

/**
 * Получаем массив предков (всех родительских элементов) переданного HTML-элемента.
 *
 * @param el HTML-элемент, для которого ищем предков
 * @param options (необязательный параметр) опции
 */
export function getAncestors(
  el: HTMLElement,
  options?: GetAncestorsOptionsInterface
): HTMLElement[] {
  let ancestors: HTMLElement[] = [];
  let currentAncestor: HTMLElement = el?.parentElement;
  const stopElementClass: string = options?.stopElementClass;

  /**
   * Вспомогательная функция для определения стоп-элемента по CSS-классу.
   *
   * @param a элемент-предок, претендующий на звание стоп-элемента ^_^
   */
  const isStopElement = (a: HTMLElement) =>
    a.classList.contains(stopElementClass);

  // Если переданный элемент сам по себе является стоп-элементом, то выводим пустой массив предков.
  if (stopElementClass && isStopElement(el)) return ancestors;

  while (currentAncestor) {
    ancestors = [...ancestors, currentAncestor];

    // Проверяем, не пора ли остановиться в поиске предков.
    if (stopElementClass && isStopElement(currentAncestor)) break;

    // Устанавливаем нового текущего (по отношению к следующей итерации) предка.
    currentAncestor = currentAncestor.parentElement;
  }

  return options?.useReverse ? ancestors.reverse() : ancestors;
}

/**
 * Проверяем, видно ли элемент в области просмотра (viewport) веб-страницы.
 * https://www.30secondsofcode.org/js/s/element-is-visible-in-viewport/
 *
 * @param el элемент
 * @param partiallyVisible считать ли видимым элемент в случае, когда его видно частично (не полностью)
 */
export function elementIsVisibleInViewport(
  el: Element,
  partiallyVisible: boolean = false
): boolean {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;

  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
}

/**
 * Инициализируем переданные CSS-свойства указанным значением.
 *
 * @param cssProps массив CSS-свойств (например: ['margin', 'padding'])
 * @param value желаемое значение, которым будут проинициализированы переданные свойства
 */
export function cssPropertiesInitializer(
  cssProps: string[],
  value: string = 'initial'
): Partial<CSSStyleDeclaration> {
  return cssProps.reduce((obj: Partial<CSSStyleDeclaration>, prop: string) => {
    obj[prop] = value;
    return obj;
  }, {});
}

/**
 * Получаем список наследуемых (inherited) CSS-свойств.
 *
 * @param options (необязательный параметр) опции
 */
export function getInheritedCSSProperties(
  options: any = { frequentOnly: false }
): string[] {
  if (options?.frequentOnly) {
    // Массив часто используемых на практике наследуемых CSS-свойства.
    const frequentOnly: string[] = [
      'borderCollapse',
      'borderSpacing',
      'color',
      'cursor',
      'fontFamily',
      'fontSize',
      'fontStyle',
      'fontVariant',
      'fontWeight',
      'font',
      'letterSpacing',
      'lineHeight',
      'listStyleImage',
      'listStylePosition',
      'listStyleType',
      'listStyle',
      'textAlign',
      'textIndent',
      'textTransform',
      'visibility',
      'whiteSpace',
      'wordSpacing',
    ];

    return frequentOnly;
  }

  const all: string[] = [
    'azimuth',
    'borderCollapse',
    'borderSpacing',
    'captionSide',
    'color',
    'cursor',
    'direction',
    'elevation',
    'emptyCells',
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'font',
    'letterSpacing',
    'lineHeight',
    'listStyleImage',
    'listStylePosition',
    'listStyleType',
    'listStyle',
    'orphans',
    'pitchRange',
    'pitch',
    'quotes',
    'richness',
    'speakHeader',
    'speakNumeral',
    'speakPunctuation',
    'speak',
    'speechRate',
    'stress',
    'textAlign',
    'textIndent',
    'textTransform',
    'visibility',
    'voiceFamily',
    'volume',
    'whiteSpace',
    'widows',
    'wordSpacing',
  ];

  return all;
}

/**
 * Получаем список всех CSS-свойств, поддерживаемых браузером, на котором запущено приложение.
 *
 * @param options (необязательный параметр) опции
 */
export function getCSSProperties(
  options: any = { frequentOnly: false }
): string[] {
  if (!options?.frequentOnly) {
    // [ChatGPT]:
    // Создаём фиктивный элемент
    const dummyElement = document.createElement('div');

    // Получаем свойства стиля элемента
    const styleProperties: string[] = Object.keys(dummyElement.style);
    return styleProperties;
  }

  // Массив часто используемых на практике CSS-свойств.
  const frequentOnly: string[] = [
    'display',
    'visibility', // inherited (наследуемое)
    'position',
    'top',
    'right',
    'bottom',
    'left',

    'cursor', // inherited (наследуемое)

    'alignContent',
    'alignItems',
    'alignSelf',
    'justifyContent',
    'justifyContent',
    'justifyItems',
    'justifySelf',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'flexDirection',
    'flexFlow',

    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',

    'border',
    'borderWidth',
    'borderStyle',
    'borderColor',
    'borderCollapse', // inherited (наследуемое)
    'borderSpacing', // inherited (наследуемое)
    'borderRadius',

    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    'minWidth',
    'width',
    'maxWidth',

    'minHeight',
    'height',
    'maxHeight',

    'font', // inherited (наследуемое)
    'fontStyle', // inherited (наследуемое)
    'fontVariant', // inherited (наследуемое)
    'fontWeight', // inherited (наследуемое)
    'fontStretch', // inherited (наследуемое)
    'fontSize', // inherited (наследуемое)
    'fontFamily', // inherited (наследуемое)
    'letterSpacing', // inherited (наследуемое)
    'lineHeight', // inherited (наследуемое)

    'hyphens', // inherited (наследуемое)
    'whiteSpace', // inherited (наследуемое)

    'background',
    'backgroundColor',
    'color', // inherited (наследуемое)

    'listStyleImage', // inherited (наследуемое)
    'listStylePosition', // inherited (наследуемое)
    'listStyleType', // inherited (наследуемое)
    'listStyle', // inherited (наследуемое)

    'textAlign', // inherited (наследуемое)
    'textIndent', // inherited (наследуемое)
    'textTransform', // inherited (наследуемое)

    'whiteSpace', // inherited (наследуемое)
    'wordSpacing', // inherited (наследуемое)
  ];

  return frequentOnly;
}

// [ChatGPT]:

/**
 * Проверяем, является ли переданная строка CSS-свойством.
 *
 * @param prop строка, претендующая на звание CSS-свойства ^_^
 */
export function isCSSProperty(prop: string): boolean {
  const { style } = document.createElement('div');
  try {
    style.setProperty(prop, 'initial');
  } catch (e) {
    return false; // Invalid CSS property will throw an error
  }
  return style[prop] !== ''; // Check if the property is now set
}
