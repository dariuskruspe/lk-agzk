import { Injectable } from '@angular/core';
import { StepsOptionsInterface } from '@shared/interfaces/steps/options/steps-options.interface';
import { CommonTemplateOptionsInterface } from '@shared/interfaces/steps/options/template/common/common-template-options.interface';
import { StepOptionsInterface } from '@shared/interfaces/steps/options/template/common/step-options.interface';
import { logDebug } from '@shared/utilits/logger';
import {
  cssPropertiesInitializer,
  getCSSProperties,
  getInheritedCSSProperties,
  isCSSProperty,
} from '@shared/utils/DOM/common';
import { isObject } from '@shared/utils/object/common';
import {
  convertToRGB,
  invertHexColor,
  rgb2components,
  rgbToHex,
} from '@shared/utils/string/color/common';
import { camelToKebab } from '@shared/utils/string/common';

@Injectable()
export class StepsHelperService {
  getMaxPadding(padding: string): string {
    if (!padding?.length) return '0';
    const paddings: number[] = padding.split(' ').map((p) => parseInt(p));
    return Math.max(...paddings) + 'px';
  }

  getStepsStyles(options: StepsOptionsInterface = {}) {
    if (
      !options ||
      !Object.keys(options).length ||
      !options.currentTemplate ||
      !options.template
    ) {
      logDebug(
        `[steps-helper] -> getStepsStyles: no options for styling -> steps not shown, I'm sorry... :'(`,
      );
      return null;
    }

    const { getMaxPadding } = this;
    const { currentTemplate } = options;
    const { step, stepA, stepH } = options.template[currentTemplate];

    const stepsStyles: any = {
      '--active-color': options.color?.active || 'var(--link-color)',
      '--highlight-color': options.color?.highlight || 'var(--link-color)',

      // step-marker

      '--step-marker-width':
        step.marker.style.width ??
        `calc(${getMaxPadding(step.marker.style.padding)} * 2 + ${
          step.marker.icon.style.width
        })`,
      '--stepA-marker-width':
        stepA.marker.style.width ??
        `calc(${getMaxPadding(stepA.marker.style.padding)} * 2 + ${
          stepA.marker.icon.style.width
        })`,
      '--stepH-marker-width':
        stepH.marker.style.width ??
        `calc(${getMaxPadding(stepH.marker.style.padding)} * 2 + ${
          stepH.marker.icon.style.width
        })`,

      '--step-marker-height':
        step.marker.style.height ??
        `calc(${getMaxPadding(step.marker.style.padding)} * 2 + ${
          step.marker.icon.style.height
        })`,
      '--stepA-marker-height':
        stepA.marker.style.height ??
        `calc(${getMaxPadding(stepA.marker.style.padding)} * 2 + ${
          stepA.marker.icon.style.height
        })`,
      '--stepH-marker-height':
        stepH.marker.style.height ??
        `calc(${getMaxPadding(stepH.marker.style.padding)} * 2 + ${
          stepH.marker.icon.style.height
        })`,
    };

    /**
     * Вспомогательная функция-построитель (конструктор) свойств объекта CSS-стилей с ключами в виде своих собственных
     * CSS-свойств (например, --step-marker-border), вычисляемых на основе переданных в компонент отображения
     * шагов параметров, содержащихся в объекте config.
     *
     * @param styleObj целевой объект CSS-стилей
     * @param cssProps массив CSS-свойств (белый список), например ['margin', 'padding', 'backgroundColor']
     * @param config объект конфигурации (параметры отображения шагов), из которого будут браться значения для целевых
     * персонализированных CSS-свойств, при условии, что их ключи совпадают с ключами массива cssProps
     * @param mode режим ('default' - ничего не делать ^_^, 'customCSSProperties' - создать свои собственные
     * CSS-свойства (с ключами вида --step-marker-border) на основе переданного объекта параметров и массива
     * CSS-свойств)
     */
    const stepsStyleConfigBuilder = (
      mode: 'customCSSProperties' | 'default' = 'default',
      styleObj: any = {},
      config: any = {},
      cssProps: string[] = [],
    ): void => {
      switch (mode) {
        case 'customCSSProperties': {
          // Боооооб-строитель — всё построим! Боооооб-строитель — без проблем! ^_^
          const customCSSPropsBuilder = (
            part: any = config,
            prevKeyPath: string = '',
          ): void => {
            for (const [key, value] of Object.entries(part)) {
              // Текущий полный путь к ключу в объекте config.
              const keyPath: string =
                prevKeyPath === '' ? key : `${prevKeyPath}.${key}`;

              // Массив ключей текущего пути
              const pathKeys: string[] = keyPath.split('.');

              // Предыдущий ключ
              const prevKey = pathKeys[pathKeys.length - 2];

              // Если шаблон не соответствует текущему, то сразу переходим к следующему ключу
              if (
                prevKey === 'template' &&
                pathKeys.length === 2 &&
                key !== currentTemplate
              ) {
                continue;
              }

              // если значение является объектом
              if (isObject(value)) {
                // проходим при помощи рекурсии по ключам этого объекта
                customCSSPropsBuilder(value, keyPath);
              } else if (
                cssProps.length
                  ? cssProps.includes(key)
                  : isCSSProperty(camelToKebab(key))
              ) {
                if (prevKey === 'style') {
                  pathKeys.splice(-2, 1);
                }

                if (pathKeys[0] === 'template') {
                  pathKeys.splice(0, 2);
                }

                const styleObjKey: string = `--${pathKeys.join('-')}`;
                styleObj[styleObjKey] = value;
              }
            }
          };

          // вызываем (зовём на помощь) Боба-строителя кастомных CSS-свойств ^_^
          customCSSPropsBuilder();
          break;
        }
        default:
          return;
      }
      return styleObj;
    };

    stepsStyleConfigBuilder('customCSSProperties', stepsStyles, options);

    return stepsStyles;
  }

  /**
   * Получаем настройки по умолчанию по заданной конфигурации (например, шаблону и ориентации отображаемых шагов).
   *
   * Если конфигурация не задана или пуста, то будет возвращена конфигурация по умолчанию.
   *
   * Если в переданной конфигурации отсутствуют параметры, требуемые для определения начального значения каких-либо
   * параметров дефолтной конфигурации (например, отсутствует параметр currentTemplate), то для таких параметров
   * будет использовано значение по умолчанию.
   * @param config конфигурация (опции), содержащая параметры отображения шагов
   * @private
   */
  getDefaultOptionsByConfig(
    config: StepsOptionsInterface = {},
  ): StepsOptionsInterface {
    const currentTemplate = config?.currentTemplate || 'default';
    const layout: 'vertical' | 'horizontal' =
      currentTemplate === 'circle'
        ? null
        : config?.template?.[currentTemplate]?.layout || 'horizontal';

    /* Styles */

    // выбираем только те CSS-свойства, которые могут нам понадобиться для стилизации элементов компонента отображения шагов
    const cssProperties: string[] = getCSSProperties({ frequentOnly: true });

    // наследуемые CSS-свойства (выбираем только те, которые нам могут нам понадобиться для стилизации элементов компонента отображения шагов)
    const inheritedCSSProperties: string[] = getInheritedCSSProperties({
      frequentOnly: true,
    });

    // const cssPropertiesObj: Partial<CSSStyleDeclaration> =
    //   cssPropertiesInitializer(cssProperties, 'initial');
    const cssPropertiesWhiteListObj: Partial<CSSStyleDeclaration> =
      cssPropertiesInitializer(cssProperties, 'initial');
    const inheritedCSSPropertiesObj: Partial<CSSStyleDeclaration> =
      cssPropertiesInitializer(inheritedCSSProperties, 'inherit');

    // Общие CSS-объявления стилей (отступы, граница, размеры, цвета и т. п.)
    const commonStyle: Partial<CSSStyleDeclaration> = {
      ...cssPropertiesWhiteListObj,
      ...inheritedCSSPropertiesObj,
    };

    // Margin

    const stepDividerMargin: string = '10px';
    const stepContentMargin: string = '0';

    // Padding

    const stepMarkerPadding: string = '10px';
    const stepContentPadding: string =
      layout === 'vertical' ? '0 16px 16px' : '8px 0 16px';
    const stepLabelPadding: string = layout === 'vertical' ? '5px 0' : '5px';

    // Border

    const stepMarkerBorderRadius: string = '50%';
    const stepLabelBorderRadius: string = '4px';

    // Width

    const stepMarkerIconWidth: string = '16px';
    const stepDividerWidth: string = layout === 'vertical' ? '2px' : '100%';
    const stepLabelWidth: string = '90px'; // достаточно, чтобы содержать надпись "Шаг 9999" или "Step 9999"

    // Height

    const stepMarkerIconHeight: string = '16px';
    const stepDividerHeight: string = layout === 'vertical' ? '100%' : '2px';

    // Font size

    const stepMarkerIconFontSize: string = '16px';

    // Background

    // old (v): background: repeating-linear-gradient(var(--gray), var(--gray) 20%, transparent 20%, transparent 40%);
    // old (h): background: repeating-linear-gradient(90deg, var(--gray), var(--gray) 10%, transparent 10%, transparent 15%);
    const stepDividerBackground: string =
      layout === 'vertical'
        ? 'repeating-linear-gradient(var(--gray), var(--gray) 7px, transparent 7px, transparent 11px)'
        : 'repeating-linear-gradient(90deg, var(--gray), var(--gray) 7px, transparent 7px, transparent 11px)';

    // Colors

    const activeColor: string = config.color?.active || 'var(--link-color)';
    const activeColorRGB: string = convertToRGB(activeColor);
    const activeColorRGBComponents: number[] = rgb2components(activeColorRGB);
    const activeColorInverted: string = invertHexColor(
      rgbToHex.apply(null, activeColorRGBComponents),
    );
    const activeColorInvertedBW: string = invertHexColor(
      rgbToHex.apply(null, activeColorRGBComponents),
      true,
    );

    const highlightColor: string =
      config.color?.highlight || 'var(--link-color)';
    const highlightColorRGB: string = convertToRGB(highlightColor);
    const highlightColorRGBComponents: number[] =
      rgb2components(highlightColorRGB);
    const highlightColorInverted: string = invertHexColor(
      rgbToHex.apply(null, highlightColorRGBComponents),
    );
    const highlightColorInvertedBW: string = invertHexColor(
      rgbToHex.apply(null, highlightColorRGBComponents),
      true,
    );

    const grayColor: string = 'var(--gray)';
    const textColor: string = 'var(--text-color)';
    const textSecondaryColor: string = grayColor;

    const commonTemplateOptions: CommonTemplateOptionsInterface = {
      // step by step, пока от монитора не ослеп ^-^ (обычный шаг, не являющийся ни активным, ни подсвеченным)
      step: {
        // [Секция таймлайна, соответствующая шагу — блок, содержащий маркер шага + линию до следующего шага при наличии]
        // step -> timeline
        timeline: {
          style: {
            ...commonStyle,
          },
        },

        // [Содержимое шага — блок, содержащий метку шага (например, "Шаг 1") + название шага + описание шага]
        // step -> content
        content: {
          style: {
            ...commonStyle,
            margin: stepContentMargin,
            padding: stepContentPadding,
          },
        },

        // [Элементы секции таймлайна, соответствующей шагу]

        // [Маркер шага]
        // step -> marker
        marker: {
          style: {
            ...commonStyle,
            border: `2px dashed ${grayColor}`,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: grayColor,
            borderRadius: stepMarkerBorderRadius,
            padding: stepMarkerPadding,
            width: null, // по умолчанию вычисляется по ширине иконки и padding маркера (см. getStepsStyles)
            height: null, // по умолчанию вычисляется по высоте иконки и padding маркера (см. getStepsStyles)
          },

          // [Иконка маркера шага]
          // step -> marker -> icon
          icon: {
            show: true,
            style: {
              ...commonStyle,
              width: stepMarkerIconWidth,
              height: stepMarkerIconHeight,
              fontSize: stepMarkerIconFontSize,
              color: '#CADDFD',
            },
          },
        },

        // [Линия после маркера шага, ведущая к следующему шагу]
        // step -> divider
        divider: {
          style: {
            ...commonStyle,
            margin: stepDividerMargin,
            width: stepDividerWidth,
            height: stepDividerHeight,
            background: stepDividerBackground,
            color: grayColor,
          },
        },

        // [Метка шага (например, "Шаг 1")]
        // step -> label
        label: {
          style: {
            ...commonStyle,
            border: `2px dashed ${grayColor}`,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: grayColor,
            borderRadius: stepLabelBorderRadius,
            padding: stepLabelPadding,
            minWidth: 'var(--step-marker-width)', // для выравнивания по маркеру при горизонтальном расположении таймлайна
            width: stepLabelWidth,
            height: 'var(--step-marker-height)', // для выравнивания по маркеру при вертикальном расположении таймлайна
            color: grayColor,
          },
        },

        // [Название шага]
        // step -> title
        title: {
          style: {
            ...commonStyle,
            color: textColor,
          },
        },

        // [Описание шага]
        // step -> description
        description: {
          style: {
            ...commonStyle,
            color: textSecondaryColor,
          },
        },
      },

      // Стёпа ^-^ (активный шаг)
      stepA: {
        // [Секция таймлайна, соответствующая шагу — блок, содержащий маркер шага + линию до следующего шага при наличии]
        // stepA -> timeline
        timeline: {
          style: {
            ...commonStyle,
          },
        },

        // [Содержимое шага — блок, содержащий метку шага (например, "Шаг 1") + название шага + описание шага]
        // stepA -> content
        content: {
          style: {
            ...commonStyle,
            margin: stepContentMargin,
            padding: stepContentPadding,
          },
        },

        // [Элементы секции таймлайна, соответствующей шагу]

        // [Маркер шага]
        // stepA -> marker
        marker: {
          style: {
            ...commonStyle,
            border: `2px solid ${activeColor}`,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: activeColor,
            borderRadius: stepMarkerBorderRadius,
            padding: stepMarkerPadding,
            width: null, // по умолчанию вычисляется по ширине иконки и padding маркера (см. getStepsStyles)
            height: null, // по умолчанию вычисляется по высоте иконки и padding маркера (см. getStepsStyles)
            backgroundColor: activeColor,
            color: activeColor,
          },

          // [Иконка маркера шага]
          // stepA -> marker -> icon
          icon: {
            show: true,
            style: {
              ...commonStyle,
              width: stepMarkerIconWidth,
              height: stepMarkerIconHeight,
              fontSize: stepMarkerIconFontSize,
              color:
                activeColorInvertedBW === '#000000'
                  ? 'var(--dark-blue)'
                  : 'white',
            },
          },
        },

        // [Линия после маркера шага, ведущая к следующему шагу]
        // stepA -> divider
        divider: {
          style: {
            ...commonStyle,
            margin: stepDividerMargin,
            width: stepDividerWidth,
            height: stepDividerHeight,
            background: stepDividerBackground,
          },
        },

        // [Метка шага (например, "Шаг 1")]
        // stepA -> label
        label: {
          style: {
            ...commonStyle,
            border: `2px solid ${activeColor}`,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: activeColor,
            borderRadius: stepLabelBorderRadius,
            padding: stepLabelPadding,
            backgroundColor: activeColor,
            minWidth: 'var(--step-marker-width)', // для выравнивания по маркеру при горизонтальном расположении таймлайна
            width: stepLabelWidth,
            height: 'var(--step-marker-height)', // для выравнивания по маркеру при вертикальном расположении таймлайна
            color:
              activeColorInvertedBW === '#000000'
                ? 'var(--dark-blue)'
                : 'white',
          },
        },

        // [Название шага]
        // stepA -> title
        title: {
          style: {
            ...commonStyle,
            color: textColor,
          },
        },

        // [Описание шага]
        // stepA -> description
        description: {
          style: {
            ...commonStyle,
            color: textSecondaryColor,
          },
        },
      },

      // Степашка ^-^ (подсвеченный шаг)
      stepH: {
        // [Секция таймлайна, соответствующая шагу — блок, содержащий маркер шага + линию до следующего шага при наличии]
        // stepH -> timeline
        timeline: {
          style: {
            ...commonStyle,
          },
        },

        // [Содержимое шага — блок, содержащий метку шага (например, "Шаг 1") + название шага + описание шага]
        // stepH -> content
        content: {
          style: {
            ...commonStyle,
            margin: stepContentMargin,
            padding: stepContentPadding,
          },
        },

        // [Элементы секции таймлайна, соответствующей шагу]

        // [Маркер шага]
        // stepH -> marker
        marker: {
          style: {
            ...commonStyle,
            border: `2px solid ${highlightColor}`,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: highlightColor,
            borderRadius: stepMarkerBorderRadius,
            padding: stepMarkerPadding,
            width: null, // по умолчанию вычисляется по ширине иконки и padding маркера (см. getStepsStyles)
            height: null, // по умолчанию вычисляется по высоте иконки и padding маркера (см. getStepsStyles)
            color: highlightColor,
          },

          // [Иконка маркера шага]
          // stepH -> marker -> icon
          icon: {
            show: true,
            style: {
              ...commonStyle,
              width: stepMarkerIconWidth,
              height: stepMarkerIconHeight,
              fontSize: stepMarkerIconFontSize,
              color: highlightColor,
            },
          },
        },

        // [Линия после маркера шага, ведущая к следующему шагу]
        // stepH -> divider
        divider: {
          style: {
            ...commonStyle,
            width: stepDividerWidth,
            height: stepDividerHeight,
            margin: stepDividerMargin,
            color: highlightColor,
            backgroundColor: highlightColor,
          },
        },

        // [Метка шага (например, "Шаг 1")]
        // stepH -> label
        label: {
          style: {
            ...commonStyle,
            border: `2px solid ${highlightColor}`,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: highlightColor,
            borderRadius: stepLabelBorderRadius,
            padding: stepLabelPadding,
            minWidth: 'var(--step-marker-width)', // для выравнивания по маркеру при горизонтальном расположении таймлайна
            width: stepLabelWidth,
            height: 'var(--step-marker-height)', // для выравнивания по маркеру при вертикальном расположении таймлайна
            color: highlightColor,
          },
        },

        // [Название шага]
        // stepH -> title
        title: {
          style: {
            ...commonStyle,
            color: textColor,
          },
        },

        // [Описание шага]
        // stepH -> description
        description: {
          style: {
            ...commonStyle,
            color: textSecondaryColor,
          },
        },
      },
    };

    return {
      color: {
        active: activeColor,
        highlight: highlightColor,
      },

      currentTemplate: 'default',

      template: {
        default: {
          ...(window.structuredClone
            ? structuredClone(commonTemplateOptions)
            : JSON.parse(JSON.stringify(commonTemplateOptions))),
          layout: 'horizontal',
        },

        timeline: {
          ...(window.structuredClone
            ? structuredClone(commonTemplateOptions)
            : JSON.parse(JSON.stringify(commonTemplateOptions))),
          layout: 'horizontal',
          noOpposite: true,
        },

        circle: {
          ...(window.structuredClone
            ? structuredClone(commonTemplateOptions)
            : JSON.parse(JSON.stringify(commonTemplateOptions))),
        },
      },
    } as StepsOptionsInterface;
  }

  // TODO: подумать как упростить этого чудовища Франкенштейна, чтобы не бояться передавать параметры прямо в шаблоне ^_^
  // TODO: как минимум стоит добавить глобальные параметры step, управляющие сразу всеми типами шагов
  // TODO: (активный, подсвеченный [пройденный], обычный [ни тот, ни другой])
  /**
   * Начальная конфигурация опций для привязки в шаблоне компонента, в котором используется app-steps (можно
   * использовать её как готовый набор начальных опций (заготовку), чтобы не писать каждый раз заново для тех случаев,
   * когда не нужна особенная кастомизация стилей).
   */
  initialOptions(
    currentTemplate: StepsOptionsInterface['currentTemplate'] = 'default',
    markerIconSize: string = '16px',
  ): StepsOptionsInterface {
    const stepOptions: StepOptionsInterface = {
      marker: {
        icon: {
          style: {
            width: `${markerIconSize}`,
            height: `${markerIconSize}`,
            fontSize: `${markerIconSize}`,
          },
        },
      },
    };

    return {
      currentTemplate,
      // Пример изменения глобальных цветов элементов
      // color: {
      //   active: 'var(--yellow-500)', // https://primeng.org/colors
      //   highlight: 'var(--green-500)', // https://primeng.org/colors
      // },
      template: {
        [currentTemplate]: {
          layout: 'horizontal',
          step: stepOptions,
          stepA: window.structuredClone
            ? structuredClone(stepOptions)
            : JSON.parse(JSON.stringify(stepOptions)),
          stepH: window.structuredClone
            ? structuredClone(stepOptions)
            : JSON.parse(JSON.stringify(stepOptions)),
        },
      },
    };
  }
}
