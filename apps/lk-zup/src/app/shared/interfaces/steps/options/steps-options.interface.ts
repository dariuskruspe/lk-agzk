import { CircleTemplateOptionsInterface } from '@shared/interfaces/steps/options/template/circle/circle-template-options.interface';
import { DefaultTemplateOptionsInterface } from '@shared/interfaces/steps/options/template/default/default-template-options.interface';
import { TimelineTemplateOptionsInterface } from '@shared/interfaces/steps/options/template/timeline/timeline-template-options.interface';

export interface StepsOptionsInterface {
  /**
   * Глобальные параметры цвета элементов компонента отображения шагов.
   */
  color?: {
    /**
     * Цвет активного элемента.
     */
    active?: string;

    /**
     * Цвет подсвеченного элемента.
     */
    highlight?: string;
  };

  /**
   * Текущий шаблон отображения шагов.
   *
   * default (по умолчанию) — шаги отображаются в виде временной шкалы (таймлайна — timeline) горизонтально или
   * вертикально в зависимости от соответствующих значений параметра direction в секции default (основной принцип
   * вёрстки хитро украден из PrimeNG-компонента p-timeline ^_^)
   *
   * circle — отображается кружочек прогресса шагов, вдоль окружности которого происходит заполнение линии прогресса,
   * начиная от верхней центральной точки круга по часовой стрелке, и заканчивая значением, соответствующим прогрессу
   * текущего шага, определяющемуся по отношению его номера к общему количеству шагов. В конечной точке прогресса
   * окружность радиально делится на две части (заполненную и незаполненную) при помощи CSS-функции conic-gradient,
   * в которую для этой цели передаётся значение прогресса в градусах, вычисляемое по формуле:
   * 360 * (номер_шага / количество_шагов). В центре круга указывается текстовое значение прогресса в соответствии с
   * номером текущего активного шага (например, '2 из 4'). При нажатии на кружочек прогресса срабатывает эмиттер
   * progressCircleClicked.
   *
   * timeline — шаги отображаются в виде временной шкалы (таймлайна — timeline) с использованием PrimeNG-компонента
   * p-timeline (горизонтально или вертикально в зависимости от переданного параметра layout в секции timeline)
   */
  currentTemplate?: 'default' | 'circle' | 'timeline';

  /**
   * Параметры отображения шагов в зависимости от выбранного шаблона.
   */
  template?: {
    /**
     * Параметры отображения шагов для шаблона 'default'.
     */
    default?: DefaultTemplateOptionsInterface;

    /**
     * Параметры отображения шагов для шаблона 'timeline'.
     */
    timeline?: TimelineTemplateOptionsInterface;

    /**
     * Параметры отображения шагов для шаблона 'circle'.
     */
    circle?: CircleTemplateOptionsInterface;
  };
}
