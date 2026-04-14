import { CommonTemplateOptionsInterface } from '@shared/interfaces/steps/options/template/common/common-template-options.interface';

export interface TimelineTemplateOptionsInterface
  extends CommonTemplateOptionsInterface {
  /**
   * Положение таймлайна относительно контента (шагов).
   * Допустимые значения: 'left', 'right' — для вертикального расположения, 'top', 'bottom' — для горизонтального,
   * 'alternate' — чередовать расположение шагов относительно таймлайна.
   */
  align?: 'left' | 'right' | 'top' | 'bottom' | 'alternate';

  /**
   * Ориентация таймлайна (отвечает за направление отображения шагов).
   */
  layout?: 'vertical' | 'horizontal';

  /**
   * Не отображать противоположную сторону таймлайна.
   *
   * (!) Не рекомендуется использовать совместно с align: 'alternate' (ломает отображение таймлайна)!
   */
  noOpposite?: boolean;
}
